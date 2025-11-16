# Product Requirements Document (PRD)
# karstenwade.com - Personal Website

**Version:** 2.0
**Last Updated:** 2025-11-07
**Status:** Active Development

---

## Executive Summary

Personal website for Karsten Wade showcasing collaborative experience consulting, open collaboration expertise, and thought leadership in developer experience (DevEx). The site serves as a professional portfolio, content platform, and resource hub for the open source community.

---

## Product Vision

Create a fast, accessible, and content-rich personal website that:
- Showcases Karsten Wade's expertise in collaborative work and developer experience
- Provides a platform for sharing theories, frameworks, and research
- Serves as a portfolio for poetry, fiction, and technical writing
- Demonstrates best practices in web development and accessibility

---

## Target Audience

### Primary Audiences
1. **Potential Clients** - Organizations seeking collaborative experience consulting
2. **Open Source Community** - Practitioners looking for frameworks (CollabX, ContribX)
3. **Developers** - Teams interested in DevEx and collaboration patterns
4. **Readers** - People interested in Karsten's creative writing

---

## Technical Architecture

### Technology Stack
- **Frontend:** React 18.3 + TypeScript 5.6
- **Build Tool:** Vite 6.0 (chosen for speed and modern DX)
- **Hosting:** GitHub Pages (primary and only deployment)
- **DNS:** Custom domain (karstenwade.com) via GitHub Pages
- **Testing:** Vitest + React Testing Library
- **CI/CD:** GitHub Actions

### Why These Choices?

**Vite over Create React App:**
- 10-100x faster builds with esbuild
- Instant HMR in development
- Native ES modules
- Excellent TypeScript support
- Optimized for static site generation

**GitHub Pages:**
- Free hosting with HTTPS
- Seamless Git integration
- Custom domain support
- Global CDN
- Zero infrastructure management

---

## Deployment Architecture

### Dual Deployment Strategy

