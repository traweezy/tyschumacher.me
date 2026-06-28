import { expect, test } from "@playwright/test";

test.describe("Dark mode preference", () => {
  test("applies the system dark theme before interaction", async ({ page }) => {
    await page.goto("/");

    const root = page.locator("html");
    await expect(root).toHaveAttribute("data-theme", "civic-dark");
    await expect(root).toHaveAttribute("data-theme-mode", "dark");

    await expect(
      page.getByRole("button", { name: /Switch to light theme/i }).first(),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("applies a stored theme preference before system dark", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("tyschumacher.theme-mode", "light");
    });
    await page.goto("/");

    const root = page.locator("html");
    await expect(root).toHaveAttribute("data-theme", "civic-light");
    await expect(root).toHaveAttribute("data-theme-mode", "light");

    await expect(
      page.getByRole("button", { name: /Switch to dark theme/i }).first(),
    ).toHaveAttribute("aria-pressed", "false");
  });
});
