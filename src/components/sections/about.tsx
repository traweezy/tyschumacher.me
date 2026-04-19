import type { CSSProperties } from "react";
import { Section } from "@/components/layout/section";
import { TechnologyIcon } from "@/components/ui/technology-icons";
import { profile } from "@/data/profile";
import { skillItems } from "@/data/skills";

const approachPillars = [
  {
    title: "Start with the moment that matters",
    body:
      "I begin with the screen that carries the most risk. If that moment stays clear, the rest of the product usually gets better too.",
  },
  {
    title: "Make the system explain itself",
    body:
      "Logs, metrics, release safety, and support tooling should tell the team what changed and what to do next without guesswork.",
  },
  {
    title: "Turn uncertainty into a plan",
    body:
      "The work usually starts messy. I like getting product, design, and engineering pointed at the same sequence so the team can move.",
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
    <div className="about-card about-card--sequence">
      <p className="about-lead__kicker type-eyebrow">How I usually work</p>
      <ol className="about-sequence">
        {approachPillars.map((pillar, index) => (
          <li key={pillar.title} className="about-sequence__item">
            <span className="about-sequence__index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="about-sequence__content">
              <h3 className="about-card__title type-heading-4 measure-short">{pillar.title}</h3>
              <p className="type-body text-[var(--text-secondary)]">{pillar.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
    <div className="about-card about-card--tools">
      <div className="about-meta">
        <p className="about-meta__label type-eyebrow">Tool stack</p>
        <p className="about-meta__value type-body">
          The stack changes with the job, but this is the set I reach for most often when I need to ship fast and keep the work dependable.
        </p>
      </div>
      <div className="about-skills">
        {skillItems.map((skill) => (
          <span
            key={skill.name}
            className="about-skill"
            style={{ "--skill-accent": skill.accent } as CSSProperties}
          >
            <span className="about-skill__mark" aria-hidden="true">
              {skill.icon ? (
                <TechnologyIcon name={skill.icon} className="about-skill__icon" />
              ) : (
                <span className="about-skill__mono">{skill.mark}</span>
              )}
            </span>
            <span className="about-skill__label">{skill.name}</span>
          </span>
        ))}
      </div>
    </div>
  </Section>
);
