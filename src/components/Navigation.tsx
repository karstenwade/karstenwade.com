import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

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
    <nav
      className={cn(
        "relative flex flex-col md:flex-col p-4",
        "bg-[var(--color-bg-primary)] border-b border-[var(--color-border-light)]",
        className
      )}
      aria-label="Main navigation"
    >
      {/* Header row with logo and hamburger */}
      <div className="flex items-center justify-between w-full mb-0 md:mb-2">
        {/* Logo */}
        <Link
          to="/"
          className={cn(
            "flex items-center no-underline",
            "transition-opacity duration-200 rounded-sm",
            "hover:opacity-80",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2"
          )}
          aria-label="Karsten Wade - Home"
        >
          <img
            src={`${import.meta.env.BASE_URL}assets/images/logo.png`}
            alt="Karsten Wade"
            className="h-10 md:h-10 w-auto block"
          />
        </Link>

        {/* Mobile hamburger button */}
        <button
        className={cn(
          "hidden md:hidden flex-col justify-center items-center",
          "w-11 h-11 p-2",
          "bg-transparent border-2 border-[var(--color-neutral-400)] rounded-sm",
          "cursor-pointer transition-all duration-200 z-[var(--z-sticky)]",
          "hover:border-[var(--color-primary)] hover:bg-[var(--color-neutral-100)]",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2 focus-visible:border-[var(--color-primary)]",
          "active:bg-[var(--color-neutral-200)]",
          "max-md:flex"
        )}
        onClick={toggleMenu}
        onKeyDown={handleKeyDown}
        aria-expanded={isMenuOpen}
        aria-controls="navigation-menu"
        aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        type="button"
      >
        <span className={cn(
          "flex flex-col w-5",
          isMenuOpen ? "gap-0" : "gap-1"
        )} aria-hidden="true">
          <span className={cn(
            "block w-full h-0.5 bg-[var(--color-neutral-700)]",
            "transition-all duration-300",
            "motion-reduce:transition-none",
            isMenuOpen && "rotate-45 translate-y-0.5"
          )}></span>
          <span className={cn(
            "block w-full h-0.5 bg-[var(--color-neutral-700)]",
            "transition-all duration-300",
            "motion-reduce:transition-none",
            isMenuOpen && "opacity-0"
          )}></span>
          <span className={cn(
            "block w-full h-0.5 bg-[var(--color-neutral-700)]",
            "transition-all duration-300",
            "motion-reduce:transition-none",
            isMenuOpen && "-rotate-45 -translate-y-0.5"
          )}></span>
        </span>
      </button>
      </div>

      {/* Navigation menu - below header, flush left on desktop */}
      <ul
        id="navigation-menu"
        className={cn(
          // Base desktop styles - flush left, below header
          "flex gap-2 list-none m-0 p-0",
          // Desktop - hidden on mobile, shown as horizontal row on desktop
          "hidden md:flex md:flex-row",
          // Mobile - fixed sidebar
          "max-md:fixed max-md:top-0 max-md:right-0 max-md:bottom-0",
          "max-md:flex max-md:flex-col max-md:gap-0",
          "max-md:w-[280px] max-md:max-w-[80vw]",
          "max-md:pt-16 max-md:px-4 max-md:pb-8",
          "max-md:bg-[var(--color-bg-primary)]",
          "max-md:border-l max-md:border-[var(--color-border-medium)]",
          "max-md:shadow-[var(--shadow-xl)]",
          "max-md:z-[var(--z-fixed)]",
          "max-md:overflow-y-auto",
          // Mobile - slide animation
          "max-md:transition-transform max-md:duration-300",
          "max-md:motion-reduce:transition-none",
          isMenuOpen ? "max-md:translate-x-0" : "max-md:translate-x-full"
        )}
        role="list"
      >
        {navLinks.map((link, index) => (
          <li
            key={link.href}
            className={cn(
              "m-0",
              "max-md:border-b max-md:border-[var(--color-border-light)]",
              index === navLinks.length - 1 && "max-md:border-b-0"
            )}
          >
            <Link
              to={link.href}
              className={cn(
                "block px-4 py-3",
                "font-[var(--font-body)] text-base font-medium",
                "text-[var(--color-text-primary)] no-underline",
                "rounded-sm transition-all duration-200",
                "motion-reduce:transition-none",
                "hover:text-[var(--color-primary)] hover:bg-[var(--color-neutral-100)] hover:no-underline",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2",
                "active:bg-[var(--color-neutral-200)]",
                "md:whitespace-nowrap",
                "max-md:py-4 max-md:text-base"
              )}
              onClick={closeMenu}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation
