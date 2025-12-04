# Next.js Migration Plan (Epic 14)
**karstenwade.com: Vite → Next.js 15 Conversion**

**Version:** 2.0
**Created:** 2025-11-25
**Updated:** 2025-12-03
**Status:** Planning
**Budget:** $0/month (Free tiers only)
**Story Size:** <3 points per story

> **Update 2025-12-03:** Strapi CMS integration deferred to future roadmap. This migration focuses on **SSG-only** using static Git-sourced content. CMS can be added later via the content service abstraction layer (Epic 11.5.4).

---

## Executive Summary

Converting karstenwade.com from Vite + React SPA to Next.js 15 (App Router) to unlock:
- **Static Site Generation (SSG)** - Pre-rendered HTML at build time
- **Better SEO** - Full content visible to search engines immediately
- **Improved performance** - Faster First Contentful Paint (FCP)
- **Native Metadata API** - Replaces react-helmet-async
- **Image optimization** via next/image
- **Future flexibility** - Easy to add SSR, API routes, or CMS later

**Migration Strategy:** Big Bang - Full conversion in single effort
**Deployment:** Vercel (primary) + GitHub Pages (mirror)
**Timeline Estimate:** 2-3 weeks focused development
**CMS Status:** Deferred - Using static content service abstraction (Epic 11.5.4)

---

## Architecture Overview

### Current Stack (Vite)
```
Frontend: React 18 + TypeScript + Vite
Routing: React Router DOM v7
Styling: Tailwind CSS v4 + Shadcn UI
SEO: React Helmet Async
State: Local data files (.ts)
Deployment: Vercel (primary) + GitHub Pages (mirror)
Testing: Vitest + React Testing Library
```

### Target Stack (Next.js)
```
Framework: Next.js 15 (App Router)
Runtime: React 18 + TypeScript
Routing: File-based (app directory)
Styling: Tailwind CSS v4 + Shadcn UI (keep)
SEO: Next.js Metadata API (built-in)
Content: Static files via contentService abstraction (Epic 11.5.4)
Data Fetching: SSG with generateStaticParams
Deployment: Vercel (primary) + GitHub Pages (mirror)
Analytics: Google Analytics (already integrated)
Testing: Vitest (keep existing tests)
Image Optimization: next/image (unoptimized for static export)
CMS: Deferred to future roadmap (Epic 12)
```

---

## Static Site Generation Strategy

### Build Strategy

**Goal:** Pre-render all pages at build time for optimal SEO and performance

**Approach: Pure SSG with `output: 'export'`**

1. **All Pages Static at Build Time**
   - `next build` generates HTML for every route
   - Zero runtime server required
   - Can be hosted on any static hosting (Vercel, GitHub Pages, Netlify)

2. **Content Sources (No CMS - Deferred to Epic 12)**
   - **Papers**: GitHub repository (karstenwade/papers) via paperService
   - **Poetry/Essays/Fiction**: Static TypeScript data files via contentService
   - **CV/Theories**: Static TypeScript data files
   - Content service abstraction (Epic 11.5.4) enables future CMS migration

3. **Deployment**
   - Vercel: Automatic deploys on push to main
   - GitHub Pages: Mirror deployment via GitHub Actions

### Data Fetching Strategy by Content Type

| Content Type | Source | Strategy | Update Method |
|-------------|--------|----------|---------------|
| **Papers** | GitHub API | generateStaticParams | Push to papers repo → rebuild |
| **Poetry** | poetry.ts | SSG | Edit file → push → rebuild |
| **Essays** | essays.ts | SSG | Edit file → push → rebuild |
| **Fiction** | fiction.ts | SSG | Edit file → push → rebuild |
| **CV** | cv.ts | SSG | Edit file → push → rebuild |
| **Theories** | theories.ts | SSG | Edit file → push → rebuild |
| **Home** | featuredContent.ts | SSG | Edit file → push → rebuild |

### Content Service Integration

The existing `contentService` abstraction (Epic 11.5.4) will be used:

