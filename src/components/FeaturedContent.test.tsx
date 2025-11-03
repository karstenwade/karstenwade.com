import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import FeaturedContent from './FeaturedContent'

describe('FeaturedContent Component', () => {
  describe('Component Rendering', () => {
    it('should render featured content section', () => {
      render(<FeaturedContent />)

      const section = screen.getByRole('region', { name: /featured content/i })
      expect(section).toBeInTheDocument()
    })

    it('should have proper semantic structure', () => {
      render(<FeaturedContent />)

      const section = screen.getByRole('region')
      expect(section).toHaveClass('featured-content')
    })
  })

  describe('Section Header', () => {
    it('should render section heading', () => {
      render(<FeaturedContent />)

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent(/featured/i)
    })

    it('should have descriptive heading text', () => {
      render(<FeaturedContent />)

      const heading = screen.getByRole('heading', { level: 2 })
      // Should say something like "Featured Work", "Featured Content", etc.
      expect(heading.textContent).toBeTruthy()
      expect(heading.textContent!.length).toBeGreaterThan(5)
    })
  })

  describe('Featured Cards', () => {
    it('should render at least 3 cards', () => {
      render(<FeaturedContent />)

      const cards = screen.getAllByRole('article')
      expect(cards.length).toBeGreaterThanOrEqual(3)
    })

    it('should render no more than 6 cards', () => {
      render(<FeaturedContent />)

      const cards = screen.getAllByRole('article')
      expect(cards.length).toBeLessThanOrEqual(6)
    })

    it('should render cards with data-testid for easy querying', () => {
      render(<FeaturedContent />)

      const featuredCards = screen.getAllByTestId('featured-card')
      expect(featuredCards.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('Card Content from YAML', () => {
    it('should display "The Open Source Way 2.0" paper', () => {
      render(<FeaturedContent />)

      expect(screen.getByText(/The Open Source Way 2.0/i)).toBeInTheDocument()
    })

    it('should display "Introducing CollabX" theory', () => {
      render(<FeaturedContent />)

      expect(screen.getByText(/Introducing CollabX/i)).toBeInTheDocument()
    })

    it('should display "Opening Collaboration" poem', () => {
      render(<FeaturedContent />)

      expect(screen.getByText(/Opening Collaboration/i)).toBeInTheDocument()
    })

    it('should display subheadlines/descriptions', () => {
      render(<FeaturedContent />)

      // From featured.yml subheadlines
      expect(screen.getByText(/Industry-standard handbook for community building/i)).toBeInTheDocument()
      expect(screen.getByText(/framework for measuring collaborative experience/i)).toBeInTheDocument()
    })
  })

  describe('Card Links', () => {
    it('should have clickable links for all cards', () => {
      render(<FeaturedContent />)

      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThanOrEqual(3)
    })

    it('should link to Open Source Way paper', () => {
      render(<FeaturedContent />)

      const link = screen.getByRole('link', { name: /The Open Source Way 2.0/i })
      expect(link).toHaveAttribute('href')
      expect(link.getAttribute('href')).toContain('open-source-way')
    })

    it('should link to CollabX theory', () => {
      render(<FeaturedContent />)

      const link = screen.getByRole('link', { name: /Introducing CollabX/i })
      expect(link).toHaveAttribute('href')
      expect(link.getAttribute('href')).toContain('collab')
    })

    it('should link to Opening Collaboration poem', () => {
      render(<FeaturedContent />)

      // The link accessible name comes from the card title "Latest Poetry"
      const link = screen.getByRole('link', { name: /Latest Poetry/i })
      expect(link).toHaveAttribute('href')
      expect(link.getAttribute('href')).toContain('opening-collaboration')
    })
  })

  describe('Responsive Layout', () => {
    it('should use cards-grid class for layout', () => {
      render(<FeaturedContent />)

      const grid = document.querySelector('.cards-grid')
      expect(grid).toBeInTheDocument()
    })

    it('should contain Card components in grid', () => {
      render(<FeaturedContent />)

      const cards = screen.getAllByRole('article')
      const grid = document.querySelector('.cards-grid')

      expect(grid).toContainElement(cards[0])
    })
  })

  describe('CSS Classes', () => {
    it('should apply base featured-content class', () => {
      render(<FeaturedContent />)

      const section = screen.getByRole('region')
      expect(section).toHaveClass('featured-content')
    })

    it('should accept custom className prop', () => {
      render(<FeaturedContent className="home-featured" />)

      const section = screen.getByRole('region')
      expect(section).toHaveClass('featured-content')
      expect(section).toHaveClass('home-featured')
    })
  })

  describe('Accessibility', () => {
    it('should use region role with aria-label', () => {
      render(<FeaturedContent />)

      const region = screen.getByRole('region', { name: /featured/i })
      expect(region).toHaveAttribute('aria-label')
    })

    it('should have proper heading hierarchy', () => {
      render(<FeaturedContent />)

      // Should have h2 for section heading
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toBeInTheDocument()
    })

    it('should have accessible card components', () => {
      render(<FeaturedContent />)

      const cards = screen.getAllByRole('article')
      cards.forEach(card => {
        expect(card).toBeInTheDocument()
      })
    })
  })

  describe('Data Loading', () => {
    it('should load content from featured.yml data', () => {
      render(<FeaturedContent />)

      // Verify we're displaying actual data from YAML
      const cards = screen.getAllByTestId('featured-card')

      // Should have exactly 3 items as defined in featured.yml max_featured
      expect(cards.length).toBe(3)
    })

    it('should respect priority order from YAML', () => {
      render(<FeaturedContent />)

      const cards = screen.getAllByTestId('featured-card')

      // First card should be priority 1 (Open Source Way)
      expect(cards[0]).toHaveTextContent(/The Open Source Way 2.0/i)

      // Second card should be priority 2 (CollabX)
      expect(cards[1]).toHaveTextContent(/Introducing CollabX/i)

      // Third card should be priority 3 (Opening Collaboration)
      expect(cards[2]).toHaveTextContent(/Opening Collaboration/i)
    })
  })

  describe('Props Interface', () => {
    it('should render without any props (using defaults)', () => {
      render(<FeaturedContent />)

      expect(screen.getByRole('region')).toBeInTheDocument()
      expect(screen.getAllByRole('article').length).toBeGreaterThanOrEqual(3)
    })

    it('should accept className prop', () => {
      render(<FeaturedContent className="custom-featured" />)

      const section = screen.getByRole('region')
      expect(section).toHaveClass('custom-featured')
    })
  })

  describe('Integration with Card Component', () => {
    it('should use Card component for each featured item', () => {
      render(<FeaturedContent />)

      // Each card should have the Card component structure
      const cards = screen.getAllByRole('article')

      cards.forEach(card => {
        expect(card).toHaveClass('card')
      })
    })

    it('should pass correct props to Card components', () => {
      render(<FeaturedContent />)

      // Check that cards have headings (title prop)
      const headings = screen.getAllByRole('heading', { level: 3 })
      expect(headings.length).toBeGreaterThanOrEqual(3)

      // Check that cards have links (link prop)
      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThanOrEqual(3)
    })
  })
})
