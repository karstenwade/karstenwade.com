import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Static site generation for GitHub Pages deployment
  output: 'export',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // TypeScript configuration
  typescript: {
    // Type checking is handled by our existing tsc build step
    ignoreBuildErrors: false,
  },

  // Trailing slashes for cleaner URLs
  trailingSlash: true,

  // Turbopack root directory configuration
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
