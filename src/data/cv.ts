// CV data
// Corresponds to content in content/cv/

export interface DownloadLink {
  format: string
  label: string
  url: string
  fileSize: string
}

export interface ContactInfo {
  email: string
  linkedin: string
  github: string
  website: string
}

export interface CVData {
  name: string
  title: string
  summary: string
  contact: ContactInfo
  expertise: string[]
  experience: string
  education: string
  publications: string[]
  downloadLinks: DownloadLink[]
  lastUpdated: string
}

export const cvData: CVData = {
  name: 'Karsten Wade',
  title: 'Open Source Community Architect & OSPO Leader',
  summary: 'Open Source Community Architect with over 20 years of experience building and managing communities, leading OSPO initiatives, and advancing developer relations. Expert in collaborative experience (CollabX), contributor experience (ContribX), and human systems design.',
  contact: {
    email: 'karsten@karstenwade.com',
    linkedin: 'https://linkedin.com/in/karstenwade',
    github: 'https://github.com/karstenwade',
    website: 'https://karstenwade.com',
  },
  expertise: [
    'Collaborative experience consulting - Helping organizations design better collaborative workflows',
    'Collaboration catalyst - Enabling teams to work together more effectively',
    'Open collaboration expert - Deep expertise in open source methodologies',
    'Developer experience expert - Optimizing DevEx and developer productivity',
    'Community catalyst - Building and nurturing technical communities',
    'Contribution enabler - Removing barriers to participation',
  ],
  experience: '[Placeholder for detailed work history]',
  education: '[Placeholder for education details]',
  publications: [
    'Co-author, The Open Source Way 2.0',
    'Creator, CollabX and ContribX frameworks',
    'Conference speaker on community architecture and OSPO leadership',
  ],
  downloadLinks: [
    {
      format: 'PDF',
      label: 'Full CV',
      url: '/assets/docs/karsten-wade-full-cv.pdf',
      fileSize: '245 KB',
    },
    {
      format: 'PDF',
      label: 'Community Manager Resume',
      url: '/assets/docs/karsten-wade-community-manager.pdf',
      fileSize: '180 KB',
    },
  ],
  lastUpdated: '2025-11-02',
}
