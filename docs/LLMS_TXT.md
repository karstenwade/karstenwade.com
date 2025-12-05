# llms.txt Implementation for karstenwade.com

**Version:** 1.0
**Created:** 2025-12-01
**Purpose:** Make site content discoverable and structured for LLMs
**Standard:** Based on llms.txt proposal (similar to robots.txt for LLMs)

---

## What is llms.txt?

**llms.txt** is an emerging standard that provides structured information about a website's content to LLMs. Similar to how `robots.txt` tells web crawlers what to index, `llms.txt` tells LLMs:

- What content is available
- How content is organized
- Where to find specific types of information
- Content update frequency and canonical URLs
- Structured metadata for better context understanding

---

## File Locations

### Root llms.txt
**URL:** `https://karstenwade.com/llms.txt`
**File:** `public/llms.txt`

Provides top-level site structure and navigation to content-specific llms.txt files.

### Content-Type Specific llms.txt

Each content section has its own llms.txt:

- `https://karstenwade.com/poetry/llms.txt`
- `https://karstenwade.com/fiction/llms.txt`
- `https://karstenwade.com/essays/llms.txt`
- `https://karstenwade.com/papers/llms.txt`
- `https://karstenwade.com/opensource-way/llms.txt`

---

## Root llms.txt Structure

**File:** `public/llms.txt`

```text
# Karsten Wade - Collaborative Experience Consulting

## About
Website: https://karstenwade.com
Author: Karsten Wade
Email: karsten@karstenwade.com
Description: Open Source Community Architect, OSPO Leader & Developer Experience Expert
LinkedIn: https://linkedin.com/in/karsten-wade
GitHub: https://github.com/quaid

## Site Structure

### Content Sections
- Poetry: https://karstenwade.com/poetry/llms.txt
- Fiction: https://karstenwade.com/fiction/llms.txt
- Essays: https://karstenwade.com/essays/llms.txt
- Papers: https://karstenwade.com/papers/llms.txt
- The Open Source Way: https://karstenwade.com/opensource-way/llms.txt

### Main Pages
- Home: https://karstenwade.com/
- CV/Resume: https://karstenwade.com/cv
- Writing: https://karstenwade.com/writing
- Search: https://karstenwade.com/search

## Content Overview

Total content items: {{ total_count }}
Last updated: {{ last_updated_iso }}

### By Type
- Poetry: {{ poetry_count }} poems
- Fiction: {{ fiction_count }} stories
- Essays: {{ essays_count }} essays
- Papers: {{ papers_count }} papers
- Open Source Way: {{ opensource_way_count }} chapters

## Search
Semantic search available at: https://karstenwade.com/search
API endpoint: https://karstenwade.com/api/search (POST)

## Content Sources

### Owned Repositories
- Poetry: https://github.com/karstenwade/poetry
- Fiction: https://github.com/karstenwade/fiction
- Essays: https://github.com/karstenwade/essays
- Papers: https://github.com/karstenwade/papers

### External Sources (Mirrored)
- The Open Source Way: https://github.com/theopensourceway/guidebook
  - Original site: https://guidebook.theopensourceway.org/

## License
Content is licensed under Creative Commons Attribution-ShareAlike 4.0
Code is licensed under MIT License

## Last Updated
{{ last_updated_iso }}
```

---

## Content-Specific llms.txt Structure

### Example: Poetry llms.txt

**File:** `app/poetry/llms.txt/route.ts` (dynamically generated)

```text
# Poetry - Karsten Wade

## Overview
Content Type: Poetry
Total Items: {{ count }}
Last Updated: {{ last_updated }}
Canonical URL: https://karstenwade.com/poetry
Source Repository: https://github.com/karstenwade/poetry

## Content Index

{% for poem in poems %}
### {{ poem.title }}
- Slug: {{ poem.slug }}
- URL: https://karstenwade.com/poetry/{{ poem.slug }}
- Published: {{ poem.published_date }}
- Tags: {{ poem.tags.join(', ') }}
- Word Count: {{ poem.word_count }}
- Reading Time: {{ poem.reading_time_minutes }} min
- Excerpt: {{ poem.excerpt }}

{% endfor %}

## Search
All poetry is searchable via semantic search at:
https://karstenwade.com/search?type=poetry

## Updates
This section is updated automatically when new poetry is published.
Content is synced from: https://github.com/karstenwade/poetry
```

