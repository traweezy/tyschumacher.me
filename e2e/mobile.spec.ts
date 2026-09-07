import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { primaryNav } from "@/data/navigation";

test.describe("Mobile navigation", () => {
  test("opens sheet navigation and closes after selection", async ({ page }) => {
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
      await expect(mobileNav.getByRole("link", { name: item.title })).toBeVisible();
    }

    await mobileNav.getByRole("link", { name: /Skills/i }).click();

    await expect(mobileNav).not.toBeVisible();

    const hash = await page.evaluate(() => window.location.hash);
    expect(hash).toBe("#about");
  });

  test("keeps menu links and dismissal reachable on short screens", async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 360 });
    await page.goto("/");
    const trigger = page.getByRole("button", {
      name: "Open navigation",
      exact: true,
    });
    await trigger.tap();
    const dialog = page.getByRole("dialog", { name: "Site navigation" });
    const resume = dialog.getByRole("link", { name: "Download resume" });
    await resume.scrollIntoViewIfNeeded();
    await expect(resume).toBeInViewport({ ratio: 1 });
    const downloadEvent = page.waitForEvent("download");
    await resume.tap();
    expect((await downloadEvent).suggestedFilename()).toBe("tyler-schumacher-resume.pdf");
    await expect(dialog).not.toBeVisible();
    await trigger.tap();
    await dialog.getByRole("button", { name: "Close navigation", exact: true }).tap();
    await expect(trigger).toBeFocused();
    await trigger.tap();
    await page.setViewportSize({ width: 1366, height: 1024 });
    await expect(dialog).not.toBeVisible();
    await page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: "Contact" })
      .tap();
    await expect(page).toHaveURL(/#contact$/);
  });

  test("search remains usable with a keyboard-sized viewport and touch controls", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/");
    const trigger = page
      .getByRole("button", { name: "Open command palette" })
      .filter({ visible: true });
    await trigger.tap();
    const dialog = page.getByRole("dialog", { name: "Command palette" });
    const input = dialog.getByRole("combobox");
    await input.fill("no-such-resource");
    await expect(dialog.getByText("Nothing found. Try another keyword.")).toBeVisible();
    await dialog.getByRole("button", { name: "Clear", exact: true }).tap();
    await expect(input).toBeFocused();
    await expect(input).toHaveValue("");
    await expect(dialog.getByRole("option")).toHaveCount(10);

    await page.evaluate(() => {
      const viewport = window.visualViewport;
      if (!viewport) throw new Error("Visual viewport is unavailable.");
      Object.defineProperty(viewport, "height", {
        configurable: true,
        value: 300,
      });
      Object.defineProperty(viewport, "offsetTop", {
        configurable: true,
        value: 40,
      });
      viewport.dispatchEvent(new Event("resize"));
    });
    await expect
      .poll(async () => {
        const box = await dialog.boundingBox();
        return Boolean(box && box.y >= 40 && box.y + box.height <= 340);
      })
      .toBe(true);
    await expect(dialog.getByRole("button", { name: "Close search" })).toBeInViewport({
      ratio: 1,
    });
    const lastOption = dialog.getByRole("option").last();
    await lastOption.scrollIntoViewIfNeeded();
    const dialogBox = await dialog.boundingBox();
    const optionBox = await lastOption.boundingBox();
    if (!dialogBox || !optionBox)
      throw new Error("Search controls have no rendered bounds.");
    expect(optionBox.y + optionBox.height).toBeLessThanOrEqual(
      dialogBox.y + dialogBox.height,
    );
    await dialog.getByRole("button", { name: "Close search" }).tap();
    await expect(dialog).not.toBeVisible();
    await page.evaluate(() => {
      const viewport = window.visualViewport;
      if (!viewport) throw new Error("Visual viewport is unavailable.");
      Reflect.deleteProperty(viewport, "height");
      Reflect.deleteProperty(viewport, "offsetTop");
    });
    await trigger.tap();
    await input.fill("resume");
    const downloadEvent = page.waitForEvent("download");
    await dialog.getByRole("option", { name: /Download resume/ }).tap();
    expect((await downloadEvent).suggestedFilename()).toBe("tyler-schumacher-resume.pdf");
    await expect(dialog).not.toBeVisible();
  });

  test("all project evidence is readable and screenshots open separately", async ({
    page,
  }) => {
    await page.goto("/");
    const projects = page.locator("[data-project]");
    await expect(projects).toHaveCount(5);
    for (const card of await projects.all()) {
      await card.locator("summary").tap();
      await expect(card.getByText("Current state:")).toBeVisible();
      const image = card.locator("img");
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth))
        .toBeGreaterThan(0);
      expect(
        await card.evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
      ).toBe(true);
      for (const link of await card.getByRole("link").all()) {
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", /noopener/);
      }
    }
    const screenshot = projects
      .first()
      .getByRole("link", { name: /Open full screenshot/ });
    const popupEvent = page.waitForEvent("popup");
    await screenshot.tap();
    const popup = await popupEvent;
    await popup.waitForLoadState("domcontentloaded");
    await expect(popup).toHaveURL(/\/images\/projects\//);
    await popup.close();
    await page.getByRole("button", { name: "Buffalo, NY", exact: true }).tap();
    await expect(
      page.getByRole("list", { name: "Experience timeline" }).locator("article"),
    ).toHaveCount(1);
    await page.getByRole("button", { name: "All", exact: true }).tap();
    await expect(
      page.getByRole("list", { name: "Experience timeline" }).locator("article"),
    ).toHaveCount(4);
    await page.getByRole("link", { name: "Back to top" }).tap();
    await expect(page).toHaveURL(/#home$/);
  });

  test("forms and overlays remain accessible in light and dark themes", async ({
    page,
  }) => {
    await page.route("**/api/contact", async (route) => {
      expect(route.request().postDataJSON()).toMatchObject({
        name: "Mobile audit",
        email: "audit@example.com",
      });
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });
    await page.goto("/");
    for (const colorScheme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme });
      await expect(page.locator("html")).toHaveAttribute("data-theme-mode", colorScheme);
      await page
        .getByRole("textbox", { name: "Email", exact: true })
        .fill("invalid-email");
      await page.getByRole("textbox", { name: "Name", exact: true }).tap();
      await expect(page.locator("#contact-email-error")).not.toBeEmpty();
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(audit.violations).toEqual([]);
    }
    for (const input of await page.locator("form input, form textarea").all()) {
      expect(
        await input.evaluate((element) => parseFloat(getComputedStyle(element).fontSize)),
      ).toBeGreaterThanOrEqual(16);
    }
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Mobile audit");
    await page
      .getByRole("textbox", { name: "Email", exact: true })
      .fill("audit@example.com");
    await page
      .getByRole("textbox", { name: "How can I help?", exact: true })
      .fill("This message stays inside the mocked browser test and is never sent.");
    await page.getByRole("button", { name: "Send message", exact: true }).tap();
    await expect(page.getByRole("status")).toContainText("Thanks!");
    await page.getByRole("button", { name: "Open navigation", exact: true }).tap();
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Close navigation", exact: true })
      .tap();
    await page
      .getByRole("button", { name: "Open command palette" })
      .filter({ visible: true })
      .tap();
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    await page.getByRole("button", { name: "Close search" }).tap();
  });
});
