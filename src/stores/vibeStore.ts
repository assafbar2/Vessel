import { create } from "zustand";

export type VibeState = "grounding" | "neutral" | "inspiration";

interface CadenceMetrics {
  wpm: number;
  backspaceFreq: number; // percentage 0-100
  pauseDuration: number; // ms since last keystroke
}

interface VibeStoreState {
  // Cadence metrics
  wpm: number;
  backspaceFreq: number;
  pauseDuration: number;

  // Vibe state
  currentVibe: VibeState;
  previousVibe: VibeState | null;

  // Actions
  updateCadence: (metrics: CadenceMetrics) => void;
  setVibe: (vibe: VibeState) => void;
}

const useVibeStore = create<VibeStoreState>((set) => ({
  wpm: 0,
  backspaceFreq: 0,
  pauseDuration: 0,

  currentVibe: "neutral",
  previousVibe: null,

  updateCadence: (metrics) =>
    set(() => ({
      wpm: metrics.wpm,
      backspaceFreq: metrics.backspaceFreq,
      pauseDuration: metrics.pauseDuration,
    })),

  setVibe: (vibe) =>
    set((state) => ({
      currentVibe: vibe,
      previousVibe: state.currentVibe !== vibe ? state.currentVibe : state.previousVibe,
    })),
}));

export default useVibeStore;
