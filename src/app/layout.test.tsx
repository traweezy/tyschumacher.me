import { render, screen } from "@testing-library/react";
import type React from "react";
import { describe, expect, it, vi } from "vitest";
import { SHARE_IMAGE_PATH, SITE_URL } from "@/lib/site";

vi.mock("next/font/google", () => ({
  Fraunces: () => ({ variable: "font-fraunces" }),
  Geist_Mono: () => ({ variable: "font-mono" }),
  Manrope: () => ({ variable: "font-manrope" }),
}));

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-nonce": "test-nonce" }),
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
      ? (openGraphImages[0] ?? null)
      : (openGraphImages ?? null);

    if (!firstImage) {
      throw new Error("Expected Open Graph image.");
    }

    const imageUrl =
      firstImage instanceof URL || typeof firstImage === "string"
        ? firstImage
        : firstImage.url;
    expect(new URL(imageUrl, SITE_URL).href).toBe(
      new URL(SHARE_IMAGE_PATH, SITE_URL).href,
    );
    expect(viewport.themeColor).toEqual([
      { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
      { media: "(prefers-color-scheme: dark)", color: "#0b1017" },
    ]);
  });
});

describe("RootLayout component", () => {
  it("renders structural landmarks and providers", async () => {
    const layoutModule = await import("./layout");
    const RootLayout = layoutModule.default;

    render(
      await RootLayout({
        children: <div>Page content</div>,
      }),
    );

    expect(screen.getByRole("link", { name: /skip to content/i })).toHaveAttribute(
      "href",
      "#main-content",
    );
    expect(screen.getByText("Global header")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("Page content");
  });

  it("injects the theme initializer before body content", async () => {
    const layoutModule = await import("./layout");
    const RootLayout = layoutModule.default;

    render(
      await RootLayout({
        children: <div>Page content</div>,
      }),
    );

    const initializer = document.querySelector<HTMLScriptElement>(
      "script[data-theme-initializer]",
    );

    expect(initializer).not.toBeNull();
    expect(initializer).toHaveAttribute("nonce", "test-nonce");
    expect(initializer?.textContent).toContain("tyschumacher.theme-mode");
    expect(initializer?.textContent).toContain("prefers-color-scheme: dark");
    expect(initializer?.textContent).toContain("localStorage.getItem");

    const controlsInitializer = document.querySelector<HTMLScriptElement>(
      "script[data-theme-controls-initializer]",
    );

    expect(controlsInitializer).not.toBeNull();
    expect(controlsInitializer).toHaveAttribute("nonce", "test-nonce");
    expect(controlsInitializer?.textContent).toContain("[data-theme-mode-toggle]");
    expect(controlsInitializer?.textContent).toContain("aria-pressed");
  });
});
