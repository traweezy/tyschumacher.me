import { expect, type Page } from "@playwright/test";

export const checkHeroMotion = async (page: Page) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const art = page.locator(".hero__art");
  const layers = art.locator(".hero__layer");
  await expect(layers).toHaveCount(3);
  await expect(art).toHaveAttribute("aria-hidden", "true");
  for (const layer of await layers.all()) {
    const loaded = await layer.evaluate(async (element) => {
      const candidates = Array.from(
        getComputedStyle(element).backgroundImage.matchAll(/url\("?(.+?)"?\)/g),
        (match) => match[1],
      );
      // Check the format the browser actually fetched, without loading a fallback.
      const source = performance
        .getEntriesByType("resource")
        .find((entry) => candidates.includes(entry.name))?.name;
      if (!source) return false;
      const image = new Image();
      image.src = source;
      await image.decode();
      return image.naturalWidth > 0;
    });
    expect(loaded).toBe(true);
    const layerBounds = await layer.boundingBox();
    const artBounds = await art.boundingBox();
    if (!layerBounds || !artBounds)
      throw new Error("Hero artwork has no rendered bounds.");
    // The animated backdrop/technology layers may scale slightly to cover their edges.
    expect(layerBounds.width).toBeGreaterThanOrEqual(artBounds.width - 1);
    expect(layerBounds.height).toBeGreaterThanOrEqual(artBounds.height - 1);
  }
  await expect(
    page.getByRole("heading", { name: "Tyler Schumacher", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("At a glance", { exact: true })).toHaveCount(0);
  expect(
    await page
      .locator("main > section")
      .evaluateAll((sections) => sections.map((section) => section.id)),
  ).toEqual(["home", "experience", "projects", "about", "contact"]);

  const supportsMotion = await page.evaluate(
    () =>
      innerWidth > 600 &&
      CSS.supports("animation-timeline: --hero") &&
      CSS.supports("animation-range: exit-crossing 0% exit-crossing 100%"),
  );
  const readOffsets = () =>
    layers.evaluateAll((elements) =>
      elements.map((element) => {
        const transform = getComputedStyle(element).transform;
        return transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42;
      }),
    );
  const readScreenPositions = () =>
    layers.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().top),
    );
  const initialOffsets = await readOffsets();
  const initialPositions = await readScreenPositions();
  await page.evaluate(() => window.scrollTo({ top: 350, behavior: "instant" }));
  if (supportsMotion) {
    await expect.poll(readOffsets).not.toEqual(initialOffsets);
    const travel = (await readOffsets()).map(
      (offset, index) => offset - (initialOffsets[index] ?? 0),
    );
    for (const distance of travel) {
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(350);
    }
    // Downward compensation slows upward screen motion. Distant planes need more.
    expect(travel[0]).toBeGreaterThan(travel[1] ?? 0);
    expect(travel[1]).toBeGreaterThan(travel[2] ?? 0);
    const screenTravel = (await readScreenPositions()).map(
      (position, index) => (initialPositions[index] ?? 0) - position,
    );
    for (const distance of screenTravel) expect(distance).toBeGreaterThan(0);
    expect(screenTravel[0]).toBeLessThan(screenTravel[1] ?? 0);
    expect(screenTravel[1]).toBeLessThan(screenTravel[2] ?? 0);
  } else {
    expect(await readOffsets()).toEqual([0, 0, 0]);
  }
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBe(true);

  // Live motion preferences stop every layer; phones always use static artwork.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(readOffsets).toEqual([0, 0, 0]);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  expect(await readOffsets()).toEqual([0, 0, 0]);
  await expect(page.locator(".hero__summary")).toBeVisible();

  // Re-enabling motion restores the timeline; scrolling back restores its start.
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(() => window.scrollTo({ top: 350, behavior: "instant" }));
  if (supportsMotion) {
    await expect.poll(readOffsets).not.toEqual([0, 0, 0]);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect.poll(readOffsets).toEqual([0, 0, 0]);
  } else {
    expect(await readOffsets()).toEqual([0, 0, 0]);
  }
};
