import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Navigation from '../Navigation'

describe('Navigation', () => {
  it('renders navigation with all links', () => {
    render(<Navigation />)

    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Open Papers')).toBeInTheDocument()
    expect(screen.getByText('Writing')).toBeInTheDocument()
    expect(screen.getByText('CV')).toBeInTheDocument()
  })

  it('renders logo with correct link', () => {
    render(<Navigation />)

    const logoLink = screen.getByRole('link', { name: /karsten wade - home/i })
    expect(logoLink).toHaveAttribute('href', '/')
  })

  it('has correct navigation link hrefs', () => {
    render(<Navigation />)

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Open Papers' })).toHaveAttribute('href', '/papers')
    expect(screen.getByRole('link', { name: 'Writing' })).toHaveAttribute('href', '/writing')
    expect(screen.getByRole('link', { name: 'CV' })).toHaveAttribute('href', '/cv')
  })

  it('renders mobile menu button with correct aria attributes', () => {
    render(<Navigation />)

    const menuButton = screen.getByRole('button', { name: /open navigation menu/i })
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    expect(menuButton).toHaveAttribute('aria-controls', 'navigation-menu')
  })

  it('toggles mobile menu on button click', () => {
    render(<Navigation />)

    const menuButton = screen.getByRole('button', { name: /open navigation menu/i })

    // Initial state - menu closed
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')

    // Click to open
    fireEvent.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')

    // Click to close
    fireEvent.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('applies custom className', () => {
    render(<Navigation className="custom-class" />)

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('custom-class')
  })

  it('has accessible navigation landmark', () => {
    render(<Navigation />)

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'Main navigation')
  })
})
