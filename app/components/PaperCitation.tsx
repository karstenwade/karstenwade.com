'use client'

/**
 * PaperCitation Component
 * Story 16.7a: Citation block for academic papers
 *
 * Provides a formatted citation in APA-like style with copy functionality.
 */

import { useState } from 'react'
import type { Paper } from '../../src/data/papers'

interface PaperCitationProps {
  paper: Paper
  author?: string
}

function formatAuthorForCitation(fullName: string): string {
  // Convert "Karsten Wade" to "Wade, K."
  const parts = fullName.trim().split(' ')
  if (parts.length >= 2) {
    const lastName = parts[parts.length - 1]
    const firstInitial = parts[0].charAt(0)
    return `${lastName}, ${firstInitial}.`
  }
  return fullName
}

function getYear(dateStr: string): string {
  return new Date(dateStr).getFullYear().toString()
}

function generateCitation(paper: Paper, author: string): string {
  const formattedAuthor = formatAuthorForCitation(author)
  const year = getYear(paper.publicationDate)
  const url = `https://karstenwade.com/papers/${paper.slug}`

  return `${formattedAuthor} (${year}). ${paper.title}. Retrieved from ${url}`
}

const PaperCitation = ({ paper, author = 'Karsten Wade' }: PaperCitationProps) => {
  const [copied, setCopied] = useState(false)
  const citationText = generateCitation(paper, author)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(citationText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = citationText
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <aside
      className="paper-citation print:hidden bg-gray-50 border border-gray-200 rounded-lg p-4 mt-8"
      data-testid="paper-citation"
    >
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
        Cite this paper
      </h3>
      <p
        className="text-gray-600 text-sm font-mono bg-white p-3 rounded border border-gray-200 mb-3"
        data-testid="paper-citation-text"
      >
        {citationText}
      </p>
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

export default PaperCitation
