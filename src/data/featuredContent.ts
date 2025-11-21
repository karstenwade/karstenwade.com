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
    slug: 'open-source-way',
    headline: 'The Open Source Way 2.0',
    subheadline: 'Industry-standard handbook for community building',
    cta: 'Read the Guide',
    priority: 1,
  },
  {
    type: 'poem',
    slug: 'bonn-cemetery-alter-friedhof',
    headline: 'Poetry',
    subheadline: 'Bonn Cemetery: Alter Friedhof - Meditation on time and love',
    cta: 'Read the Poem',
    priority: 2,
  },
]

export const maxFeatured = 3
