"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import { Command as CommandPrimitive } from "cmdk";
import { useEffect, useEffectEvent, useMemo } from "react";
import {
  BriefcaseBusiness,
  Clipboard,
  Download,
  ExternalLink,
  Moon,
  Search,
  Send,
  Sun,
  UserRound,
  Waypoints,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { primaryNav, secondaryNav } from "@/data/navigation";
import { profile } from "@/data/profile";
import {
  useIsCommandOpen,
  useSetCommandOpen,
  useToggleCommandOpen,
} from "@/state/ui-store";
import { runViewTransition } from "@/lib/view-transitions";
import { cn } from "@/lib/utils";
import styles from "./command-palette.module.css";

const sections = primaryNav.filter((item) => item.href.startsWith("#"));
const isExternal = (href: string) => /^https?:\/\//.test(href);
const themeModeStorageKey = "tyschumacher.theme-mode";
const themeModeChangeEvent = "tyschumacher:theme-mode";
const profileIntro = `${profile.name} is a ${profile.role.toLowerCase()} who builds interfaces and services for trading, sportsbook, and operations teams that need fast decisions, visible state, and reliable releases.`;

type ThemeModeId = "light" | "dark";

type CommandAction =
  | {
      description: string;
      href: string;
      icon: LucideIcon;
      id: string;
      kind: "Jump" | "Open";
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
      ...sections.map((item): CommandAction => ({
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
      })),
      {
        description: "Switch between the avatar-aligned light and dark themes.",
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
      ...secondaryNav.map((item): CommandAction => ({
        description:
          item.id === "resume"
            ? "Open the resume PDF in a new tab."
            : `Open ${item.title} in a new tab.`,
        href: item.href,
        icon: getExternalIcon(item.id),
        id: item.id,
        kind: "Open",
        keywords: `${item.title} profile external resume`,
        title: item.title,
        type: "link",
      })),
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
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        return;
      }
      if (isExternal(href) || href.endsWith(".pdf")) {
        window.open(href, "_blank", "noreferrer");
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
    >
      <DialogPrimitive.Title className="visually-hidden">
        Command palette
      </DialogPrimitive.Title>
      <DialogPrimitive.Description className="visually-hidden">
        Search sections and resources across the site.
      </DialogPrimitive.Description>
      <div className={styles.header}>
        <Search className="h-4 w-4" aria-hidden="true" />
        <CommandPrimitive.Input
          placeholder="Jump to a section or open a resource…"
          className={styles.input}
        />
        <kbd className={styles.shortcut}>⌘K</kbd>
      </div>
      <CommandPrimitive.List
        className={cn(
          styles.list,
          "scrollbar-thin scrollbar-gutter-stable scrollbar-thumb-[var(--border-strong)] scrollbar-track-transparent",
        )}
      >
        <CommandPrimitive.Empty className={styles.empty}>
          Nothing found. Try another keyword.
        </CommandPrimitive.Empty>
        <CommandPrimitive.Group
          heading="Quick actions"
          className={styles.group}
        >
          {quickActions.map((item) => {
            const CommandIcon = item.icon;

            return (
              <CommandPrimitive.Item
                key={item.id}
                value={`${item.title} ${item.keywords}`}
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
