# Frontend Separation Guide

How to build a new frontend that consumes karstenwade.com's backend data layer.

## Architecture

The current karstenwade.com is a **Next.js 16 static export** site. All data is fetched at build time and rendered to static HTML. The backend data layer lives in this repo:

```
karstenwade.com/          (this repo — backend + current frontend)
├── data/                 # Static content (TypeScript files)
├── lib/                  # Services, API clients, utilities
│   ├── strapi.ts         # ZeroDB/Strapi client
│   ├── utils.ts          # CSS utilities (cn)
│   ├── zerodb-client.ts  # Semantic search
│   └── services/         # Content abstractions
├── types/                # Shared TypeScript types
└── app/                  # Current frontend (to be replaced)
```

The new frontend repo will import the **data layer** (`data/`, `lib/`, `types/`) either by:
- Copying the files into the new repo
- Publishing as an npm package
- Using a monorepo with shared workspace

## Data Sources

### 1. Static TypeScript Files (`data/`)

Hardcoded content arrays. Currently the primary source for most content.

| File | Export | Content |
|------|--------|---------|
| `data/cv.ts` | `cvData` | CV/resume (name, title, summary, contact, expertise, experience) |
| `data/essays.ts` | `essays: Essay[]` | Creative essays with fullText, theme, tags |
| `data/poetry.ts` | `poems: Poem[]` | Poems with fullText, form, firstLine |
| `data/fiction.ts` | `stories: Story[]` | Fiction stories (currently empty) |
| `data/papers.ts` | `papers: Paper[]` | Academic papers metadata + GitHub links |
| `data/theories.ts` | `theories: Theory[]` | Frameworks/theories with markdown descriptions |
| `data/featuredContent.ts` | `featuredItems: FeaturedItem[]` | Homepage featured cards (max 3) |

### 2. ZeroDB API (Strapi CMS sync)

Blog posts, tutorials, events, and writings synced from Strapi CMS into ZeroDB tables. Access via `lib/strapi.ts`.

| Table | Content | Key Fields |
|-------|---------|------------|
| `strapi_blog_posts` | Blog articles | title, slug, excerpt, content, reading_time, category, tags |
| `strapi_tutorials` | Tutorials | title, slug, content, difficulty, duration, category |
| `strapi_events` | Events | title, slug, start_date, end_date, is_virtual, location |
| `strapi_papers` | Papers (CMS) | title, slug, abstract, content, version, featured |
| `strapi_writings` | Poetry/essays/fiction | title, slug, writing_type, content, form, genre |
| `strapi_tosw_chapters` | Open Source Way chapters | title, slug, section, chapter_order, content |

### 3. GitHub API (Papers)

Papers fetched directly from `karstenwade/papers` GitHub repository. Markdown files with YAML frontmatter. Access via `lib/services/paperService.ts`.

## Service Layer Quick Reference

```typescript
// Blog posts from ZeroDB
import { strapiClient } from '@/lib/strapi'
const { posts, total } = await strapiClient.getBlogPosts({ limit: 10, category: 'tech' })
const post = await strapiClient.getBlogPostBySlug('my-post')

// Static content
import { contentService } from '@/lib/services/contentService'
const essays = await contentService.getEssays()
const poems = await contentService.getPoems()

// Papers from GitHub
import { getPapers, getPaperBySlug } from '@/lib/services/paperService'
const papers = await getPapers()
const { paper, markdown } = await getPaperBySlug('paper-slug')

// Semantic search
import { searchBlogPosts, searchAllContent } from '@/lib/zerodb-client'
const results = await searchBlogPosts('open source communities', { limit: 5 })
```

## Current Routes & Components

### Route Map

| Route | Type | Data Source | Key Components |
|-------|------|-------------|----------------|
| `/` | Server | `data/featuredContent.ts`, `data/papers.ts` | Hero, FeaturedContent, Card |
| `/blog` | Server + Client | `strapiClient.getBlogPosts()` | BlogListClient (filters, pagination), BlogCard |
| `/blog/[slug]` | Server + Client | `strapiClient.getBlogPostBySlug()` | react-markdown, StructuredData, ShareButtons |
| `/cv` | Server | `data/cv.ts` | Static sections (contact, expertise, experience, publications) |
| `/papers` | Server | `contentService.getPapers()` | Card grid (3-col responsive) |
| `/papers/[slug]` | Server + Client | `getPaperBySlug()` (GitHub markdown) | PaperHeader, CitationBlock (APA/MLA/BibTeX tabs), PrintButton, PdfDownloadButton |
| `/writing` | Server + Client | `contentService.getPoems/getEssays/getStories()` | WritingTabs (tabbed), PoetryList, EssaysList, FictionList |

### Component Architecture

**Server Components** (SSG, no interactivity):
- `Hero` — headshot, name, tagline, bio
- `FeaturedContent` — 3-card grid from `featuredItems`, sorted by priority
- `Card` — generic card with hover effects, auto-detects external links
- `BlogCard` — category badge, reading time, excerpt, tags preview
- `PaperHeader` — academic serif styling, abstract box, action buttons
- `ShareButtons` — X/Twitter, LinkedIn, optional Email
- `StructuredData` — JSON-LD (Person, Article, ScholarlyArticle, BlogPosting, CreativeWork)
- `SocialLinks` — GitHub, LinkedIn, Bluesky, Mastodon, Twitter/X

