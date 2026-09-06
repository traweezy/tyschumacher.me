import { memo } from "react";
import { Section } from "@/components/layout/section";
import { TechnologyIcon } from "@/components/ui/technology-icons";
import { profile } from "@/data/profile";
import { buildPriorityItems, skillGroups } from "@/data/skills";
import type { SkillItem } from "@/data/skills";

const workingPractices = [
  {
    title: "Understand the workflow",
    body: "Start with users, constraints, and the decisions the software needs to support.",
  },
  {
    title: "Make behavior clear",
    body: "Design readable interfaces and instrument the services behind them so teams can understand what happened.",
  },
  {
    title: "Plan for ownership",
    body: "Review tradeoffs, test critical paths, and make releases and recovery part of the design.",
  },
] as const;

const SkillList = memo<{ items: readonly SkillItem[]; label: string }>(
  ({ items, label }) => (
    <ul className="about-skills" aria-label={label}>
      {items.map((skill) => (
        <li
          key={skill.name}
          className="about-skill"
          data-skill-accent={skill.accentKey}
        >
          <span className="about-skill__mark" aria-hidden="true">
            <TechnologyIcon name={skill.icon} className="about-skill__icon" />
          </span>
          <span className="about-skill__label">{skill.name}</span>
        </li>
      ))}
    </ul>
  ),
);
SkillList.displayName = "SkillList";

export const AboutSection = memo(() => (
  <Section
    id="about"
    label="Skills"
    headline="Skills & tools"
    caption={profile.bio[0]}
    contentClassName="skills-content"
  >
    <div className="skills-groups">
      {skillGroups.map((group) => (
        <div key={group.title} className="about-card">
          <h3 className="skills-group__title">{group.title}</h3>
          <SkillList items={group.items} label={group.title} />
        </div>
      ))}
    </div>
    <div className="working-practices">
      <div>
        <h3 className="type-heading-3">How I work</h3>
        <p className="type-body text-[var(--text-secondary)]">
          {profile.bio[1]}
        </p>
      </div>
      <ol className="working-practices__list">
        {workingPractices.map((practice) => (
          <li key={practice.title}>
            <h4 className="skills-group__title">{practice.title}</h4>
            <p className="type-body-sm text-[var(--text-secondary)]">
              {practice.body}
            </p>
          </li>
        ))}
      </ol>
    </div>
    <div className="engineering-priorities">
      <h3 className="skills-group__title">Engineering priorities</h3>
      <SkillList items={buildPriorityItems} label="Engineering priorities" />
    </div>
  </Section>
));
AboutSection.displayName = "AboutSection";
