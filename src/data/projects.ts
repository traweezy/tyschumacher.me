import type { TechnologyIconName } from "@/components/ui/technology-icons";

export type ProjectTechnology = { name: string; icon: TechnologyIconName };
export type ProjectLink = {
  label: string;
  href: `https://${string}`;
  kind: "source" | "staging" | "demo" | "site" | "release";
};
export type Project = {
  slug: string;
  name: string;
  category: string;
  stage: string;
  status: "Work in progress" | "Released" | "Live";
  summary: string;
  description: string;
  contribution: string;
  tech: readonly ProjectTechnology[];
  decisions: readonly { title: string; detail: string }[];
  evidence: string;
  availability: string;
  sourceVisibility: "public" | "private";
  links: readonly ProjectLink[];
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    caption: string;
  };
};

// Source revisions, screenshot provenance and release limits: docs/portfolio-audit.md.
export const projects = [
  {
    slug: "stackctl",
    name: "Stackctl",
    category: "Developer tooling",
    status: "Released",
    stage: "0.x · actively developed",
    summary: "One command. A repeatable local backend stack.",
    description:
      "A Go CLI and terminal dashboard for running local services with Podman, switching stack profiles, and finding health checks, ports, logs, and connection details in one place.",
    contribution:
      "I built the CLI, stack configuration and lifecycle commands, terminal dashboard, and release verification workflows.",
    tech: [
      { name: "Go", icon: "go" },
      { name: "Bubble Tea", icon: "bubbletea" },
      { name: "Podman", icon: "podman" },
      { name: "PostgreSQL", icon: "postgresql" },
    ],
    decisions: [
      {
        title: "Make local infrastructure inspectable",
        detail:
          "Named profiles keep configuration together. The dashboard places service state, endpoints, and diagnostics alongside each other, with credentials masked by default and configuration changes previewed before saving.",
      },
      {
        title: "Support people and automation",
        detail:
          "The interactive dashboard complements documented CLI commands and structured JSON output. Release workflows include checksums, supply-chain metadata, and platform qualification checks.",
      },
    ],
    evidence:
      "Public 0.x releases are available for Linux and macOS. The CLI and JSON contracts are being stabilized for 1.x; Windows is not supported. The documentation screenshot shows example service state, not a hosted environment.",
    availability: "Installable CLI · Linux & macOS · no hosted demo",
    sourceVisibility: "public",
    links: [
      {
        label: "View releases",
        kind: "release",
        href: "https://github.com/traweezy/stackctl/releases",
      },
      {
        label: "View source",
        kind: "source",
        href: "https://github.com/traweezy/stackctl",
      },
    ],
    image: {
      src: "/images/projects/stackctl.webp",
      alt: "Stackctl’s terminal dashboard showing example services, PostgreSQL connection details, masked credentials, and keyboard controls.",
      width: 1600,
      height: 1017,
      caption: "Services dashboard · documentation example · secrets masked",
    },
  },
  {
    slug: "remorseless-records",
    name: "Remorseless Records",
    category: "Commerce & publishing",
    status: "Work in progress",
    stage: "Public staging",
    summary: "An independent label, from discovery to checkout.",
    description:
      "A custom record-store experience connecting music and merch discovery, editorial publishing, cart, and checkout around the label’s identity.",
    contribution:
      "I’m building the Next.js storefront, Medusa workflows, editorial tools, and payment recovery paths.",
    tech: [
      { name: "Next.js", icon: "nextdotjs" },
      { name: "Medusa", icon: "medusa" },
      { name: "Stripe", icon: "stripe" },
      { name: "PostgreSQL", icon: "postgresql" },
    ],
    decisions: [
      {
        title: "Treat checkout as a recoverable workflow",
        detail:
          "Payment handling checks identity, mode, amount, and currency. Reconciliation jobs recover interrupted checkout state instead of relying solely on the browser’s success screen.",
      },
      {
        title: "Make publishing changes traceable",
        detail:
          "Content commands use version checks and idempotency keys, then verify the durable result. Storefront and admin workflows share a commerce foundation without sharing the same user experience.",
      },
    ],
    evidence:
      "The new application is available on public staging and remains in development. The label’s existing production store is a separate, older implementation.",
    availability: "Public staging preview · not the production store",
    sourceVisibility: "public",
    links: [
      {
        label: "View staging",
        kind: "staging",
        href: "https://storefront-staging-41f0.up.railway.app/",
      },
      {
        label: "View source",
        kind: "source",
        href: "https://github.com/traweezy/remorseless-records/tree/staging",
      },
    ],
    image: {
      src: "/images/projects/remorseless-records.webp",
      alt: "Remorseless Records staging catalog with album artwork, product search, and music filters.",
      width: 1440,
      height: 1000,
      caption: "Music catalog · public staging",
    },
  },
  {
    slug: "relantern",
    name: "Relantern",
    category: "Developer intelligence",
    status: "Work in progress",
    stage: "Public demo",
    summary: "What changed, why it matters, and the evidence behind it.",
    description:
      "A developer-intelligence workspace that turns technical sources into a focused brief, with searchable stories and a visible trail from each claim to its evidence.",
    contribution:
      "I’m building the Go ingestion and search services, evidence validation, and Next.js reading workspace.",
    tech: [
      { name: "Go", icon: "go" },
      { name: "Next.js", icon: "nextdotjs" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "pgvector", icon: "indexeddb" },
    ],
    decisions: [
      {
        title: "Keep claims connected to evidence",
        detail:
          "Extraction validates that every claim references supplied evidence spans. The reader keeps source material, confidence, and unresolved questions close to the summary.",
      },
      {
        title: "Combine exact and semantic retrieval",
        detail:
          "PostgreSQL full-text, trigram, and vector retrieval are combined with reciprocal-rank fusion. A separate fixture-only demo lets the interface be explored without private data or live providers.",
      },
    ],
    evidence:
      "The public demo uses illustrative stories and browser-local interactions. Live ingestion, delivery, and production-readiness work remain in progress.",
    availability: "Public demo · illustrative stories · no account needed",
    sourceVisibility: "public",
    links: [
      {
        label: "Try demo",
        kind: "demo",
        href: "https://web-demo-ce4e.up.railway.app/demo",
      },
      {
        label: "View source",
        kind: "source",
        href: "https://github.com/traweezy/relantern",
      },
    ],
    image: {
      src: "/images/projects/relantern.webp",
      alt: "Relantern’s public demo showing a Today brief with technical stories, supporting evidence, confidence, and reading controls.",
      width: 1440,
      height: 1000,
      caption: "Today brief · public demo · illustrative stories",
    },
  },
  {
    slug: "quanthelm",
    name: "QuantHelm",
    category: "Financial interfaces",
    status: "Work in progress",
    stage: "Public synthetic demo",
    summary: "A clear view of positions, paper activity, and risk state.",
    description:
      "A financial dashboard for exploring portfolio positions, a paper-order ledger, and operational status, built around a deterministic Go foundation and a typed web interface.",
    contribution:
      "I’m building the Go and PostgreSQL foundation, shared data contracts, and the Next.js dashboard with an isolated demo.",
    tech: [
      { name: "Go", icon: "go" },
      { name: "Next.js", icon: "nextdotjs" },
      { name: "TypeScript", icon: "typescript" },
      { name: "PostgreSQL", icon: "postgresql" },
    ],
    decisions: [
      {
        title: "Make financial state explicit",
        detail:
          "The interface distinguishes positions, paper activity, risk controls, and reconciliation state. Validated contracts and exact-decimal values keep financial data consistent across the boundary.",
      },
      {
        title: "Demonstrate the interface in isolation",
        detail:
          "The demo reuses dashboard components with deterministic synthetic data. Sorting, filtering, pagination, and theme changes work locally without a database, broker, or external service.",
      },
    ],
    evidence:
      "Public interface demo with synthetic positions and paper activity. Research, strategy execution, account access, and live trading are not available.",
    availability: "Public demo · synthetic data · no live trading",
    sourceVisibility: "private",
    links: [
      {
        label: "Try demo",
        kind: "demo",
        href: "https://web-demo-b7d9.up.railway.app/demo",
      },
    ],
    image: {
      src: "/images/projects/quanthelm.webp",
      alt: "QuantHelm’s synthetic demo dashboard showing portfolio totals, open positions, and a read-only demo notice.",
      width: 1440,
      height: 1000,
      caption: "Portfolio dashboard · public demo · synthetic data",
    },
  },
  {
    slug: "personal-website",
    name: "tyschumacher.me",
    category: "Personal website",
    status: "Live",
    stage: "Personal portfolio",
    summary: "A portfolio built with the same care as the work it presents.",
    description:
      "My personal website: selected projects, engineering experience, and a direct way to get in touch. Designed for clear reading, keyboard access, and responsive light and dark themes.",
    contribution:
      "I designed and built the site, from its visual identity and project presentation to sharing metadata, contact handling, and automated quality checks.",
    tech: [
      { name: "Next.js", icon: "nextdotjs" },
      { name: "React", icon: "react" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
    ],
    decisions: [
      {
        title: "Make the work easy to evaluate",
        detail:
          "Project content renders on the server, with native expandable engineering notes, real screenshots, and explicit source and preview availability. The main project content stays usable without JavaScript.",
      },
      {
        title: "Treat the small web details as product work",
        detail:
          "The site includes raster social previews, canonical metadata, reduced-motion support, and bounded contact requests. Browser checks cover keyboard interaction, responsive layouts, light/dark accessibility, and crawler-facing assets.",
      },
    ],
    evidence:
      "The website presents five selected projects with real interface screenshots, accessible navigation, downloadable resume, and public demo and source links where available.",
    availability: "Live website · public source",
    sourceVisibility: "public",
    links: [
      {
        label: "Visit website",
        kind: "site",
        href: "https://www.tyschumacher.me/",
      },
      {
        label: "View source",
        kind: "source",
        href: "https://github.com/traweezy/tyschumacher.me",
      },
    ],
    image: {
      src: "/images/projects/personal-website.webp",
      alt: "Tyler Schumacher’s portfolio homepage with cobalt and rose accents, a profile summary, and project and contact links.",
      width: 1440,
      height: 660,
      caption: "Homepage · personal portfolio",
    },
  },
] as const satisfies readonly Project[];