### Example: The Open Source Way llms.txt

**File:** `app/opensource-way/llms.txt/route.ts`

```text
# The Open Source Way - Mirrored on karstenwade.com

## Overview
Content Type: Open Source Community Guidebook
Total Chapters: {{ count }}
Last Synced: {{ last_synced }}
Canonical Site: https://guidebook.theopensourceway.org/
Source Repository: https://github.com/theopensourceway/guidebook
Mirrored URL: https://karstenwade.com/opensource-way

## Attribution
This content is mirrored from The Open Source Way project.
Original authors and contributors: https://github.com/theopensourceway/guidebook/blob/main/CONTRIBUTORS.md
License: Creative Commons Attribution-ShareAlike 4.0

## Content Index

{% for chapter in chapters %}
### {{ chapter.title }}
- Slug: {{ chapter.slug }}
- URL: https://karstenwade.com/opensource-way/{{ chapter.slug }}
- Original URL: https://guidebook.theopensourceway.org/{{ chapter.slug }}
- Topic: {{ chapter.topic }}
- Word Count: {{ chapter.word_count }}
- Last Updated: {{ chapter.updated_date }}

{% endfor %}

## Topics
- Attracting Users
- Getting Started
- Growing Contributors
- Guiding Participants
- Measuring Success

## Search
Search across all Open Source Way content:
https://karstenwade.com/search?type=opensource-way
```

---

## Implementation

### Dynamic Generation via Next.js Route Handlers

**File:** `app/llms.txt/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { fetchContentFromZeroDB } from '@/lib/zerodb-client'

export async function GET() {
  // Fetch content counts from ZeroDB
  const poetryCount = await fetchContentFromZeroDB({
    content_type: 'poetry',
    published: true,
  }).then((items) => items.length)

  const fictionCount = await fetchContentFromZeroDB({
    content_type: 'fiction',
    published: true,
  }).then((items) => items.length)

  const essaysCount = await fetchContentFromZeroDB({
    content_type: 'essays',
    published: true,
  }).then((items) => items.length)

  const papersCount = await fetchContentFromZeroDB({
    content_type: 'papers',
    published: true,
  }).then((items) => items.length)

  const opensourceWayCount = await fetchContentFromZeroDB({
    content_type: 'opensource-way',
    published: true,
  }).then((items) => items.length)

  const totalCount =
    poetryCount + fictionCount + essaysCount + papersCount + opensourceWayCount

  const lastUpdated = new Date().toISOString()

  const llmsTxt = `# Karsten Wade - Collaborative Experience Consulting

## About
Website: https://karstenwade.com
Author: Karsten Wade
Email: karsten@karstenwade.com
Description: Open Source Community Architect, OSPO Leader & Developer Experience Expert
LinkedIn: https://linkedin.com/in/karsten-wade
GitHub: https://github.com/quaid

## Site Structure

### Content Sections
- Poetry: https://karstenwade.com/poetry/llms.txt
- Fiction: https://karstenwade.com/fiction/llms.txt
- Essays: https://karstenwade.com/essays/llms.txt
- Papers: https://karstenwade.com/papers/llms.txt
- The Open Source Way: https://karstenwade.com/opensource-way/llms.txt

### Main Pages
- Home: https://karstenwade.com/
- CV/Resume: https://karstenwade.com/cv
- Writing: https://karstenwade.com/writing
- Search: https://karstenwade.com/search

## Content Overview

Total content items: ${totalCount}
Last updated: ${lastUpdated}

### By Type
- Poetry: ${poetryCount} poems
- Fiction: ${fictionCount} stories
- Essays: ${essaysCount} essays
- Papers: ${papersCount} papers
- Open Source Way: ${opensourceWayCount} chapters

