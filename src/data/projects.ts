export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  role: string;
  tech: string[];
  year: string;
  image: {
    src: string;
    alt: string;
  };
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    slug: "signal-stack",
    name: "Signal Stack",
    summary:
      "Observability workspace that turns noisy telemetry into the next useful action.",
    description:
      "Multi-tenant ingest and diagnostics for sportsbook teams, pairing stream analytics with runbooks that show what changed and what to check next.",
    role: "Principal Engineer",
    tech: ["React 19", "WebSockets", "Go", "ClickHouse", "OpenTelemetry"],
    year: "2024",
    image: {
      src: "/images/projects/live-odds-canvas.svg",
      alt: "Signal Stack dashboard with real time charts and alert panels.",
    },
    links: [
      { label: "Case study", href: "#" },
      { label: "View UI kit", href: "#" },
    ],
  },
  {
    slug: "game-state-studio",
    name: "GameState Studio",
    summary:
      "Content orchestration for live sports overlays across mobile, web, and OTT.",
    description:
      "Built workflows that let editors stage, localize, and launch interactive experiences without waiting on release work for every change.",
    role: "Lead Frontend Architect",
    tech: ["Next.js", "GraphQL", "Redis", "Tailwind v4"],
    year: "2023",
    image: {
      src: "/images/projects/gamestate-studio.svg",
      alt: "GameState Studio pipeline builder.",
    },
    links: [{ label: "Product overview", href: "#" }],
  },
  {
    slug: "relay-hub",
    name: "RelayHub",
    summary:
      "Scheduling tools for stadium devices, sponsor moments, and event-day operations.",
    description:
      "Built fan engagement tooling for light shows, push messaging, and sponsor activations. Offline-first sync and backpressure kept the operator view useful when connectivity got uneven.",
    role: "Engineering Lead",
    tech: ["Go", "gRPC", "Kubernetes", "Vue 3"],
    year: "2022",
    image: {
      src: "/images/projects/relay-hub.svg",
      alt: "RelayHub activation timeline interface.",
    },
    links: [{ label: "Launch recap", href: "#" }],
  },
  {
    slug: "aurora-pipeline",
    name: "Aurora Build Pipeline",
    summary:
      "Release pipeline for sportsbook apps with traceable artifacts and safer rollouts.",
    description:
      "Automated artifact provenance, compliance checks, and feature flag rollout steps so teams could see what shipped, why it shipped, and how to back it out.",
    role: "Principal Developer",
    tech: ["Nx", "Docker", "CycloneDX", "Azure DevOps"],
    year: "2021",
    image: {
      src: "/images/projects/aurora-pipeline.svg",
      alt: "Aurora pipeline orchestration layers.",
    },
    links: [{ label: "Engineering notes", href: "#" }],
  },
  {
    slug: "insight-kit",
    name: "Insight Kit",
    summary:
      "Analytics modules that make privacy and product questions visible together.",
    description:
      "Shipped data contracts, redaction tooling, and Slack-first summaries so marketing and compliance could work from the same facts.",
    role: "Senior Full Stack Developer",
    tech: ["TypeScript", "Node.js", "ClickHouse", "Zod"],
    year: "2020",
    image: {
      src: "/images/projects/insight-kit.svg",
      alt: "Insight Kit analytics dashboard with segmentation controls.",
    },
    links: [{ label: "Read more", href: "#" }],
  },
  {
    slug: "playbook-lab",
    name: "Playbook Lab",
    summary:
      "Experimentation toolkit for teams that need to ship, measure, and learn safely.",
    description:
      "Paired feature toggles, canary checks, and telemetry budgets so product teams could understand rollout risk before widening an experiment.",
    role: "Staff Engineer",
    tech: ["React Server Components", "Zustand", "PostgreSQL", "Vitest"],
    year: "2019",
    image: {
      src: "/images/projects/playbook-lab.svg",
      alt: "Playbook Lab experiment overview with impact models.",
    },
    links: [{ label: "Experiment docs", href: "#" }],
  },
];
