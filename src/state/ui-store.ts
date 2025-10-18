import { create } from "zustand";

type UIState = {
  isCommandOpen: boolean;
  isMobileNavOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  isCommandOpen: false,
  isMobileNavOpen: false,
  setCommandOpen: (open) => set({ isCommandOpen: open }),
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
}));
