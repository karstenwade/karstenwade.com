/**
 * ShareButtons Component Tests
 * Story 16.7c: Add social sharing and SEO
 *
 * RED PHASE: Tests for social sharing buttons.
 *
 * Requirements:
 * - Display Twitter/X and LinkedIn share buttons
 * - Generate proper share URLs with title and URL
 * - Accessible with proper labels
 * - Hidden in print mode
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import ShareButtons from '../../components/ShareButtons'

const mockProps = {
  url: 'https://karstenwade.com/papers/test-paper',
  title: 'Test Paper Title',
  description: 'A test paper about testing',
}

describe('ShareButtons Component', () => {
  describe('Rendering', () => {
    it('renders Twitter/X share button', () => {
      render(<ShareButtons {...mockProps} />)

      expect(screen.getByRole('link', { name: /share on (twitter|x)/i })).toBeInTheDocument()
    })

    it('renders LinkedIn share button', () => {
      render(<ShareButtons {...mockProps} />)

      expect(screen.getByRole('link', { name: /share on linkedin/i })).toBeInTheDocument()
    })

    it('renders share section heading', () => {
      render(<ShareButtons {...mockProps} />)

      expect(screen.getByText(/share/i)).toBeInTheDocument()
    })
  })

  describe('Share URLs', () => {
    it('generates correct Twitter share URL', () => {
      render(<ShareButtons {...mockProps} />)

      const twitterLink = screen.getByRole('link', { name: /share on (twitter|x)/i })
      const href = twitterLink.getAttribute('href')

      expect(href).toContain('twitter.com/intent/tweet')
      expect(href).toContain(encodeURIComponent(mockProps.url))
      // URLSearchParams encodes spaces as + which is valid for query strings
      expect(href).toContain('text=Test+Paper+Title')
    })

    it('generates correct LinkedIn share URL', () => {
      render(<ShareButtons {...mockProps} />)

      const linkedinLink = screen.getByRole('link', { name: /share on linkedin/i })
      const href = linkedinLink.getAttribute('href')

      expect(href).toContain('linkedin.com/sharing/share-offsite')
      expect(href).toContain(encodeURIComponent(mockProps.url))
    })
  })

  describe('Link attributes', () => {
    it('opens Twitter link in new tab', () => {
      render(<ShareButtons {...mockProps} />)

      const twitterLink = screen.getByRole('link', { name: /share on (twitter|x)/i })
      expect(twitterLink).toHaveAttribute('target', '_blank')
      expect(twitterLink).toHaveAttribute('rel', expect.stringContaining('noopener'))
    })

    it('opens LinkedIn link in new tab', () => {
      render(<ShareButtons {...mockProps} />)

      const linkedinLink = screen.getByRole('link', { name: /share on linkedin/i })
      expect(linkedinLink).toHaveAttribute('target', '_blank')
      expect(linkedinLink).toHaveAttribute('rel', expect.stringContaining('noopener'))
    })
  })

  describe('Accessibility', () => {
    it('has accessible labels for screen readers', () => {
      render(<ShareButtons {...mockProps} />)

      // Both buttons should have accessible names
      expect(screen.getByRole('link', { name: /share on (twitter|x)/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /share on linkedin/i })).toBeInTheDocument()
    })

    it('includes social icons with aria-hidden', () => {
      render(<ShareButtons {...mockProps} />)

      const twitterIcon = screen.getByTestId('twitter-icon')
      const linkedinIcon = screen.getByTestId('linkedin-icon')

      expect(twitterIcon).toHaveAttribute('aria-hidden', 'true')
      expect(linkedinIcon).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('Print behavior', () => {
    it('is hidden in print mode', () => {
      render(<ShareButtons {...mockProps} />)

      const shareButtons = screen.getByTestId('share-buttons')
      expect(shareButtons).toHaveClass('print:hidden')
    })
  })

  describe('Optional email sharing', () => {
    it('renders email share button when showEmail is true', () => {
      render(<ShareButtons {...mockProps} showEmail />)

      expect(screen.getByRole('link', { name: /share via email/i })).toBeInTheDocument()
    })

    it('does not render email button by default', () => {
      render(<ShareButtons {...mockProps} />)

      expect(screen.queryByRole('link', { name: /share via email/i })).not.toBeInTheDocument()
    })

    it('generates correct email share URL', () => {
      render(<ShareButtons {...mockProps} showEmail />)

      const emailLink = screen.getByRole('link', { name: /share via email/i })
      const href = emailLink.getAttribute('href')

      expect(href).toContain('mailto:')
      expect(href).toContain(encodeURIComponent(mockProps.title))
      expect(href).toContain(encodeURIComponent(mockProps.url))
    })
  })
})
