import SEO from '../components/SEO'
import Card from '../components/Card'
import { papers } from '../data/papers'
import './OpenPapers.css'

export interface OpenPapersProps {
  className?: string
}

const OpenPapers = ({ className = '' }: OpenPapersProps) => {
  return (
    <>
      <SEO
        title="Open Papers - Karsten Wade"
        description="Research papers and frameworks on open source community building, developer relations, and collaborative experience by Karsten Wade."
        keywords="open source papers, community building, developer relations, collaborative experience, open collaboration research"
        ogUrl="https://karstenwade.github.io/karstenwade.com/papers"
      />
      <main id="main-content" className={`open-papers ${className}`}>
      <div className="open-papers__header">
        <h1 className="open-papers__title">Open Papers</h1>
        <p className="open-papers__description">
          Explore research papers and frameworks on open source community building,
          developer relations, and collaborative experience.
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
