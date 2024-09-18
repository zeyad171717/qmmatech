import { create } from "zustand";

type NewBankTransferState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewBankTransfer = create<NewBankTransferState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
