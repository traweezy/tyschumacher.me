export type ExperienceEntry = {
  company: string;
  role: string;
  start: string;
  end?: string;
  location: string;
  bullets: string[];
};

export const experiences: ExperienceEntry[] = [
  {
    company: "Caesars Sportsbook",
    role: "Senior Full Stack Developer",
    start: "Dec 2021",
    location: "Jersey City, NJ · Remote",
    bullets: [
      "Built Go services that normalize live data providers and keep betting surfaces current through large event traffic.",
      "Built React screens for live odds, trader tools, and internal analytics, using virtualization and accessible patterns for long event windows.",
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
    bullets: [
      "Built Node.js and Java services for a high-volume trading platform, tuning throughput and compliance paths for real-time workflows.",
      "Moved legacy Flash workbenches into modular React tools so traders could work in a modern interface and teams could iterate faster.",
      "Improved GitLab CI and Kubernetes deployment paths so releases were easier to reason about and recover.",
    ],
  },
  {
    company: "Lab49",
    role: "Consultant Engineer",
    start: "Jun 2017",
    end: "Dec 2017",
    location: "New York, NY",
    bullets: [
      "Built trading research portals for global banks while balancing accessibility, compliance, and performance requirements.",
      "Worked with product and legal teams to turn complex requirements into screens and services engineers could actually build.",
    ],
  },
  {
    company: "Twisted Rope",
    role: "Full Stack Developer",
    start: "Oct 2015",
    end: "Jun 2017",
    location: "Buffalo, NY",
    bullets: [
      "Built responsive React and Node.js apps for hospitality and retail brands, with reusable UI patterns for campaign work.",
      "Added analytics and SEO foundations so stakeholders could see what was working and plan the next round.",
    ],
  },
];
