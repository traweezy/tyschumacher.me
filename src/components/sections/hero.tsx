import { Container } from "@/components/layout/container";
import { profile } from "@/data/profile";

const HERO_WORKING_NOTES = [
  {
    detail:
      "Trading desks, event teams, and operators need state they can read quickly.",
    label: "Live work",
    title: "Screens for decisions in motion",
  },
  {
    detail:
      "I care about telemetry, rollback paths, and code that is boring to operate.",
    label: "Readable systems",
    title: "Behavior teams can explain",
  },
  {
    detail:
      "The best UI work starts with watching where the real workflow gets stuck.",
    label: "Product sense",
    title: "Tools shaped by the user",
  },
] as const;

export const Hero = () => (
  <section id="home" className="hero">
    <Container className="hero__content">
      <div className="hero__grid">
        <div className="hero__intro">
          <p
            className="hero__eyebrow type-eyebrow"
            aria-label={`Based in ${profile.location}`}
          >
            {profile.location}
          </p>
          <h1 className="hero__title type-heading-1 text-balance">
            {profile.name}
            <span className="hero__title-tagline">{profile.headline}</span>
          </h1>
          <p className="type-body-lg measure text-[var(--text-secondary)]">
            {profile.subhead}
          </p>
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
            <p className="hero__rail-label type-eyebrow">Working profile</p>
            <dl className="hero__facts">
              <div className="hero__fact">
                <dt>Focus</dt>
                <dd>
                  Interfaces for trading, sportsbook, and internal teams making
                  time-sensitive decisions.
                </dd>
              </div>
              <div className="hero__fact">
                <dt>Base</dt>
                <dd>{profile.location}</dd>
              </div>
              <div className="hero__fact">
                <dt>Known for</dt>
                <dd>{profile.workingStyle}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
      <div className="hero__principles" aria-label="Working principles">
        {HERO_WORKING_NOTES.map((note) => (
          <div key={note.label} className="hero__principle">
            <span className="hero__principle-label">{note.label}</span>
            <strong className="hero__principle-title">{note.title}</strong>
            <span className="hero__principle-detail">{note.detail}</span>
          </div>
        ))}
      </div>
    </Container>
  </section>
);
