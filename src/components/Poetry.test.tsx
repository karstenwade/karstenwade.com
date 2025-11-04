import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Poetry from './Poetry'

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

    it('should render section description', () => {
      render(<Poetry />)

      const description = screen.getByText(/explorations of AI/i)
      expect(description).toBeInTheDocument()
    })
  })

  describe('Poem Previews', () => {
    it('should render at least one poem preview', () => {
      render(<Poetry />)

      const previews = screen.getAllByTestId('poem-preview')
      expect(previews.length).toBeGreaterThanOrEqual(1)
    })

    it('should display poem titles', () => {
      render(<Poetry />)

      expect(screen.getByText(/Opening Collaboration/i)).toBeInTheDocument()
    })

    it('should display poem excerpts (first 4 lines)', () => {
      render(<Poetry />)

      // First line of "Opening Collaboration"
      expect(screen.getByText(/In the quiet space between our screens/i)).toBeInTheDocument()
    })

    it('should use article element for each poem', () => {
      render(<Poetry />)

      const articles = screen.getAllByRole('article')
      expect(articles.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Poem Metadata', () => {
    it('should display poem form', () => {
      render(<Poetry />)

      expect(screen.getByText(/Lyric Poetry/i)).toBeInTheDocument()
    })

    it('should display poem theme', () => {
      render(<Poetry />)

      // More specific match for the theme field (includes "partnership, mutual learning")
      expect(screen.getByText(/AI-human collaboration, partnership, mutual learning/i)).toBeInTheDocument()
    })

    it('should display date written', () => {
      render(<Poetry />)

      // Looking for formatted date
      const dateElements = screen.getAllByText(/2024/i)
      expect(dateElements.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Expand/Collapse Functionality', () => {
    it('should have expand button for each poem', () => {
      render(<Poetry />)

      const expandButtons = screen.getAllByRole('button', { name: /read full poem/i })
      expect(expandButtons.length).toBeGreaterThanOrEqual(1)
    })

    it('should expand poem when button is clicked', async () => {
      const user = userEvent.setup()
      render(<Poetry />)

      const expandButton = screen.getByRole('button', { name: /read full poem/i })

      // Full poem text (beyond excerpt) should not be visible initially
      expect(screen.queryByText(/Your words arrive, a gentle probe/i)).not.toBeInTheDocument()

      await user.click(expandButton)

      // Full poem should be visible after clicking
      expect(screen.getByText(/Your words arrive, a gentle probe/i)).toBeInTheDocument()
    })

    it('should change button text when expanded', async () => {
      const user = userEvent.setup()
      render(<Poetry />)

      const expandButton = screen.getByRole('button', { name: /read full poem/i })

      await user.click(expandButton)

      expect(screen.getByRole('button', { name: /collapse/i })).toBeInTheDocument()
    })

    it('should collapse poem when button is clicked again', async () => {
      const user = userEvent.setup()
      render(<Poetry />)

      const expandButton = screen.getByRole('button', { name: /read full poem/i })

      await user.click(expandButton)
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

    it('should contain poem previews in list', () => {
      render(<Poetry />)

      const previews = screen.getAllByTestId('poem-preview')
      const list = document.querySelector('.poems-list')

      expect(list).toContainElement(previews[0])
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

    it('should have accessible expand buttons', () => {
      render(<Poetry />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName()
      })
    })

    it('should use article for each poem', () => {
      render(<Poetry />)

      const articles = screen.getAllByRole('article')
      expect(articles.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Data Loading', () => {
    it('should load poems from poetry data', () => {
      render(<Poetry />)

      // Should display poems from poetry.ts
      const previews = screen.getAllByTestId('poem-preview')
      expect(previews.length).toBeGreaterThanOrEqual(1)
    })

    it('should display featured poems', () => {
      render(<Poetry />)

      // "Opening Collaboration" is featured
      expect(screen.getByText(/Opening Collaboration/i)).toBeInTheDocument()
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
