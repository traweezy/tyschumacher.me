import { Container } from "@/components/layout/container";
import { profile } from "@/data/profile";

const HERO_PROOF_POINTS = [
  "12+ years across finance, sports, and media",
  "<120ms live surfaces for trading workflows",
  "47% faster release lead time on platform delivery",
] as const;

export const Hero = () => (
  <section id="home" className="hero">
    <Container className="hero__content">
      <div className="hero__grid">
        <div className="hero__intro">
          <p className="hero__eyebrow type-eyebrow" aria-label={`Based in ${profile.location}`}>
            {profile.location}
          </p>
          <h1 className="hero__title type-heading-1 text-balance">
            {profile.name}
            <span className="hero__title-tagline">{profile.headline}</span>
          </h1>
          <p className="type-body-lg measure text-[var(--text-secondary)]">{profile.subhead}</p>
          <div className="hero__actions">
            <a
              className="hero__cta hero__cta--primary"
              href="#experience"
              data-observe-click="hero.view_experience"
            >
              Review experience
            </a>
            <a
              className="hero__cta hero__cta--outline"
              href="#contact"
              data-observe-click="hero.contact"
            >
              Start a conversation
            </a>
          </div>
        </div>
        <aside className="hero__rail" aria-label="Working profile">
          <div className="hero__rail-card">
            <p className="hero__rail-label type-eyebrow">Working Profile</p>
            <dl className="hero__facts">
              <div className="hero__fact">
                <dt>Focus</dt>
                <dd>Operator-facing product work where UI quality and system behavior fail together.</dd>
              </div>
              <div className="hero__fact">
                <dt>Base</dt>
                <dd>{profile.location}</dd>
              </div>
              <div className="hero__fact">
                <dt>Now</dt>
                <dd>{profile.availability}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
      <div className="hero__meta" aria-label="Proof points">
        {HERO_PROOF_POINTS.map((proofPoint) => (
          <span key={proofPoint} className="hero__pill">
            {proofPoint}
          </span>
        ))}
      </div>
    </Container>
  </section>
);
