import { useEffect, useRef } from "react";
import useVibeStore from "../stores/vibeStore";
import { CADENCE_CONFIG } from "./useVibeShift";

const MIN_WEIGHT = 300;
const MAX_WEIGHT = 700;
const MAX_WPM_FOR_SCALE = 60; // WPM at which weight hits maximum
const LERP_SPEED = 0.08; // Smoothing factor per frame

/**
 * Adaptive Typography
 *
 * Continuously interpolates --vessel-weight between 300-700 based on WPM.
 * The cadence state provides a target "snap" weight; WPM provides
 * a smooth in-between. Uses requestAnimationFrame for fluid updates.
 */
export function useAdaptiveWeight() {
  const wpm = useVibeStore((s) => s.wpm);
  const currentCadence = useVibeStore((s) => s.currentCadence);
  const atmosphereMode = useVibeStore((s) => s.atmosphereMode);
  const manualCadence = useVibeStore((s) => s.manualCadence);
  const currentWeight = useRef(400);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const activeCadence =
      atmosphereMode === "manual" ? manualCadence : currentCadence;
    const cadenceTarget = CADENCE_CONFIG[activeCadence].fontWeight;

    // WPM-derived weight: higher WPM → heavier weight
    const wpmNormalized = Math.min(wpm / MAX_WPM_FOR_SCALE, 1);
    const wpmWeight = MIN_WEIGHT + wpmNormalized * (MAX_WEIGHT - MIN_WEIGHT);

    // Favor the cadence target (70%) with WPM influence (30%).
    const targetWeight = cadenceTarget * 0.7 + wpmWeight * 0.3;
    const clampedTarget = Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, targetWeight));

    const animate = () => {
      // Lerp toward target for smooth transitions
      currentWeight.current +=
        (clampedTarget - currentWeight.current) * LERP_SPEED;

      // Snap when close enough
      if (Math.abs(clampedTarget - currentWeight.current) < 1) {
        currentWeight.current = clampedTarget;
      }

      const rounded = Math.round(currentWeight.current);
      document.documentElement.style.setProperty(
        "--vessel-weight",
        String(rounded),
      );

      if (Math.abs(clampedTarget - currentWeight.current) > 0.5) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [wpm, currentCadence, atmosphereMode, manualCadence]);
}
