import type { Metadata } from 'next'
import { contentService } from '@/lib/services/contentService'
import Navigation from '../components/Navigation'
import WritingTabs from '../components/WritingTabs'

export const metadata: Metadata = {
  title: 'Writing - Karsten Wade',
  description: 'Poetry, essays, and prose by Karsten Wade',
  keywords: ['poetry', 'essays', 'fiction', 'writing', 'open source literature', 'AI stories', 'collaboration writing'],
  openGraph: {
    url: 'https://karstenwade.com/writing',
  },
}

// Server Component - data fetched at build time
export default async function Writing() {
  // Fetch all data server-side at build time
  const [poems, essays, stories] = await Promise.all([
    contentService.getPoems(),
    contentService.getEssays(),
    contentService.getStories(),
  ])

  return (
    <>
      <Navigation />
      <main id="main-content" className="writing max-w-4xl mx-auto px-4 py-8">
        <div className="writing__header text-center mb-8">
          <h1 className="writing__title text-4xl font-bold text-gray-900 mb-2">Writing</h1>
          <p className="writing__description text-xl text-gray-600">
            Poetry, essays, and prose
          </p>
        </div>

        <WritingTabs poems={poems} essays={essays} stories={stories} />
      </main>
    </>
  )
}
