import { useEffect, useRef } from "react";
import useVibeStore, { type VibeState } from "../stores/vibeStore";

const NEUTRAL_REEVAL_MS = 8_000; // Re-evaluate every 8s when in Neutral
const PAUSE_THRESHOLD_MS = 3_000;

/**
 * Vibe Shift Engine
 *
 * Determines the emotional state based on cadence metrics:
 * - Grounding: WPM > 30 OR backspace > 30%
 * - Inspiration: WPM < 15 AND pause > 3s
 * - Neutral: pass-through (re-evaluates every 8s)
 */
export function useVibeShift() {
  const wpm = useVibeStore((s) => s.wpm);
  const backspaceFreq = useVibeStore((s) => s.backspaceFreq);
  const pauseDuration = useVibeStore((s) => s.pauseDuration);
  const currentVibe = useVibeStore((s) => s.currentVibe);
  const setVibe = useVibeStore((s) => s.setVibe);

  const neutralTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Determine the target vibe from current cadence
  const evaluateVibe = (): VibeState => {
    // Grounding: high speed or heavy editing
    if (wpm > 30 || backspaceFreq > 30) {
      return "grounding";
    }

    // Inspiration: slow, contemplative writing
    if (wpm < 15 && pauseDuration > PAUSE_THRESHOLD_MS) {
      return "inspiration";
    }

    return "neutral";
  };

  // React to cadence changes
  useEffect(() => {
    const target = evaluateVibe();

    if (target !== "neutral") {
      // Clear any neutral re-eval timer
      if (neutralTimerRef.current) {
        clearInterval(neutralTimerRef.current);
        neutralTimerRef.current = null;
      }
      if (target !== currentVibe) {
        setVibe(target);
      }
    } else if (currentVibe !== "neutral") {
      // Entering Neutral — start re-evaluation timer
      setVibe("neutral");
    }
  }, [wpm, backspaceFreq, pauseDuration]);

  // Neutral re-evaluation: every 8s, check if we should leave Neutral
  useEffect(() => {
    if (currentVibe === "neutral") {
      neutralTimerRef.current = setInterval(() => {
        const target = evaluateVibe();
        if (target !== "neutral") {
          setVibe(target);
        }
      }, NEUTRAL_REEVAL_MS);
    } else {
      if (neutralTimerRef.current) {
        clearInterval(neutralTimerRef.current);
        neutralTimerRef.current = null;
      }
    }

    return () => {
      if (neutralTimerRef.current) {
        clearInterval(neutralTimerRef.current);
        neutralTimerRef.current = null;
      }
    };
  }, [currentVibe]);
}

// Map vibe states to their visual properties
export const VIBE_CONFIG = {
  grounding: {
    bg: "#2D3436",
    fg: "#e8e4df",
    fontWeight: 700,
  },
  neutral: {
    bg: "#F5F0EB",
    fg: "#2D3436",
    fontWeight: 400,
  },
  inspiration: {
    bg: "#E17055",
    fg: "#fdf6f0",
    fontWeight: 300,
  },
} as const;
