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
    location: "Jersey City, New Jersey, Remote",
    caseLog: [
      { label: "Product", value: "Live odds, trader tools, analytics" },
      {
        label: "Focus",
        value: "Keeping complex interfaces responsive and clear as information changes.",
      },
      {
        label: "Personal impact",
        value:
          "Improved workflows through user feedback, reviewed designs, and mentored other engineers.",
      },
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
      "Designed Go and Java integrations that normalize provider data for live betting products and keep market interfaces current as data changes.",
      "Delivered accessible React workflows for live odds, trader operations, and analytics, using list virtualization to preserve responsiveness during continuous updates.",
      "Combined FullStory evidence with trader feedback to prioritize and ship usability improvements for operational workflows.",
      "Led technical design reviews and mentored engineers across interface and service delivery decisions.",
    ],
  },
  {
    company: "Instinet",
    role: "Senior Full Stack Developer",
    start: "Dec 2017",
    end: "Dec 2021",
    location: "New York, New York",
    caseLog: [
      { label: "Product", value: "Trading workbenches and services" },
      {
        label: "Focus",
        value:
          "Modernizing essential tools while protecting reliability and meeting compliance requirements.",
      },
      {
        label: "Personal impact",
        value:
          "Modernized legacy tools and improved how teams review, deploy, and recover releases.",
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
      "Built Node.js and Java services for electronic trading workflows, balancing throughput, reliability, and compliance requirements.",
      "Replaced legacy Flash workbenches with modular React tools for traders and engineering teams, improving maintainability and release independence.",
      "Strengthened GitLab CI and Kubernetes workflows with clearer release inspection and recovery paths.",
    ],
  },
  {
    company: "Lab49",
    role: "Front End Developer",
    start: "Jun 2017",
    end: "Dec 2017",
    location: "New York, New York",
    caseLog: [
      { label: "Product", value: "Bank research portals" },
      {
        label: "Focus",
        value:
          "Turning complex business requirements into accessible, usable interfaces.",
      },
      {
        label: "Personal impact",
        value:
          "Translated product and legal requirements into clear work for engineering teams.",
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
      "Built accessible React research portals and Java service integrations for banking clients, meeting compliance and performance requirements.",
      "Translated product and legal constraints into practical interface and integration designs.",
    ],
  },
  {
    company: "Twisted Rope",
    role: "Full Stack Web Developer",
    start: "Oct 2015",
    end: "Jun 2017",
    location: "Buffalo, New York",
    caseLog: [
      { label: "Product", value: "Hospitality and retail web apps" },
      {
        label: "Focus",
        value:
          "Building adaptable web experiences that support business and marketing goals.",
      },
      {
        label: "Personal impact",
        value:
          "Created reusable interfaces and added analytics to guide future product and campaign decisions.",
      },
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
      "Built responsive React and Node.js applications for hospitality and retail, establishing reusable interface patterns across client work.",
      "Implemented analytics and search foundations that enabled campaign evaluation and planning.",
    ],
  },
];
