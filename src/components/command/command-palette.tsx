"use client";

import { Command as CommandPrimitive } from "cmdk";
import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  Clipboard,
  Code2,
  Download,
  ExternalLink,
  Moon,
  Search,
  Send,
  Sun,
  UserRound,
  Waypoints,
  X,
} from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { Dialog as DialogPrimitive } from "radix-ui";
import {
  memo,
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { primaryNav, secondaryNav } from "@/data/navigation";
import { profile } from "@/data/profile";
import { resumeDownloadProps } from "@/lib/link-behavior";
import { cn } from "@/lib/utils";
import { runViewTransition } from "@/lib/view-transitions";
import {
  useIsCommandOpen,
  useSetCommandOpen,
  useToggleCommandOpen,
} from "@/state/ui-store";
import styles from "./command-palette.module.css";

const sections = primaryNav.filter((item) => item.href.startsWith("#"));
const isExternal = (href: string) => /^https?:\/\//.test(href);
const themeModeStorageKey = "tyschumacher.theme-mode";
const themeModeChangeEvent = "tyschumacher:theme-mode";
const profileIntro = `${profile.name} is a ${profile.role.toLowerCase()} with ${profile.experience} of experience building tools for sportsbook, trading, and operations teams.`;

type ThemeModeId = "light" | "dark";

type CommandAction =
  | {
      description: string;
      href: string;
      icon: LucideIcon;
      id: string;
      kind: "Jump" | "Open" | "Download";
      keywords: string;
      title: string;
      type: "link";
    }
  | {
      description: string;
      icon: LucideIcon;
      id: string;
      kind: "Copy" | "Mode";
      keywords: string;
      title: string;
      type: "copy-intro" | "theme";
    };

const isThemeModeId = (value: string | undefined): value is ThemeModeId =>
  value === "light" || value === "dark";

const readThemeMode = (): ThemeModeId => {
  const value = document.documentElement.dataset.themeMode;
  return isThemeModeId(value) ? value : "light";
};

const applyThemeMode = (mode: ThemeModeId): void => {
  document.documentElement.dataset.theme = `civic-${mode}`;
  document.documentElement.dataset.themeMode = mode;

  try {
    window.localStorage.setItem(themeModeStorageKey, mode);
  } catch {
    // Storage can be unavailable in strict privacy modes.
  }

  window.dispatchEvent(
    new CustomEvent(themeModeChangeEvent, {
      detail: { mode },
    }),
  );
};

const copyText = async (text: string): Promise<void> => {
  if (!navigator.clipboard) {
    return;
  }

  await navigator.clipboard.writeText(text);
};

const getSectionIcon = (id: string): LucideIcon => {
  if (id === "projects") return Code2;
  if (id === "experience") {
    return BriefcaseBusiness;
  }
  if (id === "about") {
    return Waypoints;
  }
  if (id === "contact") {
    return Send;
  }
  return UserRound;
};

const getExternalIcon = (id: string): LucideIcon =>
  id === "resume" ? Download : ExternalLink;

const CommandSearch = memo(() => {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const clearSearch = useCallback(() => {
    setSearch("");
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    // A phone keyboard can shrink the visual viewport without changing CSS vh.
    const dialog = inputRef.current?.closest<HTMLElement>("[cmdk-dialog]");
    if (!dialog) return;
    const updateViewport = () => {
      dialog.style.setProperty("--viewport-height", `${viewport.height}px`);
      dialog.style.setProperty("--viewport-top", `${viewport.offsetTop}px`);
    };
    updateViewport();
    viewport.addEventListener("resize", updateViewport);
    viewport.addEventListener("scroll", updateViewport);
    return () => {
      viewport.removeEventListener("resize", updateViewport);
      viewport.removeEventListener("scroll", updateViewport);
      dialog.style.removeProperty("--viewport-height");
      dialog.style.removeProperty("--viewport-top");
    };
  }, []);

  return (
    <div className={styles.header}>
      <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
      <CommandPrimitive.Input
        ref={inputRef}
        value={search}
        onValueChange={setSearch}
        placeholder="Search sections and links"
        className={styles.input}
      />
      {search ? (
        <button type="button" className={styles.control} onClick={clearSearch}>
          Clear
        </button>
      ) : (
        <kbd className={styles.shortcut}>⌘K</kbd>
      )}
      <DialogPrimitive.Close asChild>
        <button type="button" className={styles.control} aria-label="Close search">
          <X size={20} aria-hidden="true" />
        </button>
      </DialogPrimitive.Close>
    </div>
  );
});
CommandSearch.displayName = "CommandSearch";

export const CommandPalette = () => {
  const router = useRouter();
  const isOpen = useIsCommandOpen();
  const setCommandOpen = useSetCommandOpen();
  const toggleCommandOpen = useToggleCommandOpen();
  const handleCommandShortcut = useEffectEvent((event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      toggleCommandOpen();
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", handleCommandShortcut);
    return () => window.removeEventListener("keydown", handleCommandShortcut);
  }, []);

  const quickActions = useMemo<CommandAction[]>(
    () => [
      ...sections.map(
        (item): CommandAction => ({
          description:
            item.id === "home"
              ? "Return to the top of the page."
              : `Jump to the ${item.title.toLowerCase()} section.`,
          href: item.href,
          icon: getSectionIcon(item.id),
          id: item.id,
          kind: "Jump",
          keywords: `${item.title} section navigation`,
          title: item.title,
          type: "link",
        }),
      ),
      {
        description: "Switch between light and dark themes.",
        icon: Moon,
        id: "toggle-theme",
        kind: "Mode",
        keywords: "theme dark light mode appearance",
        title: "Toggle theme",
        type: "theme",
      },
      {
        description: "Copy a short intro for messages and referrals.",
        icon: Clipboard,
        id: "copy-intro",
        kind: "Copy",
        keywords: "copy profile intro bio summary",
        title: "Copy intro",
        type: "copy-intro",
      },
      ...secondaryNav.map(
        (item): CommandAction => ({
          description:
            item.id === "resume"
              ? "Download the resume as a PDF."
              : `Open ${item.title} in a new tab.`,
          href: item.href,
          icon: getExternalIcon(item.id),
          id: item.id,
          kind: item.id === "resume" ? "Download" : "Open",
          keywords:
            item.id === "resume"
              ? "resume cv pdf download"
              : `${item.title} profile external`,
          title: item.id === "resume" ? "Download resume" : item.title,
          type: "link",
        }),
      ),
    ],
    [],
  );

  const handleSelect = (item: CommandAction) => {
    setCommandOpen(false);
    if (item.type === "link") {
      const { href } = item;
      if (href.startsWith("#")) {
        const el = document.querySelector(href);
        if (el) {
          const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
          ).matches;
          el.scrollIntoView({
            behavior: reduceMotion ? "instant" : "smooth",
            block: "start",
          });
          window.history.replaceState(null, "", href);
        } else {
          router.push(`/${href}` as Route);
        }
        return;
      }
      if (item.kind === "Download") {
        const link = document.createElement("a");
        link.href = href;
        link.download = resumeDownloadProps.download;
        document.body.append(link);
        link.click();
        link.remove();
        return;
      }
      if (isExternal(href)) {
        window.open(href, "_blank", "noopener,noreferrer");
        return;
      }
      runViewTransition(() => router.push(href as Route));
      return;
    }

    if (item.type === "theme") {
      const nextMode = readThemeMode() === "dark" ? "light" : "dark";
      runViewTransition(() => applyThemeMode(nextMode));
      return;
    }

    void copyText(profileIntro).catch(() => undefined);
  };

  return (
    <CommandPrimitive.Dialog
      open={isOpen}
      onOpenChange={setCommandOpen}
      label="Command palette"
      className={styles.root}
      contentClassName={styles.dialog ?? ""}
      overlayClassName={styles.overlay ?? ""}
    >
      <DialogPrimitive.Title className="visually-hidden">
        Command palette
      </DialogPrimitive.Title>
      <DialogPrimitive.Description className="visually-hidden">
        Search sections and resources across the site.
      </DialogPrimitive.Description>
      <CommandSearch />
      <CommandPrimitive.List
        className={cn(
          styles.list,
          "scrollbar-thin scrollbar-gutter-stable scrollbar-thumb-[var(--border-strong)] scrollbar-track-transparent",
        )}
      >
        <CommandPrimitive.Empty className={styles.empty}>
          Nothing found. Try another keyword.
        </CommandPrimitive.Empty>
        <CommandPrimitive.Group heading="Quick actions" className={styles.group}>
          {quickActions.map((item) => {
            const CommandIcon = item.icon;

            return (
              <CommandPrimitive.Item
                key={item.id}
                value={`${item.title} ${item.keywords}`}
                aria-description={item.description}
                className={styles.item}
                onSelect={() => handleSelect(item)}
              >
                <span className={styles.itemContent}>
                  <span className={styles.itemIcon} aria-hidden="true">
                    {item.type === "theme" ? (
                      <>
                        <Moon className={styles.itemThemeIconDark} />
                        <Sun className={styles.itemThemeIconLight} />
                      </>
                    ) : (
                      <CommandIcon className={styles.itemGlyph} />
                    )}
                  </span>
                  <span className={styles.itemText}>
                    <span>{item.title}</span>
                    <span className={styles.itemDescription} aria-hidden="true">
                      {item.description}
                    </span>
                  </span>
                </span>
                <span className={styles.itemKind} aria-hidden="true">
                  {item.kind}
                </span>
              </CommandPrimitive.Item>
            );
          })}
        </CommandPrimitive.Group>
      </CommandPrimitive.List>
    </CommandPrimitive.Dialog>
  );
};
