import { create } from "zustand";

type NewPermissionState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewPermission = create<NewPermissionState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
