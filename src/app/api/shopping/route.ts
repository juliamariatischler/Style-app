import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildShoppingQuery } from "@/lib/openai";
import { getPriceTier } from "@/lib/utils";

interface SerpApiResult {
  title: string;
  price: string;
  source: string;
  link: string;
  thumbnail: string;
}

async function searchSerpApi(query: string): Promise<SerpApiResult[]> {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) return getMockResults(query);

  const params = new URLSearchParams({
    engine: "google_shopping",
    q: query,
    api_key: apiKey,
    gl: "de",
    hl: "de",
    num: "5",
  });

  const res = await fetch(`https://serpapi.com/search?${params}`);
  if (!res.ok) return getMockResults(query);

  const data = await res.json();
  return (data.shopping_results ?? []).slice(0, 5).map((r: Record<string, string>) => ({
    title: r.title,
    price: r.price,
    source: r.source,
    link: r.link,
    thumbnail: r.thumbnail,
  }));
}

function getMockResults(query: string): SerpApiResult[] {
  const styles = [
    {
      title: `Elegantes Oberteil — ${query.split(" ").slice(0, 3).join(" ")}`,
      price: "€49,95",
      source: "Zara",
      link: "https://www.zara.com",
      thumbnail: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400",
    },
    {
      title: `Premium Piece — ${query.split(" ").slice(0, 2).join(" ")}`,
      price: "€89,00",
      source: "& Other Stories",
      link: "https://www.stories.com",
      thumbnail: "https://images.unsplash.com/photo-1594938298603-c8148c4a8f7e?w=400",
    },
    {
      title: `Fashion Essential`,
      price: "€29,99",
      source: "H&M",
      link: "https://www.hm.com",
      thumbnail: "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=400",
    },
  ];
  return styles;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { outfit_id, missing_items, style } = await request.json();

    if (!missing_items || missing_items.length === 0) {
      return NextResponse.json({ suggestions: [] });
    }

    const allSuggestions = [];

    for (const item of missing_items.slice(0, 3)) {
      const query = buildShoppingQuery(item.description, style);
      const results = await searchSerpApi(query);

      for (const result of results.slice(0, 3)) {
        const priceTier = getPriceTier(result.price);
        const { data: suggestion } = await supabase
          .from("shopping_suggestions")
          .insert({
            outfit_id: outfit_id ?? null,
            user_id: user.id,
            missing_category: item.category,
            missing_description: item.description,
            product_title: result.title,
            price: result.price,
            price_tier: priceTier,
            shop_name: result.source,
            product_url: result.link,
            image_url: result.thumbnail,
          })
          .select()
          .single();

        if (suggestion) allSuggestions.push(suggestion);
      }
    }

    return NextResponse.json({ suggestions: allSuggestions });
  } catch (err) {
    console.error("Shopping search error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const outfitId = searchParams.get("outfit_id");
  const priceTier = searchParams.get("price_tier");

  let query = supabase
    .from("shopping_suggestions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (outfitId) query = query.eq("outfit_id", outfitId);
  if (priceTier) query = query.eq("price_tier", priceTier);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ suggestions: data });
}
