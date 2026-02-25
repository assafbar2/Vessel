import { useCallback, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { motion } from "framer-motion";
import { useCadence } from "../hooks/useCadence";
import { useVibeShift, VIBE_CONFIG } from "../hooks/useVibeShift";
import { useAdaptiveWeight } from "../hooks/useAdaptiveWeight";
import { useTransientMode } from "../hooks/useTransientMode";
import { useAshCommand } from "../hooks/useAshCommand";
import { useSessionTracking } from "../hooks/useSessionTracking";
import useVibeStore from "../stores/vibeStore";
import useTransientStore from "../stores/transientStore";
import { TransientBlock } from "../extensions/transientBlock";
import ModeIndicator from "./ModeIndicator";
import TransientNotice from "./TransientNotice";
import AshCanvas from "./AshCanvas";
import ShortcutHint from "./ShortcutHint";

const TRANSITION_DURATION = 13; // 12-15 seconds per spec

const Editor = () => {
  const { recordKeystroke } = useCadence();
  useVibeShift();
  useAdaptiveWeight();

  const currentVibe = useVibeStore((s) => s.currentVibe);
  const vibeConfig = VIBE_CONFIG[currentVibe];
  const ashActive = useTransientStore((s) => s.ashActive);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
        horizontalRule: false,
        dropcursor: false,
        gapcursor: false,
      }),
      TransientBlock,
    ],
    content: "",
    autofocus: true,
    editorProps: {
      attributes: {
        class: "tiptap",
      },
    },
  });

  useSessionTracking(editor);
  const { handleModeToggle, clearAllTimers } = useTransientMode(editor);
  const { triggerAsh, ashParticles, handleAshComplete } = useAshCommand(
    editor,
    clearAllTimers,
  );

  // Capture keystrokes at the DOM level for cadence + shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Mode toggle: Cmd+T / Ctrl+T
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === "t") {
        e.preventDefault();
        handleModeToggle();
        return;
      }

      // Ash command: Cmd+Shift+D / Ctrl+Shift+D
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "d" || e.key === "D")) {
        e.preventDefault();
        triggerAsh();
        return;
      }

      // Ignore modifier-only keys for cadence tracking
      if (
        ["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab", "Escape"].includes(e.key)
      ) {
        return;
      }
      const isBackspace = e.key === "Backspace" || e.key === "Delete";
      recordKeystroke(isBackspace);
    },
    [recordKeystroke, handleModeToggle, triggerAsh],
  );

  useEffect(() => {
    const el = editorContainerRef.current;
    if (!el) return;
    el.addEventListener("keydown", handleKeyDown);
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Update text color CSS variable when vibe changes
  useEffect(() => {
    document.documentElement.style.setProperty("--vessel-fg", vibeConfig.fg);
  }, [vibeConfig.fg]);

  return (
    <motion.div
      className="vessel-atmosphere"
      animate={{
        backgroundColor: vibeConfig.bg,
      }}
      transition={{
        duration: TRANSITION_DURATION,
        ease: "easeInOut",
      }}
    >
      <div
        ref={editorContainerRef}
        className="vessel-canvas"
        data-tauri-drag-region
      >
        <EditorContent editor={editor} />
        <ModeIndicator />
      </div>
      <ShortcutHint />
      <TransientNotice />
      {ashActive && (
        <AshCanvas particles={ashParticles} onComplete={handleAshComplete} />
      )}
    </motion.div>
  );
};

export default Editor;
