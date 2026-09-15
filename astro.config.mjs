import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Preview: https://n3mo1101.github.io/LLC/
// Production (GoDaddy, later): change base to '/' and site to 'https://luxuryduocleaning.com'
export default defineConfig({
  site: 'https://n3mo1101.github.io',
  base: '/LLC/',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
