import { useCallback, useRef } from "react";
import useVibeStore from "../stores/vibeStore";

const WINDOW_MS = 10_000; // 10-second rolling window
const PAUSE_THRESHOLD_MS = 3_000; // 3s pause triggers Inspiration check

interface KeystrokeEntry {
  time: number;
  isBackspace: boolean;
}

export function useCadence() {
  const buffer = useRef<KeystrokeEntry[]>([]);
  const lastKeystrokeTime = useRef<number>(0);
  const updateCadence = useVibeStore((s) => s.updateCadence);

  const recordKeystroke = useCallback(
    (isBackspace: boolean) => {
      const now = Date.now();

      // Track pause duration (ms since last keystroke)
      const pauseDuration =
        lastKeystrokeTime.current > 0
          ? now - lastKeystrokeTime.current
          : 0;
      lastKeystrokeTime.current = now;

      // Add to rolling buffer
      buffer.current.push({ time: now, isBackspace });

      // Prune entries older than the rolling window
      const cutoff = now - WINDOW_MS;
      buffer.current = buffer.current.filter((e) => e.time >= cutoff);

      const entries = buffer.current;
      const total = entries.length;

      if (total < 2) {
        updateCadence({ wpm: 0, backspaceFreq: 0, pauseDuration });
        return;
      }

      // WPM: characters in window → words per minute
      // Non-backspace keystrokes approximate characters typed
      const nonBackspace = entries.filter((e) => !e.isBackspace).length;
      const windowSpanMs = entries[entries.length - 1].time - entries[0].time;
      const windowSpanMin = Math.max(windowSpanMs / 60_000, 0.001);
      // Average word = 5 characters
      const wpm = nonBackspace / 5 / windowSpanMin;

      // Backspace frequency: % of keystrokes that are backspaces
      const backspaceCount = entries.filter((e) => e.isBackspace).length;
      const backspaceFreq = (backspaceCount / total) * 100;

      updateCadence({
        wpm: Math.round(wpm),
        backspaceFreq: Math.round(backspaceFreq),
        pauseDuration,
      });
    },
    [updateCadence],
  );

  return { recordKeystroke, PAUSE_THRESHOLD_MS };
}
