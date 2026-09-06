import { memo } from "react";
import { ArrowDown, Download, ExternalLink, Mail } from "lucide-react";
import { Container } from "@/components/layout/container";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/brand-icons";
import { profile } from "@/data/profile";
import { secondaryNav } from "@/data/navigation";
import { newTabLinkProps, resumeDownloadProps } from "@/lib/link-behavior";

const profileLinks = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  resume: Download,
} as const;
const profileRows = [
  {
    label: "Focus",
    value:
      "Turning complex requirements into software people can use and teams can maintain.",
  },
  { label: "Industries", value: "Sportsbook, electronic trading & operations" },
  { label: "Based in", value: profile.location },
] as const;

export const Hero = memo(() => (
  <section id="home" className="hero">
    <Container className="hero__content">
      <div className="hero__grid">
        <div className="hero__intro">
          <p className="hero__eyebrow type-eyebrow">
            {profile.role} · Product & platform
          </p>
          <h1 className="hero__title type-heading-1 text-balance">
            <span className="hero__name">{profile.name}</span>
          </h1>
          <p className="hero__headline">{profile.headline}</p>
          <p className="type-body-lg measure text-[var(--text-secondary)]">
            {profile.subhead}
          </p>
          <div className="hero__actions">
            <a
              className="hero__cta hero__cta--primary"
              href="#projects"
              data-observe-click="hero.view_projects"
            >
              Explore projects <ArrowDown size={17} aria-hidden="true" />
            </a>
            <a
              className="hero__cta hero__cta--outline"
              href="#contact"
              data-observe-click="hero.contact"
            >
              <Mail size={17} aria-hidden="true" /> Get in touch
            </a>
          </div>
        </div>
        <aside className="hero-snapshot" aria-label="Profile snapshot">
          <div className="hero-snapshot__header">
            <span className="hero-snapshot__role">At a glance</span>
          </div>
          <div className="hero-snapshot__body">
            <dl className="hero-snapshot__rows">
              {profileRows.map((row) => (
                <div key={row.label} className="hero-snapshot__row">
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
            <div
              className="hero__profile-links"
              aria-label="Professional profiles and resume"
            >
              {secondaryNav.map((link) => {
                const Icon = profileLinks[link.id];
                const isResume = link.id === "resume";
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    {...(isResume ? resumeDownloadProps : newTabLinkProps)}
                    data-observe-click={`hero.${link.id}`}
                  >
                    <Icon width={18} height={18} aria-hidden="true" />
                    {isResume ? "Download resume" : link.title}
                    {!isResume && <ExternalLink size={14} aria-hidden="true" />}
                  </a>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </Container>
  </section>
));
Hero.displayName = "Hero";
