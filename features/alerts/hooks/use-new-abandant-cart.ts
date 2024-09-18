import { create } from "zustand";

type NewAbandantCartState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewAbandantCart = create<NewAbandantCartState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
