"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { categoryLabel, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { useAppStore } from "@/store/useAppStore";
import type { WardrobeItem as WardrobeItemType } from "@/types";

interface WardrobeItemProps {
  item: WardrobeItemType;
}

export function WardrobeItem({ item }: WardrobeItemProps) {
  const [showActions, setShowActions] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const removeWardrobeItem = useAppStore((s) => s.removeWardrobeItem);
  const { showToast } = useToast();

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch("/api/wardrobe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });
      if (!res.ok) throw new Error();
      removeWardrobeItem(item.id);
      showToast("Kleidungsstück entfernt", "success");
    } catch {
      showToast("Fehler beim Löschen", "error");
      setDeleting(false);
    }
  }

  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden bg-[var(--panel)] aspect-[3/4] cursor-pointer group",
        deleting && "opacity-50 pointer-events-none"
      )}
      onClick={() => setShowActions((v) => !v)}
    >
      {/* Image */}
      <div className="absolute inset-0">
        <Image
          src={item.image_url}
          alt={item.subcategory}
          fill
          sizes="(max-width: 768px) 33vw, 200px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-2.5">
        <p className="text-white text-xs font-medium truncate">
          {item.subcategory || categoryLabel(item.category)}
        </p>
        <div className="flex gap-1 mt-1 flex-wrap">
          {item.colors.slice(0, 2).map((c) => (
            <span
              key={c.hex}
              className="w-3 h-3 rounded-full border border-white/40 flex-shrink-0"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* Category badge */}
      <div className="absolute top-2 left-2">
        <Badge variant="muted" className="text-[9px] px-1.5 py-0.5 backdrop-blur-sm bg-white/80">
          <Tag size={8} className="mr-0.5" />
          {categoryLabel(item.category)}
        </Badge>
      </div>

      {/* Actions overlay */}
      {showActions && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="flex flex-col items-center gap-1 text-white"
          >
            <div className="w-10 h-10 rounded-full bg-red-500/90 flex items-center justify-center">
              <Trash2 size={18} />
            </div>
            <span className="text-xs">Löschen</span>
          </button>
        </div>
      )}
    </div>
  );
}
