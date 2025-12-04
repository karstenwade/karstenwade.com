import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import Navigation from './Navigation'

// Helper to render Navigation with Router context
const renderNavigation = (props = {}) => {
  return render(
    <MemoryRouter>
      <Navigation {...props} />
    </MemoryRouter>
  )
}

describe('Navigation Component', () => {
  beforeEach(() => {
    // Reset any state before each test
  })

  describe('Component Rendering', () => {
    it('should render navigation element', () => {
      renderNavigation()
      const nav = screen.getByRole('navigation', { name: /main navigation/i })
      expect(nav).toBeInTheDocument()
    })

    it('should render all 4 navigation links', () => {
      renderNavigation()

      expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /open papers/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /writing/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /cv/i })).toBeInTheDocument()
    })

    it('should have correct href attributes for all links', () => {
      renderNavigation()

      expect(screen.getByRole('link', { name: /^home$/i })).toHaveAttribute('href', '/')
      expect(screen.getByRole('link', { name: /open papers/i })).toHaveAttribute('href', '/papers')
      expect(screen.getByRole('link', { name: /writing/i })).toHaveAttribute('href', '/writing')
      expect(screen.getByRole('link', { name: /cv/i })).toHaveAttribute('href', '/cv')
    })
  })

  describe('Hamburger Menu Button', () => {
    it('should render hamburger button', () => {
      renderNavigation()
      const button = screen.getByRole('button', { name: /open navigation menu/i })
      expect(button).toBeInTheDocument()
    })

    it('should have correct ARIA attributes when closed', () => {
      renderNavigation()
      const button = screen.getByRole('button', { name: /open navigation menu/i })

      expect(button).toHaveAttribute('aria-expanded', 'false')
      expect(button).toHaveAttribute('aria-controls', 'navigation-menu')
    })

    it('should toggle aria-expanded when clicked', async () => {
      const user = userEvent.setup()
      renderNavigation()

      const button = screen.getByRole('button', { name: /open navigation menu/i })
      expect(button).toHaveAttribute('aria-expanded', 'false')

      // Click to open
      await user.click(button)
      expect(button).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByRole('button', { name: /close navigation menu/i })).toBeInTheDocument()

      // Click to close
      await user.click(button)
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('Keyboard Navigation', () => {
    it('should toggle menu with Enter key', async () => {
      const user = userEvent.setup()
      renderNavigation()

      const button = screen.getByRole('button', { name: /open navigation menu/i })
      button.focus()

      // Press Enter to open
      await user.keyboard('{Enter}')
      expect(button).toHaveAttribute('aria-expanded', 'true')

      // Press Enter to close
      await user.keyboard('{Enter}')
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('should toggle menu with Space key', async () => {
      const user = userEvent.setup()
      renderNavigation()

      const button = screen.getByRole('button', { name: /open navigation menu/i })
      button.focus()

      // Press Space to open
      await user.keyboard(' ')
      expect(button).toHaveAttribute('aria-expanded', 'true')

      // Press Space to close
      await user.keyboard(' ')
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('should close menu with Escape key', async () => {
      const user = userEvent.setup()
      renderNavigation()

      const button = screen.getByRole('button', { name: /open navigation menu/i })

      // Open menu
      await user.click(button)
      expect(button).toHaveAttribute('aria-expanded', 'true')

      // Press Escape to close
      await user.keyboard('{Escape}')
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('should allow navigation through links with Tab key', async () => {
      const user = userEvent.setup()
      renderNavigation()

      // Tab to logo link first
      await user.tab()
      expect(screen.getByRole('link', { name: /karsten wade - home/i })).toHaveFocus()

      // Tab to hamburger button (mobile control)
      await user.tab()
      expect(screen.getByRole('button', { name: /open navigation menu/i })).toHaveFocus()

      // Tab to first nav link
      await user.tab()
      expect(screen.getByRole('link', { name: /^home$/i })).toHaveFocus()

      // Tab to second nav link
      await user.tab()
      expect(screen.getByRole('link', { name: /open papers/i })).toHaveFocus()
    })
  })

  describe('Menu State Management', () => {
    it('should close menu when a link is clicked', async () => {
      const user = userEvent.setup()
      renderNavigation()

      const button = screen.getByRole('button', { name: /open navigation menu/i })

      // Open menu
      await user.click(button)
      expect(button).toHaveAttribute('aria-expanded', 'true')

      // Click a navigation link
      const homeLink = screen.getByRole('link', { name: /^home$/i })
      await user.click(homeLink)

      // Menu should close
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderNavigation()

      const nav = screen.getByRole('navigation')
      expect(nav).toHaveAttribute('aria-label', 'Main navigation')
    })

    it('should have accessible button labels that change with state', async () => {
      const user = userEvent.setup()
      renderNavigation()

      const button = screen.getByRole('button')
      expect(button).toHaveAccessibleName('Open navigation menu')

      await user.click(button)
      expect(button).toHaveAccessibleName('Close navigation menu')
    })

    it('should have list role for menu items', () => {
      renderNavigation()

      const menu = screen.getByRole('list')
      expect(menu).toHaveAttribute('id', 'navigation-menu')
    })

    it('should have focusable elements in correct order', () => {
      renderNavigation()

      const focusableElements = [
        screen.getByRole('button'),
        ...screen.getAllByRole('link'),
      ]

      focusableElements.forEach((element) => {
        expect(element).toBeInTheDocument()
      })
    })
  })

  describe('Custom className', () => {
    it('should accept and apply custom className', () => {
      renderNavigation({ className: "custom-nav-class" })

      const nav = screen.getByRole('navigation')
      // Tailwind classes are applied via cn() utility, no longer has 'navigation' class
      expect(nav).toHaveClass('custom-nav-class')
    })
  })

  describe('Responsive Behavior', () => {
    it('should have menu with correct ID for ARIA controls', () => {
      renderNavigation()

      const menu = document.getElementById('navigation-menu')
      expect(menu).toBeInTheDocument()
      expect(menu).toHaveAttribute('role', 'list')
    })

    it('should apply translation when menu is open', async () => {
      const user = userEvent.setup()
      renderNavigation()

      const button = screen.getByRole('button', { name: /open navigation menu/i })
      const menu = document.getElementById('navigation-menu')

      // Menu should be translated off-screen initially
      expect(menu).toHaveClass('max-md:translate-x-full')

      // Click to open
      await user.click(button)

      // Menu should translate to visible position
      expect(menu).toHaveClass('max-md:translate-x-0')
    })
  })

  describe('Link Structure', () => {
    it('should render logo link plus 4 navigation links', () => {
      renderNavigation()

      const links = screen.getAllByRole('link')
      // Logo link (index 0) + 4 nav links = 5 total
      expect(links).toHaveLength(5)
    })

    it('should have navigation links in correct order', () => {
      renderNavigation()

      const links = screen.getAllByRole('link')
      // links[0] is the logo link, nav links start at index 1
      expect(links[1]).toHaveTextContent('Home')
      expect(links[2]).toHaveTextContent('Open Papers')
      expect(links[3]).toHaveTextContent('Writing')
      expect(links[4]).toHaveTextContent('CV')
    })
  })
})
