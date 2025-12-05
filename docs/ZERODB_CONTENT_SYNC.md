# ZeroDB Content Synchronization Architecture

**Version:** 1.1
**Created:** 2025-12-01
**Updated:** 2025-12-01
**Purpose:** Content aggregation and semantic search using ZeroDB
**Features:** Custom embedding models, llms.txt support, external repo syncing

---

## Executive Summary

karstenwade.com will function as both a **content source** and **content aggregator**, using ZeroDB as the unified database for:
- **Structured Storage**: Mirrored content from multiple GitHub repositories
- **Vector Search**: Semantic search across all aggregated content
- **Content Discovery**: Unified search experience across poems, essays, papers, fiction

**Architecture Pattern**: Multi-repo content sources → GitHub webhooks → Next.js API routes → ZeroDB (structured + vector storage) → Next.js pages (SSG + on-demand revalidation)

**Zero-Cost Implementation**: All components run on free tiers (GitHub, Vercel, ZeroDB free tier)

**Related Documentation**:
- [LLMS_TXT.md](./LLMS_TXT.md) - LLM discoverability and llms.txt implementation
- [NEXTJS_MIGRATION_PLAN.md](./NEXTJS_MIGRATION_PLAN.md) - Next.js migration strategy
- [FREE_TIER_CONSTRAINTS.md](./FREE_TIER_CONSTRAINTS.md) - Cost analysis and free tier limits

---

## Content Source Strategy

### Repository Structure

```
┌─────────────────────────────────────────────────┐
│  CONTENT SOURCES (GitHub Repos)                 │
├─────────────────────────────────────────────────┤
│  OWNED:                                         │
│  - github.com/karstenwade/poetry                │
│  - github.com/karstenwade/fiction               │
│  - github.com/karstenwade/essays                │
│  - github.com/karstenwade/papers (exists)       │
│                                                 │
│  EXTERNAL (synced directly, no mirror):         │
│  - github.com/theopensourceway/guidebook        │
└─────────────────────────────────────────────────┘
                      ↓ (git push triggers webhook)
┌─────────────────────────────────────────────────┐
│  AGGREGATION LAYER (karstenwade.com)            │
├─────────────────────────────────────────────────┤
│  Next.js API Routes (/api/sync/*)               │
│    - Validate webhook signature                 │
│    - Parse content (markdown + frontmatter)     │
│    - Generate embeddings                        │
│    - Store in ZeroDB                            │
└─────────────────────────────────────────────────┘
                      ↓ (store dual format)
┌─────────────────────────────────────────────────┐
│  ZERODB (Unified Database)                      │
├─────────────────────────────────────────────────┤
│  Structured Storage (tables):                   │
│    - content_items table                        │
│    - metadata, source_repo, content_type        │
│  Vector Storage:                                │
│    - Embeddings for semantic search             │
│    - Hybrid search (vector + metadata filter)   │
└─────────────────────────────────────────────────┘
                      ↓ (query at runtime)
┌─────────────────────────────────────────────────┐
│  PRESENTATION LAYER (Next.js Pages)             │
├─────────────────────────────────────────────────┤
│  /poetry, /fiction, /essays, /papers            │
│  /search (semantic search UI)                   │
│  SSG + on-demand revalidation                   │
└─────────────────────────────────────────────────┘
```

### Content Repository Standards

Each content repository follows a consistent structure:

```
karstenwade/poetry/
├── README.md
├── poems/
│   ├── 2024-01-15-winter-solstice.md
│   ├── 2024-03-22-spring-awakening.md
│   └── ...
├── .github/
│   └── workflows/
│       └── sync-to-website.yml
└── package.json (optional, for local tooling)
```

**Content File Format** (markdown with frontmatter):

```markdown
---
title: "Winter Solstice"
date: 2024-01-15
type: poetry
tags: [nature, seasons, reflection]
slug: winter-solstice
published: true
source_repo: karstenwade/poetry
canonical_url: https://karstenwade.com/poetry/winter-solstice
---

# Winter Solstice

The longest night arrives
with silent certainty...
```

### Content Types

| Type | Repository | Content Pattern | Example URL |
|------|-----------|-----------------|-------------|
| **Poetry** | karstenwade/poetry | `poems/*.md` | `/poetry/winter-solstice` |
| **Fiction** | karstenwade/fiction | `stories/*.md` | `/fiction/the-last-commit` |
| **Essays** | karstenwade/essays | `essays/*.md` | `/essays/open-source-governance` |
| **Papers** | karstenwade/papers | `papers/*.md` | `/papers/community-metrics` |
| **Open Source Way** | theopensourceway/guidebook | `**/*.md` (all folders) | `/opensource-way/attracting-users/communication` |

