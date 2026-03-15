// Theories data
// Corresponds to content in content/theories/

export interface RelatedFramework {
  name: string
  relationship: string
  url: string
}

export interface Theory {
  slug: string
  title: string
  frameworkName: string
  shortDescription: string
  description: string
  keyConcepts: string[]
  applications: string[]
  relatedFrameworks: RelatedFramework[]
  dateIntroduced: string
  currentVersion: string
  paperUrl?: string
  tags: string[]
  featured: boolean
}

export const theories: Theory[] = [
  {
    slug: 'collab-x',
    title: 'CollabX: The Collaborative Experience Framework',
    frameworkName: 'CollabX (Collaborative Experience)',
    shortDescription: 'CollabX focuses on the human, cultural aspects of collaboration—sense of belonging, communication quality, and fairness in interactions.',
    description: 'CollabX focuses on the **human, cultural aspects** of collaboration—sense of belonging, communication quality, and fairness in interactions. It provides a framework for measuring and improving the "feel" of collaborative environments.',
    keyConcepts: [
      'Sense of belonging - How welcome do contributors feel?',
      'Communication quality - Are conversations respectful and productive?',
      'Fairness and equity - Are opportunities and recognition distributed justly?',
      'Cultural dynamics - What norms and values shape the community?',
    ],
    applications: [
      'Diagnose sources of community friction',
      'Improve team dynamics and psychological safety',
      'Build more inclusive and welcoming communities',
      'Measure the "feel" of collaborative environments',
    ],
    relatedFrameworks: [
      {
        name: 'ContribX',
        relationship: 'orthogonal',
        url: '/theories/contrib-x',
      },
    ],
    dateIntroduced: '2022-05-15',
    currentVersion: '1.0',
    paperUrl: '/papers/collab-x-framework',
    tags: ['Framework', 'Community', 'Developer Experience', 'Culture'],
    featured: true,
  },
  {
    slug: 'contrib-x',
    title: 'ContribX: The Contributor Experience Framework',
    frameworkName: 'ContribX (Contributor Experience)',
    shortDescription: 'ContribX focuses on the technical and process aspects of contribution—tools, documentation, workflows, and efficiency.',
    description: 'ContribX focuses on the **technical and process aspects** of contribution—tools, documentation, workflows, and efficiency. It provides a framework for measuring and improving the practical mechanics of contributing to open source projects.',
    keyConcepts: [
      'Tool accessibility - Are development tools easy to use and install?',
      'Documentation quality - Can contributors find what they need?',
      'Workflow efficiency - How smooth is the contribution process?',
      'Technical barriers - What obstacles prevent participation?',
    ],
    applications: [
      'Optimize contribution workflows',
      'Improve developer tooling and infrastructure',
      'Reduce barriers to first-time contributions',
      'Measure technical friction in the contribution process',
    ],
    relatedFrameworks: [
      {
        name: 'CollabX',
        relationship: 'orthogonal',
        url: '/theories/collab-x',
      },
    ],
    dateIntroduced: '2022-05-15',
    currentVersion: '1.0',
    paperUrl: '/papers/contrib-x-framework',
    tags: ['Framework', 'Developer Experience', 'Tooling', 'Process'],
    featured: true,
  },
]
