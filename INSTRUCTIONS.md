# INSTRUCTIONS.md — Portfolio Build Brief (Next.js · modern UX)

> Target: a fast, accessible, personal portfolio for **Tyler Schumacher** (full‑stack) using the seeded **Next.js app**. Visual vibe: **tamalsen.dev** overall layout, extended top navigation, parallax hero; **brittanychiang.com** projects, but in a **Bento grid**. Use **dummy email and project data**. No auth.

---

## 0) Non‑negotiables (follow exactly)

- Obey the repo’s `AGENTS.md` rules for security, a11y, quality gates, and tooling. Use **pnpm**, **Next.js App Router**, **React 19**, **Tailwind v4**, **Radix + shadcn/ui**, **TanStack (Query/Form/Pacer)**, **Zustand**. Skeleton‑first loading. Reduced‑motion support. Contrast ≥ 4.5:1. No secrets committed. (Source of truth in AGENTS.md.)
- Keep builds reproducible with lockfiles. One package manager only (**pnpm**).
- If the seeded app uses older Next/React/Tailwind, **stop and ask** before upgrading.
- Respect **prefers-reduced-motion** everywhere. Provide non‑animated fallbacks.
- Use **Server Components by default**. Client components only for interactivity. Avoid `dangerouslySetInnerHTML`.
- Ship with **strict headers** and CSP; no unsafe inline scripts. Use `next/font` and `next/image` properly.

---

## 1) Information architecture

### Global nav (desktop → mobile)
Primary: **Home, Projects, Experience, Writing, About, Contact**.  
Secondary actions (right side): **Resume** (PDF), **GitHub**, **LinkedIn**, **Theme toggle**, **Command palette**.

Behavior:
- **Sticky header** that **condenses on scroll** and gains a subtle background to separate from content.
- **Active section indicator** using scroll‑spy.
- **Accessible menus**: Radix Navigation Menu + shadcn wrappers. Keyboard complete. Focus visible.
- **Command palette** (`⌘K`/`Ctrl K`) for quick jumps to sections and external links.
- **Mobile**: collapsible sheet/drawer with same structure; large touch targets; trap focus in open state.

### Sections
1. **Hero** (parallax) — headline, subhead, CTAs, background depth layers.
2. **Projects** — Brittany‑style content density and storytelling, displayed as **Bento grid** cards.
3. **Experience** — timeline/cards from resume (company, role, dates, bullets).
4. **About** — brief bio, location (Buffalo, NY), skills cloud.
5. **Writing** — MDX‑based posts or external links.
6. **Contact** — simple non‑auth form or `mailto:`; **use dummy email** and placeholders.

### Footer
- © year, socials, theme toggle mirror, back‑to‑top.

---

## 2) Visual + interaction patterns to implement

### 2.1 Extended top navigation
- **Condensing**: Regular height at top → dense height after ~24–64px scroll. Add background + subtle border to increase contrast over hero.
- **Scroll progress bar**: 2px bar under the header driven by scroll timeline.
- **Navigation Menu**: Desktop uses Radix **NavigationMenu** for a11y; avoid hover‑only traps. Provide click activation and keep menu keyboardable. Mobile uses a Radix **Dialog/Sheet** pattern with the same links.

### 2.2 Parallax hero (CSS scroll‑driven animations)
- Use **CSS scroll‑driven animations** (`animation-timeline`) for background‑only depth. Keep text static for readability.
- Layers:
  - `bg-gradient` (slow upward translate)
  - `bg-dots` or noise texture (slower)
  - `fg-badge` micro‑motion on appear
- **Reduced motion**: disable animations and keep a static composition.

Example (illustrative, adjust values):
```css
/* Hero parallax */
@keyframes heroShift { from { transform: translateY(0) } to { transform: translateY(-40px) } }

.hero [data-parallax="slow"] {
  animation: heroShift linear both;
  animation-timeline: scroll(root block);
  animation-range: 0 40vh;
}

@media (prefers-reduced-motion: reduce) {
  .hero [data-parallax] { animation: none; }
}
```

### 2.3 Project section in a Bento grid
- Implement with **CSS Grid + named areas** and **container queries** for adaptable layouts. Keep DOM order logical for screen readers.
- Card content: **title**, 1–2 line **summary**, **role**, **tech chips**, **year/status**, primary action (View details) and optional external link.
- Tile sizing: a few “feature” tiles span 2×2; others 1×1 or 2×1. On small containers collapse to a single column without masonry gaps.
- Hover/focus affordances: soft elevation and outline, no layout shift.
- Preload hero project images with `next/image` and `sizes` hints. Provide skeletons.

Example grid sketch:
```css
/* Container query switches template above ~900px of the grid container */
.projects { container-type: inline-size; display: grid; gap: var(--space-4); }

@container (min-width: 900px) {
  .projects {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-auto-rows: 120px;
  }
  .tile--feature { grid-column: span 6; grid-row: span 2; }
  .tile--wide    { grid-column: span 8; grid-row: span 1; }
  .tile--tall    { grid-column: span 4; grid-row: span 2; }
  .tile--std     { grid-column: span 4; grid-row: span 1; }
}
```

