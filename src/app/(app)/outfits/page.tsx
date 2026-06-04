"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, RefreshCw } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { OutfitCard } from "@/components/outfits/OutfitCard";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAppStore } from "@/store/useAppStore";
import type { Outfit, WardrobeItem } from "@/types";

const LOADING_MESSAGES = [
  "KI stylt deinen Look...",
  "Analysiere deinen Kleiderschrank...",
  "Kombiniere Outfits...",
  "Prüfe Stil-Kompatibilität...",
  "Fast fertig...",
];

export default function OutfitsPage() {
  const router = useRouter();
  const {
    wardrobeItems,
    setWardrobeItems,
    selectedStyle,
    selectedOccasion,
    selectedSeason,
    generatedOutfits,
    setGeneratedOutfits,
    isGenerating,
    setIsGenerating,
  } = useAppStore();

  const [error, setError] = useState("");
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const hasGenerated = useRef(false);

  // Cycle loading messages
  useEffect(() => {
    if (!isGenerating) return;
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[i]);
    }, 2000);
    return () => clearInterval(interval);
  }, [isGenerating]);

  async function generate() {
    if (!selectedStyle) {
      router.push("/style");
      return;
    }

    setIsGenerating(true);
    setError("");
    setGeneratedOutfits([]);

    // Ensure wardrobe is loaded
    let items: WardrobeItem[] = wardrobeItems;
    if (items.length === 0) {
      const res = await fetch("/api/wardrobe");
      const data = await res.json();
      items = data.items ?? [];
      setWardrobeItems(items);
    }

    try {
      const res = await fetch("/api/outfits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          style: selectedStyle,
          occasion: selectedOccasion,
          season: selectedSeason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Fehler bei der Generierung");
      } else {
        setGeneratedOutfits(data.outfits ?? []);
      }
    } catch {
      setError("Verbindungsfehler. Bitte erneut versuchen.");
    } finally {
      setIsGenerating(false);
    }
  }

  useEffect(() => {
    if (!hasGenerated.current && selectedStyle && generatedOutfits.length === 0) {
      hasGenerated.current = true;
      generate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleShopMissing(outfit: Outfit) {
    if (!outfit.missing_items.length) return;
    try {
      await fetch("/api/shopping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outfit_id: outfit.id,
          missing_items: outfit.missing_items,
          style: selectedStyle,
        }),
      });
      router.push("/shopping");
    } catch {
      router.push("/shopping");
    }
  }

  return (
    <>
      <TopBar
        title={selectedStyle ? `${selectedStyle} Outfits` : "Outfits"}
        showBack
        right={
          !isGenerating && generatedOutfits.length > 0 ? (
            <button
              onClick={generate}
              className="p-1.5 rounded-full hover:bg-[var(--panel)] text-[var(--muted)] transition-colors"
            >
              <RefreshCw size={18} />
            </button>
          ) : undefined
        }
      />

      <div className="px-4 py-3">
        {/* Loading state */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-[var(--foreground)] flex items-center justify-center">
                <Sparkles size={36} className="text-[var(--accent)]" />
              </div>
              <div className="absolute -bottom-2 -right-2">
                <Spinner className="h-6 w-6" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-semibold text-base animate-fade-in key={loadingMsg}">
                {loadingMsg}
              </p>
              <p className="text-sm text-[var(--muted)] mt-1">
                GPT-4o analysiert deinen Stil
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {!isGenerating && error && (
          <div className="flex flex-col items-center py-12 gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <p className="font-medium text-[var(--error)]">{error}</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push("/style")}>
                Stil ändern
              </Button>
              <Button onClick={generate}>Erneut versuchen</Button>
            </div>
          </div>
        )}

        {/* No style selected */}
        {!isGenerating && !error && !selectedStyle && generatedOutfits.length === 0 && (
          <div className="flex flex-col items-center py-12 gap-4 text-center">
            <p className="text-[var(--muted)]">Wähle zuerst einen Stil aus.</p>
            <Button onClick={() => router.push("/style")}>Stil wählen</Button>
          </div>
        )}

        {/* Outfits */}
        {!isGenerating && generatedOutfits.length > 0 && (
          <div className="space-y-4 pb-4">
            {generatedOutfits.map((outfit, i) => (
              <div
                key={outfit.id}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <OutfitCard
                  outfit={outfit}
                  wardrobeItems={wardrobeItems}
                  onFavoriteToggle={(id, fav) => {
                    setGeneratedOutfits(
                      generatedOutfits.map((o) =>
                        o.id === id ? { ...o, is_favorite: fav } : o
                      )
                    );
                  }}
                  onShopMissing={() => handleShopMissing(outfit)}
                />
              </div>
            ))}

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={generate}
            >
              <RefreshCw size={16} />
              Neue Outfits generieren
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
