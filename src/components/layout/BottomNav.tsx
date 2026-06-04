"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shirt, Sparkles, Heart, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/wardrobe", icon: Shirt, label: "Kleiderschrank" },
  { href: "/style", icon: Sparkles, label: "Stylen" },
  { href: "/favorites", icon: Heart, label: "Favoriten" },
  { href: "/shopping", icon: ShoppingBag, label: "Shopping" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-md safe-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active =
            pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors",
                active
                  ? "text-[var(--accent-dark)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
                className={cn(active && "fill-[var(--accent-light)]")}
              />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
