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
      "Architected Go services that unify live data providers and concurrent processing so betting surfaces refresh in under 120 milliseconds for millions of fans.",
      "Shipped immersive React experiences for live odds, trader tooling, and internal analytics using virtualization and accessibility patterns that keep fatigue low during peak events.",
      "Channeled FullStory insights and trader interviews into design sprints that reduced critical UX friction points release over release.",
      "Mentored engineers and drove agile rituals that raised code quality while keeping cross functional delivery humming.",
    ],
  },
  {
    company: "Instinet",
    role: "Senior Full Stack Developer",
    start: "Dec 2017",
    end: "Dec 2021",
    location: "New York, NY",
    bullets: [
      "Engineered Node.js and Java services for a high volume trading platform, tuning throughput and compliance for real time financial workflows.",
      "Reimagined legacy Flash workbenches as modular React suites that modernized the trader experience and unlocked rapid iteration.",
      "Refined GitLab CI pipelines and Kubernetes deployments so teams shipped confidently with measurable reliability gains.",
    ],
  },
  {
    company: "Lab49",
    role: "Consultant Engineer",
    start: "Jun 2017",
    end: "Dec 2017",
    location: "New York, NY",
    bullets: [
      "Delivered trading research portals for global banks, balancing accessibility, compliance, and performance targets without interrupting go live schedules.",
      "Partnered with product and legal teams in discovery workshops, translating complex requirements into elegant, buildable web experiences.",
    ],
  },
  {
    company: "Twisted Rope",
    role: "Full Stack Developer",
    start: "Oct 2015",
    end: "Jun 2017",
    location: "Buffalo, NY",
    bullets: [
      "Built responsive React and Node.js applications for hospitality and retail brands, crafting design systems that stayed consistent across campaigns.",
      "Implemented analytics and SEO foundations that boosted organic discovery while giving stakeholders clear signals for roadmap planning.",
    ],
  },
];
