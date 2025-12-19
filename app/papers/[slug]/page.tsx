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
import PaperHeader from '../../components/PaperHeader'
import CitationBlock from '../../components/CitationBlock'
import ShareButtons from '../../components/ShareButtons'
import PrintButton from '../../components/PrintButton'
import './print.css'

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

// Generate metadata for each paper with enhanced SEO
export async function generateMetadata({ params }: PaperDetailProps): Promise<Metadata> {
  const { slug } = await params
  const paper = papers.find(p => p.slug === slug)

  if (!paper) {
    return {
      title: 'Paper Not Found - Karsten Wade',
    }
  }

  const paperUrl = `https://karstenwade.com/papers/${slug}`
  const publicationYear = new Date(paper.publicationDate).getFullYear()

  return {
    title: `${paper.title} - Karsten Wade`,
    description: paper.abstract,
    keywords: [...paper.tags, 'research paper', paper.category, 'Karsten Wade'],
    authors: [{ name: 'Karsten Wade', url: 'https://karstenwade.com' }],
    creator: 'Karsten Wade',
    publisher: 'Karsten Wade',
    openGraph: {
      type: 'article',
      title: paper.title,
      description: paper.abstract,
      url: paperUrl,
      siteName: 'Karsten Wade',
      locale: 'en_US',
      publishedTime: paper.publicationDate,
      modifiedTime: paper.lastUpdated,
      authors: ['Karsten Wade'],
      tags: paper.tags,
      images: [
        {
          url: 'https://karstenwade.com/og-image-papers.png',
          width: 1200,
          height: 630,
          alt: `${paper.title} - Paper by Karsten Wade`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: paper.title,
      description: paper.abstract,
      creator: '@karstenwade',
      images: ['https://karstenwade.com/og-image-papers.png'],
    },
    alternates: {
      canonical: paperUrl,
    },
    other: {
      'citation_title': paper.title,
      'citation_author': 'Karsten Wade',
      'citation_publication_date': paper.publicationDate,
      'citation_year': publicationYear.toString(),
      ...(paper.doi && { 'citation_doi': paper.doi }),
    },
  }
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

      <main className="paper-detail max-w-4xl mx-auto px-4 py-8 print:max-w-none print:px-8">
        {/* Breadcrumb - hidden in print */}
        <nav className="paper-detail__breadcrumb mb-6 print:hidden">
          <Link
            href="/papers"
            className="text-blue-600 hover:underline"
          >
            &larr; Back to Papers
          </Link>
        </nav>

        <article className="paper-detail__article">
          {/* Enhanced CV-quality header */}
          <PaperHeader
            paper={paper}
            author="Karsten Wade"
            showAbstract={!markdownContent}
            showTags
          />

          {/* Action buttons - separate section, hidden in print */}
          <div className="paper-detail__actions flex flex-wrap gap-4 mb-8 print:hidden">
            {paper.pdfUrl ? (
              <a
                href={paper.pdfUrl}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
            <PrintButton />
          </div>

          {/* Full paper content rendered from markdown */}
          {markdownContent && (
            <section className="paper-detail__content prose prose-lg max-w-none mb-8 print:prose-sm">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Style headings - use serif for academic look
                  h1: ({ children }) => (
                    <h2 className="text-2xl font-bold font-serif text-gray-900 mt-8 mb-4 border-b pb-2 print:mt-6 print:mb-3">
                      {children}
                    </h2>
                  ),
                  h2: ({ children }) => (
                    <h3 className="text-xl font-semibold font-serif text-gray-800 mt-6 mb-3 print:mt-4 print:mb-2">
                      {children}
                    </h3>
                  ),
                  h3: ({ children }) => (
                    <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2 print:mt-3">
                      {children}
                    </h4>
                  ),
                  // Style paragraphs
                  p: ({ children }) => (
                    <p className="text-gray-700 leading-relaxed mb-4 print:mb-3 print:text-sm">
                      {children}
                    </p>
                  ),
                  // Style lists
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 print:mb-3 print:text-sm">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700 print:mb-3 print:text-sm">
                      {children}
                    </ol>
                  ),
                  // Style links - show URL in print
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-blue-600 hover:underline print:text-gray-900 print:underline"
                      target={href?.startsWith('http') ? '_blank' : undefined}
                      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {children}
                    </a>
                  ),
                  // Style blockquotes
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-600 print:border-gray-400">
                      {children}
                    </blockquote>
                  ),
                  // Style code blocks
                  code: ({ className, children }) => {
                    const isInline = !className
                    if (isInline) {
                      return (
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono print:bg-gray-50">
                          {children}
                        </code>
                      )
                    }
                    return (
                      <code className="block bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono print:bg-gray-50 print:text-xs">
                        {children}
                      </code>
                    )
                  },
                  // Style tables
                  table: ({ children }) => (
                    <div className="overflow-x-auto mb-4">
                      <table className="min-w-full border-collapse border border-gray-300 print:text-sm">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left print:px-2 print:py-1">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-300 px-4 py-2 print:px-2 print:py-1">
                      {children}
                    </td>
                  ),
                }}
              >
                {markdownContent}
              </ReactMarkdown>
            </section>
          )}

          {/* Citation block - hidden in print */}
          <CitationBlock paper={paper} author="Karsten Wade" />

          {/* Social sharing buttons - hidden in print */}
          <div className="mt-6">
            <ShareButtons
              url={`https://karstenwade.com/papers/${paper.slug}`}
              title={paper.title}
              description={paper.abstract}
            />
          </div>

          {/* Footer */}
          <footer className="paper-detail__footer pt-6 border-t border-gray-200 mt-8">
            <p className="paper-detail__repository text-gray-600 print:text-sm">
              This paper is maintained in the{' '}
              <a
                href={paper.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline print:text-gray-900"
              >
                karstenwade/papers
              </a>{' '}
              repository.
            </p>
            {/* Print-only: Show URL */}
            <p className="hidden print:block text-xs text-gray-500 mt-2">
              URL: https://karstenwade.com/papers/{paper.slug}
            </p>
          </footer>
        </article>
      </main>
    </>
  )
}
