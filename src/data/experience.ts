import type { TechnologyIconName } from "@/components/ui/technology-icons";

type ExperienceTechnology = {
  accentKey: string;
  icon: TechnologyIconName;
  kind?: "domain" | "skill" | "technology";
  name: string;
};

export type ExperienceEntry = {
  company: string;
  role: string;
  start: string;
  end?: string;
  location: string;
  caseLog?: readonly {
    label: string;
    value: string;
  }[];
  stack?: readonly ExperienceTechnology[];
  workTypes?: readonly ExperienceTechnology[];
  bullets: string[];
};

export const experiences: ExperienceEntry[] = [
  {
    company: "Caesars Sportsbook",
    role: "Senior Full Stack Developer",
    start: "Dec 2021",
    location: "Jersey City, NJ · Remote",
    caseLog: [
      { label: "Surface", value: "Live odds, trader tools, analytics" },
      {
        label: "Pressure",
        value: "Large event traffic and fast odds changes",
      },
      { label: "Feedback", value: "Trader feedback and FullStory sessions" },
    ],
    workTypes: [
      {
        name: "Sports betting",
        icon: "sportsbook",
        accentKey: "sportsbook",
        kind: "domain",
      },
      {
        name: "Live operations",
        icon: "realTime",
        accentKey: "real-time",
        kind: "domain",
      },
    ],
    stack: [
      { name: "Go", icon: "go", accentKey: "go" },
      { name: "Java", icon: "openjdk", accentKey: "java" },
      { name: "React", icon: "react", accentKey: "react" },
      { name: "TypeScript", icon: "typescript", accentKey: "typescript" },
      { name: "Kubernetes", icon: "kubernetes", accentKey: "kubernetes" },
      {
        name: "Accessibility",
        icon: "accessibility",
        accentKey: "accessibility",
        kind: "skill",
      },
      {
        name: "Performance",
        icon: "performance",
        accentKey: "performance",
        kind: "skill",
      },
    ],
    bullets: [
      "Created Go and Java services that normalized live data providers and kept betting surfaces current during large event traffic.",
      "Shipped React screens for live odds, trader tools, and internal analytics with virtualization and accessible patterns for long event windows.",
      "Used FullStory sessions and trader feedback to turn friction into concrete design and backlog changes.",
      "Mentored engineers, reviewed designs, and kept delivery rituals focused on decisions instead of ceremony.",
    ],
  },
  {
    company: "Instinet",
    role: "Senior Full Stack Developer",
    start: "Dec 2017",
    end: "Dec 2021",
    location: "New York, NY",
    caseLog: [
      { label: "Surface", value: "Trading workbenches and services" },
      {
        label: "Pressure",
        value: "Compliance-sensitive real-time workflows",
      },
      { label: "Feedback", value: "Safer CI and deployment paths" },
    ],
    workTypes: [
      {
        name: "Finance",
        icon: "finance",
        accentKey: "finance",
        kind: "domain",
      },
      {
        name: "Electronic trading",
        icon: "trading",
        accentKey: "trading",
        kind: "domain",
      },
    ],
    stack: [
      { name: "Node.js", icon: "nodedotjs", accentKey: "node" },
      { name: "Java", icon: "openjdk", accentKey: "java" },
      { name: "React", icon: "react", accentKey: "react" },
      { name: "Kubernetes", icon: "kubernetes", accentKey: "kubernetes" },
      {
        name: "Release safety",
        icon: "releaseSafety",
        accentKey: "release-safety",
        kind: "skill",
      },
    ],
    bullets: [
      "Built Node.js and Java services for a high-volume trading platform, with attention to throughput and compliance paths.",
      "Moved legacy Flash workbenches into modular React tools so traders could work in a modern interface and teams could iterate faster.",
      "Improved GitLab CI and Kubernetes deployment paths so releases were easier to inspect and recover.",
    ],
  },
  {
    company: "Lab49",
    role: "Consultant Engineer",
    start: "Jun 2017",
    end: "Dec 2017",
    location: "New York, NY",
    caseLog: [
      { label: "Surface", value: "Bank research portals" },
      {
        label: "Pressure",
        value: "Accessibility, compliance, and performance",
      },
      {
        label: "Feedback",
        value: "Requirements engineers could build against",
      },
    ],
    workTypes: [
      {
        name: "Finance",
        icon: "finance",
        accentKey: "finance",
        kind: "domain",
      },
      {
        name: "Consulting",
        icon: "consulting",
        accentKey: "consulting",
        kind: "domain",
      },
    ],
    stack: [
      { name: "React", icon: "react", accentKey: "react" },
      { name: "TypeScript", icon: "typescript", accentKey: "typescript" },
      { name: "Java", icon: "openjdk", accentKey: "java" },
      {
        name: "Accessibility",
        icon: "accessibility",
        accentKey: "accessibility",
        kind: "skill",
      },
      {
        name: "Performance",
        icon: "performance",
        accentKey: "performance",
        kind: "skill",
      },
      {
        name: "Compliance",
        icon: "compliance",
        accentKey: "compliance",
        kind: "skill",
      },
    ],
    bullets: [
      "Delivered React and Java work for trading research portals at global banks while balancing accessibility, compliance, and performance requirements.",
      "Worked with product and legal teams to turn complex requirements into screens and services engineers could build.",
    ],
  },
  {
    company: "Twisted Rope",
    role: "Full Stack Developer",
    start: "Oct 2015",
    end: "Jun 2017",
    location: "Buffalo, NY",
    caseLog: [
      { label: "Surface", value: "Hospitality and retail web apps" },
      { label: "Pressure", value: "Responsive campaign delivery" },
      { label: "Feedback", value: "Analytics and SEO foundations" },
    ],
    workTypes: [
      { name: "Media", icon: "media", accentKey: "media", kind: "domain" },
      {
        name: "Hospitality",
        icon: "hospitality",
        accentKey: "hospitality",
        kind: "domain",
      },
      { name: "Retail", icon: "retail", accentKey: "retail", kind: "domain" },
    ],
    stack: [
      { name: "React", icon: "react", accentKey: "react" },
      { name: "Node.js", icon: "nodedotjs", accentKey: "node" },
      { name: "Tailwind CSS", icon: "tailwindcss", accentKey: "tailwind" },
      {
        name: "Accessibility",
        icon: "accessibility",
        accentKey: "accessibility",
        kind: "skill",
      },
      { name: "Analytics", icon: "analytics", accentKey: "analytics" },
      { name: "SEO", icon: "seo", accentKey: "seo", kind: "skill" },
    ],
    bullets: [
      "Built responsive React and Node.js apps for hospitality and retail brands, with reusable UI patterns for campaign work.",
      "Added analytics and SEO foundations so stakeholders could evaluate performance and plan the next round.",
    ],
  },
];
