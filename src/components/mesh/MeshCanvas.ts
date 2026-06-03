import { prefersReducedMotion } from "../../lib/reducedMotion";

/**
 * Living mesh network — the visual identity of "Quant Mesh".
 * Nodes drift across the hero; nearby nodes link with fading lines, and
 * the pointer attracts/illuminates the field. Pure Canvas2D, no deps.
 *
 * Performance & accessibility:
 *  - DPR-capped, density scales with viewport area
 *  - pauses when the hero scrolls out of view (IntersectionObserver)
 *  - reduced-motion: renders a single static frame, no RAF loop
 */

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

const POINTER_DIST = 170; // px: pointer influence radius
const MAX_DPR = 2;

const num = (value: string | undefined, fallback: number): number => {
  const n = value === undefined ? NaN : Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export const initMesh = (canvas: HTMLCanvasElement): void => {
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  // Per-instance tuning via data attributes (so section meshes can be subtler).
  const LINK_DIST = num(canvas.dataset.meshLink, 138); // node link distance
  const DENSITY = num(canvas.dataset.meshDensity, 13500); // px² per node (lower = denser)
  const MAX_NODES = num(canvas.dataset.meshMax, 120);

  let width = 0;
  let height = 0;
  let dpr = 1;
  let nodes: Node[] = [];
  let rafId = 0;
  let running = false;
  const pointer = { x: -9999, y: -9999, active: false };

  const accent = readAccent();

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  };

  const seed = () => {
    const count = Math.min(MAX_NODES, Math.round((width * height) / DENSITY));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.4 + 0.8,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    // Links first (under nodes)
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINK_DIST) {
          const alpha = (1 - dist / LINK_DIST) * 0.4;
          ctx.strokeStyle = `oklch(70% 0.09 210 / ${alpha.toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Nodes
    for (const n of nodes) {
      const near = pointer.active
        ? Math.max(0, 1 - Math.hypot(n.x - pointer.x, n.y - pointer.y) / POINTER_DIST)
        : 0;
      const radius = n.r + near * 1.8;
      const alpha = 0.55 + near * 0.45;
      ctx.fillStyle = `oklch(${82 + near * 6}% ${0.1 + near * 0.05} 200 / ${alpha.toFixed(3)})`;
      if (near > 0.05) {
        ctx.shadowColor = accent;
        ctx.shadowBlur = 12 * near;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.beginPath();
      ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  };

  const step = () => {
    for (const n of nodes) {
      // Gentle pointer attraction
      if (pointer.active) {
        const dx = pointer.x - n.x;
        const dy = pointer.y - n.y;
        const dist = Math.hypot(dx, dy);
        if (dist < POINTER_DIST && dist > 0.01) {
          const pull = (1 - dist / POINTER_DIST) * 0.04;
          n.vx += (dx / dist) * pull;
          n.vy += (dy / dist) * pull;
        }
      }

      n.x += n.vx;
      n.y += n.vy;

      // Soft friction keeps drift bounded
      n.vx *= 0.99;
      n.vy *= 0.99;

      // Wrap around edges
      if (n.x < -20) n.x = width + 20;
      if (n.x > width + 20) n.x = -20;
      if (n.y < -20) n.y = height + 20;
      if (n.y > height + 20) n.y = -20;
    }
    draw();
    rafId = requestAnimationFrame(step);
  };

  const start = () => {
    if (running || prefersReducedMotion()) return;
    running = true;
    rafId = requestAnimationFrame(step);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(rafId);
  };

  // Pointer interaction (fine pointers only)
  if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener(
      "pointermove",
      (e) => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = e.clientX - rect.left;
        pointer.y = e.clientY - rect.top;
        pointer.active = pointer.y < height && pointer.y > 0;
      },
      { passive: true },
    );
    window.addEventListener("pointerleave", () => (pointer.active = false));
  }

  window.addEventListener("resize", debounce(resize, 200), { passive: true });

  resize();

  // Reduced motion: paint one static frame and stop.
  if (prefersReducedMotion()) {
    draw();
    return;
  }

  // Only animate while the hero is on screen.
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.isIntersecting ? start() : stop();
        }
      },
      { threshold: 0 },
    ).observe(canvas);
  } else {
    start();
  }
};

const readAccent = (): string => {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-accent")
    .trim();
  return v || "oklch(78% 0.142 200)";
};

const debounce = (fn: () => void, ms: number): (() => void) => {
  let t = 0;
  return () => {
    clearTimeout(t);
    t = window.setTimeout(fn, ms);
  };
};
