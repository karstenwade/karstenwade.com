import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PoetryList from '../PoetryList'
import type { Poem } from '@/data/poetry'

describe('PoetryList', () => {
  // Test poem with intentional whitespace - indentation is critical for poetry
  const poemWithIndentation: Poem = {
    slug: 'indented-poem',
    title: 'Poem with Indentation',
    excerpt: 'Line one\n     Indented line two\nLine three',
    fullText: 'Line one\n     Indented line two\nLine three\n\nStanza two line one\n     Stanza two indented',
    firstLine: 'Line one',
    dateWritten: '2024-01-01',
    form: 'Free Verse',
    theme: 'Test',
    tags: ['test'],
    featured: false,
  }

  const poemWithStanzaBreaks: Poem = {
    slug: 'stanza-breaks',
    title: 'Poem with Stanza Breaks',
    excerpt: 'First stanza line\n\nSecond stanza line',
    fullText: 'First stanza line\n\nSecond stanza line\n\nThird stanza line',
    firstLine: 'First stanza line',
    dateWritten: '2024-01-01',
    form: 'Free Verse',
    theme: 'Test',
    tags: ['test'],
    featured: false,
  }

  describe('Whitespace Preservation', () => {
    it('should have whitespace-pre-wrap CSS class on poem lines for excerpt', () => {
      render(<PoetryList poems={[poemWithIndentation]} />)

      const poemLines = document.querySelectorAll('.poem-line')
      expect(poemLines.length).toBeGreaterThan(0)

      poemLines.forEach((line) => {
        expect(line).toHaveClass('whitespace-pre-wrap')
      })
    })

    it('should have whitespace-pre-wrap CSS class on poem lines for full text', () => {
      render(<PoetryList poems={[poemWithIndentation]} />)

      // Expand the poem to show full text
      const expandButton = screen.getByRole('button', { name: /read full poem/i })
      fireEvent.click(expandButton)

      const poemLines = document.querySelectorAll('.poem-line')
      expect(poemLines.length).toBeGreaterThan(3) // More lines after expansion

      poemLines.forEach((line) => {
        expect(line).toHaveClass('whitespace-pre-wrap')
      })
    })

    it('should preserve leading spaces in indented poem lines', () => {
      render(<PoetryList poems={[poemWithIndentation]} />)

      // Find the indented line in the excerpt
      const poemLines = document.querySelectorAll('.poem-line')
      const indentedLine = Array.from(poemLines).find(
        (line) => line.textContent?.includes('Indented line two')
      )

      expect(indentedLine).toBeDefined()
      // The text content should start with spaces (preserved whitespace)
      expect(indentedLine?.textContent).toMatch(/^\s{5}Indented line two/)
    })

    it('should preserve leading spaces in full text when expanded', () => {
      render(<PoetryList poems={[poemWithIndentation]} />)

      // Expand the poem
      const expandButton = screen.getByRole('button', { name: /read full poem/i })
      fireEvent.click(expandButton)

      const fullTextSection = document.querySelector('.poem-preview__full-text')
      expect(fullTextSection).toBeInTheDocument()

      const poemLines = fullTextSection?.querySelectorAll('.poem-line')
      const indentedLine = Array.from(poemLines || []).find(
        (line) => line.textContent?.includes('Stanza two indented')
      )

      expect(indentedLine).toBeDefined()
      // The text content should start with spaces (preserved whitespace)
      expect(indentedLine?.textContent).toMatch(/^\s{5}Stanza two indented/)
    })

    it('should render empty lines (stanza breaks) as non-breaking spaces', () => {
      render(<PoetryList poems={[poemWithStanzaBreaks]} />)

      const poemLines = document.querySelectorAll('.poem-line')

      // Find the empty line (stanza break) - should contain non-breaking space
      const emptyLine = Array.from(poemLines).find((line) => {
        const text = line.textContent || ''
        // Should either be empty or contain non-breaking space character
        return text.trim() === '' || text === '\u00A0'
      })

      expect(emptyLine).toBeDefined()
    })

    it('should have min-height for proper line spacing', () => {
      render(<PoetryList poems={[poemWithIndentation]} />)

      const poemLines = document.querySelectorAll('.poem-line')
      poemLines.forEach((line) => {
        expect(line).toHaveClass('min-h-[1.75em]')
      })
    })
  })

  describe('Poem Rendering', () => {
    it('should render poem title', () => {
      render(<PoetryList poems={[poemWithIndentation]} />)

      expect(screen.getByText('Poem with Indentation')).toBeInTheDocument()
    })

    it('should render poem form and date', () => {
      render(<PoetryList poems={[poemWithIndentation]} />)

      expect(screen.getByText('Free Verse')).toBeInTheDocument()
    })

    it('should render poem theme', () => {
      render(<PoetryList poems={[poemWithIndentation]} />)

      expect(screen.getByText('Test')).toBeInTheDocument()
    })

    it('should toggle between collapsed and expanded states', () => {
      render(<PoetryList poems={[poemWithIndentation]} />)

      // Initially collapsed
      expect(screen.queryByText(/Stanza two/)).not.toBeInTheDocument()

      // Click to expand
      const expandButton = screen.getByRole('button', { name: /read full poem/i })
      fireEvent.click(expandButton)

      // Now expanded
      expect(screen.getByText(/Stanza two line one/)).toBeInTheDocument()

      // Click to collapse
      const collapseButton = screen.getByRole('button', { name: /collapse/i })
      fireEvent.click(collapseButton)

      // Back to collapsed
      expect(screen.queryByText(/Stanza two line one/)).not.toBeInTheDocument()
    })

    it('should have correct aria-expanded attribute on toggle button', () => {
      render(<PoetryList poems={[poemWithIndentation]} />)

      const button = screen.getByRole('button', { name: /read full poem/i })
      expect(button).toHaveAttribute('aria-expanded', 'false')

      fireEvent.click(button)
      expect(button).toHaveAttribute('aria-expanded', 'true')
    })
  })

  describe('Multiple Poems', () => {
    it('should render multiple poems correctly', () => {
      render(<PoetryList poems={[poemWithIndentation, poemWithStanzaBreaks]} />)

      expect(screen.getByText('Poem with Indentation')).toBeInTheDocument()
      expect(screen.getByText('Poem with Stanza Breaks')).toBeInTheDocument()
    })

    it('should expand poems independently', () => {
      render(<PoetryList poems={[poemWithIndentation, poemWithStanzaBreaks]} />)

      const buttons = screen.getAllByRole('button', { name: /read full poem/i })
      expect(buttons).toHaveLength(2)

      // Expand only the first poem
      fireEvent.click(buttons[0])

      // First poem expanded, second still collapsed
      expect(screen.getByText(/Stanza two line one/)).toBeInTheDocument()
      expect(screen.queryByText('Third stanza line')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have section with correct aria-label', () => {
      render(<PoetryList poems={[poemWithIndentation]} />)

      const section = screen.getByRole('region', { name: /poetry/i })
      expect(section).toBeInTheDocument()
    })

    it('should render poems as articles', () => {
      render(<PoetryList poems={[poemWithIndentation]} />)

      const article = screen.getByRole('article')
      expect(article).toBeInTheDocument()
    })

    it('should have data-testid on poem previews', () => {
      render(<PoetryList poems={[poemWithIndentation]} />)

      const preview = screen.getByTestId('poem-preview')
      expect(preview).toBeInTheDocument()
    })
  })
})
