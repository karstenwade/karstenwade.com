# Strapi Client Usage Examples

## New Content Types

The Strapi client now supports three additional content types: Papers, Writings, and TOSW Chapters.

### Papers

```typescript
import { strapiClient } from '@/lib/strapi'

// Get all papers
const { papers, total } = await strapiClient.getPapers({ limit: 10 })

// Get featured papers only
const { papers: featured } = await strapiClient.getPapers({ featured: true })

// Get a specific paper by slug
const paper = await strapiClient.getPaperBySlug('my-paper-slug')

// Pagination
const { papers: page2 } = await strapiClient.getPapers({
  limit: 10,
  offset: 10
})
```

### Writings

```typescript
import { strapiClient } from '@/lib/strapi'

// Get all writings
const { writings, total } = await strapiClient.getWritings()

// Get poems only
const poems = await strapiClient.getPoems({ limit: 20 })

// Get essays only
const essays = await strapiClient.getEssays()

// Get stories only
const stories = await strapiClient.getStories()

// Get specific writing by slug
const writing = await strapiClient.getWritingBySlug('my-poem-slug')

// Filter by type
const { writings: poemsWithPaging } = await strapiClient.getWritings({
  type: 'poem',
  limit: 10,
  offset: 0
})
```

### TOSW Chapters

```typescript
import { strapiClient } from '@/lib/strapi'

// Get all chapters
const { chapters, total } = await strapiClient.getToswChapters()

// Get chapters from a specific section
const { chapters: gettingStarted } = await strapiClient.getToswChapters({
  section: 'Getting Started'
})

// Get a specific chapter by slug
const chapter = await strapiClient.getToswChapterBySlug('introduction')

// Get all unique sections
const sections = await strapiClient.getToswSections()
// Returns: ['Getting Started', 'Community 101', 'Project and Community', ...]
```

## Type Definitions

All methods are fully typed. Import the interfaces:

```typescript
import { Paper, Writing, ToswChapter } from '@/lib/strapi'

// Use in your components
interface PaperListProps {
  papers: Paper[]
}

const PaperList: React.FC<PaperListProps> = ({ papers }) => {
  return (
    <ul>
      {papers.map(paper => (
        <li key={paper.id}>
          <h3>{paper.title}</h3>
          <p>{paper.abstract}</p>
          {paper.pdf_url && <a href={paper.pdf_url}>Download PDF</a>}
        </li>
      ))}
    </ul>
  )
}
```

## ZeroDB Tables

The client queries these ZeroDB tables:
- `strapi_papers`
- `strapi_writings`
- `strapi_tosw_chapters`

These tables are automatically synced from Strapi via lifecycle hooks.

## Next.js Integration

Use with Next.js App Router:

```typescript
// app/papers/page.tsx
import { strapiClient } from '@/lib/strapi'

export default async function PapersPage() {
  const { papers } = await strapiClient.getPapers({ limit: 20 })

  return (
    <div>
      <h1>Papers</h1>
      {papers.map(paper => (
        <article key={paper.id}>
          <h2>{paper.title}</h2>
          <p>{paper.abstract}</p>
        </article>
      ))}
    </div>
  )
}

// app/papers/[slug]/page.tsx
import { strapiClient } from '@/lib/strapi'
import { notFound } from 'next/navigation'

export default async function PaperPage({
  params
}: {
  params: { slug: string }
}) {
  const paper = await strapiClient.getPaperBySlug(params.slug)

  if (!paper) {
    notFound()
  }

  return (
    <article>
      <h1>{paper.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: paper.content }} />
    </article>
  )
}

// Generate static params for build
export async function generateStaticParams() {
  const { papers } = await strapiClient.getPapers({ limit: 100 })
  return papers.map(paper => ({ slug: paper.slug }))
}
```
