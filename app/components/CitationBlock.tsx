'use client'

/**
 * CitationBlock Component
 * Story 16.7b: Multiple citation format display
 *
 * Provides citations in APA, MLA, and BibTeX formats with tabbed interface.
 */

import { useState } from 'react'
import type { Paper } from '../../src/data/papers'

type CitationFormat = 'apa' | 'mla' | 'bibtex'

interface CitationBlockProps {
  paper: Paper
  author?: string
}

function formatAuthorAPA(fullName: string): string {
  // Convert "Karsten Wade" to "Wade, K."
  const parts = fullName.trim().split(' ')
  if (parts.length >= 2) {
    const lastName = parts[parts.length - 1]
    const firstInitial = parts[0].charAt(0)
    return `${lastName}, ${firstInitial}.`
  }
  return fullName
}

function formatAuthorMLA(fullName: string): string {
  // Convert "Karsten Wade" to "Wade, Karsten"
  const parts = fullName.trim().split(' ')
  if (parts.length >= 2) {
    const lastName = parts[parts.length - 1]
    const firstName = parts.slice(0, -1).join(' ')
    return `${lastName}, ${firstName}`
  }
  return fullName
}

function formatAuthorBibTeX(fullName: string): string {
  // BibTeX uses "Lastname, Firstname" format
  const parts = fullName.trim().split(' ')
  if (parts.length >= 2) {
    const lastName = parts[parts.length - 1]
    const firstName = parts.slice(0, -1).join(' ')
    return `${lastName}, ${firstName}`
  }
  return fullName
}

function getYear(dateStr: string): string {
  return new Date(dateStr).getFullYear().toString()
}

function generateBibTeXKey(paper: Paper, author: string): string {
  const lastName = author.split(' ').pop()?.toLowerCase() || 'unknown'
  const year = getYear(paper.publicationDate)
  const slugKey = paper.slug?.split('-')[0] || 'paper'
  return `${lastName}${year}${slugKey}`
}

function generateAPACitation(paper: Paper, author: string): string {
  const formattedAuthor = formatAuthorAPA(author)
  const year = getYear(paper.publicationDate)

  if (paper.doi) {
    return `${formattedAuthor} (${year}). ${paper.title}. https://doi.org/${paper.doi}`
  }

  const url = `https://karstenwade.com/papers/${paper.slug}`
  return `${formattedAuthor} (${year}). ${paper.title}. Retrieved from ${url}`
}

function generateMLACitation(paper: Paper, author: string): string {
  const formattedAuthor = formatAuthorMLA(author)
  const year = getYear(paper.publicationDate)

  if (paper.doi) {
    return `${formattedAuthor}. "${paper.title}." karstenwade.com, ${year}, https://doi.org/${paper.doi}.`
  }

  const url = `https://karstenwade.com/papers/${paper.slug}`
  return `${formattedAuthor}. "${paper.title}." karstenwade.com, ${year}, ${url}.`
}

function generateBibTeXCitation(paper: Paper, author: string): string {
  const key = generateBibTeXKey(paper, author)
  const formattedAuthor = formatAuthorBibTeX(author)
  const year = getYear(paper.publicationDate)
  const url = `https://karstenwade.com/papers/${paper.slug}`

  const fields = [
    `  author = {${formattedAuthor}}`,
    `  title = {${paper.title}}`,
    `  year = {${year}}`,
    `  url = {${url}}`,
  ]

  if (paper.doi) {
    fields.push(`  doi = {${paper.doi}}`)
  }

  return `@article{${key},\n${fields.join(',\n')}\n}`
}

const CitationBlock = ({ paper, author = 'Karsten Wade' }: CitationBlockProps) => {
  const [activeFormat, setActiveFormat] = useState<CitationFormat>('apa')
  const [copied, setCopied] = useState(false)

  const citations = {
    apa: generateAPACitation(paper, author),
    mla: generateMLACitation(paper, author),
    bibtex: generateBibTeXCitation(paper, author),
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(citations[activeFormat])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = citations[activeFormat]
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const tabs: { id: CitationFormat; label: string }[] = [
    { id: 'apa', label: 'APA' },
    { id: 'mla', label: 'MLA' },
    { id: 'bibtex', label: 'BibTeX' },
  ]

  return (
    <aside
      className="citation-block print:hidden bg-gray-50 border border-gray-200 rounded-lg p-4 mt-8"
      data-testid="citation-block"
    >
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
        Cite this paper
      </h3>

      {/* DOI display */}
      {paper.doi && (
        <div className="mb-3 text-sm">
          <span className="font-medium text-gray-600">DOI: </span>
          <a
            href={`https://doi.org/${paper.doi}`}
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {paper.doi}
          </a>
        </div>
      )}

      {/* Format tabs */}
      <div
        role="tablist"
        aria-label="Citation format selector"
        className="flex gap-1 mb-3 border-b border-gray-200"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeFormat === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActiveFormat(tab.id)}
            className={`px-3 py-2 text-sm font-medium rounded-t transition-colors ${
              activeFormat === tab.id
                ? 'bg-white text-blue-600 border border-gray-200 border-b-white -mb-px'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Citation panel */}
      <div
        role="tabpanel"
        id={`panel-${activeFormat}`}
        aria-labelledby={`tab-${activeFormat}`}
        className={`bg-white p-3 rounded border border-gray-200 mb-3 ${
          activeFormat === 'bibtex' ? 'font-mono text-xs' : 'text-sm'
        }`}
      >
        <pre className="whitespace-pre-wrap break-words text-gray-700">
          {citations[activeFormat]}
        </pre>
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
        aria-label="Copy citation"
      >
        {copied ? 'Copied!' : 'Copy citation'}
      </button>
    </aside>
  )
}

export default CitationBlock
