import type { TechnologyIconName } from "@/components/ui/technology-icons";

export type SkillItem = {
  accentKey: string;
  icon: TechnologyIconName;
  name: string;
};

export type SkillGroup = { title: string; items: readonly SkillItem[] };

export const skillGroups = [
  {
    title: "Languages & interfaces",
    items: [
      { name: "TypeScript", icon: "typescript", accentKey: "typescript" },
      { name: "Java", icon: "openjdk", accentKey: "openjdk" },
      { name: "Go", icon: "go", accentKey: "go" },
      { name: "React", icon: "react", accentKey: "react" },
      { name: "Next.js", icon: "nextdotjs", accentKey: "nextdotjs" },
      { name: "Tailwind CSS", icon: "tailwindcss", accentKey: "tailwindcss" },
      { name: "Zustand", icon: "zustand", accentKey: "zustand" },
      { name: "TanStack Query", icon: "reactquery", accentKey: "reactquery" },
    ],
  },
  {
    title: "Backend & APIs",
    items: [
      { name: "Node.js", icon: "nodedotjs", accentKey: "nodedotjs" },
      { name: "Spring Boot", icon: "spring", accentKey: "spring" },
      { name: "PostgreSQL", icon: "postgresql", accentKey: "postgresql" },
      { name: "Redis", icon: "redis", accentKey: "redis" },
      { name: "GraphQL", icon: "graphql", accentKey: "graphql" },
      { name: "gRPC", icon: "grpc", accentKey: "grpc" },
    ],
  },
  {
    title: "Messaging & live systems",
    items: [
      { name: "Apache Kafka", icon: "kafka", accentKey: "kafka" },
      { name: "NATS", icon: "nats", accentKey: "nats" },
      { name: "WebSockets", icon: "websocket", accentKey: "websocket" },
      { name: "Server Sent Events", icon: "sse", accentKey: "sse" },
    ],
  },
  {
    title: "Delivery & observability",
    items: [
      { name: "Kubernetes", icon: "kubernetes", accentKey: "kubernetes" },
      { name: "Docker", icon: "docker", accentKey: "docker" },
      { name: "Podman", icon: "podman", accentKey: "podman" },
      { name: "Grafana", icon: "grafana", accentKey: "grafana" },
      {
        name: "OpenTelemetry",
        icon: "opentelemetry",
        accentKey: "opentelemetry",
      },
    ],
  },
] as const satisfies readonly SkillGroup[];

export const coreToolItems = skillGroups.flatMap((group) => [...group.items]);

export const buildPriorityItems: SkillItem[] = [
  { name: "Accessibility", icon: "accessibility", accentKey: "accessibility" },
  { name: "Performance", icon: "performance", accentKey: "performance" },
  { name: "Observability", icon: "observability", accentKey: "observability" },
  {
    name: "Release safety",
    icon: "releaseSafety",
    accentKey: "release-safety",
  },
  { name: "Compliance", icon: "compliance", accentKey: "compliance" },
  { name: "Analytics", icon: "analytics", accentKey: "analytics" },
  { name: "SEO", icon: "seo", accentKey: "seo" },
] as const;

export const skills = [...coreToolItems, ...buildPriorityItems].map(
  (skill) => skill.name,
);
