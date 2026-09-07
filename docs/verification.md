# Verification record

The sections below record checks at each review milestone. The owner subsequently
authorized publication and Git pushes on 2026-09-06; final publication results
appear at the end. Earlier statements that no push occurred describe that
milestone, not the final delivery state.

Validated locally on 2026-09-06. Build, lint, format, typecheck, unit/coverage and all 31 browser tests were repeated after the final five-project update. The dependency audit is retained from the preceding bento update, which used the same dependency graph. The Node 24, Trivy, Gitleaks and SBOM results below are retained from the earlier upgrade audit; this follow-up changes no dependencies, contact or deployment code. No production deployment or live contact email was performed.

| Gate                                  | Result                                                                                                                                                        |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frozen pnpm 12.3.4 install            | Passed                                                                                                                                                        |
| Prettier, ESLint, strict TypeScript 7 | Passed                                                                                                                                                        |
| Vitest                                | 29 files, 94 tests passed                                                                                                                                     |
| Coverage                              | Statements 90.65%, branches 84.32%, functions 91.73%, lines 90.91%                                                                                            |
| Production Next.js build              | Passed on Node 26.8.1 and Node 24.20.0                                                                                                                        |
| Node 24 compatibility                 | Unit suite passed; bundled Corepack successfully bootstrapped the pinned pnpm 12.3.4                                                                          |
| Playwright production suite           | 31 tests passed, including light/dark WCAG A/AA checks, mobile navigation, reduced motion, no-JS projects and wide-screen scroll tracking                     |
| Dependency audit                      | Zero known vulnerabilities, including development dependencies                                                                                                |
| Trivy 0.74.0                          | No HIGH/CRITICAL vulnerability, misconfiguration or secret findings in the source scan; local secrets and generated directories excluded                      |
| Gitleaks history scan                 | 129 commits scanned, no leaks found                                                                                                                           |
| CycloneDX SBOM                        | Generated successfully; version 1.7, 175 production components                                                                                                |
| Visual review                         | Headed Chromium and actual Flameshot desktop capture; all five sections at 1440/390 px in light/dark, menu, search, notes, 404 and mocked form error reviewed |
| Git diff whitespace                   | Clean                                                                                                                                                         |

The initial upgrade smoke measurement reported LCP 820 ms and CLS 0. After the visual refinement, a fresh Chromium context at 1440 × 960 reported LCP 272 ms, CLS 0, 310,823 bytes of script transfer, and no page errors. These are individual unthrottled local measurements, not a controlled benchmark, Lighthouse score or production field result. Core Web Vitals field targets and collector configuration are recorded in the audit and README.

The screenshot review caught and resolved an existing active-navigation defect: IntersectionObserver percentage margins could collapse its detection area on a wide viewport. The observer now uses a small pixel band below the header and recalculates on resize. A browser regression test covers scrolling at 1920, 1440 and 390 px.

The no-JavaScript check caught unnecessary Suspense boundaries around static project/experience content. Both now render immediately from local data; project details remain usable without hydration.

## Local review artifacts

These paths are temporary review outputs, not repository dependencies:

- `/tmp/portfolio-refinement-native.png`: cropped real desktop capture of the refined homepage.
- `/tmp/portfolio-refinement-final-native.png`: final cropped desktop capture of Skills.
- `/tmp/portfolio-refined-header-fixed-dark.png`: dark header after the color correction.
- `/tmp/portfolio-refined-1440-light.png` and `-dark.png`: complete desktop page renders.
- `/tmp/portfolio-refined-390-light.png` and `-dark.png`: complete narrow page renders, reviewed in readable section strips.
- `/tmp/portfolio-refined-mobile-menu-loaded.png`: mobile navigation after image loading.
- `/tmp/portfolio-refined-search.png`, `-404.png`, `-contact-error.png`, and `-mobile-notes.png`: additional interface states.
- `/tmp/portfolio-refined-cold-metrics.json`: local smoke measurements.
- `playwright-report/index.html`: browser test report.
- `coverage/index.html`: coverage report.

The refinement review also caught hue drift in a translucent header color mix. The header now uses the opaque surface token, with sRGB alpha mixing for selection and subtle accents. Reduced-motion preferences set transitions to zero. Relevant theme, accessibility and motion checks were repeated after that correction.

