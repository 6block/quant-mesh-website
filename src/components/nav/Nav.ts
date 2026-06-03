import "./nav.css";

/**
 * Nav behaviour:
 *  - adds `.is-scrolled` (glass background) past a threshold
 *  - toggles the mobile menu with correct aria state
 *  - closes the mobile menu on link click
 */
const SCROLL_THRESHOLD = 24;

export const initNav = (): void => {
  const nav = document.querySelector<HTMLElement>("[data-nav]");
  const toggle = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
  const menu = document.getElementById("mobile-menu");
  if (!nav) return;

  // Glass-on-scroll
  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > SCROLL_THRESHOLD);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  if (toggle && menu) {
    const setOpen = (open: boolean) => {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      menu.hidden = !open;
    };

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });
  }
};
