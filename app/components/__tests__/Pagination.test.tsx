/**
 * Pagination Component Tests
 * Story 16.5c: Add blog filtering and pagination
 *
 * RED PHASE: These tests define the expected behavior.
 * The Pagination component does not exist yet.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Pagination from '../Pagination'

describe('Pagination Component', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders current page indicator', () => {
      render(<Pagination {...defaultProps} />)
      expect(screen.getByText('Page 1 of 5')).toBeInTheDocument()
    })

    it('renders previous button', () => {
      render(<Pagination {...defaultProps} />)
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
    })

    it('renders next button', () => {
      render(<Pagination {...defaultProps} />)
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    })

    it('disables previous button on first page', () => {
      render(<Pagination {...defaultProps} currentPage={1} />)
      expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
    })

    it('disables next button on last page', () => {
      render(<Pagination {...defaultProps} currentPage={5} />)
      expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
    })

    it('enables both buttons on middle pages', () => {
      render(<Pagination {...defaultProps} currentPage={3} />)
      expect(screen.getByRole('button', { name: /previous/i })).not.toBeDisabled()
      expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled()
    })

    it('does not render when totalPages is 1', () => {
      const { container } = render(<Pagination {...defaultProps} totalPages={1} />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('navigation', () => {
    it('calls onPageChange with previous page when clicking previous', () => {
      const onPageChange = vi.fn()
      render(<Pagination {...defaultProps} currentPage={3} onPageChange={onPageChange} />)

      fireEvent.click(screen.getByRole('button', { name: /previous/i }))
      expect(onPageChange).toHaveBeenCalledWith(2)
    })

    it('calls onPageChange with next page when clicking next', () => {
      const onPageChange = vi.fn()
      render(<Pagination {...defaultProps} currentPage={3} onPageChange={onPageChange} />)

      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      expect(onPageChange).toHaveBeenCalledWith(4)
    })

    it('does not call onPageChange when clicking disabled previous', () => {
      const onPageChange = vi.fn()
      render(<Pagination {...defaultProps} currentPage={1} onPageChange={onPageChange} />)

      fireEvent.click(screen.getByRole('button', { name: /previous/i }))
      expect(onPageChange).not.toHaveBeenCalled()
    })

    it('does not call onPageChange when clicking disabled next', () => {
      const onPageChange = vi.fn()
      render(<Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />)

      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      expect(onPageChange).not.toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('has proper aria-label on pagination nav', () => {
      render(<Pagination {...defaultProps} />)
      expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument()
    })

    it('has aria-current on current page indicator', () => {
      render(<Pagination {...defaultProps} currentPage={3} />)
      expect(screen.getByText('Page 3 of 5')).toHaveAttribute('aria-current', 'page')
    })
  })
})
