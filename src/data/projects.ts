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
    summary: "Observability platform translating telemetry into actionable signals with <120ms fan out.",
    description:
      "Multi tenant ingest and diagnostics for Caesars Sportsbook, pairing stream analytics with auto remediation runbooks. Trading teams trust it to surface anomalies before the odds move.",
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
    summary: "Low latency content orchestration for live sports overlays across mobile, web, and OTT.",
    description:
      "Authored workflows that let editors stage, localize, and launch interactive experiences in minutes not hours. Deterministic rollouts kept parity across 12 broadcast partners.",
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
    summary: "Edge scheduling system coordinating 3k+ stadium devices with deterministic timing.",
    description:
      "Built fan engagement tooling that choreographs light shows, push messaging, and sponsor activations without missing the beat. Offline first sync and backpressure kept ops calm.",
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
    summary: "Reproducible release train for cross platform sportsbook apps with SBOM guarantees.",
    description:
      "Automated artifact provenance, compliance checks, and feature flag rollouts. Release lead time fell 47% while accessibility budgets and localization gates stayed green.",
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
    summary: "Privacy first analytics modules with differential privacy for regulated teams.",
    description:
      "Shipped data contracts, redaction tooling, and Slack first insights so marketing and compliance share a single playbook. Reduced reporting toil 32% by automating weekly digests.",
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
    summary: "Experimentation toolkit helping product squads ship, measure, and iterate safely.",
    description:
      "Balanced rapid experiments with guardrails: feature toggles, canary analysis, and telemetry budgets. Teams modeled impact before rollout and kept p95 performance under budget.",
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
