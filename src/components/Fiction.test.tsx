import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Fiction from './Fiction'

// Mock StructuredData component
vi.mock('./StructuredData', () => ({
  default: () => null,
}))

// Mock contentService to return fiction data
// Use async factory to properly import actual data
vi.mock('../services/contentService', async () => {
  const fictionData = await vi.importActual<typeof import('../data/fiction')>('../data/fiction')
  return {
    contentService: {
      getStories: vi.fn(() => Promise.resolve(fictionData.stories)),
      getEssays: vi.fn(() => Promise.resolve([])),
      getPoems: vi.fn(() => Promise.resolve([])),
      getPapers: vi.fn(() => Promise.resolve([])),
    },
  }
})

describe('Fiction Component', () => {
  describe('Component Rendering', () => {
    it('should render fiction section', () => {
      render(<Fiction />)

      const section = screen.getByRole('region', { name: /fiction/i })
      expect(section).toBeInTheDocument()
    })

    it('should have correct semantic structure', () => {
      render(<Fiction />)

      const section = screen.getByRole('region')
      expect(section).toHaveClass('fiction')
    })
  })

  describe('Section Header', () => {
    it('should render section heading', () => {
      render(<Fiction />)

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent(/Fiction/i)
    })

    it('should render section description', () => {
      render(<Fiction />)

      const description = screen.getByText(/More to come/i)
      expect(description).toBeInTheDocument()
    })
  })

  describe('Story Previews', () => {
    it('should handle empty stories array', async () => {
      render(<Fiction />)

      await waitFor(() => {
        const previews = screen.queryAllByTestId('story-preview')
        expect(previews.length).toBe(0)
      })
    })

    it('should show placeholder when no stories', () => {
      render(<Fiction />)

      expect(screen.getByText(/More to come/i)).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should not display metadata when no stories', () => {
      render(<Fiction />)

      expect(screen.queryByText(/Tech Fiction/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/words/i)).not.toBeInTheDocument()
    })
  })

  describe('Expand/Collapse Functionality', () => {
    it('should not have expand buttons when no stories', () => {
      render(<Fiction />)

      const expandButtons = screen.queryAllByRole('button', { name: /read full story/i })
      expect(expandButtons.length).toBe(0)
    })

  })

  describe('Responsive Layout', () => {
    it('should use stories-list layout', () => {
      render(<Fiction />)

      const list = document.querySelector('.stories-list')
      expect(list).toBeInTheDocument()
    })

    it('should show empty list when no stories', async () => {
      render(<Fiction />)

      await waitFor(() => {
        const previews = screen.queryAllByTestId('story-preview')
        expect(previews.length).toBe(0)
      })
    })
  })

  describe('CSS Classes', () => {
    it('should apply base fiction class', () => {
      render(<Fiction />)

      const section = screen.getByRole('region')
      expect(section).toHaveClass('fiction')
    })

    it('should accept custom className prop', () => {
      render(<Fiction className="custom-fiction-section" />)

      const section = screen.getByRole('region')
      expect(section).toHaveClass('fiction')
      expect(section).toHaveClass('custom-fiction-section')
    })
  })

  describe('Accessibility', () => {
    it('should use section with aria-label', () => {
      render(<Fiction />)

      const section = screen.getByRole('region', { name: /fiction/i })
      expect(section).toBeInTheDocument()
    })

    it('should have h2 as section heading', () => {
      render(<Fiction />)

      const h2 = screen.getByRole('heading', { level: 2 })
      expect(h2).toBeInTheDocument()
    })

    it('should not have articles when no stories', () => {
      render(<Fiction />)

      const articles = screen.queryAllByRole('article')
      expect(articles.length).toBe(0)
    })
  })

  describe('Data Loading', () => {
    it('should load empty stories array from fiction data', async () => {
      render(<Fiction />)

      await waitFor(() => {
        // fiction.ts currently has empty stories array
        const previews = screen.queryAllByTestId('story-preview')
        expect(previews.length).toBe(0)
      })
    })
  })

  describe('Props Interface', () => {
    it('should render without any props (using defaults)', () => {
      render(<Fiction />)

      expect(screen.getByRole('region')).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    })

    it('should accept className prop', () => {
      render(<Fiction className="short-stories" />)

      const section = screen.getByRole('region')
      expect(section).toHaveClass('short-stories')
    })
  })
})
