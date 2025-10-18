import Image from "next/image";
import { Container } from "@/components/layout/container";
import { profile } from "@/data/profile";

export const Hero = () => (
  <section id="home" className="hero">
    <Container className="hero__content">
      <div className="hero__lead">
        <div className="hero__image">
          <span className="hero__image-glow" aria-hidden="true" />
          <div className="hero__image-frame">
            <Image
              src="/images/avatar.png"
              alt="Portrait of Tyler Schumacher"
              width={280}
              height={280}
              priority
            />
          </div>
        </div>
        <div className="hero__copy">
          <p className="hero__eyebrow">Principal Engineer · {profile.location}</p>
          <h1 className="hero__title text-balance">{profile.headline}</h1>
          <p className="hero__subtitle text-pretty">{profile.subhead}</p>
          <div className="hero__actions">
            <a className="hero__cta" href="#projects">
              View projects
            </a>
            <a
              className="hero__cta hero__cta--outline"
              href="/tyler-schumacher-resume.pdf"
              download
            >
              Download résumé
            </a>
          </div>
        </div>
      </div>
    </Container>
  </section>
);

