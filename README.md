## Overview

Personal site built with Next.js 15 (App Router), React 19, and Tailwind v4. The project highlights realtime-focused engineering work and ships with a hardened UI surface (accessible navigation, contact form, command palette, etc.).

## Requirements

- Node 18+
- [`pnpm`](https://pnpm.io/) (single package manager for this repo)

Install dependencies:

```bash
pnpm install
```

## Running the app

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the site during development.

## Environment

Outbound contact emails are sent through Resend. Provide a key in `.env.local`:

```env
RESEND_API_KEY="your-resend-api-key"
```

Without the key the `/api/contact` endpoint responds with a `503` and the form surfaces a helpful fallback message.

## Quality gates

Colocated tests live next to the code they validate and the Vitest runner is preconfigured with jsdom, Next.js shims, and global providers. Run the full suite with coverage (≈96% statements) before shipping:

```bash
pnpm test:coverage
```

Additional checks:

```bash
pnpm typecheck   # strict TypeScript
pnpm lint        # ESLint (flat config via Next.js)
```

The coverage report is written to `coverage/`; open `coverage/index.html` for the HTML summary.

## Project layout

- `src/app` – App Router entrypoints, layout, providers, API route.
- `src/components` – Feature and UI components with colocated tests (`*.test.tsx`).
- `src/lib` – Shared utilities (content loading, view transitions, etc.).
- `src/state` – Zustand stores for UI and accessibility preferences.
- `src/test-utils` – Helpers reused across tests (e.g., provider wrapper).

## Deployment

The app targets standard Next.js build workflows (e.g., `pnpm build` → `next build`). Provision the `RESEND_API_KEY` secret in each environment to keep the contact form functional. All other content is static. Continuous integration should run `pnpm lint`, `pnpm typecheck`, `pnpm vitest run --coverage`, and `pnpm build` to respect the repo’s quality gates.
