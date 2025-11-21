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
    title: 'The Open Source Way 2.0: A Handbook for Community Building',
    description: 'Comprehensive guide to building and managing open source communities, based on decades of Red Hat community architecture experience.',
    abstract: 'A comprehensive guide to building and managing open source communities, based on decades of Red Hat community architecture experience. This handbook covers community-building best practices, governance models, contributor onboarding, and sustainable open source program offices (OSPOs).',
    externalUrl: 'https://github.com/karstenwade/papers/blob/main/open-source-way-2.0.md',
    pdfUrl: 'https://github.com/karstenwade/papers/releases/download/v2.0/open-source-way.pdf',
    repository: 'https://github.com/karstenwade/papers',
    publicationDate: '2020-08-15',
    lastUpdated: '2024-03-10',
    version: '2.0',
    category: 'Community Architecture',
    tags: ['Open Source', 'Community Management', 'Developer Relations', 'OSPO'],
    featured: true,
  },
]