## Deployment checks still required

Remote GitHub/GitLab pipelines have not run for these uncommitted local changes. Vercel settings, actual Resend delivery and LinkedIn’s cached preview require the deployment checks in the README. The contact delivery budget is intentionally process-local; a shared edge policy is a deployment concern.

## Recent-project bento review

The four application captures were opened and inspected individually before inclusion. All five portfolio sections were rendered at 1440 px and 390 px in light/dark, including every project card. Browser checks additionally cover 360/768/1920 px overflow, native disclosure keyboard/no-JavaScript access, public asset responses, loaded project images, explicit development/private-source labels, the staging URL, and asymmetric desktop versus ordered mobile placement. All automated light/dark WCAG checks pass.

Current temporary renders: `/tmp/portfolio-bento-1440-light.png`, `/tmp/portfolio-bento-1440-dark.png`, `/tmp/portfolio-bento-390-light.png`, and `/tmp/portfolio-bento-390-dark.png`. The original captures are `/tmp/portfolio-project-waypoint.png`, `/tmp/portfolio-project-remorseless-catalog-ready.png`, `/tmp/portfolio-project-relantern-workspace.png`, and `/tmp/portfolio-project-quanthelm.png`. Full screenshot links use first-party WebP assets; no remote image service, client gallery library, or new runtime dependency was added.

The real desktop review used headed Chromium with X11 and Flameshot; `/tmp/portfolio-bento-native.png` is cropped to the portfolio browser window. The follow-up also found that native scroll targets could sit under the sticky header. Root scroll padding now reserves 6rem, and the project keyboard/no-JavaScript browser check verifies that the disclosure target remains below the header. The production build and relevant browser checks were repeated after this correction.

## Avatar palette review

The avatar-inspired color follow-up passed production build, lint, format, strict typecheck, five relevant metadata/manifest unit tests, and all 31 browser tests, including both themes, WCAG A/AA, responsive overflow, keyboard/no-JavaScript project access, share assets and reduced motion. The focus-clearance browser test now waits for fonts and uses reduced motion before measuring, avoiding a race with initial fragment navigation and header resizing. Dependency and coverage results above remain from the preceding bento audit; this follow-up adds no dependencies or application logic.

All five sections were inspected at 1440 px and 390 px in both themes. `/tmp/portfolio-palette-native.png` is the cropped real Flameshot desktop capture; `/tmp/portfolio-palette-1440-light.png`, `-dark.png`, `/tmp/portfolio-palette-390-light.png` and `-dark.png` are full browser renders. Primary buttons, links and colored chips remain legible; rose and yellow are restrained accents. No push or deployment was performed.

The command palette uses the same three-color accent rule as the profile card. Its light/dark screenshots were inspected, with no automated WCAG violations in either open-overlay state (`/tmp/portfolio-palette-search-light.png` and `-dark.png`).

## Final five-project selection

The final selection is Stackctl, Remorseless Records, Relantern, QuantHelm and the personal website. Waypoint and its asset were removed. The fifth card spans the desktop grid and stacks normally on mobile; screenshot sizing preserves each image’s original aspect ratio. Tests verify five articles and images, three work-in-progress labels, one released label, one live label, two private repositories, actual website/release/staging links, and no Waypoint card. The loading skeleton also reserves five cards.

Production build, lint, format, strict typecheck, 94 unit tests and all 31 browser tests pass; aggregate coverage is 90.65% statements, 84.32% branches, 91.73% functions and 90.91% lines. Updated cards were inspected at 1440 and 390 pixels in both themes. Screenshots are `/tmp/portfolio-five-{1440,390}-{light,dark}.png`; the final real desktop capture is `/tmp/portfolio-five-native.png`. Stackctl’s existing documentation image was inspected directly; the personal site was freshly captured in headed Chromium. The source project checkouts were not changed. Nothing was committed, pushed or deployed.

The final desktop review exposed an additional navigation boundary issue: IntersectionObserver supplies only changed entries, so a departing Home section could leave its highlight stuck while Projects remained visible. The header now retains the intersecting section set and prefers the later section at a shared boundary. Unit coverage and the browser scroll test include opening `/#projects` directly and scrolling to the final card.

## Public demo deployment follow-up

