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
    slug: 'Understanding_Collaborative_Experience--CollabX--and_Contributor_Experience--ContribX',
    headline: 'Understanding Collaborative Experience (CollabX) and Contributor Experience (ContribX)',
    subheadline: 'A granular framework for understanding and improving how humans work together',
    cta: 'Read the Paper',
    priority: 1,
  },
  {
    type: 'paper',
    slug: 'Karsten_BIG_TOE',
    headline: "Karsten's BIG-TOE",
    subheadline: 'Big, Inclusive, and General Theory Of Everything - index of open papers',
    cta: 'Explore BIG-TOE',
    priority: 2,
  },
  {
    type: 'poem',
    slug: 'bonn-cemetery-alter-friedhof',
    headline: 'Poetry',
    subheadline: 'Bonn Cemetery: Alter Friedhof - Meditation on time and love',
    cta: 'Read the Poem',
    priority: 3,
  },
]

export const maxFeatured = 3
