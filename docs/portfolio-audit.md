# Portfolio audit and research

Evidence reviewed 2026-09-06. The owner authorized publication and Git pushes on this date. Relantern source is approved for public access; QuantHelm source remains private with an isolated public demo.

## Presentation decision

Five projects form one bento showcase: Stackctl, Remorseless Records, Relantern, QuantHelm, and the personal website. Waypoint and the “More projects” subsection are removed. Each card includes an actual application image, purpose, technologies, explicit release/development status, and preview availability. Contribution and engineering decisions remain in native expandable details. QuantHelm has a “Source private” label beside its public demo; the other four projects link to public source.

The asymmetric grid follows the owner’s preference. On wide screens, larger and smaller cards alternate and the final website card spans the grid with its image beside the description; on narrow screens, the same reading order becomes one column. Repeated title, status, and action placement limits the scanning cost of variable card sizes. This follows the tradeoffs in [NN/g’s Cards: UI-Component Definition](https://www.nngroup.com/articles/cards-component/) (Page Laubheimer, November 2016). [Brittany Chiang](https://brittanychiang.com/) provides a current first-party example of screenshots, concise descriptions and technology labels; [Paco Coursey](https://paco.me/) demonstrates concise product explanations and direct links. These observations do not establish a causal hiring benefit or a universal trend.

Color-coded technology, skill and domain chips share one set of light/dark tokens. Visible labels and decorative icons preserve meaning independently of hue, following [W3C’s Use of Color guidance](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html). All labels must retain at least 4.5:1 contrast.

## Current project evidence

| Project             | Inspected revision and sources                                                                                                                                                                                                                                                                                                                 | Implemented scope and limits                                                                                                                                                                                                                                                      |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stackctl            | `090faa16e0cf8ac4606f811cf902da639dcec21d`, May 23. [Source](https://github.com/traweezy/stackctl/tree/090faa16e0cf8ac4606f811cf902da639dcec21d), README, `cmd/tui.go`, `internal/tui/tui.go`, CLI docs and Go modules. Public.                                                                                                                | Go CLI and Bubble Tea dashboard for Podman stacks, named profiles, health, logs and masked connection details. [Public releases](https://github.com/traweezy/stackctl/releases) verified; latest listed tag `v0.20.1`. Linux/macOS, 0.x, no hosted web demo.                      |
| Personal website    | This local working tree, based on `35c86b4fe50e1b79d9bb1ddcae7a45638a56e504`. [Public source](https://github.com/traweezy/tyschumacher.me); project rendering, contact API, metadata and browser tests inspected.                                                                                                                              | [Live site](https://www.tyschumacher.me/) verified reachable. The homepage capture documents the redesigned portfolio; deployment is verified separately from screenshot provenance.                                                                                              |
| Remorseless Records | `2354e7544c77c0c23f1486b9e3ef43e0740d51a9`, September 6. [Source](https://github.com/traweezy/remorseless-records/tree/2354e7544c77c0c23f1486b9e3ef43e0740d51a9), especially `backend/src/lib/payment-lifecycle/process-stripe-event.ts`, `backend/src/api/admin/news/command.ts` and `storefront/playwright.cross-browser.config.ts`. Public. | Catalog, cart, checkout recovery, editorial/admin workflows. [Public staging](https://storefront-staging-41f0.up.railway.app/) returned 200 and rendered successfully. Existing production store is an older implementation.                                                      |
| Relantern           | `568982c12b97f1599466e8af9f9d0717de255565`, August 30. [Source](https://github.com/traweezy/relantern/tree/568982c12b97f1599466e8af9f9d0717de255565), especially demo contract, `internal/extraction/validate.go` and `internal/search/pgstore/store.go`. Public-source publication authorized.                                                | Evidence-linked developer brief, claim validation, PostgreSQL lexical/vector search. [Public illustrative demo](https://web-demo-ce4e.up.railway.app/demo) is deployed separately; live ingestion, delivery and readiness remain incomplete.                                      |
| QuantHelm           | `a17097edab2c1a5685a2dd869d3ff437892f355b`, August 29. [Source](https://github.com/traweezy/quanthelm/tree/a17097edab2c1a5685a2dd869d3ff437892f355b), particularly local backend ledger, `apps/web/src/app/demo/page.tsx` and dashboard/demo modules. Private.                                                                                 | Portfolio/positions, paper-order ledger, risk/reconciliation indicators and exact-decimal contracts. [Public synthetic demo](https://web-demo-b7d9.up.railway.app/demo) is deployed separately; research, strategy execution, live trading and account access remain unavailable. |

Repository visibility, default branches and current revisions were checked through authenticated read-only GitHub access. Important claims were checked against implementation as well as README text. Repository activity is not evidence of adoption, employment or measured impact. Existing unrelated changes in the project checkouts were preserved.

## Screenshot provenance and preview links

The three retained application images were captured in headed Chromium on September 6, 2026, at 1440 × 1000. The personal website image is a fresh 1440 × 660 capture of the local homepage in headed Chromium. Stackctl uses the repository’s existing `docs/media/tui-services.png` (1600 × 1017), inspected before conversion; its illustrative version, time, and services are documentation example data, not proof of live deployment. All images are encoded as WebP without changing interface content; intrinsic dimensions are reserved and responsive renditions are lazy loaded. Clicking a preview opens its full image.

| Asset                      | Capture source                                                                                  | Context shown to visitors                                                       |
| -------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `stackctl.webp`            | Existing Stackctl repository TUI screenshot, `docs/media/tui-services.png`                      | Documentation example; service state is illustrative and secrets are masked     |
| `personal-website.webp`    | Current local portfolio homepage, actual headed Chromium capture                                | Local redesign preview; the public website still serves its previous version    |
| `remorseless-records.webp` | Public staging `/catalog`, after rejecting nonessential cookies and waiting for product artwork | Staging catalog, not the existing production site                               |
| `relantern.webp`           | Railway public demo `/demo`, scrolled to the Today workspace                                    | Illustrative stories; no private account, database or live provider used        |
| `quanthelm.webp`           | Railway public demo `/demo`                                                                     | Read-only synthetic portfolio; no broker, account or external service connected |

A local build or staging screenshot does not prove that the deployed bytes equal the inspected Git revision. The captions deliberately describe the capture environment. Remorseless receives its verified “View staging” link; the personal website has “Visit website” and source links; Stackctl has releases and source links. Relantern and QuantHelm link to their verified Railway demo deployments. Relantern also links to its public source; QuantHelm retains a private-source label by owner choice. No localhost links or fabricated hosted URLs are shipped. Their source trees now include isolated static-export targets, deployment packaging, HTTP boundary tests and runbooks; the owner subsequently authorized Git pushes and Relantern source publication.

## Web audit and fixes

| Finding                                                                                                | Resolution                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Sharing used SVG, which was an unreliable cross-platform preview; Twitter had no explicit raster image | Branded PNG, absolute Open Graph and Twitter image URLs, dimensions, alt text and MIME type                                                  |
| Canonical metadata differed from the live www redirect                                                 | Single canonical origin `https://www.tyschumacher.me`                                                                                        |
| Missing crawler/installation basics                                                                    | robots.txt, sitemap.xml, web manifest, consistent SVG/PNG/ICO identity                                                                       |
| Projects existed as unused fictional content with placeholder links                                    | Real, source-backed projects rendered directly after the hero; navigation and command palette updated                                        |
| Missing route recovery                                                                                 | 404 page, noindex behavior and error retry UI                                                                                                |
| Contact reads and delivery had no explicit bounds                                                      | 16 KiB input limit, 10-second read and provider timeouts, per-instance delivery budget, origin checks and problem responses                  |
| Browser exporter imported eagerly even without a production collector                                  | Lazy OTLP code, production opt-in, sanitized vital attributes, explicit HTTPS collector validation                                           |
| Inactive experimental themes inflated CSS                                                              | Removed inactive theme selectors while preserving both supported Civic palettes; global CSS approximately 105 KB → 57 KB before minification |
| Stale GitLab jobs skipped builds and targeted `/products`                                              | Portfolio build/browser gates enabled; accessibility included in browser suite; pinned scanner containers replace remote installer pipelines |

[LinkedIn’s sharing guidance](https://www.linkedin.com/help/linkedin/answer/a521928) and [Next.js metadata guidance](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) informed the image fix. A deployed URL still needs to be re-fetched by LinkedIn; local verification cannot prove cache refresh on its service.

## Upgrade record and deliberate holds

All direct dependency versions were checked against registry stable tags. The final `pnpm outdated` result contains only ESLint.

- Next.js 16.3.4, React 19.2.8, Tailwind 4.3.3, pnpm 12.3.4, Vite 8.2.2, Vitest 5.0.0, Playwright 1.63.0 and the current stable app libraries are locked.
- Typechecking uses native TypeScript 7.0.2. The official `@typescript/typescript6` compatibility package remains aliased as `typescript` because Next.js and lint tooling consume the JavaScript API, which TypeScript 7 does not yet expose. This follows [Microsoft’s TypeScript 7 migration guidance](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/).
- ESLint stays on 9.39.5: the current `eslint-plugin-react` peer range does not support ESLint 10. The user accepted this compatibility hold. Do not bypass peer validation to force the major upgrade.
- Local/primary CI uses Node 26.8.1. Node 24 remains the deployment compatibility target because [Vercel’s runtime support](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions) currently stops at 24.
- pnpm 12 uses its canonical peer lockfile and explicit build-script approvals. A 24-hour minimum release age is enforced. `bidi-js` is held at 1.0.3 while the new 1.1.0 release is inside that window; review before removing the override. Other overrides retain patched transitive dependency floors.
- The package is now ESM. Vitest uses `import.meta.dirname`; jsdom 30 tests extend the actual document rather than replacing its read-only global.

## Supply chain and licensing

`pnpm audit` checks production and development dependencies. `pnpm run sbom` creates an ignored CycloneDX production report; CI retains it as an artifact. Trivy scans source/lockfile vulnerabilities, configuration and secrets; Gitleaks scans Git history.

The production license inventory contains permissive SPDX licenses plus CC-BY-4.0 for caniuse-lite data. The visual refinement removed the timeline dependency in favor of a native ordered chronology. Keep the upstream licenses in redistributed packages. See `THIRD_PARTY_NOTICES.md` for screenshot provenance and icon notices.

## Performance and operating targets

Targets: mobile field p75 LCP ≤2.5 seconds, INP ≤200 ms, CLS ≤0.1; no horizontal page overflow at 360–1920 px; no WCAG A/AA violations in automated light/dark checks; all coverage dimensions ≥80%. Local browser measurements are smoke measurements, not field SLO evidence. Production OTLP collection is optional and requires an explicitly configured public collector.

The contact limiter is process-local and resets on restart; it does not replace a shared edge rate limit. No message data, email addresses or IPs are retained by that limiter. Production delivery, provider retention and a distributed edge policy require deployment configuration; no live email is sent by the test suite.

The follow-up [visual and content refinement](portfolio-refinement.md) records the professional theme, expanded skills, icon sourcing and résumé consistency audit.

## Public Railway demonstrations

The owner authorized demo deployment on September 6, 2026. Relantern and
QuantHelm now run isolated static exports in their projects' `demo` environments,
with one web service each, automatic sleep, HTTPS and health checks. Uploads use
`railway up --path-as-root`; no Git push or repository visibility change occurred.
Private staging and production sources, domains and deployment IDs were checked
against the initial inventory and were unchanged.

Both public demos passed desktop/mobile interactions, automated accessibility,
private-route/write rejection and asset-integrity checks. The uploads have no
Gitleaks findings and the demo containers have no HIGH/CRITICAL Trivy findings.
The screenshot refresh uses their public URLs in headed Chromium; Flameshot
captures of the actual desktop windows supplement browser screenshots.

QuantHelm's initial private-app scan found seven HIGH libuuid vulnerabilities
in its PostgreSQL base. The publication follow-up pins Alpine's fixed
`2.42.3-r1` package and passed the complete gate, with zero HIGH/CRITICAL database-image findings. That database is absent from
the public demo; final results are recorded in the verification document.
Details and deployment/rollback instructions live in each project's
`docs/public-demo.md`. Temporary detailed evidence is stored locally at
`/tmp/portfolio-demo-deploy-20260906`.

## Link and resume behavior

Destination links (projects, screenshots and professional profiles) open in a
new tab with `noopener noreferrer`, a consistent external-link icon, hover text
and an accessible description announcing the new tab. In-page section navigation
continues to scroll within the portfolio. This follows the explicit owner
preference and [W3C's guidance on announcing new windows](https://www.w3.org/WAI/WCAG22/Techniques/html/H83).

Every resume action says “Download resume” and uses a download icon. Header,
hero, mobile navigation and command-palette actions download the existing PDF.
The response includes `Content-Disposition: attachment` with the same filename.
This uses [native download behavior](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#download)
and [Next.js response headers](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers).
Release-page links use a package icon so they are not mistaken for direct downloads.
