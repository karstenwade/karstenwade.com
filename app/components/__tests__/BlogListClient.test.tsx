/**
 * BlogListClient Component Tests
 * Story 16.5c: Add blog filtering and pagination
 *
 * RED PHASE: These tests define the expected behavior.
 * The BlogListClient component does not exist yet.
 *
 * This is the client-side component that handles:
 * - Filtering posts by category and tags
 * - Pagination
 * - URL state management
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useSearchParams, useRouter } from 'next/navigation'
import BlogListClient from '../BlogListClient'
import type { BlogPost } from '@/lib/strapi'

// Mock Next.js navigation with stateful URL tracking
let currentSearchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(() => currentSearchParams),
  useRouter: vi.fn(() => ({
    push: vi.fn((url: string) => {
      // Extract query string and update currentSearchParams
      const queryString = url.startsWith('?') ? url.slice(1) : url.includes('?') ? url.split('?')[1] : ''
      currentSearchParams = new URLSearchParams(queryString)
    }),
  })),
}))

const mockPosts: BlogPost[] = [
  {
    id: '1',
    strapi_id: 1,
    title: 'Post about AI',
    slug: 'post-about-ai',
    excerpt: 'AI excerpt',
    content: 'AI content',
    reading_time: 5,
    published_at: '2024-01-15',
    created_at: '2024-01-15',
    updated_at: '2024-01-15',
    author: 'Karsten',
    category: 'Technology',
    tags: ['AI', 'ML'],
  },
  {
    id: '2',
    strapi_id: 2,
    title: 'Post about Open Source',
    slug: 'post-about-open-source',
    excerpt: 'OS excerpt',
    content: 'OS content',
    reading_time: 8,
    published_at: '2024-01-10',
    created_at: '2024-01-10',
    updated_at: '2024-01-10',
    author: 'Karsten',
    category: 'Open Source',
    tags: ['Linux', 'Community'],
  },
  {
    id: '3',
    strapi_id: 3,
    title: 'Post about Community',
    slug: 'post-about-community',
    excerpt: 'Community excerpt',
    content: 'Community content',
    reading_time: 6,
    published_at: '2024-01-05',
    created_at: '2024-01-05',
    updated_at: '2024-01-05',
    author: 'Karsten',
    category: 'Community',
    tags: ['Community', 'Culture'],
  },
  {
    id: '4',
    strapi_id: 4,
    title: 'Another Tech Post',
    slug: 'another-tech-post',
    excerpt: 'Tech excerpt',
    content: 'Tech content',
    reading_time: 4,
    published_at: '2024-01-01',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    author: 'Karsten',
    category: 'Technology',
    tags: ['DevOps'],
  },
]

describe('BlogListClient Component', () => {
  const mockRouterPush = vi.fn()

  // Helper to set URL params for a test
  const setSearchParams = (params: string) => {
    currentSearchParams = new URLSearchParams(params)
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset URL state
    currentSearchParams = new URLSearchParams()

    // Set up router mock that updates currentSearchParams
    mockRouterPush.mockImplementation((url: string) => {
      const queryString = url.startsWith('?') ? url.slice(1) : url.includes('?') ? url.split('?')[1] : ''
      currentSearchParams = new URLSearchParams(queryString)
    })

    ;(useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockRouterPush,
    })
    ;(useSearchParams as ReturnType<typeof vi.fn>).mockImplementation(
      () => currentSearchParams
    )
  })

  describe('rendering', () => {
    it('renders all posts when no filters applied', () => {
      render(<BlogListClient posts={mockPosts} postsPerPage={10} />)

      mockPosts.forEach(post => {
        expect(screen.getByText(post.title)).toBeInTheDocument()
      })
    })

    it('renders BlogFilters component', () => {
      render(<BlogListClient posts={mockPosts} postsPerPage={10} />)
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
    })

    it('extracts unique categories from posts', () => {
      render(<BlogListClient posts={mockPosts} postsPerPage={10} />)

      expect(screen.getByRole('option', { name: 'Technology' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Open Source' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Community' })).toBeInTheDocument()
    })

    it('extracts unique tags from posts', () => {
      render(<BlogListClient posts={mockPosts} postsPerPage={10} />)

      // All unique tags should be present
      expect(screen.getByLabelText('AI')).toBeInTheDocument()
      expect(screen.getByLabelText('ML')).toBeInTheDocument()
      expect(screen.getByLabelText('Linux')).toBeInTheDocument()
      expect(screen.getByLabelText('Community')).toBeInTheDocument()
      expect(screen.getByLabelText('Culture')).toBeInTheDocument()
      expect(screen.getByLabelText('DevOps')).toBeInTheDocument()
    })
  })

  describe('category filtering', () => {
    it('filters posts by selected category', () => {
      // Set URL params before rendering to test filtering
      setSearchParams('category=Technology')
      render(<BlogListClient posts={mockPosts} postsPerPage={10} />)

      // Should show only Technology posts
      expect(screen.getByText('Post about AI')).toBeInTheDocument()
      expect(screen.getByText('Another Tech Post')).toBeInTheDocument()
      expect(screen.queryByText('Post about Open Source')).not.toBeInTheDocument()
      expect(screen.queryByText('Post about Community')).not.toBeInTheDocument()
    })

    it('shows all posts when category filter is cleared', () => {
      // Start with no filters
      render(<BlogListClient posts={mockPosts} postsPerPage={10} />)

      // All posts should be visible
      mockPosts.forEach(post => {
        expect(screen.getByText(post.title)).toBeInTheDocument()
      })
    })

    it('updates URL when category is changed', () => {
      render(<BlogListClient posts={mockPosts} postsPerPage={10} />)

      fireEvent.change(screen.getByLabelText(/category/i), {
        target: { value: 'Technology' },
      })

      expect(mockRouterPush).toHaveBeenCalledWith(
        expect.stringContaining('category=Technology'),
        { scroll: false }
      )
    })
  })

  describe('tag filtering', () => {
    it('filters posts by selected tag', () => {
      // Set URL params to test filtering with tag
      setSearchParams('tags=AI')
      render(<BlogListClient posts={mockPosts} postsPerPage={10} />)

      // Should show only posts with AI tag
      expect(screen.getByText('Post about AI')).toBeInTheDocument()
      expect(screen.queryByText('Post about Open Source')).not.toBeInTheDocument()
    })

    it('filters posts by multiple tags (OR logic)', () => {
      // Set URL params with multiple tags
      setSearchParams('tags=AI,Linux')
      render(<BlogListClient posts={mockPosts} postsPerPage={10} />)

      // Should show posts with AI OR Linux
      expect(screen.getByText('Post about AI')).toBeInTheDocument()
      expect(screen.getByText('Post about Open Source')).toBeInTheDocument()
      expect(screen.queryByText('Another Tech Post')).not.toBeInTheDocument()
    })

    it('combines category and tag filters (AND logic)', () => {
      // Set URL params with category AND tag
      setSearchParams('category=Community&tags=Culture')
      render(<BlogListClient posts={mockPosts} postsPerPage={10} />)

      // Should show only Community category posts with Culture tag
      expect(screen.getByText('Post about Community')).toBeInTheDocument()
      expect(screen.queryByText('Post about AI')).not.toBeInTheDocument()
    })

    it('updates URL when tag is clicked', () => {
      render(<BlogListClient posts={mockPosts} postsPerPage={10} />)

      fireEvent.click(screen.getByLabelText('AI'))

      expect(mockRouterPush).toHaveBeenCalledWith(
        expect.stringContaining('tags=AI'),
        { scroll: false }
      )
    })
  })

  describe('pagination', () => {
    it('paginates posts', () => {
      render(<BlogListClient posts={mockPosts} postsPerPage={2} />)

      // Should show first 2 posts only
      expect(screen.getByText('Post about AI')).toBeInTheDocument()
      expect(screen.getByText('Post about Open Source')).toBeInTheDocument()
      expect(screen.queryByText('Post about Community')).not.toBeInTheDocument()
    })

    it('renders pagination controls when posts exceed page size', () => {
      render(<BlogListClient posts={mockPosts} postsPerPage={2} />)

      expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument()
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
    })

    it('does not render pagination when all posts fit on one page', () => {
      render(<BlogListClient posts={mockPosts} postsPerPage={10} />)

      expect(screen.queryByRole('navigation', { name: /pagination/i })).not.toBeInTheDocument()
    })

    it('shows page 2 posts when page=2 in URL', () => {
      setSearchParams('page=2')
      render(<BlogListClient posts={mockPosts} postsPerPage={2} />)

      // Should show page 2 posts
      expect(screen.queryByText('Post about AI')).not.toBeInTheDocument()
      expect(screen.getByText('Post about Community')).toBeInTheDocument()
      expect(screen.getByText('Another Tech Post')).toBeInTheDocument()
    })

    it('updates URL when next page button is clicked', () => {
      render(<BlogListClient posts={mockPosts} postsPerPage={2} />)

      fireEvent.click(screen.getByRole('button', { name: /next/i }))

      expect(mockRouterPush).toHaveBeenCalledWith(
        expect.stringContaining('page=2'),
        { scroll: false }
      )
    })

    it('resets page param when filters change', () => {
      render(<BlogListClient posts={mockPosts} postsPerPage={2} />)

      // Change category filter
      fireEvent.change(screen.getByLabelText(/category/i), {
        target: { value: 'Technology' },
      })

      // Should not include page param (reset to page 1)
      expect(mockRouterPush).toHaveBeenCalled()
      const call = mockRouterPush.mock.calls[0][0]
      expect(call).not.toContain('page=')
    })
  })

  describe('URL state management', () => {
    it('reads initial category filter from URL params', () => {
      setSearchParams('category=Technology')
      render(<BlogListClient posts={mockPosts} postsPerPage={10} />)

      // Should filter by category from URL
      expect(screen.getByText('Post about AI')).toBeInTheDocument()
      expect(screen.queryByText('Post about Open Source')).not.toBeInTheDocument()
    })

    it('reads tag filters from URL params', () => {
      setSearchParams('tags=AI,Linux')
      render(<BlogListClient posts={mockPosts} postsPerPage={10} />)

      // Should filter by tags from URL
      expect(screen.getByText('Post about AI')).toBeInTheDocument()
      expect(screen.getByText('Post about Open Source')).toBeInTheDocument()
    })

    it('reads page number from URL params', () => {
      setSearchParams('page=2')
      render(<BlogListClient posts={mockPosts} postsPerPage={2} />)

      // Should show page 2
      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()
    })

    it('updates URL when category filter changes', () => {
      render(<BlogListClient posts={mockPosts} postsPerPage={10} />)

      fireEvent.change(screen.getByLabelText(/category/i), {
        target: { value: 'Technology' },
      })

      expect(mockRouterPush).toHaveBeenCalledWith(
        expect.stringContaining('category=Technology'),
        { scroll: false }
      )
    })

    it('updates URL when tag filter changes', () => {
      render(<BlogListClient posts={mockPosts} postsPerPage={10} />)

      fireEvent.click(screen.getByLabelText('AI'))

      expect(mockRouterPush).toHaveBeenCalledWith(
        expect.stringContaining('tags=AI'),
        { scroll: false }
      )
    })

    it('updates URL when page changes', () => {
      render(<BlogListClient posts={mockPosts} postsPerPage={2} />)

      fireEvent.click(screen.getByRole('button', { name: /next/i }))

      expect(mockRouterPush).toHaveBeenCalledWith(
        expect.stringContaining('page=2'),
        { scroll: false }
      )
    })
  })

  describe('results count', () => {
    it('shows total results count', () => {
      render(<BlogListClient posts={mockPosts} postsPerPage={10} />)

      expect(screen.getByText(/showing 4 posts/i)).toBeInTheDocument()
    })

    it('shows filtered results count when category is set', () => {
      setSearchParams('category=Technology')
      render(<BlogListClient posts={mockPosts} postsPerPage={10} />)

      expect(screen.getByText(/showing 2 posts/i)).toBeInTheDocument()
    })
  })

  describe('empty state', () => {
    it('shows empty state when no posts match filters', () => {
      // Technology category with Culture tag = no matches
      setSearchParams('category=Technology&tags=Culture')
      render(<BlogListClient posts={mockPosts} postsPerPage={10} />)

      expect(screen.getByText(/no posts found/i)).toBeInTheDocument()
    })

    it('shows clear filters button in empty state', () => {
      // Technology category with Culture tag = no matches
      setSearchParams('category=Technology&tags=Culture')
      render(<BlogListClient posts={mockPosts} postsPerPage={10} />)

      // There are two clear filters buttons - one in filters, one in empty state
      // Verify both exist
      const clearButtons = screen.getAllByRole('button', { name: /clear filters/i })
      expect(clearButtons.length).toBe(2)
    })
  })
})
