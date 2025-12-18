import type { Metadata } from 'next'
import { Suspense } from 'react'
import Navigation from '../components/Navigation'
import BlogListClient from '../components/BlogListClient'
import { strapiClient } from '@/lib/strapi'

export const metadata: Metadata = {
  title: 'Blog - Karsten Wade',
  description: 'Thoughts on open source, community building, AI collaboration, and technology',
  keywords: ['blog', 'open source', 'community', 'AI', 'technology', 'Karsten Wade'],
  openGraph: {
    url: 'https://karstenwade.com/blog',
  },
}

// Server Component - data fetched at build time
export default async function Blog() {
  // Fetch all blog posts for client-side filtering
  const { posts } = await strapiClient.getBlogPosts({ limit: 100 })

  return (
    <>
      <Navigation />
      <main id="main-content" className="blog max-w-4xl mx-auto px-4 py-8">
        <div className="blog__header text-center mb-8">
          <h1 className="blog__title text-4xl font-bold text-gray-900 mb-2">Blog</h1>
          <p className="blog__description text-xl text-gray-600">
            Thoughts on open source, community building, and technology
          </p>
        </div>

        {posts.length > 0 ? (
          /* Client component handles filtering, pagination, and URL state */
          <Suspense fallback={<div className="text-center py-8">Loading posts...</div>}>
            <BlogListClient posts={posts} postsPerPage={10} />
          </Suspense>
        ) : (
          /* Empty state when no posts */
          <div className="blog__empty text-center py-16">
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Coming Soon</h2>
              <p className="text-gray-600 mb-4">
                Blog posts are being migrated to a new CMS-powered system.
              </p>
              <p className="text-gray-500 text-sm">
                In the meantime, check out my{' '}
                <a href="/papers" className="text-blue-600 hover:underline">Open Papers</a>
                {' '}or{' '}
                <a href="/writing" className="text-blue-600 hover:underline">Writing</a>.
              </p>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
