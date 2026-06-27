type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => {
    finished: Promise<void>;
  };
};

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const runViewTransition = (callback: () => void) => {
  const viewTransitionDocument =
    typeof document === "undefined"
      ? undefined
      : (document as ViewTransitionDocument);
  const startViewTransition = viewTransitionDocument?.startViewTransition;

  if (typeof startViewTransition !== "function" || prefersReducedMotion()) {
    callback();
    return;
  }

  const transition = startViewTransition.call(document, callback);

  transition.finished.catch(() => {
    // noop transitions can be cancelled by the browser
  });
};
