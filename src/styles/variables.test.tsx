import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Design System - CSS Variables', () => {
  const variablesPath = join(__dirname, 'variables.css')
  let variablesContent: string

  // Read the CSS file once for all tests
  variablesContent = readFileSync(variablesPath, 'utf-8')

  describe('File Structure', () => {
    it('should exist at src/styles/variables.css', () => {
      expect(variablesContent).toBeTruthy()
      expect(variablesContent.length).toBeGreaterThan(0)
    })

    it('should define CSS custom properties in :root selector', () => {
      expect(variablesContent).toContain(':root {')
    })
  })

  describe('Color Palette - "Wide Horizon Clubhouse"', () => {
    it('should define primary colors (sunset orange tones)', () => {
      expect(variablesContent).toContain('--color-primary: #D97038')
      expect(variablesContent).toContain('--color-primary-light: #E69663')
      expect(variablesContent).toContain('--color-primary-dark: #B85A2A')
    })

    it('should define secondary colors (horizon blue tones)', () => {
      expect(variablesContent).toContain('--color-secondary: #5B8FA3')
      expect(variablesContent).toContain('--color-secondary-light: #7FAABB')
      expect(variablesContent).toContain('--color-secondary-dark: #456B7A')
    })

    it('should define accent colors (community warmth)', () => {
      expect(variablesContent).toContain('--color-accent: #C85C5C')
      expect(variablesContent).toContain('--color-accent-light: #D98585')
      expect(variablesContent).toContain('--color-accent-dark: #A04646')
    })

    it('should define neutral colors (natural materials)', () => {
      expect(variablesContent).toContain('--color-neutral-100: #F8F6F4')
      expect(variablesContent).toContain('--color-neutral-200: #E8E4E0')
      expect(variablesContent).toContain('--color-neutral-800: #1A1612')
    })

    it('should define semantic colors', () => {
      expect(variablesContent).toContain('--color-success: #5A9367')
      expect(variablesContent).toContain('--color-warning: #D9A538')
      expect(variablesContent).toContain('--color-error: #C85C5C')
      expect(variablesContent).toContain('--color-info: #5B8FA3')
    })
  })

  describe('Typography System', () => {
    it('should define font families with Open Sans', () => {
      expect(variablesContent).toContain('--font-body')
      expect(variablesContent).toContain('Open Sans')
    })

    it('should define TT2020 font for special elements', () => {
      expect(variablesContent).toContain('--font-special')
      expect(variablesContent).toContain('TT2020')
    })

    it('should define fluid font sizes using clamp()', () => {
      expect(variablesContent).toContain('--font-size-base: clamp')
      expect(variablesContent).toContain('--font-size-xl: clamp')
      expect(variablesContent).toContain('--font-size-2xl: clamp')
    })

    it('should define font weights', () => {
      expect(variablesContent).toContain('--font-weight-normal: 400')
      expect(variablesContent).toContain('--font-weight-bold: 700')
    })

    it('should define line heights', () => {
      expect(variablesContent).toContain('--line-height-normal: 1.5')
      expect(variablesContent).toContain('--line-height-relaxed: 1.625')
    })
  })

  describe('Spacing Scale', () => {
    it('should define spacing based on 4px increments', () => {
      expect(variablesContent).toContain('--space-1: 0.25rem')
      expect(variablesContent).toContain('--space-4: 1rem')
      expect(variablesContent).toContain('--space-8: 2rem')
    })
  })

  describe('Border Radius', () => {
    it('should define border radius values', () => {
      expect(variablesContent).toContain('--radius-sm: 0.25rem')
      expect(variablesContent).toContain('--radius-md: 0.5rem')
      expect(variablesContent).toContain('--radius-full: 9999px')
    })
  })

  describe('Shadows', () => {
    it('should define shadow values with rgba', () => {
      expect(variablesContent).toContain('--shadow-sm')
      expect(variablesContent).toContain('--shadow-md')
      expect(variablesContent).toContain('rgba')
    })
  })

  describe('Transitions', () => {
    it('should define transition timings', () => {
      expect(variablesContent).toContain('--transition-base: 250ms')
      expect(variablesContent).toContain('cubic-bezier')
    })
  })

  describe('Z-Index Scale', () => {
    it('should define z-index layers', () => {
      expect(variablesContent).toContain('--z-base: 0')
      expect(variablesContent).toContain('--z-modal: 1400')
      expect(variablesContent).toContain('--z-tooltip: 1600')
    })
  })

  describe('Documentation', () => {
    it('should include theme name in comments', () => {
      expect(variablesContent).toContain('Wide Horizon Clubhouse')
    })

    it('should have organized sections with comments', () => {
      expect(variablesContent).toContain('=== Color Palette ===')
      expect(variablesContent).toContain('=== Typography ===')
      expect(variablesContent).toContain('=== Spacing ===')
    })
  })
})
