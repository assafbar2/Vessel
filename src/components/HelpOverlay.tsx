import { useEffect, useRef } from "react";

interface HelpOverlayProps {
  onClose: () => void;
}

const HelpOverlay = ({ onClose }: HelpOverlayProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            "button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])",
          ),
        );
        if (focusable.length === 0) {
          e.preventDefault();
          titleRef.current?.focus();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === titleRef.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="help-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        className="help-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vessel-help-title"
      >
        <button className="help-close-button" onClick={onClose} aria-label="Close help">
          ×
        </button>
        <div
          ref={titleRef}
          className="help-title"
          id="vessel-help-title"
          tabIndex={-1}
        >
          Vessel
        </div>
        <div className="help-subtitle">The Breathing Canvas</div>

        <p className="help-description">
          A reflective-writing and grounding environment inspired by EMDR.
          Vessel is not EMDR treatment. Its optional focus rhythm and
          atmosphere can support a writing practice without interpreting how
          you feel.
        </p>

        <div className="help-section">
          <div className="help-section-title">Shortcuts</div>
          <div className="help-row">
            <span className="help-key">⌘T</span>
            <span>Toggle writing mode</span>
          </div>
          <div className="help-row">
            <span className="help-key">⌘⇧D</span>
            <span>Ash — dissolve all text</span>
          </div>
          <div className="help-row">
            <span className="help-key">⌘⇧V</span>
            <span>Open the vault</span>
          </div>
          <div className="help-row">
            <span className="help-key">⌘⇧G</span>
            <span>Open optional grounding tools</span>
          </div>
          <div className="help-row">
            <span className="help-key">Esc</span>
            <span>Return to canvas</span>
          </div>
        </div>

        <div className="help-section">
          <div className="help-section-title">Atmosphere</div>
          <p>
            <strong>Auto</strong> responds only to observable writing cadence:
            Still, Flow, and Surge. Choose any atmosphere manually from the
            canvas controls whenever you prefer.
          </p>
          <p>
            The focus rhythm can be switched off. Grounding, gentle breathing,
            sensory orientation, and check-out tools are always optional.
          </p>
        </div>

        <div className="help-section">
          <div className="help-section-title">Writing Modes</div>
          <p>
            <strong>Permanent</strong> — words stay on the canvas and are saved
            to your vault.
          </p>
          <p>
            <strong>Transient</strong> — each block fades after a few seconds.
            Write without holding on.
          </p>
        </div>

        <div className="help-section">
          <div className="help-section-title">The Vault</div>
          <p>
            Your writing is encrypted with AES-256-GCM and stored locally
            behind a passphrase. Content is cleared only after saving
            succeeds.
          </p>
        </div>

        <div className="help-section help-support">
          <div className="help-section-title">Need Support?</div>
          <p>
            Vessel is a writing tool, not a substitute for therapy. If you are
            experiencing distress, please reach out to a professional.
          </p>
          <p>
            988 Suicide &amp; Crisis Lifeline (US) &middot; emdria.org
          </p>
        </div>

        <div className="help-close-hint">esc to close</div>
      </div>
    </div>
  );
};

export default HelpOverlay;
