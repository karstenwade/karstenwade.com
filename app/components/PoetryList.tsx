'use client'

import { useState } from 'react'
import type { Poem } from '@/data/poetry'
import StructuredData from './StructuredData'

interface PoetryListProps {
  poems: Poem[]
  className?: string
}

export default function PoetryList({ poems, className = '' }: PoetryListProps) {
  const [expandedPoems, setExpandedPoems] = useState<Set<string>>(new Set())

  const toggleExpanded = (slug: string) => {
    setExpandedPoems(prev => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      return next
    })
  }

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <section className={`poetry ${className}`} role="region" aria-label="Poetry">
      <div className="poetry__header mb-6">
        <h2 className="poetry__heading text-2xl font-semibold text-gray-800">Poetry</h2>
      </div>

      <div className="poems-list space-y-8">
        {poems.map((poem) => {
          const isExpanded = expandedPoems.has(poem.slug)

          return (
            <article
              key={poem.slug}
              id={poem.slug}
              className="poem-preview bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              data-testid="poem-preview"
            >
              <StructuredData type="poem" data={poem} />
              <div className="poem-preview__header mb-4">
                <h3 className="poem-preview__title text-xl font-semibold text-gray-900">{poem.title}</h3>
                <div className="poem-preview__metadata text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <span className="poem-preview__form">{poem.form}</span>
                  <span className="poem-preview__separator">•</span>
                  <span className="poem-preview__date">{formatDate(poem.dateWritten)}</span>
                </div>
              </div>

              <div className="poem-preview__theme text-gray-600 italic mb-4">{poem.theme}</div>

              <div className="poem-preview__content">
                <div className="poem-preview__excerpt text-gray-700 leading-relaxed">
                  {poem.excerpt.split('\n').map((line, idx) => (
                    <div key={idx} className="poem-line whitespace-pre-wrap min-h-[1.75em]">
                      {line || '\u00A0'}{/* Non-breaking space for empty lines (stanza breaks) */}
                    </div>
                  ))}
                </div>

                {isExpanded && (
                  <div className="poem-preview__full-text mt-4 pt-4 border-t border-gray-200 text-gray-700 leading-relaxed">
                    {poem.fullText.split('\n').map((line, idx) => (
                      <div key={idx} className="poem-line whitespace-pre-wrap min-h-[1.75em]">
                        {line || '\u00A0'}{/* Non-breaking space for empty lines (stanza breaks) */}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="poem-preview__toggle mt-4 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                onClick={() => toggleExpanded(poem.slug)}
                aria-expanded={isExpanded}
              >
                {isExpanded ? 'Collapse' : 'Read Full Poem'}
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
