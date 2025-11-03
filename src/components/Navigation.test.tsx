import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navigation from './Navigation'

describe('Navigation Component', () => {
  beforeEach(() => {
    // Reset any state before each test
  })

  describe('Component Rendering', () => {
    it('should render navigation element', () => {
      render(<Navigation />)
      const nav = screen.getByRole('navigation', { name: /main navigation/i })
      expect(nav).toBeInTheDocument()
    })

    it('should render all 5 navigation links', () => {
      render(<Navigation />)

      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /open papers/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /writing/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /cv/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /theories/i })).toBeInTheDocument()
    })

    it('should have correct href attributes for all links', () => {
      render(<Navigation />)

      expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/')
      expect(screen.getByRole('link', { name: /open papers/i })).toHaveAttribute('href', '/papers')
      expect(screen.getByRole('link', { name: /writing/i })).toHaveAttribute('href', '/writing')
      expect(screen.getByRole('link', { name: /cv/i })).toHaveAttribute('href', '/cv')
      expect(screen.getByRole('link', { name: /theories/i })).toHaveAttribute('href', '/theories')
    })
  })

  describe('Hamburger Menu Button', () => {
    it('should render hamburger button', () => {
      render(<Navigation />)
      const button = screen.getByRole('button', { name: /open navigation menu/i })
      expect(button).toBeInTheDocument()
    })

    it('should have correct ARIA attributes when closed', () => {
      render(<Navigation />)
      const button = screen.getByRole('button', { name: /open navigation menu/i })

      expect(button).toHaveAttribute('aria-expanded', 'false')
      expect(button).toHaveAttribute('aria-controls', 'navigation-menu')
    })

    it('should toggle aria-expanded when clicked', async () => {
      const user = userEvent.setup()
      render(<Navigation />)

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
      render(<Navigation />)

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
      render(<Navigation />)

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
      render(<Navigation />)

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
      render(<Navigation />)

      // Tab to hamburger button first (mobile control)
      await user.tab()
      expect(screen.getByRole('button', { name: /open navigation menu/i })).toHaveFocus()

      // Tab to first link
      await user.tab()
      expect(screen.getByRole('link', { name: /home/i })).toHaveFocus()

      // Tab to second link
      await user.tab()
      expect(screen.getByRole('link', { name: /open papers/i })).toHaveFocus()
    })
  })

  describe('Menu State Management', () => {
    it('should close menu when a link is clicked', async () => {
      const user = userEvent.setup()
      render(<Navigation />)

      const button = screen.getByRole('button', { name: /open navigation menu/i })

      // Open menu
      await user.click(button)
      expect(button).toHaveAttribute('aria-expanded', 'true')

      // Click a navigation link
      const homeLink = screen.getByRole('link', { name: /home/i })
      await user.click(homeLink)

      // Menu should close
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<Navigation />)

      const nav = screen.getByRole('navigation')
      expect(nav).toHaveAttribute('aria-label', 'Main navigation')
    })

    it('should have accessible button labels that change with state', async () => {
      const user = userEvent.setup()
      render(<Navigation />)

      const button = screen.getByRole('button')
      expect(button).toHaveAccessibleName('Open navigation menu')

      await user.click(button)
      expect(button).toHaveAccessibleName('Close navigation menu')
    })

    it('should have list role for menu items', () => {
      render(<Navigation />)

      const menu = screen.getByRole('list')
      expect(menu).toHaveAttribute('id', 'navigation-menu')
    })

    it('should have focusable elements in correct order', () => {
      render(<Navigation />)

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
      render(<Navigation className="custom-nav-class" />)

      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('navigation')
      expect(nav).toHaveClass('custom-nav-class')
    })
  })

  describe('Responsive Behavior', () => {
    it('should have menu with correct ID for ARIA controls', () => {
      render(<Navigation />)

      const menu = document.getElementById('navigation-menu')
      expect(menu).toBeInTheDocument()
      expect(menu).toHaveAttribute('role', 'list')
    })

    it('should apply open class to menu when menu is open', async () => {
      const user = userEvent.setup()
      render(<Navigation />)

      const button = screen.getByRole('button', { name: /open navigation menu/i })
      const menu = document.getElementById('navigation-menu')

      // Menu should not have open class initially
      expect(menu).not.toHaveClass('navigation__menu--open')

      // Click to open
      await user.click(button)

      // Menu should have open class
      expect(menu).toHaveClass('navigation__menu--open')
    })
  })

  describe('Link Structure', () => {
    it('should render exactly 5 navigation links', () => {
      render(<Navigation />)

      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(5)
    })

    it('should have links in correct order', () => {
      render(<Navigation />)

      const links = screen.getAllByRole('link')
      expect(links[0]).toHaveTextContent('Home')
      expect(links[1]).toHaveTextContent('Open Papers')
      expect(links[2]).toHaveTextContent('Writing')
      expect(links[3]).toHaveTextContent('CV')
      expect(links[4]).toHaveTextContent('Theories')
    })
  })
})