```typescript
// lib/content.ts (adapted for Next.js Server Components)
import { contentService } from '@/services/contentService'

// These can be called directly in Server Components
export async function getPoems() {
  return contentService.getPoems()
}

export async function getEssays() {
  return contentService.getEssays()
}

// For dynamic routes (papers)
export async function generateStaticParams() {
  const papers = await contentService.getPapers()
  return papers.map((paper) => ({ slug: paper.slug }))
}
```

### Future CMS Integration (Epic 12)

When ready to add CMS, simply implement a new content service:

```typescript
// services/strapiContentService.ts (future)
export class StrapiContentService implements IContentService {
  async getPoems() {
    return fetch(`${STRAPI_URL}/api/poems`).then(r => r.json())
  }
  // ... other methods
}
```

---

## File Structure Migration

### Current Vite Structure → Next.js App Router

```
CURRENT (Vite)                    TARGET (Next.js)
─────────────────────────────────────────────────────────
src/
├── main.tsx                   → (delete - Next.js handles)
├── App.tsx                    → (delete - Next.js handles)
├── vite-env.d.ts             → (delete)
│
├── pages/                     → app/
│   ├── Home.tsx              → app/page.tsx
│   ├── CV.tsx                → app/cv/page.tsx
│   ├── Writing.tsx           → app/writing/page.tsx
│   ├── OpenPapers.tsx        → app/papers/page.tsx
│   ├── PaperDetail.tsx       → app/papers/[slug]/page.tsx
│   └── Theories.tsx          → app/theories/page.tsx
│
├── components/                → components/ (keep)
│   ├── Navigation.tsx        → components/navigation.tsx
│   ├── Hero.tsx              → components/hero.tsx
│   ├── Card.tsx              → components/card.tsx
│   ├── Poetry.tsx            → components/poetry.tsx
│   ├── Fiction.tsx           → components/fiction.tsx
│   ├── Essays.tsx            → components/essays.tsx
│   ├── FeaturedContent.tsx   → components/featured-content.tsx
│   ├── SEO.tsx               → (delete - use Next.js metadata)
│   ├── StructuredData.tsx    → components/structured-data.tsx
│   └── ui/                   → components/ui/ (keep Shadcn)
│
├── data/                      → lib/data/ (keep as fallback)
│   ├── cv.ts                 → lib/data/cv.ts (keep)
│   ├── poetry.ts             → (migrate to Strapi)
│   ├── fiction.ts            → (migrate to Strapi)
│   ├── essays.ts             → (migrate to Strapi)
│   ├── papers.ts             → lib/data/papers.ts (keep)
│   ├── theories.ts           → (migrate to Strapi)
│   └── featuredContent.ts    → (dynamic from Strapi)
│
├── services/                  → lib/api/ (rename)
│   ├── contentService.ts     → lib/api/strapi.ts (rewrite)
│   ├── githubApi.ts          → lib/api/github.ts (keep)
│   └── paperService.ts       → lib/api/papers.ts (keep)
│
├── hooks/                     → hooks/ (keep)
│   └── usePageTracking.ts    → (delete - Next.js analytics)
│
├── lib/                       → lib/ (keep)
│   └── utils.ts              → lib/utils.ts (keep)
│
├── types/                     → types/ (keep)
│   └── index.ts              → types/index.ts (expand)
│
└── styles/                    → (merge into globals.css)

NEW Next.js Files to Create:
────────────────────────────────
app/
├── layout.tsx                 (root layout with Navigation)
├── not-found.tsx              (404 page)
├── error.tsx                  (error boundary)
├── loading.tsx                (loading state)
├── api/
│   ├── revalidate/route.ts   (Strapi webhook handler)
│   └── preview/route.ts      (draft preview mode)
└── blog/                      (new blog section)
    ├── page.tsx              (blog list)
    └── [slug]/page.tsx       (blog post detail)

middleware.ts                  (redirects, headers)
next.config.ts                 (configuration)
```

---