---

## 3) Content model & dummy data

Create `src/data/` with typed seeds. Replace dummy content later.

### 3.1 Types
```ts
// src/data/types.ts
export type Link = { label: string; href: string; newTab?: boolean };
export type Project = {
  slug: string;
  title: string;
  summary: string;
  role?: string;
  tech: string[];
  year?: number;
  status?: "live" | "archived" | "wip";
  cover?: { src: string; alt: string; width: number; height: number };
  links?: Link[]; // primary first
  featureWeight?: number; // drives bento sizing
};
export type Experience = {
  company: string;
  role: string;
  start: string; // ISO YYYY-MM
  end?: string;  // ISO or "present"
  location?: string;
  bullets: string[];
  tech?: string[];
  url?: string;
};
```

### 3.2 Sample data
```ts
// src/data/projects.ts
import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "realtime-trading-ui",
    title: "Realtime Trading UI",
    summary: "High‑frequency data grid with virtualization and instant filters.",
    role: "Senior Full‑Stack",
    tech: ["React", "TypeScript", "Go", "WebSockets"],
    year: 2024,
    status: "live",
    featureWeight: 3,
    cover: { src: "/images/projects/trading-ui.jpg", alt: "Trading UI screen", width: 1600, height: 900 },
    links: [{ label: "Case study", href: "/projects/realtime-trading-ui" }]
  },
  {
    slug: "sportsbook-tools",
    title: "Sportsbook Trader Tools",
    summary: "Operational dashboards for live markets with fast shortcuts.",
    tech: ["React", "Node.js", "PostgreSQL"],
    status: "archived",
    featureWeight: 2
  },
  {
    slug: "design-systems",
    title: "Design System Primitives",
    summary: "Token‑driven components with a11y baked in.",
    tech: ["Radix", "shadcn/ui", "Tailwind"],
    status: "wip",
    featureWeight: 1
  }
];
```

```ts
// src/data/experience.ts
import type { Experience } from "./types";

export const experience: Experience[] = [
  {
    company: "Caesars Sportsbook",
    role: "Senior Full Stack Developer",
    start: "2021-12",
    end: "present",
    location: "Jersey City, NJ",
    bullets: [
      "Architected high‑performance Go services powering realtime UIs.",
      "Shipped React interfaces with virtualization for live data.",
      "Turned UX insights into measurable improvements."
    ],
    tech: ["Go", "React", "Node.js", "PostgreSQL"]
  },
  {
    company: "Instinet",
    role: "Senior Full Stack Developer",
    start: "2017-12",
    end: "2021-12",
    location: "New York, NY",
    bullets: [
      "Maintained Node/Java services for a high‑throughput trading platform.",
      "Migrated legacy tools to modular React apps.",
      "Streamlined CI and Kubernetes deployments."
    ],
    tech: ["Node.js", "Java", "Kubernetes"]
  }
];
```

---

## 4) Pages, routes, and components

### 4.1 Routing (App Router)
- `/` — Home (hero, projects preview, experience preview)
- `/projects` — Bento grid with filters (tech, year, status)
- `/projects/[slug]` — Case study template (long form)
- `/experience` — Timeline/cards
- `/about` — Bio + skills + “Now” section
- `/writing` — MDX blog listing
- `/contact` — Simple form → dummy endpoint; or `mailto:hello@example.com`
- `/resume` — Static PDF link

### 4.2 Key components (server unless noted)
- `Header` (client): sticky, condensing, theme toggle, scroll‑spy, command palette
- `CommandPalette` (client): shadcn `Command` with routes and external links
- `Hero` (server + light client hook for parallax class toggles if needed)
- `ProjectCard`, `ProjectsGrid` (server)
- `ExperienceItem`, `ExperienceList` (server)
- `Prose` (MDX styling)
- `Footer` (server)
- `ThemeProvider` (client) + system preference detection

### 4.3 Styles & tokens
- Tailwind v4 tokens; OKLCH color ramps; light/dark themes. Reserve image dimensions; use `content-visibility: auto` on heavy sections.

---

## 5) Implementation notes (stack specifics)

### 5.1 Next.js
- App Router + Server Components default. Use `generateMetadata`. Revalidation per page. Tag cache and invalidate on content changes if any.
- Navigation prefetch stays **on**. Prefetch likely next routes on hover.
- Fonts with `next/font` (subset weights only). LCP image uses `priority` + explicit `sizes`. No CLS.
- Progressive enhancement: **View Transitions API** for route/section transitions; provide fallback when unsupported.

### 5.2 UI library
- Use **Radix** primitives (NavigationMenu, Dialog/Sheet, Popover). Wrap with shadcn/ui where suitable. Keep components un‑forked; theme via tokens.

