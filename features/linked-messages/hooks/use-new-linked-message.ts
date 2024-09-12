import { create } from "zustand";

type NewLinkedMessageState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  setNodeId: (nodeId: string) => void;
  nodeId: string | null;
};

export const useNewLinkedMessage = create<NewLinkedMessageState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setNodeId: (nodeId: string) => set({ nodeId }),
  nodeId: null,
}));
