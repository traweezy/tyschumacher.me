import type { CSSProperties } from "react";
import { Section } from "@/components/layout/section";
import { TechnologyIcon } from "@/components/ui/technology-icons";
import { profile } from "@/data/profile";
import { buildPriorityItems, coreToolItems } from "@/data/skills";

const approachPillars = [
  {
    title: "Start where trust can break",
    body:
      "I like to begin with the part of the product that can confuse people or create the most damage. Once that moment feels clear, the rest tends to come together faster.",
  },
  {
    title: "Give the team clear signals",
    body:
      "The product should make sense to the person using it, and the system should make sense to the people supporting it. Logs, metrics, and release checks need to be useful, not ceremonial.",
  },
  {
    title: "Turn loose ideas into momentum",
    body:
      "Most projects start with half-formed ideas and a lot of opinions. I help shape the sequence so product, design, and engineering can move without dragging each other around.",
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
      <p className="about-lead__kicker type-eyebrow">How I work</p>
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
    <div className="about-stack">
      <div className="about-card about-card--tools">
        <div className="about-meta">
          <p className="about-meta__label type-eyebrow">Core tools</p>
          <p className="about-meta__value type-body">
            These are the tools I reach for most when the product needs to move quickly without the system turning fragile.
          </p>
        </div>
        <div className="about-skills">
          {coreToolItems.map((skill) => (
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
      <div className="about-card about-card--focus">
        <div className="about-meta">
          <p className="about-meta__label type-eyebrow">Build priorities</p>
          <p className="about-meta__value type-body">
            These are not tools. They are the standards I keep pushing on while the product is being designed, built, and shipped.
          </p>
        </div>
        <div className="about-skills about-skills--priority">
          {buildPriorityItems.map((skill) => (
            <span
              key={skill.name}
              className="about-skill about-skill--priority"
              style={{ "--skill-accent": skill.accent } as CSSProperties}
            >
              <span className="about-skill__mark" aria-hidden="true">
                <span className="about-skill__mono">{skill.mark}</span>
              </span>
              <span className="about-skill__label">{skill.name}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  </Section>
);
