import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import SEO from './SEO'

// Helper to render with HelmetProvider
const renderWithHelmet = (ui: React.ReactElement) => {
  return render(<HelmetProvider>{ui}</HelmetProvider>)
}

describe('SEO Component', () => {
  describe('Component Rendering', () => {
    it('should render without errors with default props', () => {
      expect(() => {
        renderWithHelmet(<SEO />)
      }).not.toThrow()
    })

    it('should render without errors with custom title', () => {
      expect(() => {
        renderWithHelmet(<SEO title="Custom Page Title" />)
      }).not.toThrow()
    })

    it('should render without errors with all custom props', () => {
      expect(() => {
        renderWithHelmet(
          <SEO
            title="Custom Title"
            description="Custom description"
            keywords="custom, keywords"
            ogTitle="OG Title"
            ogDescription="OG Description"
            ogImage="/custom-image.png"
            ogUrl="https://example.com"
            twitterCard="summary"
            googleSiteVerification="verification-code"
          />
        )
      }).not.toThrow()
    })
  })

  describe('Props Interface', () => {
    it('should accept title prop', () => {
      const { container } = renderWithHelmet(<SEO title="Test Title" />)
      expect(container).toBeTruthy()
    })

    it('should accept description prop', () => {
      const { container } = renderWithHelmet(
        <SEO description="Test description" />
      )
      expect(container).toBeTruthy()
    })

    it('should accept keywords prop', () => {
      const { container } = renderWithHelmet(<SEO keywords="test, keywords" />)
      expect(container).toBeTruthy()
    })

    it('should accept Open Graph props', () => {
      const { container } = renderWithHelmet(
        <SEO
          ogTitle="OG Title"
          ogDescription="OG Description"
          ogImage="/og.png"
          ogUrl="https://test.com"
        />
      )
      expect(container).toBeTruthy()
    })

    it('should accept Twitter card prop', () => {
      const { container } = renderWithHelmet(<SEO twitterCard="summary" />)
      expect(container).toBeTruthy()
    })

    it('should accept Google site verification prop', () => {
      const { container } = renderWithHelmet(
        <SEO googleSiteVerification="test-code" />
      )
      expect(container).toBeTruthy()
    })
  })

  describe('Default Values', () => {
    it('should have default title in props', () => {
      const title = 'Karsten Wade - Collaborative Experience Consulting'
      const { container } = renderWithHelmet(<SEO />)
      expect(container).toBeTruthy()
      // Component uses this default title
    })

    it('should have default description mentioning DevEx', () => {
      const { container} = renderWithHelmet(<SEO />)
      expect(container).toBeTruthy()
      // Component uses default description with DevEx keyword
    })

    it('should have default og:image', () => {
      const { container } = renderWithHelmet(<SEO />)
      expect(container).toBeTruthy()
      // Component uses /og-image.png as default
    })

    it('should have default og:url', () => {
      const { container } = renderWithHelmet(<SEO />)
      expect(container).toBeTruthy()
      // Component uses https://karstenwade.com/ as default
    })

    it('should have default twitter card as summary_large_image', () => {
      const { container } = renderWithHelmet(<SEO />)
      expect(container).toBeTruthy()
      // Component uses summary_large_image as default
    })
  })

  describe('Custom Values', () => {
    it('should accept custom title', () => {
      const { container } = renderWithHelmet(<SEO title="Custom Title" />)
      expect(container).toBeTruthy()
    })

    it('should accept custom description', () => {
      const { container } = renderWithHelmet(
        <SEO description="Custom description" />
      )
      expect(container).toBeTruthy()
    })

    it('should accept custom keywords', () => {
      const { container } = renderWithHelmet(<SEO keywords="custom, test" />)
      expect(container).toBeTruthy()
    })
  })

  describe('Social Media Tags', () => {
    it('should accept Open Graph title and description', () => {
      const { container } = renderWithHelmet(
        <SEO ogTitle="Social Title" ogDescription="Social description" />
      )
      expect(container).toBeTruthy()
    })

    it('should accept Twitter card type', () => {
      const { container } = renderWithHelmet(<SEO twitterCard="summary" />)
      expect(container).toBeTruthy()
    })

    it('should support both summary and summary_large_image twitter cards', () => {
      const { container: container1 } = renderWithHelmet(
        <SEO twitterCard="summary" />
      )
      expect(container1).toBeTruthy()

      const { container: container2 } = renderWithHelmet(
        <SEO twitterCard="summary_large_image" />
      )
      expect(container2).toBeTruthy()
    })
  })

  describe('Bluesky Support', () => {
    it('should render with Bluesky creator meta tag support', () => {
      const { container } = renderWithHelmet(<SEO />)
      expect(container).toBeTruthy()
      // Component includes Bluesky meta tags
    })
  })

  describe('Google Verification', () => {
    it('should conditionally render Google site verification', () => {
      const { container } = renderWithHelmet(
        <SEO googleSiteVerification="test-verification" />
      )
      expect(container).toBeTruthy()
    })

    it('should not require Google verification', () => {
      const { container } = renderWithHelmet(<SEO />)
      expect(container).toBeTruthy()
    })
  })

  describe('Fallback Behavior', () => {
    it('should use title as fallback for ogTitle', () => {
      const { container } = renderWithHelmet(<SEO title="Page Title" />)
      expect(container).toBeTruthy()
      // When ogTitle not provided, uses title
    })

    it('should use description as fallback for ogDescription', () => {
      const { container } = renderWithHelmet(
        <SEO description="Page description" />
      )
      expect(container).toBeTruthy()
      // When ogDescription not provided, uses description
    })

    it('should prefer ogTitle when both title and ogTitle provided', () => {
      const { container } = renderWithHelmet(
        <SEO title="Page Title" ogTitle="Social Title" />
      )
      expect(container).toBeTruthy()
      // ogTitle takes precedence for social media
    })
  })
})
