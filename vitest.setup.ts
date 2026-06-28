import "@testing-library/jest-dom/vitest";

import React from "react";
import { afterEach, vi } from "vitest";

declare global {
  interface GlobalThis {
    __dispatchMatchMedia: (query: string, matches: boolean) => void;
    __TANSTACK_EVENT_TARGET__?: EventTarget;
  }
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

const tanstackEventTarget = new EventTarget();
tanstackEventTarget.addEventListener("tanstack-connect", () => {
  tanstackEventTarget.dispatchEvent(
    new CustomEvent("tanstack-connect-success"),
  );
});

Object.defineProperty(globalThis, "__TANSTACK_EVENT_TARGET__", {
  configurable: true,
  value: tanstackEventTarget,
});

if (process.env.VITEST_ASYNC_LEAK_DIAGNOSTICS === "true") {
  afterEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 350));
  });
}

Object.defineProperty(window, "localStorage", {
  writable: true,
  value: localStorageMock,
});

vi.stubGlobal("localStorage", localStorageMock);

const createMediaQueryList = (
  query: string,
  matches = false,
): MediaQueryList => {
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
  value: (query: string) => createMediaQueryList(query, false),
});

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: vi.fn(),
});

type MutableMediaQueryList = MediaQueryList & { matches: boolean };

globalThis.__dispatchMatchMedia = (query: string, matches: boolean) => {
  const entry = listeners.get(query);
  const lists = mediaLists.get(query);
  lists?.forEach((list) => {
    (list as MutableMediaQueryList).matches = matches;
  });
  if (!entry) return;
  entry.forEach((listener) => {
    listener({ matches } as MediaQueryListEvent);
  });
};

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly scrollMargin = "";
  readonly thresholds = [0];

  constructor(private readonly callback: IntersectionObserverCallback) {}

  observe(target: Element) {
    const rect = target.getBoundingClientRect();
    this.callback(
      [
        {
          boundingClientRect: rect,
          intersectionRatio: 1,
          intersectionRect: rect,
          isIntersecting: true,
          rootBounds: null,
          target,
          time: Date.now(),
        },
      ],
      this,
    );
  }

  unobserve() {}

  disconnect() {}

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

Object.defineProperty(window, "IntersectionObserver", {
  configurable: true,
  writable: true,
  value: MockIntersectionObserver,
});

Object.defineProperty(globalThis, "IntersectionObserver", {
  configurable: true,
  writable: true,
  value: MockIntersectionObserver,
});

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

if (!window.Element.prototype.animate) {
  Object.defineProperty(window.Element.prototype, "animate", {
    writable: true,
    value: () => ({
      finished: Promise.resolve(),
      cancel: vi.fn(),
      play: vi.fn(),
      pause: vi.fn(),
      reverse: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  });
}

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
    const resolvedSrc = typeof src === "string" ? src : (src?.src ?? "");
    const { fill, priority, ...imgProps } = rest;
    void fill;
    void priority;
    return React.createElement("img", { src: resolvedSrc, alt, ...imgProps });
  };

  return {
    __esModule: true,
    default: MockImage,
  };
});
