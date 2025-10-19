import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

type AccessibilityState = {
  prefersReducedMotion: boolean;
  setPrefersReducedMotion: (value: boolean) => void;
};

export const useAccessibilityStore = create<AccessibilityState>()((set) => ({
  prefersReducedMotion: false,
  setPrefersReducedMotion: (value) => set({ prefersReducedMotion: value }),
}));

export const useAccessibilityState = <T>(
  selector: (state: AccessibilityState) => T,
) => useAccessibilityStore(useShallow(selector));

export const usePrefersReducedMotion = () =>
  useAccessibilityState((state) => state.prefersReducedMotion);

export const useSetPrefersReducedMotion = () =>
  useAccessibilityState((state) => state.setPrefersReducedMotion);
