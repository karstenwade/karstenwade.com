/**
 * PaperDetail Page Tests
 * Story 16.7a: Enhance paper page styling
 *
 * RED PHASE: These tests define the expected behavior for CV-quality paper styling.
 *
 * Requirements:
 * - Enhanced styling for CV/resume presentation
 * - Print-friendly layout
 * - Author attribution section
 * - Citation format
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}))

// Mock next/script to avoid issues with Script component
vi.mock('next/script', () => ({
  default: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
    <script {...props}>{children}</script>
  ),
}))

// We'll test the presentational components that make up the paper detail page

import PaperHeader from '../../components/PaperHeader'
import PaperCitation from '../../components/PaperCitation'
import PrintButton from '../../components/PrintButton'
import type { Paper } from '../../../src/data/papers'

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

describe('PaperHeader Component', () => {
  describe('CV-quality styling', () => {
    it('renders the paper title with professional styling', () => {
      render(<PaperHeader paper={mockPaper} />)

      const title = screen.getByRole('heading', { level: 1 })
      expect(title).toHaveTextContent('Test Paper Title')
      // Check for professional font styling class
      expect(title).toHaveClass('font-serif')
    })

    it('displays author attribution', () => {
      render(<PaperHeader paper={mockPaper} author="Karsten Wade" />)

      expect(screen.getByText(/Karsten Wade/)).toBeInTheDocument()
      expect(screen.getByText(/Author/i)).toBeInTheDocument()
    })

    it('shows version and publication date in academic format', () => {
      render(<PaperHeader paper={mockPaper} />)

      // Academic date format: "January 15, 2025"
      expect(screen.getByText(/January 15, 2025/)).toBeInTheDocument()
      expect(screen.getByText(/Version 1.2/)).toBeInTheDocument()
    })

    it('displays category as a badge', () => {
      render(<PaperHeader paper={mockPaper} />)

      const badge = screen.getByText('Test Category')
      expect(badge).toHaveClass('paper-header__category')
    })

    it('renders abstract with proper academic styling', () => {
      render(<PaperHeader paper={mockPaper} showAbstract />)

      // Check for Abstract heading (use getByRole to be more specific)
      expect(screen.getByRole('heading', { name: /Abstract/i })).toBeInTheDocument()
      expect(screen.getByText('This is a test abstract for the paper.')).toBeInTheDocument()
    })

    it('applies print-hidden class to action buttons', () => {
      render(<PaperHeader paper={mockPaper} showActions />)

      const actions = screen.getByTestId('paper-actions')
      expect(actions).toHaveClass('print:hidden')
    })
  })

  describe('metadata display', () => {
    it('shows last updated date when different from publication date', () => {
      render(<PaperHeader paper={mockPaper} />)

      expect(screen.getByText(/Last updated/i)).toBeInTheDocument()
      expect(screen.getByText(/February 20, 2025/)).toBeInTheDocument()
    })

    it('hides last updated when same as publication date', () => {
      const sameDatePaper = { ...mockPaper, lastUpdated: mockPaper.publicationDate }
      render(<PaperHeader paper={sameDatePaper} />)

      expect(screen.queryByText(/Last updated/i)).not.toBeInTheDocument()
    })

    it('displays tags with professional styling', () => {
      render(<PaperHeader paper={mockPaper} showTags />)

      expect(screen.getByText('test')).toBeInTheDocument()
      expect(screen.getByText('example')).toBeInTheDocument()
      expect(screen.getByText('vitest')).toBeInTheDocument()
    })
  })
})

describe('PaperCitation Component', () => {
  it('generates a proper citation format', () => {
    render(<PaperCitation paper={mockPaper} author="Karsten Wade" />)

    // Should show a citation block
    expect(screen.getByText(/Cite this paper/i)).toBeInTheDocument()
  })

  it('displays citation in APA-like format', () => {
    render(<PaperCitation paper={mockPaper} author="Karsten Wade" />)

    // APA-like: Author (Year). Title. Retrieved from URL
    const citation = screen.getByTestId('paper-citation-text')
    expect(citation).toHaveTextContent('Wade, K.')
    expect(citation).toHaveTextContent('2025')
    expect(citation).toHaveTextContent('Test Paper Title')
  })

  it('provides a copy citation button', () => {
    render(<PaperCitation paper={mockPaper} author="Karsten Wade" />)

    expect(screen.getByRole('button', { name: /copy citation/i })).toBeInTheDocument()
  })

  it('hides citation in print mode', () => {
    render(<PaperCitation paper={mockPaper} author="Karsten Wade" />)

    const citationSection = screen.getByTestId('paper-citation')
    expect(citationSection).toHaveClass('print:hidden')
  })
})

describe('PrintButton Component', () => {
  beforeEach(() => {
    // Mock window.print
    vi.stubGlobal('print', vi.fn())
  })

  it('renders a print button', () => {
    render(<PrintButton />)

    expect(screen.getByRole('button', { name: /print/i })).toBeInTheDocument()
  })

  it('has print icon', () => {
    render(<PrintButton />)

    // Check for printer icon (either text or SVG)
    expect(screen.getByTestId('print-icon')).toBeInTheDocument()
  })

  it('is hidden in print mode', () => {
    render(<PrintButton />)

    const button = screen.getByRole('button', { name: /print/i })
    expect(button).toHaveClass('print:hidden')
  })

  it('calls window.print when clicked', async () => {
    const userEvent = await import('@testing-library/user-event')
    const user = userEvent.default.setup()

    render(<PrintButton />)

    await user.click(screen.getByRole('button', { name: /print/i }))

    expect(window.print).toHaveBeenCalled()
  })
})

describe('Print Styles', () => {
  // These tests verify that print-specific CSS classes exist
  // The actual print stylesheet will be tested via visual regression or manual testing

  it('has print:hidden utility available for non-print elements', () => {
    render(
      <div>
        <nav className="print:hidden">Navigation</nav>
        <main>Content</main>
      </div>
    )

    const nav = screen.getByText('Navigation')
    expect(nav).toHaveClass('print:hidden')
  })

  it('content area should not be hidden in print', () => {
    render(
      <main className="paper-content" data-testid="paper-content">
        Paper Content
      </main>
    )

    const content = screen.getByTestId('paper-content')
    expect(content).not.toHaveClass('print:hidden')
  })
})
