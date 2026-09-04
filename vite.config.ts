import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  // GitHub Pages serves this repo from /valentiatechnologiesqatar/, not the
  // domain root, so every built asset URL needs that prefix or it 404s.
  // Driven by an env var rather than hardcoded: Vercel and Netlify both serve
  // from the root, and a baked-in prefix would break them.
  base: process.env.GITHUB_PAGES ? '/valentiatechnologiesqatar/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
