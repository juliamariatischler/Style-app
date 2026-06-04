"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { STYLE_OPTIONS } from "@/types";
import type { StyleName, Occasion, Season } from "@/types";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const OCCASIONS: Occasion[] = ["Casual", "Work", "Date Night", "Party", "Event", "Sport"];
const SEASONS: Season[] = ["Spring", "Summer", "Autumn", "Winter", "All Seasons"];

export default function StylePage() {
  const router = useRouter();
  const { selectedStyle, setSelectedStyle, setSelectedOccasion, setSelectedSeason } =
    useAppStore();
  const [localOccasion, setLocalOccasion] = useState<Occasion>("Casual");
  const [localSeason, setLocalSeason] = useState<Season>("All Seasons");
  const [showOptions, setShowOptions] = useState(false);

  function handleGenerate() {
    if (!selectedStyle) return;
    setSelectedOccasion(localOccasion);
    setSelectedSeason(localSeason);
    router.push("/outfits");
  }

  return (
    <>
      <TopBar title="Stil wählen" />

      <div className="px-4 pt-2 pb-6">
        <p className="text-sm text-[var(--muted)] mb-4">
          Wähle deinen gewünschten Look für heute
        </p>

        {/* Style grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {STYLE_OPTIONS.map((style) => {
            const isSelected = selectedStyle === style.name;
            return (
              <button
                key={style.name}
                onClick={() =>
                  setSelectedStyle(isSelected ? null : (style.name as StyleName))
                }
                className={cn(
                  "relative rounded-2xl p-4 text-left transition-all border-2",
                  isSelected
                    ? "border-[var(--accent)] bg-[var(--accent-light)]"
                    : "border-[var(--border)] bg-[var(--panel)] hover:border-[var(--accent-dark)]/40"
                )}
              >
                {/* Color swatches */}
                <div className="flex gap-1 mb-3">
                  {style.palette.map((color) => (
                    <div
                      key={color}
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Emoji */}
                <div className="text-2xl mb-2">{style.referenceEmoji}</div>

                <p className="font-semibold text-sm">{style.name}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5 line-clamp-2">
                  {style.description}
                </p>

                {/* Check */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Optional filters */}
        <button
          onClick={() => setShowOptions((v) => !v)}
          className="flex items-center gap-2 text-sm text-[var(--muted)] mb-3"
        >
          <ChevronDown
            size={16}
            className={cn("transition-transform", showOptions && "rotate-180")}
          />
          Anlass & Jahreszeit (optional)
        </button>

        {showOptions && (
          <div className="space-y-3 mb-5 p-4 rounded-2xl bg-[var(--panel)] border border-[var(--border)]">
            {/* Occasion */}
            <div>
              <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
                Anlass
              </p>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map((o) => (
                  <button
                    key={o}
                    onClick={() => setLocalOccasion(o)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                      localOccasion === o
                        ? "bg-[var(--foreground)] text-[var(--background)]"
                        : "bg-[var(--panel-strong)] text-[var(--muted)]"
                    )}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* Season */}
            <div>
              <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
                Jahreszeit
              </p>
              <div className="flex flex-wrap gap-2">
                {SEASONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setLocalSeason(s)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                      localSeason === s
                        ? "bg-[var(--foreground)] text-[var(--background)]"
                        : "bg-[var(--panel-strong)] text-[var(--muted)]"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Generate button */}
        <Button
          size="lg"
          className="w-full"
          disabled={!selectedStyle}
          onClick={handleGenerate}
        >
          {selectedStyle ? `${selectedStyle} Outfits generieren` : "Stil auswählen"}
        </Button>
      </div>
    </>
  );
}
