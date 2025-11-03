// Featured content data
// Corresponds to content/home/featured.yml

export interface FeaturedItem {
  type: 'paper' | 'theory' | 'poem' | 'writing'
  slug: string
  headline: string
  subheadline: string
  cta: string
  priority: number
}

export const featuredItems: FeaturedItem[] = [
  {
    type: 'paper',
    slug: 'open-source-way-2.0',
    headline: 'The Open Source Way 2.0',
    subheadline: 'Industry-standard handbook for community building',
    cta: 'Read the Guide',
    priority: 1,
  },
  {
    type: 'theory',
    slug: 'collab-x',
    headline: 'Introducing CollabX',
    subheadline: 'A framework for measuring collaborative experience',
    cta: 'Explore the Framework',
    priority: 2,
  },
  {
    type: 'poem',
    slug: 'opening-collaboration',
    headline: 'Latest Poetry',
    subheadline: 'Opening Collaboration - A meditation on community',
    cta: 'Read the Poem',
    priority: 3,
  },
]

export const maxFeatured = 3
