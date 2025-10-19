import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

type UIState = {
  isCommandOpen: boolean;
  isMobileNavOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
};

export const useUIStore = create<UIState>()((set) => ({
  isCommandOpen: false,
  isMobileNavOpen: false,
  setCommandOpen: (open) => set({ isCommandOpen: open }),
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
}));

export const useUIState = <T>(selector: (state: UIState) => T) =>
  useUIStore(useShallow(selector));

export const useIsCommandOpen = () =>
  useUIState((state) => state.isCommandOpen);
export const useSetCommandOpen = () =>
  useUIState((state) => state.setCommandOpen);
export const useIsMobileNavOpen = () =>
  useUIState((state) => state.isMobileNavOpen);
export const useSetMobileNavOpen = () =>
  useUIState((state) => state.setMobileNavOpen);
