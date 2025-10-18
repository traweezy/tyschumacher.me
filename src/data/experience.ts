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
    location: "Remote · USA",
    bullets: [
      "Lead the realtime architecture for trading and player surfaces, delivering <120ms updates across 4 platforms.",
      "Partnered with design and data to build accessible analytics that keep traders informed without cognitive overload.",
      "Instituted automated accessibility, performance, and security checks as golden paths for every squad.",
    ],
  },
  {
    company: "Instinet",
    role: "Senior Full Stack Developer",
    start: "2017",
    end: "2021",
    location: "New York, NY",
    bullets: [
      "Modernized equities execution tooling with React, Go, and GraphQL—cut analyst onboarding time by 35%.",
      "Developed risk dashboards and replay tooling that shrank incident MTTR from hours to minutes.",
      "Introduced component systems and CI/CD pipelines that kept compliance, localization, and theming aligned.",
    ],
  },
  {
    company: "Lab49",
    role: "Consultant Engineer",
    start: "2015",
    end: "2017",
    location: "New York, NY",
    bullets: [
      "Delivered trading research platforms for global banks with performance budgets and zero-downtime rollouts.",
      "Ran discovery workshops that translated compliance and accessibility requirements into buildable features.",
    ],
  },
  {
    company: "Twisted Rope",
    role: "Full Stack Developer",
    start: "2013",
    end: "2015",
    location: "Buffalo, NY",
    bullets: [
      "Built responsive marketing experiences and design systems for hospitality and retail brands.",
      "Implemented analytics and SEO foundations that informed roadmap decisions without compromising privacy.",
    ],
  },
];