---

## ZeroDB Schema Design

### Structured Storage (Tables API)

**Table: `content_items`**

```json
{
  "table_name": "content_items",
  "schema": {
    "id": "string (primary key, slug-based)",
    "title": "string",
    "content_type": "string (poetry|fiction|essay|paper|opensource-way)",
    "source_repo": "string (github.com/karstenwade/poetry)",
    "slug": "string (URL-friendly identifier)",
    "markdown_content": "text (full markdown)",
    "excerpt": "string (first 200 chars)",
    "published_date": "datetime",
    "updated_date": "datetime",
    "tags": "array<string>",
    "canonical_url": "string",
    "frontmatter": "json (all metadata)",
    "word_count": "integer",
    "reading_time_minutes": "integer",
    "published": "boolean"
  }
}
```

**Create Table via API**:

```bash
curl -X POST https://api.ainative.studio/zerodb/v1/projects/{project_id}/tables \
  -H "X-API-Key: ${ZERODB_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "content_items",
    "schema": {
      "id": {"type": "string", "primary_key": true},
      "title": {"type": "string", "required": true},
      "content_type": {"type": "string", "required": true},
      "source_repo": {"type": "string"},
      "slug": {"type": "string", "unique": true},
      "markdown_content": {"type": "text"},
      "excerpt": {"type": "string"},
      "published_date": {"type": "datetime"},
      "updated_date": {"type": "datetime"},
      "tags": {"type": "array", "items": {"type": "string"}},
      "canonical_url": {"type": "string"},
      "frontmatter": {"type": "json"},
      "word_count": {"type": "integer"},
      "reading_time_minutes": {"type": "integer"},
      "published": {"type": "boolean", "default": true}
    }
  }'
```

### Vector Storage (Vectors API)

**Vector Store: `content_embeddings`**

Each content item gets a corresponding vector embedding for semantic search.

```json
{
  "id": "poetry-winter-solstice",
  "values": [0.123, -0.456, 0.789, ...],  // 1536-dim embedding (OpenAI ada-002)
  "metadata": {
    "content_type": "poetry",
    "title": "Winter Solstice",
    "slug": "winter-solstice",
    "published_date": "2024-01-15T00:00:00Z",
    "tags": ["nature", "seasons", "reflection"],
    "source_repo": "karstenwade/poetry",
    "word_count": 85
  }
}
```

**Upsert Vectors**:

```bash
curl -X POST https://api.ainative.studio/zerodb/v1/projects/{project_id}/vectors/upsert \
  -H "X-API-Key: ${ZERODB_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "vectors": [
      {
        "id": "poetry-winter-solstice",
        "values": [...],
        "metadata": {...}
      }
    ]
  }'
```

---

## Synchronization Mechanism

### Option 1: GitHub Webhooks (Recommended)

**Advantages**:
- Real-time sync on git push
- Zero infrastructure (webhook → Vercel API route)
- Vercel free tier includes API routes

**Implementation**:

#### 1. GitHub Webhook Configuration

Configure webhook on each content repository:

**Settings → Webhooks → Add webhook**

```
Payload URL: https://karstenwade.com/api/sync/github-webhook
Content type: application/json
Secret: <generate-secret-token>
Events: Just the push event
```

#### 2. Next.js API Route

**File: `app/api/sync/github-webhook/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { syncContentToZeroDB } from '@/lib/zerodb-sync'
import { revalidatePath } from 'next/cache'

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET!

// Verify GitHub webhook signature
function verifySignature(payload: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET)
  const digest = 'sha256=' + hmac.update(payload).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-hub-signature-256')
  const payload = await request.text()

  // Verify webhook signature
  if (!signature || !verifySignature(payload, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(payload)

  // Only process push events
  if (event.ref !== 'refs/heads/main') {
    return NextResponse.json({ message: 'Ignored non-main branch' }, { status: 200 })
  }

  try {
    // Extract changed files from commits
    const changedFiles = event.commits.flatMap((commit: any) => [
      ...commit.added,
      ...commit.modified,
    ]).filter((file: string) => file.endsWith('.md'))

    // Process each changed markdown file
    for (const file of changedFiles) {
      const repoName = event.repository.full_name // e.g., "karstenwade/poetry"
      const branch = event.ref.split('/').pop() // "main"

      // Fetch file content from GitHub
      const fileUrl = `https://raw.githubusercontent.com/${repoName}/${branch}/${file}`
      const response = await fetch(fileUrl)
      const content = await response.text()

      // Sync to ZeroDB
      await syncContentToZeroDB({
        content,
        file_path: file,
        source_repo: repoName,
        commit_sha: event.after,
      })
    }

    // Trigger revalidation of affected pages
    const contentType = event.repository.name // "poetry", "fiction", etc.
    revalidatePath(`/${contentType}`)
    revalidatePath('/search')

    return NextResponse.json({
      success: true,
      synced: changedFiles.length,
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: 'Sync failed', details: error.message },
      { status: 500 }
    )
  }
}
```

#### 3. ZeroDB Sync Library

**File: `lib/zerodb-sync.ts`**

```typescript
import matter from 'gray-matter'
import { generateEmbedding } from './embeddings'

