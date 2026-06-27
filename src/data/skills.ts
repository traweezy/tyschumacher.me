import type { TechnologyIconName } from "@/components/ui/technology-icons";

export type SkillItem = {
  accentKey: string;
  icon: TechnologyIconName;
  name: string;
};

export const coreToolItems: SkillItem[] = [
  { name: "React 19", icon: "react", accentKey: "react" },
  { name: "Next.js", icon: "nextdotjs", accentKey: "next" },
  { name: "TypeScript", icon: "typescript", accentKey: "typescript" },
  { name: "Java", icon: "openjdk", accentKey: "java" },
  { name: "Go", icon: "go", accentKey: "go" },
  { name: "Node.js", icon: "nodedotjs", accentKey: "node" },
  { name: "PostgreSQL", icon: "postgresql", accentKey: "postgresql" },
  { name: "GraphQL", icon: "graphql", accentKey: "graphql" },
  { name: "Kubernetes", icon: "kubernetes", accentKey: "kubernetes" },
  { name: "Docker", icon: "docker", accentKey: "docker" },
  { name: "Git", icon: "git", accentKey: "git" },
  { name: "Tailwind CSS", icon: "tailwindcss", accentKey: "tailwind" },
  { name: "Zustand", icon: "zustand", accentKey: "zustand" },
  { name: "TanStack Query", icon: "reactquery", accentKey: "tanstack" },
] as const;

export const buildPriorityItems: SkillItem[] = [
  { name: "Accessibility", icon: "accessibility", accentKey: "accessibility" },
  { name: "Performance", icon: "performance", accentKey: "performance" },
  { name: "Observability", icon: "observability", accentKey: "observability" },
  {
    name: "Release safety",
    icon: "releaseSafety",
    accentKey: "release-safety",
  },
  { name: "SEO", icon: "seo", accentKey: "seo" },
] as const;

export const skills = [...coreToolItems, ...buildPriorityItems].map(
  (skill) => skill.name,
);
