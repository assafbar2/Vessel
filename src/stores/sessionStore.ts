import { create } from "zustand";
import type { CadenceState } from "./vibeStore";

const CADENCE_COLORS: Record<CadenceState, { r: number; g: number; b: number }> = {
  still: { r: 0x2d, g: 0x34, b: 0x36 },
  flow: { r: 0xf5, g: 0xf0, b: 0xeb },
  surge: { r: 0xe1, g: 0x70, b: 0x55 },
};

interface CadenceDurations {
  still: number;
  flow: number;
  surge: number;
}

interface SessionStoreState {
  sessionActive: boolean;
  sessionStartTime: number | null;
  lastActivityTime: number;
  cadenceDurations: CadenceDurations;
  currentCadenceStartTime: number | null;
  commitFn: (() => Promise<boolean>) | null;
  clearEditorFn: (() => void) | null;

  startSession: () => void;
  recordActivity: () => void;
  recordCadenceChange: (previous: CadenceState, next: CadenceState) => void;
  flushCurrentCadenceDuration: (current: CadenceState) => void;
  getSessionDurationMs: () => number;
  getDominantState: () => CadenceState;
  getAverageCadenceColor: () => string;
  setCommitFn: (fn: () => Promise<boolean>) => void;
  setClearEditorFn: (fn: () => void) => void;
  reset: () => void;
}

const useSessionStore = create<SessionStoreState>((set, get) => ({
  sessionActive: false,
  sessionStartTime: null,
  lastActivityTime: Date.now(),
  cadenceDurations: { still: 0, flow: 0, surge: 0 },
  currentCadenceStartTime: null,
  commitFn: null,
  clearEditorFn: null,

  startSession: () =>
    set({
      sessionActive: true,
      sessionStartTime: Date.now(),
      lastActivityTime: Date.now(),
      cadenceDurations: { still: 0, flow: 0, surge: 0 },
      currentCadenceStartTime: Date.now(),
    }),

  recordActivity: () => set({ lastActivityTime: Date.now() }),

  recordCadenceChange: (previous) => {
    const { currentCadenceStartTime, cadenceDurations } = get();
    if (!currentCadenceStartTime) return;

    const elapsed = Date.now() - currentCadenceStartTime;
    set({
      cadenceDurations: {
        ...cadenceDurations,
        [previous]: cadenceDurations[previous] + elapsed,
      },
      currentCadenceStartTime: Date.now(),
    });
  },

  flushCurrentCadenceDuration: (current) => {
    const { currentCadenceStartTime, cadenceDurations } = get();
    if (!currentCadenceStartTime) return;

    const elapsed = Date.now() - currentCadenceStartTime;
    set({
      cadenceDurations: {
        ...cadenceDurations,
        [current]: cadenceDurations[current] + elapsed,
      },
      currentCadenceStartTime: Date.now(),
    });
  },

  getSessionDurationMs: () => {
    const { sessionStartTime } = get();
    if (!sessionStartTime) return 0;
    return Date.now() - sessionStartTime;
  },

  getDominantState: (): CadenceState => {
    const { cadenceDurations } = get();
    const entries = Object.entries(cadenceDurations) as [CadenceState, number][];
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
  },

  getAverageCadenceColor: () => {
    const { cadenceDurations } = get();
    const total =
      cadenceDurations.still + cadenceDurations.flow + cadenceDurations.surge;

    if (total === 0) return "#F5F0EB";

    let r = 0,
      g = 0,
      b = 0;
    for (const [state, ms] of Object.entries(cadenceDurations) as [
      CadenceState,
      number,
    ][]) {
      const weight = ms / total;
      const color = CADENCE_COLORS[state];
      r += color.r * weight;
      g += color.g * weight;
      b += color.b * weight;
    }

    const hex = (n: number) =>
      Math.round(n).toString(16).padStart(2, "0");
    return `#${hex(r)}${hex(g)}${hex(b)}`;
  },

  setCommitFn: (fn) => set({ commitFn: fn }),
  setClearEditorFn: (fn) => set({ clearEditorFn: fn }),

  reset: () =>
    set({
      sessionActive: false,
      sessionStartTime: null,
      lastActivityTime: Date.now(),
      cadenceDurations: { still: 0, flow: 0, surge: 0 },
      currentCadenceStartTime: null,
    }),
}));

export default useSessionStore;
