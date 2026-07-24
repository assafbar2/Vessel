import { useEffect, useRef, useState } from "react";

export type SupportView =
  | "menu"
  | "grounding"
  | "breathing"
  | "orientation"
  | "checkout";

interface SupportOverlayProps {
  initialView: SupportView;
  onClose: () => void;
  onSaveAndOpenVault: () => Promise<void>;
}

const GROUNDING_STEPS = [
  ["5 things you can see", "Let your eyes move slowly. Name colors, edges, light, and distance."],
  ["4 things you can feel", "Notice support beneath you, temperature, clothing, or an object in your hand."],
  ["3 things you can hear", "Listen for the nearest sound, the farthest sound, and one in between."],
  ["2 things you can smell", "Notice what is present. If nothing stands out, remember two familiar scents."],
  ["1 thing you can taste", "Or name one kind thing you can do for yourself in the next few minutes."],
] as const;

const SupportOverlay = ({
  initialView,
  onClose,
  onSaveAndOpenVault,
}: SupportOverlayProps) => {
  const [view, setView] = useState<SupportView>(initialView);
  const [groundingStep, setGroundingStep] = useState(0);
  const [breathing, setBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "exhale">("inhale");
  const titleRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, [view]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "Tab" && panelRef.current) {
        const focusable = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            "button:not([disabled]), [href], input, [tabindex]:not([tabindex='-1'])",
          ),
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === titleRef.current)
        ) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!breathing || view !== "breathing") return;
    const duration = breathPhase === "inhale" ? 4_000 : 6_000;
    const timer = window.setTimeout(() => {
      setBreathPhase((phase) => (phase === "inhale" ? "exhale" : "inhale"));
    }, duration);
    return () => window.clearTimeout(timer);
  }, [breathing, breathPhase, view]);

  const openView = (nextView: SupportView) => {
    setView(nextView);
    setGroundingStep(0);
    setBreathing(false);
    setBreathPhase("inhale");
  };

  const renderMenu = () => (
    <>
      <h2 ref={titleRef} tabIndex={-1}>Return to the present</h2>
      <p className="support-intro">
        Choose only what feels useful. These are optional grounding aids, not
        therapy or trauma processing.
      </p>
      <div className="support-choice-grid">
        <button onClick={() => openView("grounding")}>
          <strong>5–4–3–2–1</strong>
          <span>Notice the senses around you</span>
        </button>
        <button onClick={() => openView("breathing")}>
          <strong>Gentle breathing</strong>
          <span>Four in, six out, at your pace</span>
        </button>
        <button onClick={() => openView("orientation")}>
          <strong>Orient</strong>
          <span>Reconnect with this place and time</span>
        </button>
      </div>
    </>
  );

  const renderGrounding = () => {
    const [heading, detail] = GROUNDING_STEPS[groundingStep];
    const complete = groundingStep === GROUNDING_STEPS.length - 1;
    return (
      <>
        <div className="support-step-count">
          {groundingStep + 1} / {GROUNDING_STEPS.length}
        </div>
        <h2 ref={titleRef} tabIndex={-1}>{heading}</h2>
        <p className="support-prompt">{detail}</p>
        <div className="support-actions">
          <button className="support-secondary" onClick={() => openView("menu")}>
            back
          </button>
          <button
            className="support-primary"
            onClick={() => complete ? onClose() : setGroundingStep((step) => step + 1)}
          >
            {complete ? "done" : "next"}
          </button>
        </div>
      </>
    );
  };

  const renderBreathing = () => (
    <>
      <h2 ref={titleRef} tabIndex={-1}>Gentle breathing</h2>
      <p className="support-intro">
        Breathe comfortably. Stop if this feels unpleasant, dizzying, or
        unhelpful.
      </p>
      <div
        className={`breath-orb ${breathing ? `is-${breathPhase}` : ""}`}
        aria-live="polite"
      >
        {breathing ? breathPhase : "ready"}
      </div>
      <div className="support-actions">
        <button className="support-secondary" onClick={() => openView("menu")}>
          back
        </button>
        <button
          className="support-primary"
          onClick={() => {
            setBreathPhase("inhale");
            setBreathing((active) => !active);
          }}
        >
          {breathing ? "pause" : "begin"}
        </button>
      </div>
    </>
  );

  const renderOrientation = () => {
    const now = new Date();
    const date = now.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const time = now.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
    return (
      <>
        <h2 ref={titleRef} tabIndex={-1}>Here, now</h2>
        <div className="orientation-time">{date} · {time}</div>
        <p className="support-prompt">
          Silently or aloud, name where you are. Notice one thing that shows
          you are in the present, and one choice available to you right now.
        </p>
        <div className="support-actions">
          <button className="support-secondary" onClick={() => openView("menu")}>
            back
          </button>
          <button className="support-primary" onClick={onClose}>done</button>
        </div>
      </>
    );
  };

  const renderCheckout = () => (
    <>
      <h2 ref={titleRef} tabIndex={-1}>What would help next?</h2>
      <p className="support-intro">
        Your writing stays on the canvas until saving succeeds.
      </p>
      <div className="checkout-actions">
        <button className="support-primary" onClick={onSaveAndOpenVault}>
          keep it and open the vault
        </button>
        <button onClick={() => openView("menu")}>ground before deciding</button>
        <button onClick={onClose}>keep writing</button>
      </div>
    </>
  );

  return (
    <div className="support-overlay" onClick={onClose}>
      <section
        ref={panelRef}
        className="support-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Grounding and check-out tools"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="support-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        {view === "menu" && renderMenu()}
        {view === "grounding" && renderGrounding()}
        {view === "breathing" && renderBreathing()}
        {view === "orientation" && renderOrientation()}
        {view === "checkout" && renderCheckout()}
      </section>
    </div>
  );
};

export default SupportOverlay;