const ZERODB_API_KEY = process.env.ZERODB_API_KEY!
const ZERODB_PROJECT_ID = process.env.ZERODB_PROJECT_ID!
const ZERODB_BASE_URL = 'https://api.ainative.studio/zerodb/v1'

interface SyncParams {
  content: string
  file_path: string
  source_repo: string
  commit_sha: string
}

export async function syncContentToZeroDB(params: SyncParams) {
  const { content, file_path, source_repo, commit_sha } = params

  // Parse markdown frontmatter
  const { data: frontmatter, content: markdown } = matter(content)

  // Extract metadata
  const slug = frontmatter.slug || file_path.replace(/\.md$/, '').split('/').pop()
  const contentType = source_repo.split('/')[1] // "poetry", "fiction", etc.
  const title = frontmatter.title || slug
  const excerpt = markdown.slice(0, 200).trim()
  const wordCount = markdown.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200) // 200 words/min

  const contentItem = {
    id: `${contentType}-${slug}`,
    title,
    content_type: contentType,
    source_repo,
    slug,
    markdown_content: markdown,
    excerpt,
    published_date: frontmatter.date || new Date().toISOString(),
    updated_date: new Date().toISOString(),
    tags: frontmatter.tags || [],
    canonical_url: `https://karstenwade.com/${contentType}/${slug}`,
    frontmatter,
    word_count: wordCount,
    reading_time_minutes: readingTime,
    published: frontmatter.published !== false,
  }

  // 1. Store in structured storage (Table API)
  await fetch(
    `${ZERODB_BASE_URL}/projects/${ZERODB_PROJECT_ID}/tables/content_items/rows`,
    {
      method: 'POST',
      headers: {
        'X-API-Key': ZERODB_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contentItem),
    }
  )

  // 2. Generate embedding and store in vector storage
  const embedding = await generateEmbedding(
    `${title}\n\n${frontmatter.tags?.join(', ')}\n\n${markdown}`
  )

  await fetch(
    `${ZERODB_BASE_URL}/projects/${ZERODB_PROJECT_ID}/vectors/upsert`,
    {
      method: 'POST',
      headers: {
        'X-API-Key': ZERODB_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vectors: [
          {
            id: contentItem.id,
            values: embedding,
            metadata: {
              content_type: contentType,
              title,
              slug,
              published_date: contentItem.published_date,
              tags: contentItem.tags,
              source_repo,
              word_count: wordCount,
            },
          },
        ],
      }),
    }
  )

  console.log(`✅ Synced ${contentType}/${slug} to ZeroDB`)
}
```

#### 4. Embedding Generation (Configurable for Future Custom Models)

**File: `lib/embeddings.ts`**

```typescript
// Configurable embedding generation to support:
// - Current: OpenAI, HuggingFace, or other providers
// - Future: ZeroDB custom models per content type

export type EmbeddingProvider = 'openai' | 'huggingface' | 'zerodb-custom'

export interface EmbeddingConfig {
  provider: EmbeddingProvider
  model?: string
  dimensions?: number
  customModelId?: string // For future ZeroDB custom models
}

// Default configs per content type (future: customizable)
const EMBEDDING_CONFIGS: Record<string, EmbeddingConfig> = {
  poetry: {
    provider: 'huggingface',
    model: 'sentence-transformers/all-MiniLM-L6-v2',
    dimensions: 384,
  },
  fiction: {
    provider: 'huggingface',
    model: 'sentence-transformers/all-MiniLM-L6-v2',
    dimensions: 384,
  },
  essays: {
    provider: 'huggingface',
    model: 'sentence-transformers/all-MiniLM-L6-v2',
    dimensions: 384,
  },
  papers: {
    provider: 'huggingface',
    model: 'sentence-transformers/all-MiniLM-L6-v2',
    dimensions: 384,
  },
  'opensource-way': {
    provider: 'huggingface',
    model: 'sentence-transformers/all-MiniLM-L6-v2',
    dimensions: 384,
  },
}

