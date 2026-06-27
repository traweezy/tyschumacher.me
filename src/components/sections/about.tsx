import { Section } from "@/components/layout/section";
import { TechnologyIcon } from "@/components/ui/technology-icons";
import { profile } from "@/data/profile";
import { buildPriorityItems, coreToolItems } from "@/data/skills";

const approachPillars = [
  {
    title: "Find the pressure point",
    body: "I start with the moment where a user can lose time, money, or confidence. Once that moment is clear, the product has a real center.",
  },
  {
    title: "Make the work readable",
    body: "The screen should make sense to the person using it, and the internals should make sense to the team supporting it.",
  },
  {
    title: "Put the build in order",
    body: "A lot of work starts with partial requirements and competing instincts. I turn that into a path the team can ship without guessing.",
  },
] as const;

export const AboutSection = () => (
  <Section
    id="about"
    label="Approach"
    headline="I care most about the parts people rely on"
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
              <h3 className="about-card__title type-heading-4 measure-short">
                {pillar.title}
              </h3>
              <p className="type-body text-[var(--text-secondary)]">
                {pillar.body}
              </p>
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
            The stack changes by problem, but these are the tools I reach for
            when the work needs to move without becoming harder to run later.
          </p>
        </div>
        <div className="about-skills">
          {coreToolItems.map((skill) => (
            <span
              key={skill.name}
              className="about-skill"
              data-skill-accent={skill.accentKey}
            >
              <span className="about-skill__mark" aria-hidden="true">
                <TechnologyIcon
                  name={skill.icon}
                  className="about-skill__icon"
                />
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
            These are the tradeoffs I keep visible while the product is being
            designed, built, and released.
          </p>
        </div>
        <div className="about-skills about-skills--priority">
          {buildPriorityItems.map((skill) => (
            <span
              key={skill.name}
              className="about-skill about-skill--priority"
              data-skill-accent={skill.accentKey}
            >
              <span className="about-skill__mark" aria-hidden="true">
                <TechnologyIcon
                  name={skill.icon}
                  className="about-skill__icon"
                />
              </span>
              <span className="about-skill__label">{skill.name}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  </Section>
);
