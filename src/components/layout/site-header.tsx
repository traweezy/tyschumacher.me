"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, FileText, Menu, Search, X } from "lucide-react";
import { Container } from "@/components/layout/container";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/brand-icons";
import { CommandPalette } from "@/components/command/command-palette";
import { primaryNav, secondaryNav } from "@/data/navigation";
import { profile } from "@/data/profile";
import {
  useIsMobileNavOpen,
  useSetCommandOpen,
  useSetMobileNavOpen,
} from "@/state/ui-store";
import { cn } from "@/lib/utils";

const scrollThreshold = 64;
type PrimaryNavId = (typeof primaryNav)[number]["id"];

export const SiteHeader = () => {
  const [condensed, setCondensed] = useState(false);
  const [activeSection, setActiveSection] = useState<PrimaryNavId>(primaryNav[0].id);
  const isMobileNavOpen = useIsMobileNavOpen();
  const setMobileNavOpen = useSetMobileNavOpen();
  const setCommandOpen = useSetCommandOpen();
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setCondensed(window.scrollY > scrollThreshold);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const progressEl = progressRef.current;
    if (!progressEl || typeof window === "undefined") {
      return;
    }
    if (CSS && CSS.supports && CSS.supports("(animation-timeline: scroll())")) {
      return;
    }
    const updateProgress = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollable <= 0 ? 0 : Math.min(window.scrollY / scrollable, 1);
      progressEl.style.setProperty("--progress-scale", progress.toString());
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncHash = () => {
      const hash = window.location.hash.replace("#", "");
      const matchingItem = primaryNav.find((item) => item.id === hash);
      if (matchingItem) {
        setActiveSection(matchingItem.id);
      }
    };

    const sections = primaryNav.flatMap((item) => {
      const section = document.getElementById(item.id);
      return section instanceof HTMLElement ? [section] : [];
    });

    syncHash();
    if (!sections.length) {
      window.addEventListener("hashchange", syncHash);
      return () => window.removeEventListener("hashchange", syncHash);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (!visibleEntries.length) {
          return;
        }

        visibleEntries.sort((entryA, entryB) => {
          if (entryB.intersectionRatio !== entryA.intersectionRatio) {
            return entryB.intersectionRatio - entryA.intersectionRatio;
          }
          return entryA.boundingClientRect.top - entryB.boundingClientRect.top;
        });

        const activeId = visibleEntries[0]?.target.id;
        const matchingItem = primaryNav.find((item) => item.id === activeId);
        if (matchingItem) {
          setActiveSection(matchingItem.id);
        }
      },
      {
        rootMargin: "-18% 0px -58% 0px",
        threshold: [0.18, 0.35, 0.55, 0.72],
      },
    );

    sections.forEach((section) => observer.observe(section));
    window.addEventListener("hashchange", syncHash);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", syncHash);
    };
  }, []);

  const resumeLink = secondaryNav.find((item) => item.id === "resume");
  const socialLinks = secondaryNav.filter((item) => item.id !== "resume");

  return (
    <header
      className={cn(
        "site-header sticky top-0 z-50",
        condensed && "site-header--condensed",
      )}
    >
      <div className="scroll-progress" aria-hidden ref={progressRef} />
      <Container className="site-header__frame">
        <div className="site-header__bar">
          <a href="#home" className="site-header__identity focus-ring">
            <span className="site-header__avatar-wrap">
              <Image
                src="/images/avatar.png"
                alt={`Portrait of ${profile.name}`}
                width={48}
                height={48}
                priority
                className="site-header__avatar"
              />
            </span>
            <span className="site-header__identity-copy">
              <span className="site-header__name">{profile.name}</span>
              <span className="site-header__identity-meta">
                <span>{profile.role}</span>
                <span className="site-header__meta-dot" aria-hidden="true" />
                <span>{profile.location}</span>
              </span>
            </span>
          </a>
          <div className="site-header__desktop">
            <nav className="site-header__nav" aria-label="Primary navigation">
              {primaryNav.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "site-header__nav-link",
                    activeSection === item.id && "site-header__nav-link--active",
                  )}
                  aria-current={activeSection === item.id ? "location" : undefined}
                >
                  {item.title}
                </a>
              ))}
            </nav>
            <div className="site-header__actions">
              <button
                type="button"
                className="site-header__utility"
                onClick={() => setCommandOpen(true)}
                aria-label="Open command palette"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
                <span className="site-header__shortcut" aria-hidden="true">
                  ⌘K
                </span>
              </button>
              {resumeLink ? (
                <a
                  href={resumeLink.href}
                  download
                  className="site-header__utility site-header__utility--primary"
                  aria-label="Download resume (PDF)"
                >
                  <span>Resume</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </div>
          <div className="site-header__mobile-actions">
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              aria-label="Open command palette"
              className="site-header__icon-button"
            >
              <Search className="h-5 w-5" />
            </button>
            <Sheet open={isMobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="site-header__icon-button"
                  aria-label={isMobileNavOpen ? "Close navigation" : "Open navigation"}
                >
                  {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </SheetTrigger>
              <SheetContent className="site-header__sheet">
                <SheetTitle className="sr-only">Site navigation</SheetTitle>
                <SheetDescription className="sr-only">
                  Browse page sections, external profiles, and the resume download.
                </SheetDescription>
                <div className="site-header__sheet-card">
                  <div className="site-header__sheet-profile">
                    <div className="site-header__sheet-avatar-wrap">
                      <Image
                        src="/images/avatar.png"
                        alt={`Portrait of ${profile.name}`}
                        width={56}
                        height={56}
                        className="site-header__avatar"
                      />
                    </div>
                    <div className="site-header__sheet-copy">
                      <p className="site-header__sheet-name">{profile.name}</p>
                      <p className="site-header__sheet-role">{profile.role}</p>
                      <p className="site-header__sheet-meta">{profile.location}</p>
                    </div>
                  </div>
                  <nav className="site-header__sheet-section" aria-label="Mobile navigation">
                    <p className="site-header__sheet-label type-eyebrow">Sections</p>
                    <div className="site-header__sheet-links">
                      {primaryNav.map((item, index) => (
                        <SheetClose asChild key={item.id}>
                          <a
                            href={item.href}
                            className={cn(
                              "site-header__sheet-link",
                              activeSection === item.id && "site-header__sheet-link--active",
                            )}
                          >
                            <span className="site-header__sheet-link-copy">
                              <span className="site-header__sheet-index" aria-hidden="true">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <span>{item.title}</span>
                            </span>
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        </SheetClose>
                      ))}
                    </div>
                  </nav>
                  <div className="site-header__sheet-section">
                    <p className="site-header__sheet-label type-eyebrow">Elsewhere</p>
                    <div className="site-header__sheet-links">
                      {socialLinks.map((item) => {
                        const Icon = item.id === "github" ? GitHubIcon : LinkedInIcon;

                        return (
                          <SheetClose asChild key={item.id}>
                            <a
                              href={item.href}
                              className="site-header__sheet-link"
                              target="_blank"
                              rel="noreferrer"
                            >
                              <span className="site-header__sheet-link-copy">
                                <span className="site-header__sheet-index" aria-hidden="true">
                                  {item.id === "github" ? "GH" : "IN"}
                                </span>
                                <span>{item.title}</span>
                              </span>
                              <Icon className="h-4 w-4" />
                            </a>
                          </SheetClose>
                        );
                      })}
                      {resumeLink ? (
                        <SheetClose asChild>
                          <a href={resumeLink.href} className="site-header__sheet-link" download>
                            <span className="site-header__sheet-link-copy">
                              <span className="site-header__sheet-index" aria-hidden="true">
                                CV
                              </span>
                              <span>{resumeLink.title}</span>
                            </span>
                            <FileText className="h-4 w-4" />
                          </a>
                        </SheetClose>
                      ) : null}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
      <CommandPalette />
    </header>
  );
};
