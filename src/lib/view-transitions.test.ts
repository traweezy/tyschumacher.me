import { describe, expect, it, vi } from "vitest";
import { runViewTransition } from "@/lib/view-transitions";

const replaceDocument = (handler: ProxyHandler<Document>) => {
  const originalDocument = globalThis.document;
  const proxyDocument = new Proxy(originalDocument as Document, handler);
  (globalThis as unknown as { document: Document }).document = proxyDocument;
  return () => {
    (globalThis as unknown as { document: Document }).document = originalDocument;
  };
};

describe("runViewTransition", () => {
  it("invokes callback immediately when transitions are unavailable", () => {
    const callback = vi.fn();
    const restoreDocument = replaceDocument({
      get(target, prop, receiver) {
        if (prop === "startViewTransition") {
          return undefined;
        }
        return Reflect.get(target, prop, receiver);
      },
      has(target, prop) {
        if (prop === "startViewTransition") {
          return false;
        }
        return Reflect.has(target, prop);
      },
    });

    try {
      runViewTransition(callback);
      expect(callback).toHaveBeenCalledTimes(1);
    } finally {
      restoreDocument();
    }
  });

  it("uses the View Transitions API when supported", async () => {
    const callback = vi.fn();
    const finished = Promise.reject(new Error("cancelled"));
    finished.catch(() => {
      // suppress unhandled rejection noise
    });
    const startViewTransition = vi
      .fn<(cb: () => void) => { finished: Promise<void> }>()
      .mockImplementation((cb) => {
        cb();
        return { finished };
      });
    const restoreDocument = replaceDocument({
      get(target, prop, receiver) {
        if (prop === "startViewTransition") {
          return startViewTransition;
        }
        return Reflect.get(target, prop, receiver);
      },
      has(target, prop) {
        if (prop === "startViewTransition") {
          return true;
        }
        return prop in target;
      },
    });

    try {
      runViewTransition(callback);
      expect(startViewTransition).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledTimes(1);
    } finally {
      restoreDocument();
    }
  });
});
