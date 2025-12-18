'use client'

import { useMemo, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type { BlogPost } from '@/lib/strapi'
import BlogCard from './BlogCard'
import BlogFilters from './BlogFilters'
import Pagination from './Pagination'

interface BlogListClientProps {
  posts: BlogPost[]
  postsPerPage?: number
}

export default function BlogListClient({
  posts,
  postsPerPage = 10,
}: BlogListClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Read filter state from URL
  const selectedCategory = searchParams.get('category')
  const selectedTags = useMemo(() => {
    const tagsParam = searchParams.get('tags')
    return tagsParam ? tagsParam.split(',') : []
  }, [searchParams])
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  // Extract unique categories and tags from posts
  const categories = useMemo(() => {
    const cats = new Set<string>()
    posts.forEach((post) => {
      if (post.category) cats.add(post.category)
    })
    return Array.from(cats).sort()
  }, [posts])

  const tags = useMemo(() => {
    const allTags = new Set<string>()
    posts.forEach((post) => {
      post.tags?.forEach((tag) => allTags.add(tag))
    })
    return Array.from(allTags).sort()
  }, [posts])

  // Filter posts based on selected filters
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Category filter
      if (selectedCategory && post.category !== selectedCategory) {
        return false
      }

      // Tag filter (OR logic - post must have at least one selected tag)
      if (selectedTags.length > 0) {
        const postTags = post.tags || []
        const hasMatchingTag = selectedTags.some((tag) => postTags.includes(tag))
        if (!hasMatchingTag) {
          return false
        }
      }

      return true
    })
  }, [posts, selectedCategory, selectedTags])

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const validPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages))
  const startIndex = (validPage - 1) * postsPerPage
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage)

  // Update URL with new params
  const updateUrl = useCallback(
    (params: Record<string, string | null>) => {
      const newParams = new URLSearchParams(searchParams.toString())

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === '') {
          newParams.delete(key)
        } else {
          newParams.set(key, value)
        }
      })

      const queryString = newParams.toString()
      router.push(queryString ? `?${queryString}` : '', { scroll: false })
    },
    [searchParams, router]
  )

  // Handler for category change
  const handleCategoryChange = useCallback(
    (category: string | null) => {
      updateUrl({ category, page: null }) // Reset page on filter change
    },
    [updateUrl]
  )

  // Handler for tag change (toggle)
  const handleTagChange = useCallback(
    (tag: string) => {
      const newTags = selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag]

      updateUrl({
        tags: newTags.length > 0 ? newTags.join(',') : null,
        page: null, // Reset page on filter change
      })
    },
    [selectedTags, updateUrl]
  )

  // Handler for clearing all filters
  const handleClearFilters = useCallback(() => {
    updateUrl({ category: null, tags: null, page: null })
  }, [updateUrl])

  // Handler for page change
  const handlePageChange = useCallback(
    (page: number) => {
      updateUrl({ page: page.toString() })
    },
    [updateUrl]
  )

  return (
    <div className="blog-list">
      {/* Filters */}
      <BlogFilters
        categories={categories}
        tags={tags}
        selectedCategory={selectedCategory}
        selectedTags={selectedTags}
        onCategoryChange={handleCategoryChange}
        onTagChange={handleTagChange}
        onClearFilters={handleClearFilters}
      />

      {/* Results count */}
      <p className="text-sm text-gray-600 mb-4">
        Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
      </p>

      {/* Posts grid or empty state */}
      {paginatedPosts.length > 0 ? (
        <div className="blog__grid grid gap-6 md:grid-cols-2">
          {paginatedPosts.map((post) => (
            <BlogCard key={post.id || post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">No posts found matching your filters.</p>
          <button
            onClick={handleClearFilters}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={validPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
