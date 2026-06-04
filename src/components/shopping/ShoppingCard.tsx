"use client";

import Image from "next/image";
import { ExternalLink, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ShoppingSuggestion } from "@/types";

interface ShoppingCardProps {
  suggestion: ShoppingSuggestion;
}

export function ShoppingCard({ suggestion }: ShoppingCardProps) {
  return (
    <a
      href={suggestion.product_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 rounded-2xl bg-[var(--panel)] border border-[var(--border)] p-3 hover:border-[var(--accent)]/40 transition-colors group"
    >
      {/* Product image */}
      <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-[var(--panel-strong)]">
        {suggestion.image_url ? (
          <Image
            src={suggestion.image_url}
            alt={suggestion.product_title}
            width={80}
            height={80}
            className="w-full h-full object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={24} className="text-[var(--muted)]" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium line-clamp-2 leading-snug">
          {suggestion.product_title}
        </p>
        <p className="text-xs text-[var(--muted)] mt-0.5">{suggestion.shop_name}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-semibold text-[var(--accent-dark)]">
            {suggestion.price}
          </span>
          <Badge variant="accent">{suggestion.price_tier}</Badge>
        </div>
        <p className="text-[10px] text-[var(--muted)] mt-1.5 italic">
          {suggestion.missing_description}
        </p>
      </div>

      {/* Arrow */}
      <ExternalLink
        size={16}
        className="flex-shrink-0 text-[var(--muted)] group-hover:text-[var(--accent-dark)] transition-colors mt-1"
      />
    </a>
  );
}
