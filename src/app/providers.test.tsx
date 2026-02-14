import { act } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { renderWithProviders } from "@/test-utils/render-with-providers";

declare global {
  var __dispatchMatchMedia: (query: string, matches: boolean) => void;
}

describe("Providers preference hydration", () => {
  test("updates reduced-motion dataset", () => {
    renderWithProviders(<div />);
    expect(document.documentElement.dataset.motion).toBe("safe");
    act(() => {
      global.__dispatchMatchMedia("(prefers-reduced-motion: reduce)", true);
    });
    expect(document.documentElement.dataset.motion).toBe("reduce");
  });

  test("supports legacy matchMedia listener APIs", () => {
    const originalMatchMedia = window.matchMedia;
    const addListener = vi.fn();
    const removeListener = vi.fn();

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addListener,
          removeListener,
          dispatchEvent: () => true,
        }) as unknown as MediaQueryList,
    });

    const view = renderWithProviders(<div />);

    expect(addListener).toHaveBeenCalledTimes(1);

    view.unmount();
    expect(removeListener).toHaveBeenCalledTimes(1);

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: originalMatchMedia,
    });
  });
});
