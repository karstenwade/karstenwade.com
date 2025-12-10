import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { papers } from '@/data/papers'
import { getPaperBySlug } from '@/services/paperService'
import Navigation from '../../components/Navigation'
import StructuredData from '../../components/StructuredData'
import PdfDownloadButton from '../../components/PdfDownloadButton'

interface PaperDetailProps {
  params: Promise<{ slug: string }>
}

// Generate static params for all papers at build time
export async function generateStaticParams() {
  return papers
    .filter(paper => paper.slug)
    .map(paper => ({
      slug: paper.slug!,
    }))
}

// Generate metadata for each paper
export async function generateMetadata({ params }: PaperDetailProps): Promise<Metadata> {
  const { slug } = await params
  const paper = papers.find(p => p.slug === slug)

  if (!paper) {
    return {
      title: 'Paper Not Found - Karsten Wade',
    }
  }

  return {
    title: `${paper.title} - Karsten Wade`,
    description: paper.abstract,
    keywords: [...paper.tags, 'research paper', paper.category],
    openGraph: {
      title: paper.title,
      description: paper.abstract,
      url: `https://karstenwade.com/papers/${slug}`,
    },
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function PaperDetail({ params }: PaperDetailProps) {
  const { slug } = await params

  // Try to fetch full content from GitHub
  let paper = papers.find(p => p.slug === slug)
  let markdownContent: string | null = null

  try {
    const result = await getPaperBySlug(slug)
    paper = result.paper
    markdownContent = result.markdown
  } catch {
    // Fall back to static paper data if GitHub fetch fails
    if (!paper) {
      notFound()
    }
  }

  if (!paper) {
    notFound()
  }

  return (
    <>
      <Navigation />
      <StructuredData type="paper" data={paper} />

      <main className="paper-detail max-w-4xl mx-auto px-4 py-8">
        <nav className="paper-detail__breadcrumb mb-6">
          <Link
            href="/papers"
            className="text-blue-600 hover:underline"
          >
            &larr; Back to Papers
          </Link>
        </nav>

        <article className="paper-detail__article">
          <header className="paper-detail__header mb-8">
            <h1 className="paper-detail__title text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {paper.title}
            </h1>

            <div className="paper-detail__meta flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <span className="paper-detail__category bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {paper.category}
              </span>
              <span className="paper-detail__version">v{paper.version}</span>
              <time className="paper-detail__date" dateTime={paper.publicationDate}>
                {formatDate(paper.publicationDate)}
              </time>
            </div>

            {!markdownContent && (
              <p className="paper-detail__abstract text-lg text-gray-700 leading-relaxed mb-6">
                {paper.abstract}
              </p>
            )}

            <div className="paper-detail__tags flex flex-wrap gap-2 mb-6">
              {paper.tags.map((tag) => (
                <span
                  key={tag}
                  className="paper-detail__tag bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="paper-detail__actions flex flex-wrap gap-4">
              {paper.pdfUrl ? (
                <a
                  href={paper.pdfUrl}
                  className="paper-detail__action px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download PDF
                </a>
              ) : markdownContent ? (
                <PdfDownloadButton
                  paperTitle={paper.title}
                  contentSelector=".paper-detail__article"
                />
              ) : null}
              <a
                href={paper.externalUrl}
                className="paper-detail__action px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
            </div>
          </header>

          {/* Full paper content rendered from markdown */}
          {markdownContent && (
            <section className="paper-detail__content prose prose-lg max-w-none mb-8">
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
                {markdownContent}
              </ReactMarkdown>
            </section>
          )}

          <footer className="paper-detail__footer pt-6 border-t border-gray-200">
            <p className="paper-detail__repository text-gray-600">
              This paper is maintained in the{' '}
              <a
                href={paper.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                karstenwade/papers
              </a>{' '}
              repository.
            </p>
            {paper.lastUpdated && paper.lastUpdated !== paper.publicationDate && (
              <p className="paper-detail__updated text-sm text-gray-500 mt-2">
                Last updated:{' '}
                <time dateTime={paper.lastUpdated}>
                  {formatDate(paper.lastUpdated)}
                </time>
              </p>
            )}
          </footer>
        </article>
      </main>
    </>
  )
}
