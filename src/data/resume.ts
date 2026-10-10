// Roles, dates, contributions, skills, and contact links come from the website.
// Keep only information specific to the one-page resume here.
export const resume = {
  phone: "+1 (716) 948 4255",
  summary:
    "Senior full stack and product engineer with 10+ years across commerce, sportsbook, trading, banking, and applied AI. Current freelance client: Remorseless Records. Builds accessible React and TypeScript interfaces and reliable Go, Java, and Node.js services.",
  experienceBulletLimits: [
    { company: "Lab49", count: 1 },
    { company: "Twisted Rope", count: 1 },
  ],
  projects: [
    {
      slug: "stackctl",
      description:
        "Created reproducible local service stacks with stable JSON contracts, health diagnostics, release checksums, SPDX SBOMs, and artifact attestations.",
    },
    {
      slug: "relantern",
      description:
        "Built a developer intelligence platform with hybrid retrieval, reciprocal rank fusion, structured LLM outputs, evidence validation, cost controls, and offline evaluations.",
    },
  ],
  education: {
    school: "SUNY New Paltz",
    degree: "Bachelor's degree in Computer Science",
    start: "August 2011",
    end: "May 2015",
  },
} as const;
