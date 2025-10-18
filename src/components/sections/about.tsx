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
          <dt>Location</dt>
          <dd>{profile.location}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </dd>
        </div>
        <div>
          <dt>Availability</dt>
          <dd>{profile.availability}</dd>
        </div>
      </dl>
    </div>
    <div className="about-card">
      <h3 className="about-card__title">Skills & Focus Areas</h3>
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
