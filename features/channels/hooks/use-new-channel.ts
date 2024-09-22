import { create } from "zustand";

type NewChannelState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewChannel = create<NewChannelState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
