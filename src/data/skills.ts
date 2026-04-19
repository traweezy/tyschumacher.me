import type { TechnologyIconName } from "@/components/ui/technology-icons";

export type SkillItem = {
  accent: string;
  icon?: TechnologyIconName;
  mark?: string;
  name: string;
};

export const skillItems: SkillItem[] = [
  { name: "React 19", icon: "react", accent: "#61dafb" },
  { name: "Next.js", icon: "nextdotjs", accent: "#111827" },
  { name: "TypeScript", icon: "typescript", accent: "#3178c6" },
  { name: "Java", icon: "openjdk", accent: "#ea2d2e" },
  { name: "Go", icon: "go", accent: "#00add8" },
  { name: "Node.js", icon: "nodedotjs", accent: "#5fa04e" },
  { name: "PostgreSQL", icon: "postgresql", accent: "#4169e1" },
  { name: "GraphQL", icon: "graphql", accent: "#e10098" },
  { name: "Kubernetes", icon: "kubernetes", accent: "#326ce5" },
  { name: "Docker", icon: "docker", accent: "#2496ed" },
  { name: "Git", icon: "git", accent: "#f05032" },
  { name: "Tailwind CSS", icon: "tailwindcss", accent: "#06b6d4" },
  { name: "Zustand", mark: "Zu", accent: "#7c5cff" },
  { name: "TanStack Query", icon: "reactquery", accent: "#ff4154" },
  { name: "Accessibility", mark: "A11y", accent: "#0f766e" },
  { name: "Performance", mark: "Perf", accent: "#7c3aed" },
  { name: "SEO", mark: "SEO", accent: "#9c4f2f" },
] as const;

export const skills = skillItems.map((skill) => skill.name);
