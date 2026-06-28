"use client";

import Image from "next/image";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  ArrowUpRight,
  FileText,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
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
import { runViewTransition } from "@/lib/view-transitions";
import { cn } from "@/lib/utils";

const scrollThreshold = 64;
type PrimaryNavId = (typeof primaryNav)[number]["id"];

const themeModeOptions = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
] as const;

type ThemeModeId = (typeof themeModeOptions)[number]["id"];

const defaultThemeMode: ThemeModeId = "light";
const themeModeStorageKey = "tyschumacher.theme-mode";
const themeModeChangeEvent = "tyschumacher:theme-mode";
const workingModePopoverId = "working-mode-popover";

const isThemeModeId = (value: string | null): value is ThemeModeId =>
  themeModeOptions.some((option) => option.id === value);

const applyThemeMode = (mode: ThemeModeId): void => {
  document.documentElement.dataset.theme = `civic-${mode}`;
  document.documentElement.dataset.themeMode = mode;
};

const readStoredThemeMode = (): ThemeModeId | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(themeModeStorageKey);
    return isThemeModeId(value) ? value : null;
  } catch {
    return null;
  }
};

const writeStoredThemeMode = (mode: ThemeModeId): void => {
  try {
    window.localStorage.setItem(themeModeStorageKey, mode);
  } catch {
    // Storage can be unavailable in strict privacy modes.
  }
};

const readPreviewMode = (fallback: ThemeModeId): ThemeModeId => {
  if (typeof document === "undefined") {
    return fallback;
  }

  const storedMode = readStoredThemeMode();
  if (storedMode) {
    return storedMode;
  }

  const value = document.documentElement.dataset.themeMode ?? null;
  if (isThemeModeId(value)) {
    return value;
  }

  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return fallback;
};

