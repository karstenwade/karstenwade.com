import { useState } from 'react'
import { stories } from '../data/fiction'
import './Fiction.css'

export interface FictionProps {
  className?: string
}

const Fiction = ({ className = '' }: FictionProps) => {
  const [expandedStories, setExpandedStories] = useState<Set<string>>(new Set())

  const toggleExpanded = (slug: string) => {
    setExpandedStories(prev => {
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
    <section className={`fiction ${className}`} role="region" aria-label="Fiction">
      <div className="fiction__header">
        <h2 className="fiction__heading">Fiction</h2>
        <p className="fiction__description">
          Short stories exploring technology, relationships, and open source culture.
        </p>
      </div>

      <div className="stories-list">
        {stories.map((story) => {
          const isExpanded = expandedStories.has(story.slug)

          return (
            <article
              key={story.slug}
              className="story-preview"
              data-testid="story-preview"
            >
              <div className="story-preview__header">
                <h3 className="story-preview__title">{story.title}</h3>
                <div className="story-preview__metadata">
                  <span className="story-preview__genre">{story.genre}</span>
                  <span className="story-preview__separator">•</span>
                  <span className="story-preview__word-count">{story.wordCount} words</span>
                  <span className="story-preview__separator">•</span>
                  <span className="story-preview__date">{formatDate(story.dateWritten)}</span>
                </div>
              </div>

              <div className="story-preview__content">
                <div className="story-preview__excerpt">
                  {story.excerpt}
                </div>

                {isExpanded && (
                  <div className="story-preview__full-text">
                    {story.fullText.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="story-paragraph">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="story-preview__toggle"
                onClick={() => toggleExpanded(story.slug)}
                aria-expanded={isExpanded}
              >
                {isExpanded ? 'Collapse' : 'Read Full Story'}
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default Fiction
