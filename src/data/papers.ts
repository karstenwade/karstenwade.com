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
    slug: 'collab-x-framework',
    title: 'CollabX: The Collaborative Experience Framework',
    description: 'CollabX focuses on the human, cultural aspects of collaboration—sense of belonging, communication quality, and fairness in interactions.',
    abstract: 'CollabX focuses on the human, cultural aspects of collaboration—sense of belonging, communication quality, and fairness in interactions. It provides a framework for measuring and improving the "feel" of collaborative environments. Key concepts include sense of belonging, communication quality, fairness and equity, and cultural dynamics. Applications include diagnosing sources of community friction, improving team dynamics and psychological safety, and building more inclusive communities.',
    externalUrl: 'https://github.com/karstenwade/papers/blob/main/collab-x-framework.md',
    repository: 'https://github.com/karstenwade/papers',
    publicationDate: '2022-05-15',
    lastUpdated: '2024-11-21',
    version: '1.0',
    category: 'Framework',
    tags: ['Framework', 'Community', 'Developer Experience', 'Culture'],
    featured: true,
  },
  {
    slug: 'contrib-x-framework',
    title: 'ContribX: The Contributor Experience Framework',
    description: 'ContribX focuses on the technical and process aspects of contribution—tools, documentation, workflows, and efficiency.',
    abstract: 'ContribX focuses on the technical and process aspects of contribution—tools, documentation, workflows, and efficiency. It provides a framework for measuring and improving the practical mechanics of contributing to open source projects. Key concepts include tool accessibility, documentation quality, workflow efficiency, and technical barriers. Applications include optimizing contribution workflows, improving developer tooling, reducing barriers to first-time contributions, and measuring technical friction.',
    externalUrl: 'https://github.com/karstenwade/papers/blob/main/contrib-x-framework.md',
    repository: 'https://github.com/karstenwade/papers',
    publicationDate: '2022-05-15',
    lastUpdated: '2024-11-21',
    version: '1.0',
    category: 'Framework',
    tags: ['Framework', 'Developer Experience', 'Tooling', 'Process'],
    featured: true,
  },
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
