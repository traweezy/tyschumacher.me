import { ArrowDown, Download, ExternalLink, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import { memo } from "react";
import { Container } from "@/components/layout/container";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/brand-icons";
import { secondaryNav } from "@/data/navigation";
import { profile } from "@/data/profile";
import { newTabLinkProps, resumeDownloadProps } from "@/lib/link-behavior";

const profileLinks = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  resume: Download,
} as const;
export const Hero = memo(() => (
  <section id="home" className="hero" aria-labelledby="hero-title">
    <div className="hero__art" aria-hidden="true">
      <Image
        className="hero__image"
        src="/header.webp"
        alt=""
        fill
        sizes="(max-width: 1600px) 2048px, 100vw"
        preload
      />
    </div>
    <Container className="hero__content">
      <div className="hero__intro">
        <p className="hero__eyebrow type-eyebrow">{profile.role}</p>
        <h1 id="hero-title" className="hero__title type-heading-1 text-balance">
          <span className="hero__name">{profile.name}</span>
        </h1>
        <p className="hero__headline">{profile.headline}</p>
        <p className="hero__summary type-body-lg">{profile.subhead}</p>
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
        <nav
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
        </nav>
        <p className="hero__location">
          <MapPin size={15} aria-hidden="true" /> Based in {profile.location}
        </p>
      </div>
    </Container>
  </section>
));
Hero.displayName = "Hero";
