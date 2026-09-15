import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Preview: https://iskatiboi.github.io/LLC/
// Production (GoDaddy, later): change base to '/' and site to 'https://luxuryduocleaning.com'
export default defineConfig({
  site: 'https://iskatiboi.github.io',
  base: '/LLC/',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
