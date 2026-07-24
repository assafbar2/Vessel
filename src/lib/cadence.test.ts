import { describe, expect, it } from "vitest";
import { classifyCadence } from "./cadence";

describe("classifyCadence", () => {
  it("uses Flow for a steady cadence", () => {
    expect(
      classifyCadence({ wpm: 22, backspaceFreq: 8, pauseDuration: 500 }),
    ).toBe("flow");
  });

  it("uses Still for slow resumed writing", () => {
    expect(
      classifyCadence({ wpm: 10, backspaceFreq: 5, pauseDuration: 3_500 }),
    ).toBe("still");
  });

  it("uses Still for revision-heavy writing without calling it emotion", () => {
    expect(
      classifyCadence({ wpm: 38, backspaceFreq: 42, pauseDuration: 100 }),
    ).toBe("still");
  });

  it("uses Surge for a rapid low-editing burst", () => {
    expect(
      classifyCadence({ wpm: 48, backspaceFreq: 4, pauseDuration: 100 }),
    ).toBe("surge");
  });

  it("keeps an idle new canvas in Flow", () => {
    expect(
      classifyCadence({ wpm: 0, backspaceFreq: 0, pauseDuration: 8_000 }),
    ).toBe("flow");
  });
});
