import OpenAI from "openai";

export function getOpenAI(): OpenAI {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? "" });
}

export const CLASSIFY_PROMPT = `Analyze this clothing image and return a JSON object with:
{
  "category": "tops" | "bottoms" | "outerwear" | "shoes" | "accessories" | "dress" | "suit",
  "subcategory": string,
  "colors": [{ "name": string, "hex": string }],
  "formality": "casual" | "smart-casual" | "formal",
  "fit": "slim" | "regular" | "oversized" | "fitted",
  "style_tags": string[],
  "suitable_styles": string[]
}
Return ONLY valid JSON. No explanation.`;

export function buildOutfitPrompt(
  style: string,
  wardrobeJson: string,
  occasion?: string,
  season?: string
): string {
  return `You are a professional fashion stylist specializing in ${style}.

The user has the following wardrobe items:
${wardrobeJson}

Create 3 complete outfits that embody the ${style} aesthetic.
Occasion: ${occasion ?? "Casual"}
Season: ${season ?? "All Seasons"}

For each outfit return a JSON object:
{
  "outfit_name": string,
  "items": [{ "item_id": string, "styling_note": string }],
  "style_score": number,
  "overall_tip": string,
  "missing_items": [{ "category": string, "description": string, "reason": string }]
}

Rules:
- Only use items from the provided wardrobe (use their exact IDs)
- Prioritize cohesion and style accuracy over using many items
- style_score must be 0-100
- If a complete outfit for this style is impossible, list missing_items
- Return ONLY a valid JSON array of 3 outfit objects. No explanation.`;
}

export function buildShoppingQuery(
  description: string,
  style: string
): string {
  return `${description} ${style} style outfit fashion buy online`;
}
