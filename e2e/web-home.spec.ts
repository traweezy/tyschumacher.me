import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const canonical = "https://www.tyschumacher.me/";

test("serves complete metadata and crawler-readable share assets", async ({
  request,
  page,
}) => {
  const response = await request.get("/", {
    headers: { "user-agent": "LinkedInBot/1.0" },
  });
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain(
    'property="og:image" content="https://www.tyschumacher.me/og.png"',
  );
  expect(html).toContain(
    'name="twitter:image" content="https://www.tyschumacher.me/og.png"',
  );
  const policy = response.headers()["content-security-policy"] ?? "";
  expect(policy).toContain("script-src 'self' 'nonce-");
  expect(policy).not.toContain("'unsafe-inline'");
  expect(policy).not.toContain("'unsafe-eval'");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  const image = await request.get("/og.png");
  expect(image.headers()["content-type"]).toContain("image/png");
  const bytes = await image.body();
  expect(bytes.readUInt32BE(16)).toBe(1200);
  expect(bytes.readUInt32BE(20)).toBe(630);
  expect(bytes.length).toBeLessThan(5_000_000);
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain(`Sitemap: ${canonical}sitemap.xml`);
  expect(await (await request.get("/sitemap.xml")).text()).toContain(
    `<loc>${canonical}</loc>`,
  );
  const manifest = await request.get("/manifest.webmanifest");
  expect(await manifest.json()).toMatchObject({
    short_name: "Tyler Schumacher",
    display: "browser",
  });
  for (const asset of [
    "/icon-192.png",
    "/icon-512.png",
    "/apple-touch-icon.png",
    "/favicon.ico",
    "/tyler-schumacher-resume.pdf",
  ]) {
    expect((await request.get(asset)).status()).toBe(200);
  }
  await page.goto("/");
  const favicon = page.locator('link[rel="icon"]');
  await expect(favicon).toHaveCount(1);
  await expect(favicon).toHaveAttribute("href", /^\/favicon\.ico\?v=.+$/);
  const faviconResponse = await request.get(
    (await favicon.getAttribute("href")) ?? "",
  );
  expect(faviconResponse.status()).toBe(200);
  const faviconBytes = await faviconResponse.body();
  expect(faviconBytes.readUInt16LE(0)).toBe(0);
  expect(faviconBytes.readUInt16LE(2)).toBe(1);
  expect(
    new URL(
      (await page.locator('link[rel="canonical"]').getAttribute("href")) ?? "",
    ).href,
  ).toBe(canonical);
  const brokenAnchors = await page
    .locator('a[href^="#"], a[href^="/#"]')
    .evaluateAll((links) =>
      links
        .map((link) => link.getAttribute("href")?.split("#")[1])
        .filter((id) => !id || !document.getElementById(id)),
    );
  expect(brokenAnchors).toEqual([]);
});

test("project evidence supports keyboard navigation and remains usable without JavaScript", async ({
  page,
  browser,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#projects");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduce");
  // Measure focus clearance after font loading and initial fragment navigation.
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  const notes = page.locator("#projects summary").first();
  await notes.focus();
  await notes.evaluate((element) =>
    element.scrollIntoView({ block: "start", behavior: "instant" }),
  );
  const headerBottom = await page
    .getByRole("banner")
    .evaluate((element) => element.getBoundingClientRect().bottom);
  expect(
    await notes.evaluate((element) => element.getBoundingClientRect().top),
  ).toBeGreaterThanOrEqual(headerBottom);
  await page.keyboard.press("Enter");
  await expect(notes.locator("..")).toHaveAttribute("open", "");
  await expect(
    page
      .getByRole("link", {
        name: "View source for Remorseless Records",
        exact: true,
      })
      .first(),
  ).toHaveAttribute(
    "href",
    "https://github.com/traweezy/remorseless-records/tree/staging",
  );
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto("/");
  await expect(
    staticPage.getByRole("heading", { name: "Stackctl", exact: true }),
  ).toBeVisible();
  await staticPage.locator("#projects summary").first().click();
  await expect(staticPage.locator("#projects details").first()).toHaveAttribute(
    "open",
    "",
  );
  await context.close();
});

for (const mode of ["light", "dark"] as const) {
  test(`has no WCAG A/AA violations or overflow in ${mode} mode`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: mode, reducedMotion: "reduce" });
    await page.addInitScript(
      (theme) => localStorage.setItem("tyschumacher.theme-mode", theme),
      mode,
    );
    await page.goto("/");
    await page.locator("#projects summary").first().click();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
    for (const width of [360, 768, 1440, 1920]) {
      await page.setViewportSize({ width, height: 960 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }
  });
}

