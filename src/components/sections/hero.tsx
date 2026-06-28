import { Container } from "@/components/layout/container";
import { profile } from "@/data/profile";

const HERO_WORKING_NOTES = [
  {
    code: "01",
    detail:
      "Trading desks, event teams, and operators need state that is current, legible, and hard to misread.",
    label: "Live work",
    title: "State people can act on",
  },
  {
    code: "02",
    detail:
      "I care about telemetry, rollback paths, and code that gives support teams a clear answer.",
    label: "Readable systems",
    title: "Behavior the team can explain",
  },
  {
    code: "03",
    detail:
      "The best UI work starts by watching where the real workflow slows down or becomes risky.",
    label: "Product sense",
    title: "Workflow before decoration",
  },
] as const;

const HERO_PROFILE_ROWS = [
  {
    label: "Best fit",
    value: "Complex tools with operators, rules, and live state",
  },
  {
    label: "Recent terrain",
    value: "Trading desks, sportsbook, and internal operations",
  },
  {
    label: "Home base",
    value: profile.location,
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
            <span className="hero__name">{profile.name}</span>
            <span className="hero__title-tagline">
              <span className="hero__title-tagline-text">
                {profile.headline}
              </span>
            </span>
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
        <aside className="hero__snapshot" aria-label="Profile snapshot">
          <div className="hero-snapshot">
            <div className="hero-snapshot__header">
              <span className="hero-snapshot__mark" aria-hidden="true">
                TS
              </span>
              <div className="hero-snapshot__identity">
                <span className="hero-snapshot__label type-eyebrow">
                  Profile snapshot
                </span>
                <span className="hero-snapshot__role">{profile.role}</span>
              </div>
            </div>
            <div className="hero-snapshot__body">
              <p className="hero-snapshot__headline">
                I’m strongest when the product is complicated and the workflow
                has to stay calm.
              </p>
              <dl className="hero-snapshot__rows">
                {HERO_PROFILE_ROWS.map((row) => (
                  <div key={row.label} className="hero-snapshot__row">
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </aside>
      </div>
      <div className="hero__principles" aria-label="Working principles">
        {HERO_WORKING_NOTES.map((note) => (
          <div key={note.label} className="hero__principle">
            <span className="hero__principle-code" aria-hidden="true">
              {note.code}
            </span>
            <span className="hero__principle-label">{note.label}</span>
            <strong className="hero__principle-title">{note.title}</strong>
            <span className="hero__principle-detail">{note.detail}</span>
          </div>
        ))}
      </div>
    </Container>
  </section>
);