export const SiteHeader = () => {
  const [condensed, setCondensed] = useState(false);
  const [activeSection, setActiveSection] = useState<PrimaryNavId>(
    primaryNav[0].id,
  );
  const [previewMode, setPreviewMode] = useState<ThemeModeId>(() =>
    readPreviewMode(defaultThemeMode),
  );
  const isMobileNavOpen = useIsMobileNavOpen();
  const setMobileNavOpen = useSetMobileNavOpen();
  const setCommandOpen = useSetCommandOpen();
  const progressRef = useRef<HTMLDivElement | null>(null);
  const popoverCloseTimerRef = useRef<number | null>(null);
  const hasManualModeOverrideRef = useRef(readStoredThemeMode() !== null);
  const [isWorkingModeOpen, setIsWorkingModeOpen] = useState(false);
  const handleSystemModePreference = useEffectEvent((matches: boolean) => {
    if (hasManualModeOverrideRef.current) {
      return;
    }

    const nextMode = matches ? "dark" : "light";
    setPreviewMode(nextMode);
    applyThemeMode(nextMode);
  });

  const handleThemeModeToggle = () => {
    const nextMode = previewMode === "dark" ? "light" : "dark";
    hasManualModeOverrideRef.current = true;
    runViewTransition(() => {
      setPreviewMode(nextMode);
      applyThemeMode(nextMode);
      writeStoredThemeMode(nextMode);
    });
  };

  const handleExternalThemeModeChange = useEffectEvent((mode: ThemeModeId) => {
    hasManualModeOverrideRef.current = true;
    setPreviewMode(mode);
    applyThemeMode(mode);
  });
  const clearPopoverCloseTimer = () => {
    if (popoverCloseTimerRef.current === null) {
      return;
    }

    window.clearTimeout(popoverCloseTimerRef.current);
    popoverCloseTimerRef.current = null;
  };
  const getWorkingModePopover = () =>
    document.getElementById(workingModePopoverId);
  const isPopoverOpen = (popover: HTMLElement): boolean => {
    try {
      return popover.matches(":popover-open");
    } catch {
      return false;
    }
  };
  const showWorkingModePopover = () => {
    clearPopoverCloseTimer();
    const popover = getWorkingModePopover();
    if (
      !popover ||
      typeof popover.showPopover !== "function" ||
      isPopoverOpen(popover)
    ) {
      return;
    }

    popover.showPopover();
  };
  const hideWorkingModePopover = () => {
    const popover = getWorkingModePopover();
    if (
      !popover ||
      typeof popover.hidePopover !== "function" ||
      !isPopoverOpen(popover)
    ) {
      return;
    }

    popover.hidePopover();
  };
  const scheduleHideWorkingModePopover = () => {
    clearPopoverCloseTimer();
    popoverCloseTimerRef.current = window.setTimeout(() => {
      hideWorkingModePopover();
      popoverCloseTimerRef.current = null;
    }, 160);
  };
  const handleWorkingModeToggle = () => {
    clearPopoverCloseTimer();
    const popover = getWorkingModePopover();
    if (!popover) {
      return;
    }

    if (
      typeof popover.showPopover !== "function" ||
      typeof popover.hidePopover !== "function"
    ) {
      return;
    }

    if (isPopoverOpen(popover)) {
      return;
    }

    popover.showPopover();
  };

  useEffect(() => {
    applyThemeMode(previewMode);
  }, [previewMode]);

  useEffect(
    () => () => {
      if (popoverCloseTimerRef.current !== null) {
        window.clearTimeout(popoverCloseTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemModeChange = (event: MediaQueryListEvent) => {
      handleSystemModePreference(event.matches);
    };

    mediaQuery.addEventListener("change", handleSystemModeChange);
    return () =>
      mediaQuery.removeEventListener("change", handleSystemModeChange);
  }, []);

  useEffect(() => {
    const handleThemeModeChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ mode?: string }>;
      const mode = customEvent.detail?.mode ?? null;
      if (isThemeModeId(mode)) {
        handleExternalThemeModeChange(mode);
      }
    };

    window.addEventListener(themeModeChangeEvent, handleThemeModeChange);
    return () =>
      window.removeEventListener(themeModeChangeEvent, handleThemeModeChange);
  }, []);

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
  const nextThemeMode = previewMode === "dark" ? "light" : "dark";
  const themeToggleLabel = `Switch to ${nextThemeMode} theme`;

  return (
    <header
      className={cn(
        "site-header sticky top-0 z-50",
        condensed && "site-header--condensed",
      )}
      data-active-section={activeSection}
    >
      <div className="scroll-progress" aria-hidden ref={progressRef} />
      <Container className="site-header__frame">
        <div className="site-header__bar">
          <div className="site-header__identity">
            <button
              type="button"
              className="site-header__avatar-button"
              aria-expanded={isWorkingModeOpen}
              aria-label="Show working mode"
              onClick={handleWorkingModeToggle}
              onFocus={showWorkingModePopover}
              onBlur={scheduleHideWorkingModePopover}
              onPointerEnter={showWorkingModePopover}
              onPointerLeave={scheduleHideWorkingModePopover}
            >
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
            </button>
            <a
              href="#home"
              className="site-header__identity-copy site-header__identity-link focus-ring"
            >
              <span className="site-header__name">{profile.name}</span>
              <span className="site-header__identity-meta">
                <span>{profile.role}</span>
                <span className="site-header__meta-dot" aria-hidden="true" />
                <span>{profile.location}</span>
              </span>
            </a>
            <div
              id={workingModePopoverId}
              popover="auto"
              className="site-header__working-mode-popover"
              onBlur={scheduleHideWorkingModePopover}
              onFocus={showWorkingModePopover}
              onPointerEnter={showWorkingModePopover}
              onPointerLeave={scheduleHideWorkingModePopover}
              onToggle={(event) => {
                setIsWorkingModeOpen(isPopoverOpen(event.currentTarget));
              }}
            >
              <p className="site-header__popover-label type-eyebrow">
                Working mode
              </p>
              <p className="site-header__popover-title">
                Calm interfaces for live work.
              </p>
              <dl className="site-header__popover-list">
                <div>
                  <dt>Lens</dt>
                  <dd>State, constraint, next move</dd>
                </div>
                <div>
                  <dt>Bias</dt>
                  <dd>Ship small, observe, keep rollback paths close</dd>
                </div>
                <div>
                  <dt>Fit</dt>
                  <dd>Trading, sportsbook, and operator-heavy tools</dd>
                </div>
              </dl>
            </div>
          </div>
          <nav
            className="site-header__desktop-nav"
            aria-label="Primary navigation"
          >
            <div className="site-header__nav">
              {primaryNav.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "site-header__nav-link",
                    activeSection === item.id &&
                      "site-header__nav-link--active",
                  )}
                  aria-current={
                    activeSection === item.id ? "location" : undefined
                  }
                >
                  {item.title}
                </a>
              ))}
            </div>
          </nav>
          <div className="site-header__actions">
            <button
              type="button"
              className="site-header__icon-button site-header__theme-toggle"
              data-theme-mode-toggle
              onClick={handleThemeModeToggle}
              aria-label={themeToggleLabel}
              aria-pressed={previewMode === "dark"}
            >
              <span className="site-header__theme-toggle-icons" aria-hidden>
                <Moon className="site-header__theme-toggle-icon site-header__theme-toggle-icon--dark-action h-4 w-4" />
                <Sun className="site-header__theme-toggle-icon site-header__theme-toggle-icon--light-action h-4 w-4" />
              </span>
            </button>
            <button
              type="button"
              className="site-header__utility"
              onClick={() => setCommandOpen(true)}
              aria-label="Open command palette"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
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
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : null}
          </div>
          <div className="site-header__mobile-actions">
            <button
              type="button"
              onClick={handleThemeModeToggle}
              aria-label={themeToggleLabel}
              aria-pressed={previewMode === "dark"}
              data-theme-mode-toggle
              className="site-header__icon-button site-header__theme-toggle"
            >
              <span className="site-header__theme-toggle-icons" aria-hidden>
                <Moon className="site-header__theme-toggle-icon site-header__theme-toggle-icon--dark-action h-5 w-5" />
                <Sun className="site-header__theme-toggle-icon site-header__theme-toggle-icon--light-action h-5 w-5" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              aria-label="Open command palette"
              className="site-header__icon-button"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>
            <Sheet open={isMobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="site-header__icon-button"
                  aria-label={
                    isMobileNavOpen ? "Close navigation" : "Open navigation"
                  }
                >
                  {isMobileNavOpen ? (
                    <X className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Menu className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </SheetTrigger>
              <SheetContent className="site-header__sheet">
                <SheetTitle className="sr-only">Site navigation</SheetTitle>
                <SheetDescription className="sr-only">
                  Browse page sections, external profiles, and the resume
                  download.
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
                      <p className="site-header__sheet-meta">
                        {profile.location}
                      </p>
                    </div>
                  </div>
                  <nav
                    className="site-header__sheet-section"
                    aria-label="Mobile navigation"
                  >
                    <p className="site-header__sheet-label type-eyebrow">
                      Sections
                    </p>
                    <div className="site-header__sheet-links">
                      {primaryNav.map((item, index) => (
                        <SheetClose asChild key={item.id}>
                          <a
                            href={item.href}
                            className={cn(
                              "site-header__sheet-link",
                              activeSection === item.id &&
                                "site-header__sheet-link--active",
                            )}
                          >
                            <span className="site-header__sheet-link-copy">
                              <span
                                className="site-header__sheet-index"
                                aria-hidden="true"
                              >
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <span>{item.title}</span>
                            </span>
                            <ArrowUpRight
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </a>
                        </SheetClose>
                      ))}
                    </div>
                  </nav>
                  <div className="site-header__sheet-section">
                    <p className="site-header__sheet-label type-eyebrow">
                      Elsewhere
                    </p>
                    <div className="site-header__sheet-links">
                      {socialLinks.map((item) => {
                        const Icon =
                          item.id === "github" ? GitHubIcon : LinkedInIcon;

                        return (
                          <SheetClose asChild key={item.id}>
                            <a
                              href={item.href}
                              className="site-header__sheet-link"
                              target="_blank"
                              rel="noreferrer"
                            >
                              <span className="site-header__sheet-link-copy">
                                <span
                                  className="site-header__sheet-index"
                                  aria-hidden="true"
                                >
                                  {item.id === "github" ? "GH" : "IN"}
                                </span>
                                <span>{item.title}</span>
                              </span>
                              <Icon className="h-4 w-4" aria-hidden="true" />
                            </a>
                          </SheetClose>
                        );
                      })}
                      {resumeLink ? (
                        <SheetClose asChild>
                          <a
                            href={resumeLink.href}
                            className="site-header__sheet-link"
                            download
                          >
                            <span className="site-header__sheet-link-copy">
                              <span
                                className="site-header__sheet-index"
                                aria-hidden="true"
                              >
                                CV
                              </span>
                              <span>{resumeLink.title}</span>
                            </span>
                            <FileText className="h-4 w-4" aria-hidden="true" />
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