export async function generateEmbedding(
  text: string,
  contentType: string = 'default'
): Promise<number[]> {
  const config = EMBEDDING_CONFIGS[contentType] || EMBEDDING_CONFIGS.poetry

  switch (config.provider) {
    case 'openai':
      return generateOpenAIEmbedding(text, config)
    case 'huggingface':
      return generateHuggingFaceEmbedding(text, config)
    case 'zerodb-custom':
      return generateZeroDBCustomEmbedding(text, config)
    default:
      throw new Error(`Unknown embedding provider: ${config.provider}`)
  }
}

async function generateOpenAIEmbedding(
  text: string,
  config: EmbeddingConfig
): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model || 'text-embedding-ada-002',
      input: text.slice(0, 8000), // Token limit
    }),
  })

  const data = await response.json()
  return data.data[0].embedding
}

async function generateHuggingFaceEmbedding(
  text: string,
  config: EmbeddingConfig
): Promise<number[]> {
  const response = await fetch(
    `https://api-inference.huggingface.co/models/${config.model}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: text.slice(0, 5000) }),
    }
  )

  return await response.json()
}

// Future implementation when ZeroDB offers custom models
async function generateZeroDBCustomEmbedding(
  text: string,
  config: EmbeddingConfig
): Promise<number[]> {
  // Placeholder for future ZeroDB custom model API
  const response = await fetch(
    `https://api.ainative.studio/zerodb/v1/embeddings/custom/${config.customModelId}`,
    {
      method: 'POST',
      headers: {
        'X-API-Key': process.env.ZERODB_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: config.customModelId,
      }),
    }
  )

  const data = await response.json()
  return data.embedding
}

// Helper to update embedding config (for when ZeroDB releases custom models)
export function updateEmbeddingConfig(
  contentType: string,
  config: Partial<EmbeddingConfig>
) {
  EMBEDDING_CONFIGS[contentType] = {
    ...EMBEDDING_CONFIGS[contentType],
    ...config,
  }
}
```

---

## Next.js Integration

### Querying ZeroDB from Pages

**Example: Poetry List Page**

**File: `app/poetry/page.tsx`**

```typescript
import { Metadata } from 'next'
import { fetchContentFromZeroDB } from '@/lib/zerodb-client'
import { ContentCard } from '@/components/ContentCard'

export const metadata: Metadata = {
  title: 'Poetry - Karsten Wade',
  description: 'Poems by Karsten Wade',
}

export const revalidate = 3600 // Revalidate every hour (or use on-demand)

export default async function PoetryPage() {
  // Fetch all published poetry from ZeroDB
  const poems = await fetchContentFromZeroDB({
    content_type: 'poetry',
    published: true,
    order_by: 'published_date',
    order: 'desc',
  })

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Poetry</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {poems.map((poem) => (
          <ContentCard
            key={poem.id}
            title={poem.title}
            excerpt={poem.excerpt}
            date={poem.published_date}
            tags={poem.tags}
            href={`/poetry/${poem.slug}`}
            readingTime={poem.reading_time_minutes}
          />
        ))}
      </div>
    </main>
  )
}
```

**File: `lib/zerodb-client.ts`**

```typescript
const ZERODB_API_KEY = process.env.ZERODB_API_KEY!
const ZERODB_PROJECT_ID = process.env.ZERODB_PROJECT_ID!
const ZERODB_BASE_URL = 'https://api.ainative.studio/zerodb/v1'

interface QueryParams {
  content_type?: string
  published?: boolean
  order_by?: string
  order?: 'asc' | 'desc'
  limit?: number
}

export async function fetchContentFromZeroDB(params: QueryParams) {
  const { content_type, published, order_by, order, limit } = params

  // Build query
  const queryParams = new URLSearchParams()
  if (content_type) queryParams.set('content_type', content_type)
  if (published !== undefined) queryParams.set('published', String(published))
  if (order_by) queryParams.set('order_by', order_by)
  if (order) queryParams.set('order', order)
  if (limit) queryParams.set('limit', String(limit))

  const response = await fetch(
    `${ZERODB_BASE_URL}/projects/${ZERODB_PROJECT_ID}/tables/content_items/rows?${queryParams}`,
    {
      headers: {
        'X-API-Key': ZERODB_API_KEY,
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    }
  )

  if (!response.ok) {
    throw new Error(`ZeroDB query failed: ${response.statusText}`)
  }

  return response.json()
}

export async function fetchContentBySlug(contentType: string, slug: string) {
  const response = await fetch(
    `${ZERODB_BASE_URL}/projects/${ZERODB_PROJECT_ID}/tables/content_items/rows/${contentType}-${slug}`,
    {
      headers: {
        'X-API-Key': ZERODB_API_KEY,
      },
      next: { revalidate: 3600 },
    }
  )

  if (!response.ok) {
    return null
  }

  return response.json()
}
```

### Semantic Search Implementation

**File: `app/search/page.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { SearchInput } from '@/components/SearchInput'
import { SearchResults } from '@/components/SearchResults'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (searchQuery: string) => {
    setLoading(true)
    setQuery(searchQuery)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      })

      const data = await response.json()
      setResults(data.results)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Search</h1>

      <SearchInput onSearch={handleSearch} loading={loading} />

      {results.length > 0 && (
        <SearchResults results={results} query={query} />
      )}
    </main>
  )
}
```

**File: `app/api/search/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { generateEmbedding } from '@/lib/embeddings'

