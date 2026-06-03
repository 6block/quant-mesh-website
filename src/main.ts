import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/sections.css";
import "./components/hero/hero.css";

import { initNav } from "./components/nav/Nav";
import { initMesh } from "./components/mesh/MeshCanvas";
import { initReveal } from "./lib/reveal";
import { initMagnetic } from "./lib/magnetic";
import { initHeroVideo } from "./lib/heroVideo";
import { initSpotlight } from "./lib/spotlight";

const boot = (): void => {
  // Guarantee the hidden state even if the inline head script was stripped.
  document.documentElement.classList.add("has-js");

  initNav();
  initReveal();
  initMagnetic();
  initHeroVideo();
  initSpotlight();

  // Styles are applied by now: fade the page in (one painted frame at opacity 0
  // first, so the transition actually plays) instead of flashing unstyled.
  requestAnimationFrame(() =>
    requestAnimationFrame(() => document.body.classList.add("is-ready")),
  );

  document.querySelectorAll<HTMLCanvasElement>("[data-mesh]").forEach((c) => initMesh(c));
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
