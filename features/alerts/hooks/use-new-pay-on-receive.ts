import { create } from "zustand";

type NewPayOnReceiveState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewPayOnReceive = create<NewPayOnReceiveState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
