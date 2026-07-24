import { create } from "zustand";

export type CadenceState = "still" | "flow" | "surge";
export type AtmosphereMode = "adaptive" | "manual";

interface CadenceMetrics {
  wpm: number;
  backspaceFreq: number; // percentage 0-100
  pauseDuration: number; // ms since last keystroke
}

interface CadenceStoreState {
  // Cadence metrics
  wpm: number;
  backspaceFreq: number;
  pauseDuration: number;

  currentCadence: CadenceState;
  previousCadence: CadenceState | null;
  atmosphereMode: AtmosphereMode;
  manualCadence: CadenceState;

  // Actions
  updateCadence: (metrics: CadenceMetrics) => void;
  setCadence: (cadence: CadenceState) => void;
  setAtmosphereMode: (mode: AtmosphereMode) => void;
  setManualCadence: (cadence: CadenceState) => void;
}

const useVibeStore = create<CadenceStoreState>((set) => ({
  wpm: 0,
  backspaceFreq: 0,
  pauseDuration: 0,

  currentCadence: "flow",
  previousCadence: null,
  atmosphereMode: "adaptive",
  manualCadence: "flow",

  updateCadence: (metrics) =>
    set(() => ({
      wpm: metrics.wpm,
      backspaceFreq: metrics.backspaceFreq,
      pauseDuration: metrics.pauseDuration,
    })),

  setCadence: (cadence) =>
    set((state) => ({
      currentCadence: cadence,
      previousCadence:
        state.currentCadence !== cadence
          ? state.currentCadence
          : state.previousCadence,
    })),
  setAtmosphereMode: (mode) => set({ atmosphereMode: mode }),
  setManualCadence: (cadence) =>
    set({ manualCadence: cadence, atmosphereMode: "manual" }),
}));

export default useVibeStore;
