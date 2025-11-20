import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Determine base path based on deployment target
// - Vercel (primary): '/' at root domain karstenwade.com
// - GitHub Pages (mirror): '/karstenwade.com/' at karstenwade.github.io
const isGitHubPages = process.env.GITHUB_PAGES === 'true'
const base = isGitHubPages ? '/karstenwade.com/' : '/'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Base path: '/' for Vercel, '/karstenwade.com/' for GitHub Pages
  base,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Output directory for static files
    outDir: 'dist',
    // Generate sourcemaps for debugging
    sourcemap: true,
    // Optimize for production with esbuild (faster than terser)
    minify: 'esbuild',
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: false,
  },
  // Development server configuration
  server: {
    port: 5173,
    strictPort: false,
    open: false,
  },
})