test("returns a genuine 404 with a working path back to projects", async ({
  page,
}) => {
  const response = await page.goto("/missing-project");
  expect(response?.status()).toBe(404);
  await expect(
    page.locator('meta[name="robots"][content="noindex"]'),
  ).toHaveCount(1);
  await page.getByRole("link", { name: /Explore projects/i }).click();
  await expect(page).toHaveURL(/\/#projects$/);
  await expect(
    page.getByRole("heading", { name: "Stackctl", exact: true }),
  ).toBeVisible();
});

test("tracks sections while scrolling on wide and narrow viewports", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const width of [1920, 1440, 390]) {
    await page.setViewportSize({ width, height: 960 });
    for (const id of ["home", "projects", "experience"]) {
      await page
        .locator(`#${id}`)
        .evaluate((section) =>
          section.scrollIntoView({ block: "start", behavior: "instant" }),
        );
      await expect(page.getByRole("banner")).toHaveAttribute(
        "data-active-section",
        id,
      );
    }
  }
  await page.setViewportSize({ width: 1440, height: 1060 });
  await page.goto("/#projects");
  await expect(page.getByRole("banner")).toHaveAttribute(
    "data-active-section",
    "projects",
  );
  await page
    .locator('[data-project="personal-website"]')
    .evaluate((card) =>
      card.scrollIntoView({ block: "center", behavior: "instant" }),
    );
  await expect(page.getByRole("banner")).toHaveAttribute(
    "data-active-section",
    "projects",
  );
});

test("all project technologies and evidence links have visible icons", async ({
  page,
}) => {
  await page.goto("/#projects");
  const technologyLists = page.locator(
    '#projects ul[aria-label$="technologies"]',
  );
  await expect(technologyLists).toHaveCount(5);
  for (const list of await technologyLists.all()) {
    for (const item of await list.getByRole("listitem").all()) {
      await expect(item.locator("svg")).toBeVisible();
      await expect(item.locator("svg")).toHaveAttribute("aria-hidden", "true");
      await expect(item).not.toHaveText("");
    }
  }
  for (const link of await page
    .locator('#projects a[href^="https://github.com"]')
    .all()) {
    await expect(link.locator("svg").first()).toBeVisible();
  }
});

