import "@testing-library/jest-dom/vitest";

import React from "react";
import { vi } from "vitest";

declare global {
  // eslint-disable-next-line no-var
  var __dispatchMatchMedia: (query: string, matches: boolean) => void;
}

type MatchMediaListener = (event: MediaQueryListEvent) => void;

const listeners = new Map<string, Set<MatchMediaListener>>();
const mediaLists = new Map<string, Set<MediaQueryList>>();

const createStorage = () => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  } satisfies Storage;
};

const localStorageMock = createStorage();

Object.defineProperty(window, "localStorage", {
  writable: true,
  value: localStorageMock,
});

vi.stubGlobal("localStorage", localStorageMock);

const createMediaQueryList = (query: string, matches = false): MediaQueryList => {
  const mediaList: MediaQueryList = {
    matches,
    media: query,
    onchange: null,
    addListener: (listener: MatchMediaListener) => {
      const entry = listeners.get(query) ?? new Set<MatchMediaListener>();
      entry.add(listener);
      listeners.set(query, entry);
    },
    removeListener: (listener: MatchMediaListener) => {
      const entry = listeners.get(query);
      entry?.delete(listener);
    },
    addEventListener: (_event: string, listener: MatchMediaListener) => {
      const entry = listeners.get(query) ?? new Set<MatchMediaListener>();
      entry.add(listener);
      listeners.set(query, entry);
    },
    removeEventListener: (_event: string, listener: MatchMediaListener) => {
      const entry = listeners.get(query);
      entry?.delete(listener);
    },
    dispatchEvent: (event: Event) => {
      const entry = listeners.get(query);
      entry?.forEach((listener) => listener(event as MediaQueryListEvent));
      return true;
    },
  } as MediaQueryList;
  const stored = mediaLists.get(query) ?? new Set<MediaQueryList>();
  stored.add(mediaList);
  mediaLists.set(query, stored);
  return mediaList;
};

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) =>
    createMediaQueryList(
      query,
      query.includes("prefers-reduced-motion") ? false : false,
    ),
});

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: vi.fn(),
});

(globalThis as any).__dispatchMatchMedia = (query: string, matches: boolean) => {
  const entry = listeners.get(query);
  const lists = mediaLists.get(query);
  lists?.forEach((list) => {
    (list as any).matches = matches;
  });
  if (!entry) return;
  entry.forEach((listener) => {
    listener({ matches } as MediaQueryListEvent);
  });
};

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: ResizeObserver,
});

Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
  value: vi.fn(),
  writable: true,
});

vi.mock("next/navigation", () => {
  const push = vi.fn();
  const prefetch = vi.fn();
  const replace = vi.fn();
  const back = vi.fn();
  const forward = vi.fn();
  const refresh = vi.fn();

  return {
    useRouter: () => ({ push, prefetch, replace, back, forward, refresh }),
    usePathname: () => "/",
  };
});

vi.mock("next/image", () => {
  const MockImage = ({
    src,
    alt = "",
    ...rest
  }: {
    src: string | { src: string };
    alt?: string;
    fill?: boolean;
    priority?: boolean;
  }) => {
    const resolvedSrc = typeof src === "string" ? src : src?.src ?? "";
    const { fill: _fill, priority: _priority, ...imgProps } = rest;
    return React.createElement("img", { src: resolvedSrc, alt, ...imgProps });
  };

  return {
    __esModule: true,
    default: MockImage,
  };
});
