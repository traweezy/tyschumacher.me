import { Section } from "@/components/layout/section";
import { profile } from "@/data/profile";
import { skills } from "@/data/skills";

const approachPillars = [
  {
    title: "Start with the operating moment",
    body:
      "I work backwards from the busiest screen and the riskiest workflow. Traders, editors, and support teams need software that stays readable when the pace picks up.",
  },
  {
    title: "Make failure instructive",
    body:
      "Observability, rollout safety, and supportability belong in the product definition. I prefer systems that explain what changed, what broke, and what to do next.",
  },
  {
    title: "Turn ambiguity into sequence",
    body:
      "The highest-leverage work is usually cross-functional and underspecified. I like turning that into concrete shipping plans with product, design, data, and engineering in the room.",
  },
] as const;

export const AboutSection = () => (
  <Section
    id="about"
    label="Approach"
    headline="I design for the person carrying the risk"
    caption={profile.bio[0]}
    overline={profile.bio[1]}
    contentClassName="about-grid"
  >
    {approachPillars.map((pillar) => (
      <div key={pillar.title} className="about-card">
        <h3 className="about-card__title type-heading-4 measure-short">{pillar.title}</h3>
        <p className="type-body text-[var(--text-secondary)]">{pillar.body}</p>
      </div>
    ))}
    <div className="about-card about-card--tools">
      <p className="about-meta__label type-eyebrow">Tools I Reach For</p>
      <p className="about-meta__value type-body">
        TypeScript, React, Next.js, Go, Node.js, PostgreSQL, observability tooling, and delivery systems that keep teams confident in production.
      </p>
      <div className="about-skills">
        {skills.map((skill) => (
          <span key={skill} className="about-skill">
            {skill}
          </span>
        ))}
      </div>
    </div>
  </Section>
);
