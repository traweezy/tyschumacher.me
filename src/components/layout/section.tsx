import type { PropsWithChildren, ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

type SectionProps = PropsWithChildren<{
  id: string;
  label: string;
  headline: ReactNode;
  caption?: ReactNode;
  overline?: ReactNode;
  contentClassName?: string;
  className?: string;
}>;

export const Section = ({
  id,
  label,
  headline,
  caption,
  overline,
  contentClassName,
  className,
  children,
}: SectionProps) => (
  <section
    id={id}
    aria-labelledby={`${id}-label`}
    className={cn("scroll-mt-24 py-10 md:py-14", className)}
  >
    <Container>
      <header className="mb-8 flex max-w-2xl flex-col gap-2.5">
        <p
          id={`${id}-label`}
          className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]"
        >
          {label}
        </p>
        <h2 className="text-balance text-3xl font-semibold text-[var(--text-primary)] md:text-4xl">
          {headline}
        </h2>
        {caption ? (
          <p className="text-pretty text-base text-[var(--text-secondary)]">{caption}</p>
        ) : null}
        {overline ? (
          <p className="text-sm text-[var(--text-secondary)]">{overline}</p>
        ) : null}
      </header>
      <div className={cn("flex flex-col gap-6", contentClassName)}>{children}</div>
    </Container>
  </section>
);
