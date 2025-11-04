import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Writing from './Writing'

describe('Writing Page', () => {
  describe('Page Rendering', () => {
    it('should render writing page', () => {
      render(<Writing />)

      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('should have correct semantic structure', () => {
      render(<Writing />)

      const main = screen.getByRole('main')
      expect(main).toHaveClass('writing')
    })
  })

  describe('Page Header', () => {
    it('should render page heading', () => {
      render(<Writing />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent(/Writing/i)
    })

    it('should render page description', () => {
      render(<Writing />)

      const description = screen.getByText(/poetry and prose/i)
      expect(description).toBeInTheDocument()
    })
  })

  describe('Poetry Section', () => {
    it('should render poetry section', () => {
      render(<Writing />)

      const section = screen.getByRole('region', { name: /poetry/i })
      expect(section).toBeInTheDocument()
    })

    it('should have poetry section heading', () => {
      render(<Writing />)

      const heading = screen.getByRole('heading', { level: 2, name: /poetry/i })
      expect(heading).toBeInTheDocument()
    })

    it('should display at least one poem preview', () => {
      render(<Writing />)

      const previews = screen.getAllByTestId('poem-preview')
      expect(previews.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Fiction Section', () => {
    it('should render fiction section', () => {
      render(<Writing />)

      const section = screen.getByRole('region', { name: /fiction/i })
      expect(section).toBeInTheDocument()
    })

    it('should have fiction section heading', () => {
      render(<Writing />)

      const heading = screen.getByRole('heading', { level: 2, name: /fiction/i })
      expect(heading).toBeInTheDocument()
    })

    it('should display at least one story preview', () => {
      render(<Writing />)

      const previews = screen.getAllByTestId('story-preview')
      expect(previews.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('CSS Classes', () => {
    it('should apply base writing class', () => {
      render(<Writing />)

      const main = screen.getByRole('main')
      expect(main).toHaveClass('writing')
    })

    it('should accept custom className prop', () => {
      render(<Writing className="custom-writing-page" />)

      const main = screen.getByRole('main')
      expect(main).toHaveClass('writing')
      expect(main).toHaveClass('custom-writing-page')
    })
  })

  describe('Accessibility', () => {
    it('should use main landmark', () => {
      render(<Writing />)

      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('should have h1 as page heading', () => {
      render(<Writing />)

      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()
    })

    it('should have accessible poetry section', () => {
      render(<Writing />)

      const section = screen.getByRole('region', { name: /poetry/i })
      expect(section).toBeInTheDocument()
    })

    it('should have accessible fiction section', () => {
      render(<Writing />)

      const section = screen.getByRole('region', { name: /fiction/i })
      expect(section).toBeInTheDocument()
    })
  })

  describe('Props Interface', () => {
    it('should render without any props (using defaults)', () => {
      render(<Writing />)

      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('should accept className prop', () => {
      render(<Writing className="creative-writing" />)

      const main = screen.getByRole('main')
      expect(main).toHaveClass('creative-writing')
    })
  })
})
