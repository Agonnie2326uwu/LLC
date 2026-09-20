import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Preview (GitHub Pages): https://n3mo1101.github.io/LLC/  (default base '/LLC/')
// Vercel: set env SITE_BASE='/' so the site is served from the domain root.
// (.trim() guards against stray whitespace/newlines in stored env values.)
export default defineConfig({
  site: 'https://n3mo1101.github.io',
  base: (process.env.SITE_BASE ?? '/LLC/').trim() || '/',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
