import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

const projectRoot = path.resolve(__dirname, '../../')

describe('CSS Consolidation (Epic 1.3)', () => {
  // Story 1.3.1: variables.css moved to styles/ at project root
  describe('Story 1.3.1: styles/variables.css exists at project root', () => {
    it('styles/variables.css exists', () => {
      expect(fs.existsSync(path.join(projectRoot, 'styles', 'variables.css'))).toBe(true)
    })

    it('styles/variables.css contains :root CSS custom properties', () => {
      const filePath = path.join(projectRoot, 'styles', 'variables.css')
      const content = fs.readFileSync(filePath, 'utf-8')
      expect(content).toContain(':root {')
      expect(content).toContain('--color-primary:')
    })
  })

  // Story 1.3.1: app/globals.css import path updated
  describe('Story 1.3.1: app/globals.css import path updated', () => {
    it('app/globals.css does not import from ../src/styles/', () => {
      const filePath = path.join(projectRoot, 'app', 'globals.css')
      const content = fs.readFileSync(filePath, 'utf-8')
      expect(content).not.toContain('../src/styles/')
    })

    it('app/globals.css imports from ../styles/variables.css', () => {
      const filePath = path.join(projectRoot, 'app', 'globals.css')
      const content = fs.readFileSync(filePath, 'utf-8')
      expect(content).toContain('../styles/variables.css')
    })
  })

  // Story 1.3.2: base styles merged into globals.css
  describe('Story 1.3.2: app/globals.css contains merged base styles from src/styles/index.css', () => {
    it('app/globals.css contains @layer base directive', () => {
      const filePath = path.join(projectRoot, 'app', 'globals.css')
      const content = fs.readFileSync(filePath, 'utf-8')
      expect(content).toContain('@layer base')
    })

    it('app/globals.css contains font-synthesis: none in @layer base', () => {
      const filePath = path.join(projectRoot, 'app', 'globals.css')
      const content = fs.readFileSync(filePath, 'utf-8')
      expect(content).toContain('font-synthesis: none')
    })

    it('app/globals.css contains text-rendering: optimizeLegibility', () => {
      const filePath = path.join(projectRoot, 'app', 'globals.css')
      const content = fs.readFileSync(filePath, 'utf-8')
      expect(content).toContain('text-rendering: optimizeLegibility')
    })

    it('app/globals.css contains individual heading font sizes (h1-h6)', () => {
      const filePath = path.join(projectRoot, 'app', 'globals.css')
      const content = fs.readFileSync(filePath, 'utf-8')
      expect(content).toContain('--font-size-3xl')
      expect(content).toContain('--font-size-2xl')
      expect(content).toContain('--font-size-xl')
    })

    it('app/globals.css contains paragraph margin and line-height', () => {
      const filePath = path.join(projectRoot, 'app', 'globals.css')
      const content = fs.readFileSync(filePath, 'utf-8')
      // p element should have margin-bottom from merged styles
      expect(content).toMatch(/p\s*\{[^}]*margin-bottom/)
    })

    it('app/globals.css contains focus styles for button and input elements', () => {
      const filePath = path.join(projectRoot, 'app', 'globals.css')
      const content = fs.readFileSync(filePath, 'utf-8')
      expect(content).toContain('button:focus-visible')
      expect(content).toContain('input:focus-visible')
    })

    it('app/globals.css contains code block styling', () => {
      const filePath = path.join(projectRoot, 'app', 'globals.css')
      const content = fs.readFileSync(filePath, 'utf-8')
      expect(content).toContain('var(--font-mono)')
    })

    it('app/globals.css contains @layer utilities with skip-link', () => {
      const filePath = path.join(projectRoot, 'app', 'globals.css')
      const content = fs.readFileSync(filePath, 'utf-8')
      expect(content).toContain('@layer utilities')
      expect(content).toContain('.skip-link')
    })
  })

  // Story 1.3.3: tailwind.config.js cleaned up
  describe('Story 1.3.3: tailwind.config.js content paths updated', () => {
    it('tailwind.config.js does not contain ./index.html', () => {
      const filePath = path.join(projectRoot, 'tailwind.config.js')
      const content = fs.readFileSync(filePath, 'utf-8')
      expect(content).not.toContain('./index.html')
    })

    it('tailwind.config.js does not contain ./src/**/*', () => {
      const filePath = path.join(projectRoot, 'tailwind.config.js')
      const content = fs.readFileSync(filePath, 'utf-8')
      expect(content).not.toContain('./src/**/')
    })

    it('tailwind.config.js still contains ./app/**/*.{js,ts,jsx,tsx}', () => {
      const filePath = path.join(projectRoot, 'tailwind.config.js')
      const content = fs.readFileSync(filePath, 'utf-8')
      expect(content).toContain('./app/**/')
    })

    it('tailwind.config.js contains ./lib/**/*.{js,ts,jsx,tsx}', () => {
      const filePath = path.join(projectRoot, 'tailwind.config.js')
      const content = fs.readFileSync(filePath, 'utf-8')
      expect(content).toContain('./lib/**/')
    })
  })

  // Story 1.3.4: No app/ files import CSS from src/
  describe('Story 1.3.4: no app/ files import CSS from src/', () => {
    it('no files in app/ import from src/styles/', () => {
      const appDir = path.join(projectRoot, 'app')

      function findCssImportsFromSrc(dir: string): string[] {
        const violations: string[] = []
        const entries = fs.readdirSync(dir, { withFileTypes: true })

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name)
          if (entry.isDirectory()) {
            violations.push(...findCssImportsFromSrc(fullPath))
          } else if (entry.isFile() && /\.(ts|tsx|js|jsx|css)$/.test(entry.name)) {
            // Skip test files — they may reference src/styles/ in assertions
            if (fullPath.includes('__tests__') || fullPath.includes('.test.') || fullPath.includes('.spec.')) {
              continue
            }
            const content = fs.readFileSync(fullPath, 'utf-8')
            // Match actual import/require statements, not arbitrary string occurrences
            const importFromSrc = /(?:@import|import|require)\s+['"][^'"]*src\/styles\//.test(content)
            if (importFromSrc) {
              violations.push(fullPath)
            }
          }
        }

        return violations
      }

      const violations = findCssImportsFromSrc(appDir)
      expect(violations).toEqual([])
    })
  })
})
