import { create } from "zustand";
import type { VibeState } from "./vibeStore";

const VIBE_COLORS: Record<VibeState, { r: number; g: number; b: number }> = {
  grounding: { r: 0x2d, g: 0x34, b: 0x36 },
  neutral: { r: 0xf5, g: 0xf0, b: 0xeb },
  inspiration: { r: 0xe1, g: 0x70, b: 0x55 },
};

interface VibeDurations {
  grounding: number;
  neutral: number;
  inspiration: number;
}

interface SessionStoreState {
  sessionActive: boolean;
  sessionStartTime: number | null;
  lastActivityTime: number;
  vibeDurations: VibeDurations;
  currentVibeStartTime: number | null;
  commitFn: (() => Promise<void>) | null;
  clearEditorFn: (() => void) | null;

  startSession: () => void;
  recordActivity: () => void;
  recordVibeChange: (previousVibe: VibeState, newVibe: VibeState) => void;
  flushCurrentVibeDuration: (currentVibe: VibeState) => void;
  getSessionDurationMs: () => number;
  getDominantState: () => VibeState;
  getAverageVibeColor: () => string;
  setCommitFn: (fn: () => Promise<void>) => void;
  setClearEditorFn: (fn: () => void) => void;
  reset: () => void;
}

const useSessionStore = create<SessionStoreState>((set, get) => ({
  sessionActive: false,
  sessionStartTime: null,
  lastActivityTime: Date.now(),
  vibeDurations: { grounding: 0, neutral: 0, inspiration: 0 },
  currentVibeStartTime: null,
  commitFn: null,
  clearEditorFn: null,

  startSession: () =>
    set({
      sessionActive: true,
      sessionStartTime: Date.now(),
      lastActivityTime: Date.now(),
      vibeDurations: { grounding: 0, neutral: 0, inspiration: 0 },
      currentVibeStartTime: Date.now(),
    }),

  recordActivity: () => set({ lastActivityTime: Date.now() }),

  recordVibeChange: (previousVibe, _newVibe) => {
    const { currentVibeStartTime, vibeDurations } = get();
    if (!currentVibeStartTime) return;

    const elapsed = Date.now() - currentVibeStartTime;
    set({
      vibeDurations: {
        ...vibeDurations,
        [previousVibe]: vibeDurations[previousVibe] + elapsed,
      },
      currentVibeStartTime: Date.now(),
    });
  },

  flushCurrentVibeDuration: (currentVibe) => {
    const { currentVibeStartTime, vibeDurations } = get();
    if (!currentVibeStartTime) return;

    const elapsed = Date.now() - currentVibeStartTime;
    set({
      vibeDurations: {
        ...vibeDurations,
        [currentVibe]: vibeDurations[currentVibe] + elapsed,
      },
      currentVibeStartTime: Date.now(),
    });
  },

  getSessionDurationMs: () => {
    const { sessionStartTime } = get();
    if (!sessionStartTime) return 0;
    return Date.now() - sessionStartTime;
  },

  getDominantState: (): VibeState => {
    const { vibeDurations } = get();
    const entries = Object.entries(vibeDurations) as [VibeState, number][];
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
  },

  getAverageVibeColor: () => {
    const { vibeDurations } = get();
    const total =
      vibeDurations.grounding +
      vibeDurations.neutral +
      vibeDurations.inspiration;

    if (total === 0) return "#F5F0EB";

    let r = 0,
      g = 0,
      b = 0;
    for (const [state, ms] of Object.entries(vibeDurations) as [
      VibeState,
      number,
    ][]) {
      const weight = ms / total;
      const color = VIBE_COLORS[state];
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
      vibeDurations: { grounding: 0, neutral: 0, inspiration: 0 },
      currentVibeStartTime: null,
    }),
}));

export default useSessionStore;
