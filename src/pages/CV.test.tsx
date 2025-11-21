import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CV from './CV'

// Mock SEO component to avoid react-helmet-async issues in tests
vi.mock('../components/SEO', () => ({
  default: () => null,
}))

describe('CV Page', () => {
  describe('Page Rendering', () => {
    it('should render CV page', () => {
      render(<CV />)

      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('should have correct semantic structure', () => {
      render(<CV />)

      const main = screen.getByRole('main')
      expect(main).toHaveClass('cv')
    })
  })

  describe('Page Header', () => {
    it('should render name as page heading', () => {
      render(<CV />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent(/Karsten Wade/i)
    })

    it('should render professional title', () => {
      render(<CV />)

      const title = screen.getByText(/Open Source Community Architect, OSPO Leader & Developer Experience Expert/i)
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('cv__title')
    })

    it('should render summary section', () => {
      render(<CV />)

      const summary = screen.getByText(/over 20 years of experience/i)
      expect(summary).toBeInTheDocument()
    })
  })

  describe('Contact Information', () => {
    it('should display email contact', () => {
      render(<CV />)

      const email = screen.getByRole('link', { name: /karsten@karstenwade.com/i })
      expect(email).toHaveAttribute('href', 'mailto:karsten@karstenwade.com')
    })

    it('should display LinkedIn link', () => {
      render(<CV />)

      const linkedin = screen.getByRole('link', { name: /linkedin/i })
      expect(linkedin).toHaveAttribute('href', 'https://linkedin.com/in/karsten-wade')
      expect(linkedin).toHaveAttribute('target', '_blank')
    })

    it('should display GitHub link', () => {
      render(<CV />)

      const github = screen.getByRole('link', { name: /github/i })
      expect(github).toHaveAttribute('href', 'https://github.com/quaid')
      expect(github).toHaveAttribute('target', '_blank')
    })

    it('should display website link', () => {
      render(<CV />)

      const links = screen.getAllByRole('link', { name: /karstenwade.com/i })
      const website = links.find(link => link.getAttribute('href') === 'https://karstenwade.com')
      expect(website).toBeDefined()
      expect(website).toHaveAttribute('href', 'https://karstenwade.com')
    })
  })

  describe('Expertise Section', () => {
    it('should render expertise heading', () => {
      render(<CV />)

      const heading = screen.getByRole('heading', { level: 2, name: /key expertise/i })
      expect(heading).toBeInTheDocument()
    })

    it('should display expertise areas', () => {
      render(<CV />)

      expect(screen.getByText(/Collaborative experience consulting/i)).toBeInTheDocument()
      expect(screen.getAllByText(/Developer experience expert/i).length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText(/Community catalyst/i)).toBeInTheDocument()
    })

    it('should use list for expertise items', () => {
      render(<CV />)

      const expertiseItems = screen.getAllByRole('listitem')
      expect(expertiseItems.length).toBeGreaterThanOrEqual(6)
    })
  })

  describe('Experience Section', () => {
    it('should render experience heading', () => {
      render(<CV />)

      const heading = screen.getByRole('heading', { level: 2, name: /professional experience/i })
      expect(heading).toBeInTheDocument()
    })

    it('should display experience content', () => {
      render(<CV />)

      const experience = screen.getByText(/Placeholder for detailed work history/i)
      expect(experience).toBeInTheDocument()
    })
  })

  describe('Education Section', () => {
    it('should render education heading', () => {
      render(<CV />)

      const heading = screen.getByRole('heading', { level: 2, name: /education/i })
      expect(heading).toBeInTheDocument()
    })

    it('should display education content', () => {
      render(<CV />)

      const education = screen.getByText(/Placeholder for education details/i)
      expect(education).toBeInTheDocument()
    })
  })

  describe('Publications Section', () => {
    it('should render publications heading', () => {
      render(<CV />)

      const heading = screen.getByRole('heading', { level: 2, name: /publications/i })
      expect(heading).toBeInTheDocument()
    })

    it('should display publication items', () => {
      render(<CV />)

      expect(screen.getByText(/The Open Source Way 2.0/i)).toBeInTheDocument()
      expect(screen.getByText(/CollabX and ContribX frameworks/i)).toBeInTheDocument()
    })
  })

  describe('Download Links', () => {
    it('should render download section heading', () => {
      render(<CV />)

      const heading = screen.getByRole('heading', { level: 2, name: /download/i })
      expect(heading).toBeInTheDocument()
    })

    it('should have download links for CV', () => {
      render(<CV />)

      const downloadLinks = screen.getAllByRole('link', { name: /download/i })
      expect(downloadLinks.length).toBeGreaterThanOrEqual(2)
    })

    it('should link to Full CV PDF', () => {
      render(<CV />)

      const fullCVLink = screen.getByRole('link', { name: /download full cv/i })
      expect(fullCVLink).toHaveAttribute('href', '/assets/docs/karsten-wade-full-cv.pdf')
      expect(fullCVLink).toHaveAttribute('download')
    })

    it('should link to Community Manager Resume PDF', () => {
      render(<CV />)

      const resumeLink = screen.getByRole('link', { name: /download community manager resume/i })
      expect(resumeLink).toHaveAttribute('href', '/assets/docs/karsten-wade-community-manager.pdf')
      expect(resumeLink).toHaveAttribute('download')
    })

    it('should display file sizes', () => {
      render(<CV />)

      expect(screen.getByText(/245 KB/i)).toBeInTheDocument()
      expect(screen.getByText(/180 KB/i)).toBeInTheDocument()
    })
  })

  describe('Last Updated', () => {
    it('should display last updated date', () => {
      render(<CV />)

      const lastUpdated = screen.getByText(/last updated/i)
      expect(lastUpdated).toBeInTheDocument()
    })
  })

  describe('CSS Classes', () => {
    it('should apply base cv class', () => {
      render(<CV />)

      const main = screen.getByRole('main')
      expect(main).toHaveClass('cv')
    })

    it('should accept custom className prop', () => {
      render(<CV className="custom-cv-page" />)

      const main = screen.getByRole('main')
      expect(main).toHaveClass('cv')
      expect(main).toHaveClass('custom-cv-page')
    })
  })

  describe('Accessibility', () => {
    it('should use main landmark', () => {
      render(<CV />)

      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('should have h1 as page heading', () => {
      render(<CV />)

      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()
    })

    it('should have proper heading hierarchy', () => {
      render(<CV />)

      const h1 = screen.getByRole('heading', { level: 1 })
      const h2s = screen.getAllByRole('heading', { level: 2 })

      expect(h1).toBeInTheDocument()
      expect(h2s.length).toBeGreaterThanOrEqual(5) // Expertise, Experience, Education, Publications, Download
    })

    it('should have accessible external links', () => {
      render(<CV />)

      const externalLinks = screen.getAllByRole('link').filter(link =>
        link.getAttribute('target') === '_blank'
      )

      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })
  })

  describe('Props Interface', () => {
    it('should render without any props (using defaults)', () => {
      render(<CV />)

      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('should accept className prop', () => {
      render(<CV className="resume-page" />)

      const main = screen.getByRole('main')
      expect(main).toHaveClass('resume-page')
    })
  })
})
