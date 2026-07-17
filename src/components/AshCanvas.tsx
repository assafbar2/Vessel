import { useEffect, useRef, useCallback } from "react";
import type { AshParticle } from "../lib/ashParticles";

interface AshCanvasProps {
  particles: AshParticle[];
  onComplete: () => void;
}

const AshCanvas = ({ particles, onComplete }: AshCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let rafId: number;
    const startTime = Date.now();
    const MAX_DURATION = 2500;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let anyAlive = false;

      for (const p of particles) {
        if (p.opacity <= 0) continue;
        anyAlive = true;

        p.vy += 0.12; // gravity
        p.y += p.vy;
        p.x += p.vx;
        p.opacity -= 0.006;
        p.size *= 0.997;

        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
        ctx.fill();
      }

      if (!anyAlive || elapsed > MAX_DURATION) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onCompleteRef.current();
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [particles]);

  useEffect(() => {
    const cleanup = animate();
    return cleanup;
  }, [animate]);

  return <canvas ref={canvasRef} className="ash-canvas" />;
};

export default AshCanvas;
