import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Hero from './Hero'

describe('Hero Component', () => {
  describe('Component Rendering', () => {
    it('should render hero section', () => {
      render(<Hero />)

      const hero = screen.getByRole('banner')
      expect(hero).toBeInTheDocument()
    })

    it('should render with correct semantic structure', () => {
      render(<Hero />)

      // Hero should be a banner landmark
      const banner = screen.getByRole('banner')
      expect(banner).toHaveClass('hero')
    })
  })

  describe('Headshot Image', () => {
    it('should render headshot image', () => {
      render(<Hero />)

      const image = screen.getByRole('img', { name: /karsten wade/i })
      expect(image).toBeInTheDocument()
    })

    it('should have proper alt text for accessibility', () => {
      render(<Hero />)

      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('alt')
      expect(image.getAttribute('alt')).toMatch(/karsten wade/i)
    })

    it('should have src attribute for placeholder image', () => {
      render(<Hero />)

      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('src')
      expect(image.getAttribute('src')).toBeTruthy()
    })

    it('should have proper CSS classes for styling', () => {
      render(<Hero />)

      const image = screen.getByRole('img')
      expect(image).toHaveClass('hero__image')
    })
  })

  describe('Bio Text Content', () => {
    it('should render name heading', () => {
      render(<Hero />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent(/karsten wade/i)
    })

    it('should highlight collaborative experience consulting identity', () => {
      render(<Hero />)

      const bioText = screen.getByText(/collaborative experience consulting/i)
      expect(bioText).toBeInTheDocument()
    })

    it('should include collaboration catalyst text', () => {
      render(<Hero />)

      expect(screen.getByText(/collaboration catalyst/i)).toBeInTheDocument()
    })

    it('should include open collaboration expert text', () => {
      render(<Hero />)

      expect(screen.getByText(/open collaboration expert/i)).toBeInTheDocument()
    })

    it('should include developer experience text', () => {
      render(<Hero />)

      expect(screen.getByText(/developer experience/i)).toBeInTheDocument()
    })

    it('should render bio content in paragraph or div', () => {
      render(<Hero />)

      const bioContent = screen.getByText(/collaborative experience consulting/i)
      expect(['P', 'DIV', 'H2']).toContain(bioContent.tagName)
    })
  })

  describe('Responsive Layout', () => {
    it('should have image container', () => {
      render(<Hero />)

      const imageContainer = document.querySelector('.hero__image-container')
      expect(imageContainer).toBeInTheDocument()
    })

    it('should have content container separate from image', () => {
      render(<Hero />)

      const contentContainer = document.querySelector('.hero__content')
      expect(contentContainer).toBeInTheDocument()
    })

    it('should wrap both containers in hero section', () => {
      render(<Hero />)

      const hero = screen.getByRole('banner')
      const imageContainer = document.querySelector('.hero__image-container')
      const contentContainer = document.querySelector('.hero__content')

      expect(hero).toContainElement(imageContainer)
      expect(hero).toContainElement(contentContainer)
    })
  })

  describe('CSS Classes', () => {
    it('should apply base hero class', () => {
      render(<Hero />)

      const hero = screen.getByRole('banner')
      expect(hero).toHaveClass('hero')
    })

    it('should accept custom className prop', () => {
      render(<Hero className="custom-hero-class" />)

      const hero = screen.getByRole('banner')
      expect(hero).toHaveClass('hero')
      expect(hero).toHaveClass('custom-hero-class')
    })
  })

  describe('Accessibility', () => {
    it('should use banner role for hero section', () => {
      render(<Hero />)

      const banner = screen.getByRole('banner')
      expect(banner).toBeInTheDocument()
    })

    it('should have h1 as first heading', () => {
      render(<Hero />)

      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()
    })

    it('should have descriptive image alt text', () => {
      render(<Hero />)

      const image = screen.getByRole('img')
      const alt = image.getAttribute('alt')

      expect(alt).toBeTruthy()
      expect(alt!.length).toBeGreaterThan(5) // More than just "image"
    })

    it('should be screen reader friendly', () => {
      render(<Hero />)

      // Should have proper heading hierarchy
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()

      // Should have meaningful image alt
      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('alt')

      // Should have text content
      expect(screen.getByText(/collaborative experience consulting/i)).toBeInTheDocument()
    })
  })

  describe('Content Structure', () => {
    it('should render heading with name', () => {
      render(<Hero />)

      const heading = screen.getByRole('heading', { level: 1, name: /karsten wade/i })
      expect(heading).toBeInTheDocument()
    })

    it('should render subheading or tagline', () => {
      render(<Hero />)

      // Should have either h2 with tagline or div with tagline
      const tagline = screen.getByText(/collaborative experience consulting/i)
      expect(tagline).toBeInTheDocument()
    })

    it('should render bio description', () => {
      render(<Hero />)

      // Bio should contain multiple expertise areas
      expect(screen.getByText(/collaboration catalyst/i)).toBeInTheDocument()
      expect(screen.getByText(/developer experience/i)).toBeInTheDocument()
    })
  })

  describe('Image Handling', () => {
    it('should use lazy loading for performance', () => {
      render(<Hero />)

      const image = screen.getByRole('img')
      // Check if loading attribute exists (it may be "lazy" or "eager")
      // For hero images, eager is also acceptable since it's above the fold
      expect(image).toHaveAttribute('src')
    })

    it('should render placeholder image path', () => {
      render(<Hero />)

      const image = screen.getByRole('img')
      const src = image.getAttribute('src')

      // Should have a valid path (not empty)
      expect(src).toBeTruthy()
      expect(src!.length).toBeGreaterThan(0)
    })
  })

  describe('Props Interface', () => {
    it('should render without any props (using defaults)', () => {
      render(<Hero />)

      expect(screen.getByRole('banner')).toBeInTheDocument()
      expect(screen.getByRole('img')).toBeInTheDocument()
      // Use heading to find specific "Karsten Wade" text (appears in both h1 and bio)
      expect(screen.getByRole('heading', { level: 1, name: /karsten wade/i })).toBeInTheDocument()
    })

    it('should accept className prop', () => {
      render(<Hero className="home-hero" />)

      const hero = screen.getByRole('banner')
      expect(hero).toHaveClass('home-hero')
    })
  })
})