### 5.3 State & forms
- TanStack Query for any fetches. TanStack Form + Zod for contact form validation. Zustand for light client state (theme, palette open, filter UI). No React Context for app state.

### 5.4 Accessibility
- Semantic HTML; name/role/value correct.
- Keyboard complete for menus, dialogs, drawers; trap focus; restore focus.
- Labels near inputs; `aria-invalid` + `aria-describedby` for errors.
- Motion: respect reduced‑motion; keep durations short (≤250ms micro; ≤500ms route).

### 5.5 Performance budgets
- LCP ≤ 2.0s on mobile mid‑tier; CLS ≤ 0.05; TBT ≤ 200ms lab.
- Bundle analysis must pass. Tree‑shake icons/libs. Code‑split bento details route.

### 5.6 Security & headers
- Add CSP with nonce/hash, HSTS, Referrer‑Policy, Permissions‑Policy, X‑Content‑Type‑Options, Frame‑Ancestors.
- No untrusted HTML. If ever required, sanitize with DOMPurify + Trusted Types.

---

## 6) Research‑driven design guidance (apply during build)

- **Condensing top bars** and background fill on scroll improve separation and scannability. Use a dense height after scroll.
- **Accessible nav menus**: rely on Radix Navigation Menu, which handles focus/keyboard and submenu patterns.
- **Parallax**: keep movement subtle and background‑only; implement with **CSS scroll‑driven animations** for main‑thread friendly performance; always offer reduced‑motion fallback.
- **View transitions**: add gentle continuity for route and large DOM swaps.

> Inspiration anchors to match the user’s taste:  
> Overall layout: **tamalsen.dev**. Project storytelling density: **brittanychiang.com**.

---

## 7) Content pulls from resume (for About/Experience)

- Summary: “Full‑stack engineer with 10+ years… realtime systems; React/TS, Go, Node, PostgreSQL.”
- Roles: Caesars Sportsbook (Senior Full Stack Developer, Dec 2021–Present), Instinet (Senior Full Stack Developer, 2017–2021), Lab49, Twisted Rope.
- Skills: React, TypeScript, Go, Node.js, PostgreSQL, GraphQL, Kubernetes, Redux, SEO.

*(Replace or expand in copy as needed; keep contact to **dummy email** in UI.)*

---

## 8) Copy & CTAs (placeholders)

- Hero H1: “Full‑stack engineer building realtime, high‑performance products.”
- Subhead: Short 1–2 lines about UI craft + systems thinking.
- Primary CTA: “View projects” → `/projects`
- Secondary CTA: “Download résumé” → `/resume`

---

## 9) Definition of done

- A11y: keyboard complete, focus visible, reduced‑motion paths verified, color contrast ≥ 4.5:1.
- Perf: LCP/CLS/TBT budgets pass; no avoidable layout shifts; images sized.
- UX: header condenses; command palette works; Bento grid adapts via container queries; skeletons present.
- Quality gates: typecheck, lint, unit/integration tests where relevant, build passes; bundle analysis OK.
- Security: headers present; CSP nonced/hashed; no secrets in repo.
- Content: dummy email + dummy projects; resume highlights applied to About/Experience.

---

## 10) Tasks checklist (for small, atomic commits)

1. Scaffold tokens, Tailwind v4, shadcn/ui, Radix wrappers.
2. Build `Header` with condensing + scroll progress + palette.
3. Implement `Hero` with subtle CSS parallax + reduced‑motion.
4. Create `ProjectsGrid` with Bento sizing + filters; add dummy data.
5. Add Experience timeline/cards from resume.
6. Add About, Writing (MDX ready), Contact (dummy).
7. Add Footer. Wire socials and `/resume` static asset.
8. Enable View Transitions; tune image/font loading; prefetch.
9. Add tests for nav a11y, palette, and reduced‑motion styles. Run Lighthouse.
10. Harden headers, CSP; final QA on mobile/desktop.

---

## 11) Notes & constraints

- Use only **CSS‑first** motion; no heavy scroll libraries. Consider GSAP only if CSS cannot express a sequence and with clear value; otherwise avoid.
- Keep the **DOM order logical** in the Bento grid; do not rely on visual reordering for reading/tab order.
- Images must declare width/height and use `next/image`.
- Use **dummy email** everywhere (`hello@example.com`). Dummy links for unlaunched projects.
- Ask before any destructive or costly change (version upgrades, big deps, design pivots).

---

### References for design & platform (for developer context)

- tamalsen.dev — layout inspiration  
- brittanychiang.com — project section density  
- Material Design — **Top app bar** condensing guidance  
- Radix Primitives — **Navigation Menu** docs  
- CSS Scroll‑Driven Animations — MDN  
- View Transitions API — Chrome/Web.dev + MDN  
- CSS Grid named areas + container queries — MDN