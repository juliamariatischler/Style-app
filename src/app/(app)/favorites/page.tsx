"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { OutfitCard } from "@/components/outfits/OutfitCard";
import { Button } from "@/components/ui/button";
import { PageSpinner } from "@/components/ui/spinner";
import { useAppStore } from "@/store/useAppStore";
import type { Outfit } from "@/types";
import { cn } from "@/lib/utils";
import type { StyleName } from "@/types";

const STYLE_FILTERS = ["Alle", "Old Money", "Clean Girl", "Dark Academia", "Streetwear", "Y2K", "Quiet Luxury", "Minimalist"];

export default function FavoritesPage() {
  const router = useRouter();
  const { wardrobeItems, setWardrobeItems } = useAppStore();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStyle, setActiveStyle] = useState("Alle");

  useEffect(() => {
    async function load() {
      try {
        const [outfitsRes, wardrobeRes] = await Promise.all([
          fetch("/api/outfits?favorites=true"),
          wardrobeItems.length === 0 ? fetch("/api/wardrobe") : Promise.resolve(null),
        ]);

        const { outfits: favs } = await outfitsRes.json();
        setOutfits(favs ?? []);

        if (wardrobeRes) {
          const { items } = await wardrobeRes.json();
          setWardrobeItems(items ?? []);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered =
    activeStyle === "Alle"
      ? outfits
      : outfits.filter((o) => o.style === activeStyle);

  return (
    <>
      <TopBar title="Favoriten" />

      {/* Style filter */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        {STYLE_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setActiveStyle(s)}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              activeStyle === s
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "bg-[var(--panel)] text-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="px-4 pb-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <PageSpinner />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[var(--panel)] flex items-center justify-center">
              <Heart size={32} className="text-[var(--muted)]" />
            </div>
            <div>
              <p className="font-medium">Noch keine Favoriten</p>
              <p className="text-sm text-[var(--muted)] mt-1">
                Generiere Outfits und speichere deine Lieblings-Looks
              </p>
            </div>
            <Button onClick={() => router.push("/style")}>
              Outfit generieren
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((outfit) => (
              <OutfitCard
                key={outfit.id}
                outfit={outfit}
                wardrobeItems={wardrobeItems}
                onFavoriteToggle={(id, fav) => {
                  if (!fav) setOutfits((prev) => prev.filter((o) => o.id !== id));
                }}
                onShopMissing={() => router.push("/shopping")}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
