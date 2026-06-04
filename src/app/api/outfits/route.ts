import { type NextRequest, NextResponse } from "next/server";
import { getOpenAI, buildOutfitPrompt } from "@/lib/openai";
import { createClient } from "@/lib/supabase/server";
import type { GenerateOutfitsRequest } from "@/types";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: GenerateOutfitsRequest = await request.json();
    const { style, occasion, season } = body;

    if (!style) {
      return NextResponse.json({ error: "Style is required" }, { status: 400 });
    }

    // Load wardrobe
    const { data: wardrobeItems, error: wardrobeError } = await supabase
      .from("wardrobe_items")
      .select("id, category, subcategory, colors, formality, fit, style_tags, suitable_styles, image_url")
      .eq("user_id", user.id);

    if (wardrobeError) {
      return NextResponse.json({ error: "Failed to load wardrobe" }, { status: 500 });
    }

    if (!wardrobeItems || wardrobeItems.length === 0) {
      return NextResponse.json(
        { error: "Your wardrobe is empty. Upload some clothes first!" },
        { status: 400 }
      );
    }

    const wardrobeJson = JSON.stringify(wardrobeItems, null, 2);
    const prompt = buildOutfitPrompt(style, wardrobeJson, occasion, season);

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = completion.choices[0].message.content ?? "[]";
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    const outfitsData = JSON.parse(cleaned);

    // Save outfits to DB
    const savedOutfits = [];
    for (const outfit of outfitsData) {
      const { data: saved, error } = await supabase
        .from("outfits")
        .insert({
          user_id: user.id,
          style,
          occasion: occasion ?? null,
          season: season ?? null,
          outfit_name: outfit.outfit_name,
          items: outfit.items ?? [],
          style_score: outfit.style_score ?? 0,
          overall_tip: outfit.overall_tip ?? "",
          missing_items: outfit.missing_items ?? [],
          is_favorite: false,
        })
        .select()
        .single();

      if (!error && saved) {
        savedOutfits.push(saved);
      }
    }

    return NextResponse.json({ outfits: savedOutfits });
  } catch (err) {
    console.error("Outfit generation error:", err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const favoritesOnly = searchParams.get("favorites") === "true";

  let query = supabase
    .from("outfits")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (favoritesOnly) {
    query = query.eq("is_favorite", true);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ outfits: data });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, is_favorite } = await request.json();

  const { data, error } = await supabase
    .from("outfits")
    .update({ is_favorite })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ outfit: data });
}
