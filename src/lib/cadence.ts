import type { CadenceState } from "../stores/vibeStore";

export interface CadenceInput {
  wpm: number;
  backspaceFreq: number;
  pauseDuration: number;
}

const PAUSE_THRESHOLD_MS = 3_000;

/** Classifies observable keyboard cadence. It does not infer emotion. */
export function classifyCadence({
  wpm,
  backspaceFreq,
  pauseDuration,
}: CadenceInput): CadenceState {
  if (
    (wpm > 0 && wpm < 15 && pauseDuration > PAUSE_THRESHOLD_MS) ||
    backspaceFreq > 30
  ) {
    return "still";
  }

  if (wpm > 30) {
    return "surge";
  }

  return "flow";
}
