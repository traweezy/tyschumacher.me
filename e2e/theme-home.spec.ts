import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { type Project, projects } from "@/data/projects";

for (const systemTheme of ["light", "dark"] as const) {
  for (const selectedTheme of ["light", "dark"] as const) {
    test(`selected ${selectedTheme} theme stays readable with a ${systemTheme} system theme`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: systemTheme, reducedMotion: "reduce" });
      await page.addInitScript((theme) => {
        window.localStorage.setItem("tyschumacher.theme-mode", theme);
      }, selectedTheme);
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        `civic-${selectedTheme}`,
      );
      const heroAccessibility = await new AxeBuilder({ page })
        .include("#home")
        .withRules(["color-contrast"])
        .analyze();
      expect(heroAccessibility.violations).toEqual([]);
      for (const action of await page.locator(".hero__cta").all()) {
        await action.hover();
        const heroHover = await new AxeBuilder({ page })
          .include("#home")
          .withRules(["color-contrast"])
          .analyze();
        expect(heroHover.violations).toEqual([]);
        await action.focus();
        await expect(action).toBeFocused();
        expect(
          await action.evaluate((element) => getComputedStyle(element).outlineStyle),
        ).toBe("solid");
      }
      await page.locator("#contact").scrollIntoViewIfNeeded();
      const accessibility = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(accessibility.violations).toEqual([]);
      const submit = page.getByRole("button", { name: "Send message" });
      await submit.hover();
      const hover = await new AxeBuilder({ page })
        .include("#contact")
        .withRules(["color-contrast"])
        .analyze();
      expect(hover.violations).toEqual([]);

      for (const project of projects) {
        const image: Project["image"] = project.image;
        const card = page.locator(`[data-project="${project.slug}"]`);
        const screenshot = card.getByRole("img");
        const fullScreenshot = card.getByRole("link", {
          name: `Open full screenshot of ${project.name}`,
        });
        const expectedSource =
          selectedTheme === "light" ? (image.lightSrc ?? image.src) : image.src;
        await expect(screenshot).toHaveCount(1);
        await screenshot.scrollIntoViewIfNeeded();
        await expect(fullScreenshot).toHaveAttribute("href", expectedSource);
        await expect
          .poll(() =>
            screenshot.evaluate(
              (element) =>
                element instanceof HTMLImageElement &&
                element.complete &&
                element.naturalWidth > 0,
            ),
          )
          .toBe(true);
      }
    });
  }
}

test("theme switching changes the screenshot and its full-size link without loading hidden captures first", async ({
  page,
}) => {
  const loadedSources = new Set<string>();
  page.on("request", (request) => {
    const url = new URL(request.url());
    loadedSources.add(url.searchParams.get("url") ?? url.pathname);
  });
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/#projects");
  for (const project of projects) {
    const image: Project["image"] = project.image;
    const card = page.locator(`[data-project="${project.slug}"]`);
    await card.getByRole("img").scrollIntoViewIfNeeded();
    await expect(
      card.getByRole("link", { name: /Open full screenshot/ }),
    ).toHaveAttribute("href", image.src);
    if (image.lightSrc) expect(loadedSources.has(image.lightSrc)).toBe(false);
  }
  await page.getByRole("button", { name: "Switch to light theme" }).first().click();
  for (const project of projects) {
    const image: Project["image"] = project.image;
    const card = page.locator(`[data-project="${project.slug}"]`);
    await expect(card.getByRole("img")).toHaveCount(1);
    await expect(
      card.getByRole("link", { name: /Open full screenshot/ }),
    ).toHaveAttribute("href", image.lightSrc ?? image.src);
  }
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "civic-light");
  await expect(page.locator("#projects").getByRole("img")).toHaveCount(projects.length);
});
