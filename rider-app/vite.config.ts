import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves a project site from /<repo-name>/, not the domain
  // root — set only for that build (see the deploy workflow), so local
  // dev/preview keep serving from / unaffected.
  base: process.env.GH_PAGES ? '/GPT-IMAGES-FRONTEND-CODE/' : '/',
  plugins: [react(), tailwindcss()],
})