On September 6, the owner authorized Railway hosting for the missing public
previews. Relantern and QuantHelm now have isolated static demo deployments;
their private repositories and application environments retain their previous
visibility and configuration. The portfolio links to the demos and uses fresh
1440 × 1000 headed Chromium captures of their public interfaces.

This follow-up passed portfolio lint, format, strict typecheck, production build
and all 94 unit tests. The updated project-card browser test passed against a
fresh production preview on port 3091. Both project cards were inspected on
mobile and desktop, including a real Flameshot desktop screenshot, with no
project accessibility violations or horizontal page overflow.

The deployed demos passed 1440/390 px browser interactions and automated
accessibility checks, including QuantHelm light/dark themes and Relantern story
and methodology navigation. All 56 Relantern and 33 QuantHelm public asset
checksums match their local export manifests. Both services passed nine HTTP
boundary checks and independent demo container/secret scans. Each demo uses one
web instance and only Railway metadata variables. Their private staging and
production sources, domains and deployment IDs were verified unchanged.

Relantern's full prepush gate passed, followed by successful web checks after
its final explanatory-copy changes. QuantHelm's full private-app gate failed on
seven HIGH findings in its PostgreSQL image; the separate static demo does not
include PostgreSQL and passed its image scan. This finding remains open.

Evidence: `/tmp/portfolio-demo-deploy-20260906`, including
`portfolio-native-desktop.png`, `portfolio-browser-final.json`,
`browser-verification.json`, and `public-http-verification.json`. No commits,
Git pushes or repository visibility changes were made. The portfolio itself
remains local pending approval; only the explicitly authorized demos were
deployed.

## New-tab links and resume downloads

Destination links now share new-tab behavior, external-link icons and accessible
new-tab descriptions. Every resume entry downloads the PDF and uses explicit
download text/iconography; the PDF response is an attachment. Section navigation
continues to work within the page.

Validation passed: lint, formatting, strict typecheck, production build, 94 unit
tests and all 32 browser tests. Coverage is 90.76% statements, 84.61% branches,
91.73% functions and 91.03% lines. Browser tests exercise actual downloads from
the header, hero, mobile menu and command palette, verify the PDF bytes and
attachment header, and confirm destination tabs preserve the portfolio and have
no opener. The final resume-search keyword refinement also passed the command
unit tests and targeted browser checks.

Header/hero, project actions, mobile navigation and command results were inspected
in headed Chromium, with a cropped Flameshot desktop capture. Temporary evidence
is in `/tmp/portfolio-link-behavior-20260906`. No push or deployment was performed.

## Publication preparation

The owner approved public source for Relantern and chose to retain QuantHelm
source privacy. Both public Railway demos remain available. The final portfolio
shows four source links, one explicit “Source private” label, five project cards,
and both demo links. The website card now describes the publication version.

A stale production preview on port 3000 caused the missing-demo-link report;
port 3091 already served the current links. Both preview processes are refreshed
for final browser validation. Publication evidence is retained in
`/tmp/portfolio-publication-20260906`.

Final local publication checks passed: formatting, lint, strict typecheck,
94 unit tests, coverage (90.76% statements, 84.68% branches, 91.73% functions,
91.03% lines), all 32 production-browser tests, dependency audit, SBOM, and
production build. The updated links were inspected in headed Chromium and an
actual Flameshot desktop capture. The personal website screenshot was refreshed.

Both project repositories passed their complete `make prepush` gates.
QuantHelm's seven inherited HIGH libuuid findings were resolved by pinning
Alpine `2.42.3-r1`; its final PostgreSQL scan contains no HIGH/CRITICAL findings.
The scan emitted an unavailable-metadata warning for CVE-2026-80256, retained
in the project audit rather than described as a comprehensive all-severity pass.
Final source scans found no portfolio detections and only the same nine
previously reviewed test/prose detections across the project repositories.
Relantern's local account-provisioning handoff is ignored and excluded from
Docker context; a real build-context sentinel check verified credential
exclusions and preservation of example files.

## Copy and punctuation review

Reviewed the visible site copy, expandable project notes, profile popover,
image descriptions, sharing text, form messages, and downloadable resume.
Reworded awkward compounds and generic phrasing, corrected sentence punctuation,
and used “to” for date ranges. Technical identifiers and destination URLs retain
their required syntax. The resume preserves the existing career details,
education, skills, and contact links in a single page.

