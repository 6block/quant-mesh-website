/**
 * Cursor-following spotlight on card surfaces. Updates `--mx`/`--my` (the
 * gradient centre) on pointer move; CSS draws a soft accent glow that tracks
 * the cursor. rAF-throttled and pointer-fine only, so the cost is negligible.
 */
const SELECTOR = ".card, a.contact-card";

export const initSpotlight = (): void => {
  if (!window.matchMedia("(pointer: fine)").matches) return;

  document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
    let raf = 0;
    el.addEventListener(
      "pointermove",
      (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const r = el.getBoundingClientRect();
          el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
          el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
        });
      },
      { passive: true },
    );
  });
};
