import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Essays from './Essays'
import * as essaysData from '../data/essays'

// Mock StructuredData to avoid react-helmet-async issues in tests
vi.mock('./StructuredData', () => ({
  default: () => null,
}))

describe('Essays Component', () => {
  describe('Component Rendering', () => {
    it('should render essays section with region role', () => {
      render(<Essays />)

      const section = screen.getByRole('region', { name: /essays/i })
      expect(section).toBeInTheDocument()
      expect(section).toHaveClass('essays')
    })

    it('should render essays heading', () => {
      render(<Essays />)

      const heading = screen.getByRole('heading', { name: /essays/i, level: 2 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveClass('essays__heading')
    })

    it('should render essays description', () => {
      render(<Essays />)

      const description = screen.getByText(/reflections on writing, identity, creativity/i)
      expect(description).toBeInTheDocument()
      expect(description).toHaveClass('essays__description')
    })
  })

  describe('Props Interface', () => {
    it('should accept custom className', () => {
      render(<Essays className="custom-essays" />)

      const section = screen.getByRole('region', { name: /essays/i })
      expect(section).toHaveClass('essays')
      expect(section).toHaveClass('custom-essays')
    })

    it('should render with default className when not provided', () => {
      render(<Essays />)

      const section = screen.getByRole('region', { name: /essays/i })
      expect(section).toHaveClass('essays')
    })
  })

  describe('Essay List Rendering', () => {
    it('should render all essays from data file', () => {
      render(<Essays />)

      const essayPreviews = screen.getAllByTestId('essay-preview')
      expect(essayPreviews).toHaveLength(essaysData.essays.length)
    })

    it('should render essay title as h3', () => {
      render(<Essays />)

      const firstEssay = essaysData.essays[0]
      const title = screen.getByRole('heading', { name: firstEssay.title, level: 3 })
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('essay-preview__title')
    })

    it('should render essay excerpt', () => {
      render(<Essays />)

      const firstEssay = essaysData.essays[0]
      expect(screen.getByText(firstEssay.excerpt)).toBeInTheDocument()
    })

    it('should render essay word count', () => {
      render(<Essays />)

      const firstEssay = essaysData.essays[0]
      expect(screen.getByText(`${firstEssay.wordCount} words`)).toBeInTheDocument()
    })

    it('should render essay theme', () => {
      render(<Essays />)

      const firstEssay = essaysData.essays[0]
      expect(screen.getByText(firstEssay.theme)).toBeInTheDocument()
    })

    it('should render essay with unique slug as id', () => {
      render(<Essays />)

      const firstEssay = essaysData.essays[0]
      const article = screen.getAllByTestId('essay-preview')[0]
      expect(article).toHaveAttribute('id', firstEssay.slug)
    })
  })

  describe('Date Formatting', () => {
    it('should format date correctly (en-US locale)', () => {
      render(<Essays />)

      const firstEssay = essaysData.essays[0]
      const date = new Date(firstEssay.dateWritten)
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      expect(screen.getByText(formattedDate)).toBeInTheDocument()
    })
  })

  describe('Expand/Collapse Functionality', () => {
    it('should initially show essays in collapsed state', () => {
      render(<Essays />)

      const toggleButtons = screen.getAllByRole('button')
      toggleButtons.forEach((button) => {
        expect(button).toHaveTextContent('Read Full Essay')
        expect(button).toHaveAttribute('aria-expanded', 'false')
      })
    })

    it('should expand essay when toggle button is clicked', async () => {
      const user = userEvent.setup()
      render(<Essays />)

      const toggleButtons = screen.getAllByRole('button')
      const firstButton = toggleButtons[0]

      await user.click(firstButton)

      expect(firstButton).toHaveTextContent('Collapse')
      expect(firstButton).toHaveAttribute('aria-expanded', 'true')
    })

    it('should collapse essay when toggle button is clicked again', async () => {
      const user = userEvent.setup()
      render(<Essays />)

      const toggleButtons = screen.getAllByRole('button')
      const firstButton = toggleButtons[0]

      // Expand
      await user.click(firstButton)
      expect(firstButton).toHaveAttribute('aria-expanded', 'true')

      // Collapse
      await user.click(firstButton)
      expect(firstButton).toHaveAttribute('aria-expanded', 'false')
      expect(firstButton).toHaveTextContent('Read Full Essay')
    })

    it('should display full text when expanded', async () => {
      const user = userEvent.setup()
      render(<Essays />)

      const toggleButtons = screen.getAllByRole('button')
      const firstButton = toggleButtons[0]

      // Full text should not be visible initially
      const firstEssay = essaysData.essays[0]
      const paragraphs = firstEssay.fullText.split('\n\n')

      await user.click(firstButton)

      // Full text should now be visible
      paragraphs.forEach((paragraph) => {
        if (paragraph.trim()) {
          expect(screen.getByText(paragraph)).toBeInTheDocument()
        }
      })
    })

    it('should allow expanding multiple essays simultaneously', async () => {
      const user = userEvent.setup()
      render(<Essays />)

      const toggleButtons = screen.getAllByRole('button')

      // Expand first essay
      await user.click(toggleButtons[0])
      expect(toggleButtons[0]).toHaveAttribute('aria-expanded', 'true')

      // Expand second essay (if exists)
      if (toggleButtons.length > 1) {
        await user.click(toggleButtons[1])
        expect(toggleButtons[1]).toHaveAttribute('aria-expanded', 'true')

        // First should still be expanded
        expect(toggleButtons[0]).toHaveAttribute('aria-expanded', 'true')
      }
    })
  })

  describe('Accessibility', () => {
    it('should use semantic article elements', () => {
      render(<Essays />)

      const articles = screen.getAllByRole('article')
      expect(articles.length).toBeGreaterThan(0)
    })

    it('should have aria-label on section', () => {
      render(<Essays />)

      const section = screen.getByRole('region', { name: /essays/i })
      expect(section).toHaveAttribute('aria-label', 'Essays')
    })

    it('should have aria-expanded attribute on toggle buttons', () => {
      render(<Essays />)

      const toggleButtons = screen.getAllByRole('button')
      toggleButtons.forEach((button) => {
        expect(button).toHaveAttribute('aria-expanded')
      })
    })

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup()
      render(<Essays />)

      const toggleButtons = screen.getAllByRole('button')
      const firstButton = toggleButtons[0]

      // Tab to first button
      await user.tab()
      expect(firstButton).toHaveFocus()

      // Activate with Enter key
      await user.keyboard('{Enter}')
      expect(firstButton).toHaveAttribute('aria-expanded', 'true')
    })

    it('should be activatable with Space key', async () => {
      const user = userEvent.setup()
      render(<Essays />)

      const toggleButtons = screen.getAllByRole('button')
      const firstButton = toggleButtons[0]

      firstButton.focus()
      await user.keyboard(' ')

      expect(firstButton).toHaveAttribute('aria-expanded', 'true')
    })
  })

  describe('CSS Classes', () => {
    it('should apply essay-preview class to articles', () => {
      render(<Essays />)

      const articles = screen.getAllByTestId('essay-preview')
      articles.forEach((article) => {
        expect(article).toHaveClass('essay-preview')
      })
    })

    it('should apply header classes', () => {
      render(<Essays />)

      expect(document.querySelector('.essays__header')).toBeInTheDocument()
    })

    it('should apply metadata classes', () => {
      render(<Essays />)

      expect(document.querySelector('.essay-preview__metadata')).toBeInTheDocument()
      expect(document.querySelector('.essay-preview__word-count')).toBeInTheDocument()
      expect(document.querySelector('.essay-preview__date')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty essays array gracefully', () => {
      vi.spyOn(essaysData, 'essays', 'get').mockReturnValue([])
      render(<Essays />)

      const section = screen.getByRole('region', { name: /essays/i })
      expect(section).toBeInTheDocument()

      const articles = screen.queryAllByTestId('essay-preview')
      expect(articles).toHaveLength(0)
    })

    it('should render separator between word count and date', () => {
      render(<Essays />)

      // Only check if there are essays
      if (essaysData.essays.length > 0) {
        const separators = document.querySelectorAll('.essay-preview__separator')
        expect(separators.length).toBe(essaysData.essays.length)
        separators.forEach((separator) => {
          expect(separator.textContent).toBe('•')
        })
      }
    })
  })
})
