/**
 * PaperHeader Component
 * Story 16.7a: Enhanced paper header with CV-quality styling
 *
 * Displays paper metadata with professional academic styling
 * suitable for CV/resume presentation.
 */

import type { Paper } from '@/data/papers'

interface PaperHeaderProps {
  paper: Paper
  author?: string
  showAbstract?: boolean
  showTags?: boolean
  showActions?: boolean
}

function formatDate(dateStr: string): string {
  // Parse as local date to avoid timezone shifts
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const PaperHeader = ({
  paper,
  author = 'Karsten Wade',
  showAbstract = false,
  showTags = false,
  showActions = false,
}: PaperHeaderProps) => {
  const showLastUpdated =
    paper.lastUpdated && paper.lastUpdated !== paper.publicationDate

  return (
    <header className="paper-header mb-8">
      {/* Title with professional serif font */}
      <h1 className="paper-header__title text-3xl md:text-4xl font-bold font-serif text-gray-900 mb-4 leading-tight">
        {paper.title}
      </h1>

      {/* Author attribution */}
      <div className="paper-header__author text-lg text-gray-700 mb-3">
        <span className="text-gray-500">Author: </span>
        <span className="font-medium">{author}</span>
      </div>

      {/* Metadata row */}
      <div className="paper-header__meta flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
        <span className="paper-header__category bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
          {paper.category}
        </span>
        <span className="paper-header__version text-gray-500">
          Version {paper.version}
        </span>
        <time
          className="paper-header__date"
          dateTime={paper.publicationDate}
        >
          {formatDate(paper.publicationDate)}
        </time>
      </div>

      {/* Last updated (if different from publication date) */}
      {showLastUpdated && (
        <p className="paper-header__updated text-sm text-gray-500 mb-4">
          Last updated:{' '}
          <time dateTime={paper.lastUpdated}>
            {formatDate(paper.lastUpdated)}
          </time>
        </p>
      )}

      {/* Abstract with academic styling */}
      {showAbstract && paper.abstract && (
        <div className="paper-header__abstract bg-gray-50 border-l-4 border-blue-500 p-4 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Abstract
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {paper.abstract}
          </p>
        </div>
      )}

      {/* Tags */}
      {showTags && paper.tags && paper.tags.length > 0 && (
        <div className="paper-header__tags flex flex-wrap gap-2 mb-6">
          {paper.tags.map((tag) => (
            <span
              key={tag}
              className="paper-header__tag bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action buttons (hidden in print) */}
      {showActions && (
        <div
          className="paper-header__actions print:hidden flex flex-wrap gap-4"
          data-testid="paper-actions"
        >
          {paper.pdfUrl && (
            <a
              href={paper.pdfUrl}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download PDF
            </a>
          )}
          <a
            href={paper.externalUrl}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </div>
      )}
    </header>
  )
}

export default PaperHeader
