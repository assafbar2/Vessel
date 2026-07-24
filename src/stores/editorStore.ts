import { create } from "zustand";

interface EditorState {
  isBreathing: boolean;
  toggleBreathing: () => void;
  setBreathing: (enabled: boolean) => void;
}

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const useEditorStore = create<EditorState>((set) => ({
  isBreathing: !prefersReducedMotion,
  toggleBreathing: () => set((state) => ({ isBreathing: !state.isBreathing })),
  setBreathing: (enabled) => set({ isBreathing: enabled }),
}));

export default useEditorStore;
