import { describe, expect, it, vi } from "vitest";
import { runViewTransition } from "@/lib/view-transitions";

describe("runViewTransition", () => {
  it("invokes callback immediately when transitions are unavailable", () => {
    const callback = vi.fn();
    const original = (document as Document & { startViewTransition?: unknown }).startViewTransition;
    delete (document as Document & { startViewTransition?: unknown }).startViewTransition;

    runViewTransition(callback);

    expect(callback).toHaveBeenCalledTimes(1);
    (document as Document & { startViewTransition?: unknown }).startViewTransition = original;
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
    const originalDocument = globalThis.document;
    const proxyDocument = new Proxy(originalDocument as Document, {
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
    (globalThis as unknown as { document: Document }).document = proxyDocument;

    runViewTransition(callback);

    expect(startViewTransition).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledTimes(1);
    (globalThis as unknown as { document: Document }).document = originalDocument;
  });
});
