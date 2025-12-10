import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Essays from './Essays'

// Mock StructuredData to avoid react-helmet-async issues in tests
vi.mock('./StructuredData', () => ({
  default: () => null,
}))

// Mock contentService to return essays data
// Use async factory to properly import actual data
vi.mock('../services/contentService', async () => {
  const essaysData = await vi.importActual<typeof import('../data/essays')>('../data/essays')
  return {
    contentService: {
      getEssays: vi.fn(() => Promise.resolve(essaysData.essays)),
      getPoems: vi.fn(() => Promise.resolve([])),
      getStories: vi.fn(() => Promise.resolve([])),
      getPapers: vi.fn(() => Promise.resolve([])),
    },
  }
})

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
    it('should render all essays from data file', async () => {
      render(<Essays />)

      await waitFor(() => {
        const essayPreviews = screen.getAllByTestId('essay-preview')
        expect(essayPreviews.length).toBeGreaterThanOrEqual(1)
      })
    })

    it('should render essay title as h3', async () => {
      render(<Essays />)

      await waitFor(() => {
        const title = screen.getByRole('heading', { name: /Pardon me while I leak some life onto this page/i, level: 3 })
        expect(title).toBeInTheDocument()
        expect(title).toHaveClass('essay-preview__title')
      })
    })

    it('should render essay excerpt', async () => {
      render(<Essays />)

      await waitFor(() => {
        expect(screen.getByText(/I'm really rather nervous about this/i)).toBeInTheDocument()
      })
    })

    it('should render essay word count', async () => {
      render(<Essays />)

      await waitFor(() => {
        expect(screen.getByText(/730 words/i)).toBeInTheDocument()
      })
    })

    it('should render essay theme', async () => {
      render(<Essays />)

      await waitFor(() => {
        expect(screen.getByText(/Writing, identity, vulnerability, creative process/i)).toBeInTheDocument()
      })
    })

    it('should render essay with unique slug as id', async () => {
      render(<Essays />)

      await waitFor(() => {
        const article = screen.getAllByTestId('essay-preview')[0]
        expect(article).toHaveAttribute('id', 'pardon-me-while-i-leak-some-life-onto-this-page')
      })
    })
  })

  describe('Date Formatting', () => {
    it('should format date correctly (en-US locale)', async () => {
      render(<Essays />)

      await waitFor(() => {
        // Essay dateWritten is '2021-05-14' which may show as May 13 or 14 depending on timezone
        expect(screen.getByText(/May 1[34], 2021/)).toBeInTheDocument()
      })
    })
  })

  describe('Expand/Collapse Functionality', () => {
    it('should initially show essays in collapsed state', async () => {
      render(<Essays />)

      await waitFor(() => {
        const toggleButtons = screen.getAllByRole('button')
        toggleButtons.forEach((button) => {
          expect(button).toHaveTextContent('Read Full Essay')
          expect(button).toHaveAttribute('aria-expanded', 'false')
        })
      })
    })

    it('should expand essay when toggle button is clicked', async () => {
      const user = userEvent.setup()
      render(<Essays />)

      let toggleButtons: HTMLElement[]
      await waitFor(() => {
        toggleButtons = screen.getAllByRole('button')
        expect(toggleButtons.length).toBeGreaterThan(0)
      })

      await user.click(toggleButtons![0])

      expect(toggleButtons![0]).toHaveTextContent('Collapse')
      expect(toggleButtons![0]).toHaveAttribute('aria-expanded', 'true')
    })

    it('should collapse essay when toggle button is clicked again', async () => {
      const user = userEvent.setup()
      render(<Essays />)

      let toggleButtons: HTMLElement[]
      await waitFor(() => {
        toggleButtons = screen.getAllByRole('button')
        expect(toggleButtons.length).toBeGreaterThan(0)
      })

      // Expand
      await user.click(toggleButtons![0])
      expect(toggleButtons![0]).toHaveAttribute('aria-expanded', 'true')

      // Collapse
      await user.click(toggleButtons![0])
      expect(toggleButtons![0]).toHaveAttribute('aria-expanded', 'false')
      expect(toggleButtons![0]).toHaveTextContent('Read Full Essay')
    })

    it('should display full text when expanded', async () => {
      const user = userEvent.setup()
      render(<Essays />)

      let toggleButtons: HTMLElement[]
      await waitFor(() => {
        toggleButtons = screen.getAllByRole('button')
        expect(toggleButtons.length).toBeGreaterThan(0)
      })

      // Text from paragraph 3+ (beyond the 2-paragraph preview) should not be visible initially
      expect(screen.queryByText(/A long time ago maybe, I decided/i)).not.toBeInTheDocument()

      await user.click(toggleButtons![0])

      // Full text (including paragraph 3+) should now be visible
      expect(screen.getByText(/A long time ago maybe, I decided/i)).toBeInTheDocument()
    })

    it('should allow expanding multiple essays simultaneously', async () => {
      const user = userEvent.setup()
      render(<Essays />)

      let toggleButtons: HTMLElement[]
      await waitFor(() => {
        toggleButtons = screen.getAllByRole('button')
        expect(toggleButtons.length).toBeGreaterThan(0)
      })

      // Expand first essay
      await user.click(toggleButtons![0])
      expect(toggleButtons![0]).toHaveAttribute('aria-expanded', 'true')

      // Expand second essay (if exists)
      if (toggleButtons!.length > 1) {
        await user.click(toggleButtons![1])
        expect(toggleButtons![1]).toHaveAttribute('aria-expanded', 'true')

        // First should still be expanded
        expect(toggleButtons![0]).toHaveAttribute('aria-expanded', 'true')
      }
    })
  })

  describe('Accessibility', () => {
    it('should use semantic article elements', async () => {
      render(<Essays />)

      await waitFor(() => {
        const articles = screen.getAllByRole('article')
        expect(articles.length).toBeGreaterThan(0)
      })
    })

    it('should have aria-label on section', () => {
      render(<Essays />)

      const section = screen.getByRole('region', { name: /essays/i })
      expect(section).toHaveAttribute('aria-label', 'Essays')
    })

    it('should have aria-expanded attribute on toggle buttons', async () => {
      render(<Essays />)

      await waitFor(() => {
        const toggleButtons = screen.getAllByRole('button')
        toggleButtons.forEach((button) => {
          expect(button).toHaveAttribute('aria-expanded')
        })
      })
    })

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup()
      render(<Essays />)

      let toggleButtons: HTMLElement[]
      await waitFor(() => {
        toggleButtons = screen.getAllByRole('button')
        expect(toggleButtons.length).toBeGreaterThan(0)
      })

      // Tab to first button
      await user.tab()
      expect(toggleButtons![0]).toHaveFocus()

      // Activate with Enter key
      await user.keyboard('{Enter}')
      expect(toggleButtons![0]).toHaveAttribute('aria-expanded', 'true')
    })

    it('should be activatable with Space key', async () => {
      const user = userEvent.setup()
      render(<Essays />)

      let toggleButtons: HTMLElement[]
      await waitFor(() => {
        toggleButtons = screen.getAllByRole('button')
        expect(toggleButtons.length).toBeGreaterThan(0)
      })

      toggleButtons![0].focus()
      await user.keyboard(' ')

      expect(toggleButtons![0]).toHaveAttribute('aria-expanded', 'true')
    })
  })

  describe('CSS Classes', () => {
    it('should apply essay-preview class to articles', async () => {
      render(<Essays />)

      await waitFor(() => {
        const articles = screen.getAllByTestId('essay-preview')
        articles.forEach((article) => {
          expect(article).toHaveClass('essay-preview')
        })
      })
    })

    it('should apply header classes', () => {
      render(<Essays />)

      expect(document.querySelector('.essays__header')).toBeInTheDocument()
    })

    it('should apply metadata classes', async () => {
      render(<Essays />)

      await waitFor(() => {
        expect(document.querySelector('.essay-preview__metadata')).toBeInTheDocument()
        expect(document.querySelector('.essay-preview__word-count')).toBeInTheDocument()
        expect(document.querySelector('.essay-preview__date')).toBeInTheDocument()
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty essays array gracefully', async () => {
      // Mock contentService to return empty array
      const { contentService } = await import('../services/contentService')
      vi.mocked(contentService.getEssays).mockResolvedValueOnce([])

      render(<Essays />)

      const section = screen.getByRole('region', { name: /essays/i })
      expect(section).toBeInTheDocument()

      // Wait to ensure async load completes
      await waitFor(() => {
        const articles = screen.queryAllByTestId('essay-preview')
        expect(articles).toHaveLength(0)
      })
    })

    it('should render separator between word count and date', async () => {
      render(<Essays />)

      await waitFor(() => {
        const separators = document.querySelectorAll('.essay-preview__separator')
        expect(separators.length).toBeGreaterThanOrEqual(1)
        separators.forEach((separator) => {
          expect(separator.textContent).toBe('•')
        })
      })
    })
  })
})
