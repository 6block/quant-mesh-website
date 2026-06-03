import { defineConfig } from "vite";

// Static single-page microsite. Builds to dist/ for any static host
// (Vercel / Netlify / Cloudflare Pages / object storage).
export default defineConfig({
  build: {
    target: "es2021",
    cssMinify: true,
    reportCompressedSize: true,
  },
});