Formatting, lint, typecheck, production build, all 94 unit tests, and all 32
browser tests passed. Coverage remains 90.76% statements, 84.68% branches,
91.73% functions, and 91.03% lines. The dependency audit found no known
vulnerabilities. The updated resume also passed the browser download test.

The rendered website copy and image descriptions contain no prose dashes.
Desktop and mobile screenshots were inspected, including an actual Flameshot
desktop capture. The revised PDF was rendered with Poppler and visually checked;
all 11 bullets extract correctly, and all three contact links remain clickable.
Evidence is in `/tmp/portfolio-copy-20260906`.

## Focus, personal impact, and favicon

Rewrote the profile focus and all four experience highlights around transferable
engineering contributions. Replaced “Practice” with “Personal impact” using the
existing career evidence, without adding numerical claims. Removed the decorative
TS badge and aligned experience labels with a shared grid that stacks on mobile.

Restored the original avatar ICO byte for byte from the revision before
`60b3a0e`, removed the SVG override, and versioned the favicon URL to refresh
browser caches. The personal website screenshot now shows the revised profile
card and has a filename tied to its image revision.

Formatting, lint, typecheck, production build, all 94 unit tests, and all 32
browser tests passed. Coverage remains above the configured thresholds, and the
dependency audit found no known vulnerabilities. Browser checks confirm a single
ICO favicon declaration and a valid ICO response. Headed desktop and mobile
screenshots, including actual Flameshot captures, confirm the badge removal,
avatar favicon, readable text, and aligned highlights without horizontal overflow.
Evidence is in `/tmp/portfolio-focus-20260906`.

## Resume alignment

Reconciled the downloadable resume with the current website and the saved
September 6 LinkedIn profile refresh and recruiter audit. The saved audit records
the published profile wording; direct LinkedIn access was unavailable during
this follow-up. No LinkedIn changes were made. The senior frontend and full stack
positioning, engineering roles, dates, and contributions are consistent across
those sources. Education and phone information retain the original resume facts.

The resume now includes the website's complete 23-technology list and a visible
portfolio link. All four engineering roles and 11 contribution bullets remain.
A maintained Playwright generator reads shared website data, escapes content,
blocks network access, and refuses to replace the PDF when it exceeds one page.
The initial overlong layout exercised that refusal without replacing the asset.
Resume generation passes on Node 26.8.1 and Node 24.20.0.

Poppler rendering and visual inspection confirm readable typography, aligned
dates, and unclipped content on one Letter page. Independent PDF parsing confirms
all shared source text, education, five clickable contact/destination links, and
document accessibility tags. The PDF contains selectable text and embedded fonts.
Temporary evidence is in `/tmp/portfolio-resume-sync-20260906`.

Formatting, lint, strict typechecking, the production build, all 94 unit tests,
and the resume download browser test pass. Coverage is 90.66% statements, 84.68%
branches, 91.73% functions, and 90.92% lines. The dependency audit reports no known
vulnerabilities. The browser check verifies downloads through the header, hero,
mobile menu, and command palette without navigating away from the portfolio.

## Resume spacing and skills refinement

Spread the resume header across identity and contact columns, increased its
padding and line spacing, and removed condensed name tracking. Added decorative
Lucide icons to contact details, section headings, and skill categories. Skills
now have six distinct groups, with aligned labels and subtle row separators.
The generator verifies that every website technology appears exactly once.

Tightened the shared experience sentences while preserving all four roles,
11 contributions, dates, and supported claims. Both website and resume consume
the revised copy. The PDF retains its body font size, all 23 technologies, five
clickable links, accessibility tags, and one Letter page.

Poppler output and an actual Flameshot desktop capture of the PDF in Okular were
inspected for clipping, spacing, icon rendering, and alignment. Independent PDF
parsing verifies all shared content and links. Formatting, lint, strict typecheck,
production build, 94 unit tests, and all 19 main browser tests pass; coverage is
above every configured threshold and the dependency audit has no known findings.
Evidence is in `/tmp/portfolio-resume-header-20260906`.


## Biome migration

The owner requested replacing the lint and format stack with Biome. Biome 2.5.12
now supplies the shared local, editor, hook, and CI configuration. The earlier
Prettier and ESLint results above are historical; neither package remains in the
current dependency graph. See [Biome tooling](biome-migration.md) for rule mappings,
format support, class sorting limitations, and local timing observations.

