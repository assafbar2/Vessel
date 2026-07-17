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

export function createParticlesFromDOM(): AshParticle[] {
  const blocks = document.querySelectorAll("[data-block-id]");
  const particles: AshParticle[] = [];

  blocks.forEach((block) => {
    const rect = block.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const count = 60 + Math.floor(Math.random() * 20);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: rect.left + Math.random() * rect.width,
        y: rect.top + Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 2,
        vy: -(Math.random() * 1.5 + 0.5),
        opacity: 0.7 + Math.random() * 0.3,
        size: 1 + Math.random() * 2.5,
        color: EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)],
      });
    }
  });

  return particles;
}
