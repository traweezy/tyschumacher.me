import { expect, test } from "@playwright/test";
import { checkHeroMotion } from "./hero-checks";

test("desktop artwork remains complete when scroll timelines are unavailable", async ({
  page,
}) => {
  await checkHeroMotion(page);
  expect(await page.evaluate(() => CSS.supports("animation-timeline: --hero"))).toBe(
    false,
  );
  await page.getByRole("link", { name: "Explore projects", exact: true }).click();
  await expect(page).toHaveURL(/#projects$/);
});