const ZERODB_API_KEY = process.env.ZERODB_API_KEY!
const ZERODB_PROJECT_ID = process.env.ZERODB_PROJECT_ID!
const ZERODB_BASE_URL = 'https://api.ainative.studio/zerodb/v1'

export async function POST(request: NextRequest) {
  const { query, filters } = await request.json()

  try {
    // Generate embedding for search query
    const queryEmbedding = await generateEmbedding(query)

    // Perform hybrid search in ZeroDB
    const response = await fetch(
      `${ZERODB_BASE_URL}/projects/${ZERODB_PROJECT_ID}/vectors/search`,
      {
        method: 'POST',
        headers: {
          'X-API-Key': ZERODB_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vector: queryEmbedding,
          top_k: 20,
          hybrid: true, // Enable hybrid search (vector + metadata)
          filter: filters, // e.g., { content_type: "poetry" }
        }),
      }
    )

    const searchResults = await response.json()

    // Fetch full content for top results
    const contentIds = searchResults.matches.map((m: any) => m.id)
    const fullContent = await Promise.all(
      contentIds.map((id: string) =>
        fetch(
          `${ZERODB_BASE_URL}/projects/${ZERODB_PROJECT_ID}/tables/content_items/rows/${id}`,
          {
            headers: { 'X-API-Key': ZERODB_API_KEY },
          }
        ).then((r) => r.json())
      )
    )

    return NextResponse.json({
      results: fullContent,
      total: searchResults.matches.length,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed', details: error.message },
      { status: 500 }
    )
  }
}
```

---

## External Repository Syncing Strategy

### Overview

For content owned by external organizations (e.g., The Open Source Way), we **sync directly from the source repository** without creating mirrors in the `karstenwade/` GitHub namespace.

**Benefits:**
- ✅ No duplicate repositories to maintain
- ✅ Always sync from canonical source
- ✅ Proper attribution to original authors
- ✅ Simpler maintenance (no fork syncing)

### Syncing The Open Source Way Guidebook

**Source:** `https://github.com/theopensourceway/guidebook`
**Content:** Markdown files in topic folders (attracting-users, getting-started, etc.)
**License:** Creative Commons Attribution-ShareAlike 4.0

#### Sync Mechanism Options

**Option 1: Scheduled GitHub Action (Recommended)**

Create a GitHub Action in karstenwade.com that periodically fetches content from external repos.

**File:** `.github/workflows/sync-external-content.yml`

```yaml
name: Sync External Content

on:
  schedule:
    # Run daily at 2 AM UTC
    - cron: '0 2 * * *'
  workflow_dispatch: # Allow manual triggers

jobs:
  sync-opensource-way:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout karstenwade.com
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Clone theopensourceway/guidebook
        run: |
          git clone https://github.com/theopensourceway/guidebook.git /tmp/guidebook
          cd /tmp/guidebook
          echo "COMMIT_SHA=$(git rev-parse HEAD)" >> $GITHUB_ENV

      - name: Sync content to ZeroDB
        env:
          ZERODB_API_KEY: ${{ secrets.ZERODB_API_KEY }}
          ZERODB_PROJECT_ID: ${{ secrets.ZERODB_PROJECT_ID }}
        run: |
          npm run sync-external -- \
            --repo theopensourceway/guidebook \
            --source /tmp/guidebook \
            --type opensource-way \
            --commit ${{ env.COMMIT_SHA }}

      - name: Trigger site revalidation
        env:
          VERCEL_DEPLOY_HOOK: ${{ secrets.VERCEL_DEPLOY_HOOK }}
        run: |
          curl -X POST $VERCEL_DEPLOY_HOOK
```

**Sync Script:** `scripts/sync-external.ts`

