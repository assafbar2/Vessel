import { useEffect, useRef, useCallback } from "react";

export interface AshParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  size: number;
  color: string;
}

const EMBER_COLORS = [
  "#E17055",
  "#D35400",
  "#E74C3C",
  "#F39C12",
  "#C0392B",
  "#2D3436",
];

interface AshCanvasProps {
  particles: AshParticle[];
  onComplete: () => void;
}

export function createParticlesFromDOM(): AshParticle[] {
  const blocks = document.querySelectorAll("[data-block-id]");
  const particles: AshParticle[] = [];

  blocks.forEach((block) => {
    const rect = block.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // 60-80 particles per block, distributed across the text area
    const count = 60 + Math.floor(Math.random() * 20);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: rect.left + Math.random() * rect.width,
        y: rect.top + Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 2,
        vy: -(Math.random() * 1.5 + 0.5), // initial upward burst
        opacity: 0.7 + Math.random() * 0.3,
        size: 1 + Math.random() * 2.5,
        color: EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)],
      });
    }
  });

  return particles;
}

const AshCanvas = ({ particles, onComplete }: AshCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

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
