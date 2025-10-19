import { Section } from "@/components/layout/section";
import { profile } from "@/data/profile";
import { skills } from "@/data/skills";

export const AboutSection = () => (
  <Section
    id="about"
    label="About"
    headline="Systems thinking with people-first execution"
    caption={profile.bio[0]}
    overline={profile.bio[1]}
    contentClassName="about-grid"
  >
    <div className="about-card">
      <dl className="about-meta">
        <div>
          <dt className="about-meta__label type-eyebrow">Location</dt>
          <dd className="about-meta__value type-body-sm">{profile.location}</dd>
        </div>
        <div>
          <dt className="about-meta__label type-eyebrow">Email</dt>
          <dd className="about-meta__value type-body-sm">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </dd>
        </div>
        <div>
          <dt className="about-meta__label type-eyebrow">Availability</dt>
          <dd className="about-meta__value type-body-sm">{profile.availability}</dd>
        </div>
      </dl>
    </div>
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
