import { prefersReducedMotion } from "./reducedMotion";

/**
 * Reveal elements marked with [data-reveal] as they scroll through the
 * viewport. Bidirectional: `.is-visible` is toggled on enter AND removed on
 * leave, so elements animate in when scrolling down and ease back out as they
 * exit (and re-animate on the way back). CSS owns the transition + variant.
 */
export const initReveal = (): void => {
  const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      }
    },
    // Reveal once comfortably in view; hide once it has clearly left.
    { rootMargin: "-8% 0px -12% 0px", threshold: 0.12 },
  );

  targets.forEach((el) => observer.observe(el));
};
