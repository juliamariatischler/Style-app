import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-5 w-5 rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] animate-spin",
        className
      )}
    />
  );
}

export function PageSpinner() {
  return (
    <div className="flex h-full items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