## Migration Phases

### Phase 1: Foundation (Week 1, Days 1-2)

**Goal:** Set up Next.js project with minimal functionality

- [ ] Create new Next.js 15 project with App Router
- [ ] Configure TypeScript (tsconfig.json)
- [ ] Set up Tailwind CSS v4
- [ ] Migrate Shadcn UI components
- [ ] Create root layout (app/layout.tsx)
- [ ] Set up environment variables
- [ ] Configure next.config.ts (image domains, etc.)
- [ ] Verify local development works (`next dev`)

**Files to Create:**
```bash
npx create-next-app@latest karstenwade-nextjs --typescript --tailwind --app --no-src-dir
cd karstenwade-nextjs
```

**Dependencies to Install:**
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@radix-ui/react-slot": "^1.2.4",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.4.0",
    "react-markdown": "^10.1.0",
    "remark-gfm": "^4.0.1",
    "rehype-highlight": "^7.0.2",
    "rehype-slug": "^6.0.0",
    "rehype-autolink-headings": "^7.1.0",
    "highlight.js": "^11.11.1"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5.6",
    "tailwindcss": "^4.1.17",
    "postcss": "^8",
    "autoprefixer": "^10",
    "vitest": "^3.0.4",
    "@testing-library/react": "^16.0.1",
    "@testing-library/jest-dom": "^6.6.3",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9",
    "eslint-config-next": "^15.0.0"
  }
}
```

### Phase 2: Page Migration (Week 1, Days 3-5)

**Goal:** Migrate all existing pages to Next.js App Router

**Order of Migration:**
1. Home page (app/page.tsx)
2. CV page (app/cv/page.tsx)
3. Writing page (app/writing/page.tsx)
4. Papers page (app/papers/page.tsx)
5. Paper detail (app/papers/[slug]/page.tsx)
6. Theories page (app/theories/page.tsx)

**For Each Page:**
- [ ] Create page.tsx file in appropriate app directory
- [ ] Move page component code
- [ ] Replace React Helmet with Next.js metadata export
- [ ] Update imports (remove React Router)
- [ ] Add loading.tsx for loading state
- [ ] Test locally

**Example Migration (Home page):**

```typescript
// OLD: src/pages/Home.tsx
import { Helmet } from 'react-helmet-async'
function Home() {
  return (
    <>
      <Helmet>
        <title>Karsten Wade - Home</title>
      </Helmet>
      <main>...</main>
    </>
  )
}

// NEW: app/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Karsten Wade - Collaborative Experience Consulting',
  description: '...',
}

export default function HomePage() {
  return <main>...</main>
}
```

### Phase 3: Component Migration (Week 2, Days 1-2)

**Goal:** Update shared components for Next.js

**Components to Migrate:**
- [ ] Navigation - Update Link from react-router to next/link
- [ ] Hero - No changes needed
- [ ] Card - Update Link components
- [ ] Poetry - Keep mostly as-is
- [ ] Fiction - Keep mostly as-is
- [ ] Essays - Keep mostly as-is
- [ ] FeaturedContent - Update links to Next.js Link
- [ ] StructuredData - Keep JSON-LD generation

**Delete:**
- [ ] SEO component (replaced by Next.js metadata)
- [ ] usePageTracking hook (use Next.js analytics)

**Link Migration Pattern:**
```typescript
// OLD
import { Link } from 'react-router-dom'
<Link to="/cv">CV</Link>

// NEW
import Link from 'next/link'
<Link href="/cv">CV</Link>
```

### Phase 4: Data & Services Migration (Week 2, Days 3-4)

**Goal:** Set up data fetching with Strapi integration

- [ ] Create lib/api/strapi.ts for Strapi client
- [ ] Set up Strapi connection (API URL, token)
- [ ] Migrate contentService to fetch from Strapi
- [ ] Keep githubApi.ts for paper syncing
- [ ] Create TypeScript types for Strapi responses
- [ ] Implement data fetching in page components
- [ ] Add error boundaries for failed fetches

**Strapi Client Example:**
```typescript
// lib/api/strapi.ts
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

