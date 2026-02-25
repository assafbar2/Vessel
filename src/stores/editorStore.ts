import { create } from "zustand";

interface EditorState {
  isBreathing: boolean;
  toggleBreathing: () => void;
}

const useEditorStore = create<EditorState>((set) => ({
  isBreathing: true,
  toggleBreathing: () => set((state) => ({ isBreathing: !state.isBreathing })),
}));

export default useEditorStore;
