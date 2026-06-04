"use client";

import { useEffect, useState } from "react";
import { Plus, Shirt } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { WardrobeItem } from "@/components/wardrobe/WardrobeItem";
import { UploadModal } from "@/components/wardrobe/UploadModal";
import { Badge } from "@/components/ui/badge";
import { PageSpinner } from "@/components/ui/spinner";
import { useAppStore } from "@/store/useAppStore";
import { categoryLabel, cn } from "@/lib/utils";
import type { WardrobeCategory } from "@/types";

const FILTER_TABS: { label: string; value: WardrobeCategory | "all" }[] = [
  { label: "Alle", value: "all" },
  { label: "Tops", value: "tops" },
  { label: "Hosen", value: "bottoms" },
  { label: "Schuhe", value: "shoes" },
  { label: "Kleider", value: "dress" },
  { label: "Outerwear", value: "outerwear" },
  { label: "Accessoires", value: "accessories" },
];

export default function WardrobePage() {
  const { wardrobeItems, setWardrobeItems } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [activeFilter, setActiveFilter] = useState<WardrobeCategory | "all">("all");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/wardrobe");
        const { items } = await res.json();
        setWardrobeItems(items ?? []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [setWardrobeItems]);

  const filtered =
    activeFilter === "all"
      ? wardrobeItems
      : wardrobeItems.filter((i) => i.category === activeFilter);

  return (
    <>
      <TopBar
        title="Mein Kleiderschrank"
        right={
          <Badge variant="muted">{wardrobeItems.length} Teile</Badge>
        }
      />

      {/* Category filter */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              activeFilter === tab.value
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "bg-[var(--panel)] text-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <PageSpinner />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--panel)] flex items-center justify-center mb-4">
              <Shirt size={32} className="text-[var(--muted)]" />
            </div>
            <p className="font-medium text-[var(--foreground)]">
              {activeFilter === "all"
                ? "Noch keine Kleidungsstücke"
                : `Keine ${categoryLabel(activeFilter)} vorhanden`}
            </p>
            <p className="text-sm text-[var(--muted)] mt-1">
              Füge dein erstes Kleidungsstück hinzu
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 pb-4">
            {filtered.map((item) => (
              <WardrobeItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowUpload(true)}
        className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform z-30"
      >
        <Plus size={24} />
      </button>

      {/* Upload modal */}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </>
  );
}
