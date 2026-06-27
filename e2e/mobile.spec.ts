import { expect, test } from "@playwright/test";
import { primaryNav } from "@/data/navigation";

test.describe("Mobile navigation", () => {
  test("opens sheet navigation and closes after selection", async ({
    page,
  }) => {
    await page.goto("/");

    const openNavButton = page.getByRole("button", {
      name: /Open navigation/i,
    });
    await openNavButton.click();

    const mobileNav = page.getByRole("navigation", {
      name: /Mobile navigation/i,
    });
    await expect(mobileNav).toBeVisible();

    for (const item of primaryNav) {
      await expect(
        mobileNav.getByRole("link", { name: item.title }),
      ).toBeVisible();
    }

    await mobileNav.getByRole("link", { name: /Approach/i }).click();

    await expect(mobileNav).not.toBeVisible();

    const hash = await page.evaluate(() => window.location.hash);
    expect(hash).toBe("#about");
  });
});
