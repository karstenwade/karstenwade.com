import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

const projectRoot = path.resolve(__dirname, '../../')

describe('Epic 1.4: Dead code removed from src/', () => {
  // Story 1.4.1: Vite SPA files deleted
  describe('Story 1.4.1: Vite SPA entry files do not exist', () => {
    it('src/App.tsx does not exist', () => {
      expect(fs.existsSync(path.join(projectRoot, 'src', 'App.tsx'))).toBe(false)
    })

    it('src/App.test.tsx does not exist', () => {
      expect(fs.existsSync(path.join(projectRoot, 'src', 'App.test.tsx'))).toBe(false)
    })

    it('src/main.tsx does not exist', () => {
      expect(fs.existsSync(path.join(projectRoot, 'src', 'main.tsx'))).toBe(false)
    })
  })

  // Story 1.4.2: src/components/ deleted
  describe('Story 1.4.2: src/components/ directory does not exist', () => {
    it('src/components/ directory does not exist', () => {
      expect(fs.existsSync(path.join(projectRoot, 'src', 'components'))).toBe(false)
    })
  })

  // Story 1.4.3: src/vite-pages/, src/hooks/, and dead CSS/docs deleted
  describe('Story 1.4.3: src/vite-pages/ directory does not exist', () => {
    it('src/vite-pages/ directory does not exist', () => {
      expect(fs.existsSync(path.join(projectRoot, 'src', 'vite-pages'))).toBe(false)
    })
  })

  describe('Story 1.4.3: src/hooks/ directory does not exist', () => {
    it('src/hooks/ directory does not exist', () => {
      expect(fs.existsSync(path.join(projectRoot, 'src', 'hooks'))).toBe(false)
    })
  })

  describe('Story 1.4.3: dead CSS and docs removed from src/styles/', () => {
    it('src/styles/App.css does not exist', () => {
      expect(fs.existsSync(path.join(projectRoot, 'src', 'styles', 'App.css'))).toBe(false)
    })

    it('src/styles/README.md does not exist', () => {
      expect(fs.existsSync(path.join(projectRoot, 'src', 'styles', 'README.md'))).toBe(false)
    })
  })

  // Bonus: Duplicate src/ data/services/lib/types removed
  describe('Bonus: duplicate src/ directories deleted (originals now at root)', () => {
    it('src/data/ directory does not exist', () => {
      expect(fs.existsSync(path.join(projectRoot, 'src', 'data'))).toBe(false)
    })

    it('src/services/ directory does not exist', () => {
      expect(fs.existsSync(path.join(projectRoot, 'src', 'services'))).toBe(false)
    })

    it('src/lib/ directory does not exist', () => {
      expect(fs.existsSync(path.join(projectRoot, 'src', 'lib'))).toBe(false)
    })

    it('src/types/ directory does not exist', () => {
      expect(fs.existsSync(path.join(projectRoot, 'src', 'types'))).toBe(false)
    })
  })

  // Ensure active test infrastructure is preserved
  describe('Active test infrastructure still exists', () => {
    it('src/test/setup.ts still exists', () => {
      expect(fs.existsSync(path.join(projectRoot, 'src', 'test', 'setup.ts'))).toBe(true)
    })

    it('src/styles/variables.css still exists', () => {
      expect(fs.existsSync(path.join(projectRoot, 'src', 'styles', 'variables.css'))).toBe(true)
    })

    it('src/styles/index.css still exists', () => {
      expect(fs.existsSync(path.join(projectRoot, 'src', 'styles', 'index.css'))).toBe(true)
    })
  })
})
