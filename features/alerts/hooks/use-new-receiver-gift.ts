import { create } from "zustand";

type NewReceiverGiftState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewReceiverGift = create<NewReceiverGiftState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
