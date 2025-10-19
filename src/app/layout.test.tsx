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
    const resolveTitle = (value: typeof metadata.title): string | undefined => {
      if (typeof value === "string") {
        return value;
      }
      if (!value) {
        return undefined;
      }
      if ("default" in value) {
        return value.default;
      }
      if ("absolute" in value) {
        return value.absolute;
      }

      return undefined;
    };

    const resolvedTitle = resolveTitle(metadata.title);
    expect(resolvedTitle).toMatch(/Tyler Schumacher/);

    const openGraphImages = metadata.openGraph?.images;
    const firstImage = Array.isArray(openGraphImages)
      ? openGraphImages[0] ?? null
      : openGraphImages ?? null;

    if (!firstImage) {
      throw new Error("Expected Open Graph image.");
    }

    if (firstImage instanceof URL) {
      expect(firstImage.pathname).toBe("/og-image.svg");
    } else if (typeof firstImage === "string") {
      expect(firstImage).toBe("/og-image.svg");
    } else {
      expect(firstImage.url).toBe("/og-image.svg");
    }
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
