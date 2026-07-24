import useEditorStore from "../stores/editorStore";
import useVibeStore, { type CadenceState } from "../stores/vibeStore";
import type { SupportView } from "./SupportOverlay";

const CADENCE_OPTIONS: CadenceState[] = ["still", "flow", "surge"];

interface AtmosphereControlsProps {
  onOpenSupport: (view: SupportView) => void;
}

const AtmosphereControls = ({ onOpenSupport }: AtmosphereControlsProps) => {
  const atmosphereMode = useVibeStore((s) => s.atmosphereMode);
  const manualCadence = useVibeStore((s) => s.manualCadence);
  const setAtmosphereMode = useVibeStore((s) => s.setAtmosphereMode);
  const setManualCadence = useVibeStore((s) => s.setManualCadence);
  const isBreathing = useEditorStore((s) => s.isBreathing);
  const toggleBreathing = useEditorStore((s) => s.toggleBreathing);

  return (
    <div className="atmosphere-controls" aria-label="Canvas controls">
      <span className="control-label">atmosphere</span>
      <button
        className={atmosphereMode === "adaptive" ? "is-active" : ""}
        onClick={() => setAtmosphereMode("adaptive")}
        aria-pressed={atmosphereMode === "adaptive"}
      >
        auto
      </button>
      {CADENCE_OPTIONS.map((cadence) => (
        <button
          key={cadence}
          className={
            atmosphereMode === "manual" && manualCadence === cadence
              ? "is-active"
              : ""
          }
          onClick={() => setManualCadence(cadence)}
          aria-pressed={
            atmosphereMode === "manual" && manualCadence === cadence
          }
        >
          {cadence}
        </button>
      ))}
      <span className="control-separator" aria-hidden="true" />
      <button onClick={toggleBreathing} aria-pressed={isBreathing}>
        focus rhythm {isBreathing ? "on" : "off"}
      </button>
      <button onClick={() => onOpenSupport("menu")}>ground</button>
      <button onClick={() => onOpenSupport("checkout")}>check out</button>
    </div>
  );
};

export default AtmosphereControls;
