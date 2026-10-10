import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves from /<repo>/; Vercel and local dev serve from root
  base: process.env.GITHUB_ACTIONS ? '/personalWebsiteProf/' : '/',
})