The frozen install, Biome CI check, strict typecheck, production build, 94 unit
tests, and all 53 browser tests pass locally. Coverage is 89.25% statements,
83.78% branches, 90.42% functions, and 89.49% lines. The dependency audit reports
no known vulnerabilities, and the production CycloneDX SBOM is regenerated.

The browser suite covers desktop, phone and tablet behavior in Chromium and
WebKit, including both themes, accessibility, search, downloads, and contact
feedback. Headed Chromium and actual Flameshot desktop captures confirm the
header and short landscape drawer still render correctly. Temporary screenshots
are stored in `/tmp/portfolio-biome`.


## Parallax header and experience timeline

The supplied Buffalo skyline image now backs a visibly slower scrolling layer.
“At a glance” is removed, experience precedes projects throughout navigation,
and the experience rail, current role marker, filter contrast, and anchor
spacing have been verified. The personal website project screenshot is current.
Details and research references: [header and timeline audit](hero-timeline-audit.md).

The final production build, Biome, strict typecheck, and all 94 unit tests pass.
Coverage is 89.23% statements, 83.93% branches, 90.38% functions, and 89.47% lines.
All 60 browser cases pass across the final full run and the focused rerun of the
three hero/timeline cases. The latter corrects the test to use real Tab navigation
when checking `:focus-visible`. Dependency audit reports no known vulnerabilities;
the production CycloneDX SBOM is regenerated.

The additional visual audit covers 15 configurations in Chromium, WebKit, and
Firefox, from 320 × 568 to 2560 × 1440. It checks the hero, scroll state, all four
content sections, timeline ending, project cards, light/dark themes, live changes
to reduced motion, image loading, and content bounds. All configurations report
zero accessibility violations, zero page exceptions, and zero horizontal text
or control overflow. WebKit uses the local HTTPS preview; live TLS is checked
separately after deployment. Firefox currently exercises the static fallback.

Native headed Chromium was driven through desktop scrolling, dark theme,
location filtering, projects, tablet/phone layouts, and a short landscape menu.
Flameshot screenshots were inspected, including the corrected selected-filter
text and the updated image crop. Before/after artifacts and per-section captures
are retained locally under `/tmp/portfolio-hero/`.

A 350 CSS pixel desktop scroll moves the image layer approximately 213 pixels
relative to the document, so the skyline moves about 137 pixels on screen while
the foreground moves 350. Phone samples show approximately 86 to 102 pixels of
relative image travel. No new JavaScript animation loop or runtime dependency is
needed. Local observed LCP ranges from 96 to 1980 ms and CLS remains below 0.007,
including a cold image optimization request during concurrent browser checks.
These are unthrottled local observations, not field performance percentiles.
The 2048-pixel AVIF response is 42,921 bytes; the original WebP is 278,298 bytes.

## Replacement high resolution banner

The owner supplied a new 6516 × 2172 website banner. Its complete PNG source is
preserved under a content-hashed filename, replacing the previous WebP. The
mobile crop keeps both City Hall and the buffalo motif visible, and the website
project preview has been recaptured. The parallax behavior is unchanged.

The production build and dependency audit pass. Eight focused browser cases
cover the header, navigation, timeline, motion, and phone/tablet layouts in
Chromium and WebKit. Four headed Chromium configurations, from 390 to 2560
pixels wide, have no hero accessibility violations, page errors, or horizontal
overflow. Actual Flameshot desktop and phone captures were inspected before and
after the replacement. Artifacts are in `/tmp/portfolio-banner-v2/`.

With device pixel ratio 1, the optimized image is 72,003 bytes at 1920 pixels and
190,483 bytes at 3840 pixels, below the 300 KB delivery target. Higher density
displays select larger candidates. The original 11.8 MB PNG stays on the server;
the header loads the optimized image response.

CI's Chrome phone thumbnail request remained pending over HTTP, including with
a longer assertion wait. The same mobile flow passed locally with a cold image
cache and two CPU cores, and on the live HTTPS site. All browser profiles now
use the existing local HTTPS preview to match production transport and CSP.
The normal image assertion timeout is retained. Certificate exceptions apply
only to the local test certificate; deployed checks validate real TLS.
