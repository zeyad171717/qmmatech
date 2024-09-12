import { create } from "zustand";

type NewInteractiveWordState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  setNodeId: (nodeId: string) => void;
  nodeId: string | null;
};

export const useNewInteractiveWord = create<NewInteractiveWordState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setNodeId: (nodeId: string) => set({ nodeId }),
  nodeId: null,
}));
