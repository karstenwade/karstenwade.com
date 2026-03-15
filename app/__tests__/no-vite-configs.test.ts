import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

const projectRoot = path.resolve(__dirname, '../../')

describe('Vite config files do not exist in project root', () => {
  it('vite.config.ts does not exist at project root', () => {
    const filePath = path.join(projectRoot, 'vite.config.ts')
    expect(fs.existsSync(filePath)).toBe(false)
  })

  it('tsconfig.node.json does not exist at project root', () => {
    const filePath = path.join(projectRoot, 'tsconfig.node.json')
    expect(fs.existsSync(filePath)).toBe(false)
  })

  it('index.html does not exist at project root', () => {
    const filePath = path.join(projectRoot, 'index.html')
    expect(fs.existsSync(filePath)).toBe(false)
  })

  it('public/vite.svg does not exist', () => {
    const filePath = path.join(projectRoot, 'public', 'vite.svg')
    expect(fs.existsSync(filePath)).toBe(false)
  })

  it('src/vite-env.d.ts does not exist', () => {
    const filePath = path.join(projectRoot, 'src', 'vite-env.d.ts')
    expect(fs.existsSync(filePath)).toBe(false)
  })
})
