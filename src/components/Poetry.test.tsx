import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Poetry from './Poetry'

// Mock StructuredData component
vi.mock('./StructuredData', () => ({
  default: () => null,
}))

// Mock contentService to return poetry data
// Use async factory to properly import actual data
vi.mock('../services/contentService', async () => {
  const poetryData = await vi.importActual<typeof import('../data/poetry')>('../data/poetry')
  return {
    contentService: {
      getPoems: vi.fn(() => Promise.resolve(poetryData.poems)),
      getEssays: vi.fn(() => Promise.resolve([])),
      getStories: vi.fn(() => Promise.resolve([])),
      getPapers: vi.fn(() => Promise.resolve([])),
    },
  }
})

describe('Poetry Component', () => {
  describe('Component Rendering', () => {
    it('should render poetry section', () => {
      render(<Poetry />)

      const section = screen.getByRole('region', { name: /poetry/i })
      expect(section).toBeInTheDocument()
    })

    it('should have correct semantic structure', () => {
      render(<Poetry />)

      const section = screen.getByRole('region')
      expect(section).toHaveClass('poetry')
    })
  })

  describe('Section Header', () => {
    it('should render section heading', () => {
      render(<Poetry />)

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent(/Poetry/i)
    })

    it('should not render section description', () => {
      render(<Poetry />)

      const description = screen.queryByText(/explorations of AI/i)
      expect(description).not.toBeInTheDocument()
    })
  })

  describe('Poem Previews', () => {
    it('should render at least one poem preview', async () => {
      render(<Poetry />)

      await waitFor(() => {
        const previews = screen.getAllByTestId('poem-preview')
        expect(previews.length).toBeGreaterThanOrEqual(1)
      })
    })

    it('should display poem titles', async () => {
      render(<Poetry />)

      await waitFor(() => {
        expect(screen.getByText(/Opening Collaboration/i)).toBeInTheDocument()
      })
    })

    it('should display poem excerpts (first 4 lines)', async () => {
      render(<Poetry />)

      await waitFor(() => {
        // First line of "Opening Collaboration"
        expect(screen.getByText(/In the quiet space between our screens/i)).toBeInTheDocument()
      })
    })

    it('should use article element for each poem', async () => {
      render(<Poetry />)

      await waitFor(() => {
        const articles = screen.getAllByRole('article')
        expect(articles.length).toBeGreaterThanOrEqual(1)
      })
    })
  })

  describe('Poem Metadata', () => {
    it('should display poem form', async () => {
      render(<Poetry />)

      await waitFor(() => {
        expect(screen.getByText(/Lyric Poetry/i)).toBeInTheDocument()
      })
    })

    it('should display poem theme', async () => {
      render(<Poetry />)

      await waitFor(() => {
        // More specific match for the theme field (includes "partnership, mutual learning")
        expect(screen.getByText(/AI-human collaboration, partnership, mutual learning/i)).toBeInTheDocument()
      })
    })

    it('should display date written', async () => {
      render(<Poetry />)

      await waitFor(() => {
        // Looking for formatted date
        const dateElements = screen.getAllByText(/2024/i)
        expect(dateElements.length).toBeGreaterThanOrEqual(1)
      })
    })
  })

  describe('Expand/Collapse Functionality', () => {
    it('should have expand button for each poem', async () => {
      render(<Poetry />)

      await waitFor(() => {
        const expandButtons = screen.getAllByRole('button', { name: /read full poem/i })
        expect(expandButtons.length).toBeGreaterThanOrEqual(1)
      })
    })

    it('should expand poem when button is clicked', async () => {
      const user = userEvent.setup()
      render(<Poetry />)

      let expandButtons: HTMLElement[]
      await waitFor(() => {
        expandButtons = screen.getAllByRole('button', { name: /read full poem/i })
        expect(expandButtons.length).toBeGreaterThan(0)
      })

      // Full poem text (beyond excerpt) should not be visible initially
      expect(screen.queryByText(/Your words arrive, a gentle probe/i)).not.toBeInTheDocument()

      await user.click(expandButtons![0])

      // Full poem should be visible after clicking
      expect(screen.getByText(/Your words arrive, a gentle probe/i)).toBeInTheDocument()
    })

    it('should change button text when expanded', async () => {
      const user = userEvent.setup()
      render(<Poetry />)

      let expandButtons: HTMLElement[]
      await waitFor(() => {
        expandButtons = screen.getAllByRole('button', { name: /read full poem/i })
        expect(expandButtons.length).toBeGreaterThan(0)
      })

      await user.click(expandButtons![0])

      expect(screen.getByRole('button', { name: /collapse/i })).toBeInTheDocument()
    })

    it('should collapse poem when button is clicked again', async () => {
      const user = userEvent.setup()
      render(<Poetry />)

      let expandButtons: HTMLElement[]
      await waitFor(() => {
        expandButtons = screen.getAllByRole('button', { name: /read full poem/i })
        expect(expandButtons.length).toBeGreaterThan(0)
      })

      await user.click(expandButtons![0])
      expect(screen.getByText(/Your words arrive, a gentle probe/i)).toBeInTheDocument()

      const collapseButton = screen.getByRole('button', { name: /collapse/i })
      await user.click(collapseButton)

      expect(screen.queryByText(/Your words arrive, a gentle probe/i)).not.toBeInTheDocument()
    })
  })

  describe('Responsive Layout', () => {
    it('should use poems-list layout', () => {
      render(<Poetry />)

      const list = document.querySelector('.poems-list')
      expect(list).toBeInTheDocument()
    })

    it('should contain poem previews in list', async () => {
      render(<Poetry />)

      await waitFor(() => {
        const previews = screen.getAllByTestId('poem-preview')
        const list = document.querySelector('.poems-list')
        expect(list).toContainElement(previews[0])
      })
    })
  })

  describe('CSS Classes', () => {
    it('should apply base poetry class', () => {
      render(<Poetry />)

      const section = screen.getByRole('region')
      expect(section).toHaveClass('poetry')
    })

    it('should accept custom className prop', () => {
      render(<Poetry className="custom-poetry-section" />)

      const section = screen.getByRole('region')
      expect(section).toHaveClass('poetry')
      expect(section).toHaveClass('custom-poetry-section')
    })
  })

  describe('Accessibility', () => {
    it('should use section with aria-label', () => {
      render(<Poetry />)

      const section = screen.getByRole('region', { name: /poetry/i })
      expect(section).toBeInTheDocument()
    })

    it('should have h2 as section heading', () => {
      render(<Poetry />)

      const h2 = screen.getByRole('heading', { level: 2 })
      expect(h2).toBeInTheDocument()
    })

    it('should have accessible expand buttons', async () => {
      render(<Poetry />)

      await waitFor(() => {
        const buttons = screen.getAllByRole('button')
        buttons.forEach(button => {
          expect(button).toHaveAccessibleName()
        })
      })
    })

    it('should use article for each poem', async () => {
      render(<Poetry />)

      await waitFor(() => {
        const articles = screen.getAllByRole('article')
        expect(articles.length).toBeGreaterThanOrEqual(1)
      })
    })
  })

  describe('Data Loading', () => {
    it('should load poems from poetry data', async () => {
      render(<Poetry />)

      await waitFor(() => {
        // Should display poems from poetry.ts
        const previews = screen.getAllByTestId('poem-preview')
        expect(previews.length).toBeGreaterThanOrEqual(1)
      })
    })

    it('should display featured poems', async () => {
      render(<Poetry />)

      await waitFor(() => {
        // "Opening Collaboration" is featured
        expect(screen.getByText(/Opening Collaboration/i)).toBeInTheDocument()
      })
    })
  })

  describe('Props Interface', () => {
    it('should render without any props (using defaults)', () => {
      render(<Poetry />)

      expect(screen.getByRole('region')).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    })

    it('should accept className prop', () => {
      render(<Poetry className="verse-section" />)

      const section = screen.getByRole('region')
      expect(section).toHaveClass('verse-section')
    })
  })
})