## Search
Semantic search available at: https://karstenwade.com/search
API endpoint: https://karstenwade.com/api/search (POST)

## Content Sources

### Owned Repositories
- Poetry: https://github.com/karstenwade/poetry
- Fiction: https://github.com/karstenwade/fiction
- Essays: https://github.com/karstenwade/essays
- Papers: https://github.com/karstenwade/papers

### External Sources (Mirrored)
- The Open Source Way: https://github.com/theopensourceway/guidebook
  - Original site: https://guidebook.theopensourceway.org/

## License
Content is licensed under Creative Commons Attribution-ShareAlike 4.0
Code is licensed under MIT License

## Last Updated
${lastUpdated}
`

  return new NextResponse(llmsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
```

### Content-Specific llms.txt

**File:** `app/poetry/llms.txt/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { fetchContentFromZeroDB } from '@/lib/zerodb-client'

export async function GET() {
  const poems = await fetchContentFromZeroDB({
    content_type: 'poetry',
    published: true,
    order_by: 'published_date',
    order: 'desc',
  })

  const lastUpdated = poems[0]?.updated_date || new Date().toISOString()

  let llmsTxt = `# Poetry - Karsten Wade

## Overview
Content Type: Poetry
Total Items: ${poems.length}
Last Updated: ${lastUpdated}
Canonical URL: https://karstenwade.com/poetry
Source Repository: https://github.com/karstenwade/poetry

## Content Index

`

  for (const poem of poems) {
    llmsTxt += `### ${poem.title}
- Slug: ${poem.slug}
- URL: https://karstenwade.com/poetry/${poem.slug}
- Published: ${poem.published_date}
- Tags: ${poem.tags.join(', ')}
- Word Count: ${poem.word_count}
- Reading Time: ${poem.reading_time_minutes} min
- Excerpt: ${poem.excerpt}

`
  }

  llmsTxt += `
## Search
All poetry is searchable via semantic search at:
https://karstenwade.com/search?type=poetry

## Updates
This section is updated automatically when new poetry is published.
Content is synced from: https://github.com/karstenwade/poetry
`

  return new NextResponse(llmsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
```

---

## Static Generation During Build

For better performance, generate static `llms.txt` files during build:

**File:** `scripts/generate-llms-txt.ts`

```typescript
import fs from 'fs'
import path from 'path'
import { fetchContentFromZeroDB } from '../lib/zerodb-client'

async function generateLlmsTxt() {
  console.log('Generating llms.txt files...')

  // Generate root llms.txt
  const rootLlms = await generateRootLlmsTxt()
  fs.writeFileSync(path.join('public', 'llms.txt'), rootLlms)
  console.log('✅ Generated public/llms.txt')

  // Generate content-specific llms.txt files
  const contentTypes = ['poetry', 'fiction', 'essays', 'papers', 'opensource-way']

  for (const contentType of contentTypes) {
    const llmsTxt = await generateContentLlmsTxt(contentType)
    const dir = path.join('public', contentType)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(path.join(dir, 'llms.txt'), llmsTxt)
    console.log(`✅ Generated public/${contentType}/llms.txt`)
  }

  console.log('Done generating llms.txt files')
}

async function generateRootLlmsTxt(): Promise<string> {
  // Implementation from route handler above
  // ...
}

async function generateContentLlmsTxt(contentType: string): Promise<string> {
  // Implementation similar to content-specific route handlers
  // ...
}

generateLlmsTxt().catch(console.error)
```

**Add to package.json:**

```json
{
  "scripts": {
    "generate-llms-txt": "tsx scripts/generate-llms-txt.ts",
    "build": "npm run generate-llms-txt && next build"
  }
}
```

---

## SSG/ISR Strategy with llms.txt

### Static Generation (SSG)
- Generate llms.txt files during build
- Stored in `public/` directory
- Fast delivery via CDN

### Incremental Static Regeneration (ISR)
- Regenerate on content updates
- Triggered by webhook (same as page revalidation)
- Keep llms.txt in sync with content

