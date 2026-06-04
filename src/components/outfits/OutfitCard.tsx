"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import type { Outfit, WardrobeItem } from "@/types";
import { cn } from "@/lib/utils";

interface OutfitCardProps {
  outfit: Outfit;
  wardrobeItems: WardrobeItem[];
  onFavoriteToggle: (id: string, isFav: boolean) => void;
  onShopMissing: () => void;
}

function ScoreRing({ score }: { score: number }) {
  const size = 48;
  const stroke = 4;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color =
    score >= 80 ? "#4a7c59" : score >= 60 ? "#c9a96e" : "#b5403a";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold" style={{ color }}>
          {score}
        </span>
      </div>
    </div>
  );
}

export function OutfitCard({
  outfit,
  wardrobeItems,
  onFavoriteToggle,
  onShopMissing,
}: OutfitCardProps) {
  const [isFav, setIsFav] = useState(outfit.is_favorite);
  const [toggling, setToggling] = useState(false);
  const { showToast } = useToast();

  const outfitItems = outfit.items
    .map((oi) => ({
      item: wardrobeItems.find((w) => w.id === oi.item_id),
      note: oi.styling_note,
    }))
    .filter((oi) => oi.item !== undefined);

  async function handleFavorite() {
    setToggling(true);
    try {
      const res = await fetch("/api/outfits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: outfit.id, is_favorite: !isFav }),
      });
      if (!res.ok) throw new Error();
      setIsFav(!isFav);
      onFavoriteToggle(outfit.id, !isFav);
      showToast(
        !isFav ? "Zu Favoriten hinzugefügt" : "Von Favoriten entfernt",
        "success"
      );
    } catch {
      showToast("Fehler beim Speichern", "error");
    } finally {
      setToggling(false);
    }
  }

  return (
    <div className="rounded-3xl bg-[var(--panel)] border border-[var(--border)] overflow-hidden">
      {/* Flatlay grid */}
      <div className="p-3">
        <div
          className={cn(
            "grid gap-2",
            outfitItems.length <= 2 ? "grid-cols-2" :
            outfitItems.length === 3 ? "grid-cols-3" :
            "grid-cols-2"
          )}
        >
          {outfitItems.slice(0, 4).map(({ item, note }, i) => (
            <div
              key={i}
              className={cn(
                "relative rounded-xl overflow-hidden bg-[var(--panel-strong)]",
                outfitItems.length === 3 && i === 2 ? "aspect-video" : "aspect-square",
                outfitItems.length === 4 && "aspect-square"
              )}
            >
              {item && (
                <Image
                  src={item.image_url}
                  alt={item.subcategory}
                  fill
                  sizes="150px"
                  className="object-cover"
                />
              )}
              {note && (
                <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 bg-black/50 backdrop-blur-sm">
                  <p className="text-white text-[9px] line-clamp-1">{note}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pb-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm">{outfit.outfit_name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Star size={11} className="text-[var(--accent)] fill-[var(--accent)]" />
              <span className="text-xs text-[var(--muted)]">{outfit.style} Look</span>
            </div>
          </div>
          <ScoreRing score={outfit.style_score} />
        </div>

        {/* Styling tip */}
        <div className="rounded-xl bg-[var(--background)] px-3 py-2.5 border border-[var(--border)]">
          <p className="text-xs text-[var(--muted)] leading-relaxed">{outfit.overall_tip}</p>
        </div>

        {/* Missing items alert */}
        {outfit.missing_items.length > 0 && (
          <button
            onClick={onShopMissing}
            className="w-full flex items-center gap-2 rounded-xl bg-[var(--accent-light)] border border-[var(--accent)]/30 px-3 py-2 text-left"
          >
            <ShoppingBag size={14} className="text-[var(--accent-dark)] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[var(--accent-dark)]">
                {outfit.missing_items.length} Teil{outfit.missing_items.length !== 1 ? "e" : ""} fehlen
              </p>
              <p className="text-[10px] text-[var(--muted)] truncate">
                {outfit.missing_items[0].description}
              </p>
            </div>
            <span className="text-xs text-[var(--accent-dark)] font-medium">Shop →</span>
          </button>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleFavorite}
            disabled={toggling}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-xl h-10 text-sm font-medium border transition-all",
              isFav
                ? "bg-[var(--accent-light)] border-[var(--accent)]/40 text-[var(--accent-dark)]"
                : "bg-[var(--panel-strong)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            <Heart
              size={15}
              className={cn(isFav && "fill-[var(--accent-dark)]")}
            />
            {isFav ? "Gespeichert" : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}
