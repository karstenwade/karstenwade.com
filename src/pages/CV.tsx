import SEO from '../components/SEO'
import { cvData } from '../data/cv'
import './CV.css'

export interface CVProps {
  className?: string
}

const CV = ({ className = '' }: CVProps) => {
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <>
      <SEO
        title="CV - Karsten Wade"
        description="Professional CV of Karsten Wade - Open Source Community Architect, OSPO co-founder at Red Hat, and author of The Open Source Way."
        keywords="Karsten Wade CV, resume, community architect, OSPO, Red Hat, open source career, developer relations"
        ogUrl="https://karstenwade.github.io/karstenwade.com/cv"
      />
      <main id="main-content" className={`cv ${className}`}>
      <header className="cv__header">
        <h1 className="cv__name">{cvData.name}</h1>
        <p className="cv__title">{cvData.title}</p>
      </header>

      <section className="cv__section cv__contact" aria-label="Contact Information">
        <h2 className="cv__section-heading">Contact</h2>
        <ul className="cv__contact-list">
          <li>
            <a href={`mailto:${cvData.contact.email}`} className="cv__link">
              {cvData.contact.email}
            </a>
          </li>
          <li>
            <a
              href={cvData.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="cv__link"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href={cvData.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="cv__link"
            >
              GitHub
            </a>
          </li>
          <li>
            <a href={cvData.contact.website} className="cv__link">
              karstenwade.com
            </a>
          </li>
        </ul>
      </section>

      <section className="cv__section cv__summary" aria-label="Professional Summary">
        <h2 className="cv__section-heading">Summary</h2>
        <p className="cv__summary-text">{cvData.summary}</p>
      </section>

      <section className="cv__section cv__expertise" aria-label="Key Expertise Areas">
        <h2 className="cv__section-heading">Key Expertise Areas</h2>
        <ul className="cv__expertise-list">
          {cvData.expertise.map((item, index) => (
            <li key={index} className="cv__expertise-item">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="cv__section cv__experience" aria-label="Professional Experience">
        <h2 className="cv__section-heading">Professional Experience</h2>
        <p className="cv__content">{cvData.experience}</p>
      </section>

      <section className="cv__section cv__education" aria-label="Education">
        <h2 className="cv__section-heading">Education</h2>
        <p className="cv__content">{cvData.education}</p>
      </section>

      <section className="cv__section cv__publications" aria-label="Publications & Speaking">
        <h2 className="cv__section-heading">Publications & Speaking</h2>
        <ul className="cv__publications-list">
          {cvData.publications.map((item, index) => (
            <li key={index} className="cv__publication-item">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="cv__section cv__downloads" aria-label="Download CV">
        <h2 className="cv__section-heading">Download CV</h2>
        <div className="cv__download-links">
          {cvData.downloadLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              download
              className="cv__download-link"
            >
              <span className="cv__download-label">Download {link.label}</span>
              <span className="cv__download-meta">
                {link.format} • {link.fileSize}
              </span>
            </a>
          ))}
        </div>
      </section>

      <footer className="cv__footer">
        <p className="cv__last-updated">
          Last updated: {formatDate(cvData.lastUpdated)}
        </p>
      </footer>
    </main>
    </>
  )
}

export default CV
