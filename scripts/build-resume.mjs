// @ts-check
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

import { experiences } from "../src/data/experience.ts";
import { secondaryNav } from "../src/data/navigation.ts";
import { profile } from "../src/data/profile.ts";
import { resume } from "../src/data/resume.ts";
import { skillGroups } from "../src/data/skills.ts";
import { SITE_URL } from "../src/lib/site.ts";

/** @param {string} value */
const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (character) => `&#${character.charCodeAt(0)};`);

/** @param {string} href @param {string} label */
const link = (href, label) => {
  if (!["https:", "mailto:", "tel:"].includes(new URL(href).protocol)) {
    throw new Error(`Unsupported resume link: ${href}`);
  }

  return `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
};

const contactLinks = secondaryNav
  .filter((item) => item.id !== "resume")
  .map((item) => link(item.href, item.title));

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${escapeHtml(profile.name)} | Resume</title>
    <style>
      @page { size: Letter; margin: 0; }
      * { box-sizing: border-box; }
      body { margin: 0; color: #242831; font: 10.5pt/1.24 Arial, sans-serif; }
      .sheet { width: 8.5in; padding-bottom: 34pt; }
      header { padding: 20pt 40pt 14pt; background: #252a34; color: #fff; border-bottom: 3pt solid #74c8c1; }
      h1 { margin: 0 0 3pt; font-size: 28pt; line-height: 1.1; letter-spacing: -0.5pt; }
      .title { margin: 0 0 6pt; font-size: 12pt; }
      .contact { margin: 3pt 0 0; font-size: 9pt; }
      a { color: inherit; text-decoration-thickness: 0.5pt; text-underline-offset: 2pt; }
      main { padding: 14pt 40pt 0; }
      p { margin: 0; }
      h2 { margin: 10pt 0 6pt; padding-bottom: 3pt; border-bottom: 0.6pt solid #b9bfc4; font-size: 11pt; line-height: 1.2; letter-spacing: 0.8pt; text-transform: uppercase; }
      article { break-inside: avoid; margin-bottom: 7pt; }
      .row { display: flex; justify-content: space-between; align-items: baseline; gap: 8pt; }
      h3 { margin: 0; font-size: 11pt; line-height: 1.25; }
      .dates, .location { font-size: 9pt; color: #4b515c; white-space: nowrap; }
      .role { margin-top: 1pt; font-size: 10pt; }
      ul { margin: 4pt 0 0; padding-left: 12pt; }
      li { margin-bottom: 1pt; padding-left: 1pt; }
      .skills p { margin-bottom: 2pt; font-size: 9.5pt; line-height: 1.35; }
      .education { margin-bottom: 0; }
      .education p { margin-top: 2pt; font-size: 10pt; }
    </style>
  </head>
  <body>
    <div class="sheet">
      <header>
        <h1>${escapeHtml(profile.name)}</h1>
        <p class="title">${escapeHtml(resume.title)}</p>
        <p class="contact">${escapeHtml(profile.location)} &nbsp;·&nbsp; ${link(`mailto:${profile.email}`, profile.email)} &nbsp;·&nbsp; ${link(`tel:${resume.phone.replace(/[^+\d]/g, "")}`, resume.phone)}</p>
        <p class="contact">${[link(SITE_URL, new URL(SITE_URL).hostname.replace(/^www\./, "")), ...contactLinks].join(" &nbsp;·&nbsp; ")}</p>
      </header>
      <main>
        <p>${escapeHtml(resume.summary)}</p>
        <section aria-labelledby="experience">
          <h2 id="experience">Experience</h2>
          ${experiences
            .map(
              (entry) => `<article>
              <div class="row">
                <h3>${escapeHtml(entry.company)}</h3>
                <p class="dates">${escapeHtml(entry.start)} to ${escapeHtml(entry.end ?? "Present")}</p>
              </div>
              <div class="row role">
                <p>${escapeHtml(entry.role)}</p>
                <p class="location">${escapeHtml(entry.location)}</p>
              </div>
              <ul>${entry.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>
            </article>`,
            )
            .join("")}
        </section>
        <section class="skills" aria-labelledby="skills">
          <h2 id="skills">Skills</h2>
          ${skillGroups.map((group) => `<p><strong>${escapeHtml(group.title)}:</strong> ${escapeHtml(group.items.map((item) => item.name).join(", "))}.</p>`).join("")}
        </section>
        <section class="education" aria-labelledby="education">
          <h2 id="education">Education</h2>
          <div class="row">
            <h3>${escapeHtml(resume.education.school)}</h3>
            <p class="dates">${escapeHtml(resume.education.start)} to ${escapeHtml(resume.education.end)}</p>
          </div>
          <p>${escapeHtml(resume.education.degree)}</p>
        </section>
      </main>
    </div>
  </body>
</html>`;

const browser = await chromium.launch();

try {
  const page = await browser.newPage({
    viewport: { width: 816, height: 1056 },
  });
  page.setDefaultTimeout(10_000);
  // All content is local, including contact URLs, which remain PDF annotations.
  await page.route("**/*", (route) => route.abort());
  await page.emulateMedia({ media: "print" });
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);

  const dimensions = await page.evaluate(() => {
    const sheet = document.querySelector(".sheet");
    if (!(sheet instanceof HTMLElement))
      throw new Error("Resume sheet missing.");
    return { height: sheet.scrollHeight, width: sheet.scrollWidth };
  });

  if (dimensions.height > 1056 || dimensions.width > 816) {
    throw new Error(
      `Resume is ${dimensions.width} × ${dimensions.height} px and exceeds one Letter page (816 × 1056 px). Edit the content or spacing and render it again; the published PDF was not replaced.`,
    );
  }

  const pdf = await page.pdf({
    format: "Letter",
    preferCSSPageSize: true,
    printBackground: true,
    tagged: true,
    outline: true,
  });
  // Chromium emits uncompressed page dictionaries; check actual pagination too.
  const pageCount = [...pdf.toString("latin1").matchAll(/\/Type\s*\/Page\b/g)]
    .length;
  if (pageCount !== 1) {
    throw new Error(`Expected one PDF page, received ${pageCount}.`);
  }

  const output = new URL(
    "../public/tyler-schumacher-resume.pdf",
    import.meta.url,
  );
  await writeFile(output, pdf);
  console.log(`Created one-page resume: ${fileURLToPath(output)}`);
} finally {
  await browser.close();
}
