import React from "react";
import { act } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { renderWithProviders } from "../tests/utils";

declare global {
  // eslint-disable-next-line no-var
  var __dispatchMatchMedia: (query: string, matches: boolean) => void;
}

describe("Preference hydration", () => {
  test("updates reduced-motion dataset", () => {
    renderWithProviders(<div />);
    expect(document.documentElement.dataset.motion).toBe("safe");
    act(() => {
      global.__dispatchMatchMedia("(prefers-reduced-motion: reduce)", true);
    });
    expect(document.documentElement.dataset.motion).toBe("reduce");
  });
});
