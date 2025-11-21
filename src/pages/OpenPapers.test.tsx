import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import OpenPapers from './OpenPapers'
import * as papersData from '../data/papers'

// Mock contentService to return papers data
vi.mock('../services/contentService', () => ({
  contentService: {
    getPapers: vi.fn(async () => papersData.papers),
    getEssays: vi.fn(async () => []),
    getPoems: vi.fn(async () => []),
    getStories: vi.fn(async () => []),
  },
}))

// Mock StructuredData component
vi.mock('../components/StructuredData', () => ({
  default: () => null,
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('OpenPapers Page', () => {
  describe('Page Rendering', () => {
    it('should render open papers page', () => {
      render(<OpenPapers />)

      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('should have correct semantic structure', () => {
      render(<OpenPapers />)

      const main = screen.getByRole('main')
      expect(main).toHaveClass('open-papers')
    })
  })

  describe('Page Header', () => {
    it('should render page heading', () => {
      render(<OpenPapers />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent(/Open Papers/i)
    })

    it('should render page description', () => {
      render(<OpenPapers />)

      const description = screen.getByText(/research papers/i)
      expect(description).toBeInTheDocument()
    })

    it('should mention external repository', () => {
      render(<OpenPapers />)

      // The repository name appears in a link element
      expect(screen.getByText(/karstenwade\/papers/i)).toBeInTheDocument()
    })
  })

  describe('Paper Cards', () => {
    it('should render at least one paper card', async () => {
      render(<OpenPapers />)

      await waitFor(() => {
        const cards = screen.getAllByRole('article')
        expect(cards.length).toBeGreaterThanOrEqual(1)
      })
    })

    it('should use Card component for papers', async () => {
      render(<OpenPapers />)

      await waitFor(() => {
        const cards = screen.getAllByRole('article')
        cards.forEach(card => {
          expect(card).toHaveClass('card')
        })
      })
    })
  })

  describe('Paper Content', () => {
    it('should display "The Open Source Way 2.0" paper', async () => {
      render(<OpenPapers />)

      await waitFor(() => {
        expect(screen.getByText(/The Open Source Way 2.0/i)).toBeInTheDocument()
      })
    })

    it('should display paper descriptions', async () => {
      render(<OpenPapers />)

      await waitFor(() => {
        expect(screen.getByText(/Comprehensive guide to building and managing/i)).toBeInTheDocument()
      })
    })
  })

  describe('External Links', () => {
    it('should have links to external GitHub repository', () => {
      render(<OpenPapers />)

      const links = screen.getAllByRole('link')
      const githubLinks = links.filter(link =>
        link.getAttribute('href')?.includes('github.com/karstenwade/papers')
      )

      expect(githubLinks.length).toBeGreaterThanOrEqual(1)
    })

    it('should link to Open Source Way 2.0 on GitHub', () => {
      render(<OpenPapers />)

      const link = screen.getByRole('link', { name: /The Open Source Way 2.0/i })
      expect(link).toHaveAttribute('href')
      expect(link.getAttribute('href')).toContain('github.com/karstenwade/papers')
    })

    it('should have external link indicators', () => {
      render(<OpenPapers />)

      // External links should have target="_blank" and rel="noopener noreferrer"
      const links = screen.getAllByRole('link')
      const externalLinks = links.filter(link =>
        link.getAttribute('href')?.includes('github.com')
      )

      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })
  })

  describe('Responsive Layout', () => {
    it('should use cards-grid layout', () => {
      render(<OpenPapers />)

      const grid = document.querySelector('.cards-grid')
      expect(grid).toBeInTheDocument()
    })

    it('should contain paper cards in grid', () => {
      render(<OpenPapers />)

      const cards = screen.getAllByRole('article')
      const grid = document.querySelector('.cards-grid')

      expect(grid).toContainElement(cards[0])
    })
  })

  describe('CSS Classes', () => {
    it('should apply base open-papers class', () => {
      render(<OpenPapers />)

      const main = screen.getByRole('main')
      expect(main).toHaveClass('open-papers')
    })

    it('should accept custom className prop', () => {
      render(<OpenPapers className="custom-papers-page" />)

      const main = screen.getByRole('main')
      expect(main).toHaveClass('open-papers')
      expect(main).toHaveClass('custom-papers-page')
    })
  })

  describe('Accessibility', () => {
    it('should use main landmark', () => {
      render(<OpenPapers />)

      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('should have h1 as page heading', () => {
      render(<OpenPapers />)

      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()
    })

    it('should have accessible external link indicators', () => {
      render(<OpenPapers />)

      // External links should have aria-label or screen reader text
      const externalLinks = screen.getAllByRole('link').filter(link =>
        link.getAttribute('href')?.includes('github.com')
      )

      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank')
      })
    })
  })

  describe('Repository Link', () => {
    it('should have link to papers repository', () => {
      render(<OpenPapers />)

      const repoLink = screen.getByRole('link', { name: /karstenwade\/papers/i })
      expect(repoLink).toHaveAttribute('href', 'https://github.com/karstenwade/papers')
      expect(repoLink).toHaveAttribute('target', '_blank')
    })
  })

  describe('Data Loading', () => {
    it('should load papers from papers data', async () => {
      render(<OpenPapers />)

      await waitFor(() => {
        // Should display papers from papers.ts
        const cards = screen.getAllByRole('article')
        expect(cards.length).toBeGreaterThanOrEqual(1)
      })
    })
  })

  describe('Props Interface', () => {
    it('should render without any props (using defaults)', () => {
      render(<OpenPapers />)

      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('should accept className prop', () => {
      render(<OpenPapers className="research-page" />)

      const main = screen.getByRole('main')
      expect(main).toHaveClass('research-page')
    })
  })
})
