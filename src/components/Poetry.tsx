import { useState } from 'react'
import { poems } from '../data/poetry'
import './Poetry.css'

export interface PoetryProps {
  className?: string
}

const Poetry = ({ className = '' }: PoetryProps) => {
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
      <div className="poetry__header">
        <h2 className="poetry__heading">Poetry</h2>
        <p className="poetry__description">
          Explorations of AI-human collaboration, consciousness, and connection
          through verse.
        </p>
      </div>

      <div className="poems-list">
        {poems.map((poem) => {
          const isExpanded = expandedPoems.has(poem.slug)

          return (
            <article
              key={poem.slug}
              id={poem.slug}
              className="poem-preview"
              data-testid="poem-preview"
            >
              <div className="poem-preview__header">
                <h3 className="poem-preview__title">{poem.title}</h3>
                <div className="poem-preview__metadata">
                  <span className="poem-preview__form">{poem.form}</span>
                  <span className="poem-preview__separator">•</span>
                  <span className="poem-preview__date">{formatDate(poem.dateWritten)}</span>
                </div>
              </div>

              <div className="poem-preview__theme">{poem.theme}</div>

              <div className="poem-preview__content">
                <div className="poem-preview__excerpt">
                  {poem.excerpt.split('\n').map((line, idx) => (
                    <div key={idx} className="poem-line">
                      {line}
                    </div>
                  ))}
                </div>

                {isExpanded && (
                  <div className="poem-preview__full-text">
                    {poem.fullText.split('\n').map((line, idx) => (
                      <div key={idx} className="poem-line">
                        {line}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="poem-preview__toggle"
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

export default Poetry
