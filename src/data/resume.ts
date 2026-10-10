// Roles, dates, contributions, skills, and contact links come from the website.
// Keep only information specific to the one-page resume here.
export const resume = {
  phone: "+1 (716) 948 4255",
  summary:
    "Senior full stack and product engineer with 10+ years building commerce, sportsbook, trading, and banking software. Builds accessible React and TypeScript interfaces and Go, Java, and Node.js services. Led technical design reviews and mentored engineers.",
  experienceBulletLimits: [
    { company: "Lab49", count: 1 },
    { company: "Twisted Rope", count: 1 },
  ],
  projects: [
    {
      slug: "stackctl",
      description:
        "Created a Go CLI and dashboard for reproducible local service stacks, with stable JSON contracts, health diagnostics, checksums, SPDX SBOMs, and artifact attestations.",
    },
    {
      slug: "relantern",
      description:
        "Build a developer intelligence platform with hybrid retrieval, reciprocal rank fusion, structured LLM outputs, evidence validation, cost controls, and offline evaluations.",
    },
  ],
  education: {
    school: "SUNY New Paltz",
    degree: "Bachelor's degree in Computer Science",
    start: "August 2011",
    end: "May 2015",
  },
} as const;
