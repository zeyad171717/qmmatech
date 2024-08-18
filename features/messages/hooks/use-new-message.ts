import { create } from "zustand";

type NewMessageState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewMessage = create<NewMessageState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
