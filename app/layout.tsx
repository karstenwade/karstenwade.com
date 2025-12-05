import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
