// @ts-check
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import {
  Activity,
  BriefcaseBusiness,
  Container,
  Database,
  ExternalLink,
  GitFork,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  Monitor,
  Phone,
  RadioTower,
  Server,
  Wrench,
} from "lucide-react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { experiences } from "../src/data/experience.ts";
import { secondaryNav } from "../src/data/navigation.ts";
import { profile } from "../src/data/profile.ts";
import { resume } from "../src/data/resume.ts";
import { coreToolItems } from "../src/data/skills.ts";
import { SITE_URL } from "../src/lib/site.ts";

/** @param {string} value */
const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (character) => `&#${character.charCodeAt(0)};`);

/** @param {import("lucide-react").LucideIcon} component */
const icon = (component) =>
  renderToStaticMarkup(
    createElement(component, {
      size: 14,
      strokeWidth: 1.7,
      "aria-hidden": true,
      focusable: false,
    }),
  );

/** @param {string} href @param {string} label @param {import("lucide-react").LucideIcon} component */
const link = (href, label, component = ExternalLink) => {
  if (!["https:", "mailto:", "tel:"].includes(new URL(href).protocol)) {
    throw new Error(`Unsupported resume link: ${href}`);
  }

  return `<a class="contact-item" href="${escapeHtml(href)}">${icon(component)}<span>${escapeHtml(label)}</span></a>`;
};

const contactLinks = secondaryNav
  .filter((item) => item.id !== "resume")
  .map((item) =>
    link(item.href, item.title, item.id === "github" ? GitFork : ExternalLink),
  );

// A compact resume groups tools by purpose while retaining canonical names.
const skillLayout = [
  {
    title: "Frontend",
    icon: Monitor,
    keys: [
      "typescript",
      "react",
      "nextdotjs",
      "tailwindcss",
      "zustand",
      "reactquery",
    ],
  },
  {
    title: "Backend & APIs",
    icon: Server,
    keys: ["go", "openjdk", "nodedotjs", "spring", "graphql", "grpc"],
  },
  { title: "Data stores", icon: Database, keys: ["postgresql", "redis"] },
  {
    title: "Messaging",
    icon: RadioTower,
    keys: ["kafka", "nats", "websocket", "sse"],
  },
  {
    title: "Infrastructure",
    icon: Container,
    keys: ["kubernetes", "docker", "podman"],
  },
  {
    title: "Observability",
    icon: Activity,
    keys: ["grafana", "opentelemetry"],
  },
];
const skillGroups = skillLayout.map((group) => ({
  ...group,
  items: group.keys.map((key) => {
    const item = coreToolItems.find((skill) => skill.icon === key);
    if (!item) throw new Error(`Unknown resume skill: ${key}`);
    return item;
  }),
}));
const groupedKeys = skillLayout.flatMap((group) => group.keys);
if (
  groupedKeys.length !== coreToolItems.length ||
  new Set(groupedKeys).size !== groupedKeys.length
) {
  throw new Error(
    "Every website technology must appear in exactly one resume skill group.",
  );
}

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${escapeHtml(profile.name)} | Resume</title>
    <style>
      @page { size: Letter; margin: 0; }
      * { box-sizing: border-box; }
      body { margin: 0; color: #242831; font: 10.5pt/1.24 Arial, sans-serif; }
      .sheet { width: 8.5in; padding-bottom: 30pt; }
      header { display: grid; grid-template-columns: 1.25fr 1fr; align-items: center; gap: 20pt; padding: 26pt 40pt; background: #252a34; color: #fff; border-bottom: 3pt solid #74c8c1; }
      h1 { margin: 0 0 9pt; font-size: 28pt; line-height: 1.15; letter-spacing: normal; }
      .title { margin: 0; font-size: 12pt; line-height: 1.4; }
      .contacts { display: grid; gap: 7pt; }
      .contact { display: flex; justify-content: flex-end; align-items: center; gap: 10pt; font-size: 9.5pt; line-height: 1.5; }
      .contact-item { display: inline-flex; align-items: center; gap: 4pt; white-space: nowrap; }
      svg { flex: none; width: 11pt; height: 11pt; }
      header svg { color: #9cddd5; width: 10pt; height: 10pt; }
      a { color: inherit; text-decoration-thickness: 0.5pt; text-underline-offset: 2pt; }
      main { padding: 14pt 40pt 0; }
      p { margin: 0; }
      h2 { display: flex; align-items: center; gap: 6pt; margin: 10pt 0 6pt; padding-bottom: 4pt; border-bottom: 0.6pt solid #b9bfc4; font-size: 11pt; line-height: 1.2; letter-spacing: 0.8pt; text-transform: uppercase; }
      h2 svg, .skill-label svg { color: #286f69; }
      article { break-inside: avoid; margin-bottom: 7pt; }
      .row { display: flex; justify-content: space-between; align-items: baseline; gap: 8pt; }
      h3 { margin: 0; font-size: 11pt; line-height: 1.25; }
      .dates, .location { font-size: 9pt; color: #4b515c; white-space: nowrap; }
      .role { margin-top: 1pt; font-size: 10pt; }
      ul { margin: 4pt 0 0; padding-left: 12pt; }
      li { margin-bottom: 1pt; padding-left: 1pt; }
      .skill-row { display: grid; grid-template-columns: 112pt 1fr; gap: 10pt; align-items: center; padding: 2.5pt 0; font-size: 9.5pt; line-height: 1.35; }
      .skill-label { display: flex; align-items: center; gap: 6pt; font-weight: 700; }
      .skill-row + .skill-row { border-top: 0.4pt solid #e1e6e8; }
      .education { margin-bottom: 0; }
      .education p { margin-top: 2pt; font-size: 10pt; }
    </style>
  </head>
  <body>
    <div class="sheet">
      <header>
        <div>
          <h1>${escapeHtml(profile.name)}</h1>
          <p class="title">${escapeHtml(profile.role)}</p>
        </div>
        <div class="contacts">
          <p class="contact"><span class="contact-item">${icon(MapPin)}${escapeHtml(profile.location)}</span>${link(`tel:${resume.phone.replace(/[^+\d]/g, "")}`, resume.phone, Phone)}</p>
          <p class="contact">${link(`mailto:${profile.email}`, profile.email, Mail)}</p>
          <p class="contact">${[link(SITE_URL, new URL(SITE_URL).hostname.replace(/^www\./, ""), Globe), ...contactLinks].join("")}</p>
        </div>
      </header>
      <main>
        <p>${escapeHtml(resume.summary)}</p>
        <section aria-labelledby="experience">
          <h2 id="experience">${icon(BriefcaseBusiness)}Experience</h2>
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
          <h2 id="skills">${icon(Wrench)}Skills</h2>
          ${skillGroups.map((group) => `<div class="skill-row"><p class="skill-label">${icon(group.icon)}${escapeHtml(group.title)}</p><p>${escapeHtml(group.items.map((item) => item.name).join(", "))}</p></div>`).join("")}
        </section>
        <section class="education" aria-labelledby="education">
          <h2 id="education">${icon(GraduationCap)}Education</h2>
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
