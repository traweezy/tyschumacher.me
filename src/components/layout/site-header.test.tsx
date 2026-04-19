import type { ComponentPropsWithoutRef } from "react";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { SiteHeader } from "@/components/layout/site-header";
import { renderWithProviders } from "@/test-utils/render-with-providers";

vi.mock("next/image", () => ({
  default: ({
    alt,
    ...props
  }: ComponentPropsWithoutRef<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...props} />
  ),
}));

describe("SiteHeader", () => {
  test("renders primary navigation landmarks", () => {
    renderWithProviders(<SiteHeader />);
    const navigation = screen.getByRole("navigation", { name: /primary/i });
    expect(navigation).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Experience/i })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /portrait of tyler schumacher/i })).toBeInTheDocument();
  });

  test("opens command palette via keyboard shortcut", async () => {
    renderWithProviders(<SiteHeader />);
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(await screen.findByText(/Quick actions/i)).toBeInTheDocument();
  });
});
