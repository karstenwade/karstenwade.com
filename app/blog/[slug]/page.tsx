import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { strapiClient } from '@/lib/strapi'
import Navigation from '../../components/Navigation'
import StructuredData from '../../components/StructuredData'

interface BlogPostDetailProps {
  params: Promise<{ slug: string }>
}

// Disable dynamic params - only pre-rendered paths are valid
export const dynamicParams = false

// Generate static params for all blog posts at build time
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const { posts } = await strapiClient.getBlogPosts({ limit: 100 })
    // If no posts, return a placeholder that will 404
    if (posts.length === 0) {
      return [{ slug: '__placeholder__' }]
    }
    return posts.map((post) => ({
      slug: post.slug,
    }))
  } catch {
    // Return placeholder on error
    return [{ slug: '__placeholder__' }]
  }
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: BlogPostDetailProps): Promise<Metadata> {
  const { slug } = await params
  const post = await strapiClient.getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found - Karsten Wade',
    }
  }

  return {
    title: `${post.title} - Karsten Wade`,
    description: post.excerpt,
    keywords: [...(post.tags || []), 'blog', post.category].filter(Boolean) as string[],
    authors: [{ name: post.author || 'Karsten Wade' }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `https://karstenwade.com/blog/${slug}`,
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at,
      authors: [post.author || 'Karsten Wade'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPostDetail({ params }: BlogPostDetailProps) {
  const { slug } = await params
  const post = await strapiClient.getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      <Navigation />
      <StructuredData type="blog" data={post} />

      <main className="blog-post max-w-4xl mx-auto px-4 py-8">
        <nav className="blog-post__breadcrumb mb-6">
          <Link
            href="/blog"
            className="text-blue-600 hover:underline"
          >
            &larr; Back to Blog
          </Link>
        </nav>

        <article className="blog-post__article">
          <header className="blog-post__header mb-8">
            <h1 className="blog-post__title text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="blog-post__meta flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              {post.category && (
                <span className="blog-post__category bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {post.category}
                </span>
              )}
              <span className="blog-post__reading-time">
                {post.reading_time} min read
              </span>
              <time className="blog-post__date" dateTime={post.published_at || post.created_at}>
                {formatDate(post.published_at || post.created_at)}
              </time>
            </div>

            {post.author && (
              <p className="blog-post__author text-gray-600 mb-4">
                By <span className="font-medium">{post.author}</span>
              </p>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="blog-post__tags flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="blog-post__tag bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {post.excerpt && (
              <p className="blog-post__excerpt text-lg text-gray-700 leading-relaxed mb-6 italic border-l-4 border-blue-500 pl-4">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Blog post content rendered from markdown */}
          {post.content && (
            <section className="blog-post__content prose prose-lg max-w-none mb-8">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Style headings
                  h1: ({ children }) => (
                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 border-b pb-2">
                      {children}
                    </h2>
                  ),
                  h2: ({ children }) => (
                    <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                      {children}
                    </h3>
                  ),
                  h3: ({ children }) => (
                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                      {children}
                    </h4>
                  ),
                  // Style paragraphs
                  p: ({ children }) => (
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {children}
                    </p>
                  ),
                  // Style lists
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700">
                      {children}
                    </ol>
                  ),
                  // Style links
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-blue-600 hover:underline"
                      target={href?.startsWith('http') ? '_blank' : undefined}
                      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {children}
                    </a>
                  ),
                  // Style blockquotes
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-600">
                      {children}
                    </blockquote>
                  ),
                  // Style code blocks
                  code: ({ className, children }) => {
                    const isInline = !className
                    if (isInline) {
                      return (
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
                          {children}
                        </code>
                      )
                    }
                    return (
                      <code className="block bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                        {children}
                      </code>
                    )
                  },
                  // Style tables
                  table: ({ children }) => (
                    <div className="overflow-x-auto mb-4">
                      <table className="min-w-full border-collapse border border-gray-300">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-300 px-4 py-2">
                      {children}
                    </td>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </section>
          )}

          <footer className="blog-post__footer pt-6 border-t border-gray-200">
            {post.updated_at && post.updated_at !== post.published_at && (
              <p className="blog-post__updated text-sm text-gray-500 mb-4">
                Last updated:{' '}
                <time dateTime={post.updated_at}>
                  {formatDate(post.updated_at)}
                </time>
              </p>
            )}

            <div className="blog-post__share">
              <p className="text-gray-600 mb-2">Share this post:</p>
              <div className="flex gap-4">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://karstenwade.com/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                  aria-label="Share on Twitter"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://karstenwade.com/blog/${post.slug}`)}&title=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-800"
                  aria-label="Share on LinkedIn"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </footer>
        </article>
      </main>
    </>
  )
}