```typescript
import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import matter from 'gray-matter'
import { syncContentToZeroDB } from '../lib/zerodb-sync'

interface SyncOptions {
  repo: string
  source: string
  type: string
  commit: string
}

async function syncExternalRepo(options: SyncOptions) {
  const { repo, source, type, commit } = options

  console.log(`Syncing ${repo} (commit: ${commit})...`)

  // Find all markdown files in source directory
  const markdownFiles = await glob(`${source}/**/*.md`, {
    ignore: ['**/node_modules/**', '**/README.md', '**/CONTRIBUTING.md'],
  })

  console.log(`Found ${markdownFiles.length} markdown files`)

  let synced = 0
  let errors = 0

  for (const filePath of markdownFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const relativePath = path.relative(source, filePath)

      // Extract topic from path (e.g., "attracting-users/communication.md")
      const pathParts = relativePath.split(path.sep)
      const topic = pathParts[0]
      const fileName = pathParts[pathParts.length - 1]

      await syncContentToZeroDB({
        content,
        file_path: relativePath,
        source_repo: repo,
        commit_sha: commit,
        metadata: {
          topic,
          external_source: true,
          original_url: `https://guidebook.theopensourceway.org/${relativePath.replace('.md', '')}`,
        },
      })

      synced++
      console.log(`✅ Synced: ${relativePath}`)
    } catch (error) {
      errors++
      console.error(`❌ Error syncing ${filePath}:`, error)
    }
  }

  console.log(`\nSync complete: ${synced} synced, ${errors} errors`)
}

// CLI usage
const args = process.argv.slice(2)
const options: SyncOptions = {
  repo: args[args.indexOf('--repo') + 1],
  source: args[args.indexOf('--source') + 1],
  type: args[args.indexOf('--type') + 1],
  commit: args[args.indexOf('--commit') + 1],
}

syncExternalRepo(options).catch(console.error)
```

**Add to package.json:**

```json
{
  "scripts": {
    "sync-external": "tsx scripts/sync-external.ts"
  }
}
```

#### Option 2: Manual Sync API Endpoint

Create an API endpoint to manually trigger external syncs.

**File:** `app/api/sync/external/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { execSync } from 'child_process'

const SYNC_SECRET = process.env.EXTERNAL_SYNC_SECRET!

export async function POST(request: NextRequest) {
  const { secret, repo } = await request.json()

  // Verify secret
  if (secret !== SYNC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Only allow whitelisted repos
  const allowedRepos = ['theopensourceway/guidebook']
  if (!allowedRepos.includes(repo)) {
    return NextResponse.json({ error: 'Repo not allowed' }, { status: 403 })
  }

  try {
    // Clone repo to temp directory
    const tmpDir = `/tmp/${repo.replace('/', '-')}-${Date.now()}`
    execSync(`git clone https://github.com/${repo}.git ${tmpDir}`)

    const commitSha = execSync(`cd ${tmpDir} && git rev-parse HEAD`)
      .toString()
      .trim()

    // Run sync script
    execSync(
      `npm run sync-external -- --repo ${repo} --source ${tmpDir} --type opensource-way --commit ${commitSha}`,
      { stdio: 'inherit' }
    )

    // Cleanup
    execSync(`rm -rf ${tmpDir}`)

    return NextResponse.json({
      success: true,
      repo,
      commit: commitSha,
    })
  } catch (error) {
    console.error('External sync error:', error)
    return NextResponse.json(
      { error: 'Sync failed', details: error.message },
      { status: 500 }
    )
  }
}
```

**Manual trigger:**

```bash
curl -X POST https://karstenwade.com/api/sync/external \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "your-secret",
    "repo": "theopensourceway/guidebook"
  }'
```

### Handling Different Content Structures

Different external repos may have different structures. The sync script should be flexible:

**Example: The Open Source Way Structure**

```
guidebook/
├── attracting-users/
│   ├── communication.md
│   ├── outreach.md
│   └── ...
├── getting-started/
│   ├── creating.md
│   └── ...
└── SUMMARY.md
```

**Mapping to ZeroDB:**

```typescript
// In sync script
const { data: frontmatter, content: markdown } = matter(fileContent)

