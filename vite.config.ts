import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages - will be '/' for custom domain
  // or '/karstenwade.com/' for GitHub Pages subdomain
  base: '/',
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