**Update webhook handler:**

```typescript
// In app/api/sync/github-webhook/route.ts
import { revalidatePath } from 'next/cache'

// After syncing content to ZeroDB
revalidatePath(`/${contentType}`)
revalidatePath('/search')
revalidatePath('/llms.txt') // Regenerate root llms.txt
revalidatePath(`/${contentType}/llms.txt`) // Regenerate content-specific
```

---

## Use Cases for llms.txt

### 1. LLM Context Building
When an LLM is asked about your content:
- Quickly scan llms.txt to understand site structure
- Find relevant content sections
- Get metadata without crawling entire site

### 2. Semantic Navigation
LLMs can help users find content:
```
User: "Find Karsten's poetry about nature"
LLM: [Reads /poetry/llms.txt]
     [Finds poems tagged with "nature"]
     [Returns relevant links]
```

### 3. Content Discovery
LLMs can recommend related content:
```
User reading essay → LLM reads llms.txt → Suggests related papers
```

### 4. Research Assistance
Researchers can ask LLMs to:
- Summarize your work across all content types
- Find connections between essays and papers
- Track evolution of ideas over time

---

## Benefits

### For LLMs
- ✅ Structured, machine-readable content index
- ✅ Metadata-rich (tags, word count, reading time)
- ✅ Clear attribution and licensing
- ✅ Efficient discovery (no need to crawl entire site)

### For Users
- ✅ Better LLM-assisted navigation
- ✅ More accurate content recommendations
- ✅ Enhanced semantic search
- ✅ Cross-content discovery

### For SEO
- ✅ Improved discoverability by AI systems
- ✅ Structured data for search engines
- ✅ Clear content organization
- ✅ Canonical URLs for proper attribution

---

## Testing

### Manual Testing

```bash
# Test root llms.txt
curl https://karstenwade.com/llms.txt

# Test content-specific llms.txt
curl https://karstenwade.com/poetry/llms.txt
curl https://karstenwade.com/fiction/llms.txt
```

### Automated Testing

**File:** `tests/llms-txt.test.ts`

```typescript
import { describe, it, expect } from 'vitest'

describe('llms.txt files', () => {
  it('should serve root llms.txt', async () => {
    const response = await fetch('http://localhost:3000/llms.txt')
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/plain')
    const text = await response.text()
    expect(text).toContain('# Karsten Wade')
    expect(text).toContain('## Site Structure')
  })

  it('should serve poetry llms.txt', async () => {
    const response = await fetch('http://localhost:3000/poetry/llms.txt')
    expect(response.status).toBe(200)
    const text = await response.text()
    expect(text).toContain('# Poetry - Karsten Wade')
    expect(text).toContain('## Content Index')
  })

  it('should include proper caching headers', async () => {
    const response = await fetch('http://localhost:3000/llms.txt')
    expect(response.headers.get('cache-control')).toContain('public')
  })
})
```

---

## Migration Story

**Story:** Add llms.txt support [2 points]

**Tasks:**
1. Create `app/llms.txt/route.ts` for root llms.txt
2. Create content-specific llms.txt route handlers
3. Integrate with ZeroDB to fetch content metadata
4. Add llms.txt regeneration to webhook handler
5. Update build script to generate static llms.txt files
6. Add tests for llms.txt endpoints
7. Document llms.txt usage in README

**Acceptance Criteria:**
- [ ] Root llms.txt accessible at `/llms.txt`
- [ ] Content-specific llms.txt files for all content types
- [ ] Automatic regeneration on content updates
- [ ] Proper caching headers
- [ ] All tests passing

---

## Future Enhancements

### Phase 2+
- **RSS-style subscriptions**: LLMs can subscribe to content updates
- **Topic hierarchies**: Nested llms.txt for complex topic structures
- **Multi-language support**: llms-en.txt, llms-es.txt, etc.
- **Version history**: Track content evolution over time
- **Embeddings metadata**: Include embedding model info for better search

---

**Next Steps**: Implement llms.txt generation during Next.js migration Phase 3.
