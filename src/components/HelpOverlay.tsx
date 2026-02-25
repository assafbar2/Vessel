import { useEffect } from "react";

interface HelpOverlayProps {
  onClose: () => void;
}

const HelpOverlay = ({ onClose }: HelpOverlayProps) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="help-overlay" onClick={onClose}>
      <div className="help-content" onClick={(e) => e.stopPropagation()}>
        <div className="help-title">Vessel</div>
        <div className="help-subtitle">The Breathing Canvas</div>

        <p className="help-description">
          A therapeutic writing environment inspired by EMDR. The canvas
          breathes with you. The atmosphere shifts with your pace. Write to
          process — then let go, or keep.
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
            <span className="help-key">Esc</span>
            <span>Return to canvas</span>
          </div>
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
            behind a passphrase. When you open the vault, your current text
            moves into it — a safe container for what you&apos;ve written.
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
