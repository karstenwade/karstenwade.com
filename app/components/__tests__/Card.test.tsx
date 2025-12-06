import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card from '../Card'

describe('Card', () => {
  const defaultProps = {
    title: 'Test Card',
    description: 'This is a test description',
    link: '/test-link',
  }

  it('renders card with title and description', () => {
    render(<Card {...defaultProps} />)

    expect(screen.getByRole('article')).toBeInTheDocument()
    expect(screen.getByText('Test Card')).toBeInTheDocument()
    expect(screen.getByText('This is a test description')).toBeInTheDocument()
  })

  it('renders internal link without target="_blank"', () => {
    render(<Card {...defaultProps} />)

    const link = screen.getByRole('link', { name: 'Test Card' })
    expect(link).toHaveAttribute('href', '/test-link')
    expect(link).not.toHaveAttribute('target')
    expect(link).not.toHaveAttribute('rel')
  })

  it('renders external link with target="_blank"', () => {
    render(<Card {...defaultProps} link="https://example.com" />)

    const link = screen.getByRole('link', { name: 'Test Card' })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('respects external prop for non-http links', () => {
    render(<Card {...defaultProps} link="/internal" external={true} />)

    const link = screen.getByRole('link', { name: 'Test Card' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders image when provided', () => {
    render(<Card {...defaultProps} image="/test-image.jpg" />)

    const img = screen.getByRole('img', { name: 'Test Card' })
    expect(img).toHaveAttribute('src', '/test-image.jpg')
    expect(img).toHaveAttribute('loading', 'lazy')
  })

  it('does not render image when not provided', () => {
    render(<Card {...defaultProps} />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Card {...defaultProps} className="custom-class" />)

    const article = screen.getByRole('article')
    expect(article).toHaveClass('custom-class')
  })

  it('has accessible link with aria-label', () => {
    render(<Card {...defaultProps} />)

    const link = screen.getByRole('link', { name: 'Test Card' })
    expect(link).toHaveAttribute('aria-label', 'Test Card')
  })
})
