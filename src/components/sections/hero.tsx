import { Container } from "@/components/layout/container";
import { profile } from "@/data/profile";

const HERO_PROOF_POINTS = [
  {
    detail: "finance, sportsbook, media",
    label: "Experience",
    value: "12+ years",
  },
  {
    detail: "live trading surfaces",
    label: "Latency",
    value: "<120ms",
  },
  {
    detail: "faster release lead time",
    label: "Delivery",
    value: "47%",
  },
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
            <p className="hero__rail-label type-eyebrow">At a glance</p>
            <dl className="hero__facts">
              <div className="hero__fact">
                <dt>Focus</dt>
                <dd>Operator software where interface quality and system behavior have to hold up together.</dd>
              </div>
              <div className="hero__fact">
                <dt>Base</dt>
                <dd>{profile.location}</dd>
              </div>
              <div className="hero__fact">
                <dt>Looking for</dt>
                <dd>{profile.availability}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
      <div className="hero__meta" aria-label="Proof points">
        {HERO_PROOF_POINTS.map((proofPoint) => (
          <div key={proofPoint.label} className="hero__stat">
            <span className="hero__stat-label">{proofPoint.label}</span>
            <strong className="hero__stat-value">{proofPoint.value}</strong>
            <span className="hero__stat-detail">{proofPoint.detail}</span>
          </div>
        ))}
      </div>
    </Container>
  </section>
);
