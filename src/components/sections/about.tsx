import { Section } from "@/components/layout/section";
import { profile } from "@/data/profile";
import { skills } from "@/data/skills";

export const AboutSection = () => (
  <Section
    id="about"
    label="About"
    headline="Systems thinking with people first execution"
    caption={profile.bio[0]}
    overline={profile.bio[1]}
    contentClassName="about-grid"
  >
    <div className="about-card">
      <h3 className="about-card__title type-heading-4 measure-short">Skills & Focus Areas</h3>
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
