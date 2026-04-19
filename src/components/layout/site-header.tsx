"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ExternalLink, FileText, Menu, Search, X } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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

export const SiteHeader = () => {
  const [condensed, setCondensed] = useState(false);
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

  const resumeLink = secondaryNav.find((item) => item.id === "resume");
  const socialLinks = secondaryNav.filter((item) => item.id !== "resume");

  return (
    <header
      className={cn(
        "site-header sticky top-0 z-50 transition-[padding,background]",
        condensed && "site-header--condensed",
      )}
    >
      <div className="scroll-progress" aria-hidden ref={progressRef} />
      <Container className="site-header__frame">
        <div className="site-header__shell">
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
              <span className="site-header__eyebrow">{profile.location}</span>
              <span className="site-header__title-row">
                <span className="site-header__name">{profile.name}</span>
                <span className="site-header__availability">
                  <span className="site-header__availability-dot" aria-hidden="true" />
                  Available for staff and principal roles
                </span>
              </span>
              <span className="site-header__role">Principal product engineer</span>
            </span>
          </a>
          <div className="hidden flex-1 items-center justify-end gap-4 lg:flex">
            <nav className="site-header__nav" aria-label="Primary navigation">
              {primaryNav.map((item) => (
                <a key={item.id} href={item.href} className="site-header__nav-link">
                  {item.title}
                </a>
              ))}
            </nav>
            <div className="site-header__actions">
              <button
                type="button"
                className="site-header__command"
                onClick={() => setCommandOpen(true)}
                aria-label="Open command palette"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
                <span className="site-header__shortcut" aria-hidden="true">
                  ⌘K
                </span>
              </button>
              <div className="site-header__socials" aria-label="External links">
                {socialLinks.map((item) => {
                  const Icon = item.id === "github" ? GitHubIcon : LinkedInIcon;

                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Visit ${item.title}`}
                      className="site-header__social"
                      data-tooltip={`Visit ${item.title}`}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
              {resumeLink ? (
                <a
                  href={resumeLink.href}
                  download
                  className="site-header__resume"
                  aria-label="Download resume (PDF)"
                >
                  <span>Resume</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-2 lg:hidden">
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
                      <p className="site-header__sheet-role">Principal product engineer</p>
                      <p className="site-header__sheet-meta">{profile.location}</p>
                    </div>
                  </div>
                  <nav className="site-header__sheet-section" aria-label="Mobile navigation">
                    <p className="site-header__sheet-label type-eyebrow">Navigate</p>
                    <div className="site-header__sheet-links">
                      {primaryNav.map((item) => (
                        <SheetClose asChild key={item.id}>
                          <a href={item.href} className="site-header__sheet-link">
                            <span>{item.title}</span>
                          </a>
                        </SheetClose>
                      ))}
                    </div>
                  </nav>
                  <div className="site-header__sheet-section">
                    <p className="site-header__sheet-label type-eyebrow">Elsewhere</p>
                    <div className="site-header__sheet-links">
                      {secondaryNav.map((item) => {
                        const isResume = item.id === "resume";
                        const Icon =
                          item.id === "github"
                            ? GitHubIcon
                            : item.id === "linkedin"
                              ? LinkedInIcon
                              : isResume
                                ? FileText
                                : ExternalLink;

                        return (
                          <SheetClose asChild key={item.id}>
                            <a
                              href={item.href}
                              className="site-header__sheet-link"
                              target={isResume ? undefined : "_blank"}
                              rel={isResume ? undefined : "noreferrer"}
                              download={isResume ? true : undefined}
                            >
                              <span>{item.title}</span>
                              <Icon className="h-4 w-4" />
                            </a>
                          </SheetClose>
                        );
                      })}
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
