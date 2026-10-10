// @ts-check
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

import { experiences } from "../src/data/experience.ts";
import { secondaryNav } from "../src/data/navigation.ts";
import { profile } from "../src/data/profile.ts";
import { projects } from "../src/data/projects.ts";
import { resume } from "../src/data/resume.ts";
import { coreToolItems } from "../src/data/skills.ts";
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

// A compact resume groups tools by purpose while retaining canonical names.
const skillLayout = [
  {
    title: "Frontend",
    keys: ["typescript", "react", "nextdotjs", "tailwindcss", "zustand", "reactquery"],
  },
  {
    title: "Services, APIs, and data",
    keys: [
      "go",
      "openjdk",
      "nodedotjs",
      "spring",
      "graphql",
      "grpc",
      "postgresql",
      "redis",
    ],
  },
  {
    title: "Messaging",
    keys: ["kafka", "nats", "websocket", "sse"],
  },
  {
    title: "Delivery and observability",
    keys: ["kubernetes", "docker", "podman", "grafana", "opentelemetry"],
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
const selectedProjects = resume.projects.map((resumeProject) => {
  const project = projects.find((item) => item.slug === resumeProject.slug);
  if (!project) throw new Error(`Unknown resume project: ${resumeProject.slug}`);
  const sourceLink = project.links.find((item) => item.kind === "source");
  if (!sourceLink)
    throw new Error(`Resume project has no public source: ${project.slug}`);
  return {
    description: resumeProject.description,
    name: project.name,
    technologies: project.tech.map((item) => item.name),
    url: sourceLink.href,
  };
});
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
      body { margin: 0; color: #242831; font: 10pt/1.18 Arial, sans-serif; }
      .sheet { width: 8.5in; padding: 24pt 40pt; }
      .identity { margin-bottom: 7pt; }
      h1 { margin: 0 0 3pt; color: #17344a; font-size: 23pt; line-height: 1.1; }
      .title { margin: 0 0 4pt; color: #286f69; font-size: 11pt; font-weight: 700; }
      .contact { margin: 2pt 0; font-size: 10pt; line-height: 1.2; }
      a { color: #286f69; text-decoration-thickness: 0.5pt; text-underline-offset: 1pt; }
      p { margin: 0; }
      h2 { margin: 5pt 0 3pt; color: #17344a; font-size: 10.5pt; line-height: 1.15; text-transform: uppercase; break-after: avoid; }
      article { break-inside: avoid; margin-bottom: 3pt; }
      h3 { margin: 0 0 1pt; color: #17344a; font-size: 10.3pt; line-height: 1.18; }
      .meta { color: #4b515c; font-size: 10pt; }
      ul { margin: 2pt 0 0; padding-left: 11pt; }
      li { margin-bottom: 1.2pt; padding-left: 1pt; }
      .project { margin-bottom: 4pt; }
      .project h3 span { font-size: 10pt; font-weight: 400; color: #4b515c; }
      .skill-row { margin-bottom: 2pt; font-size: 10pt; line-height: 1.2; }
    </style>
  </head>
  <body>
    <div class="sheet">
      <div class="identity">
        <h1>${escapeHtml(profile.name)}</h1>
        <p class="title">${escapeHtml(profile.role)}</p>
        <p class="contact">${escapeHtml(profile.location)} | ${link(`tel:${resume.phone.replace(/[^+\d]/g, "")}`, resume.phone)} | ${link(`mailto:${profile.email}`, profile.email)}</p>
        <p class="contact">${[link(SITE_URL, new URL(SITE_URL).hostname.replace(/^www\./, "")), ...contactLinks].join(" | ")}</p>
      </div>
      <main>
        <p>${escapeHtml(resume.summary)}</p>
        <section aria-labelledby="experience">
          <h2 id="experience">Experience</h2>
          ${experiences
            .map(
              (entry) => `<article>
              <h3>${escapeHtml(entry.company)} | ${escapeHtml(entry.role)}</h3>
              <p class="meta">${escapeHtml(entry.start)} to ${escapeHtml(entry.end ?? "Present")} | ${escapeHtml(entry.location)}</p>
              <ul>${entry.bullets
                .slice(
                  0,
                  resume.experienceBulletLimits.find(
                    (limit) => limit.company === entry.company,
                  )?.count,
                )
                .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
                .join("")}</ul>
            </article>`,
            )
            .join("")}
        </section>
        <section class="projects" aria-labelledby="projects">
          <h2 id="projects">Selected personal projects</h2>
          ${selectedProjects
            .map(
              (project) => `<article class="project">
              <h3>${link(project.url, project.name)} <span>| ${escapeHtml(project.technologies.join(", "))}</span></h3>
              <p>${escapeHtml(project.description)}</p>
            </article>`,
            )
            .join("")}
        </section>
        <section class="skills" aria-labelledby="skills">
          <h2 id="skills">Technical skills</h2>
          ${skillGroups.map((group) => `<p class="skill-row"><strong>${escapeHtml(group.title)}:</strong> ${escapeHtml(group.items.map((item) => item.name).join(", "))}</p>`).join("")}
        </section>
        <section class="education" aria-labelledby="education">
          <h2 id="education">Education</h2>
          <p><strong>${escapeHtml(resume.education.school)}</strong> | ${escapeHtml(resume.education.degree)} | ${escapeHtml(resume.education.end)}</p>
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
    if (!(sheet instanceof HTMLElement)) throw new Error("Resume sheet missing.");
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
  const pageCount = [...pdf.toString("latin1").matchAll(/\/Type\s*\/Page\b/g)].length;
  if (pageCount !== 1) {
    throw new Error(`Expected one PDF page, received ${pageCount}.`);
  }

  const output = new URL("../public/Tyler_Schumacher_Resume.pdf", import.meta.url);
  await writeFile(output, pdf);
  console.log(`Created one-page resume: ${fileURLToPath(output)}`);
} finally {
  await browser.close();
}
