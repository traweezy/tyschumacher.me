import { fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CommandPalette } from "@/components/command/command-palette";
import { useUIStore } from "@/state/ui-store";
import { renderWithProviders } from "@/test-utils/render-with-providers";

describe("CommandPalette", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useUIStore.setState({
      isCommandOpen: false,
      isMobileNavOpen: false,
    });
  });

  afterEach(() => {
    document.querySelector("#about")?.remove();
    vi.restoreAllMocks();
  });

  it("opens with keyboard shortcut and ignores unrelated keys", async () => {
    renderWithProviders(<CommandPalette />);

    fireEvent.keyDown(window, { key: "x", ctrlKey: true });
    expect(useUIStore.getState().isCommandOpen).toBe(false);

    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(await screen.findByRole("dialog", { name: /command palette/i })).toBeInTheDocument();
    expect(useUIStore.getState().isCommandOpen).toBe(true);
  });

  it("scrolls to a section when an in-page anchor exists", async () => {
    useUIStore.setState({ isCommandOpen: true });
    const target = document.createElement("section");
    target.id = "about";
    document.body.appendChild(target);
    const scrollSpy = vi.spyOn(HTMLElement.prototype, "scrollIntoView");

    renderWithProviders(<CommandPalette />);
    fireEvent.click(await screen.findByRole("option", { name: /^Approach$/i }));

    expect(scrollSpy).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    expect(useUIStore.getState().isCommandOpen).toBe(false);
  });

  it("handles in-page anchor selection when section is missing", async () => {
    useUIStore.setState({ isCommandOpen: true });
    const querySelectorSpy = vi.spyOn(document, "querySelector");

    renderWithProviders(<CommandPalette />);
    fireEvent.click(await screen.findByRole("option", { name: /^Experience$/i }));

    expect(querySelectorSpy).toHaveBeenCalledWith("#experience");
    expect(useUIStore.getState().isCommandOpen).toBe(false);
  });

  it("opens external links in a new tab", async () => {
    useUIStore.setState({ isCommandOpen: true });
    const openSpy = vi
      .spyOn(window, "open")
      .mockImplementation(() => null);

    renderWithProviders(<CommandPalette />);
    fireEvent.click(await screen.findByRole("option", { name: /^GitHub$/i }));

    expect(openSpy).toHaveBeenCalledWith(
      "https://github.com/traweezy",
      "_blank",
      "noreferrer",
    );
  });

  it("treats pdf links as external opens", async () => {
    useUIStore.setState({ isCommandOpen: true });
    const openSpy = vi
      .spyOn(window, "open")
      .mockImplementation(() => null);

    renderWithProviders(<CommandPalette />);
    fireEvent.click(await screen.findByRole("option", { name: /^Resume$/i }));

    expect(openSpy).toHaveBeenCalledWith(
      "/tyler-schumacher-resume.pdf",
      "_blank",
      "noreferrer",
    );
  });
});
