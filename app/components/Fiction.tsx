'use client'

import { useState, useEffect } from 'react'
import { contentService } from '@/services/contentService'
import type { Story } from '@/data/fiction'
import StructuredData from './StructuredData'

export interface FictionProps {
  className?: string
}

const Fiction = ({ className = '' }: FictionProps) => {
  const [stories, setStories] = useState<Story[]>([])
  const [expandedStories, setExpandedStories] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function loadStories() {
      const data = await contentService.getStories()
      setStories(data)
    }
    loadStories()
  }, [])

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
                <div className="story-preview__excerpt text-gray-700 leading-relaxed">
                  {story.excerpt}
                </div>

                {isExpanded && (
                  <div className="story-preview__full-text mt-4 pt-4 border-t border-gray-200 space-y-4">
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

export default Fiction
