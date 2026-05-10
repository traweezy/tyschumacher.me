(() => {
  const modes = new Set(["light", "dark"]);
  const state = {
    mode: window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  };
  let hasManualModeOverride = false;

  const apply = () => {
    document.documentElement.dataset.theme = `civic-${state.mode}`;
    document.documentElement.dataset.themeMode = state.mode;
  };

  const syncControls = () => {
    document.querySelectorAll("[data-theme-mode-toggle]").forEach((button) => {
      if (button instanceof HTMLButtonElement) {
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.themeModeToggle === state.mode),
        );
      }
    });
  };

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const button = target.closest("[data-theme-mode-toggle]");
    const mode =
      button instanceof HTMLButtonElement
        ? button.dataset.themeModeToggle
        : null;
    if (!modes.has(mode)) {
      return;
    }

    hasManualModeOverride = true;
    state.mode = mode;
    apply();
    syncControls();
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      if (hasManualModeOverride) {
        return;
      }

      state.mode = event.matches ? "dark" : "light";
      apply();
      syncControls();
    });

  apply();

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", syncControls);
  } else {
    syncControls();
  }
})();
