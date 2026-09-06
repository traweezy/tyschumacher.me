# Application index

Audited 2026-09-06. This is a single-page portfolio with a server-side contact boundary, not a database-backed application.

| Area                   | Entry points                                                                                              | Responsibility                                                                                             |
| ---------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Rendering              | `src/app/layout.tsx`, `page.tsx`, `providers.tsx`                                                         | Server-rendered content, fonts, metadata, theme bootstrap, client preferences and query cache              |
| Navigation             | `components/layout/site-header.tsx`, `components/command/command-palette.tsx`, `data/navigation.ts`       | Responsive navigation, active section, command search, theme and resume actions                            |
| Projects               | `data/projects.ts`, `components/sections/projects.tsx`, `components/projects/projects-grid.tsx`           | Five selected projects, real screenshots, bento layout, honest preview availability and native disclosures |
| Experience             | `data/experience.ts`, `components/sections/experience-explorer.tsx`                                       | Filterable professional history in a native ordered chronology                                             |
| Other content          | `data/profile.ts`, `data/skills.ts`, `components/sections/`                                               | Hero, grouped skills with icons, contact and footer                                                        |
| Email boundary         | `app/api/contact/route.ts`, `lib/contact.ts`, `contact-request.ts`, `http-problem.ts`, `resend-client.ts` | Validation, bounded reads, delivery budget, safe email formatting, idempotency and timeout                 |
| Web essentials         | `app/robots.ts`, `sitemap.ts`, `manifest.ts`, `icon.svg`, `lib/site.ts`, `public/og.png`                  | Canonical identity, crawlers, sharing and icons                                                            |
| Recovery               | `app/error.tsx`, `app/not-found.tsx`                                                                      | Retry UI and genuine 404 with navigation home                                                              |
| Security               | `src/proxy.ts`                                                                                            | Per-request CSP nonce, security headers and telemetry origin allowlist                                     |
| Telemetry              | `lib/telemetry-config.ts`, `observability.ts`, `components/web-vitals.tsx`                                | Optional OTLP interaction/vital spans; disabled by default in production                                   |
| UI state               | `src/state/`                                                                                              | Zustand stores for command palette, navigation and reduced motion                                          |
| Design                 | `app/globals.css`, project CSS module, `components/ui/`                                                   | Neutral OKLCH light/dark tokens, shared color-coded chips, responsive bento, Radix primitives              |
| Unit/integration tests | Colocated `*.test.ts(x)`, `vitest.config.ts`, `src/test-utils/`                                           | Validation, rendering, boundary behavior and accessibility preferences                                     |
| Browser tests          | `e2e/`, `playwright.config.ts`                                                                            | Production journeys, metadata, keyboard, no-JS projects, WCAG checks, responsive overflow                  |
| Delivery               | `.github/workflows/ci.yml`, `.gitlab-ci.yml`, `vercel.json`, `package.json`, `pnpm-workspace.yaml`        | Frozen installs, checks, security, SBOM and production/browser builds                                      |

## Boundaries and assumptions

- Public project content is curated at build/source time. Rendering never requires a live GitHub API request or token.
- Home HTML is rendered per request because CSP uses a unique nonce. Static metadata routes/assets remain independently cacheable.
- Project narratives and disclosures are Server Components. No filtering library, carousel, client fetch, or JavaScript is needed to read them.
- Contact is the only mutation endpoint. It sends through Resend; the application has no message database, authentication or cookies for sessions.
- Fonts are self-hosted through `next/font`. Raster project media uses `next/image`, reserved dimensions and responsive sizes.
- Theme and accessibility preferences are the only persisted browser UI state. Query data uses a one-minute stale time and five-minute garbage collection time.

## Editing content

Update `src/data/projects.ts` and its evidence in `docs/portfolio-audit.md` together. Keep status explicit, link to runnable releases or actual source, and add screenshots only from the project being described. Do not infer production adoption or measured outcomes from repository activity.

Run `pnpm analyze` for the Next.js Turbopack bundle explorer when adding significant dependencies. It generates analysis output rather than a deployable application; run `pnpm build` again before previewing or deploying.

Skill groups are curated in `src/data/skills.ts`. Every project technology uses a typed `{ name, icon }` entry; the compiler rejects missing or unknown icons. Project links specify source, staging or demo intent. Private repositories are labels, not inaccessible source links. Icons are decorative beside visible labels.
