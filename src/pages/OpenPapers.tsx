import { useEffect, useState } from 'react'
import SEO from '../components/SEO'
import StructuredData from '../components/StructuredData'
import Card from '../components/Card'
import { contentService } from '../services/contentService'
import type { Paper } from '../data/papers'
import './OpenPapers.css'

export interface OpenPapersProps {
  className?: string
}

const OpenPapers = ({ className = '' }: OpenPapersProps) => {
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
      <SEO
        title="Open Papers - Karsten Wade"
        description="Papers and frameworks on open source community building, developer relations, and collaborative developer experience by Karsten Wade."
        keywords="open source papers, community building, developer relations, collaborative developer experience, open collaboration"
        ogUrl="https://karstenwade.com/papers"
      />
      {papers.map((paper) => (
        <StructuredData key={paper.externalUrl} type="paper" data={paper} />
      ))}
      <main id="main-content" className={`open-papers ${className}`}>
      <div className="open-papers__header">
        <h1 className="open-papers__title">Open Papers</h1>
        <p className="open-papers__description">
          Explore papers and frameworks on open source community building,
          developer relations, and collaborative developer experience.
        </p>
        <p className="open-papers__repository">
          All papers are maintained in the{' '}
          <a
            href="https://github.com/karstenwade/papers"
            target="_blank"
            rel="noopener noreferrer"
            className="open-papers__repo-link"
          >
            karstenwade/papers
          </a>{' '}
          repository.
        </p>
      </div>

      <div className="cards-grid">
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

export default OpenPapers
