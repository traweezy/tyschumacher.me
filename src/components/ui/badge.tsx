import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "outline" | "subtle";
};

export const Badge = ({
  className,
  variant = "default",
  ...props
}: BadgeProps) => {
  const base =
    "inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-medium uppercase tracking-wide";
  const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
    default:
      "border-transparent bg-[var(--accent-soft)] text-[var(--accent)]",
    outline:
      "border-[var(--border-strong)] text-[var(--foreground)] bg-transparent",
    subtle:
      "border-transparent bg-[var(--background-muted)] text-[var(--foreground)]/70",
  };

  return (
    <span className={cn(base, variants[variant], className)} {...props} />
  );
};
