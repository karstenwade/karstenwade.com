import type { Metadata } from 'next'
import Navigation from '../components/Navigation'
import { cvData } from '@/data/cv'

export const metadata: Metadata = {
  title: 'CV - Karsten Wade',
  description: 'Professional CV of Karsten Wade - Open Source Community Architect, OSPO co-founder at Red Hat, and author of The Open Source Way.',
  keywords: ['Karsten Wade CV', 'resume', 'community architect', 'OSPO', 'Red Hat', 'open source career', 'developer relations'],
  openGraph: {
    url: 'https://karstenwade.com/cv',
  },
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function CV() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="cv max-w-4xl mx-auto px-4 py-8">
        <header className="cv__header text-center mb-8">
          <h1 className="cv__name text-4xl font-bold text-gray-900 mb-2">{cvData.name}</h1>
          <p className="cv__title text-xl text-gray-600 mb-4">{cvData.title}</p>
          <div className="cv__cta">
            <a href="#downloads" className="cv__cta-button inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Download Resume
            </a>
          </div>
        </header>

        <section className="cv__section cv__contact mb-8" aria-label="Contact Information">
          <h2 className="cv__section-heading text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Contact</h2>
          <ul className="cv__contact-list flex flex-wrap gap-4 list-none p-0">
            <li>
              <a href={`mailto:${cvData.contact.email}`} className="cv__link text-blue-600 hover:underline">
                {cvData.contact.email}
              </a>
            </li>
            <li>
              <a
                href={cvData.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="cv__link text-blue-600 hover:underline"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href={cvData.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="cv__link text-blue-600 hover:underline"
              >
                GitHub
              </a>
            </li>
            <li>
              <a href={cvData.contact.website} className="cv__link text-blue-600 hover:underline">
                karstenwade.com
              </a>
            </li>
          </ul>
        </section>

        <section className="cv__section cv__summary mb-8" aria-label="Professional Summary">
          <h2 className="cv__section-heading text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Summary</h2>
          <p className="cv__summary-text text-gray-700 leading-relaxed">{cvData.summary}</p>
        </section>

        <section className="cv__section cv__expertise mb-8" aria-label="Key Expertise Areas">
          <h2 className="cv__section-heading text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Key Expertise Areas</h2>
          <ul className="cv__expertise-list grid grid-cols-1 md:grid-cols-2 gap-2 list-disc list-inside">
            {cvData.expertise.map((item, index) => (
              <li key={index} className="cv__expertise-item text-gray-700">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="cv__section cv__experience mb-8" aria-label="Professional Experience">
          <h2 className="cv__section-heading text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Professional Experience</h2>
          <p className="cv__content text-gray-700 leading-relaxed whitespace-pre-line">{cvData.experience}</p>
        </section>

        <section className="cv__section cv__education mb-8" aria-label="Education">
          <h2 className="cv__section-heading text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Education</h2>
          <p className="cv__content text-gray-700 leading-relaxed">{cvData.education}</p>
        </section>

        <section className="cv__section cv__publications mb-8" aria-label="Publications & Speaking">
          <h2 className="cv__section-heading text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Publications & Speaking</h2>
          <ul className="cv__publications-list list-disc list-inside space-y-2">
            {cvData.publications.map((item, index) => (
              <li key={index} className="cv__publication-item text-gray-700">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section id="downloads" className="cv__section cv__downloads mb-8" aria-label="Download CV">
          <h2 className="cv__section-heading text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Download CV</h2>
          <div className="cv__download-links flex flex-wrap gap-4">
            {cvData.downloadLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                download
                className="cv__download-link flex flex-col p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="cv__download-label font-medium text-gray-900">Download {link.label}</span>
                <span className="cv__download-meta text-sm text-gray-500">
                  {link.format} - {link.fileSize}
                </span>
              </a>
            ))}
          </div>
        </section>

        <footer className="cv__footer text-center text-gray-500 text-sm mt-8 pt-4 border-t">
          <p className="cv__last-updated">
            Last updated: {formatDate(cvData.lastUpdated)}
          </p>
        </footer>
      </main>
    </>
  )
}
