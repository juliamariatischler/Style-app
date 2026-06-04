"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { ShoppingCard } from "@/components/shopping/ShoppingCard";
import { Button } from "@/components/ui/button";
import { PageSpinner } from "@/components/ui/spinner";
import type { ShoppingSuggestion, BudgetTier } from "@/types";
import { cn } from "@/lib/utils";

const BUDGET_FILTERS: { label: string; value: BudgetTier | "all" }[] = [
  { label: "Alle", value: "all" },
  { label: "€ Budget", value: "€" },
  { label: "€€ Mid", value: "€€" },
  { label: "€€€ Premium", value: "€€€" },
];

export default function ShoppingPage() {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<ShoppingSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [budgetFilter, setBudgetFilter] = useState<BudgetTier | "all">("all");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/shopping");
        const data = await res.json();
        setSuggestions(data.suggestions ?? []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered =
    budgetFilter === "all"
      ? suggestions
      : suggestions.filter((s) => s.price_tier === budgetFilter);

  // Group by missing category
  const grouped = filtered.reduce<Record<string, ShoppingSuggestion[]>>(
    (acc, s) => {
      const key = s.missing_description || s.missing_category;
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    },
    {}
  );

  return (
    <>
      <TopBar title="Shopping" />

      {/* Budget filter */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        {BUDGET_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setBudgetFilter(f.value)}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              budgetFilter === f.value
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "bg-[var(--panel)] text-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="px-4 pb-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <PageSpinner />
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[var(--panel)] flex items-center justify-center">
              <ShoppingBag size={32} className="text-[var(--muted)]" />
            </div>
            <div>
              <p className="font-medium">Keine Shopping-Vorschläge</p>
              <p className="text-sm text-[var(--muted)] mt-1">
                Generiere Outfits — bei fehlenden Teilen wird automatisch gesucht
              </p>
            </div>
            <Button onClick={() => router.push("/style")}>
              Outfit generieren
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                    {category}
                  </p>
                </div>
                <div className="space-y-2">
                  {items.map((s) => (
                    <ShoppingCard key={s.id} suggestion={s} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
