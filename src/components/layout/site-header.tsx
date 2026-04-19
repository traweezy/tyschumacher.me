"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, Search, X, ExternalLink, FileText } from "lucide-react";
import { Container } from "@/components/layout/container";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
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

  const mobileLinks = useMemo(
    () => [
      ...primaryNav.map((item) => ({ ...item, type: "section" as const })),
      ...secondaryNav.map((item) => ({ ...item, type: "external" as const })),
    ],
    [],
  );

  const resumeLink = secondaryNav.find((item) => item.id === "resume");
  const socialLinks = secondaryNav.filter((item) => item.id !== "resume");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-transparent backdrop-blur transition-[background,border-color,height]",
        condensed && "border-b-[var(--border)] bg-[var(--surface-100)]",
      )}
    >
      <div className="scroll-progress" aria-hidden ref={progressRef} />
      <Container
        className={cn(
          "flex h-[76px] items-center justify-between gap-4 transition-[height]",
          condensed && "h-[58px]",
        )}
      >
        <a
          href="#home"
          className="site-mark focus-ring"
        >
          <span className="site-mark__monogram" aria-hidden="true">
            TS
          </span>
          <span className="site-mark__copy">
            <span className="site-mark__name">{profile.name}</span>
            <span className="site-mark__meta">
              <span>Principal product engineer</span>
              <span className="site-mark__dot" aria-hidden="true" />
              <span>{profile.location}</span>
            </span>
          </span>
        </a>
        <nav className="hidden flex-1 md:flex" aria-label="Primary navigation">
          <NavigationMenu>
            <NavigationMenuList>
              {primaryNav.map((item) => (
                <NavigationMenuItem key={item.id}>
                  <NavigationMenuLink asChild>
                    <a
                      href={item.href}
                      className="nav-pill focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-0)]"
                      title={`Go to ${item.title}`}
                    >
                      {item.title}
                    </a>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {resumeLink ? (
            <Button variant="outline" size="sm" asChild>
              <a
                href={resumeLink.href}
                download
                className="cursor-pointer"
                aria-label="Download resume (PDF)"
              >
                Resume
              </a>
            </Button>
          ) : null}
          {socialLinks.map((item) => {
            const Icon =
              item.id === "github"
                ? GitHubIcon
                : item.id === "linkedin"
                  ? LinkedInIcon
                  : FileText;

            return (
              <Button key={item.id} variant="ghost" size="icon" asChild>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Visit ${item.title}`}
                  className="cursor-pointer"
                  data-tooltip={`Visit ${item.title}`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              </Button>
            );
          })}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCommandOpen(true)}
            aria-label="Open command palette"
            data-tooltip="Command palette"
            className="cursor-pointer"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCommandOpen(true)}
            aria-label="Open command palette"
            data-tooltip="Command palette"
            className="cursor-pointer"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Sheet open={isMobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={isMobileNavOpen ? "Close navigation" : "Open navigation"}
              >
                {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="mt-8 flex flex-col gap-4" aria-label="Mobile navigation">
                {mobileLinks.map((item) => {
                  const isExternal = item.type === "external";
                  const isResume = item.id === "resume";
                  const Icon =
                    isExternal && item.id === "github"
                      ? GitHubIcon
                      : isExternal && item.id === "linkedin"
                        ? LinkedInIcon
                        : isExternal && item.id === "resume"
                          ? FileText
                          : isExternal
                            ? ExternalLink
                            : null;
                  return (
                    <SheetClose asChild key={item.id}>
                      <a
                        href={item.href}
                        className="nav-sheet-item"
                        target={isExternal && !isResume ? "_blank" : undefined}
                        rel={isExternal && !isResume ? "noreferrer" : undefined}
                        download={isResume ? true : undefined}
                        title={`Go to ${item.title}`}
                      >
                        {item.title}
                        {Icon ? <Icon className="ml-2 h-4 w-4" /> : null}
                      </a>
                    </SheetClose>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
      <CommandPalette />
    </header>
  );
};
