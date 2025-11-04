import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Theories from './Theories'

describe('Theories Page', () => {
  describe('Page Rendering', () => {
    it('should render theories page', () => {
      render(<Theories />)

      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('should have correct semantic structure', () => {
      render(<Theories />)

      const main = screen.getByRole('main')
      expect(main).toHaveClass('theories')
    })
  })

  describe('Page Header', () => {
    it('should render page heading', () => {
      render(<Theories />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent(/Theories & Frameworks/i)
    })

    it('should render page description', () => {
      render(<Theories />)

      const description = screen.getByText(/frameworks for understanding/i)
      expect(description).toBeInTheDocument()
    })
  })

  describe('Theory Cards', () => {
    it('should render at least one theory card', () => {
      render(<Theories />)

      const cards = screen.getAllByRole('article')
      expect(cards.length).toBeGreaterThanOrEqual(1)
    })

    it('should display CollabX framework', () => {
      render(<Theories />)

      expect(screen.getByText(/CollabX: The Collaborative Experience Framework/i)).toBeInTheDocument()
    })

    it('should display ContribX framework', () => {
      render(<Theories />)

      expect(screen.getByText(/ContribX: The Contributor Experience Framework/i)).toBeInTheDocument()
    })

    it('should use article element for each theory', () => {
      render(<Theories />)

      const articles = screen.getAllByRole('article')
      expect(articles.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Theory Content', () => {
    it('should display framework names', () => {
      render(<Theories />)

      const frameworkNames = screen.getAllByText(/CollabX \(Collaborative Experience\)/i)
      expect(frameworkNames.length).toBeGreaterThanOrEqual(1)

      const contribNames = screen.getAllByText(/ContribX \(Contributor Experience\)/i)
      expect(contribNames.length).toBeGreaterThanOrEqual(1)
    })

    it('should display short descriptions', () => {
      render(<Theories />)

      expect(screen.getByText(/human, cultural aspects of collaboration/i)).toBeInTheDocument()
      expect(screen.getByText(/technical and process aspects of contribution/i)).toBeInTheDocument()
    })

    it('should display key concepts section', () => {
      render(<Theories />)

      const keyConcepts = screen.getAllByText(/key concepts/i)
      expect(keyConcepts.length).toBeGreaterThanOrEqual(2)
    })

    it('should display key concept items', () => {
      render(<Theories />)

      // Use more specific text that's unique to the list items
      expect(screen.getByText(/Sense of belonging - How welcome do contributors feel\?/i)).toBeInTheDocument()
      expect(screen.getByText(/Communication quality - Are conversations respectful/i)).toBeInTheDocument()
    })

    it('should display applications section', () => {
      render(<Theories />)

      const applications = screen.getAllByText(/applications/i)
      expect(applications.length).toBeGreaterThanOrEqual(2)
    })

    it('should display application items', () => {
      render(<Theories />)

      expect(screen.getByText(/Diagnose sources of community friction/i)).toBeInTheDocument()
      expect(screen.getByText(/Improve team dynamics and psychological safety/i)).toBeInTheDocument()
    })
  })

  describe('Related Frameworks', () => {
    it('should display related frameworks section', () => {
      render(<Theories />)

      const relatedSections = screen.getAllByText(/related frameworks/i)
      expect(relatedSections.length).toBeGreaterThanOrEqual(1)
    })

    it('should have links to related frameworks', () => {
      render(<Theories />)

      const collabXLink = screen.getByRole('link', { name: /CollabX/i })
      expect(collabXLink).toHaveAttribute('href', '/theories/collab-x')

      const contribXLink = screen.getByRole('link', { name: /ContribX/i })
      expect(contribXLink).toHaveAttribute('href', '/theories/contrib-x')
    })

    it('should describe relationship between frameworks', () => {
      render(<Theories />)

      const orthogonalRefs = screen.getAllByText(/orthogonal/i)
      expect(orthogonalRefs.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Metadata', () => {
    it('should display framework version', () => {
      render(<Theories />)

      const versions = screen.getAllByText(/version 1\.0/i)
      expect(versions.length).toBeGreaterThanOrEqual(2)
    })

    it('should display date introduced', () => {
      render(<Theories />)

      const dates = screen.getAllByText(/2022/i)
      expect(dates.length).toBeGreaterThanOrEqual(2)
    })

    it('should display tags', () => {
      render(<Theories />)

      expect(screen.getAllByText(/Framework/i).length).toBeGreaterThanOrEqual(2)
      expect(screen.getAllByText(/Community/i).length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText(/Developer Experience/i).length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('External Links', () => {
    it('should have links to framework papers', () => {
      render(<Theories />)

      const paperLinks = screen.getAllByRole('link', { name: /read paper/i })
      expect(paperLinks.length).toBeGreaterThanOrEqual(2)
    })

    it('should link to CollabX paper', () => {
      render(<Theories />)

      const links = screen.getAllByRole('link')
      const collabXPaperLink = links.find(link =>
        link.getAttribute('href') === '/papers/collab-x-framework'
      )
      expect(collabXPaperLink).toBeInTheDocument()
    })
  })

  describe('Responsive Layout', () => {
    it('should use cards-grid layout', () => {
      render(<Theories />)

      const grid = document.querySelector('.cards-grid')
      expect(grid).toBeInTheDocument()
    })

    it('should contain theory cards in grid', () => {
      render(<Theories />)

      const cards = screen.getAllByRole('article')
      const grid = document.querySelector('.cards-grid')

      expect(grid).toContainElement(cards[0])
    })
  })

  describe('CSS Classes', () => {
    it('should apply base theories class', () => {
      render(<Theories />)

      const main = screen.getByRole('main')
      expect(main).toHaveClass('theories')
    })

    it('should accept custom className prop', () => {
      render(<Theories className="custom-theories-page" />)

      const main = screen.getByRole('main')
      expect(main).toHaveClass('theories')
      expect(main).toHaveClass('custom-theories-page')
    })
  })

  describe('Accessibility', () => {
    it('should use main landmark', () => {
      render(<Theories />)

      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('should have h1 as page heading', () => {
      render(<Theories />)

      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()
    })

    it('should have h2 for each framework', () => {
      render(<Theories />)

      const h2s = screen.getAllByRole('heading', { level: 2 })
      expect(h2s.length).toBeGreaterThanOrEqual(2)
    })

    it('should use article for each theory card', () => {
      render(<Theories />)

      const articles = screen.getAllByRole('article')
      expect(articles.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Data Loading', () => {
    it('should load theories from theories data', () => {
      render(<Theories />)

      // Should display theories from theories.ts
      const cards = screen.getAllByRole('article')
      expect(cards.length).toBeGreaterThanOrEqual(2)
    })

    it('should display featured theories', () => {
      render(<Theories />)

      // Both CollabX and ContribX are featured - use full titles
      expect(screen.getByText(/CollabX: The Collaborative Experience Framework/i)).toBeInTheDocument()
      expect(screen.getByText(/ContribX: The Contributor Experience Framework/i)).toBeInTheDocument()
    })
  })

  describe('Props Interface', () => {
    it('should render without any props (using defaults)', () => {
      render(<Theories />)

      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('should accept className prop', () => {
      render(<Theories className="frameworks-page" />)

      const main = screen.getByRole('main')
      expect(main).toHaveClass('frameworks-page')
    })
  })
})
