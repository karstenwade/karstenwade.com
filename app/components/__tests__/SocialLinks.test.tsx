/**
 * SocialLinks Component Tests
 * Story #191: Create SocialLinks component with icon buttons
 *
 * RED PHASE: Tests for social profile icon links.
 *
 * Requirements:
 * - Display icons for GitHub, LinkedIn, Bluesky, Mastodon, Twitter
 * - Each icon links to correct profile URL
 * - Links open in new tabs with proper security attributes
 * - Accessible with proper aria-labels
 * - Hidden in print mode
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import SocialLinks from '../SocialLinks'

describe('SocialLinks Component', () => {
  describe('Rendering', () => {
    it('renders GitHub link', () => {
      render(<SocialLinks />)

      expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
    })

    it('renders LinkedIn link', () => {
      render(<SocialLinks />)

      expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
    })

    it('renders Bluesky link', () => {
      render(<SocialLinks />)

      expect(screen.getByRole('link', { name: /bluesky/i })).toBeInTheDocument()
    })

    it('renders Mastodon link', () => {
      render(<SocialLinks />)

      expect(screen.getByRole('link', { name: /mastodon/i })).toBeInTheDocument()
    })

    it('renders Twitter link', () => {
      render(<SocialLinks />)

      expect(screen.getByRole('link', { name: /twitter/i })).toBeInTheDocument()
    })

    it('renders all five social links', () => {
      render(<SocialLinks />)

      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(5)
    })
  })

  describe('Link URLs', () => {
    it('links to correct GitHub profile', () => {
      render(<SocialLinks />)

      const githubLink = screen.getByRole('link', { name: /github/i })
      expect(githubLink).toHaveAttribute('href', 'https://github.com/quaid')
    })

    it('links to correct LinkedIn profile', () => {
      render(<SocialLinks />)

      const linkedinLink = screen.getByRole('link', { name: /linkedin/i })
      expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/karstenwade')
    })

    it('links to correct Bluesky profile', () => {
      render(<SocialLinks />)

      const blueskyLink = screen.getByRole('link', { name: /bluesky/i })
      expect(blueskyLink).toHaveAttribute('href', 'https://bsky.app/profile/quaid.bsky.social')
    })

    it('links to correct Mastodon profile', () => {
      render(<SocialLinks />)

      const mastodonLink = screen.getByRole('link', { name: /mastodon/i })
      expect(mastodonLink).toHaveAttribute('href', 'https://hachyderm.io/@quaid')
    })

    it('links to correct Twitter profile (using twitter.com, not x.com)', () => {
      render(<SocialLinks />)

      const twitterLink = screen.getByRole('link', { name: /twitter/i })
      expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/quaid')
    })
  })

  describe('Link attributes', () => {
    it('opens links in new tabs', () => {
      render(<SocialLinks />)

      const links = screen.getAllByRole('link')
      links.forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank')
      })
    })

    it('has secure rel attributes on all links', () => {
      render(<SocialLinks />)

      const links = screen.getAllByRole('link')
      links.forEach((link) => {
        expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
        expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
      })
    })
  })

  describe('Accessibility', () => {
    it('has accessible labels for all social icons', () => {
      render(<SocialLinks />)

      // All links should have accessible names
      expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /bluesky/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /mastodon/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /twitter/i })).toBeInTheDocument()
    })

    it('has aria-hidden icons for decorative purposes', () => {
      render(<SocialLinks />)

      const githubIcon = screen.getByTestId('github-icon')
      const linkedinIcon = screen.getByTestId('linkedin-icon')
      const blueskyIcon = screen.getByTestId('bluesky-icon')
      const mastodonIcon = screen.getByTestId('mastodon-icon')
      const twitterIcon = screen.getByTestId('twitter-icon')

      expect(githubIcon).toHaveAttribute('aria-hidden', 'true')
      expect(linkedinIcon).toHaveAttribute('aria-hidden', 'true')
      expect(blueskyIcon).toHaveAttribute('aria-hidden', 'true')
      expect(mastodonIcon).toHaveAttribute('aria-hidden', 'true')
      expect(twitterIcon).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('Print behavior', () => {
    it('is hidden in print mode', () => {
      render(<SocialLinks />)

      const socialLinks = screen.getByTestId('social-links')
      expect(socialLinks).toHaveClass('print:hidden')
    })
  })

  describe('Customization', () => {
    it('accepts custom className prop', () => {
      render(<SocialLinks className="custom-class" />)

      const socialLinks = screen.getByTestId('social-links')
      expect(socialLinks).toHaveClass('custom-class')
    })

    it('renders with default styling when no className provided', () => {
      render(<SocialLinks />)

      const socialLinks = screen.getByTestId('social-links')
      expect(socialLinks).toHaveClass('social-links')
    })
  })
})