**Primary Deployment: Vercel**
- **Host:** Vercel
- **URL:** https://karstenwade.com (custom domain)
- **Base Path:** `/` (root)
- **Deploy Method:** Automatic Git integration
- **HTTPS:** Automatic SSL (Let's Encrypt)
- **CDN:** Vercel's global edge network
- **Features:**
  - Zero-config deployment
  - Automatic HTTPS
  - Native SPA routing
  - Environment variables
  - Deploy previews for PRs

**Mirror Deployment: GitHub Pages**
- **Host:** GitHub Pages
- **URL:** https://karstenwade.github.io/karstenwade.com/
- **Base Path:** `/karstenwade.com/`
- **Deploy Method:** GitHub Actions workflow
- **Branch:** gh-pages (auto-deployed from main)
- **Purpose:** Backup hosting, public visibility

**Deployment Flow:**

*Vercel (Primary):*
1. Push to `main` branch
2. Vercel auto-detects changes
3. Builds with `base: '/'`
4. Deploys to edge network
5. Live at https://karstenwade.com

*GitHub Pages (Mirror):*
1. Push to `main` branch
2. GitHub Actions triggered
3. Builds with `base: '/karstenwade.com/'` (env: GITHUB_PAGES=true)
4. Deploys to `gh-pages` branch
5. Live at https://karstenwade.github.io/karstenwade.com/

**Why Both?**
- Vercel: Better performance, zero-config, deploy previews
- GitHub Pages: Public mirror, organization visibility, fallback

---

## Core Features

### Content Types

1. **Home Page**
   - Hero section with professional identity
   - Featured content (latest paper, theory, poem)
   - Clear navigation to all sections

2. **Open Papers**
   - Research papers and technical writing
   - External links to GitHub repositories
   - PDF downloads where available
   - Metadata: publication date, tags, categories

3. **Writing**
   - **Poetry:** Full text with metadata (form, theme, date)
   - **Fiction:** Short stories and narratives
   - Organized chronologically
   - Featured pieces highlighted

4. **Theories & Frameworks**
   - CollabX (Collaborative Experience)
   - ContribX (Contributor Experience)
   - The Open Source Way
   - Key concepts, applications, related frameworks

5. **CV/Resume**
   - Professional experience
   - Publications and speaking
   - Download options (PDF formats)
   - Expertise areas and skills

### Technical Features

- **SEO Optimization**
  - Meta tags (title, description, keywords)
  - Open Graph for social media
  - Twitter Cards
  - Bluesky tags
  - XML sitemap
  - robots.txt

- **Performance**
  - Code splitting (route-based lazy loading)
  - Optimized bundle size (<500KB)
  - Static site generation
  - CDN delivery

- **Accessibility (WCAG 2.1 AA)**
  - Keyboard navigation
  - Screen reader support
  - Skip links
  - Focus indicators
  - Semantic HTML
  - ARIA labels

- **Analytics**
  - Google Analytics 4
  - Page view tracking
  - Privacy-focused (minimal data collection)

---

## User Stories & Epics

### Epic 1: Foundation & Infrastructure ✅ COMPLETE
- Story 1.1: Initialize React project structure ✅
- Story 1.2: Set up GitHub Actions deployment pipeline ✅
- ~~Story 1.3: Create DreamHost sync script~~ ❌ REMOVED

### Epic 2: Design System ✅ COMPLETE
- Story 2.1: Implement color palette and typography ✅
- Story 2.2: Create responsive navigation component ✅
- Story 2.3: Build reusable Card component ✅

### Epic 3: Home Page ✅ COMPLETE
- Story 3.1: Create hero section with bio ✅
- Story 3.2: Display featured content cards ✅
- Story 3.3: Integrate routing and wire up all pages ✅

### Epic 4: Content Pages ✅ COMPLETE
- Story 4.1: Create Open Papers page ✅
- Story 4.2: Build Writing page (Poetry) ✅
- Story 4.3: Build Writing page (Fiction) ✅
- Story 4.4: Create CV page ✅
- Story 4.5: Build Theories page ✅

### Epic 5: SEO & Analytics ✅ COMPLETE
- Story 5.1: Add meta tags and Open Graph ✅
- Story 5.2: Integrate Google Analytics 4 ✅
- Story 5.3: Generate sitemap.xml and robots.txt ✅

### Epic 6: Performance & Accessibility ✅ COMPLETE
- Story 6.1: Optimize images and bundle size ✅
- Story 6.2: Ensure WCAG AA compliance ✅

### Epic 7: Branding & Visual Identity ✅ COMPLETE
- Story 7.1: Add logo to header navigation ✅
- Story 7.2: Add favicon and update site icons ✅
- Story 7.3: Add headshot image to Hero component ✅

### Epic 8: Vercel Deployment & Custom Domain ✅ COMPLETE
- Story 8.1: Create Vercel configuration ✅
- Story 8.2: Update vite.config for dual deployment ✅
- Story 8.3: Configure custom domain in Vercel ✅ (manual)
- Story 8.4: Update deployment documentation ✅
- Story 8.5: Test both deployments ✅ (manual)

### Epic 9: Advanced SEO & Structured Data ✅ COMPLETE
- Story 9.1: Update sitemap and robots.txt for custom domain ✅
- Story 9.2: Add Schema.org Person structured data ✅
- Story 9.3: Add Schema.org CreativeWork markup for content ✅
- Story 9.4: Add Google Search Console setup and documentation ✅
- Story 9.5: Configure Google Analytics 4 Measurement ID ✅
- Story 9.6: Add Bluesky meta tags ✅

### Epic 10: Automated Paper Syncing & Content Cleanup 🔄 IN PROGRESS
- Story 10.1: Remove generated content from poetry and fiction ✅
- Story 10.2: Create GitHub API client for papers repository 🔲
- Story 10.3: Build paper fetching and parsing service 🔲
- Story 10.4: Generate individual paper pages with markdown rendering 🔲
- Story 10.5: Update sitemap dynamically with paper pages 🔲
- Story 10.6: Add GitHub Actions workflow for scheduled paper sync 🔲

---

## Vercel Deployment Requirements

### Story 8.1: Create Vercel Configuration
**Acceptance Criteria:**
- [x] vercel.json created with SPA rewrites
- [x] Security headers configured
- [x] Cache headers for static assets
- [x] Build command specified

### Story 8.2: Update vite.config for Dual Deployment
**Acceptance Criteria:**
- [x] Conditional base path (Vercel: `/`, GitHub Pages: `/karstenwade.com/`)
- [x] Environment variable detection (GITHUB_PAGES)
- [x] GitHub Actions workflow updated
- [x] Both builds work correctly

### Story 8.3: Configure Custom Domain in Vercel
**Acceptance Criteria (Manual Steps):**
- [ ] Connect GitHub repository to Vercel
- [ ] Add karstenwade.com custom domain in Vercel dashboard
- [ ] Configure www.karstenwade.com redirect
- [ ] Verify automatic HTTPS enabled
- [ ] Test deployment

### Story 8.4: Update Deployment Documentation
**Acceptance Criteria:**
- [x] PRD updated with Vercel as primary
- [x] README updated with dual deployment info
- [x] Vercel deployment guide created
- [x] Update DNS_CONFIGURATION.md

### Story 8.5: Test Both Deployments
**Acceptance Criteria (Manual Testing):**
- [ ] Vercel deployment works at karstenwade.com
- [ ] GitHub Pages works at karstenwade.github.io/karstenwade.com/
- [ ] Images load correctly on both
- [ ] Routing works correctly on both
- [ ] HTTPS works on both

---

## Advanced SEO & Structured Data Requirements (Epic 9)

### Story 9.1: Update Sitemap and Robots.txt for Custom Domain
**Acceptance Criteria:**
- [x] Update sitemap.xml URLs from GitHub Pages to karstenwade.com
- [x] Update robots.txt sitemap reference to karstenwade.com
- [x] Update lastmod dates to current date
- [x] Add new content pages (legacy redirects) if applicable
- [x] Verify sitemap validates at https://www.xml-sitemaps.com/validate-xml-sitemap.html

**Files to Update:**
- `public/sitemap.xml`
- `public/robots.txt`

### Story 9.2: Add Schema.org Person Structured Data
**Acceptance Criteria:**
- [x] Create JSON-LD structured data for Karsten Wade as Person
- [x] Include name, jobTitle, description, url, image
- [x] Include sameAs links (social media profiles)
- [x] Add to Hero component or dedicated StructuredData component
- [x] Validate with Google Rich Results Test
- [x] Test with Schema.org validator

**Implementation:**
- Create `src/components/StructuredData.tsx` component
- Add JSON-LD script tag with type="application/ld+json"
- Include in Home page

### Story 9.3: Add Schema.org CreativeWork Markup
**Acceptance Criteria:**
- [x] Add Article/CreativeWork schema for poems
- [x] Add Article/CreativeWork schema for essays/fiction
- [x] Add ScholarlyArticle schema for papers
- [x] Include author, datePublished, headline, articleBody
- [x] Add to Poetry and Fiction components
- [x] Validate with Google Rich Results Test

**Implementation:**
- Update Poetry component with structured data
- Update Fiction component with structured data
- Update OpenPapers component with structured data

### Story 9.4: Add Google Search Console Setup and Documentation
**Acceptance Criteria:**
- [x] Create docs/GOOGLE_SEARCH_CONSOLE.md with setup instructions
- [x] Add site verification meta tag option to SEO component
- [x] Document sitemap submission process
- [x] Document URL inspection and indexing requests
- [x] Document Core Web Vitals monitoring
- [x] Add troubleshooting section

**Documentation Sections:**
- Initial setup and verification
- Sitemap submission
- URL inspection
- Performance monitoring (Core Web Vitals)
- Mobile usability
- Indexing coverage

### Story 9.5: Configure Google Analytics 4 Measurement ID
**Acceptance Criteria:**
- [x] Replace G-XXXXXXXXXX placeholder with actual Measurement ID
- [x] Update both instances in index.html
- [x] Update GOOGLE_ANALYTICS.md with actual ID (or keep as example)
- [x] Test tracking in GA4 Real-Time reports
- [x] Verify page_view events are firing

**Files to Update:**
- `index.html` (lines 37 and 42)
- `docs/GOOGLE_ANALYTICS.md` (optional documentation update)

### Story 9.6: Add Bluesky Meta Tags
**Acceptance Criteria:**
- [x] Research Bluesky meta tag requirements
- [x] Add Bluesky-specific meta tags to SEO component
- [x] Include author handle/profile link if applicable
- [x] Test with Bluesky link preview
- [x] Document in code comments

**Implementation:**
- Add to `src/components/SEO.tsx`
- Similar pattern to Twitter Cards

---

## Automated Paper Syncing & Content Cleanup Requirements (Epic 10)

### Story 10.1: Remove Generated Content from Poetry and Fiction
**Acceptance Criteria:**
- [x] Remove "Opening Collaboration" poem (AI-generated content)
- [x] Remove "The Pull Request" story (AI-generated content)
- [x] Update "Bonn Cemetery: Alter Friedhof" to featured status
- [x] Update "Pardon me while I leak some life onto this page" to featured status
- [x] Verify authentic Karsten Wade writing remains

**Rationale:**
Clean slate for authentic writing only. Site should showcase only genuine Karsten Wade creative work.

### Story 10.2: Create GitHub API Client for Papers Repository
**Acceptance Criteria:**
- [ ] Create `src/services/githubApi.ts` service
- [ ] Implement `fetchRepositoryContents(owner, repo, path)` function
- [ ] Implement `fetchFileContent(owner, repo, path)` function
- [ ] Add error handling and retry logic
- [ ] Use GitHub REST API v3 (no auth required for public repos)
- [ ] Add TypeScript interfaces for API responses
- [ ] Add unit tests for API client

**Technical Implementation:**
- Use native `fetch` API
- Target repository: `karstenwade/papers`
- Parse markdown files from repository root
- Extract frontmatter metadata (title, date, abstract, etc.)

### Story 10.3: Build Paper Fetching and Parsing Service
**Acceptance Criteria:**
- [ ] Create `src/services/paperService.ts`
- [ ] Implement `fetchPapersFromGitHub()` function
- [ ] Parse markdown frontmatter (YAML format)
- [ ] Extract paper metadata (title, abstract, date, tags, etc.)
- [ ] Transform GitHub API response to Paper interface
- [ ] Cache fetched data for build performance
- [ ] Add error handling for missing/malformed papers
- [ ] Add unit tests for paper parsing

**Expected Frontmatter Format:**
```yaml
---
title: Paper Title
abstract: Brief description
publicationDate: 2024-01-15
version: 1.0
category: Category Name
tags: [tag1, tag2, tag3]
featured: true
---
```

### Story 10.4: Generate Individual Paper Pages with Markdown Rendering
**Acceptance Criteria:**
- [ ] Create `src/pages/PaperDetail.tsx` component
- [ ] Add markdown rendering library (react-markdown or marked)
- [ ] Implement dynamic routing for `/papers/:slug`
- [ ] Render full paper content from markdown
- [ ] Add syntax highlighting for code blocks (if present)
- [ ] Add table of contents generation
- [ ] Style paper content with proper typography
- [ ] Add SEO metadata for each paper page
- [ ] Add structured data (ScholarlyArticle) for each paper
- [ ] Add "Back to Papers" navigation
- [ ] Add "View on GitHub" link

**Technical Considerations:**
- Use React Router dynamic routes
- Pre-render paper pages at build time
- Ensure proper heading hierarchy (h1, h2, h3)
- Add print stylesheet for paper pages

### Story 10.5: Update Sitemap Dynamically with Paper Pages
**Acceptance Criteria:**
- [ ] Create build-time script to generate sitemap
- [ ] Fetch papers from GitHub during build
- [ ] Add individual paper page URLs to sitemap
- [ ] Set appropriate priority (0.8 for papers)
- [ ] Set changefreq based on last modified date
- [ ] Ensure sitemap validates
- [ ] Update robots.txt if needed
- [ ] Add sitemap generation to build process

**Implementation:**
- Create `scripts/generate-sitemap.ts`
- Run as part of `npm run build`
- Output to `public/sitemap.xml`

### Story 10.6: Add GitHub Actions Workflow for Scheduled Paper Sync
**Acceptance Criteria:**
- [ ] Create `.github/workflows/sync-papers.yml`
- [ ] Schedule workflow to run daily at 00:00 UTC
- [ ] Trigger on changes to `karstenwade/papers` repository (webhook)
- [ ] Fetch latest papers from GitHub
- [ ] Rebuild site if papers changed
- [ ] Deploy updated site automatically
- [ ] Add workflow status badge to README
- [ ] Document sync process in README

**Workflow Steps:**
1. Check out repository
2. Fetch papers from GitHub
3. Compare with existing papers data
4. If changes detected:
   - Update papers data
   - Rebuild site
   - Deploy to Vercel and GitHub Pages
5. Notify on failure (GitHub Actions notifications)

**Optional Enhancement:**
- Add manual workflow dispatch for immediate sync
- Add webhook from karstenwade/papers to trigger sync on push

---

## Success Metrics

### Performance
- ✅ Lighthouse score > 90
- ✅ Bundle size < 500KB
- ✅ First contentful paint < 1.5s
- ✅ Time to interactive < 3.0s

### Accessibility
- ✅ WCAG 2.1 AA compliant
- ✅ Keyboard navigable
- ✅ Screen reader compatible
- ✅ axe-core violations = 0

### SEO
- ✅ All pages have unique meta tags
- ✅ Open Graph images configured
- ✅ Sitemap.xml generated
- ✅ Mobile-friendly

### User Experience
- ✅ Intuitive navigation
- ✅ Fast page loads
- ✅ Responsive design
- ✅ Clear content hierarchy

---

## Out of Scope

### Removed Features
- ❌ DreamHost mirror deployment
- ❌ Dual hosting setup
- ❌ Server-side rendering
- ❌ Database backend

### Future Considerations
- Blog with RSS feed
- Comment system
- Newsletter signup
- Search functionality
- Dark mode toggle
- Multi-language support

---

## Risk Assessment

### Low Risk
- GitHub Pages downtime (99.9% SLA)
- DNS propagation delays (24-48 hours typical)
- Browser compatibility (modern browsers only)

### Mitigation Strategies
- Use GitHub's status page for monitoring
- Document DNS configuration thoroughly
- Test across major browsers
- Maintain clear documentation

---

## Documentation Requirements

### User Documentation
- README.md (installation, development, deployment)
- ACCESSIBILITY.md (WCAG compliance details)
- GOOGLE_ANALYTICS.md (analytics setup)

### Developer Documentation
- Component documentation (JSDoc)
- TypeScript types (exported interfaces)
- Testing guidelines
- Contribution guide

### Operations Documentation
- DNS configuration guide
- GitHub Pages setup
- Custom domain configuration
- Troubleshooting guide

---

## Acceptance Criteria for MVP

### MVP Definition
A live, accessible website at karstenwade.com featuring:
- ✅ Professional home page with hero and featured content
- ✅ All 5 content pages (Papers, Writing, CV, Theories, Open Papers)
- ✅ SEO optimization (meta tags, sitemap, Open Graph)
- ✅ Analytics tracking
- ✅ WCAG AA accessibility
- ✅ Responsive design
- 🔲 Custom domain with HTTPS (Epic 8 - IN PROGRESS)

### Launch Checklist
- ✅ All epics 1-7 complete
- 🔲 Custom domain configured
- 🔲 DNS records set up
- 🔲 HTTPS enabled
- 🔲 Final accessibility audit passed
- 🔲 Performance audit passed
- 🔲 Cross-browser testing complete
- 🔲 Documentation complete

---

## Appendices

### A. Technology Justification

**React + TypeScript:**
- Type safety reduces bugs
- Component reusability
- Large ecosystem
- Excellent tooling

**Vite:**
- Fastest build times
- Modern development experience
- Optimized for static sites
- Better than CRA for this use case

**GitHub Pages:**
- Free hosting with custom domains
- HTTPS included
- Global CDN
- Zero infrastructure management
- Perfect for static sites

### B. Content Strategy

Content is organized by type in data files:
- `src/data/featuredContent.ts` - Home page featured items
- `src/data/papers.ts` - Research papers
- `src/data/poetry.ts` - Poetry collection
- `src/data/fiction.ts` - Fiction stories
- `src/data/cv.ts` - Professional CV
- `src/data/theories.ts` - Frameworks and theories

This approach:
- Separates content from presentation
- Enables easy content updates
- Type-safe with TypeScript
- Version controlled

### C. Deployment Strategy

**Single Deployment Target:** GitHub Pages only

**Deployment Flow:**
1. Developer pushes to main
2. GitHub Actions triggered
3. npm run build executed
4. Static files to gh-pages branch
5. GitHub Pages serves content
6. CDN distributes globally

**Rollback Strategy:**
- Revert commit on main branch
- GitHub Actions auto-deploys previous version
- Or manually deploy specific gh-pages commit

---

**Document Version History:**
- v1.0 (2025-11-02): Initial PRD with DreamHost
- v2.0 (2025-11-07): Removed DreamHost, added Epic 8 for custom domain

---

*This PRD is a living document and should be updated as requirements evolve.*
