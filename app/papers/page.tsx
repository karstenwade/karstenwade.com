'use client'

import { useEffect, useState } from 'react'
import Navigation from '../components/Navigation'
import Card from '../components/Card'
import { contentService } from '@/services/contentService'
import type { Paper } from '@/data/papers'

export default function Papers() {
  const [papers, setPapers] = useState<Paper[]>([])

  useEffect(() => {
    async function loadPapers() {
      const data = await contentService.getPapers()
      setPapers(data)
    }
    loadPapers()
  }, [])

  return (
    <>
      <Navigation />
      <main id="main-content" className="open-papers max-w-4xl mx-auto px-4 py-8">
        <div className="open-papers__header text-center mb-8">
          <h1 className="open-papers__title text-4xl font-bold text-gray-900 mb-4">Open Papers</h1>
          <p className="open-papers__description text-xl text-gray-600 mb-4">
            Explore papers and frameworks on open source community building,
            developer relations, and collaborative developer experience.
          </p>
          <p className="open-papers__repository text-gray-500">
            All papers are maintained in the{' '}
            <a
              href="https://github.com/karstenwade/papers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              karstenwade/papers
            </a>{' '}
            repository.
          </p>
        </div>

        <div className="cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {papers.map((paper) => (
            <Card
              key={paper.externalUrl}
              title={paper.title}
              description={paper.description}
              link={paper.externalUrl}
            />
          ))}
        </div>
      </main>
    </>
  )
}
