import { act } from "@testing-library/react";
import { describe, expect, test } from "vitest";
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
});
