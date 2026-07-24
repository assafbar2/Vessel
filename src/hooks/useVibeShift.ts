import { useCallback, useEffect, useRef } from "react";
import useVibeStore, { type CadenceState } from "../stores/vibeStore";
import { classifyCadence } from "../lib/cadence";

const FLOW_REEVAL_MS = 8_000;

/**
 * Cadence atmosphere engine
 *
 * Classifies observable writing cadence, not emotion:
 * - Still: slow, paused, or revision-heavy
 * - Surge: rapid bursts
 * - Flow: steady pass-through
 */
export function useCadenceAtmosphere() {
  const wpm = useVibeStore((s) => s.wpm);
  const backspaceFreq = useVibeStore((s) => s.backspaceFreq);
  const pauseDuration = useVibeStore((s) => s.pauseDuration);
  const currentCadence = useVibeStore((s) => s.currentCadence);
  const atmosphereMode = useVibeStore((s) => s.atmosphereMode);
  const setCadence = useVibeStore((s) => s.setCadence);

  const flowTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Determine the target atmosphere from current cadence.
  const evaluateCadence = useCallback((): CadenceState => {
    return classifyCadence({ wpm, backspaceFreq, pauseDuration });
  }, [wpm, backspaceFreq, pauseDuration]);

  // React to cadence changes
  useEffect(() => {
    if (atmosphereMode !== "adaptive") return;
    const target = evaluateCadence();

    if (target !== "flow") {
      if (flowTimerRef.current) {
        clearInterval(flowTimerRef.current);
        flowTimerRef.current = null;
      }
      if (target !== currentCadence) {
        setCadence(target);
      }
    } else if (currentCadence !== "flow") {
      setCadence("flow");
    }
  }, [atmosphereMode, currentCadence, evaluateCadence, setCadence]);

  // Flow re-evaluation: every 8s, check whether cadence has changed.
  useEffect(() => {
    if (atmosphereMode === "adaptive" && currentCadence === "flow") {
      flowTimerRef.current = setInterval(() => {
        const target = evaluateCadence();
        if (target !== "flow") {
          setCadence(target);
        }
      }, FLOW_REEVAL_MS);
    } else {
      if (flowTimerRef.current) {
        clearInterval(flowTimerRef.current);
        flowTimerRef.current = null;
      }
    }

    return () => {
      if (flowTimerRef.current) {
        clearInterval(flowTimerRef.current);
        flowTimerRef.current = null;
      }
    };
  }, [atmosphereMode, currentCadence, evaluateCadence, setCadence]);
}

export const CADENCE_CONFIG = {
  still: {
    bg: "#2D3436",
    fg: "#e8e4df",
    fontWeight: 700,
  },
  flow: {
    bg: "#F5F0EB",
    fg: "#2D3436",
    fontWeight: 400,
  },
  surge: {
    bg: "#E17055",
    fg: "#fdf6f0",
    fontWeight: 300,
  },
} as const;
