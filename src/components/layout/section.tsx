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
    className={cn("scroll-mt-24 py-20 sm:py-24", className)}
  >
    <Container>
      <header className="mb-12 flex max-w-3xl flex-col gap-3">
        <p
          id={`${id}-label`}
          className="type-eyebrow text-[var(--accent)]"
        >
          {label}
        </p>
        <h2 className="type-heading-2 text-balance">
          {headline}
        </h2>
        {caption ? (
          <p className="type-body-lg measure text-pretty text-[var(--text-secondary)]">
            {caption}
          </p>
        ) : null}
        {overline ? (
          <p className="type-body-sm measure-medium text-[var(--text-secondary)]">
            {overline}
          </p>
        ) : null}
      </header>
      <div className={cn("flex flex-col gap-10", contentClassName)}>{children}</div>
    </Container>
  </section>
);
