import { type NextRequest, NextResponse } from "next/server";
import { getOpenAI, CLASSIFY_PROMPT } from "@/lib/openai";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to Supabase Storage
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("wardrobe")
      .upload(path, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("wardrobe").getPublicUrl(path);

    // Convert file to base64 for OpenAI Vision
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Classify with OpenAI Vision
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: CLASSIFY_PROMPT },
            { type: "image_url", image_url: { url: dataUrl, detail: "low" } },
          ],
        },
      ],
    });

    const raw = completion.choices[0].message.content ?? "{}";
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    const classification = JSON.parse(cleaned);

    // Save to wardrobe_items
    const { data: item, error: dbError } = await supabase
      .from("wardrobe_items")
      .insert({
        user_id: user.id,
        image_url: publicUrl,
        category: classification.category ?? "tops",
        subcategory: classification.subcategory ?? "",
        colors: classification.colors ?? [],
        formality: classification.formality ?? "casual",
        fit: classification.fit ?? "regular",
        style_tags: classification.style_tags ?? [],
        suitable_styles: classification.suitable_styles ?? [],
        user_notes: null,
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB insert error:", dbError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ item });
  } catch (err) {
    console.error("Classify error:", err);
    return NextResponse.json({ error: "Classification failed" }, { status: 500 });
  }
}
