import { useCallback, useEffect, useRef } from "react";
import type { Editor } from "@tiptap/react";
import useTransientStore from "../stores/transientStore";

const INACTIVITY_MS = 10_000; // 10s before fade starts
const FADE_MS = 2_000; // 2s fade, then delete

interface BlockTimer {
  inactivityId: ReturnType<typeof setTimeout>;
  fadeId?: ReturnType<typeof setTimeout>;
}

export function useTransientMode(editor: Editor | null) {
  const mode = useTransientStore((s) => s.mode);
  const toggleMode = useTransientStore((s) => s.toggleMode);
  const setShowNotice = useTransientStore((s) => s.setShowNotice);
  const setNoticeMode = useTransientStore((s) => s.setNoticeMode);
  const timers = useRef<Map<string, BlockTimer>>(new Map());

  // Find the blockId of the block containing the cursor
  const getActiveBlockId = useCallback((): string | null => {
    if (!editor) return null;
    const { $from } = editor.state.selection;
    for (let depth = $from.depth; depth >= 0; depth--) {
      const node = $from.node(depth);
      if (node.attrs.blockId) {
        return node.attrs.blockId as string;
      }
    }
    return null;
  }, [editor]);

  // Find a node's position by its blockId
  const findBlockPos = useCallback(
    (blockId: string): { pos: number; size: number } | null => {
      if (!editor) return null;
      let result: { pos: number; size: number } | null = null;
      editor.state.doc.descendants((node, pos) => {
        if (node.attrs.blockId === blockId) {
          result = { pos, size: node.nodeSize };
          return false;
        }
      });
      return result;
    },
    [editor],
  );

  // Set fadeState on a block via editor command
  const setFadeState = useCallback(
    (blockId: string, state: "active" | "fading") => {
      if (!editor) return;
      const found = findBlockPos(blockId);
      if (!found) return;
      editor
        .chain()
        .command(({ tr }) => {
          const node = tr.doc.nodeAt(found.pos);
          if (node) {
            tr.setNodeMarkup(found.pos, undefined, {
              ...node.attrs,
              fadeState: state,
            });
          }
          return true;
        })
        .run();
    },
    [editor, findBlockPos],
  );

  // Start fade-then-delete for a block
  const startFade = useCallback(
    (blockId: string) => {
      setFadeState(blockId, "fading");

      const fadeId = setTimeout(() => {
        if (!editor) return;
        const found = findBlockPos(blockId);
        if (found) {
          editor.chain().deleteRange({ from: found.pos, to: found.pos + found.size }).run();
        }
        timers.current.delete(blockId);
      }, FADE_MS);

      const existing = timers.current.get(blockId);
      if (existing) {
        existing.fadeId = fadeId;
      }
    },
    [editor, findBlockPos, setFadeState],
  );

  // Reset (or create) the inactivity timer for a block
  const resetTimer = useCallback(
    (blockId: string) => {
      const existing = timers.current.get(blockId);
      if (existing) {
        clearTimeout(existing.inactivityId);
        if (existing.fadeId) {
          clearTimeout(existing.fadeId);
          existing.fadeId = undefined;
          // Restore block if it was fading
          setFadeState(blockId, "active");
        }
      }

      const inactivityId = setTimeout(() => {
        startFade(blockId);
      }, INACTIVITY_MS);

      timers.current.set(blockId, { inactivityId });
    },
    [startFade, setFadeState],
  );

  // Clear all timers
  const clearAllTimers = useCallback(() => {
    timers.current.forEach((timer) => {
      clearTimeout(timer.inactivityId);
      if (timer.fadeId) clearTimeout(timer.fadeId);
    });
    timers.current.clear();
  }, []);

  // Listen to editor transactions in transient mode
  useEffect(() => {
    if (!editor || mode !== "transient") return;

    const handler = () => {
      const blockId = getActiveBlockId();
      if (blockId) {
        resetTimer(blockId);
      }
    };

    editor.on("transaction", handler);
    return () => {
      editor.off("transaction", handler);
    };
  }, [editor, mode, getActiveBlockId, resetTimer]);

  // When leaving transient mode, clear all timers and restore all blocks
  useEffect(() => {
    if (mode !== "transient") {
      clearAllTimers();

      // Reset any blocks stuck in "fading" state back to visible
      if (editor) {
        const { doc, tr } = editor.state;
        let modified = false;
        doc.descendants((node, pos) => {
          if (node.attrs.fadeState === "fading") {
            tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              fadeState: "active",
            });
            modified = true;
          }
        });
        if (modified) {
          editor.view.dispatch(tr);
        }
      }
    }
  }, [mode, clearAllTimers, editor]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  // Mode toggle handler
  const handleModeToggle = useCallback(() => {
    const nextMode = mode === "permanent" ? "transient" : "permanent";
    toggleMode();
    setNoticeMode(nextMode);
    setShowNotice(true);
  }, [mode, toggleMode, setShowNotice, setNoticeMode]);

  return { handleModeToggle, clearAllTimers };
}
