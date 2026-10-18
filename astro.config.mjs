import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Preview (GitHub Pages): https://n3mo1101.github.io/LLC/  (base '/LLC/')
// Vercel: the platform always sets VERCEL=1 at build time, so serve from '/'.
// (Detects the host instead of trusting a hand-typed env value.)
// Local `astro dev` also serves from '/' so http://localhost:4321/ works.
const isDev = process.argv.includes('dev');

export default defineConfig({
  site: 'https://n3mo1101.github.io',
  base: process.env.VERCEL || isDev ? '/' : '/LLC/',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
