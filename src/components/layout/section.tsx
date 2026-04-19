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
      <div className="section-shell">
        <header className="section-header">
          <div className="section-header__meta">
            <p
              id={`${id}-label`}
              className="section-header__label type-eyebrow"
            >
              {label}
            </p>
            {overline ? (
              <p className="section-header__overline type-body-sm text-[var(--text-secondary)]">
                {overline}
              </p>
            ) : null}
          </div>
          <div className="section-header__content">
            <h2 className="type-heading-2 text-balance">
              {headline}
            </h2>
            {caption ? (
              <p className="type-body-lg measure text-pretty text-[var(--text-secondary)]">
                {caption}
              </p>
            ) : null}
          </div>
        </header>
        <div className={cn("flex flex-col gap-10", contentClassName)}>{children}</div>
      </div>
    </Container>
  </section>
);
