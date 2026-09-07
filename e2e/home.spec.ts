import { expect, test } from "@playwright/test";
import { experiences } from "@/data/experience";
import { secondaryNav } from "@/data/navigation";
import { profile } from "@/data/profile";
import { skills } from "@/data/skills";

const commandShortcut = process.platform === "darwin" ? "Meta+K" : "Control+K";

test.describe.configure({ mode: "serial" });

test.describe("Home experience", () => {
  test("renders hero, navigation, and scrolls to experience", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /Tyler Schumacher/i })).toBeVisible();
    const nav = page.getByRole("navigation", { name: /primary/i });
    await expect(nav).toBeVisible();

    const skipLink = page.getByRole("link", { name: /Skip to content/i });
    await expect(skipLink).toHaveAttribute("href", "#main-content");

    const profiles = page.getByRole("navigation", {
      name: "Professional profiles and resume",
    });
    await expect(page.getByText("At a glance", { exact: true })).toHaveCount(0);
    for (const link of secondaryNav) {
      const profileLink = profiles.getByRole("link", { name: link.title });
      await expect(profileLink).toHaveAttribute("href", link.href);
      await expect(profileLink.locator("svg").first()).toBeVisible();
    }

    const viewExperience = page.getByRole("link", {
      name: /Explore projects/i,
    });
    await expect(viewExperience).toHaveAttribute("href", "#projects");

    await expect(page.getByRole("link", { name: /Get in touch/i })).toHaveAttribute(
      "href",
      "#contact",
    );

    const workingModeTrigger = page.getByRole("button", {
      name: /Show working mode/i,
    });
    await workingModeTrigger.click();
    await expect(
      page.getByText(/Interfaces and services teams can rely on/i),
    ).toBeVisible();
    await page.keyboard.press("Escape");

    await expect(page.locator("#projects")).toHaveCount(1);

    await page
      .getByRole("navigation", { name: /primary/i })
      .getByRole("link", { name: /^Experience$/i })
      .click();
    await expect(page.locator("#experience")).toBeVisible();
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
    await page.waitForLoadState("load");

    const header = page.getByRole("banner");
    const initialHeight = await header.evaluate(
      (element) => element.getBoundingClientRect().height,
    );
    expect(initialHeight).toBeGreaterThan(70);

    await page.waitForFunction(() => {
      const el = document.querySelector(".scroll-progress");
      return (
        !!el &&
        el instanceof HTMLElement &&
        el.style.getPropertyValue("--progress-scale") !== ""
      );
    });
    const initialScale = await page.evaluate(() =>
      parseFloat(
        document
          .querySelector<HTMLElement>(".scroll-progress")
          ?.style.getPropertyValue("--progress-scale") ?? "0",
      ),
    );
    expect(initialScale).toBeCloseTo(0, 2);

    await page.mouse.wheel(0, 1400);
    await expect
      .poll(async () => page.evaluate(() => window.scrollY))
      .toBeGreaterThanOrEqual(720);

    await expect
      .poll(async () =>
        header.evaluate((element) => element.getBoundingClientRect().height),
      )
      .toBeLessThan(initialHeight - 8);

    await page.evaluate(() =>
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "auto",
      }),
    );
    await page.waitForFunction(() => {
      const value = parseFloat(
        document
          .querySelector<HTMLElement>(".scroll-progress")
          ?.style.getPropertyValue("--progress-scale") ?? "0",
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
    await dialog.getByRole("option", { name: /Skills/i }).click();
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
    await expect(status).toHaveText(/Thanks! I’ll reach out within two business days\./i);

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
    const experienceSection = page.getByRole("region", { name: /Experience/i });
    await expect(experienceSection).toBeVisible();

    const listItems = experienceSection.getByRole("listitem");
    await expect(listItems.first()).toBeVisible();
    const bulletText = await listItems.nth(1).textContent();
    expect(bulletText).not.toContain("—");
  });

  test("filters experiences by location", async ({ page }) => {
    await page.goto("/");
    const experienceSection = page.getByRole("region", { name: /Experience/i });
    await expect(experienceSection).toBeVisible();

    await experienceSection.getByRole("button", { name: "New York, NY" }).click();
    await expect(experienceSection.locator(".experience-card")).toHaveCount(2);
  });

  test("supports keyboard skip link navigation", async ({ page }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");

    const skipLink = page.getByRole("link", { name: /Skip to content/i });
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page.getByRole("main")).toBeInViewport();
  });

  test("command palette button toggles and closes with escape", async ({ page }) => {
    await page.goto("/");

    const paletteButton = page
      .getByRole("button", { name: /Open command palette/i })
      .first();
    await paletteButton.click();

    const dialog = page.getByRole("dialog", { name: /command palette/i });
    await expect(dialog).toHaveAttribute("data-state", "open");
    await expect(dialog.getByRole("group", { name: /Quick actions/i })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator('[cmdk-dialog][data-state="open"]')).toHaveCount(0);
  });

  test("command palette filters items and displays an empty state", async ({ page }) => {
    await page.goto("/");

    const paletteButton = page
      .getByRole("button", { name: /Open command palette/i })
      .first();
    await paletteButton.click();

    const dialog = page.getByRole("dialog", { name: /command palette/i });
    const input = dialog.getByPlaceholder(/Search sections and links/i);

    await input.fill("zzzz");
    await expect(dialog.getByText(/Nothing found/i)).toBeVisible();

    await input.fill("github");
    const options = dialog.getByRole("option");
    await expect(options).toHaveCount(1);
    await expect(options.first()).toHaveText(/GitHub/i);
  });

  test("command palette external quick action opens in a new tab", async ({ page }) => {
    await page.goto("/");

    const paletteButton = page
      .getByRole("button", { name: /Open command palette/i })
      .first();
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

  test("resume actions download the PDF without leaving the portfolio", async ({
    page,
    context,
    request,
  }) => {
    await page.goto("/");
    const originalURL = page.url();
    const originalTabs = context.pages().length;
    const response = await request.get("/tyler-schumacher-resume.pdf");
    expect(response.headers()["content-disposition"]).toBe(
      'attachment; filename="tyler-schumacher-resume.pdf"',
    );
    expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");

    for (const region of [page.locator("header.site-header"), page.locator("#home")]) {
      const action = region.getByRole("link", {
        name: "Download resume (PDF)",
      });
      const downloadPromise = page.waitForEvent("download");
      await action.click();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe("tyler-schumacher-resume.pdf");
      expect(await download.failure()).toBeNull();
    }

    await page.getByRole("button", { name: "Open command palette" }).first().click();
    const dialog = page.getByRole("dialog", { name: "Command palette" });
    await dialog.getByRole("combobox").fill("resume");
    await expect(dialog.getByRole("option")).toHaveCount(1);
    const paletteDownload = page.waitForEvent("download");
    await dialog.getByRole("option", { name: "Download resume", exact: true }).click();
    expect((await paletteDownload).suggestedFilename()).toBe(
      "tyler-schumacher-resume.pdf",
    );
    await expect(dialog).not.toBeVisible();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Open navigation" }).click();
    const navigation = page.getByRole("dialog", { name: "Site navigation" });
    const mobileDownload = page.waitForEvent("download");
    await navigation.getByRole("link", { name: "Download resume (PDF)" }).click();
    expect((await mobileDownload).suggestedFilename()).toBe(
      "tyler-schumacher-resume.pdf",
    );
    await expect(navigation).not.toBeVisible();
    expect(page.url()).toBe(originalURL);
    expect(context.pages()).toHaveLength(originalTabs);
  });

  test("renders all experience entries with expected metadata", async ({ page }) => {
    await page.goto("/");

    const experienceRegion = page.getByRole("region", { name: /Experience/i });
    await expect(experienceRegion).toBeVisible();

    const cards = experienceRegion.locator(".experience-card");
    await expect(cards).toHaveCount(experiences.length);

    for (const experience of experiences) {
      const card = experienceRegion
        .locator(".experience-card")
        .filter({ hasText: experience.company });
      await expect(card).toContainText(experience.role);
      for (const workType of experience.workTypes ?? []) {
        await expect(card).toContainText(workType.name);
      }
      for (const technology of experience.stack ?? []) {
        await expect(card).toContainText(technology.name);
      }
    }
    await expect(
      experienceRegion.locator(".experience-card__tech").filter({ hasText: /^Git$/ }),
    ).toHaveCount(0);
  });

  test("displays grouped skills with visible decorative icons and working practices", async ({
    page,
  }) => {
    await page.goto("/");

    const aboutRegion = page.getByRole("region", { name: /Skills/i });
    await expect(aboutRegion).toBeVisible();

    await expect(aboutRegion.getByRole("heading", { name: "How I work" })).toBeVisible();
    await expect(aboutRegion.getByText(/Understand the workflow/i)).toBeVisible();

    const skillChips = aboutRegion.locator(".about-skill");
    await expect(skillChips).toHaveCount(skills.length);
    for (const skill of skills) {
      const item = skillChips.filter({ hasText: skill });
      await expect(item).toHaveCount(1);
      await expect(item.locator("svg")).toBeVisible();
      await expect(item.locator("svg")).toHaveAttribute("aria-hidden", "true");
    }
  });

  test("shows contact guidance without exposing direct email", async ({ page }) => {
    await page.goto("/");

    const contactRegion = page.getByRole("region", { name: /Contact/i });
    await expect(contactRegion).toBeVisible();

    const status = page.getByRole("status");
    await expect(status).toHaveText("");

    await expect(contactRegion.getByText(new RegExp(profile.email, "i"))).toHaveCount(0);
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

  test("contact form surfaces service outages with actionable guidance", async ({
    page,
  }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 503,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message:
            "Email service is not configured. Please email tyschumacher@proton.me directly.",
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
    await expect(page.getByText(/Email service is not configured/i)).toBeVisible();
  });

  test("contact form falls back when error responses cannot be parsed", async ({
    page,
  }) => {
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

    const fallbackMessage =
      /We couldn[’']t send your message right now\. Please try again later\./i;
    await expect(page.getByRole("status")).toHaveText(fallbackMessage);
    await expect(page.getByText(fallbackMessage)).toBeVisible();
  });

  test("footer exposes external links and returns to top", async ({ page }) => {
    await page.goto("/");

    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: "auto" }),
    );
    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();

    for (const item of secondaryNav.filter((link) => link.id !== "resume")) {
      await expect(
        footer.getByRole("link", { name: new RegExp(item.title, "i") }),
      ).toHaveAttribute("href", item.href);
    }

    const backToTop = page.getByRole("link", { name: /Back to top/i });
    await backToTop.click();

    await expect(page.locator("#home")).toBeInViewport();
  });
});
