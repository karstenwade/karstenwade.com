import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Fiction from './Fiction'

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

      const description = screen.getByText(/short stories exploring/i)
      expect(description).toBeInTheDocument()
    })
  })

  describe('Story Previews', () => {
    it('should render at least one story preview', () => {
      render(<Fiction />)

      const previews = screen.getAllByTestId('story-preview')
      expect(previews.length).toBeGreaterThanOrEqual(1)
    })

    it('should display story titles', () => {
      render(<Fiction />)

      expect(screen.getByText(/The Pull Request/i)).toBeInTheDocument()
    })

    it('should display story excerpts (first paragraph)', () => {
      render(<Fiction />)

      // First sentence of "The Pull Request"
      expect(screen.getByText(/The notification arrived at 2:47 AM/i)).toBeInTheDocument()
    })

    it('should use article element for each story', () => {
      render(<Fiction />)

      const articles = screen.getAllByRole('article')
      expect(articles.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Story Metadata', () => {
    it('should display story genre', () => {
      render(<Fiction />)

      expect(screen.getByText(/Tech Fiction/i)).toBeInTheDocument()
    })

    it('should display word count', () => {
      render(<Fiction />)

      expect(screen.getByText(/324 words/i)).toBeInTheDocument()
    })

    it('should display date written', () => {
      render(<Fiction />)

      // Looking for formatted date
      const dateElements = screen.getAllByText(/2025/i)
      expect(dateElements.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Expand/Collapse Functionality', () => {
    it('should have expand button for each story', () => {
      render(<Fiction />)

      const expandButtons = screen.getAllByRole('button', { name: /read full story/i })
      expect(expandButtons.length).toBeGreaterThanOrEqual(1)
    })

    it('should expand story when button is clicked', async () => {
      const user = userEvent.setup()
      render(<Fiction />)

      const expandButton = screen.getByRole('button', { name: /read full story/i })

      // Full story text (beyond excerpt) should not be visible initially
      expect(screen.queryByText(/She knew she should wait until morning/i)).not.toBeInTheDocument()

      await user.click(expandButton)

      // Full story should be visible after clicking
      expect(screen.getByText(/She knew she should wait until morning/i)).toBeInTheDocument()
    })

    it('should change button text when expanded', async () => {
      const user = userEvent.setup()
      render(<Fiction />)

      const expandButton = screen.getByRole('button', { name: /read full story/i })

      await user.click(expandButton)

      expect(screen.getByRole('button', { name: /collapse/i })).toBeInTheDocument()
    })

    it('should collapse story when button is clicked again', async () => {
      const user = userEvent.setup()
      render(<Fiction />)

      const expandButton = screen.getByRole('button', { name: /read full story/i })

      await user.click(expandButton)
      expect(screen.getByText(/She knew she should wait until morning/i)).toBeInTheDocument()

      const collapseButton = screen.getByRole('button', { name: /collapse/i })
      await user.click(collapseButton)

      expect(screen.queryByText(/She knew she should wait until morning/i)).not.toBeInTheDocument()
    })
  })

  describe('Responsive Layout', () => {
    it('should use stories-list layout', () => {
      render(<Fiction />)

      const list = document.querySelector('.stories-list')
      expect(list).toBeInTheDocument()
    })

    it('should contain story previews in list', () => {
      render(<Fiction />)

      const previews = screen.getAllByTestId('story-preview')
      const list = document.querySelector('.stories-list')

      expect(list).toContainElement(previews[0])
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

    it('should have accessible expand buttons', () => {
      render(<Fiction />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName()
      })
    })

    it('should use article for each story', () => {
      render(<Fiction />)

      const articles = screen.getAllByRole('article')
      expect(articles.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Data Loading', () => {
    it('should load stories from fiction data', () => {
      render(<Fiction />)

      // Should display stories from fiction.ts
      const previews = screen.getAllByTestId('story-preview')
      expect(previews.length).toBeGreaterThanOrEqual(1)
    })

    it('should display featured stories', () => {
      render(<Fiction />)

      // "The Pull Request" is featured
      expect(screen.getByText(/The Pull Request/i)).toBeInTheDocument()
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
