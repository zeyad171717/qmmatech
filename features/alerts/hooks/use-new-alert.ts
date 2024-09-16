import { create } from "zustand";

type NewAlertState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewAlert = create<NewAlertState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
