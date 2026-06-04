"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={cn(
        "fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-lg animate-fade-in",
        type === "success" && "bg-[var(--success)] text-white",
        type === "error" && "bg-[var(--error)] text-white",
        type === "info" && "bg-[var(--foreground)] text-[var(--background)]"
      )}
    >
      <span>{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
  id: number;
}

interface ToastContextValue {
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = React.createContext<ToastContextValue>({
  showToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastState[]>([]);

  const showToast = React.useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      setToasts((prev) => [...prev, { message, type, id: Date.now() }]);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onClose={() =>
            setToasts((prev) => prev.filter((x) => x.id !== t.id))
          }
        />
      ))}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return React.useContext(ToastContext);
}
