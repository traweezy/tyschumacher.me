import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SiteHeader } from "@/components/layout/site-header";
import { renderWithProviders } from "../tests/utils";

describe("SiteHeader", () => {
  test("renders primary navigation landmarks", () => {
    renderWithProviders(<SiteHeader />);
    const navigation = screen.getByRole("navigation", { name: /primary/i });
    expect(navigation).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Projects/i })).toBeInTheDocument();
  });

  test("opens command palette via keyboard shortcut", async () => {
    renderWithProviders(<SiteHeader />);
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(await screen.findByText(/Quick actions/i)).toBeInTheDocument();
  });
});
