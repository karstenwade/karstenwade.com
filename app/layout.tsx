import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

// Person JSON-LD for site-wide structured data
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Karsten Wade',
  jobTitle: 'Collaborative Experience Consultant',
  description: 'Collaboration catalyst and open collaboration expert specializing in developer experience (DevEx) and community building',
  url: 'https://karstenwade.com',
  image: 'https://karstenwade.com/assets/images/karsten-wade-headshot.jpg',
  sameAs: [
    'https://github.com/quaid',
    'https://linkedin.com/in/karstenwade',
    'https://fosstodon.org/@quaid',
  ],
  knowsAbout: [
    'Developer Experience',
    'Open Source',
    'Community Architecture',
    'Collaborative Work',
    'OSPO',
    'The Open Source Way',
  ],
}

export const metadata: Metadata = {
  title: {
    default: 'Karsten Wade | Collaborative Experience Consulting',
    template: '%s | Karsten Wade',
  },
  description:
    'Personal website of Karsten Wade - Collaborative experience consulting, community building, and open source leadership.',
  keywords: [
    'collaborative experience consulting',
    'collaboration catalyst',
    'open collaboration',
    'developer experience',
    'DevEx',
    'community catalyst',
    'open source',
    'community building',
  ],
  authors: [{ name: 'Karsten Wade', url: 'https://karstenwade.com' }],
  creator: 'Karsten Wade',
  metadataBase: new URL('https://karstenwade.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://karstenwade.com',
    siteName: 'Karsten Wade',
    title: 'Karsten Wade | Collaborative Experience Consulting',
    description:
      'Personal website of Karsten Wade - Collaborative experience consulting, community building, and open source leadership.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Karsten Wade | Collaborative Experience Consulting',
    description:
      'Personal website of Karsten Wade - Collaborative experience consulting, community building, and open source leadership.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Script
          id="person-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
