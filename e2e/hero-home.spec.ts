import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { checkHeroMotion } from "./hero-checks";

test("a tall phone hero keeps its artwork static while scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await checkHeroMotion(page);
});

test("hero art follows scrolling and respects live motion preferences", async ({
  page,
}) => {
  await checkHeroMotion(page);
  await expect(
    page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link"),
  ).toHaveText(["Home", "Experience", "Projects", "Skills", "Contact"]);
});

test("timeline remains coherent when locations change", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#experience");
  await expect(section.locator(".career-entry")).toHaveCount(4);
  await expect(section.getByText("Current role", { exact: true })).toHaveCount(1);
  await section.getByRole("button", { name: "Buffalo, NY", exact: true }).click();
  await expect(section.locator(".career-entry")).toHaveCount(1);
  await expect(section.getByText("Current role", { exact: true })).toHaveCount(0);
  expect(
    await section
      .locator(".career-entry")
      .evaluate((element) => getComputedStyle(element, "::before").display),
  ).toBe("none");
  await section.getByRole("button", { name: "All", exact: true }).click();
  await expect(section.locator(".career-entry")).toHaveCount(4);
  await expect(section.getByText("Current role", { exact: true })).toHaveCount(1);
  const all = section.getByRole("button", { name: "All", exact: true });
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    await all.hover();
    const results = await new AxeBuilder({ page })
      .include(".experience-filters")
      .analyze();
    expect(results.violations).toEqual([]);
  }
  await all.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(all).toBeFocused();
  expect(await all.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe(
    "solid",
  );
});
