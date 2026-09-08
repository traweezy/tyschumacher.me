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

Native TypeScript 7 runs the standalone typecheck; the official TypeScript 6 compatibility alias supplies the JavaScript API required by Next.js. Biome 2.5.12 handles linting, formatting, and import organization. See the [tooling guide](docs/biome-migration.md).

## Quality gates

```sh
pnpm check
pnpm typecheck
pnpm test:coverage
pnpm audit --audit-level=moderate
pnpm run sbom
pnpm build
pnpm exec playwright install chromium webkit
pnpm test:e2e
```

Stop a running dev server before browser tests: Playwright can reuse port 3000 and should validate the production build. Tests cover projects, navigation, contact responses, keyboard interaction, themes, reduced motion, crawler metadata, no-JavaScript project reading, light/dark accessibility and 320–1920 px layouts. Phone and tablet profiles run in Chromium and WebKit. OpenSSL provides a temporary certificate for the local WebKit HTTPS preview on port 3001. Coverage thresholds are 80% across all four metrics. Reports go to `coverage/`, `playwright-report/` and `test-results/`.

`pnpm check:fix` applies safe Biome fixes; `pnpm format` formats supported files. CI uses `pnpm check:ci`, and the commit hook runs `pnpm check` plus typechecking. The workspace recommends the Biome editor extension. Markdown and YAML remain manually formatted because stable Biome does not support them yet.

`pnpm analyze` opens Next.js’s Turbopack bundle explorer. `pnpm test:diagnostics` investigates asynchronous leaks. `pnpm test:e2e:coverage` collects browser V8 coverage. Generated SBOMs are ignored locally and uploaded in CI.

## Deployment

The existing deployment target is Vercel. Keep the Next.js framework preset and Node **24.x** until the platform supports Node 26. Enable **`ENABLE_EXPERIMENTAL_COREPACK=1`** in the Vercel project so it honors `packageManager: pnpm@12.3.4`; do not rely on its default lockfile-to-pnpm detection. The checked-in `vercel.json` explicitly invokes Corepack for the frozen install and build; this avoids a fallback to an older preinstalled pnpm. See [Vercel’s Corepack instructions](https://vercel.com/docs/builds/configure-a-build#corepack).

Provision `RESEND_API_KEY` in the intended environment and verify the sender domain. A production edge rate limit should complement the contact endpoint’s process-local delivery budget. [Contact API and operating notes](docs/contact-api.md) document limits, responses, idempotency and logging.

After deploying:

1. Confirm the canonical URL is `https://www.tyschumacher.me/`, the home page returns 200, and a missing path returns 404.
2. Open `/og.png`, `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` and the resume PDF directly. Sharing requires publicly fetchable assets.
3. Inspect the canonical home URL using [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) to refresh its cached preview for new shares; LinkedIn may require sign-in. The site supplies a 1200 × 630 PNG for both Open Graph and Twitter. `SHARE_IMAGE_PATH` in `src/lib/site.ts` includes an image revision for cache updates; change it when replacing the PNG. The former `/og-image.svg` URL redirects to this image. Existing posts keep their original previews, and an existing Featured card may need to be edited or added again. See [LinkedIn's cache guidance](https://www.linkedin.com/help/linkedin/answer/a6233775).
4. Check production logs and submit one intentional manual contact message if validating the configured provider.

Rollback by redeploying the preceding successful Vercel deployment. This change has no database or content migrations. Remote settings, delivery and LinkedIn cache refresh are not validated by local tests.

## Telemetry

Production telemetry is disabled unless `NEXT_PUBLIC_OTEL_EXPORT_URL` is set at build time to a public HTTPS OTLP endpoint. Never embed credentials in that value. The collector must allow the portfolio origin through CORS and should apply its own limits. The SDK loads only when enabled; development uses its console exporter. Interaction labels and Web Vitals measurements contain no contact fields or user identifiers.

## Content and architecture

- [Application index](docs/app-index.md): entry points, boundaries and editing workflow.
- [Light-theme audit](docs/light-theme-audit.md): contrast, theme-aware project captures, and screenshot provenance.
- [Header and timeline audit](docs/hero-timeline-audit.md): parallax behavior, responsive artwork, timeline, and visual review.
- [Multi-layer hero research](docs/parallax-hero-research.md): current depth model, dark/light art direction, performance, and accessibility decisions.
- [Mobile and tablet audit](docs/mobile-tablet-audit.md): responsive fixes, browser coverage, and local HTTPS testing.
- [Portfolio research and audit](docs/portfolio-audit.md): project provenance, design decisions, upgrades and limitations.
- [Third-party notices](THIRD_PARTY_NOTICES.md): asset provenance and license notes.
- `src/data/`: profile, skills, experience, projects and navigation.
- `src/components/`: sections, layout and Radix UI wrappers.
- `src/lib/`: content, contact, telemetry and browser utilities.
- `src/state/`: Zustand preferences and UI state.

Project cards distinguish work in progress, private source, local demos and verified staging links. Update screenshots and their capture context together with project claims. `agentRules: false` prevents Next.js from generating agent instruction files in this repository.

Project images can provide `image.lightSrc` with the same dimensions as their
default dark capture. The selected site theme controls both the preview and its
full-size link. Stackctl, QuantHelm, and this portfolio have light captures;
Relantern and Remorseless Records retain their authentic dark-only interfaces.

The latest visual/content research and decisions are recorded in [the refinement audit](docs/portfolio-refinement.md).

### Resume

`pnpm resume:build` regenerates the downloadable PDF from the website's profile,
experience, skills, and navigation data. `src/data/resume.ts` holds only the resume
summary, phone number, and education. Both surfaces use the role in
`src/data/profile.ts`. The generator uses the pinned
Playwright Chromium installation (`pnpm exec playwright install chromium`) and
refuses to replace the PDF if the content exceeds one Letter page.

Resume skills use six functional groups: frontend, backend and APIs, data stores,
messaging, infrastructure, and observability. The generator requires every website
technology to appear exactly once and uses decorative Lucide icons beside labels.

After changing shared content, regenerate the resume and inspect a PDF render
before committing it. Preserve official titles and dates when reconciling LinkedIn;
the website and resume can use shorter descriptions of the same contributions.
LinkedIn remains a manually maintained source, not an automatic integration.
