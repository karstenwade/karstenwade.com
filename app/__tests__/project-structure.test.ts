import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

const projectRoot = path.resolve(__dirname, '../../')

describe('Project structure: data & service layer migration (Stories 1.2.1-1.2.5, 1.1.2)', () => {
  // Story 1.2.1: Data files at root-level data/
  describe('Story 1.2.1: data files exist at root-level data/', () => {
    it('data/papers.ts exists', () => {
      expect(fs.existsSync(path.join(projectRoot, 'data', 'papers.ts'))).toBe(true)
    })

    it('data/cv.ts exists', () => {
      expect(fs.existsSync(path.join(projectRoot, 'data', 'cv.ts'))).toBe(true)
    })

    it('data/essays.ts exists', () => {
      expect(fs.existsSync(path.join(projectRoot, 'data', 'essays.ts'))).toBe(true)
    })

    it('data/featuredContent.ts exists', () => {
      expect(fs.existsSync(path.join(projectRoot, 'data', 'featuredContent.ts'))).toBe(true)
    })

    it('data/fiction.ts exists', () => {
      expect(fs.existsSync(path.join(projectRoot, 'data', 'fiction.ts'))).toBe(true)
    })

    it('data/poetry.ts exists', () => {
      expect(fs.existsSync(path.join(projectRoot, 'data', 'poetry.ts'))).toBe(true)
    })

    it('data/theories.ts exists', () => {
      expect(fs.existsSync(path.join(projectRoot, 'data', 'theories.ts'))).toBe(true)
    })
  })

  // Story 1.2.2: Service files at lib/services/
  describe('Story 1.2.2: service files exist at lib/services/', () => {
    it('lib/services/contentService.ts exists', () => {
      expect(fs.existsSync(path.join(projectRoot, 'lib', 'services', 'contentService.ts'))).toBe(true)
    })

    it('lib/services/paperService.ts exists', () => {
      expect(fs.existsSync(path.join(projectRoot, 'lib', 'services', 'paperService.ts'))).toBe(true)
    })

    it('lib/services/githubApi.ts exists', () => {
      expect(fs.existsSync(path.join(projectRoot, 'lib', 'services', 'githubApi.ts'))).toBe(true)
    })
  })

  // Story 1.2.3: Shared lib files at root-level lib/
  describe('Story 1.2.3: shared lib files exist at root-level lib/', () => {
    it('lib/utils.ts exists', () => {
      expect(fs.existsSync(path.join(projectRoot, 'lib', 'utils.ts'))).toBe(true)
    })

    it('lib/strapi.ts exists', () => {
      expect(fs.existsSync(path.join(projectRoot, 'lib', 'strapi.ts'))).toBe(true)
    })
  })

  // Story 1.2.4: Types at root-level types/
  describe('Story 1.2.4: types/index.ts exists at root-level types/', () => {
    it('types/index.ts exists', () => {
      expect(fs.existsSync(path.join(projectRoot, 'types', 'index.ts'))).toBe(true)
    })
  })

  // Story 1.2.5: UI components at app/components/ui/
  describe('Story 1.2.5: shadcn ui components exist at app/components/ui/', () => {
    it('app/components/ui/card.tsx exists', () => {
      expect(fs.existsSync(path.join(projectRoot, 'app', 'components', 'ui', 'card.tsx'))).toBe(true)
    })

    it('app/components/ui/button.tsx exists', () => {
      expect(fs.existsSync(path.join(projectRoot, 'app', 'components', 'ui', 'button.tsx'))).toBe(true)
    })
  })

  // Story 1.1.2: tsconfig.json path alias points to root
  describe('Story 1.1.2: tsconfig.json @/* alias points to ./*', () => {
    it('tsconfig.json @/* alias points to ./* (not ./src/*)', () => {
      const tsconfigPath = path.join(projectRoot, 'tsconfig.json')
      const content = fs.readFileSync(tsconfigPath, 'utf-8')
      // Check the paths section contains ./* and not ./src/*
      // tsconfig.json uses JSONC (comments allowed), so check raw text
      expect(content).toMatch(/"@\/\*":\s*\[\s*"\.\/\*"\s*\]/)
      expect(content).not.toMatch(/"@\/\*":\s*\[\s*"\.\/src\/\*"\s*\]/)
    })
  })

  // vitest.config.ts alias points to root
  describe('vitest.config.ts @ alias points to project root', () => {
    it('vitest.config.ts @ alias uses path.resolve(__dirname, .)', () => {
      const vitestConfigPath = path.join(projectRoot, 'vitest.config.ts')
      const content = fs.readFileSync(vitestConfigPath, 'utf-8')
      // Should resolve to '.' (root), not './src'
      expect(content).not.toMatch(/@.*resolve.*__dirname.*['"]\.\/src['"]/)
    })
  })
})
