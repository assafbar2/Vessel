import { useState, useEffect, useRef, useCallback } from "react";
import {
  hasVaultPassphrase,
  setVaultPassphrase,
  verifyVaultPassphrase,
} from "../lib/ipc";

interface VaultGateProps {
  onUnlocked: () => void;
}

const VaultGate = ({ onUnlocked }: VaultGateProps) => {
  const [mode, setMode] = useState<"loading" | "create" | "verify">("loading");
  const [value, setValue] = useState("");
  const [confirmValue, setConfirmValue] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"enter" | "confirm">("enter");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    hasVaultPassphrase().then((exists) => {
      setMode(exists ? "verify" : "create");
    });
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [mode, step]);

  const handleVerify = useCallback(async () => {
    if (!value) return;
    const ok = await verifyVaultPassphrase(value);
    if (ok) {
      onUnlocked();
    } else {
      setError("Wrong passphrase.");
      setValue("");
    }
  }, [value, onUnlocked]);

  const handleCreate = useCallback(async () => {
    if (step === "enter") {
      if (value.length < 1) return;
      setStep("confirm");
      setConfirmValue("");
      setError("");
      return;
    }

    if (confirmValue !== value) {
      setError("Doesn't match. Try again.");
      setConfirmValue("");
      setStep("enter");
      setValue("");
      return;
    }

    await setVaultPassphrase(value);
    onUnlocked();
  }, [step, value, confirmValue, onUnlocked]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (mode === "verify") {
          handleVerify();
        } else if (mode === "create") {
          handleCreate();
        }
      }
    },
    [mode, handleVerify, handleCreate],
  );

  if (mode === "loading") return null;

  return (
    <div className="vault-gate">
      <div className="vault-gate-inner">
        {mode === "create" ? (
          <>
            <div className="vault-gate-label">
              {step === "enter"
                ? "Create a passphrase for your vault."
                : "Confirm your passphrase."}
            </div>
            <input
              ref={inputRef}
              type="password"
              className="vault-gate-input"
              value={step === "enter" ? value : confirmValue}
              onChange={(e) =>
                step === "enter"
                  ? setValue(e.target.value)
                  : setConfirmValue(e.target.value)
              }
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </>
        ) : (
          <>
            <div className="vault-gate-label">Enter your passphrase.</div>
            <input
              ref={inputRef}
              type="password"
              className="vault-gate-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </>
        )}
        {error && <div className="vault-gate-error">{error}</div>}
      </div>
    </div>
  );
};

export default VaultGate;
