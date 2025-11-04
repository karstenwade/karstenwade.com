import { theories } from '../data/theories'
import './Theories.css'

export interface TheoriesProps {
  className?: string
}

const Theories = ({ className = '' }: TheoriesProps) => {
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <main className={`theories ${className}`}>
      <div className="theories__header">
        <h1 className="theories__title">Theories & Frameworks</h1>
        <p className="theories__description">
          Frameworks for understanding and improving collaborative work in open source communities.
        </p>
      </div>

      <div className="cards-grid">
        {theories.map((theory) => (
          <article key={theory.slug} className="theory-card">
            <div className="theory-card__header">
              <h2 className="theory-card__title">{theory.title}</h2>
              <p className="theory-card__framework-name">{theory.frameworkName}</p>
            </div>

            <p className="theory-card__short-description">{theory.shortDescription}</p>

            <section className="theory-card__section">
              <h3 className="theory-card__section-heading">Key Concepts</h3>
              <ul className="theory-card__list">
                {theory.keyConcepts.map((concept, index) => (
                  <li key={index} className="theory-card__list-item">
                    {concept}
                  </li>
                ))}
              </ul>
            </section>

            <section className="theory-card__section">
              <h3 className="theory-card__section-heading">Applications</h3>
              <ul className="theory-card__list">
                {theory.applications.map((application, index) => (
                  <li key={index} className="theory-card__list-item">
                    {application}
                  </li>
                ))}
              </ul>
            </section>

            {theory.relatedFrameworks.length > 0 && (
              <section className="theory-card__section">
                <h3 className="theory-card__section-heading">Related Frameworks</h3>
                <ul className="theory-card__related-list">
                  {theory.relatedFrameworks.map((related, index) => (
                    <li key={index} className="theory-card__related-item">
                      <a href={related.url} className="theory-card__related-link">
                        {related.name}
                      </a>
                      <span className="theory-card__relationship">({related.relationship})</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="theory-card__metadata">
              <span className="theory-card__version">Version {theory.currentVersion}</span>
              <span className="theory-card__separator">•</span>
              <span className="theory-card__date">Introduced {formatDate(theory.dateIntroduced)}</span>
            </div>

            <div className="theory-card__tags">
              {theory.tags.map((tag, index) => (
                <span key={index} className="theory-card__tag">
                  {tag}
                </span>
              ))}
            </div>

            {theory.paperUrl && (
              <a href={theory.paperUrl} className="theory-card__paper-link">
                Read Paper
              </a>
            )}
          </article>
        ))}
      </div>
    </main>
  )
}

export default Theories
