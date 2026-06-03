import { prefersReducedMotion } from "./reducedMotion";

/**
 * Hero background video controller.
 *  - reduced-motion: keep it paused so only the poster frame shows
 *  - otherwise: play, but pause whenever the hero leaves the viewport
 *    (saves battery / decode work while the user reads further down)
 */
export const initHeroVideo = (): void => {
  const video = document.querySelector<HTMLVideoElement>("[data-hero-video]");
  if (!video) return;

  if (prefersReducedMotion()) {
    video.removeAttribute("autoplay");
    video.pause();
    return;
  }

  const play = () => {
    void video.play().catch(() => {
      /* autoplay can be blocked; the poster remains as a graceful fallback */
    });
  };

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.isIntersecting ? play() : video.pause();
        }
      },
      { threshold: 0.05 },
    ).observe(video);
  } else {
    play();
  }
};
