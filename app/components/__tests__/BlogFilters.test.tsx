/**
 * BlogFilters Component Tests
 * Story 16.5c: Add blog filtering and pagination
 *
 * RED PHASE: These tests define the expected behavior.
 * The BlogFilters component does not exist yet.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BlogFilters from '../BlogFilters'

describe('BlogFilters Component', () => {
  const defaultProps = {
    categories: ['Technology', 'Open Source', 'Community'],
    tags: ['AI', 'Linux', 'DevOps', 'Culture'],
    selectedCategory: null as string | null,
    selectedTags: [] as string[],
    onCategoryChange: vi.fn(),
    onTagChange: vi.fn(),
    onClearFilters: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('category filtering', () => {
    it('renders category dropdown', () => {
      render(<BlogFilters {...defaultProps} />)
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
    })

    it('renders all categories as options', () => {
      render(<BlogFilters {...defaultProps} />)
      const select = screen.getByLabelText(/category/i)
      expect(select).toBeInTheDocument()

      // Check for "All Categories" option
      expect(screen.getByRole('option', { name: /all categories/i })).toBeInTheDocument()

      // Check for each category
      defaultProps.categories.forEach(category => {
        expect(screen.getByRole('option', { name: category })).toBeInTheDocument()
      })
    })

    it('shows selected category', () => {
      render(<BlogFilters {...defaultProps} selectedCategory="Technology" />)
      const select = screen.getByLabelText(/category/i) as HTMLSelectElement
      expect(select.value).toBe('Technology')
    })

    it('calls onCategoryChange when category is selected', () => {
      const onCategoryChange = vi.fn()
      render(<BlogFilters {...defaultProps} onCategoryChange={onCategoryChange} />)

      fireEvent.change(screen.getByLabelText(/category/i), {
        target: { value: 'Open Source' },
      })

      expect(onCategoryChange).toHaveBeenCalledWith('Open Source')
    })

    it('calls onCategoryChange with null when "All Categories" is selected', () => {
      const onCategoryChange = vi.fn()
      render(
        <BlogFilters
          {...defaultProps}
          selectedCategory="Technology"
          onCategoryChange={onCategoryChange}
        />
      )

      fireEvent.change(screen.getByLabelText(/category/i), {
        target: { value: '' },
      })

      expect(onCategoryChange).toHaveBeenCalledWith(null)
    })
  })

  describe('tag filtering', () => {
    it('renders tag filter section', () => {
      render(<BlogFilters {...defaultProps} />)
      expect(screen.getByText(/tags/i)).toBeInTheDocument()
    })

    it('renders all tags as checkable items', () => {
      render(<BlogFilters {...defaultProps} />)

      defaultProps.tags.forEach(tag => {
        expect(screen.getByLabelText(tag)).toBeInTheDocument()
      })
    })

    it('shows selected tags as checked', () => {
      render(<BlogFilters {...defaultProps} selectedTags={['AI', 'Linux']} />)

      expect(screen.getByLabelText('AI')).toBeChecked()
      expect(screen.getByLabelText('Linux')).toBeChecked()
      expect(screen.getByLabelText('DevOps')).not.toBeChecked()
    })

    it('calls onTagChange when tag is clicked', () => {
      const onTagChange = vi.fn()
      render(<BlogFilters {...defaultProps} onTagChange={onTagChange} />)

      fireEvent.click(screen.getByLabelText('AI'))
      expect(onTagChange).toHaveBeenCalledWith('AI')
    })

    it('calls onTagChange when selected tag is unchecked', () => {
      const onTagChange = vi.fn()
      render(
        <BlogFilters
          {...defaultProps}
          selectedTags={['AI']}
          onTagChange={onTagChange}
        />
      )

      fireEvent.click(screen.getByLabelText('AI'))
      expect(onTagChange).toHaveBeenCalledWith('AI')
    })
  })

  describe('clear filters', () => {
    it('renders clear filters button when filters are active', () => {
      render(<BlogFilters {...defaultProps} selectedCategory="Technology" />)
      expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument()
    })

    it('renders clear filters button when tags are selected', () => {
      render(<BlogFilters {...defaultProps} selectedTags={['AI']} />)
      expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument()
    })

    it('does not render clear filters button when no filters are active', () => {
      render(<BlogFilters {...defaultProps} />)
      expect(screen.queryByRole('button', { name: /clear filters/i })).not.toBeInTheDocument()
    })

    it('calls onClearFilters when clear button is clicked', () => {
      const onClearFilters = vi.fn()
      render(
        <BlogFilters
          {...defaultProps}
          selectedCategory="Technology"
          onClearFilters={onClearFilters}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /clear filters/i }))
      expect(onClearFilters).toHaveBeenCalled()
    })
  })

  describe('active filter count', () => {
    it('shows count of active filters', () => {
      render(
        <BlogFilters
          {...defaultProps}
          selectedCategory="Technology"
          selectedTags={['AI', 'Linux']}
        />
      )

      // Should show "3 filters active" (1 category + 2 tags)
      expect(screen.getByText(/3 filters? active/i)).toBeInTheDocument()
    })

    it('does not show count when no filters active', () => {
      render(<BlogFilters {...defaultProps} />)
      expect(screen.queryByText(/filters? active/i)).not.toBeInTheDocument()
    })
  })

  describe('empty states', () => {
    it('handles empty categories gracefully', () => {
      render(<BlogFilters {...defaultProps} categories={[]} />)
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
      // Should still have "All Categories" option
      expect(screen.getByRole('option', { name: /all categories/i })).toBeInTheDocument()
    })

    it('handles empty tags gracefully', () => {
      render(<BlogFilters {...defaultProps} tags={[]} />)
      // Should not show tags section or show "No tags available"
      expect(screen.queryByText(/tags/i)).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('has proper form labeling', () => {
      render(<BlogFilters {...defaultProps} />)
      expect(screen.getByRole('group', { name: /filter posts/i })).toBeInTheDocument()
    })

    it('tags have proper checkbox role', () => {
      render(<BlogFilters {...defaultProps} />)
      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes.length).toBe(defaultProps.tags.length)
    })
  })
})
