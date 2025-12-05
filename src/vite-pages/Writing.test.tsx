import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Writing from './Writing'

// Mock SEO component to avoid react-helmet-async issues in tests
vi.mock('../components/SEO', () => ({
  default: () => null,
}))

// Mock StructuredData component
vi.mock('../components/StructuredData', () => ({
  default: () => null,
}))

// Mock contentService to return content data
// Use async factory to properly import actual data
vi.mock('../services/contentService', async () => {
  const poetryData = await vi.importActual<typeof import('../data/poetry')>('../data/poetry')
  const fictionData = await vi.importActual<typeof import('../data/fiction')>('../data/fiction')
  const essaysData = await vi.importActual<typeof import('../data/essays')>('../data/essays')

  return {
    contentService: {
      getPoems: vi.fn(() => Promise.resolve(poetryData.poems)),
      getStories: vi.fn(() => Promise.resolve(fictionData.stories)),
      getEssays: vi.fn(() => Promise.resolve(essaysData.essays)),
      getPapers: vi.fn(() => Promise.resolve([])),
    },
  }
})

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

    it('should render page description', async () => {
      render(<Writing />)

      await waitFor(() => {
        const description = screen.getByText(/Poetry, essays, and prose/i)
        expect(description).toBeInTheDocument()
      })
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

    it('should display at least one poem preview', async () => {
      render(<Writing />)

      await waitFor(() => {
        const previews = screen.getAllByTestId('poem-preview')
        expect(previews.length).toBeGreaterThanOrEqual(1)
      })
    })
  })

  describe('Fiction Section', () => {
    it('should render fiction section', async () => {
      const user = (await import('@testing-library/user-event')).default
      render(<Writing />)

      // Click the Fiction tab
      const fictionTab = screen.getByRole('tab', { name: /fiction/i })
      await user.setup().click(fictionTab)

      await waitFor(() => {
        const section = screen.getByRole('region', { name: /fiction/i })
        expect(section).toBeInTheDocument()
      })
    })

    it('should have fiction section heading', async () => {
      const user = (await import('@testing-library/user-event')).default
      render(<Writing />)

      // Click the Fiction tab
      const fictionTab = screen.getByRole('tab', { name: /fiction/i })
      await user.setup().click(fictionTab)

      await waitFor(() => {
        const heading = screen.getByRole('heading', { level: 2, name: /fiction/i })
        expect(heading).toBeInTheDocument()
      })
    })

    it('should show placeholder when no stories', async () => {
      const user = (await import('@testing-library/user-event')).default
      render(<Writing />)

      // Click the Fiction tab
      const fictionTab = screen.getByRole('tab', { name: /fiction/i })
      await user.setup().click(fictionTab)

      await waitFor(() => {
        expect(screen.getByText(/More to come/i)).toBeInTheDocument()
      })
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

    it('should have accessible fiction section', async () => {
      const user = (await import('@testing-library/user-event')).default
      render(<Writing />)

      // Click the Fiction tab
      const fictionTab = screen.getByRole('tab', { name: /fiction/i })
      await user.setup().click(fictionTab)

      await waitFor(() => {
        const section = screen.getByRole('region', { name: /fiction/i })
        expect(section).toBeInTheDocument()
      })
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
