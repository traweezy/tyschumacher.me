// Roles, dates, contributions, skills, and contact links come from the website.
// Keep only information specific to the one-page resume here.
export const resume = {
  phone: "+1 (716) 948 4255",
  summary:
    "Senior full stack and product engineer with 10+ years building real time sportsbook, electronic trading, banking, commerce, and AI enabled software. Designs Go and Java services and TypeScript and React interfaces for complex, compliance sensitive workflows. Leads technical design, mentors engineers, and improves product quality, operational clarity, and release safety.",
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
    {
      slug: "remorseless-records",
      description:
        "Built a commerce system with idempotent payment recovery, versioned publishing workflows, search, and privacy bounded telemetry.",
    },
  ],
  education: {
    school: "SUNY New Paltz",
    degree: "Bachelor's degree in Computer Science",
    start: "August 2011",
    end: "May 2015",
  },
} as const;
