import Script from 'next/script'
import type { Poem } from '@/data/poetry'
import type { Essay } from '@/data/essays'
import type { Story } from '@/data/fiction'
import type { Paper } from '@/data/papers'
import type { BlogPost } from '@/lib/strapi'

export interface PersonData {
  name: string
  jobTitle: string
  description: string
  url: string
  image: string
  sameAs?: string[]
  knowsAbout?: string[]
}

export interface StructuredDataProps {
  type: 'person' | 'poem' | 'essay' | 'story' | 'paper' | 'blog'
  data?: PersonData | Poem | Essay | Story | Paper | BlogPost
}

const StructuredData = ({ type, data }: StructuredDataProps) => {
  let jsonLd: Record<string, unknown> = {}

  if (type === 'person') {
    // Default Person schema for Karsten Wade
    const personData: PersonData = data as PersonData || {
      name: 'Karsten Wade',
      jobTitle: 'Collaborative Experience Consultant',
      description: 'Collaboration catalyst and open collaboration expert specializing in developer experience (DevEx) and community building',
      url: 'https://karstenwade.com',
      image: 'https://karstenwade.com/assets/images/karsten-wade-headshot.jpg',
      sameAs: [
        'https://github.com/karstenwade',
        'https://twitter.com/quaid',
        'https://fosstodon.org/@quaid',
      ],
      knowsAbout: [
        'Developer Experience',
        'Open Source',
        'Community Architecture',
        'Collaborative Work',
        'OSPO',
        'The Open Source Way',
      ],
    }

    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: personData.name,
      jobTitle: personData.jobTitle,
      description: personData.description,
      url: personData.url,
      image: personData.image,
      sameAs: personData.sameAs,
      knowsAbout: personData.knowsAbout,
    }
  } else if (type === 'poem' && data) {
    // Schema.org CreativeWork for poems
    const poem = data as Poem
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      headline: poem.title,
      text: poem.fullText,
      author: {
        '@type': 'Person',
        name: 'Karsten Wade',
        url: 'https://karstenwade.com',
      },
      datePublished: poem.dateWritten,
      keywords: poem.tags.join(', '),
      genre: poem.form,
      inLanguage: 'en-US',
      abstract: poem.excerpt,
    }
  } else if (type === 'essay' && data) {
    // Schema.org Article for essays
    const essay = data as Essay
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: essay.title,
      articleBody: essay.fullText,
      author: {
        '@type': 'Person',
        name: 'Karsten Wade',
        url: 'https://karstenwade.com',
      },
      datePublished: essay.dateWritten,
      wordCount: essay.wordCount,
      inLanguage: 'en-US',
      abstract: essay.excerpt,
    }
  } else if (type === 'story' && data) {
    // Schema.org Article for fiction
    const story = data as Story
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: story.title,
      articleBody: story.fullText,
      author: {
        '@type': 'Person',
        name: 'Karsten Wade',
        url: 'https://karstenwade.com',
      },
      datePublished: story.dateWritten,
      wordCount: story.wordCount,
      genre: story.genre,
      inLanguage: 'en-US',
      abstract: story.excerpt,
    }
  } else if (type === 'paper' && data) {
    // Schema.org ScholarlyArticle for papers
    const paper = data as Paper
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ScholarlyArticle',
      headline: paper.title,
      abstract: paper.abstract,
      author: {
        '@type': 'Person',
        name: 'Karsten Wade',
        url: 'https://karstenwade.com',
      },
      datePublished: paper.publicationDate,
      dateModified: paper.lastUpdated,
      url: paper.externalUrl,
      keywords: paper.tags.join(', '),
      inLanguage: 'en-US',
      version: paper.version,
      ...(paper.doi && {
        identifier: {
          '@type': 'PropertyValue',
          propertyID: 'DOI',
          value: paper.doi,
        },
        sameAs: `https://doi.org/${paper.doi}`,
      }),
    }
  } else if (type === 'blog' && data) {
    // Schema.org BlogPosting for blog posts
    const post = data as BlogPost
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      articleBody: post.content,
      author: {
        '@type': 'Person',
        name: post.author || 'Karsten Wade',
        url: 'https://karstenwade.com',
      },
      datePublished: post.published_at,
      dateModified: post.updated_at,
      url: `https://karstenwade.com/blog/${post.slug}`,
      keywords: post.tags?.join(', '),
      inLanguage: 'en-US',
      abstract: post.excerpt,
      articleSection: post.category,
    }
  }

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default StructuredData
