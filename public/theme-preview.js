(() => {
  const concepts = new Set([
    "current",
    "market",
    "broadcast",
    "civic",
    "signal",
    "ledger",
    "editorial",
    "alloy",
    "prism",
    "terminal",
    "alpine",
    "mono",
  ]);
  const modes = new Set(["light", "dark"]);
  const state = {
    concept: "civic",
    mode: window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  };
  let hasManualModeOverride = false;

  const themeFor = () =>
    state.concept === "current" ? state.mode : `${state.concept}-${state.mode}`;

  const apply = () => {
    document.documentElement.dataset.theme = themeFor();
    document.documentElement.dataset.themeMode = state.mode;
  };

  const syncSelects = () => {
    document
      .querySelectorAll("[data-theme-preview-select]")
      .forEach((select) => {
        if (select instanceof HTMLSelectElement) {
          select.value = state.concept;
        }
      });
    document.querySelectorAll("[data-theme-mode-select]").forEach((select) => {
      if (select instanceof HTMLSelectElement) {
        select.value = state.mode;
      }
    });
  };

  document.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) {
      return;
    }

    if (
      target.matches("[data-theme-preview-select]") &&
      concepts.has(target.value)
    ) {
      state.concept = target.value;
      apply();
      syncSelects();
    }

    if (target.matches("[data-theme-mode-select]") && modes.has(target.value)) {
      hasManualModeOverride = true;
      state.mode = target.value;
      apply();
      syncSelects();
    }
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      if (hasManualModeOverride) {
        return;
      }

      state.mode = event.matches ? "dark" : "light";
      apply();
      syncSelects();
    });

  apply();

  window.addEventListener("DOMContentLoaded", () => {
    syncSelects();
  });
})();