export async function getPoems() {
  const res = await fetch(`${STRAPI_URL}/api/poems?populate=*`, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    next: { tags: ['poems'] } // For revalidation
  })
  return res.json()
}

export async function getPoemBySlug(slug: string) {
  const res = await fetch(
    `${STRAPI_URL}/api/poems?filters[slug][$eq]=${slug}&populate=*`,
    {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      next: { tags: ['poems', `poem-${slug}`] }
    }
  )
  return res.json()
}
```

### Phase 5: Image Optimization (Week 2, Day 5)

**Goal:** Replace <img> with next/image

- [ ] Audit all image usage
- [ ] Replace with <Image> component
- [ ] Configure image domains in next.config.ts
- [ ] Add image optimization for Strapi uploads
- [ ] Test responsive images

**Image Migration:**
```typescript
// OLD
<img src="/avatar.jpg" alt="Karsten Wade" />

// NEW
import Image from 'next/image'
<Image
  src="/avatar.jpg"
  alt="Karsten Wade"
  width={200}
  height={200}
  priority
/>
```

### Phase 6: Strapi Webhook & Revalidation (Week 3, Days 1-2)

**Goal:** Set up on-demand revalidation

- [ ] Create API route: app/api/revalidate/route.ts
- [ ] Implement webhook secret verification
- [ ] Map Strapi models to Next.js paths
- [ ] Configure webhooks in Strapi admin
- [ ] Test webhook triggering revalidation
- [ ] Document webhook setup process

### Phase 7: Testing Migration (Week 3, Days 3-4)

**Goal:** Port and update tests

- [ ] Set up Vitest with Next.js
- [ ] Update test imports for Next.js
- [ ] Fix any broken tests (routing, context, etc.)
- [ ] Add new tests for Next.js-specific features
- [ ] Verify all 397+ tests pass
- [ ] Add E2E tests with Playwright (optional)

### Phase 8: Deployment & Verification (Week 3, Day 5)

**Goal:** Deploy to Vercel and verify production

- [ ] Create Vercel project
- [ ] Configure environment variables
- [ ] Set up Strapi production instance
- [ ] Deploy Next.js app to Vercel
- [ ] Configure custom domain (karstenwade.com)
- [ ] Test all pages in production
- [ ] Verify webhooks work in production
- [ ] Test revalidation flow
- [ ] Update DNS if needed
- [ ] Monitor build logs and performance

---

## Gap Analysis

### Incomplete Work from PRD

#### Epic 12: Strapi CMS Integration (Currently Planned)
**Status:** Will be completed during Next.js migration

**Stories:**
- ✅ Story 12.1: Set up Strapi backend → Phase 6
- ✅ Story 12.2: Configure content types → Phase 4
- ✅ Story 12.3: API integration → Phase 4
- ✅ Story 12.4: Migrate content → Phase 4
- ✅ Story 12.5: Media management → Phase 5 (next/image)
- ✅ Story 12.6: Draft/publish workflow → Phase 6 (webhooks)
- ✅ Story 12.7: Blog section → Phase 2
- ✅ Story 12.8: Testing → Phase 7

**Decision:** Integrate fully as part of Next.js migration

#### Story 8.3 & 8.5: Manual Deployment Tasks
**Status:** Drop - GitHub Pages deployment no longer needed

**Items:**
- ❌ Configure custom domain in Vercel → Will do for Next.js
- ❌ Test GitHub Pages deployment → Not applicable
- ❌ Dual deployment verification → Vercel only

**Decision:** Drop GitHub Pages, keep Vercel only

### Complete Work Audit

#### Epic 1-7: Foundation, Design, Pages (Complete)
**Impact:** Medium - Requires migration but no loss of functionality

**What's Safe:**
- ✅ Design system (Tailwind + Shadcn) - portable to Next.js
- ✅ Component architecture - minimal changes needed
- ✅ Content structure - keep data files as fallback

**What Needs Migration:**
- 🔄 Routing: React Router → Next.js file-based
- 🔄 SEO: React Helmet → Next.js Metadata API
- 🔄 Build: Vite → Next.js

#### Epic 9: SEO & Structured Data (Complete)
**Impact:** Low - Next.js has better built-in SEO

**Migration:**
- 🔄 Sitemap generation → next-sitemap package
- 🔄 Robots.txt → public/robots.txt
- ✅ Structured data (JSON-LD) → Keep StructuredData component

#### Epic 10: Paper Syncing (Complete)
**Impact:** None - githubApi.ts works as-is

**Decision:** Keep paper GitHub sync unchanged

#### Epic 11 & 11.5: Poetry/Essays/Content (Complete)
**Impact:** High - Content will migrate to Strapi

**Migration Path:**
1. Keep .ts files as backup
2. Import data into Strapi
3. Verify Strapi content matches
4. Switch to Strapi API
5. Keep .ts files for 1 month as safety net
6. Delete after confirmation

#### Epic 13: Tailwind v4 + Shadcn (Complete)
**Impact:** None - Works with Next.js

**Decision:** Keep exactly as-is

### Dangling Items & Technical Debt

#### Items to Drop
- ❌ React Router DOM → Next.js routing
- ❌ React Helmet Async → Next.js metadata
- ❌ Vite config → Next.js config
- ❌ GitHub Pages deployment → Vercel only
- ❌ usePageTracking hook → Next.js analytics
- ❌ Dual deployment complexity
- ❌ Manual sitemap generation → next-sitemap

#### Items to Keep
- ✅ All Shadcn UI components
- ✅ Tailwind CSS configuration
- ✅ Content data structure (cv.ts, etc.)
- ✅ GitHub API service (paper sync)
- ✅ All page components (with modifications)
- ✅ TypeScript types
- ✅ Test suite (with updates)
- ✅ ESLint configuration

#### Items to Migrate/Transform
- 🔄 Pages → app directory pages
- 🔄 SEO component → metadata exports
- 🔄 Links → next/link
- 🔄 Images → next/image
- 🔄 Content service → Strapi API client
- 🔄 Build scripts → Next.js scripts

---

## Risk Assessment & Mitigation

### High Risks

**Risk 1: Test Suite Breakage**
- **Impact:** High - 397 tests could fail
- **Mitigation:**
  - Keep Vitest (Next.js supports it)
  - Migrate tests incrementally with pages
  - Add Next.js-specific test utilities
  - Budget extra time for test fixes

**Risk 2: Strapi Learning Curve**
- **Impact:** Medium - New technology for team
- **Mitigation:**
  - Set up Strapi early (Phase 1)
  - Use Strapi templates/starters
  - Keep .ts data files as fallback
  - Document Strapi patterns

**Risk 3: Content Migration Data Loss**
- **Impact:** High - Could lose content
- **Mitigation:**
  - Keep all .ts files as backup
  - Export Strapi data regularly
  - Verify migrated content matches source
  - Don't delete .ts files for 30 days

**Risk 4: Vercel Build Costs**
- **Impact:** Low-Medium - Could exceed free tier
- **Mitigation:**
  - Use on-demand revalidation (free)
  - Avoid time-based ISR
  - Test locally before deploying
  - Monitor Vercel dashboard

### Medium Risks

**Risk 5: SEO Regression During Migration**
- **Impact:** Medium - Search rankings could drop
- **Mitigation:**
  - Keep URLs identical
  - Preserve metadata structure
  - Test with Google Search Console
  - Deploy during low-traffic time

**Risk 6: Image Optimization Complexity**
- **Impact:** Low - next/image can be finicky
- **Mitigation:**
  - Configure domains early
  - Use progressive migration
  - Test responsive images thoroughly

---

## Pre-Migration Checklist

Before starting Phase 1:

### Code Preparation
- [ ] Commit all pending changes to main
- [ ] Ensure all tests pass (397/397)
- [ ] Tag current version: `git tag v1.0-vite`
- [ ] Create backup branch: `git branch backup/pre-nextjs`
- [ ] Document current deployment URLs

### Environment Setup
- [ ] Verify Node.js version (18+)
- [ ] Install Next.js CLI: `npm i -g create-next-app`
- [ ] Set up local Strapi instance (or cloud)
- [ ] Gather all environment variables
- [ ] Create .env.example for Next.js project

### Content Backup
- [ ] Export all content from .ts files to JSON
- [ ] Screenshot all pages in current site
- [ ] Save sitemap.xml
- [ ] Document all current URLs
- [ ] List all external integrations

### Infrastructure
- [ ] Verify Vercel account access
- [ ] Plan Strapi hosting (Vercel, Railway, or self-hosted?)
- [ ] Review Vercel free tier limits
- [ ] Set up monitoring/alerting

---

## Post-Migration Checklist

After Phase 8 completion:

### Verification
- [ ] All pages render correctly
- [ ] All tests pass (397+)
- [ ] SEO metadata present on all pages
- [ ] Images optimized and loading
- [ ] Strapi webhooks working
- [ ] No console errors in browser
- [ ] Mobile responsive design intact
- [ ] Accessibility scores maintained

### Performance
- [ ] Run Lighthouse audit (target: 90+ all categories)
- [ ] Verify Core Web Vitals
- [ ] Check bundle size vs. Vite
- [ ] Test build time
- [ ] Monitor Vercel analytics

### Content
- [ ] All poems migrated to Strapi
- [ ] All essays migrated to Strapi
- [ ] All theories migrated to Strapi
- [ ] CV content intact
- [ ] Papers still syncing from GitHub
- [ ] Featured content working

### Cleanup
- [ ] Remove Vite project from Vercel (optional)
- [ ] Update GitHub repo README
- [ ] Archive old Vite code (don't delete yet)
- [ ] Remove GitHub Pages workflow
- [ ] Update documentation
- [ ] Notify stakeholders of migration

---

## Success Criteria

Migration is considered successful when:

1. ✅ All pages accessible at karstenwade.com
2. ✅ All 397+ tests passing
3. ✅ Lighthouse scores ≥90 (Performance, Accessibility, Best Practices, SEO)
4. ✅ Strapi webhooks triggering revalidation
5. ✅ Images optimized via next/image
6. ✅ Blog functionality working (new feature)
7. ✅ Zero console errors in production
8. ✅ Vercel builds completing in <5 minutes
9. ✅ Content updates reflecting within 1 minute
10. ✅ Mobile responsive on all devices

---

## Rollback Plan

If migration fails critically:

1. **Immediate:** Revert Vercel deployment to previous Vite build
2. **Short-term:** Point domain back to Vite version
3. **Analysis:** Review failure logs, identify issue
4. **Decision:** Fix forward or postpone migration
5. **Communication:** Update stakeholders on status

**Rollback Trigger Conditions:**
- Site down >1 hour
- Critical SEO metadata missing
- Data loss detected
- Tests failing >50%
- Vercel costs exceeding budget

---

## Open Questions

Before proceeding, clarify:

1. **Strapi Hosting:** Where will Strapi run? (Vercel, Railway, AWS, self-hosted?)
2. **Blog Priority:** Is blog section needed in Phase 1, or can it wait?
3. **Analytics:** Which analytics service? (Vercel Analytics, Google Analytics, other?)
4. **Domain Transfer:** Is domain currently at Vercel or needs transfer?
5. **Budget:** Any hard limits on Vercel/Strapi hosting costs?

---

## Next Steps

1. **Review this plan** - Approve architecture and approach
2. **Answer open questions** - Make decisions on unknowns
3. **Set timeline** - Confirm 2-3 week estimate works
4. **Provision Strapi** - Set up Strapi instance (cloud or local)
5. **Begin Phase 1** - Create Next.js project and foundation

**Ready to proceed?** Let me know and I'll start Phase 1!
