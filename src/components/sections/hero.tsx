import { Container } from "@/components/layout/container";
import { profile } from "@/data/profile";

const HERO_FOCUS_AREAS = [
  "Realtime platforms",
  "Design systems leadership",
  "Observability first delivery",
] as const;

export const Hero = () => (
  <section id="home" className="hero">
    <Container className="hero__content">
      <div className="hero__intro">
        <span className="hero__eyebrow type-eyebrow">{profile.location}</span>
        <h1 className="hero__title type-heading-1 text-balance">
          {profile.name}
          <span className="hero__title-tagline">{profile.headline}</span>
        </h1>
      </div>
      <div className="hero__meta" aria-label="Focus areas">
        {HERO_FOCUS_AREAS.map((focusArea) => (
          <span key={focusArea} className="hero__pill">
            {focusArea}
          </span>
        ))}
      </div>
      <div className="hero__actions">
        <a className="hero__cta hero__cta--primary" href="#experience">
          View experience
        </a>
        <a className="hero__cta hero__cta--outline" href="/tyler-schumacher-resume.pdf" download>
          Download résumé
        </a>
      </div>
    </Container>
  </section>
);
