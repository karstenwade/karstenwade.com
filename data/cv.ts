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
  title: 'Open Source Community Architect, OSPO Leader & Developer Experience Expert',
  summary: 'Experienced community manager, architect, and leader with a deep foundation in Open Source developer relations, product R&D methodologies, and secure networking operations. Proven track record in architecting and building scalable, high-impact developer and Open Source communities, implementing best practices for community engagement, and advancing secure, user-focused product strategies. Skilled in Open Source project leadership, technical program management, and systems administration, bringing a comprehensive approach to developer advocacy and managing Open Source projects as part of the product R&D process.',
  contact: {
    email: 'karsten@karstenwade.com',
    linkedin: 'https://linkedin.com/in/karsten-wade',
    github: 'https://github.com/quaid',
    website: 'https://karstenwade.com',
  },
  expertise: [
    'Community Management and Best Practices - Extensive experience leading community management strategies, building engaged Open Source communities, and implementing best practices through programs like The Open Source Way',
    'Customer Developer Relations - Strong background in engaging with developer communities, managing customer feedback loops, and enhancing user retention and advocacy',
    'Open Source Product Management and R&D Methodologies - Skilled in Open Source product management with emphasis on R&D processes, aligning community insights with product objectives',
    'Systems and Security Administration - Extensive knowledge in secure network administration and cloud-native systems, including Linux-based security practices and SELinux integration',
    'Cross-Functional Leadership and Advocacy - Proven leader in cross-functional initiatives with expertise in unifying stakeholders and aligning community goals with business strategy',
    'Technical Content Development - Proficient in creating user and developer-centric educational resources, including blog posts, technical guides, and training materials',
    'Open Source Ecosystem and Compliance - Strong understanding of Open Source security practices, supply chain security, vulnerability management, and maintaining integrity across contributions',
    'Organizational Catalyst - In-depth experience with culture, change, and technical program management, with training and practical experience in DEI practices and initiatives',
  ],
  experience: 'Over 25 years of professional experience in Open Source community architecture and developer relations. Currently Founder of Open Community Architects (2023-present), providing full-lifecycle Open Source strategy and execution consulting. Previously spent 20 years at Red Hat (2003-2023) in progressive leadership roles including Principal Community Architect, where co-originated Red Hat\'s OSPO and developed The Open Source Way industry guide. Key achievements include architecting CentOS integration into Red Hat, championing SELinux adoption through Fedora, leading Operate First cloud-native initiatives, and managing global Open Source communities across Linux, virtualization, cloud, big data, and AI/ML domains. Earlier career includes technical writing, developer advocacy, systems administration, and web development roles.',
  education: 'Self-directed learning and professional development in Open Source technologies, community management, and systems administration. Extensive hands-on experience and certifications in Linux, SELinux, cloud-native technologies, and Open Source governance.',
  publications: [
    'Creator and maintainer of The Open Source Way 2.0 - Industry-standard guide for community management and collaboration',
    'Author of Red Hat Enterprise Linux (RHEL) 4 Security Enhanced Linux (SELinux) Guide',
    'Author of Fedora Core 2+ SELinux FAQ',
    'Creator of OSAI tl;dr newsletter - Weekly insights on Open Source and AI intersection',
    'Regular speaker at major industry conferences including KubeCon, Open Source Summit, All Things Open, and Red Hat Summit',
    'Maintainer and contributor to the Inclusive Naming Initiative',
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
