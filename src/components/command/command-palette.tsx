"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { useEffect, useMemo } from "react";
import { Search, ExternalLink } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { primaryNav, secondaryNav } from "@/data/navigation";
import { useUIStore } from "@/state/ui-store";
import { runViewTransition } from "@/lib/view-transitions";
import styles from "./command-palette.module.css";

const sections = primaryNav.filter((item) => item.href.startsWith("#"));
const isExternal = (href: string) => /^https?:\/\//.test(href);

export const CommandPalette = () => {
  const router = useRouter();
  const isOpen = useUIStore((state) => state.isCommandOpen);
  const setCommandOpen = useUIStore((state) => state.setCommandOpen);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(!useUIStore.getState().isCommandOpen);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setCommandOpen]);

  const quickActions = useMemo(
    () => [
      ...sections.map((item) => ({ ...item, type: "section" as const })),
      ...secondaryNav.map((item) => ({ ...item, type: "external" as const })),
    ],
    [],
  );

  const handleSelect = (href: string) => {
    setCommandOpen(false);
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
        <Search className="h-4 w-4" />
        <CommandPrimitive.Input
          placeholder="Jump to a section or open a resource…"
          className={styles.input}
        />
        <kbd className={styles.shortcut}>⌘K</kbd>
      </div>
      <CommandPrimitive.List className={styles.list}>
        <CommandPrimitive.Empty className={styles.empty}>
          Nothing found. Try another keyword.
        </CommandPrimitive.Empty>
        <CommandPrimitive.Group heading="Quick actions" className={styles.group}>
          {quickActions.map((item) => (
            <CommandPrimitive.Item
              key={item.id}
              value={item.title}
              className={styles.item}
              onSelect={() => handleSelect(item.href)}
            >
              <span>{item.title}</span>
              {item.type === "external" ? (
                <ExternalLink className="h-3.5 w-3.5 opacity-70" />
              ) : null}
            </CommandPrimitive.Item>
          ))}
        </CommandPrimitive.Group>
      </CommandPrimitive.List>
    </CommandPrimitive.Dialog>
  );
};
