import type { Metadata } from 'next'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import FeaturedContent from './components/FeaturedContent'

export const metadata: Metadata = {
  title: 'Karsten Wade - Collaborative Experience Consulting',
  description: 'Karsten Wade - Open collaboration expert, community architect, and DevEx facilitator. Co-founder of Red Hat\'s OSPO and author of The Open Source Way.',
  openGraph: {
    url: 'https://karstenwade.com/',
  },
}

export default function Home() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="home">
        <Hero />
        <div className="px-4 py-8 md:px-8 md:py-12">
          <FeaturedContent />
        </div>
      </main>
    </>
  )
}
