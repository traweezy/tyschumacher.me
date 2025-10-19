import { expect, test } from "@playwright/test";
import { experiences } from "@/data/experience";
import { primaryNav, secondaryNav } from "@/data/navigation";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { PROJECT_SLOTS } from "@/components/projects/layout";
import { skills } from "@/data/skills";

const commandShortcut = process.platform === "darwin" ? "Meta+K" : "Control+K";

test.describe.configure({ mode: "serial" });

test.describe("Home experience", () => {
  test("renders hero, navigation, and scrolls to projects", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /Tyler Schumacher/i })).toBeVisible();
    const nav = page.getByRole("navigation", { name: /primary/i });
    await expect(nav).toBeVisible();

    const skipLink = page.getByRole("link", { name: /Skip to content/i });
    await expect(skipLink).toHaveAttribute("href", "#main-content");

    const focusAreas = page.locator(".hero__pill");
    await expect(focusAreas).toHaveCount(3);
    await expect(focusAreas.first()).toHaveText(/Realtime platforms/i);

    const viewExperience = page.getByRole("link", { name: /View experience/i });
    await expect(viewExperience).toHaveAttribute("href", "#experience");

    const resumeLink = page.getByRole("link", { name: /^Download résumé$/i });
    await expect(resumeLink).toHaveAttribute("download", "");
    await expect(resumeLink).toHaveAttribute("href", "/tyler-schumacher-resume.pdf");

    await page.getByRole("link", { name: /Projects/i }).click();
    await expect(page.locator("#projects")).toBeVisible();
  });

  test("condenses header and updates scroll progress fallback when CSS animation timeline is unavailable", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      if (typeof window === "undefined" || typeof window.CSS?.supports !== "function") {
        return;
      }
      const css = window.CSS;
      const originalSupports = css.supports.bind(css);
      const override: typeof css.supports = (...args: [string] | [string, string]) => {
        const [first, second] = args;
        if (typeof first === "string" && first.includes("animation-timeline")) {
          return false;
        }
        if (typeof second === "string" && second.includes("animation-timeline")) {
          return false;
        }
        if (args.length === 1) {
          return originalSupports(args[0]);
        }
        return originalSupports(args[0], args[1]);
      };
      css.supports = override;
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const header = page.getByRole("banner");
    const initialHeight = await header.evaluate((element) => element.getBoundingClientRect().height);
    expect(initialHeight).toBeGreaterThan(70);

    await page.waitForFunction(() => {
      const el = document.querySelector(".scroll-progress");
      return !!el && el instanceof HTMLElement && el.style.getPropertyValue("--progress-scale") !== "";
    });
    const initialScale = await page.evaluate(() =>
      parseFloat(
        document.querySelector<HTMLElement>(".scroll-progress")?.style.getPropertyValue("--progress-scale") ?? "0",
      ),
    );
    expect(initialScale).toBeCloseTo(0, 2);

    await page.mouse.wheel(0, 1400);
    await expect
      .poll(async () => page.evaluate(() => window.scrollY))
      .toBeGreaterThanOrEqual(720);

    await expect
      .poll(async () => header.evaluate((element) => element.getBoundingClientRect().height))
      .toBeLessThan(initialHeight - 8);

    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "auto" }));
    await page.waitForFunction(() => {
      const value = parseFloat(
        document.querySelector<HTMLElement>(".scroll-progress")?.style.getPropertyValue("--progress-scale") ?? "0",
      );
      return value > 0.9;
    });
  });

  test("invokes the command palette shortcut", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press(commandShortcut);

    const dialog = page.getByRole("dialog", { name: /command palette/i });
    await expect(dialog).toHaveAttribute("data-state", "open");
    await expect(dialog.getByText(/Quick actions/i)).toBeVisible();
    await dialog.getByRole("option", { name: /About/i }).click();
    await expect(page.locator("#about")).toBeVisible();
  });

  test("submits contact form successfully", async ({ page }) => {
    await page.route("**/api/contact", async (route) => {
      const requestBody = JSON.parse(route.request().postData() ?? "{}");
      expect(requestBody).toMatchObject({
        name: "Playwright User",
        email: "user@example.com",
        message: "Looking forward to working together.",
      });
      await new Promise((resolve) => setTimeout(resolve, 200));
      await route.fulfill({
        status: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: "Message sent." }),
      });
    });

    await page.goto("/");
    const nameField = page.getByLabel("Name");
    const emailField = page.getByLabel("Email");
    const messageField = page.getByLabel(/How can I help/i);
    await nameField.fill("Playwright User");
    await emailField.fill("user@example.com");
    await messageField.fill("Looking forward to working together.");

    const submitButton = page.locator('form button[type="submit"]');
    await submitButton.click();

    await expect(submitButton).toBeDisabled();

    const status = page.getByRole("status");
    await expect(status).toHaveText(
      /Thanks! I’ll reach out within two business days\./i,
    );

    await expect(submitButton).toHaveText("Send message");
    await expect(submitButton).toBeEnabled();

    await expect(nameField).toHaveValue("");
    await expect(emailField).toHaveValue("");
    await expect(messageField).toHaveValue("");
  });

  test("surfaces server validation errors", async ({ page }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 400,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: "Please double check the highlighted fields.",
          errors: [{ field: "email", message: "Zap! That address bounced" }],
        }),
      });
    });

    await page.goto("/");
    await page.getByLabel("Name").fill("Playwright User");
    await page.getByLabel("Email").fill("broken-address@example.com");
    await page.getByLabel(/How can I help/i).fill("Message with invalid email.");
    await page.locator('form button[type="submit"]').click();

    await expect(page.getByText(/Zap! That address bounced/i)).toBeVisible();
  });

  test("exposes experience data as bullet list", async ({ page }) => {
    await page.goto("/");
    const experienceSection = page.locator("#experience");
    await expect(experienceSection).toBeVisible();

    const listItems = experienceSection.getByRole("listitem");
    await expect(listItems.first()).toBeVisible();
    const bulletText = await listItems.nth(1).textContent();
    expect(bulletText).not.toContain("—");
  });

  test("supports keyboard skip link navigation", async ({ page }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");

    const skipLink = page.getByRole("link", { name: /Skip to content/i });
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page.getByRole("main")).toBeInViewport();
    const hash = await page.evaluate(() => window.location.hash);
    expect(hash).toBe("#main-content");
  });

  test("command palette button toggles and closes with escape", async ({ page }) => {
    await page.goto("/");

    const paletteButton = page.getByRole("button", { name: /Open command palette/i }).first();
    await paletteButton.click();

    const dialog = page.getByRole("dialog", { name: /command palette/i });
    await expect(dialog).toHaveAttribute("data-state", "open");
    await expect(dialog.getByRole("group", { name: /Quick actions/i })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator('[cmdk-dialog][data-state="open"]')).toHaveCount(0);
  });

  test("command palette filters items and displays an empty state", async ({ page }) => {
    await page.goto("/");

    const paletteButton = page.getByRole("button", { name: /Open command palette/i }).first();
    await paletteButton.click();

    const dialog = page.getByRole("dialog", { name: /command palette/i });
    const input = dialog.getByPlaceholder(/Jump to a section or open a resource/i);

    await input.fill("zzzz");
    await expect(dialog.getByText(/Nothing found/i)).toBeVisible();

    await input.fill("git");
    const options = dialog.getByRole("option");
    await expect(options).toHaveCount(1);
    await expect(options.first()).toHaveText(/GitHub/i);
  });

  test("command palette external quick action opens in a new tab", async ({ page }) => {
    await page.goto("/");

    const paletteButton = page.getByRole("button", { name: /Open command palette/i }).first();
    await paletteButton.click();
    const dialog = page.getByRole("dialog", { name: /command palette/i });
    await expect(dialog).toHaveAttribute("data-state", "open");

    const popupPromise = page.waitForEvent("popup");
    await dialog.getByRole("option", { name: /GitHub/i }).click();
    const popup = await popupPromise;
    await popup.waitForLoadState("domcontentloaded");
    await expect(popup).toHaveURL(/github\.com\/traweezy/i);
    await popup.close();
  });

  test("command palette resume quick action triggers download in a new tab", async ({ page }) => {
    await page.goto("/");

    const paletteButton = page.getByRole("button", { name: /Open command palette/i }).first();
    await paletteButton.click();
    const dialog = page.getByRole("dialog", { name: /command palette/i });
    await expect(dialog).toHaveAttribute("data-state", "open");

    await page.evaluate(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__resumeHref = null;
      window.open = (url: string | URL | undefined) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__resumeHref = typeof url === "string" ? url : url?.toString() ?? "";
        return null;
      };
    });

    await dialog.getByRole("option", { name: /Resume/i }).click();
    await expect
      .poll(async () =>
        page.evaluate(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (window as any).__resumeHref as string | null;
        }),
      )
      .toMatch(/\/tyler-schumacher-resume\.pdf$/i);
  });

  test("renders projects grid with all project cards", async ({ page }) => {
    await page.goto("/");

    const projectsRegion = page.getByRole("region", { name: /Projects/i });
    await expect(projectsRegion).toBeVisible();

    const cards = projectsRegion.getByRole("article");
    await expect(cards).toHaveCount(PROJECT_SLOTS.length);

    const headingTexts = (await projectsRegion.locator("article h3").allTextContents()).map((text) =>
      text.trim(),
    );
    const knownProjectNames = new Set(projects.map((project) => project.name));
    headingTexts.forEach((heading) => {
      expect(knownProjectNames.has(heading)).toBe(true);
    });

    const media = projectsRegion.locator('article img[alt]');
    await expect(media).toHaveCount(PROJECT_SLOTS.length);

    const disabledCtas = projectsRegion.locator('[aria-disabled="true"]');
    await expect(disabledCtas).toHaveCount(PROJECT_SLOTS.length);
  });

  test("renders all experience entries with expected metadata", async ({ page }) => {
    await page.goto("/");

    const experienceRegion = page.getByRole("region", { name: /Experience/i });
    await expect(experienceRegion).toBeVisible();

    const cards = experienceRegion.getByRole("listitem");
    await expect(cards).toHaveCount(experiences.length);

    for (const experience of experiences) {
      await expect(experienceRegion.getByText(experience.company)).toBeVisible();
      await expect(experienceRegion.getByText(experience.role)).toBeVisible();
    }
  });

  test("displays about section skills and profile context", async ({ page }) => {
    await page.goto("/");

    const aboutRegion = page.getByRole("region", { name: /About/i });
    await expect(aboutRegion).toBeVisible();

    await expect(aboutRegion.getByText(profile.bio[0])).toBeVisible();
    await expect(aboutRegion.getByText(profile.bio[1])).toBeVisible();

    const skillChips = aboutRegion.locator(".about-skill");
    await expect(skillChips).toHaveCount(skills.length);
    for (const skill of skills) {
      await expect(skillChips.filter({ hasText: skill })).toHaveCount(1);
    }
  });

  test("shows contact guidance and default status message", async ({ page }) => {
    await page.goto("/");

    const contactRegion = page.getByRole("region", { name: /Contact/i });
    await expect(contactRegion).toBeVisible();

    const status = page.getByRole("status");
    await expect(status).toHaveText(new RegExp(profile.email, "i"));

    await expect(contactRegion.getByRole("link", { name: profile.email })).toHaveAttribute(
      "href",
      `mailto:${profile.email}`,
    );
  });

  test("validates contact form fields on blur", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel("Name").focus();
    await page.getByLabel("Email").focus();
    await page.getByLabel("Name").blur();
    await page.getByLabel("Email").blur();
    await page.getByLabel(/How can I help/i).focus();
    await page.getByLabel(/How can I help/i).blur();

    await expect(page.getByText(/Tell me your name/i)).toBeVisible();
    await expect(page.getByText(/Use a valid email/i)).toBeVisible();
    await expect(page.getByText(/Add more context so I can help/i)).toBeVisible();
  });

  test("contact form surfaces service outages with actionable guidance", async ({ page }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 503,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: "Email service is not configured. Please email tyschumacher@proton.me directly.",
        }),
      });
    });

    await page.goto("/");
    await page.getByLabel("Name").fill("Service Outage User");
    await page.getByLabel("Email").fill("outage@example.com");
    await page.getByLabel(/How can I help/i).fill("Testing outage handling.");

    await page.locator('form button[type="submit"]').click();

    const status = page.getByRole("status");
    await expect(status).toHaveText(/Email service is not configured/i);
    await expect(page.getByLabel(/How can I help/i)).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText(/Email service is not configured/i)).toBeVisible();
  });

  test("contact form falls back when error responses cannot be parsed", async ({ page }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 502,
        headers: { "content-type": "text/plain" },
        body: "Bad Gateway",
      });
    });

    await page.goto("/");
    await page.getByLabel("Name").fill("Fallback User");
    await page.getByLabel("Email").fill("fallback@example.com");
    await page.getByLabel(/How can I help/i).fill("Testing fallback guidance.");

    await page.locator('form button[type="submit"]').click();

    const fallbackMessage = new RegExp(
      `We couldn[’']t send your message right now\\. Please email ${profile.email.replace(/\./g, "\\.")} instead\\.`,
      "i",
    );
    await expect(page.getByRole("status")).toHaveText(fallbackMessage);
    await expect(page.getByText(fallbackMessage)).toBeVisible();
  });

  test("footer exposes external links and returns to top", async ({ page }) => {
    await page.goto("/");

    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "auto" }));
    await expect(page.getByRole("contentinfo")).toBeVisible();

    for (const item of secondaryNav.filter((link) => link.id !== "resume")) {
      await expect(page.getByRole("link", { name: new RegExp(item.title, "i") })).toHaveAttribute(
        "href",
        item.href,
      );
    }

    const backToTop = page.getByRole("link", { name: /Back to top/i });
    await backToTop.click();

    await expect(page.locator("#home")).toBeInViewport();
  });
});

test.describe("Mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens sheet navigation and closes after selection", async ({ page }) => {
    await page.goto("/");

    const openNavButton = page.getByRole("button", { name: /Open navigation/i });
    await openNavButton.click();

    const mobileNav = page.getByRole("navigation", { name: /Mobile navigation/i });
    await expect(mobileNav).toBeVisible();

    for (const item of primaryNav) {
      await expect(mobileNav.getByRole("link", { name: item.title })).toBeVisible();
    }

    await mobileNav.getByRole("link", { name: /About/i }).click();

    await expect(mobileNav).not.toBeVisible();

    const hash = await page.evaluate(() => window.location.hash);
    expect(hash).toBe("#about");
  });
});
