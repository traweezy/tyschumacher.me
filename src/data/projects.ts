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
    lightSrc?: string;
    alt: string;
    width: number;
    height: number;
    caption: string;
    preoptimized?: boolean;
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
    summary: "Run and manage your local backend services.",
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
        title: "See what is running",
        detail:
          "Named profiles keep configuration together. The dashboard places service state, endpoints, and diagnostics alongside each other, with credentials masked by default and configuration changes previewed before saving.",
      },
      {
        title: "Use the dashboard or automate with the CLI",
        detail:
          "The dashboard complements documented CLI commands, with JSON output for scripts. Releases include checksums, software provenance, and compatibility checks for each supported platform.",
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
      lightSrc: "/images/projects/stackctl-light-4683191bb67e.webp",
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
    summary: "A music store and publishing tools for an independent label.",
    description:
      "An online record store where listeners can browse music and merchandise, read about releases, and place orders. The label can manage its catalog and publish editorial content in the same application.",
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
        title: "Recover interrupted payments",
        detail:
          "Payment handling checks identity, mode, amount, and currency. Reconciliation jobs check the payment provider and recover checkout state when a browser session is interrupted.",
      },
      {
        title: "Make publishing changes traceable",
        detail:
          "Content commands check versions, prevent duplicate changes with idempotency keys, and verify what was saved. The storefront and admin tools use the same commerce services, with separate interfaces for shoppers and staff.",
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
    summary: "Technical news with the sources behind each summary.",
    description:
      "A reading workspace that collects technical news into searchable briefs. Each summary links its claims to source material so readers can check the details.",
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
          "During extraction, each claim must reference a passage from the supplied source material. Readers can inspect those passages, confidence estimates, and unresolved questions alongside the summary.",
      },
      {
        title: "Combine exact and semantic retrieval",
        detail:
          "PostgreSQL text, trigram, and vector searches find relevant stories. Reciprocal rank fusion combines their results. The public demo uses sample stories and runs without private data or live providers.",
      },
    ],
    evidence:
      "The public demo uses sample stories, and its controls work locally in your browser. Live ingestion, delivery, and preparation for production remain in progress.",
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
    summary: "Track portfolio positions, simulated orders, and risk controls.",
    description:
      "A financial dashboard for reviewing positions, simulated trades, and system status. A Go backend and TypeScript interface share validated data contracts.",
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
          "The dashboard shows positions, simulated orders, risk controls, and reconciliation status separately. Validated contracts and exact decimal values keep financial data consistent between the API and interface.",
      },
      {
        title: "Explore the dashboard with sample data",
        detail:
          "The demo reuses dashboard components with deterministic synthetic data. Sorting, filtering, pagination, and theme changes work locally without a database, broker, or external service.",
      },
    ],
    evidence:
      "The public demo shows synthetic positions and simulated trades. Research, strategy execution, account access, and live trading are not available.",
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
      lightSrc: "/images/projects/quanthelm-light-3b83007d432e.webp",
      alt: "QuantHelm’s demo dashboard showing portfolio totals, open positions, and a notice that the data is synthetic and cannot be changed.",
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
    summary: "My projects, engineering experience, and contact details.",
    description:
      "I built this site to share my work and help people get in touch. It supports keyboard navigation, adapts to different screen sizes, and includes light and dark themes.",
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
          "Each project includes screenshots, engineering notes, and links to available demos and source code. Project content renders on the server and remains usable without JavaScript.",
      },
      {
        title: "Check sharing, accessibility, and contact forms",
        detail:
          "Social previews include an image, and animations respect motion preferences. Contact requests have size limits and timeouts. Browser checks cover keyboard navigation, responsive layouts, accessibility in both themes, and assets used by search engines.",
      },
    ],
    evidence:
      "The site is live with five selected projects, screenshots, a downloadable resume, and links to available demos and public source code.",
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
      src: "/images/projects/personal-website-dark-f9fefb413b65.webp",
      lightSrc: "/images/projects/personal-website-light-0a6a032272c8.webp",
      preoptimized: true,
      alt: "Tyler Schumacher’s portfolio homepage with a Buffalo skyline header, introduction, and project, contact, and resume links.",
      width: 1440,
      height: 820,
      caption: "Homepage · personal portfolio",
    },
  },
] as const satisfies readonly Project[];
