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
    slug: 'Understanding_Collaborative_Experience--CollabX--and_Contributor_Experience--ContribX',
    title: 'Understanding Collaborative Experience (CollabX) and Contributor Experience (ContribX)',
    description: 'A granular framework for understanding and improving how humans work together, examining both human-to-human (CollabX) and human-to-system (ContribX) dynamics.',
    abstract: 'The concepts of Collaborative Experience (CollabX) and Contributor Experience (ContribX) offer a granular framework for understanding and improving how humans work together to create something. While these concepts are essentially core pillars of Developer Experience (DevEx), they fundamentally address the dynamics involved in any creative or constructive endeavor where people gather to create an artifact or service.',
    externalUrl: 'https://github.com/karstenwade/papers/blob/main/Understanding_Collaborative_Experience--CollabX--and_Contributor_Experience--ContribX.md',
    repository: 'https://github.com/karstenwade/papers',
    publicationDate: '2025-10-01',
    lastUpdated: '2025-10-01',
    version: '1.0',
    category: 'Collaboration Theory',
    tags: ['CollabX', 'ContribX', 'DevEx', 'Collaboration', 'Developer Experience', 'Open Source'],
    featured: true,
  },
  {
    slug: 'Karsten_BIG_TOE',
    title: "Karsten's BIG-TOE: Big, Inclusive, and General Theory Of Everything",
    description: "An index of open papers outlining Karsten Wade's accumulated theories across open collaboration, people, principles, and practice.",
    abstract: "Karsten's BIG-TOE is a thought-container for the many small, partially-complete theories accumulated across the mindscape over the years. This document serves as an index to theories of open (collaboration, equity), theories of people, theories of principle, and theories of practice including CollabX and ContribX frameworks.",
    externalUrl: 'https://github.com/karstenwade/papers/blob/main/Karsten_BIG_TOE.md',
    repository: 'https://github.com/karstenwade/papers',
    publicationDate: '2025-01-01',
    lastUpdated: '2025-10-01',
    version: '0.2',
    category: 'Theory Index',
    tags: ['BIG-TOE', 'Theory', 'Open Collaboration', 'CollabX', 'ContribX', 'Open Source'],
    featured: true,
  },
  {
    slug: 'Framework_The-Collaborative-Experience_CollabX_',
    title: 'Framework: The Collaborative Experience (CollabX)',
    description: 'A guide to understanding, diagnosing, and improving the human-to-human dynamics of group endeavors.',
    abstract: 'CollabX is the human-to-human element of collaboration—the subjective, qualitative experience an individual has when interacting with other people in pursuit of a common goal. This framework provides core principles, key dimensions, and practical patterns for building psychological safety, effective communication, and equitable governance in any collaborative setting.',
    externalUrl: 'https://github.com/karstenwade/papers/blob/main/Framework_The-Collaborative-Experience_CollabX_.md',
    repository: 'https://github.com/karstenwade/papers',
    publicationDate: '2025-10-01',
    lastUpdated: '2025-10-01',
    version: '0.1-draft',
    category: 'Collaboration Framework',
    tags: ['CollabX', 'Collaboration', 'Psychological Safety', 'Team Dynamics', 'Governance', 'Communication'],
    featured: false,
  },
  {
    slug: 'Framework_The-Contributor-Experience_ContribX_',
    title: 'Framework: The Contributor Experience (ContribX)',
    description: 'A guide to understanding, diagnosing, and improving the human-to-system dynamics of group endeavors.',
    abstract: 'ContribX is the human-to-system element of collaboration—the experience an individual has when interacting with the tools, processes, and artifacts required to contribute to a project. This framework covers onboarding, cognitive load reduction, feedback loops, flow states, and the sense of meaning that comes from integrated contributions.',
    externalUrl: 'https://github.com/karstenwade/papers/blob/main/Framework_The-Contributor-Experience_ContribX_.md',
    repository: 'https://github.com/karstenwade/papers',
    publicationDate: '2025-10-01',
    lastUpdated: '2025-10-01',
    version: '0.1-draft',
    category: 'Contribution Framework',
    tags: ['ContribX', 'DevEx', 'Developer Experience', 'Onboarding', 'Feedback Loops', 'Contribution'],
    featured: false,
  },
]