const contentItem = {
  id: `opensource-way-${slug}`,
  title: frontmatter.title || extractTitleFromMarkdown(markdown),
  content_type: 'opensource-way',
  source_repo: 'theopensourceway/guidebook',
  slug: `${topic}/${fileName}`,
  markdown_content: markdown,
  frontmatter: {
    ...frontmatter,
    topic, // e.g., "attracting-users"
    external_source: true,
    original_url: `https://guidebook.theopensourceway.org/${topic}/${fileName}`,
    license: 'CC-BY-SA-4.0',
    original_authors: 'The Open Source Way Contributors',
  },
  // ... rest of fields
}
```

### Attribution and Licensing

Always include proper attribution for external content:

**In ZeroDB metadata:**
```json
{
  "external_source": true,
  "source_repo": "theopensourceway/guidebook",
  "original_url": "https://guidebook.theopensourceway.org/...",
  "license": "CC-BY-SA-4.0",
  "original_authors": "The Open Source Way Contributors",
  "contributors_url": "https://github.com/theopensourceway/guidebook/blob/main/CONTRIBUTORS.md"
}
```

**On rendered pages:**
```tsx
// app/opensource-way/[...slug]/page.tsx
{content.frontmatter.external_source && (
  <aside className="attribution">
    <p>
      This content is from{' '}
      <a href={content.frontmatter.original_url}>The Open Source Way</a>,
      licensed under{' '}
      <a href="https://creativecommons.org/licenses/by-sa/4.0/">
        CC-BY-SA-4.0
      </a>.
    </p>
    <p>
      Original authors:{' '}
      <a href={content.frontmatter.contributors_url}>
        The Open Source Way Contributors
      </a>
    </p>
  </aside>
)}
```

### Sync Frequency and Strategy

**Recommended Approach:**

1. **Daily scheduled sync** (GitHub Action at 2 AM)
   - Low traffic time
   - Catches updates within 24 hours
   - Minimal cost (GitHub Actions free tier: 2,000 min/month)

2. **Manual sync option** (API endpoint)
   - For immediate updates when needed
   - Useful during testing/debugging

3. **Smart diffing** (future enhancement)
   - Only sync changed files
   - Track last sync commit SHA
   - Compare with current HEAD
   - Only process diffs

**Future: Webhook from External Repos**

If we gain collaborator access to external repos, we could add webhooks:

```yaml
# Would need to be added to theopensourceway/guidebook
# (requires collaborator access)

# .github/workflows/notify-karstenwade.yml
name: Notify karstenwade.com

on:
  push:
    branches: [main]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger sync
        run: |
          curl -X POST https://karstenwade.com/api/sync/external \
            -H "Content-Type: application/json" \
            -d '{
              "secret": "${{ secrets.KARSTENWADE_SYNC_SECRET }}",
              "repo": "theopensourceway/guidebook"
            }'
