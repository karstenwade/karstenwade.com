// Open Papers data
// Corresponds to content in content/papers/

export interface Paper {
  id?: string // Unique identifier (typically the slug)
  slug?: string // URL-friendly identifier (filename without .md)
  title: string
  description: string
  abstract: string
  externalUrl: string
  pdfUrl?: string
  repository: string
  publicationDate: string
  lastUpdated: string
  version: string
  category: string
  tags: string[]
  featured: boolean
}

export const papers: Paper[] = [
  {
    slug: 'open-source-way',
    title: 'The Open Source Way 2.0: A Handbook for Community Building',
    description: 'Comprehensive guide to building and managing open source communities, based on decades of Red Hat community architecture experience.',
    abstract: 'A comprehensive guide to building and managing open source communities, based on decades of Red Hat community architecture experience. This handbook covers community-building best practices, governance models, contributor onboarding, and sustainable open source program offices (OSPOs).',
    externalUrl: 'https://guidebook.theopensourceway.org/',
    repository: 'https://github.com/theopensourceway/guidebook',
    publicationDate: '2020-08-15',
    lastUpdated: '2024-03-10',
    version: '2.0',
    category: 'Community Architecture',
    tags: ['Open Source', 'Community Management', 'Developer Relations', 'OSPO'],
    featured: true,
  },
]
