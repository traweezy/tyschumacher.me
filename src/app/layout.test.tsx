import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "font-geist" }),
  Geist_Mono: () => ({ variable: "font-mono" }),
}));

vi.mock("./providers", () => ({
  Providers: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/layout/site-header", () => ({
  SiteHeader: () => <header>Global header</header>,
}));

describe("RootLayout metadata", () => {
  it("defines metadata and viewport properties", async () => {
    const { metadata, viewport } = await import("./layout");
    expect(metadata.title?.default).toMatch(/Tyler Schumacher/);
    expect(metadata.openGraph?.images?.[0]?.url).toBe("/og-image.svg");
    expect(viewport.themeColor).toBe("#020009");
  });
});

describe("RootLayout component", () => {
  it("renders structural landmarks and providers", async () => {
    const layoutModule = await import("./layout");
    const RootLayout = layoutModule.default;

    render(
      <RootLayout>
        <div>Page content</div>
      </RootLayout>,
    );

    expect(screen.getByRole("link", { name: /skip to content/i })).toHaveAttribute(
      "href",
      "#main-content",
    );
    expect(screen.getByText("Global header")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("Page content");
  });
});
