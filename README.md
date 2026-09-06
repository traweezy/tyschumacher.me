# Tyler Schumacher’s portfolio

Next.js 16.3, React 19.2 and Tailwind 4 portfolio featuring independent projects, professional experience and a Resend contact form. The application uses a restrained light/dark theme, grouped skills with color-coded icons and chips, a five-project bento with real screenshots, and project narratives served directly in the initial HTML.

## Develop

Use Node 26.8.1 and the single package manager pinned in `package.json`: pnpm 12.3.4. Node 24 is also supported for Vercel deployment compatibility.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:3000. Copy `.env.example` to `.env.local` and provide a Resend key if testing delivery manually. Automated tests mock email delivery. Without the key, contact returns a helpful 503 response.

```sh
pnpm build
pnpm preview
```

Native TypeScript 7 runs the standalone typecheck; the official TypeScript 6 compatibility alias supplies the JavaScript API required by Next.js and ESLint. ESLint 9 is intentionally held for React plugin compatibility. See the [upgrade record](docs/portfolio-audit.md#upgrade-record-and-deliberate-holds).

## Quality gates

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test:coverage
pnpm audit --audit-level=moderate
pnpm run sbom
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

Stop a running dev server before browser tests: Playwright can reuse port 3000 and should validate the production build. Tests cover projects, navigation, contact responses, keyboard interaction, themes, reduced motion, crawler metadata, no-JavaScript project reading, light/dark accessibility and 360–1920 px overflow. Coverage thresholds are 80% across all four metrics. Reports go to `coverage/`, `playwright-report/` and `test-results/`.

`pnpm analyze` opens Next.js’s Turbopack bundle explorer. `pnpm test:diagnostics` investigates asynchronous leaks. `pnpm test:e2e:coverage` collects browser V8 coverage. Generated SBOMs are ignored locally and uploaded in CI.

## Deployment

The existing deployment target is Vercel. Keep the Next.js framework preset and Node **24.x** until the platform supports Node 26. Enable **`ENABLE_EXPERIMENTAL_COREPACK=1`** in the Vercel project so it honors `packageManager: pnpm@12.3.4`; do not rely on its default lockfile-to-pnpm detection. The checked-in `vercel.json` explicitly invokes Corepack for the frozen install and build; this avoids a fallback to an older preinstalled pnpm. See [Vercel’s Corepack instructions](https://vercel.com/docs/builds/configure-a-build#corepack).

Provision `RESEND_API_KEY` in the intended environment and verify the sender domain. A production edge rate limit should complement the contact endpoint’s process-local delivery budget. [Contact API and operating notes](docs/contact-api.md) document limits, responses, idempotency and logging.

After deploying:

1. Confirm the canonical URL is `https://www.tyschumacher.me/`, the home page returns 200, and a missing path returns 404.
2. Open `/og.png`, `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` and the resume PDF directly. Sharing requires publicly fetchable assets.
3. Inspect the canonical home URL using [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) to refresh its cached preview. The site supplies a 1200 × 630 PNG for both Open Graph and Twitter.
4. Check production logs and submit one intentional manual contact message if validating the configured provider.

Rollback by redeploying the preceding successful Vercel deployment. This change has no database or content migrations. Remote settings, delivery and LinkedIn cache refresh are not validated by local tests.

## Telemetry

Production telemetry is disabled unless `NEXT_PUBLIC_OTEL_EXPORT_URL` is set at build time to a public HTTPS OTLP endpoint. Never embed credentials in that value. The collector must allow the portfolio origin through CORS and should apply its own limits. The SDK loads only when enabled; development uses its console exporter. Interaction labels and Web Vitals measurements contain no contact fields or user identifiers.

## Content and architecture

- [Application index](docs/app-index.md): entry points, boundaries and editing workflow.
- [Portfolio research and audit](docs/portfolio-audit.md): project provenance, design decisions, upgrades and limitations.
- [Third-party notices](THIRD_PARTY_NOTICES.md): asset provenance and license notes.
- `src/data/`: profile, skills, experience, projects and navigation.
- `src/components/`: sections, layout and Radix UI wrappers.
- `src/lib/`: content, contact, telemetry and browser utilities.
- `src/state/`: Zustand preferences and UI state.

Project cards distinguish work in progress, private source, local demos and verified staging links. Update screenshots and their capture context together with project claims. `agentRules: false` prevents Next.js from generating agent instruction files in this repository.

The latest visual/content research and decisions are recorded in [the refinement audit](docs/portfolio-refinement.md).
