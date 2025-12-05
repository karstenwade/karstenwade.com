import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { papers } from '@/data/papers'
import Navigation from '../../components/Navigation'
import StructuredData from '../../components/StructuredData'

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

function getExternalLinkText(url: string): string {
  if (url.includes('github.com')) return 'View on GitHub'
  if (url.includes('gitbook') || url.includes('guidebook')) return 'View Guidebook'
  if (url.includes('gitlab.com')) return 'View on GitLab'
  return 'View External'
}

export default async function PaperDetail({ params }: PaperDetailProps) {
  const { slug } = await params
  const paper = papers.find(p => p.slug === slug)

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

            <p className="paper-detail__abstract text-lg text-gray-700 leading-relaxed mb-6">
              {paper.abstract}
            </p>

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
              {paper.pdfUrl && (
                <a
                  href={paper.pdfUrl}
                  className="paper-detail__action px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download PDF
                </a>
              )}
              <a
                href={paper.externalUrl}
                className="paper-detail__action px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {getExternalLinkText(paper.externalUrl)}
              </a>
            </div>
          </header>

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
