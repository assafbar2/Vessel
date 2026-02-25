import { useState, useEffect, useCallback } from "react";
import { listen } from "@tauri-apps/api/event";
import Editor from "./components/Editor";
import Vault from "./components/Vault";
import HelpOverlay from "./components/HelpOverlay";
import useTransientStore from "./stores/transientStore";
import useSessionStore from "./stores/sessionStore";

type View = "editor" | "vault";

function App() {
  const [view, setView] = useState<View>("editor");
  const [showHelp, setShowHelp] = useState(false);

  // Listen for Help menu item from Tauri
  useEffect(() => {
    const unlisten = listen("show-help", () => {
      setShowHelp(true);
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  const openVault = useCallback(async () => {
    const mode = useTransientStore.getState().mode;
    const { commitFn, clearEditorFn } = useSessionStore.getState();
    if (mode === "permanent" && commitFn) {
      await commitFn();
    }
    if (clearEditorFn) {
      clearEditorFn();
    }
    useSessionStore.getState().startSession();
    setView("vault");
  }, []);

  const closeVault = useCallback(() => {
    setView("editor");
    requestAnimationFrame(() => {
      const el = document.querySelector(".tiptap") as HTMLElement;
      el?.focus();
    });
  }, []);

  const closeHelp = useCallback(() => {
    setShowHelp(false);
    requestAnimationFrame(() => {
      const el = document.querySelector(".tiptap") as HTMLElement;
      el?.focus();
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Cmd+Shift+V / Ctrl+Shift+V to toggle vault
      if (
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        (e.key === "v" || e.key === "V")
      ) {
        e.preventDefault();
        if (view === "vault") {
          closeVault();
        } else {
          openVault();
        }
        return;
      }
      // Cmd+? (Cmd+Shift+/) to toggle help
      if (
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        e.key === "?"
      ) {
        e.preventDefault();
        if (showHelp) {
          closeHelp();
        } else {
          setShowHelp(true);
        }
        return;
      }
    },
    [view, showHelp, openVault, closeVault, closeHelp],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <div style={{ display: view === "editor" ? "block" : "none" }}>
        <Editor />
      </div>
      {view === "vault" && <Vault onClose={closeVault} />}
      {showHelp && <HelpOverlay onClose={closeHelp} />}
    </>
  );
}

export default App;
