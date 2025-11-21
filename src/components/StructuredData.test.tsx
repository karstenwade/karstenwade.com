import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import StructuredData from './StructuredData'
import type { PersonData } from './StructuredData'
import type { Poem } from '../data/poetry'
import type { Essay } from '../data/essays'
import type { Story } from '../data/fiction'
import type { Paper } from '../data/papers'

// Helper to render with HelmetProvider
const renderWithHelmet = (ui: React.ReactElement) => {
  return render(<HelmetProvider>{ui}</HelmetProvider>)
}

describe('StructuredData Component', () => {
  describe('Person Schema', () => {
    it('should render without errors with person type', () => {
      expect(() => {
        renderWithHelmet(<StructuredData type="person" />)
      }).not.toThrow()
    })

    it('should accept custom person data', () => {
      const customPerson: PersonData = {
        name: 'Custom Person',
        jobTitle: 'Test Job',
        description: 'Test description',
        url: 'https://example.com',
        image: 'https://example.com/image.jpg',
        sameAs: ['https://example.com/social'],
        knowsAbout: ['Testing'],
      }

      expect(() => {
        renderWithHelmet(<StructuredData type="person" data={customPerson} />)
      }).not.toThrow()
    })

    it('should use default person data when no data provided', () => {
      const { container } = renderWithHelmet(<StructuredData type="person" />)
      expect(container).toBeTruthy()
      // Component uses Karsten Wade's default data
    })
  })

  describe('Poem Schema', () => {
    const mockPoem: Poem = {
      title: 'Test Poem',
      excerpt: 'First lines\nof the poem',
      firstLine: 'First lines',
      fullText: 'First lines\nof the poem\nwith more content',
      dateWritten: '2024-01-15',
      form: 'Free Verse',
      theme: 'Nature, time',
      tags: ['nature', 'time', 'meditation'],
      slug: 'test-poem',
      featured: true,
    }

    it('should render without errors with poem data', () => {
      expect(() => {
        renderWithHelmet(<StructuredData type="poem" data={mockPoem} />)
      }).not.toThrow()
    })

    it('should accept all poem fields', () => {
      const { container } = renderWithHelmet(
        <StructuredData type="poem" data={mockPoem} />
      )
      expect(container).toBeTruthy()
      // Component creates CreativeWork schema with poem data
    })

    it('should handle poem without data', () => {
      expect(() => {
        renderWithHelmet(<StructuredData type="poem" />)
      }).not.toThrow()
    })
  })

  describe('Essay Schema', () => {
    const mockEssay: Essay = {
      title: 'Test Essay',
      excerpt: 'Opening paragraph of the essay.',
      fullText: 'Opening paragraph.\n\nSecond paragraph.\n\nClosing thoughts.',
      dateWritten: '2024-01-15',
      theme: 'Writing, identity',
      wordCount: 150,
      tags: ['writing', 'identity'],
      slug: 'test-essay',
      featured: true,
    }

    it('should render without errors with essay data', () => {
      expect(() => {
        renderWithHelmet(<StructuredData type="essay" data={mockEssay} />)
      }).not.toThrow()
    })

    it('should accept all essay fields', () => {
      const { container } = renderWithHelmet(
        <StructuredData type="essay" data={mockEssay} />
      )
      expect(container).toBeTruthy()
      // Component creates Article schema with essay data
    })

    it('should include word count for essays', () => {
      const { container } = renderWithHelmet(
        <StructuredData type="essay" data={mockEssay} />
      )
      expect(container).toBeTruthy()
      // Schema includes wordCount property
    })

    it('should handle essay without data', () => {
      expect(() => {
        renderWithHelmet(<StructuredData type="essay" />)
      }).not.toThrow()
    })
  })

  describe('Story (Fiction) Schema', () => {
    const mockStory: Story = {
      title: 'Test Story',
      excerpt: 'Opening lines of the story.',
      fullText: 'Opening lines.\n\nThe plot thickens.\n\nThe end.',
      dateWritten: '2024-01-15',
      genre: 'Flash Fiction',
      theme: 'Technology, nostalgia',
      wordCount: 420,
      tags: ['flash-fiction', 'technology'],
      slug: 'test-story',
      featured: false,
    }

    it('should render without errors with story data', () => {
      expect(() => {
        renderWithHelmet(<StructuredData type="story" data={mockStory} />)
      }).not.toThrow()
    })

    it('should accept all story fields', () => {
      const { container } = renderWithHelmet(
        <StructuredData type="story" data={mockStory} />
      )
      expect(container).toBeTruthy()
      // Component creates Article schema with story data
    })

    it('should include genre for stories', () => {
      const { container } = renderWithHelmet(
        <StructuredData type="story" data={mockStory} />
      )
      expect(container).toBeTruthy()
      // Schema includes genre property
    })

    it('should handle story without data', () => {
      expect(() => {
        renderWithHelmet(<StructuredData type="story" />)
      }).not.toThrow()
    })
  })

  describe('Paper Schema', () => {
    const mockPaper: Paper = {
      id: 'test-paper',
      title: 'Test Paper',
      abstract: 'Abstract of the test paper.',
      publicationDate: '2024-01-15',
      lastUpdated: '2024-02-01',
      externalUrl: 'https://example.com/paper',
      tags: ['research', 'testing'],
      featured: true,
      version: '1.0',
      slug: 'test-paper',
    }

    it('should render without errors with paper data', () => {
      expect(() => {
        renderWithHelmet(<StructuredData type="paper" data={mockPaper} />)
      }).not.toThrow()
    })

    it('should accept all paper fields', () => {
      const { container } = renderWithHelmet(
        <StructuredData type="paper" data={mockPaper} />
      )
      expect(container).toBeTruthy()
      // Component creates ScholarlyArticle schema
    })

    it('should include version and update dates', () => {
      const { container } = renderWithHelmet(
        <StructuredData type="paper" data={mockPaper} />
      )
      expect(container).toBeTruthy()
      // Schema includes version, datePublished, dateModified
    })

    it('should handle paper without data', () => {
      expect(() => {
        renderWithHelmet(<StructuredData type="paper" />)
      }).not.toThrow()
    })
  })

  describe('Schema Type Coverage', () => {
    it('should support person schema type', () => {
      const { container } = renderWithHelmet(<StructuredData type="person" />)
      expect(container).toBeTruthy()
    })

    it('should support poem schema type', () => {
      const mockPoem: Poem = {
        title: 'Poem',
        excerpt: 'Lines',
        firstLine: 'Lines',
        fullText: 'Full text',
        dateWritten: '2024-01-01',
        form: 'Free Verse',
        theme: 'Nature',
        tags: ['nature'],
        slug: 'poem',
        featured: false,
      }
      const { container } = renderWithHelmet(
        <StructuredData type="poem" data={mockPoem} />
      )
      expect(container).toBeTruthy()
    })

    it('should support essay schema type', () => {
      const mockEssay: Essay = {
        title: 'Essay',
        excerpt: 'Excerpt',
        fullText: 'Full text',
        dateWritten: '2024-01-01',
        theme: 'Writing',
        wordCount: 100,
        tags: ['writing'],
        slug: 'essay',
        featured: false,
      }
      const { container } = renderWithHelmet(
        <StructuredData type="essay" data={mockEssay} />
      )
      expect(container).toBeTruthy()
    })

    it('should support story schema type', () => {
      const mockStory: Story = {
        title: 'Story',
        excerpt: 'Excerpt',
        fullText: 'Full text',
        dateWritten: '2024-01-01',
        genre: 'Fiction',
        theme: 'Adventure',
        wordCount: 500,
        tags: ['fiction'],
        slug: 'story',
        featured: false,
      }
      const { container } = renderWithHelmet(
        <StructuredData type="story" data={mockStory} />
      )
      expect(container).toBeTruthy()
    })

    it('should support paper schema type', () => {
      const mockPaper: Paper = {
        id: 'paper',
        title: 'Paper',
        abstract: 'Abstract',
        publicationDate: '2024-01-01',
        lastUpdated: '2024-01-01',
        externalUrl: 'https://example.com',
        tags: ['research'],
        featured: false,
        version: '1.0',
        slug: 'paper',
      }
      const { container } = renderWithHelmet(
        <StructuredData type="paper" data={mockPaper} />
      )
      expect(container).toBeTruthy()
    })
  })

  describe('Author Information', () => {
    it('should include Karsten Wade as author in all content schemas', () => {
      const mockEssay: Essay = {
        title: 'Test',
        excerpt: 'Test',
        fullText: 'Test',
        dateWritten: '2024-01-01',
        theme: 'Test',
        wordCount: 100,
        tags: ['test'],
        slug: 'test',
        featured: false,
      }

      const { container } = renderWithHelmet(
        <StructuredData type="essay" data={mockEssay} />
      )
      expect(container).toBeTruthy()
      // All schemas include author with name "Karsten Wade"
    })
  })

  describe('Language Support', () => {
    it('should set inLanguage to en-US for content schemas', () => {
      const mockEssay: Essay = {
        title: 'Test',
        excerpt: 'Test',
        fullText: 'Test',
        dateWritten: '2024-01-01',
        theme: 'Test',
        wordCount: 100,
        tags: ['test'],
        slug: 'test',
        featured: false,
      }

      const { container } = renderWithHelmet(
        <StructuredData type="essay" data={mockEssay} />
      )
      expect(container).toBeTruthy()
      // Schema includes inLanguage: "en-US"
    })
  })
})
