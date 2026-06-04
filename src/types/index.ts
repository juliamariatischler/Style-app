export type SubscriptionTier = "free" | "pro";

export type WardrobeCategory =
  | "tops"
  | "bottoms"
  | "outerwear"
  | "shoes"
  | "accessories"
  | "dress"
  | "suit";

export type Formality = "casual" | "smart-casual" | "formal";
export type Fit = "slim" | "regular" | "oversized" | "fitted";

export type StyleName =
  | "Old Money"
  | "Clean Girl"
  | "Dark Academia"
  | "Streetwear"
  | "Y2K"
  | "Coastal Grandmother"
  | "Mob Wife"
  | "Quiet Luxury"
  | "Minimalist"
  | "Classy"
  | "Custom";

export type Occasion =
  | "Casual"
  | "Work"
  | "Date Night"
  | "Party"
  | "Event"
  | "Sport";

export type Season = "Spring" | "Summer" | "Autumn" | "Winter" | "All Seasons";

export type BudgetTier = "€" | "€€" | "€€€";

export interface ColorInfo {
  name: string;
  hex: string;
}

export interface WardrobeItem {
  id: string;
  user_id: string;
  image_url: string;
  category: WardrobeCategory;
  subcategory: string;
  colors: ColorInfo[];
  formality: Formality;
  fit: Fit;
  style_tags: string[];
  suitable_styles: string[];
  user_notes: string | null;
  created_at: string;
}

export interface OutfitItem {
  item_id: string;
  styling_note: string;
}

export interface MissingItem {
  category: string;
  description: string;
  reason: string;
}

export interface Outfit {
  id: string;
  user_id: string;
  style: StyleName;
  occasion: Occasion | null;
  season: Season | null;
  outfit_name: string;
  items: OutfitItem[];
  style_score: number;
  overall_tip: string;
  missing_items: MissingItem[];
  is_favorite: boolean;
  created_at: string;
}

export interface ShoppingSuggestion {
  id: string;
  outfit_id: string;
  missing_category: string;
  missing_description: string;
  product_title: string;
  price: string;
  price_tier: BudgetTier;
  shop_name: string;
  product_url: string;
  image_url: string;
  created_at: string;
}

export interface GenerateOutfitsRequest {
  style: StyleName;
  occasion?: Occasion;
  season?: Season;
}

export interface GenerateOutfitsResponse {
  outfits: Outfit[];
  suggestions: ShoppingSuggestion[];
}

export interface ClassifyResponse {
  category: WardrobeCategory;
  subcategory: string;
  colors: ColorInfo[];
  formality: Formality;
  fit: Fit;
  style_tags: string[];
  suitable_styles: string[];
}

export interface StyleOption {
  name: StyleName;
  description: string;
  keywords: string[];
  referenceEmoji: string;
  palette: string[];
}

export const STYLE_OPTIONS: StyleOption[] = [
  {
    name: "Old Money",
    description: "Timeless, understated luxury. Polo shirts, blazers, loafers.",
    keywords: ["classic", "preppy", "refined", "heritage"],
    referenceEmoji: "🏛️",
    palette: ["#f5f0e8", "#c9a96e", "#2c3e50"],
  },
  {
    name: "Clean Girl",
    description: "Effortlessly polished minimalism. Neutral tones, sleek silhouettes.",
    keywords: ["minimal", "polished", "neutral", "sleek"],
    referenceEmoji: "✨",
    palette: ["#faf9f7", "#e8e4df", "#1a1a1a"],
  },
  {
    name: "Dark Academia",
    description: "Intellectual romanticism. Tweed, turtlenecks, vintage books.",
    keywords: ["vintage", "intellectual", "moody", "literary"],
    referenceEmoji: "📚",
    palette: ["#2c2416", "#6b5a3e", "#c4a882"],
  },
  {
    name: "Streetwear",
    description: "Urban cool. Hoodies, sneakers, statement pieces.",
    keywords: ["urban", "casual", "bold", "sporty"],
    referenceEmoji: "🏙️",
    palette: ["#1a1a1a", "#ffffff", "#ff4500"],
  },
  {
    name: "Y2K",
    description: "Nostalgic 2000s vibes. Low-rise, metallics, butterflies.",
    keywords: ["retro", "playful", "metallic", "nostalgia"],
    referenceEmoji: "💿",
    palette: ["#ff85c0", "#b8e4ff", "#c9ff85"],
  },
  {
    name: "Coastal Grandmother",
    description: "Relaxed seaside elegance. Linen, soft hues, organic textures.",
    keywords: ["linen", "relaxed", "coastal", "natural"],
    referenceEmoji: "🌊",
    palette: ["#e8f4f8", "#7fb5b5", "#f5e6d3"],
  },
  {
    name: "Mob Wife",
    description: "Unapologetic glamour. Faux fur, bold prints, statement jewelry.",
    keywords: ["bold", "glamorous", "maximalist", "opulent"],
    referenceEmoji: "🐆",
    palette: ["#1a1a1a", "#8b0000", "#c9a96e"],
  },
  {
    name: "Quiet Luxury",
    description: "Logo-free sophistication. Quality fabrics, muted palette.",
    keywords: ["understated", "premium", "logoless", "sophisticated"],
    referenceEmoji: "🤍",
    palette: ["#f0ede8", "#d4cfc9", "#6b6560"],
  },
  {
    name: "Minimalist",
    description: "Less is more. Clean lines, monochrome, architectural shapes.",
    keywords: ["clean", "simple", "monochrome", "structured"],
    referenceEmoji: "⬜",
    palette: ["#ffffff", "#f0f0f0", "#1a1a1a"],
  },
  {
    name: "Classy",
    description: "Polished elegance for any occasion. Timeless and confident.",
    keywords: ["elegant", "polished", "timeless", "confident"],
    referenceEmoji: "💎",
    palette: ["#1a1a2e", "#c9a96e", "#f5f0e8"],
  },
];
