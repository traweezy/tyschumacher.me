import type { CSSProperties } from "react";
import { Section } from "@/components/layout/section";
import { TechnologyIcon } from "@/components/ui/technology-icons";
import { profile } from "@/data/profile";
import { buildPriorityItems, coreToolItems } from "@/data/skills";

const approachPillars = [
  {
    title: "Start with the failure point",
    body:
      "I begin where confusion, money movement, or operational risk can compound. Once that moment is clear, the rest of the product usually gets easier to shape.",
  },
  {
    title: "Make the system legible",
    body:
      "The interface should read clearly for the user, and the internals should read clearly for the team supporting it. Instrumentation and release checks need to help, not decorate.",
  },
  {
    title: "Turn ambiguity into sequence",
    body:
      "A lot of work starts with partial requirements and competing instincts. I turn that into a sequence the team can ship without stepping on itself.",
  },
] as const;

export const AboutSection = () => (
  <Section
    id="about"
    label="Approach"
    headline="I make the risky part easier to understand"
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
          <p className="about-meta__label type-eyebrow">Tool stack</p>
          <p className="about-meta__value type-body">
            These are the tools I use most when the work needs to move quickly without making the system harder to operate later.
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
                <TechnologyIcon name={skill.icon} className="about-skill__icon" />
              </span>
              <span className="about-skill__label">{skill.name}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="about-card about-card--focus">
        <div className="about-meta">
          <p className="about-meta__label type-eyebrow">What I optimize for</p>
          <p className="about-meta__value type-body">
            These are the qualities I keep protecting while the product is being designed, built, and released.
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
                <TechnologyIcon name={skill.icon} className="about-skill__icon" />
              </span>
              <span className="about-skill__label">{skill.name}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  </Section>
);
