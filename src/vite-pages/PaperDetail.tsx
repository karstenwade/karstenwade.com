import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import SEO from '../components/SEO'
import StructuredData from '../components/StructuredData'
import { getPaperBySlug, PaperParsingError } from '../services/paperService'
import type { Paper } from '../data/papers'
import './PaperDetail.css'

export interface PaperDetailProps {
  className?: string
  paper?: Paper // For testing/preview
}

interface PaperContent {
  markdown: string
  paper: Paper
}

const PaperDetail = ({ className = '', paper: preloadedPaper }: PaperDetailProps) => {
  const { slug } = useParams<{ slug: string }>()
  const [content, setContent] = useState<PaperContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPaper() {
      if (!slug) {
        setError('No paper slug provided')
        setLoading(false)
        return
      }

      // If paper data is preloaded (e.g., from static generation or testing), use it
      if (preloadedPaper) {
        setContent({ markdown: '', paper: preloadedPaper })
        setLoading(false)
        return
      }

      // Dynamic loading: fetch paper by slug from GitHub
      try {
        const { paper, markdown } = await getPaperBySlug(slug)
        setContent({ markdown, paper })
        setLoading(false)
      } catch (err) {
        if (err instanceof PaperParsingError) {
          setError(err.message)
        } else if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Failed to load paper. Please try again later.')
        }
        setLoading(false)
      }
    }

    loadPaper()
  }, [slug, preloadedPaper])

  if (loading) {
    return (
      <main className={`paper-detail ${className}`}>
        <div className="paper-detail__loading">
          <p>Loading paper...</p>
        </div>
      </main>
    )
  }

  if (error || !content) {
    return (
      <main className={`paper-detail ${className}`}>
        <div className="paper-detail__error">
          <h1>Paper Not Found</h1>
          <p>{error || 'The requested paper could not be found.'}</p>
          <Link to="/papers" className="paper-detail__back-link">
            ← Back to Papers
          </Link>
        </div>
      </main>
    )
  }

  const { markdown, paper } = content

  return (
    <>
      <SEO
        title={`${paper.title} - Karsten Wade`}
        description={paper.abstract}
        keywords={`${paper.tags.join(', ')}, research paper, ${paper.category}`}
        ogTitle={paper.title}
        ogDescription={paper.abstract}
        ogUrl={`https://karstenwade.com/papers/${slug}`}
      />
      <StructuredData type="paper" data={paper} />

      <main className={`paper-detail ${className}`}>
        <nav className="paper-detail__breadcrumb">
          <Link to="/papers" className="paper-detail__back-link">
            ← Back to Papers
          </Link>
        </nav>

        <article className="paper-detail__article">
          <header className="paper-detail__header">
            <h1 className="paper-detail__title">{paper.title}</h1>

            <div className="paper-detail__meta">
              <span className="paper-detail__category">{paper.category}</span>
              <span className="paper-detail__version">v{paper.version}</span>
              <time
                className="paper-detail__date"
                dateTime={paper.publicationDate}
              >
                {new Date(paper.publicationDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>

            <p className="paper-detail__abstract">{paper.abstract}</p>

            <div className="paper-detail__tags">
              {paper.tags.map((tag) => (
                <span key={tag} className="paper-detail__tag">
                  {tag}
                </span>
              ))}
            </div>

            <div className="paper-detail__actions">
              {paper.pdfUrl && (
                <a
                  href={paper.pdfUrl}
                  className="paper-detail__action paper-detail__action--pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download PDF
                </a>
              )}
              <a
                href={paper.externalUrl}
                className="paper-detail__action paper-detail__action--github"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
            </div>
          </header>

          <div className="paper-detail__content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[
                rehypeHighlight,
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: 'wrap' }],
              ]}
            >
              {markdown}
            </ReactMarkdown>
          </div>

          <footer className="paper-detail__footer">
            <p className="paper-detail__repository">
              This paper is maintained in the{' '}
              <a
                href={paper.repository}
                target="_blank"
                rel="noopener noreferrer"
              >
                karstenwade/papers
              </a>{' '}
              repository.
            </p>
            {paper.lastUpdated && paper.lastUpdated !== paper.publicationDate && (
              <p className="paper-detail__updated">
                Last updated:{' '}
                <time dateTime={paper.lastUpdated}>
                  {new Date(paper.lastUpdated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </p>
            )}
          </footer>
        </article>
      </main>
    </>
  )
}

export default PaperDetail
