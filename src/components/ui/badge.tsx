import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "accent" | "muted" | "success";
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "default" && "bg-[var(--panel-strong)] text-[var(--foreground)]",
        variant === "accent" && "bg-[var(--accent-light)] text-[var(--accent-dark)]",
        variant === "muted" && "bg-[var(--panel)] text-[var(--muted)]",
        variant === "success" && "bg-emerald-50 text-emerald-700",
        className
      )}
    >
      {children}
    </span>
  );
}
