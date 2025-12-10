import { useState, useEffect } from 'react'
import { contentService } from '../services/contentService'
import type { Essay } from '../data/essays'
import StructuredData from './StructuredData'
import './Essays.css'

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
      <div className="essays__header">
        <h2 className="essays__heading">Essays</h2>
        <p className="essays__description">
          Reflections on writing, identity, creativity, and the human experience.
        </p>
      </div>

      <div className="essays-list">
        {essays.map((essay) => {
          const isExpanded = expandedEssays.has(essay.slug)

          return (
            <article
              key={essay.slug}
              id={essay.slug}
              className="essay-preview"
              data-testid="essay-preview"
            >
              <StructuredData type="essay" data={essay} />
              <div className="essay-preview__header">
                <h3 className="essay-preview__title">{essay.title}</h3>
                <div className="essay-preview__metadata">
                  <span className="essay-preview__word-count">{essay.wordCount} words</span>
                  <span className="essay-preview__separator">•</span>
                  <span className="essay-preview__date">{formatDate(essay.dateWritten)}</span>
                </div>
              </div>

              <div className="essay-preview__theme">{essay.theme}</div>

              <div className="essay-preview__content">
                {!isExpanded ? (
                  <div className="essay-preview__excerpt">
                    {/* Show first 2 paragraphs as preview with original formatting */}
                    {essay.fullText.split('\n\n').slice(0, 2).map((paragraph, idx) => (
                      <p key={idx} className="essay-paragraph">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="essay-preview__full-text">
                    {essay.fullText.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="essay-paragraph">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="essay-preview__toggle"
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
