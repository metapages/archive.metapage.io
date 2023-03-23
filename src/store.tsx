import { create } from "zustand";

interface StoreState {
  tab: number;
  setTab: (index: number) => void;
}

export const useStore = create<StoreState>((set) => ({
  tab: 0,
  setTab: (index: number) => set((state) => ({ tab: index })),
}));
