import { useCallback, useState } from "react";
import type { Editor } from "@tiptap/react";
import useTransientStore from "../stores/transientStore";
import { createParticlesFromDOM, type AshParticle } from "../components/AshCanvas";

export function useAshCommand(
  editor: Editor | null,
  clearAllTimers: () => void,
) {
  const setAshActive = useTransientStore((s) => s.setAshActive);
  const [ashParticles, setAshParticles] = useState<AshParticle[]>([]);

  const triggerAsh = useCallback(() => {
    if (!editor) return;

    // Sample particle positions from current text blocks
    const particles = createParticlesFromDOM();
    setAshParticles(particles);

    // Show the canvas overlay
    setAshActive(true);

    // Clear all transient timers
    clearAllTimers();

    // Purge the document
    editor.commands.clearContent();
  }, [editor, setAshActive, clearAllTimers]);

  const handleAshComplete = useCallback(() => {
    setAshActive(false);
    setAshParticles([]);
  }, [setAshActive]);

  return { triggerAsh, ashParticles, handleAshComplete };
}
