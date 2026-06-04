"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title: string;
  showBack?: boolean;
  right?: React.ReactNode;
  className?: string;
}

export function TopBar({ title, showBack, right, className }: TopBarProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[var(--background)]/95 backdrop-blur-md border-b border-[var(--border)]",
        className
      )}
    >
      <div className="flex items-center gap-2 min-w-[40px]">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="rounded-full p-1.5 hover:bg-[var(--panel)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>
      <h1 className="text-base font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-1 min-w-[40px] justify-end">
        {right}
      </div>
    </header>
  );
}