test("project previews distinguish staging, public demos, and private source", async ({
  page,
  request,
}) => {
  await page.goto("/#projects");
  const section = page.locator("#projects");
  await expect(
    section.getByRole("heading", { name: "More projects" }),
  ).toHaveCount(0);
  await expect(
    section.getByText("Work in progress", { exact: true }),
  ).toHaveCount(3);
  await expect(
    section.getByText("Source private", { exact: true }),
  ).toHaveCount(1);
  await expect(
    section.getByRole("link", { name: "View source for Relantern" }),
  ).toHaveAttribute("href", "https://github.com/traweezy/relantern");
  await expect(
    section.getByRole("link", { name: "View source for QuantHelm" }),
  ).toHaveCount(0);
  await expect(
    section.getByRole("link", { name: "View staging for Remorseless Records" }),
  ).toHaveAttribute("href", "https://storefront-staging-41f0.up.railway.app/");
  await expect(
    section.getByRole("link", { name: "Try demo for Relantern" }),
  ).toHaveAttribute("href", "https://web-demo-ce4e.up.railway.app/demo");
  await expect(
    section.getByRole("link", { name: "Try demo for QuantHelm" }),
  ).toHaveAttribute("href", "https://web-demo-b7d9.up.railway.app/demo");
  await expect(
    section.locator('a[href*="localhost"], a[href*="127.0.0.1"]'),
  ).toHaveCount(0);
  await expect(section.getByRole("article")).toHaveCount(5);
  await expect(
    section.getByRole("heading", { name: "Waypoint", exact: true }),
  ).toHaveCount(0);
  await expect(section.getByText("Released", { exact: true })).toHaveCount(1);
  await expect(section.getByText("Live", { exact: true })).toHaveCount(1);
  await expect(
    section.getByRole("link", { name: "View releases for Stackctl" }),
  ).toHaveAttribute("href", "https://github.com/traweezy/stackctl/releases");
  await expect(
    section.getByRole("link", { name: "Visit website for tyschumacher.me" }),
  ).toHaveAttribute("href", "https://www.tyschumacher.me/");
  for (const article of await section.getByRole("article").all()) {
    const screenshot = article.getByRole("img");
    await screenshot.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        screenshot.evaluate(
          (img) =>
            img instanceof HTMLImageElement &&
            img.complete &&
            img.naturalWidth > 0,
        ),
      )
      .toBe(true);
    const original = await article
      .getByRole("link", { name: /Open full screenshot/ })
      .getAttribute("href");
    const response = await request.get(original ?? "");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/webp");
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  const desktop = await section.getByRole("article").evaluateAll((cards) =>
    cards.map((card) => {
      const { x, y, width } = card.getBoundingClientRect();
      return { x, y, width };
    }),
  );
  expect(desktop[0]?.y).toBe(desktop[1]?.y);
  expect(desktop[2]?.y).toBe(desktop[3]?.y);
  expect(desktop[0]?.width).toBeGreaterThan(desktop[1]?.width ?? 0);
  expect(desktop[3]?.width).toBeGreaterThan(desktop[2]?.width ?? 0);
  expect(desktop[4]?.x).toBe(desktop[0]?.x);
  expect(desktop[4]?.width).toBeGreaterThan(desktop[0]?.width ?? 0);
  expect(desktop[4]?.y).toBeGreaterThan(desktop[3]?.y ?? 0);
  await page.setViewportSize({ width: 390, height: 844 });
  const mobile = await section.getByRole("article").evaluateAll((cards) =>
    cards.map((card) => {
      const { x, y } = card.getBoundingClientRect();
      return { x, y };
    }),
  );
  expect(new Set(mobile.map((card) => card.x)).size).toBe(1);
  for (let index = 1; index < mobile.length; index++)
    expect(mobile[index]?.y).toBeGreaterThan(mobile[index - 1]?.y ?? 0);
});

test("destination links announce and open a separate tab", async ({
  page,
  context,
}) => {
  await page.goto("/");
  const originalURL = page.url();
  const destinations = page.locator(
    'a[href^="https://"], a[href^="/images/projects/"]',
  );
  for (const link of await destinations.all()) {
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    await expect(link).toHaveAccessibleDescription("Opens in a new tab");
    await expect(link.locator("svg.lucide-external-link")).toHaveCount(1);
  }

  await context.route("https://web-demo-ce4e.up.railway.app/demo", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<title>Demo destination</title>",
    }),
  );
  for (const name of [
    "Try demo for Relantern",
    "Open full screenshot of Relantern",
  ]) {
    const popupPromise = context.waitForEvent("page");
    await page.getByRole("link", { name, exact: true }).click();
    const popup = await popupPromise;
    await popup.waitForLoadState("domcontentloaded");
    expect(await popup.evaluate(() => window.opener === null)).toBe(true);
    expect(page.url()).toBe(originalURL);
    await popup.close();
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  const menu = page.getByRole("dialog", { name: "Site navigation" });
  for (const name of ["GitHub", "LinkedIn"]) {
    const link = menu.getByRole("link", { name, exact: true });
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAccessibleDescription("Opens in a new tab");
    await expect(link.locator("svg.lucide-external-link")).toBeVisible();
  }
});
