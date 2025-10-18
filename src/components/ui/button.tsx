import { Slot } from "@radix-ui/react-slot";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "subtle";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-0)] disabled:cursor-not-allowed disabled:opacity-50";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-[var(--accent)] text-white shadow-elevated hover:bg-[var(--accent)]/90 dark:text-slate-950",
  outline:
    "border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--accent-soft)]",
  ghost: "text-[var(--text-primary)] hover:bg-[var(--accent-soft)]",
  subtle:
    "bg-[var(--surface-200)] text-[var(--text-primary)] hover:bg-[var(--accent-soft)]",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-4",
  md: "h-10 px-5",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(base, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
