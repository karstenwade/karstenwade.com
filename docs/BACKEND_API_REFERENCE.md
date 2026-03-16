# Backend API Reference

**Audience:** Frontend developers working in a separate repository who need to consume data from karstenwade.com's data layer.

**Last Updated:** 2026-03-16

---

## Table of Contents

1. [Overview](#overview)
2. [Environment Variables](#environment-variables)
3. [Data Sources](#data-sources)
   - [Static Data Files](#static-data-files)
   - [ZeroDB API](#zerodb-api)
   - [GitHub API](#github-api)
4. [Service Layer](#service-layer)
   - [StrapiClient](#strapiclient-libstrapits)
   - [ZeroDB Client](#zerodb-client-libzerodb-clientts)
   - [Content Service](#content-service-libservicescontentservicets)
   - [Paper Service](#paper-service-libservicespaperservicets)
   - [GitHub API Wrapper](#github-api-wrapper-libservicesgithubapts)
5. [External API Endpoints](#external-api-endpoints)
6. [TypeScript Interfaces](#typescript-interfaces)
7. [Data Flow](#data-flow)
8. [Architecture Notes](#architecture-notes)

---

## Overview

karstenwade.com is a Next.js static export site. All data is fetched at **build time**, not at runtime. The frontend consumes data from three distinct sources:

| Source | What It Provides | Access Pattern |
|--------|-----------------|----------------|
| Static TypeScript files (`data/*.ts`) | CV, essays, poetry, fiction, papers, theories, featured content | Direct import |
| ZeroDB (synced from Strapi CMS) | Blog posts, tutorials, events, papers, writings, TOSW chapters | REST API via `strapiClient` |
| GitHub API (`karstenwade/papers` repo) | Academic papers with YAML frontmatter + markdown content | REST API via `paperService` |

> **Key constraint:** Because this is a static export, all API calls happen during the build. There is no server-side rendering or client-side data fetching for primary content. The exception is ZeroDB semantic search, which is optional and degrades gracefully.

---

## Environment Variables

Copy these into your `.env.local`. Variables prefixed with `NEXT_PUBLIC_` are safe to expose in the browser bundle; unprefixed variables are build-time only.

```bash
# Strapi CMS (used internally; ZeroDB is the consumer-facing read layer)
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-strapi-api-token

# ZeroDB (primary read API for CMS content + semantic search)
NEXT_PUBLIC_ZERODB_PROJECT_ID=your-project-id
NEXT_PUBLIC_ZERODB_API_URL=https://api.ainative.studio
ZERODB_API_KEY=your-api-key
ZERODB_USERNAME=your-username
ZERODB_PASSWORD=your-password

# Analytics (optional, browser-only)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## Data Sources

### Static Data Files

These files live in `data/*.ts` and are imported directly. They are the source of truth for content that does not require CMS management.

#### `data/cv.ts`

CV and resume data. Single exported object (not an array).

```typescript
interface CV {
  name: string;
  title: string;
  summary: string;
  contact: {
    email: string;
    website: string;
    github: string;
    linkedin: string;
  };
  expertise: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  publications: PublicationEntry[];
  downloadLinks: {
    label: string;
    url: string;
  }[];
}
```

#### `data/essays.ts`

```typescript
interface Essay {
  title: string;
  excerpt: string;
  fullText: string;
  dateWritten: string;       // ISO date string
  theme: string;
  wordCount: number;
  tags: string[];
  slug: string;
  featured: boolean;
}

// Export: Essay[]
```

#### `data/poetry.ts`

```typescript
interface Poem {
  title: string;
  excerpt: string;
  firstLine: string;
  fullText: string;
  dateWritten: string;       // ISO date string
  form: string;              // e.g. "sonnet", "free verse", "haiku"
  theme: string;
  tags: string[];
  slug: string;
  featured: boolean;
}

// Export: Poem[]
```

#### `data/fiction.ts`

```typescript
interface Story {
  title: string;
  excerpt: string;
  fullText: string;
  dateWritten: string;       // ISO date string
  genre: string;
  theme: string;
  wordCount: number;
  tags: string[];
  slug: string;
  featured: boolean;
}

// Export: Story[]
// NOTE: Currently empty array. Shape is defined but no content exists yet.
```

#### `data/papers.ts`

```typescript
interface Paper {
  title: string;
  description: string;
  abstract: string;
  externalUrl: string;
  pdfUrl: string;
  repository: string;
  publicationDate: string;   // ISO date string
  lastUpdated: string;       // ISO date string
  version: string;           // e.g. "1.0.0"
  category: string;
  tags: string[];
  featured: boolean;
}

// Export: Paper[]
```

#### `data/theories.ts`

```typescript
interface Theory {
  slug: string;
  title: string;
  frameworkName: string;
  shortDescription: string;
  description: string;       // Markdown content
  keyConcepts: string[];
  applications: string[];
  relatedFrameworks: string[];
  dateIntroduced: string;    // ISO date string
  currentVersion: string;
  paperUrl: string;
  tags: string[];
  featured: boolean;
}

// Export: Theory[]
```

#### `data/featuredContent.ts`

Controls what appears in the site's featured/hero section. Maximum of 3 items are displayed (`maxFeatured = 3`). Items are ordered by `priority` (lower number = higher priority).

```typescript
type FeaturedContentType = 'paper' | 'theory' | 'poem' | 'writing';

interface FeaturedItem {
  type: FeaturedContentType;
  slug: string;
  headline: string;
  subheadline: string;
  cta: string;               // Call-to-action button label
  priority: number;          // Sort order; lower = higher priority
}

// Export: FeaturedItem[]
// Export: maxFeatured = 3
```

---

### ZeroDB API

Strapi CMS content is synced into ZeroDB and read through the `strapiClient` singleton (`lib/strapi.ts`). You should use the service layer methods rather than calling ZeroDB directly — see [StrapiClient](#strapiclient-libstrapits).

The tables below describe the underlying ZeroDB data shapes if you need to query ZeroDB directly.

#### Table: `strapi_blog_posts`

```typescript
interface BlogPost {
  id: number;
  strapi_id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;           // HTML or Markdown
  reading_time: number;      // Minutes
  published_at: string;      // ISO datetime string
  author: string;
  category: string;
  tags: string[];
}
```

#### Table: `strapi_tutorials`

```typescript
interface Tutorial {
  id: number;
  strapi_id: number;
  title: string;
  slug: string;
  description: string;
  content: string;           // HTML or Markdown
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;          // Minutes
  author: string;
  category: string;
  tags: string[];
}
```

#### Table: `strapi_events`

```typescript
interface Event {
  title: string;
  slug: string;
  description: string;
  event_type: string;
  start_date: string;        // ISO datetime string
  end_date: string;          // ISO datetime string
  timezone: string;          // IANA timezone identifier, e.g. "America/Chicago"
  is_virtual: boolean;
  location: string;
  venue_name: string;
  city: string;
  country: string;
  registration_url: string;
  status: string;            // e.g. "upcoming", "past", "cancelled"
}
```

#### Table: `strapi_papers`

```typescript
interface StrapiPaper {
  title: string;
  slug: string;
  abstract: string;
  content: string;           // Full paper body, Markdown
  version: string;
  publication_date: string;  // ISO date string
  pdf_url: string;
  github_path: string;
  source: string;
  featured: boolean;
  category: string;
  tags: string[];
}
```

#### Table: `strapi_writings`

Unified table for all long-form creative writing.

```typescript
interface Writing {
  title: string;
  slug: string;
  writing_type: 'poem' | 'essay' | 'story';
  excerpt: string;
  content: string;           // Full text, Markdown
  date_written: string;      // ISO date string
  word_count: number;
  form: string;              // Poem form; empty string for prose
  genre: string;             // Story genre; empty string for other types
  theme: string;
  first_line: string;        // Poem first line; empty string for prose
  featured: boolean;
  tags: string[];
}
```

#### Table: `strapi_tosw_chapters`

Chapters from The Open Source Way guidebook (CC BY-SA 4.0).

```typescript
interface ToswChapter {
  title: string;
  slug: string;
  description: string;
  content: string;           // Full chapter content, Markdown
  section: string;           // Section/part name
  section_order: number;     // Sort order within the book
  chapter_order: number;     // Sort order within the section
  github_path: string;       // Path in the source GitHub repo
  license: string;           // e.g. "CC BY-SA 4.0"
  tags: string[];
}
```

---

### GitHub API

Papers in the `karstenwade/papers` repository are fetched at build time. The service reads `.md` and `.markdown` files from the repository root and parses YAML frontmatter for structured metadata.

**Repository:** `karstenwade/papers`

**Frontmatter shape** (parsed from each file):

```yaml
---
title: "Paper Title"
abstract: "Short summary of the paper."
publicationDate: "2025-01-15"
version: "1.0.0"
category: "ai-policy"
tags:
  - open-source
  - community
---
```

The remaining file content (after frontmatter) is the full Markdown body. Slugs are derived from the filename with the extension stripped.

---

## Service Layer

All service modules have graceful error handling: they return empty arrays or `null` on failure and never throw. Build processes will not fail due to API unavailability.

---

### StrapiClient (`lib/strapi.ts`)

A singleton exported as `strapiClient`. Wraps all ZeroDB table queries.

**Import:**

```typescript
import { strapiClient } from '@/lib/strapi';
```

#### Method Reference

##### Blog Posts

```typescript
// List with optional filtering
strapiClient.getBlogPosts(options?: QueryOptions): Promise<{ posts: BlogPost[], total: number }>

// Single record
strapiClient.getBlogPostBySlug(slug: string): Promise<BlogPost | null>

// Taxonomy helpers
strapiClient.getBlogCategories(): Promise<string[]>
strapiClient.getBlogTags(): Promise<string[]>
```

##### Tutorials

```typescript
strapiClient.getTutorials(options?: QueryOptions): Promise<{ tutorials: Tutorial[], total: number }>
strapiClient.getTutorialBySlug(slug: string): Promise<Tutorial | null>
```

##### Events

```typescript
strapiClient.getEvents(options?: QueryOptions): Promise<{ events: Event[], total: number }>
strapiClient.getEventBySlug(slug: string): Promise<Event | null>
```

##### Papers (CMS-managed)

```typescript
strapiClient.getPapers(options?: QueryOptions): Promise<{ papers: StrapiPaper[], total: number }>
strapiClient.getPaperBySlug(slug: string): Promise<StrapiPaper | null>
```

##### Writings

```typescript
// All writings, regardless of type
strapiClient.getWritings(options?: QueryOptions): Promise<{ writings: Writing[], total: number }>
strapiClient.getWritingBySlug(slug: string): Promise<Writing | null>

// Filtered by writing_type
strapiClient.getPoems(options?: QueryOptions): Promise<Writing[]>
strapiClient.getEssays(options?: QueryOptions): Promise<Writing[]>
strapiClient.getStories(options?: QueryOptions): Promise<Writing[]>
```

##### TOSW Chapters

```typescript
strapiClient.getToswChapters(options?: QueryOptions): Promise<{ chapters: ToswChapter[], total: number }>
strapiClient.getToswChapterBySlug(slug: string): Promise<ToswChapter | null>
strapiClient.getToswSections(): Promise<string[]>
```

#### `QueryOptions` Interface

```typescript
interface QueryOptions {
  page?: number;             // 1-based page number
  pageSize?: number;         // Items per page
  filters?: Record<string, unknown>;
  sort?: string;             // Field name, prefix with "-" for descending
}
```

---

### ZeroDB Client (`lib/zerodb-client.ts`)

Semantic (vector) search over CMS content. Search availability is optional — check `isSearchConfigured()` before calling search methods. All search calls degrade gracefully: they return `[]` when ZeroDB is unconfigured or unavailable.

**Import:**

```typescript
import { zerodbClient } from '@/lib/zerodb-client';
```

#### Method Reference

```typescript
// Search individual content types
zerodbClient.searchBlogPosts(query: string, options?: SearchOptions): Promise<SearchResult[]>
zerodbClient.searchTutorials(query: string, options?: SearchOptions): Promise<SearchResult[]>

// Search across all indexed content types at once
zerodbClient.searchAllContent(
  query: string,
  options?: SearchOptions
): Promise<{ blogPosts: SearchResult[], tutorials: SearchResult[] }>

// Get semantically related content given a piece of content
zerodbClient.getRelatedContent(
  contentType: string,
  title: string,
  description?: string,
  limit?: number
): Promise<SearchResult[]>

// Check whether ZeroDB environment variables are configured
zerodbClient.isSearchConfigured(): boolean
```

#### `SearchOptions` Interface

```typescript
interface SearchOptions {
  limit?: number;            // Max results to return (default: 10)
  threshold?: number;        // Minimum similarity score 0–1 (default: 0.7)
}
```

#### `SearchResult` Interface

```typescript
interface SearchResult {
  id: string | number;
  title: string;
  slug: string;
  excerpt?: string;
  score: number;             // Similarity score 0–1; higher = more relevant
  contentType: string;       // e.g. "blog_post", "tutorial"
}
```

---

### Content Service (`lib/services/contentService.ts`)

An abstraction layer that provides a consistent interface for creative writing content regardless of whether the underlying source is static files or Strapi/ZeroDB. Use this layer when you want to swap implementations without changing call sites.

**Import:**

```typescript
import { contentService } from '@/lib/services/contentService';
// or
import { createContentService } from '@/lib/services/contentService';
```

#### `IContentService` Interface

```typescript
interface IContentService {
  getEssays(): Promise<Essay[]>;
  getPoems(): Promise<Poem[]>;
  getStories(): Promise<Story[]>;
  getPapers(forceRefresh?: boolean): Promise<Paper[]>;
}
```

#### Default Instance Methods

```typescript
contentService.getEssays(): Promise<Essay[]>
contentService.getPoems(): Promise<Poem[]>
contentService.getStories(): Promise<Story[]>
contentService.getPapers(forceRefresh?: boolean): Promise<Paper[]>
```

#### Factory Function

Use the factory to explicitly select an implementation:

```typescript
const service = createContentService('static');   // reads from data/*.ts
const service = createContentService('strapi');   // reads from ZeroDB via strapiClient
```

The default exported `contentService` instance uses `'static'` unless overridden by environment configuration.

---

### Paper Service (`lib/services/paperService.ts`)

Fetches academic papers from the `karstenwade/papers` GitHub repository. Includes in-memory caching with a 5-minute TTL to avoid redundant API calls during a build.

**Import:**

```typescript
import { getPapers, getPaperBySlug, clearPapersCache } from '@/lib/services/paperService';
```

#### Method Reference

```typescript
// Fetch all papers. Uses cache unless forceRefresh is true or cache is stale.
getPapers(
  forceRefresh?: boolean,   // Default: false
  cacheTTL?: number         // Milliseconds; default: 300000 (5 minutes)
): Promise<Paper[]>

// Fetch a single paper and its full Markdown content
getPaperBySlug(slug: string): Promise<{ paper: Paper, markdown: string }>

// Manually invalidate the in-memory cache
clearPapersCache(): void
```

**Caching behavior:**

- First call fetches from GitHub API and populates the cache.
- Subsequent calls within 5 minutes return cached data.
- Pass `forceRefresh: true` to bypass the cache regardless of TTL.
- The cache is in-memory only — it does not persist across build processes.

---

### GitHub API Wrapper (`lib/services/githubApi.ts`)

Low-level wrapper around the GitHub REST API. Use `paperService` in preference to calling this directly unless you need raw repository access.

**Import:**

```typescript
import { fetchRepositoryContents, fetchFileContent, fetchMarkdownFiles } from '@/lib/services/githubApi';
```

#### Method Reference

```typescript
// List contents of a repository directory
fetchRepositoryContents(
  owner: string,
  repo: string,
  path?: string              // Default: repository root ("")
): Promise<GitHubContent[]>

// Fetch the decoded text content of a single file
fetchFileContent(
  owner: string,
  repo: string,
  path: string
): Promise<string>

// Fetch the text content of all .md/.markdown files under a path
fetchMarkdownFiles(
  owner: string,
  repo: string,
  path?: string              // Default: repository root ("")
): Promise<string[]>
```

#### `GitHubContent` Interface

```typescript
interface GitHubContent {
  name: string;              // Filename
  path: string;              // Full path within the repo
  type: 'file' | 'dir';
  size: number;              // Bytes
  download_url: string | null;
  sha: string;
}
```

---

## External API Endpoints

The service layer makes the following external HTTP calls. You will only need these if you are bypassing the service layer and calling APIs directly.

| API | Endpoint | Method | Auth |
|-----|----------|--------|------|
| ZeroDB Auth | `{NEXT_PUBLIC_ZERODB_API_URL}/v1/public/auth/login-json` | POST | `{ username, password }` in JSON body |
| ZeroDB Table Query | `{NEXT_PUBLIC_ZERODB_API_URL}/v1/projects/{NEXT_PUBLIC_ZERODB_PROJECT_ID}/tables/{table}/rows/query` | POST | `Authorization: Bearer <token>` |
| ZeroDB Semantic Search | `{NEXT_PUBLIC_ZERODB_API_URL}/v1/public/{NEXT_PUBLIC_ZERODB_PROJECT_ID}/embeddings/search` | POST | `X-API-Key: {ZERODB_API_KEY}` |
| GitHub Contents | `https://api.github.com/repos/{owner}/{repo}/contents/{path}` | GET | Optional `Authorization: token <GITHUB_TOKEN>` |

### ZeroDB Auth Request Body

```json
{
  "username": "your-username",
  "password": "your-password"
}
```

Returns a bearer token valid for the session. The `strapiClient` handles token acquisition and reuse automatically.

### ZeroDB Table Query Request Body

```json
{
  "filters": {},
  "sort": [{ "field": "published_at", "direction": "desc" }],
  "page": 1,
  "pageSize": 20
}
```

### ZeroDB Semantic Search Request Body

```json
{
  "query": "open source community governance",
  "table": "strapi_blog_posts",
  "limit": 10,
  "threshold": 0.7
}
```

---

## TypeScript Interfaces

Complete consolidated reference for all data shapes used across the codebase.

```typescript
// ─── Static Data ───────────────────────────────────────────────────────────

interface Essay {
  title: string;
  excerpt: string;
  fullText: string;
  dateWritten: string;
  theme: string;
  wordCount: number;
  tags: string[];
  slug: string;
  featured: boolean;
}

interface Poem {
  title: string;
  excerpt: string;
  firstLine: string;
  fullText: string;
  dateWritten: string;
  form: string;
  theme: string;
  tags: string[];
  slug: string;
  featured: boolean;
}

interface Story {
  title: string;
  excerpt: string;
  fullText: string;
  dateWritten: string;
  genre: string;
  theme: string;
  wordCount: number;
  tags: string[];
  slug: string;
  featured: boolean;
}

interface Paper {
  title: string;
  description: string;
  abstract: string;
  externalUrl: string;
  pdfUrl: string;
  repository: string;
  publicationDate: string;
  lastUpdated: string;
  version: string;
  category: string;
  tags: string[];
  featured: boolean;
}

interface Theory {
  slug: string;
  title: string;
  frameworkName: string;
  shortDescription: string;
  description: string;       // Markdown
  keyConcepts: string[];
  applications: string[];
  relatedFrameworks: string[];
  dateIntroduced: string;
  currentVersion: string;
  paperUrl: string;
  tags: string[];
  featured: boolean;
}

type FeaturedContentType = 'paper' | 'theory' | 'poem' | 'writing';

interface FeaturedItem {
  type: FeaturedContentType;
  slug: string;
  headline: string;
  subheadline: string;
  cta: string;
  priority: number;
}

// ─── ZeroDB / CMS ──────────────────────────────────────────────────────────

interface BlogPost {
  id: number;
  strapi_id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  reading_time: number;
  published_at: string;
  author: string;
  category: string;
  tags: string[];
}

interface Tutorial {
  id: number;
  strapi_id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  author: string;
  category: string;
  tags: string[];
}

interface Event {
  title: string;
  slug: string;
  description: string;
  event_type: string;
  start_date: string;
  end_date: string;
  timezone: string;
  is_virtual: boolean;
  location: string;
  venue_name: string;
  city: string;
  country: string;
  registration_url: string;
  status: string;
}

interface StrapiPaper {
  title: string;
  slug: string;
  abstract: string;
  content: string;
  version: string;
  publication_date: string;
  pdf_url: string;
  github_path: string;
  source: string;
  featured: boolean;
  category: string;
  tags: string[];
}

interface Writing {
  title: string;
  slug: string;
  writing_type: 'poem' | 'essay' | 'story';
  excerpt: string;
  content: string;
  date_written: string;
  word_count: number;
  form: string;
  genre: string;
  theme: string;
  first_line: string;
  featured: boolean;
  tags: string[];
}

interface ToswChapter {
  title: string;
  slug: string;
  description: string;
  content: string;
  section: string;
  section_order: number;
  chapter_order: number;
  github_path: string;
  license: string;
  tags: string[];
}

// ─── Search ────────────────────────────────────────────────────────────────

interface SearchResult {
  id: string | number;
  title: string;
  slug: string;
  excerpt?: string;
  score: number;
  contentType: string;
}

// ─── GitHub ────────────────────────────────────────────────────────────────

interface GitHubContent {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size: number;
  download_url: string | null;
  sha: string;
}

// ─── Service Shared ────────────────────────────────────────────────────────

interface QueryOptions {
  page?: number;
  pageSize?: number;
  filters?: Record<string, unknown>;
  sort?: string;
}

interface SearchOptions {
  limit?: number;
  threshold?: number;
}

interface IContentService {
  getEssays(): Promise<Essay[]>;
  getPoems(): Promise<Poem[]>;
  getStories(): Promise<Story[]>;
  getPapers(forceRefresh?: boolean): Promise<Paper[]>;
}
```

---

## Data Flow

The diagrams below show how data moves from source to rendered output for each pipeline.

### Static Content Pipeline

```
data/*.ts
    │
    ├── data/essays.ts ──────┐
    ├── data/poetry.ts ──────┤
    ├── data/fiction.ts ─────┼──► contentService (IContentService)
    ├── data/papers.ts ──────┤         │
    ├── data/theories.ts ────┘         │
    │                                  ▼
    └── data/cv.ts ──────────► page components (direct import)
    └── data/featuredContent.ts         │
                                        ▼
                              Next.js static export (HTML)
```

### ZeroDB / CMS Pipeline

```
Strapi CMS (authoring)
    │
    │  [automated sync]
    ▼
ZeroDB tables
  strapi_blog_posts
  strapi_tutorials
  strapi_events
  strapi_papers
  strapi_writings
  strapi_tosw_chapters
    │
    ▼
strapiClient (lib/strapi.ts)
    │  getBlogPosts(), getTutorials(), etc.
    ▼
Page components (build-time fetch)
    │
    ▼
Next.js static export (HTML)
```

### GitHub Papers Pipeline

```
karstenwade/papers (GitHub repo)
    │  .md / .markdown files with YAML frontmatter
    │
    ▼
githubApi.ts (fetchRepositoryContents, fetchFileContent)
    │
    ▼
paperService.ts
    │  parses frontmatter → Paper interface
    │  returns { paper, markdown } for detail pages
    │  5-minute in-memory cache
    ▼
Page components (build-time fetch)
    │
    ▼
Next.js static export (HTML)
```

### Semantic Search Pipeline

```
User input (query string)
    │
    ▼
zerodb-client.ts
    │  isSearchConfigured() check
    │  POST /v1/public/{id}/embeddings/search
    ▼
ZeroDB Embeddings API
    │
    ▼
SearchResult[] (ranked by similarity score)
    │
    ▼
Search UI component
```

---

## Architecture Notes

### Static Export Constraint

All data fetching occurs at build time. When building your frontend:

- Call service methods inside `getStaticProps`, `generateStaticParams`, or equivalent build-time hooks.
- Do not rely on these services for client-side data fetching of primary content.
- The sole exception is ZeroDB semantic search, which is designed for runtime use from the browser.

### Graceful Degradation

Every service is designed to fail silently:

| Scenario | Behavior |
|----------|----------|
| ZeroDB is unreachable | Returns `{ posts: [], total: 0 }` or `[]` |
| A slug lookup finds no record | Returns `null` |
| GitHub API is rate-limited or unavailable | Returns `[]` |
| `isSearchConfigured()` returns `false` | Search methods return `[]` without making any network call |

Build processes will not fail due to API unavailability. You may get empty pages, but the build completes.

### Data Source Selection for Creative Writing

Essays, poems, and stories exist in two potential locations:

1. **`data/*.ts`** — Static files, always available, no API required.
2. **ZeroDB `strapi_writings` table** — CMS-managed, requires ZeroDB to be configured.

`contentService` abstracts this choice. The `'static'` implementation reads from `data/*.ts`; the `'strapi'` implementation reads from ZeroDB. The default instance uses `'static'`.

If you need CMS-managed content, use `createContentService('strapi')` or call `strapiClient.getWritings()` directly.

### Papers: Two Separate Sources

There are two independent papers data sources with no deduplication between them:

| Source | Interface | Access |
|--------|-----------|--------|
| `data/papers.ts` | `Paper` | Direct import |
| `karstenwade/papers` GitHub repo | `Paper` + `markdown` | `paperService` |
| ZeroDB `strapi_papers` | `StrapiPaper` | `strapiClient.getPapers()` |

The `Paper` interface is shared between the static file and GitHub sources. `StrapiPaper` uses a different field naming convention (snake_case) and includes CMS-specific fields (`source`, `github_path`).

### Cache Behavior (paperService)

The 5-minute TTL cache in `paperService` is in-memory. It is not shared across processes and does not persist between builds. In CI/CD, each build starts with an empty cache and makes fresh GitHub API calls.

### ZeroDB Authentication Flow

`strapiClient` handles token acquisition internally:

1. On first request, POSTs credentials to the auth endpoint.
2. Stores the bearer token in memory.
3. Attaches the token to all subsequent ZeroDB table query requests.
4. There is no automatic token refresh — the token lasts for the duration of the build process.
