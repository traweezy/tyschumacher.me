import { create } from "zustand";

type AccessibilityState = {
  prefersReducedMotion: boolean;
  setPrefersReducedMotion: (value: boolean) => void;
};

export const useAccessibilityStore = create<AccessibilityState>((set) => ({
  prefersReducedMotion: false,
  setPrefersReducedMotion: (value) => set({ prefersReducedMotion: value }),
}));
