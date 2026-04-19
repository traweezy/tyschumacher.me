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
      <div className="hero__intro">
        <p className="hero__eyebrow type-eyebrow" aria-label={`Based in ${profile.location}`}>
          {profile.location}
        </p>
        <h1 className="hero__title type-heading-1 text-balance">
          {profile.name}
          <span className="hero__title-tagline">{profile.headline}</span>
        </h1>
        <p className="type-body-lg measure text-[var(--text-secondary)]">{profile.subhead}</p>
      </div>
      <div className="hero__meta" aria-label="Proof points">
        {HERO_PROOF_POINTS.map((proofPoint) => (
          <span key={proofPoint} className="hero__pill">
            {proofPoint}
          </span>
        ))}
      </div>
      <p className="measure-medium text-sm leading-7 text-[var(--text-secondary)]">
        {profile.availability}
      </p>
      <div className="hero__actions">
        <a
          className="hero__cta hero__cta--primary"
          href="#projects"
          data-observe-click="hero.view_projects"
        >
          See selected work
        </a>
        <a
          className="hero__cta hero__cta--outline"
          href="#contact"
          data-observe-click="hero.contact"
        >
          Start a conversation
        </a>
      </div>
    </Container>
  </section>
);
