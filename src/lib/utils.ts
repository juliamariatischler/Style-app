import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: string): string {
  return price;
}

export function getPriceTier(price: string): "€" | "€€" | "€€€" {
  const num = parseFloat(price.replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return "€€";
  if (num < 50) return "€";
  if (num < 150) return "€€";
  return "€€€";
}

export function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    tops: "Tops",
    bottoms: "Bottoms",
    outerwear: "Outerwear",
    shoes: "Shoes",
    accessories: "Accessories",
    dress: "Dresses",
    suit: "Suits",
  };
  return map[category] ?? category;
}

export function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}
