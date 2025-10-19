export const runViewTransition = (callback: () => void) => {
  if (typeof document !== "undefined" && "startViewTransition" in document) {
    const transition = (document as Document & {
      startViewTransition: (cb: () => void) => { finished: Promise<void> };
    }).startViewTransition(() => {
      callback();
    });

    transition.finished.catch(() => {
      // noop transitions can be cancelled by the browser
    });
    return;
  }

  callback();
};
