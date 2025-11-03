import { useState } from 'react'
import './Navigation.css'

interface NavigationProps {
  className?: string
}

const Navigation = ({ className = '' }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  // Handle keyboard navigation for menu toggle
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleMenu()
    }
    // Close menu on Escape
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu()
    }
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Open Papers', href: '/papers' },
    { name: 'Writing', href: '/writing' },
    { name: 'CV', href: '/cv' },
    { name: 'Theories', href: '/theories' },
  ]

  return (
    <nav className={`navigation ${className}`} aria-label="Main navigation">
      {/* Mobile hamburger button */}
      <button
        className="navigation__hamburger"
        onClick={toggleMenu}
        onKeyDown={handleKeyDown}
        aria-expanded={isMenuOpen}
        aria-controls="navigation-menu"
        aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        type="button"
      >
        <span className="navigation__hamburger-icon" aria-hidden="true">
          <span className="navigation__hamburger-line"></span>
          <span className="navigation__hamburger-line"></span>
          <span className="navigation__hamburger-line"></span>
        </span>
      </button>

      {/* Navigation menu */}
      <ul
        id="navigation-menu"
        className={`navigation__menu ${isMenuOpen ? 'navigation__menu--open' : ''}`}
        role="list"
      >
        {navLinks.map((link) => (
          <li key={link.href} className="navigation__item">
            <a
              href={link.href}
              className="navigation__link"
              onClick={closeMenu}
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation
