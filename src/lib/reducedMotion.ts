/** Single source of truth for the user's reduced-motion preference. */
const query = window.matchMedia("(prefers-reduced-motion: reduce)");

export const prefersReducedMotion = (): boolean => query.matches;

/** Subscribe to changes (e.g. user toggles OS setting mid-session). */
export const onReducedMotionChange = (cb: (reduced: boolean) => void): void => {
  query.addEventListener("change", (e) => cb(e.matches));
};
