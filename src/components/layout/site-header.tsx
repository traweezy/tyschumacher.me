"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Menu, Search, X, ExternalLink, FileText, Github, Linkedin } from "lucide-react";
import { Container } from "@/components/layout/container";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/command/command-palette";
import { primaryNav, secondaryNav } from "@/data/navigation";
import {
  useIsMobileNavOpen,
  useSetCommandOpen,
  useSetMobileNavOpen,
} from "@/state/ui-store";
import { cn } from "@/lib/utils";

const scrollThreshold = 64;

export const SiteHeader = () => {
  const [condensed, setCondensed] = useState(false);
  const [, setActiveId] = useState<string>("home");
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
    const sections = primaryNav
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => Boolean(el));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const id = visible[0].target.getAttribute("id");
          if (id) setActiveId(id);
        }
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const mobileLinks = useMemo(
    () => [
      ...primaryNav.map((item) => ({ ...item, type: "section" as const })),
      ...secondaryNav.map((item) => ({ ...item, type: "external" as const })),
    ],
    [],
  );

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
          "flex h-[88px] items-center justify-between gap-6 transition-[height]",
          condensed && "h-[64px]",
        )}
      >
        <a
          href="#home"
          className="group flex items-center gap-3 rounded-full bg-white/4 px-2 py-1 transition hover:bg-white/6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          <Image
            src="/images/avatar.png"
            alt="Tyler Schumacher"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full border border-white/60 shadow-sm ring-1 ring-black/5 transition group-hover:scale-105"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-[0.18em] uppercase text-[var(--text-primary)] transition group-hover:text-[var(--accent)]">
              Tyler Schumacher
            </span>
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-[var(--text-secondary)]">
              Principal Engineer
            </span>
          </div>
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
          {secondaryNav.map((item) => {
            const Icon =
              item.id === "github"
                ? Github
                : item.id === "linkedin"
                  ? Linkedin
                  : FileText;

            const isResume = item.id === "resume";

            return (
              <Button key={item.id} variant="ghost" size="icon" asChild>
                <a
                  href={item.href}
                  target={isResume ? undefined : "_blank"}
                  rel={isResume ? undefined : "noreferrer"}
                  download={isResume ? true : undefined}
                  aria-label={
                    isResume ? "Download resume (PDF)" : `Visit ${item.title}`
                  }
                  className="cursor-pointer"
                  data-tooltip={
                    isResume ? "Download resume" : `Visit ${item.title}`
                  }
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
                      ? Github
                      : isExternal && item.id === "linkedin"
                        ? Linkedin
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
