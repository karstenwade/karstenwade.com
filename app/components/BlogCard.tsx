import Link from 'next/link'
import { Card as ShadcnCard, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { cn } from '@/lib/utils'
import type { BlogPost } from '@/lib/strapi'

export interface BlogCardProps {
  post: BlogPost
  className?: string
}

/**
 * Format a date string for display
 */
function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const BlogCard = ({ post, className = '' }: BlogCardProps) => {
  return (
    <article className={cn('blog-card', className)}>
      <Link
        href={`/blog/${post.slug}`}
        className="block no-underline text-inherit hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-xl transition-all"
        aria-label={`Read ${post.title}`}
      >
        <ShadcnCard className="h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-gray-200">
          <CardHeader className="pt-6 pb-2">
            {/* Category and Reading Time */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              {post.category && (
                <>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                    {post.category}
                  </span>
                  <span aria-hidden="true">·</span>
                </>
              )}
              <span>{post.reading_time} min read</span>
            </div>

            <CardTitle className="blog-card__title">
              <h3 className="text-xl font-semibold leading-tight tracking-tight text-gray-900 line-clamp-2">
                {post.title}
              </h3>
            </CardTitle>
          </CardHeader>

          <CardContent className="blog-card__content pt-0">
            <CardDescription>
              <p className="blog-card__excerpt text-sm text-gray-600 line-clamp-3 mb-4">
                {post.excerpt}
              </p>
            </CardDescription>

            {/* Footer with date and author */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
              <time dateTime={post.published_at || post.created_at}>
                {formatDate(post.published_at || post.created_at)}
              </time>
              {post.author && (
                <span className="font-medium">{post.author}</span>
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-xs text-gray-400">
                    +{post.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </ShadcnCard>
      </Link>
    </article>
  )
}

export default BlogCard
