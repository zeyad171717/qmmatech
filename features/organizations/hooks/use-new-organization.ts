import { create } from "zustand";

type NewOrganizationState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewOrganization = create<NewOrganizationState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
