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
        value:
          "Keeping complex interfaces responsive and clear as information changes.",
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
      "Created Go and Java services that normalized data from live providers and kept betting interfaces current during major events.",
      "Built React screens for live odds, trader tools, and internal analytics, with virtualized lists and accessible controls for use during long sessions.",
      "Used FullStory sessions and trader feedback to identify usability problems and prioritize fixes.",
      "Mentored engineers, reviewed designs, and helped teams make delivery decisions.",
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
      "Built Node.js and Java services for a trading platform handling large transaction volumes and strict compliance requirements.",
      "Replaced legacy Flash workbenches with modular React tools that were easier for traders to use and teams to maintain.",
      "Improved GitLab CI pipelines and Kubernetes deployments to make releases easier to inspect and recover from failures.",
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
      "Built React interfaces for bank research portals and collaborated with Java backend teams on accessibility, compliance, and performance requirements.",
      "Worked with product and legal teams to turn complex requirements into screens and services engineers could build.",
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
      "Built responsive React and Node.js apps for hospitality and retail brands, with reusable UI patterns for campaign work.",
      "Added analytics and SEO improvements so clients could measure campaign performance and plan future work.",
    ],
  },
];
