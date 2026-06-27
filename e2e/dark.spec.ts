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
});
