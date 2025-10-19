import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders default variant", () => {
    render(<Badge data-testid="badge">Default</Badge>);
    const badge = screen.getByTestId("badge");
    expect(badge).toHaveClass("bg-[var(--accent-soft)]");
    expect(badge).toHaveTextContent("Default");
  });

  it("supports alternate variants", () => {
    render(
      <>
        <Badge data-testid="outline" variant="outline">
          Outline
        </Badge>
        <Badge data-testid="subtle" variant="subtle">
          Subtle
        </Badge>
      </>,
    );

    expect(screen.getByTestId("outline")).toHaveClass("border-[var(--border-strong)]");
    expect(screen.getByTestId("subtle")).toHaveClass("bg-[var(--background-muted)]");
  });
});
