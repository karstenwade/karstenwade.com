// Fiction data
// Corresponds to content in content/fiction/

export interface Story {
  title: string
  excerpt: string
  fullText: string
  dateWritten: string
  genre: string
  theme: string
  wordCount: number
  tags: string[]
  slug: string
  featured: boolean
}

export const stories: Story[] = [
  {
    title: 'The Pull Request',
    excerpt: 'The notification arrived at 2:47 AM',
    fullText: `The notification arrived at 2:47 AM.

She knew she should wait until morning, but the pull request had been sitting there for three days. The changes were elegant—a complete refactoring of the authentication layer that would save countless hours of technical debt.

But it came from @ghost_contributor, an account with no history, no profile picture, just a trail of perfect commits spread across a dozen repositories. Each one solving exactly the problem that needed solving, at exactly the right time.

She approved it anyway. Some ghosts, she thought, were worth believing in.`,
    dateWritten: '2025-01-15',
    genre: 'Tech Fiction',
    theme: 'Technology, Mystery, Open Source',
    wordCount: 324,
    tags: ['tech-fiction', 'mystery', 'open-source'],
    slug: 'the-pull-request',
    featured: true,
  },
]
