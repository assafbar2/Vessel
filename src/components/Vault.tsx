import { useState, useCallback, useEffect } from "react";
import useVaultStore from "../stores/vaultStore";
import VaultSession from "./VaultSession";
import VaultGate from "./VaultGate";

function formatDuration(ms: number): string {
  const totalMin = Math.round(ms / 60_000);
  if (totalMin < 60) return `${totalMin}m`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const month = d.toLocaleString("default", { month: "short" });
  const day = d.getDate();
  const hour = d.getHours().toString().padStart(2, "0");
  const min = d.getMinutes().toString().padStart(2, "0");
  return `${month} ${day}, ${hour}:${min}`;
}

/** Returns true if the background is light (text should be dark). */
function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55;
}

interface VaultProps {
  onClose: () => void;
}

const Vault = ({ onClose }: VaultProps) => {
  const [unlocked, setUnlocked] = useState(false);
  const sessions = useVaultStore((s) => s.sessions);
  const selectedSessionId = useVaultStore((s) => s.selectedSessionId);
  const fetchSessions = useVaultStore((s) => s.fetchSessions);
  const selectSession = useVaultStore((s) => s.selectSession);
  const clearSelection = useVaultStore((s) => s.clearSelection);
  const removeSession = useVaultStore((s) => s.removeSession);

  const handleUnlocked = useCallback(() => {
    setUnlocked(true);
    fetchSessions();
  }, [fetchSessions]);

  const handleDelete = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      removeSession(id);
    },
    [removeSession],
  );

  // Single Escape handler for all vault states (bubble phase, no stopImmediatePropagation)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();

      if (selectedSessionId) {
        clearSelection();
      } else {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedSessionId, clearSelection, onClose]);

  if (!unlocked) {
    return <VaultGate onUnlocked={handleUnlocked} />;
  }

  if (selectedSessionId) {
    return <VaultSession />;
  }

  return (
    <div className="vault-container">
      {sessions.length === 0 ? (
        <div className="vault-empty">No sessions yet.</div>
      ) : (
        <div className="vault-grid">
          {sessions.map((session) => {
            const light = isLightColor(session.average_vibe);
            const textColor = light
              ? "rgba(0,0,0,0.5)"
              : "rgba(255,255,255,0.7)";
            return (
              <div
                key={session.id}
                className="vault-block"
                style={{ backgroundColor: session.average_vibe }}
                onClick={() => selectSession(session.id)}
              >
                <div
                  className="vault-block-meta"
                  style={{ color: textColor }}
                >
                  <div>{formatDate(session.created_at)}</div>
                  <div>
                    {formatDuration(session.duration_ms)} &middot;{" "}
                    {session.word_count} words
                  </div>
                </div>
                <button
                  className="vault-block-delete"
                  style={{ color: textColor }}
                  onClick={(e) => handleDelete(e, session.id)}
                  title="Delete session"
                >
                  &times;
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Vault;