```

**Note:** This requires coordination with external repo maintainers and may not be feasible for all sources.

---

## Migration Path

### Phase 1: Setup Infrastructure (Week 1)

**Stories:**

1. **Create ZeroDB Project** [1 point]
   - Sign up for ZeroDB account
   - Create project for karstenwade.com
   - Save API key and project ID to environment variables

2. **Initialize Content Repositories** [2 points]
   - Create `karstenwade/poetry` repository
   - Create `karstenwade/fiction` repository
   - Create `karstenwade/essays` repository
   - Add README and basic structure to each

3. **Create ZeroDB Table Schema** [2 points]
   - Use ZeroDB API to create `content_items` table
   - Test insert/query operations
   - Document schema in this file

4. **Set Up Webhook Endpoint** [3 points]
   - Create `/api/sync/github-webhook` route
   - Implement signature verification
   - Add logging and error handling
   - Test with mock payload

### Phase 2: Content Sync Implementation (Week 1-2)

5. **Implement ZeroDB Sync Library** [3 points]
   - Create `lib/zerodb-sync.ts`
   - Implement markdown parsing with gray-matter
   - Implement dual storage (table + vectors)
   - Add error handling and retry logic

6. **Implement Embedding Generation** [2 points]
   - Create `lib/embeddings.ts`
   - Choose embedding model (OpenAI or HuggingFace)
   - Test embedding generation
   - Handle rate limits and errors

7. **Configure GitHub Webhooks** [1 point]
   - Add webhook to each content repository
   - Generate and store webhook secrets
   - Test webhook delivery

8. **Initial Content Migration** [3 points]
   - Migrate existing .ts content to markdown files
   - Organize into appropriate repositories
   - Trigger initial sync to ZeroDB
   - Verify data in ZeroDB

### Phase 3: Next.js Integration (Week 2)

9. **Create ZeroDB Client Library** [2 points]
   - Create `lib/zerodb-client.ts`
   - Implement query functions
   - Add caching strategy
   - Error handling

10. **Migrate Content List Pages** [2 points]
    - Convert `/poetry` to fetch from ZeroDB
    - Convert `/fiction` to fetch from ZeroDB
    - Convert `/essays` to fetch from ZeroDB
    - Test SSG generation

11. **Migrate Content Detail Pages** [3 points]
    - Create dynamic routes `[slug]/page.tsx`
    - Implement `generateStaticParams` for SSG
    - Fetch individual content from ZeroDB
    - Add markdown rendering

12. **Implement Search Page** [3 points]
    - Create `/search` page
    - Create `/api/search` route
    - Implement vector search
    - Build search UI components

### Phase 4: External Content Mirroring (Week 3)

13. **Mirror The Open Source Way** [3 points]
    - Create sync script for theopensourceway.org
    - Map content structure to ZeroDB schema
    - Schedule periodic sync (GitHub Actions cron)
    - Create pages for mirrored content

14. **Test and Validate** [2 points]
    - Test all content types rendering
    - Test search functionality
    - Verify webhook triggers
    - Performance testing

15. **Documentation and Handoff** [1 point]
    - Update README with ZeroDB setup
    - Document content repository standards
    - Create troubleshooting guide

---

## Cost Analysis

### ZeroDB Free Tier Limits

```
✅ 1 project
✅ 500,000 vectors (plenty for personal content)
✅ 1 GB object storage
✅ 1 GB table storage
✅ Unlimited API requests
```

**Estimated Usage**:
- Content items: ~500-1,000 pieces of content
- Vectors: 1 per content item (~1,000 vectors)
- Storage: <100 MB for text content
- **Risk**: LOW - well within limits

### Vercel Free Tier Impact

**Additional Usage**:
- API routes for webhooks: minimal execution time
- On-demand revalidation: triggered by webhooks (controlled)
- No impact on bandwidth (API routes are lightweight)

**Estimated Additional Cost**: $0

### Embedding Generation Cost

**Option 1: OpenAI API** (text-embedding-ada-002)
- Cost: $0.0001 per 1K tokens
- Estimated: ~$0.10-0.20 per month (for new content only)
- **Not free**, but very cheap

**Option 2: Hugging Face Inference API** (FREE)
- Free tier: 30,000 requests/month
- **Recommended for zero-cost constraint**

---

## Monitoring & Maintenance

### Health Checks

**Weekly Checks**:
- [ ] ZeroDB vector count (stay under 500k)
- [ ] ZeroDB storage usage (stay under 1 GB)
- [ ] Webhook delivery success rate
- [ ] Search query latency

**Monthly Reviews**:
- [ ] Content sync accuracy
- [ ] Broken links in mirrored content
- [ ] Embedding quality (search relevance)

### Troubleshooting

**Issue: Webhook not triggering sync**
```bash
# Check webhook delivery in GitHub repo settings
# Verify webhook secret matches environment variable
# Check Vercel function logs
```

**Issue: Search results not relevant**
```bash
# Test embedding generation
# Verify vector metadata
# Adjust search parameters (top_k, hybrid settings)
```

**Issue: Content not appearing on site**
```bash
# Check ZeroDB table for content item
# Verify published: true in frontmatter
# Trigger manual revalidation
```

---

## Benefits of This Architecture

### ✅ Content Ownership
- Content lives in Git (version control, portability)
- No vendor lock-in (can migrate from ZeroDB if needed)
- Markdown format (universal, future-proof)

### ✅ Unified Search
- Single search interface across all content types
- Semantic search (not just keyword matching)
- Cross-content discovery

### ✅ Scalability
- Add new content types by creating new repositories
- Mirror external sources without changing architecture
- ZeroDB handles scaling automatically

### ✅ Developer Experience
- Write content in familiar markdown
- Git workflow for publishing
- Automatic sync and deployment

### ✅ Zero Cost
- All components on free tiers
- No CMS hosting costs
- No database hosting costs

---

## Future Enhancements

### Phase 5+ (Future)

- **Content Recommendations**: Use vector similarity for "related content"
- **Full-Text Search**: Add keyword search alongside semantic search
- **Content Analytics**: Track popular content, search queries
- **RSS Feeds**: Generate feeds from ZeroDB content
- **Email Notifications**: Alert on new content in followed topics
- **Admin UI**: Web interface for managing content (optional)
- **Multi-language Support**: Translate content, store multiple versions
- **Content Versioning**: Track content history in ZeroDB

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-12-01 | Use ZeroDB for unified storage | Simplifies architecture, enables semantic search |
| 2025-12-01 | Multi-repo content strategy | Clear separation, independent versioning |
| 2025-12-01 | GitHub webhooks for sync | Real-time, zero infrastructure cost |
| 2025-12-01 | SSG + on-demand revalidation | Minimize Vercel builds, fast page loads |
| 2025-12-01 | Markdown with frontmatter | Standard format, portable, Git-friendly |
| 2025-12-01 | Configurable embedding models per content type | Prepare for ZeroDB custom models, optimize per content type |
| 2025-12-01 | llms.txt files for LLM discoverability | Structured content index for better LLM integration |
| 2025-12-01 | Sync external repos directly (no mirrors) | Simpler maintenance, canonical source, proper attribution |
| 2025-12-01 | Daily scheduled sync for external content | Balance freshness with cost (GitHub Actions free tier) |

---

**Next Steps**: Review this architecture and begin Phase 1 implementation.
