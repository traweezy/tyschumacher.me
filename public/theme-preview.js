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
        const configuredMode = button.dataset.themeModeToggle;
        const nextMode = state.mode === "dark" ? "light" : "dark";
        button.setAttribute(
          "aria-pressed",
          String(
            modes.has(configuredMode)
              ? configuredMode === state.mode
              : state.mode === "dark",
          ),
        );
        if (!modes.has(configuredMode)) {
          button.setAttribute("aria-label", `Switch to ${nextMode} theme`);
        }
      }
    });
  };

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const button = target.closest("[data-theme-mode-toggle]");
    const requestedMode =
      button instanceof HTMLButtonElement
        ? button.dataset.themeModeToggle
        : null;
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    const mode = modes.has(requestedMode)
      ? requestedMode
      : state.mode === "dark"
        ? "light"
        : "dark";

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
