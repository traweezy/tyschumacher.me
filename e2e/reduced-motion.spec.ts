import { expect, test } from "@playwright/test";

const commandShortcut = process.platform === "darwin" ? "Meta+K" : "Control+K";

test.describe("Reduced motion preference", () => {
  test("sets reduced motion state and removes command transitions", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const prefersReducedMotion = await page.evaluate(
      () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    expect(prefersReducedMotion).toBe(true);
    await expect(page.locator("html")).toHaveAttribute("data-motion", "reduce");

    await page.keyboard.press(commandShortcut);
    const dialog = page.locator("[cmdk-dialog]");
    await expect(dialog).toHaveAttribute("data-state", "open");

    const transitionDuration = await dialog.evaluate(
      (element) => getComputedStyle(element).transitionDuration,
    );
    expect(transitionDuration).toBe("0s");
  });
});
