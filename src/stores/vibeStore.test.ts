import { beforeEach, describe, expect, it } from "vitest";
import useVibeStore from "./vibeStore";

describe("cadence atmosphere preferences", () => {
  beforeEach(() => {
    useVibeStore.setState({
      currentCadence: "flow",
      previousCadence: null,
      atmosphereMode: "adaptive",
      manualCadence: "flow",
      wpm: 0,
      backspaceFreq: 0,
      pauseDuration: 0,
    });
  });

  it("switches to manual mode when a cadence palette is selected", () => {
    useVibeStore.getState().setManualCadence("still");

    expect(useVibeStore.getState().atmosphereMode).toBe("manual");
    expect(useVibeStore.getState().manualCadence).toBe("still");
  });

  it("can return to adaptive mode without losing the manual preference", () => {
    useVibeStore.getState().setManualCadence("surge");
    useVibeStore.getState().setAtmosphereMode("adaptive");

    expect(useVibeStore.getState().atmosphereMode).toBe("adaptive");
    expect(useVibeStore.getState().manualCadence).toBe("surge");
  });

  it("tracks observable cadence changes", () => {
    useVibeStore.getState().setCadence("surge");

    expect(useVibeStore.getState().currentCadence).toBe("surge");
    expect(useVibeStore.getState().previousCadence).toBe("flow");
  });
});
