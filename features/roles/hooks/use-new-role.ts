import { create } from "zustand";

type NewRoleState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewRole = create<NewRoleState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
