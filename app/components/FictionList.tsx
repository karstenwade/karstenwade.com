'use client'

import { useState } from 'react'
import type { Story } from '@/data/fiction'
import StructuredData from './StructuredData'

interface FictionListProps {
  stories: Story[]
  className?: string
}

export default function FictionList({ stories, className = '' }: FictionListProps) {
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
      <div className="fiction__header mb-6">
        <h2 className="fiction__heading text-2xl font-semibold text-gray-800">Fiction</h2>
        <p className="fiction__description text-gray-600 mt-2">
          More to come
        </p>
      </div>

      <div className="stories-list space-y-8">
        {stories.map((story) => {
          const isExpanded = expandedStories.has(story.slug)

          return (
            <article
              key={story.slug}
              id={story.slug}
              className="story-preview bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              data-testid="story-preview"
            >
              <StructuredData type="story" data={story} />
              <div className="story-preview__header mb-4">
                <h3 className="story-preview__title text-xl font-semibold text-gray-900">{story.title}</h3>
                <div className="story-preview__metadata text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <span className="story-preview__genre">{story.genre}</span>
                  <span className="story-preview__separator">•</span>
                  <span className="story-preview__word-count">{story.wordCount} words</span>
                  <span className="story-preview__separator">•</span>
                  <span className="story-preview__date">{formatDate(story.dateWritten)}</span>
                </div>
              </div>

              <div className="story-preview__content">
                {!isExpanded ? (
                  <div className="story-preview__excerpt text-gray-700 leading-relaxed space-y-4">
                    {/* Show first 2 paragraphs as preview with original formatting */}
                    {story.fullText.split('\n\n').slice(0, 2).map((paragraph, idx) => (
                      <p key={idx} className="story-paragraph">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="story-preview__full-text space-y-4">
                    {story.fullText.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="story-paragraph text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="story-preview__toggle mt-4 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
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
