'use client'

import { useState, useEffect } from 'react'
import { contentService } from '@/lib/services/contentService'
import type { Essay } from '@/data/essays'
import StructuredData from './StructuredData'

export interface EssaysProps {
  className?: string
}

const Essays = ({ className = '' }: EssaysProps) => {
  const [essays, setEssays] = useState<Essay[]>([])
  const [expandedEssays, setExpandedEssays] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function loadEssays() {
      const data = await contentService.getEssays()
      setEssays(data)
    }
    loadEssays()
  }, [])

  const toggleExpanded = (slug: string) => {
    setExpandedEssays(prev => {
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
    <section className={`essays ${className}`} role="region" aria-label="Essays">
      <div className="essays__header mb-6">
        <h2 className="essays__heading text-2xl font-semibold text-gray-800">Essays</h2>
        <p className="essays__description text-gray-600 mt-2">
          Reflections on writing, identity, creativity, and the human experience.
        </p>
      </div>

      <div className="essays-list space-y-8">
        {essays.map((essay) => {
          const isExpanded = expandedEssays.has(essay.slug)

          return (
            <article
              key={essay.slug}
              id={essay.slug}
              className="essay-preview bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              data-testid="essay-preview"
            >
              <StructuredData type="essay" data={essay} />
              <div className="essay-preview__header mb-4">
                <h3 className="essay-preview__title text-xl font-semibold text-gray-900">{essay.title}</h3>
                <div className="essay-preview__metadata text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <span className="essay-preview__word-count">{essay.wordCount} words</span>
                  <span className="essay-preview__separator">•</span>
                  <span className="essay-preview__date">{formatDate(essay.dateWritten)}</span>
                </div>
              </div>

              <div className="essay-preview__theme text-gray-600 italic mb-4">{essay.theme}</div>

              <div className="essay-preview__content">
                <div className="essay-preview__excerpt text-gray-700 leading-relaxed">
                  {essay.excerpt}
                </div>

                {isExpanded && (
                  <div className="essay-preview__full-text mt-4 pt-4 border-t border-gray-200 space-y-4">
                    {essay.fullText.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="essay-paragraph text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="essay-preview__toggle mt-4 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                onClick={() => toggleExpanded(essay.slug)}
                aria-expanded={isExpanded}
              >
                {isExpanded ? 'Collapse' : 'Read Full Essay'}
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default Essays
