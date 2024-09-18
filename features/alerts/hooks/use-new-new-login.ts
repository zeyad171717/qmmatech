import { create } from "zustand";

type NewNewLoginState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewNewLogin = create<NewNewLoginState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
