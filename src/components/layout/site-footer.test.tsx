import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SiteFooter } from "@/components/layout/site-footer";
import { secondaryNav } from "@/data/navigation";

describe("SiteFooter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-02T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the current year and social links", () => {
    render(<SiteFooter />);

    expect(
      screen.getByText(/© 2025 Tyler Schumacher/i),
    ).toBeInTheDocument();
    const githubLink = secondaryNav.find((item) => item.id === "github");
    const linkedinLink = secondaryNav.find((item) => item.id === "linkedin");
    expect(
      screen.getByRole("link", { name: "GitHub" }),
    ).toHaveAttribute("href", githubLink?.href);
    expect(
      screen.getByRole("link", { name: "LinkedIn" }),
    ).toHaveAttribute("href", linkedinLink?.href);
    expect(
      screen.getByRole("link", { name: /back to top/i }),
    ).toHaveAttribute("href", "#home");
  });
});
