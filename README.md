# Quant Mesh Limited — Official Website

One-page corporate site for **Quant Mesh Limited** (Hong Kong), an AI-compute
infrastructure SaaS company. Built as a fast, static, dependency-free microsite
optimised for credibility, performance and SEO — suitable for KYB (Know Your
Business) verification.

## Tech stack

- **Vite + TypeScript** (no UI framework, zero runtime dependencies)
- Hand-written Canvas2D mesh animation, `IntersectionObserver` scroll reveals,
  CSS transitions — all compositor-friendly and `prefers-reduced-motion` aware
- Design tokens in `oklch`; semantic HTML; `schema.org` Organization JSON-LD

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + emit static site to dist/
npm run preview    # preview the production build
```

`dist/` is fully static — deploy to Vercel, Netlify, Cloudflare Pages, or any
object storage / CDN.

## Project structure

```
index.html                 # markup + all SEO meta + JSON-LD
public/                    # favicon, og-image, robots.txt, sitemap.xml
src/
  main.ts                  # entry — imports CSS, boots modules
  content.ts               # company constants (single source of truth)
  styles/                  # tokens.css, global.css, sections.css
  components/
    nav/   (Nav.ts, nav.css)
    hero/  (hero.css)
    mesh/  (MeshCanvas.ts)
  lib/                     # reveal.ts, magnetic.ts, reducedMotion.ts
```

## Before going live

- **Domain**: all canonical / OG / sitemap URLs use `https://quantmesh.ai`.
  Update `index.html`, `public/robots.txt`, `public/sitemap.xml` if the live
  domain differs.
- **OG image**: `og-image.png` is referenced for social sharing. Regenerate
  from `public/og-image.svg` (export at 1200×630) if you change branding.
- **Company registration number / incorporation year**: intentionally not
  published. If you later want to show them, add rows in the Company section of
  `index.html`.

## Media assets

- `public/media/mesh-bg.mp4` (~7 MB): the looping hero background video (glass
  compute-core). Self-hosted; autoplays muted, loops, pauses off-screen, and is
  paused entirely under `prefers-reduced-motion` (the poster shows instead).
- `public/media/mesh-poster.jpg`: poster / reduced-motion still for the video.

## SEO checklist (already in place)

- Descriptive `<title>` + meta description, canonical, robots meta
- Open Graph + Twitter Card tags
- `schema.org` `Organization` + `WebSite` JSON-LD (legal name, address, email)
- `robots.txt` + `sitemap.xml`
- Semantic landmarks, labelled sections, accessible focus states

## Accessibility & performance

- Respects `prefers-reduced-motion` (mesh renders one static frame; reveals off)
- Mesh animation pauses when the hero scrolls out of view
- Keyboard-navigable nav with skip link; visible focus rings
- No layout-bound animation; only `transform` / `opacity` / `filter`
