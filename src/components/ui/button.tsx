"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--foreground)] text-[var(--background)] hover:bg-[#333] active:scale-[0.98]",
        accent:
          "bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] active:scale-[0.98]",
        outline:
          "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--panel)] active:scale-[0.98]",
        ghost:
          "text-[var(--foreground)] hover:bg-[var(--panel)] active:scale-[0.98]",
        destructive:
          "bg-[var(--error)] text-white hover:opacity-90 active:scale-[0.98]",
      },
      size: {
        sm: "h-8 px-4 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, loading, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";