**Client Components** (`'use client'`):
- `Navigation` — mobile hamburger menu, keyboard nav, ARIA labels
- `BlogListClient` — category/tag filters, pagination, URL state via `useSearchParams`
- `BlogFilters` — category dropdown, tag multi-select pills
- `Pagination` — Previous/Next with page indicator
- `WritingTabs` — 3-tab interface (poetry/essays/fiction), ARIA tablist
- `PoetryList` / `EssaysList` / `FictionList` — expand/collapse fullText
- `CitationBlock` — APA/MLA/BibTeX tabs, copy-to-clipboard
- `PrintButton` — `window.print()` trigger
- `PdfDownloadButton` — client-side PDF generation via `html2pdf.js`

### Key UI Patterns

- **Card grids**: 3-col on lg, 2 on md, 1 on sm (Tailwind responsive)
- **Tab interfaces**: ARIA tablist/tab/tabpanel with keyboard support
- **Markdown rendering**: `react-markdown` with `remark-gfm`, `rehype-highlight`, `rehype-slug`, `rehype-autolink-headings`
- **Expand/collapse**: Toggle buttons for full text in writing sections
- **Filter + pagination**: URL-driven state for blog (category, tags, page as query params)
- **Academic styling**: Serif fonts for paper titles, citation blocks with copy
- **Print styles**: Papers have dedicated `print.css` hiding UI, showing URLs

## Environment Variables

```bash
# Required for ZeroDB/Strapi content
NEXT_PUBLIC_ZERODB_PROJECT_ID=your-project-id
NEXT_PUBLIC_ZERODB_API_URL=https://api.ainative.studio
ZERODB_API_KEY=your-api-key
ZERODB_USERNAME=your-username
ZERODB_PASSWORD=your-password

# Required for Strapi direct access
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-strapi-api-token

# Optional: semantic search
# (Uses same ZeroDB credentials above)

# Optional: analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Design System

### CSS Variables (`styles/variables.css`)

175 custom properties organized by category:

| Category | Examples | Count |
|----------|----------|-------|
| Colors | `--color-primary`, `--color-secondary`, `--color-accent`, `--color-neutral-*` (8 shades), semantic colors | 36 |
| Typography | `--font-body`, `--font-heading`, `--font-size-*` (fluid clamp), weights, line-heights | 28 |
| Spacing | `--space-1` through `--space-24` (4px base) | 15 |
| Border Radius | `--radius-sm` through `--radius-full` | 5 |
| Shadows | `--shadow-xs` through `--shadow-xl` | 5 |
| Transitions | `--transition-fast` (150ms), `--transition-base` (250ms), `--transition-slow` (350ms) | 3 |
| Z-Index | `--z-base` through `--z-tooltip` (1600) | 8 |

### Color Palette ("Wide Horizon Clubhouse")

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#D97038` (sunset orange) | CTAs, links, accent elements |
| `--color-secondary` | `#5B8FA3` (horizon blue) | Secondary actions, info |
| `--color-accent` | `#C85C5C` (welcoming red) | Highlights, errors |
| `--color-neutral-100` to `800` | `#F8F6F4` → `#1A1612` | Backgrounds, text, borders |
| `--color-success` | `#5A9367` | Success states |
| `--color-warning` | `#D9A538` | Warning states |
| `--color-error` | `#C85C5C` | Error states |
| `--color-info` | `#5B8FA3` | Info states |

### Typography

- **Body/Heading**: "Open Sans" + system fallbacks
- **Special**: "TT2020" for decorative elements
- **Mono**: "SF Mono" / Consolas / Monaco
- **Fluid sizing**: All sizes use `clamp()` (e.g., `--font-size-xl: clamp(1.5rem, 1.25rem + 1vw, 2rem)`)

### Tailwind Theme

`tailwind.config.js` extends the default theme with matching design tokens (colors, fonts, spacing, shadows, z-index). The Tailwind config and CSS variables define the same design system in parallel.

### UI Components (shadcn/ui)

Available in `app/components/ui/`:
- `button.tsx` — Button with variants (default, destructive, outline, secondary, ghost, link) and sizes (default, sm, lg, icon)
- `card.tsx` — Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent

## Key Architecture Decisions

1. **Static export** (`output: 'export'`) — all pages pre-rendered at build time. No server-side rendering at runtime.
2. **Content service abstraction** — `IContentService` interface allows swapping between static files and Strapi/ZeroDB backends.
3. **Graceful degradation** — all API calls return empty results on failure, never throw. Search is optional.
4. **GitHub papers** — papers are markdown files in a separate GitHub repo, fetched and rendered at build time with 5-minute in-memory cache.
5. **Dual content system** — static TypeScript files are the current primary; ZeroDB/Strapi is the future primary. Both work simultaneously via `createContentService('static' | 'strapi')`.

## Running the Backend Locally

```bash
# Clone and install
git clone https://github.com/karstenwade/karstenwade.com.git
cd karstenwade.com
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Start Next.js dev server (port 3001)
npm run dev

# Start Strapi CMS (port 1337, optional)
cd cms && npm run develop
```

## Type Definitions

All shared types are in `types/index.ts`. Key types:

```typescript
type ContentType = 'poetry' | 'fiction' | 'cv' | 'theories' | 'open-papers'

interface RouteConfig {
  path: string
  label: string
  description: string
}

interface ContentMeta {
  title: string
  description: string
  date?: string
  tags?: string[]
  type: ContentType
}
```

For complete data shape definitions, see `docs/BACKEND_API_REFERENCE.md`.
