import { useCallback, useEffect, useRef } from "react";
import type { Editor } from "@tiptap/react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import useVibeStore from "../stores/vibeStore";
import useTransientStore from "../stores/transientStore";
import useSessionStore from "../stores/sessionStore";
import { saveSession } from "../lib/ipc";
import type { VibeState } from "../stores/vibeStore";

const INACTIVITY_THRESHOLD_MS = 45 * 60 * 1000; // 45 minutes
const INACTIVITY_CHECK_INTERVAL_MS = 60_000; // check every 60s

export function useSessionTracking(editor: Editor | null) {
  const prevVibeRef = useRef<VibeState | null>(null);
  const commitInProgressRef = useRef(false);

  const commitSession = useCallback(async () => {
    if (!editor || commitInProgressRef.current) return;

    const text = editor.getText();
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    if (wordCount === 0) return;

    commitInProgressRef.current = true;

    try {
      const currentVibe = useVibeStore.getState().currentVibe;
      useSessionStore.getState().flushCurrentVibeDuration(currentVibe);

      const store = useSessionStore.getState();
      const content = JSON.stringify(editor.getJSON());
      const metadata = {
        average_vibe: store.getAverageVibeColor(),
        dominant_state: store.getDominantState(),
        duration_ms: store.getSessionDurationMs(),
        word_count: wordCount,
      };

      await saveSession(content, metadata);
      useSessionStore.getState().reset();
    } catch (err) {
      console.error("Session commit failed:", err);
    } finally {
      commitInProgressRef.current = false;
    }
  }, [editor]);

  // Register commit + clear functions and start session on mount
  useEffect(() => {
    useSessionStore.getState().setCommitFn(commitSession);
    useSessionStore.getState().setClearEditorFn(() => {
      if (editor) {
        editor.commands.clearContent();
      }
    });
    useSessionStore.getState().startSession();
  }, [commitSession, editor]);

  // Track activity via WPM changes
  useEffect(() => {
    const unsub = useVibeStore.subscribe((state, prevState) => {
      if (state.wpm !== prevState.wpm && state.wpm > 0) {
        useSessionStore.getState().recordActivity();
      }
    });
    return unsub;
  }, []);

  // Track vibe duration changes
  useEffect(() => {
    const unsub = useVibeStore.subscribe((state) => {
      const prev = prevVibeRef.current;
      if (prev !== null && prev !== state.currentVibe) {
        useSessionStore
          .getState()
          .recordVibeChange(prev, state.currentVibe);
      }
      prevVibeRef.current = state.currentVibe;
    });
    // Initialize ref
    prevVibeRef.current = useVibeStore.getState().currentVibe;
    return unsub;
  }, []);

  // 45-minute inactivity detection
  useEffect(() => {
    const interval = setInterval(async () => {
      const { sessionActive, lastActivityTime } =
        useSessionStore.getState();
      if (!sessionActive) return;

      const gap = Date.now() - lastActivityTime;
      if (gap < INACTIVITY_THRESHOLD_MS) return;

      const mode = useTransientStore.getState().mode;
      if (mode === "permanent") {
        await commitSession();
      } else {
        useSessionStore.getState().reset();
      }

      // Start a fresh session
      useSessionStore.getState().startSession();
    }, INACTIVITY_CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [commitSession]);

  // Commit on app close (flag prevents infinite close loop)
  const isClosingRef = useRef(false);

  useEffect(() => {
    let unlisten: (() => void) | null = null;

    getCurrentWindow()
      .onCloseRequested(async (event) => {
        // Second pass — let the close proceed
        if (isClosingRef.current) return;

        const mode = useTransientStore.getState().mode;
        if (mode === "permanent" && editor) {
          const text = editor.getText();
          const wordCount = text.split(/\s+/).filter(Boolean).length;
          if (wordCount > 0) {
            event.preventDefault();
            await commitSession();
            isClosingRef.current = true;
            getCurrentWindow().destroy();
          }
        }
      })
      .then((fn) => {
        unlisten = fn;
      });

    return () => {
      if (unlisten) unlisten();
    };
  }, [editor, commitSession]);

  return { commitSession };
}
