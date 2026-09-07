import { expect, type Page } from "@playwright/test";

export const checkHeroMotion = async (page: Page) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const image = page.locator(".hero__image");
  const art = page.locator(".hero__art");
  await expect
    .poll(() =>
      image.evaluate(
        (element: HTMLImageElement) => element.complete && element.naturalWidth > 0,
      ),
    )
    .toBe(true);
  await expect(
    page.getByRole("heading", { name: "Tyler Schumacher", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("At a glance", { exact: true })).toHaveCount(0);
  expect(
    await page
      .locator("main > section")
      .evaluateAll((sections) => sections.map((section) => section.id)),
  ).toEqual(["home", "experience", "projects", "about", "contact"]);

  const supportsTimeline = await page.evaluate(
    () =>
      CSS.supports("animation-timeline: --hero") &&
      CSS.supports("animation-range: exit-crossing 0% exit-crossing 100%"),
  );
  const imageBounds = await image.boundingBox();
  const artBounds = await art.boundingBox();
  if (!imageBounds || !artBounds) throw new Error("Hero artwork has no rendered bounds.");
  expect(imageBounds.width).toBeCloseTo(artBounds.width, 0);
  expect(imageBounds.height).toBeCloseTo(artBounds.height, 0);
  const initialTransform = await art.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await page.evaluate(() => window.scrollTo({ top: 350, behavior: "instant" }));
  if (supportsTimeline) {
    await expect
      .poll(() => art.evaluate((element) => getComputedStyle(element).transform))
      .not.toBe(initialTransform);
    const travel = await art.evaluate((element, initial) => {
      const start = initial === "none" ? 0 : new DOMMatrixReadOnly(initial).m42;
      return new DOMMatrixReadOnly(getComputedStyle(element).transform).m42 - start;
    }, initialTransform);
    expect(travel).toBeGreaterThan(48);
    expect(travel).toBeLessThan(350);
  } else {
    expect(initialTransform).toBe("none");
  }
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBe(true);

  // Changing the OS preference while on the page must stop the decorative motion.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() => art.evaluate((element) => getComputedStyle(element).transform))
    .toBe("none");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  expect(await art.evaluate((element) => getComputedStyle(element).transform)).toBe(
    "none",
  );
  await expect(page.locator(".hero__summary")).toBeVisible();
};
