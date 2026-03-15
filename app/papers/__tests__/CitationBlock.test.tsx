/**
 * CitationBlock Component Tests
 * Story 16.7b: Add citation and structured data
 *
 * RED PHASE: Tests for multiple citation formats and DOI display.
 *
 * Requirements:
 * - Display citations in APA, MLA, and BibTeX formats
 * - Allow switching between formats via tabs
 * - Copy citation functionality for each format
 * - Display DOI when available
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import CitationBlock from '../../components/CitationBlock'
import type { Paper } from '@/data/papers'

const mockPaper: Paper = {
  slug: 'test-paper',
  title: 'Test Paper Title',
  description: 'Test description',
  abstract: 'This is a test abstract for the paper.',
  externalUrl: 'https://github.com/karstenwade/papers/blob/main/test.md',
  repository: 'https://github.com/karstenwade/papers',
  publicationDate: '2025-01-15',
  lastUpdated: '2025-02-20',
  version: '1.2',
  category: 'Test Category',
  tags: ['test', 'example', 'vitest'],
  featured: true,
}

const mockPaperWithDoi: Paper = {
  ...mockPaper,
  doi: '10.1234/example.2025.001',
}

describe('CitationBlock Component', () => {
  beforeEach(() => {
    // Mock clipboard API for copy tests
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      writable: true,
      configurable: true,
    })
  })

  describe('Format tabs', () => {
    it('renders format selector tabs', () => {
      render(<CitationBlock paper={mockPaper} author="Karsten Wade" />)

      expect(screen.getByRole('tab', { name: /APA/i })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /MLA/i })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /BibTeX/i })).toBeInTheDocument()
    })

    it('defaults to APA format', () => {
      render(<CitationBlock paper={mockPaper} author="Karsten Wade" />)

      const apaTab = screen.getByRole('tab', { name: /APA/i })
      expect(apaTab).toHaveAttribute('aria-selected', 'true')
    })

    it('switches to MLA format when MLA tab is clicked', async () => {
      const user = userEvent.setup()
      render(<CitationBlock paper={mockPaper} author="Karsten Wade" />)

      await user.click(screen.getByRole('tab', { name: /MLA/i }))

      const mlaTab = screen.getByRole('tab', { name: /MLA/i })
      expect(mlaTab).toHaveAttribute('aria-selected', 'true')
    })

    it('switches to BibTeX format when BibTeX tab is clicked', async () => {
      const user = userEvent.setup()
      render(<CitationBlock paper={mockPaper} author="Karsten Wade" />)

      await user.click(screen.getByRole('tab', { name: /BibTeX/i }))

      const bibtexTab = screen.getByRole('tab', { name: /BibTeX/i })
      expect(bibtexTab).toHaveAttribute('aria-selected', 'true')
    })
  })

  describe('APA format', () => {
    it('displays citation in APA format', () => {
      render(<CitationBlock paper={mockPaper} author="Karsten Wade" />)

      const citationPanel = screen.getByRole('tabpanel')
      // APA format: Author, F. (Year). Title. URL
      expect(within(citationPanel).getByText(/Wade, K\./)).toBeInTheDocument()
      expect(within(citationPanel).getByText(/\(2025\)/)).toBeInTheDocument()
      expect(within(citationPanel).getByText(/Test Paper Title/)).toBeInTheDocument()
    })

    it('includes DOI in APA format when available', () => {
      render(<CitationBlock paper={mockPaperWithDoi} author="Karsten Wade" />)

      const citationPanel = screen.getByRole('tabpanel')
      expect(within(citationPanel).getByText(/doi\.org\/10\.1234/)).toBeInTheDocument()
    })
  })

  describe('MLA format', () => {
    it('displays citation in MLA format', async () => {
      const user = userEvent.setup()
      render(<CitationBlock paper={mockPaper} author="Karsten Wade" />)

      await user.click(screen.getByRole('tab', { name: /MLA/i }))

      const citationPanel = screen.getByRole('tabpanel')
      // MLA format: Author. "Title." Website, Publisher, Date, URL.
      expect(within(citationPanel).getByText(/Wade, Karsten/)).toBeInTheDocument()
      expect(within(citationPanel).getByText(/"Test Paper Title\."/)).toBeInTheDocument()
    })

    it('includes DOI in MLA format when available', async () => {
      const user = userEvent.setup()
      render(<CitationBlock paper={mockPaperWithDoi} author="Karsten Wade" />)

      await user.click(screen.getByRole('tab', { name: /MLA/i }))

      const citationPanel = screen.getByRole('tabpanel')
      expect(within(citationPanel).getByText(/doi\.org\/10\.1234/)).toBeInTheDocument()
    })
  })

  describe('BibTeX format', () => {
    it('displays citation in BibTeX format', async () => {
      const user = userEvent.setup()
      render(<CitationBlock paper={mockPaper} author="Karsten Wade" />)

      await user.click(screen.getByRole('tab', { name: /BibTeX/i }))

      const citationPanel = screen.getByRole('tabpanel')
      // BibTeX format: @article{key, author = {...}, title = {...}, ...}
      expect(within(citationPanel).getByText(/@article\{/)).toBeInTheDocument()
      expect(within(citationPanel).getByText(/author\s*=/)).toBeInTheDocument()
      expect(within(citationPanel).getByText(/title\s*=/)).toBeInTheDocument()
      expect(within(citationPanel).getByText(/year\s*=/)).toBeInTheDocument()
    })

    it('includes DOI field in BibTeX when available', async () => {
      const user = userEvent.setup()
      render(<CitationBlock paper={mockPaperWithDoi} author="Karsten Wade" />)

      await user.click(screen.getByRole('tab', { name: /BibTeX/i }))

      const citationPanel = screen.getByRole('tabpanel')
      expect(within(citationPanel).getByText(/doi\s*=/)).toBeInTheDocument()
    })

    it('uses paper slug as BibTeX key', async () => {
      const user = userEvent.setup()
      render(<CitationBlock paper={mockPaper} author="Karsten Wade" />)

      await user.click(screen.getByRole('tab', { name: /BibTeX/i }))

      const citationPanel = screen.getByRole('tabpanel')
      // Key format: lastname + year + first word of slug
      expect(within(citationPanel).getByText(/wade2025test/i)).toBeInTheDocument()
    })
  })

  describe('Copy functionality', () => {
    it('provides a copy button', () => {
      render(<CitationBlock paper={mockPaper} author="Karsten Wade" />)

      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
    })

    it('copies APA citation when in APA tab', async () => {
      const user = userEvent.setup()
      render(<CitationBlock paper={mockPaper} author="Karsten Wade" />)

      // Verify the APA citation is displayed in the panel
      const citationPanel = screen.getByRole('tabpanel')
      expect(within(citationPanel).getByText(/Wade, K\./)).toBeInTheDocument()
      expect(within(citationPanel).getByText(/\(2025\)/)).toBeInTheDocument()

      // Clicking copy triggers the copy action (verified by UI state change)
      await user.click(screen.getByRole('button', { name: /copy/i }))
      expect(await screen.findByText(/copied/i)).toBeInTheDocument()
    })

    it('copies MLA citation when in MLA tab', async () => {
      const user = userEvent.setup()
      render(<CitationBlock paper={mockPaper} author="Karsten Wade" />)

      await user.click(screen.getByRole('tab', { name: /MLA/i }))

      // Verify the MLA citation is displayed in the panel
      const citationPanel = screen.getByRole('tabpanel')
      expect(within(citationPanel).getByText(/Wade, Karsten/)).toBeInTheDocument()

      // Clicking copy triggers the copy action
      await user.click(screen.getByRole('button', { name: /copy/i }))
      expect(await screen.findByText(/copied/i)).toBeInTheDocument()
    })

    it('copies BibTeX citation when in BibTeX tab', async () => {
      const user = userEvent.setup()
      render(<CitationBlock paper={mockPaper} author="Karsten Wade" />)

      await user.click(screen.getByRole('tab', { name: /BibTeX/i }))

      // Verify the BibTeX citation is displayed in the panel
      const citationPanel = screen.getByRole('tabpanel')
      expect(within(citationPanel).getByText(/@article\{/)).toBeInTheDocument()

      // Clicking copy triggers the copy action
      await user.click(screen.getByRole('button', { name: /copy/i }))
      expect(await screen.findByText(/copied/i)).toBeInTheDocument()
    })

    it('shows copied confirmation', async () => {
      const user = userEvent.setup()
      render(<CitationBlock paper={mockPaper} author="Karsten Wade" />)

      await user.click(screen.getByRole('button', { name: /copy/i }))

      expect(screen.getByText(/copied/i)).toBeInTheDocument()
    })
  })

  describe('DOI display', () => {
    it('displays DOI when available', () => {
      render(<CitationBlock paper={mockPaperWithDoi} author="Karsten Wade" />)

      expect(screen.getByText(/DOI:/i)).toBeInTheDocument()
      // DOI appears in both header link and citation, use link to be specific
      expect(screen.getByRole('link', { name: /10\.1234\/example\.2025\.001/ })).toBeInTheDocument()
    })

    it('renders DOI as a clickable link', () => {
      render(<CitationBlock paper={mockPaperWithDoi} author="Karsten Wade" />)

      const doiLink = screen.getByRole('link', { name: /10\.1234\/example\.2025\.001/ })
      expect(doiLink).toHaveAttribute('href', 'https://doi.org/10.1234/example.2025.001')
    })

    it('does not display DOI section when not available', () => {
      render(<CitationBlock paper={mockPaper} author="Karsten Wade" />)

      expect(screen.queryByText(/DOI:/i)).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('uses proper tablist/tab/tabpanel structure', () => {
      render(<CitationBlock paper={mockPaper} author="Karsten Wade" />)

      expect(screen.getByRole('tablist')).toBeInTheDocument()
      expect(screen.getAllByRole('tab')).toHaveLength(3)
      expect(screen.getByRole('tabpanel')).toBeInTheDocument()
    })

    it('has accessible labels for tabs', () => {
      render(<CitationBlock paper={mockPaper} author="Karsten Wade" />)

      const tablist = screen.getByRole('tablist')
      expect(tablist).toHaveAttribute('aria-label')
    })

    it('is hidden in print mode', () => {
      render(<CitationBlock paper={mockPaper} author="Karsten Wade" />)

      const citationBlock = screen.getByTestId('citation-block')
      expect(citationBlock).toHaveClass('print:hidden')
    })
  })
})
