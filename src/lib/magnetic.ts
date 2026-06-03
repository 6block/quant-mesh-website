import { prefersReducedMotion } from "./reducedMotion";

const STRENGTH = 0.32; // how far the element drifts toward the cursor
const MAX_OFFSET = 10; // px clamp so it stays subtle

/**
 * Magnetic hover: elements marked with [data-magnetic] drift gently toward
 * the pointer. Pointer-fine only, and disabled under reduced-motion.
 */
export const initMagnetic = (): void => {
  if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) {
    return;
  }

  const els = document.querySelectorAll<HTMLElement>("[data-magnetic]");

  els.forEach((el) => {
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      const dx = clamp(x * STRENGTH, MAX_OFFSET);
      const dy = clamp(y * STRENGTH, MAX_OFFSET);
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    };

    const reset = () => {
      el.style.transform = "";
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
  });
};

const clamp = (value: number, limit: number): number =>
  Math.max(-limit, Math.min(limit, value));
