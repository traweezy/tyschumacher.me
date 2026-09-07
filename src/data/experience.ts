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
      "Built Go and Java integrations that normalized provider data and kept live betting interfaces current.",
      "Built accessible React tools for live odds, trader workflows, and analytics, with virtualized lists for changing data.",
      "Used FullStory sessions and trader feedback to identify usability issues and prioritize fixes.",
      "Mentored engineers, reviewed technical designs, and guided delivery decisions.",
    ],
  },
  {
    company: "Instinet",
    role: "Senior Full Stack Developer",
    start: "Dec 2017",
    end: "Dec 2021",
    location: "New York, NY",
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
      "Built Node.js and Java services for electronic trading, balancing throughput, reliability, and compliance.",
      "Modernized legacy Flash workbenches into modular React tools for traders and engineering teams.",
      "Improved GitLab CI and Kubernetes workflows so releases were easier to inspect and recover.",
    ],
  },
  {
    company: "Lab49",
    role: "Front End Developer",
    start: "Jun 2017",
    end: "Dec 2017",
    location: "New York, NY",
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
      "Built accessible React research portals with Java teams, meeting banking compliance and performance requirements.",
      "Translated product and legal requirements into practical interfaces and service integrations.",
    ],
  },
  {
    company: "Twisted Rope",
    role: "Full Stack Web Developer",
    start: "Oct 2015",
    end: "Jun 2017",
    location: "Buffalo, NY",
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
      "Built responsive React and Node.js applications for hospitality and retail, with reusable UI patterns.",
      "Added analytics and SEO foundations to help clients evaluate campaigns and plan future work.",
    ],
  },
];
