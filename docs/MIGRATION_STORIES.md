# Next.js Migration Stories
**Small Story Breakdown (<3 points each)**

**Status:** Planning
**Budget:** $0/month (free tiers only)

---

## Story Point Scale

- **1 point:** 1-2 hours, low complexity, minimal risk
- **2 points:** 2-4 hours, medium complexity, some risk
- **3 points:** 4-8 hours, higher complexity, notable risk

**Rule:** No story >3 points. Break larger work into smaller stories.

---

## Phase 1: Next.js Foundation (Week 1)

### Story 1.1: Create Next.js Project [1 point]
**Goal:** Bootstrap new Next.js 15 project

**Tasks:**
- [ ] Run `create-next-app@latest` with TypeScript + Tailwind
- [ ] Verify project starts with `npm run dev`
- [ ] Create initial Git commit
- [ ] Document project structure

**Acceptance Criteria:**
- Next.js 15 project running on http://localhost:3000
- TypeScript configured
- Tailwind CSS working
- Git repository initialized

**Time:** 1-2 hours
**Risk:** Low

---

### Story 1.2: Configure TypeScript & ESLint [1 point]
**Goal:** Port TypeScript config from Vite project

**Tasks:**
- [ ] Copy tsconfig.json settings
- [ ] Configure path aliases (@/components, @/lib, etc.)
- [ ] Set up ESLint for Next.js
- [ ] Verify no TypeScript errors

**Acceptance Criteria:**
- TypeScript strict mode enabled
- Path aliases working
- ESLint running without errors
- `npm run type-check` passes

**Time:** 1-2 hours
**Risk:** Low

---

### Story 1.3: Set Up Tailwind CSS v4 [2 points]
**Goal:** Configure Tailwind exactly as current project

**Tasks:**
- [ ] Install Tailwind CSS v4
- [ ] Copy tailwind.config from Vite project
- [ ] Copy globals.css
- [ ] Verify Tailwind classes work
- [ ] Test dark mode (if configured)

**Acceptance Criteria:**
- Tailwind v4 working
- Custom theme tokens available
- Dark mode working (if applicable)
- CSS builds without errors

**Time:** 2-3 hours
**Risk:** Low

---

### Story 1.4: Install Shadcn UI Components [2 points]
**Goal:** Set up Shadcn UI and migrate existing components

**Tasks:**
- [ ] Run `npx shadcn@latest init`
- [ ] Copy components/ui/ from Vite project
- [ ] Copy lib/utils.ts
- [ ] Test button component renders
- [ ] Verify all Radix dependencies installed

**Acceptance Criteria:**
- Shadcn UI initialized
- All ui components from Vite project work
- `cn()` utility function working
- No missing dependencies

**Time:** 2-4 hours
**Risk:** Low

---

### Story 1.5: Create Root Layout [1 point]
**Goal:** Set up app/layout.tsx with Navigation

**Tasks:**
- [ ] Create app/layout.tsx
- [ ] Add HTML lang="en"
- [ ] Add metadata (title, description)
- [ ] Import globals.css
- [ ] Test layout renders

**Acceptance Criteria:**
- Root layout exists
- Metadata tags present in HTML
- Tailwind styles loading
- Clean HTML structure

**Time:** 1-2 hours
**Risk:** Low

---

### Story 1.6: Migrate Navigation Component [2 points]
**Goal:** Port Navigation component to Next.js

**Tasks:**
- [ ] Copy Navigation.tsx to components/
- [ ] Replace React Router Link with next/link
- [ ] Update href props (to → href)
- [ ] Test navigation renders
- [ ] Verify mobile menu works

**Acceptance Criteria:**
- Navigation component renders
- All links use next/link
- No React Router dependencies
- Mobile hamburger menu works

**Time:** 2-3 hours
**Risk:** Low

---

## Phase 2: Page Migration (Week 1)

### Story 2.1: Migrate Home Page [2 points]
**Goal:** Convert pages/Home.tsx → app/page.tsx

**Tasks:**
- [ ] Create app/page.tsx
- [ ] Copy Home component code
- [ ] Replace Helmet with metadata export
- [ ] Remove React Router imports
- [ ] Test page renders locally

**Acceptance Criteria:**
- Home page loads at /
- Metadata tags present
- No console errors
- Styling intact

**Time:** 2-3 hours
**Risk:** Low

---

### Story 2.2: Migrate Hero Component [1 point]
**Goal:** Port Hero component (used on Home)

**Tasks:**
- [ ] Copy Hero.tsx to components/
- [ ] Remove any Router dependencies
- [ ] Test renders on Home page
- [ ] Verify styling

**Acceptance Criteria:**
- Hero component works
- No import errors
- Styling matches Vite version

**Time:** 1 hour
**Risk:** Low

---

### Story 2.3: Migrate FeaturedContent Component [2 points]
**Goal:** Port FeaturedContent with data

**Tasks:**
- [ ] Copy FeaturedContent.tsx
- [ ] Copy data/featuredContent.ts to lib/data/
- [ ] Update Link imports to next/link
- [ ] Test featured cards render

**Acceptance Criteria:**
- Featured content displays
- Links work with next/link
- Data loading correctly

**Time:** 2-3 hours
**Risk:** Low

---

### Story 2.4: Migrate CV Page [2 points]
**Goal:** Convert pages/CV.tsx → app/cv/page.tsx

**Tasks:**
- [ ] Create app/cv/page.tsx
- [ ] Copy CV component code
- [ ] Copy data/cv.ts to lib/data/
- [ ] Replace Helmet with metadata export
- [ ] Copy CV.css to appropriate location
- [ ] Test page renders

**Acceptance Criteria:**
- CV page loads at /cv
- Download CTA works
- Metadata present
- Styling intact

**Time:** 2-4 hours
**Risk:** Low

---

### Story 2.5: Migrate Writing Page [2 points]
**Goal:** Convert pages/Writing.tsx → app/writing/page.tsx

**Tasks:**
- [ ] Create app/writing/page.tsx
- [ ] Copy Writing component code
- [ ] Copy Writing.css
- [ ] Replace Helmet with metadata
- [ ] Test Poetry and Fiction tabs work

**Acceptance Criteria:**
- Writing page loads at /writing
- Tab switching works
- Metadata present
- CSS working

**Time:** 2-4 hours
**Risk:** Low

---

### Story 2.6: Migrate Poetry Component [2 points]
**Goal:** Port Poetry component with data

**Tasks:**
- [ ] Copy Poetry.tsx to components/
- [ ] Copy data/poetry.ts to lib/data/
- [ ] Copy Poetry.css
- [ ] Test expand/collapse works
- [ ] Verify metadata displays

**Acceptance Criteria:**
- Poetry renders on Writing page
- Expand/collapse functional
- All poem data loads
- Styling intact

**Time:** 2-3 hours
**Risk:** Low

---

### Story 2.7: Migrate Fiction Component [1 point]
**Goal:** Port Fiction component (empty state)

**Tasks:**
- [ ] Copy Fiction.tsx to components/
- [ ] Copy data/fiction.ts to lib/data/
- [ ] Copy Fiction.css
- [ ] Test empty state message

**Acceptance Criteria:**
- Fiction component renders
- "More to come" message shows
- Styling correct

**Time:** 1 hour
**Risk:** Low

---

### Story 2.8: Migrate Papers Page [2 points]
**Goal:** Convert pages/OpenPapers.tsx → app/papers/page.tsx

**Tasks:**
- [ ] Create app/papers/page.tsx
- [ ] Copy OpenPapers component
- [ ] Copy data/papers.ts to lib/data/
- [ ] Copy OpenPapers.css
- [ ] Test papers list renders

**Acceptance Criteria:**
- Papers page loads at /papers
- External links work
- Metadata present
- Styling intact

**Time:** 2-3 hours
**Risk:** Low

---

### Story 2.9: Migrate PaperDetail Page [3 points]
**Goal:** Convert PaperDetail to dynamic route

**Tasks:**
- [ ] Create app/papers/[slug]/page.tsx
- [ ] Implement generateStaticParams()
- [ ] Copy PaperDetail component logic
- [ ] Copy services/paperService.ts to lib/api/
- [ ] Copy services/githubApi.ts to lib/api/
- [ ] Test dynamic routing works
- [ ] Test markdown rendering

**Acceptance Criteria:**
- Paper detail pages generate at build
- Markdown renders correctly
- Syntax highlighting works
- 404 for invalid slugs

**Time:** 4-6 hours
**Risk:** Medium (dynamic routing)

---

### Story 2.10: Migrate Theories Page [2 points]
**Goal:** Convert pages/Theories.tsx → app/theories/page.tsx

**Tasks:**
- [ ] Create app/theories/page.tsx
- [ ] Copy Theories component
- [ ] Copy data/theories.ts to lib/data/
- [ ] Copy Theories.css
- [ ] Test page renders

**Acceptance Criteria:**
- Theories page loads at /theories
- Content displays
- Metadata present
- Styling intact

**Time:** 2-3 hours
**Risk:** Low

---

## Phase 3: Supporting Components (Week 2)

### Story 3.1: Migrate Card Component [1 point]
**Goal:** Port reusable Card component

**Tasks:**
- [ ] Copy Card.tsx to components/
- [ ] Update Link to next/link
- [ ] Copy Card.css
- [ ] Test on multiple pages

**Acceptance Criteria:**
- Card component works everywhere
- Links functional
- Styling correct

**Time:** 1 hour
**Risk:** Low

---

### Story 3.2: Migrate Essays Component [1 point]
**Goal:** Port Essays component (for Writing page)

**Tasks:**
- [ ] Copy Essays.tsx to components/
- [ ] Copy data/essays.ts to lib/data/
- [ ] Copy Essays.css
- [ ] Test renders on Writing page

**Acceptance Criteria:**
- Essays component displays
- Data loads correctly
- Styling intact

**Time:** 1-2 hours
**Risk:** Low

---

### Story 3.3: Migrate StructuredData Component [2 points]
**Goal:** Port JSON-LD structured data

**Tasks:**
- [ ] Copy StructuredData.tsx
- [ ] Test JSON-LD renders in <head>
- [ ] Verify Google structured data validator
- [ ] Add to relevant pages

**Acceptance Criteria:**
- JSON-LD renders correctly
- No schema validation errors
- SEO metadata intact

**Time:** 2-3 hours
**Risk:** Low

---

### Story 3.4: Remove React Helmet Dependencies [1 point]
**Goal:** Clean up SEO component (replaced by Next.js)

**Tasks:**
- [ ] Delete SEO.tsx component
- [ ] Remove react-helmet-async dependency
- [ ] Verify all metadata working via Next.js
- [ ] Update package.json

**Acceptance Criteria:**
- No React Helmet imports
- Metadata working on all pages
- Package.json cleaned up

**Time:** 1 hour
**Risk:** Low

---

### Story 3.5: Update All next/link Usages [2 points]
**Goal:** Audit and fix all navigation links

**Tasks:**
- [ ] Search for all Link usages
- [ ] Verify all use next/link
- [ ] Test all internal navigation
- [ ] Check external links have target="_blank"

**Acceptance Criteria:**
- All internal links use next/link
- Navigation works throughout site
- No React Router remnants

**Time:** 2-3 hours
**Risk:** Low

---

## Phase 4: Image Optimization (Week 2)

### Story 4.1: Audit Current Image Usage [1 point]
**Goal:** Document all <img> tags for migration

**Tasks:**
- [ ] Search codebase for <img> tags
- [ ] List all image files in public/
- [ ] Document image dimensions
- [ ] Create migration checklist

**Acceptance Criteria:**
- Complete inventory of images
- Dimensions documented
- Priority order determined

**Time:** 1-2 hours
**Risk:** Low

---

### Story 4.2: Configure next/image Domains [1 point]
**Goal:** Set up image optimization config

**Tasks:**
- [ ] Update next.config.ts with image domains
- [ ] Configure remotePatterns for external images
- [ ] Set default image sizes
- [ ] Test configuration

**Acceptance Criteria:**
- next.config.ts properly configured
- External image domains allowed
- No configuration errors

**Time:** 1 hour
**Risk:** Low

---

### Story 4.3: Migrate Critical Images [2 points]
**Goal:** Convert priority images to next/image

**Tasks:**
- [ ] Replace hero images with <Image>
- [ ] Add width/height props
- [ ] Set priority flag for above-fold
- [ ] Test responsive behavior

**Acceptance Criteria:**
- Critical images using next/image
- LCP metrics improved
- Images render responsively

**Time:** 2-3 hours
**Risk:** Low

---

### Story 4.4: Migrate Remaining Images [2 points]
**Goal:** Convert all other <img> to <Image>

**Tasks:**
- [ ] Convert all remaining images
- [ ] Add lazy loading (default)
- [ ] Optimize placeholder images
- [ ] Test all pages

**Acceptance Criteria:**
- No <img> tags remaining
- All images optimized
- No broken images

**Time:** 2-4 hours
**Risk:** Low

---

## Phase 5: Testing & Verification (Week 2-3)

### Story 5.1: Set Up Vitest for Next.js [2 points]
**Goal:** Configure test environment

**Tasks:**
- [ ] Install Vitest + React Testing Library
- [ ] Configure vitest.config.ts for Next.js
- [ ] Set up test utilities
- [ ] Run sample test

**Acceptance Criteria:**
- Vitest working with Next.js
- Tests can import Next.js components
- Test runner configured

**Time:** 2-3 hours
**Risk:** Low

---

### Story 5.2: Port Home Page Tests [2 points]
**Goal:** Migrate tests for Home/Hero/FeaturedContent

**Tasks:**
- [ ] Copy test files
- [ ] Update imports for Next.js
- [ ] Fix navigation mocking
- [ ] Run and verify tests pass

**Acceptance Criteria:**
- All Home page tests passing
- Hero tests passing
- FeaturedContent tests passing

**Time:** 2-4 hours
**Risk:** Medium

---

### Story 5.3: Port CV Page Tests [2 points]
**Goal:** Migrate CV.test.tsx

**Tasks:**
- [ ] Copy CV.test.tsx
- [ ] Update imports
- [ ] Fix metadata testing
- [ ] Verify all tests pass

**Acceptance Criteria:**
- All CV tests passing (40+ tests)
- No test failures

**Time:** 2-3 hours
**Risk:** Low

---

### Story 5.4: Port Writing Page Tests [2 points]
**Goal:** Migrate Writing/Poetry/Fiction tests

**Tasks:**
- [ ] Copy Writing.test.tsx
- [ ] Copy Poetry.test.tsx
- [ ] Copy Fiction.test.tsx
- [ ] Update imports
- [ ] Fix async test issues
- [ ] Verify all pass

**Acceptance Criteria:**
- Writing tests passing (20+ tests)
- Poetry tests passing (27 tests)
- Fiction tests passing (18 tests)

**Time:** 3-4 hours
**Risk:** Medium

---

### Story 5.5: Port Papers Page Tests [3 points]
**Goal:** Migrate OpenPapers and PaperDetail tests

**Tasks:**
- [ ] Copy OpenPapers.test.tsx
- [ ] Copy PaperDetail.test.tsx (if exists)
- [ ] Update for Next.js dynamic routes
- [ ] Mock generateStaticParams()
- [ ] Verify all pass

**Acceptance Criteria:**
- Papers page tests passing
- Dynamic route tests working
- Markdown rendering tested

**Time:** 4-6 hours
**Risk:** Medium (dynamic routing complexity)

---

### Story 5.6: Port Component Tests [2 points]
**Goal:** Migrate Navigation, Card, Essays tests

**Tasks:**
- [ ] Copy Navigation.test.tsx
- [ ] Copy Card.test.tsx
- [ ] Copy Essays.test.tsx
- [ ] Update Link mocking for next/link
- [ ] Verify all pass

**Acceptance Criteria:**
- Navigation tests passing (20+ tests)
- Card tests passing (21 tests)
- Essays tests passing (27 tests)

**Time:** 2-4 hours
**Risk:** Low

---

### Story 5.7: Verify Test Coverage [1 point]
**Goal:** Ensure all 397+ tests passing

**Tasks:**
- [ ] Run full test suite
- [ ] Fix any failing tests
- [ ] Document coverage percentage
- [ ] Verify no regressions

**Acceptance Criteria:**
- 397+ tests passing
- Coverage ≥ previous project
- No flaky tests

**Time:** 1-2 hours
**Risk:** Low

---

## Phase 6: Build & Deploy (Week 3)

### Story 6.1: Configure Production Build [1 point]
**Goal:** Set up next build for production

**Tasks:**
- [ ] Update package.json scripts
- [ ] Configure output: 'standalone' (optional)
- [ ] Test production build locally
- [ ] Verify build completes successfully

**Acceptance Criteria:**
- `npm run build` succeeds
- No build errors
- Static pages generated

**Time:** 1 hour
**Risk:** Low

---

### Story 6.2: Generate Sitemap [2 points]
**Goal:** Create sitemap for SEO

**Tasks:**
- [ ] Install next-sitemap package
- [ ] Configure next-sitemap.config.js
- [ ] Generate sitemap.xml
- [ ] Verify URLs correct

**Acceptance Criteria:**
- sitemap.xml generated
- All pages included
- URLs point to karstenwade.com

**Time:** 2-3 hours
**Risk:** Low

---

### Story 6.3: Update robots.txt [1 point]
**Goal:** Configure robots.txt for Vercel

**Tasks:**
- [ ] Create public/robots.txt
- [ ] Point to sitemap
- [ ] Allow all crawlers
- [ ] Test in production

**Acceptance Criteria:**
- robots.txt accessible
- Sitemap URL correct
- No disallowed pages

**Time:** 30 minutes
**Risk:** Low

---

### Story 6.4: Configure Environment Variables [1 point]
**Goal:** Set up .env files for deployment

**Tasks:**
- [ ] Create .env.example
- [ ] Document all env vars
- [ ] Set up Vercel env vars
- [ ] Test builds with env vars

**Acceptance Criteria:**
- .env.example complete
- Vercel env vars configured
- No secrets in code

**Time:** 1 hour
**Risk:** Low

---

### Story 6.5: Deploy to Vercel Staging [2 points]
**Goal:** First deployment to Vercel

**Tasks:**
- [ ] Connect GitHub repo to Vercel
- [ ] Configure build settings
- [ ] Deploy to preview URL
- [ ] Test all pages work

**Acceptance Criteria:**
- Site deployed to Vercel preview
- All pages accessible
- No 404 errors
- Images loading

**Time:** 2-3 hours
**Risk:** Medium

---

### Story 6.6: Test Production Deployment [2 points]
**Goal:** Verify production deployment works

**Tasks:**
- [ ] Test all navigation
- [ ] Verify metadata in production
- [ ] Check image optimization working
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit

**Acceptance Criteria:**
- All pages work in production
- Lighthouse score ≥90
- Mobile responsive
- No console errors

**Time:** 2-3 hours
**Risk:** Low

---

### Story 6.7: Point Domain to Next.js Deployment [1 point]
**Goal:** Switch karstenwade.com to Next.js

**Tasks:**
- [ ] Verify domain in Vercel
- [ ] Update deployment settings
- [ ] Switch from Vite to Next.js build
- [ ] Test domain points to new site

**Acceptance Criteria:**
- karstenwade.com shows Next.js site
- HTTPS working
- No redirect issues

**Time:** 1 hour
**Risk:** Low

---

### Story 6.8: Archive Vite Project [1 point]
**Goal:** Clean up old deployment

**Tasks:**
- [ ] Tag Vite version in Git
- [ ] Archive Vite deployment in Vercel
- [ ] Document rollback procedure
- [ ] Update README

**Acceptance Criteria:**
- Git tag created
- Vite deployment archived
- Documentation updated

**Time:** 1 hour
**Risk:** Low

---

## Phase 7: Post-Migration Cleanup (Week 3)

### Story 7.1: Remove GitHub Pages Workflow [1 point]
**Goal:** Clean up unused CI/CD

**Tasks:**
- [ ] Delete .github/workflows/deploy-gh-pages.yml
- [ ] Remove gh-pages branch
- [ ] Update documentation
- [ ] Commit changes

**Acceptance Criteria:**
- GitHub Actions workflow removed
- gh-pages branch deleted
- No broken CI/CD

**Time:** 30 minutes
**Risk:** Low

---

### Story 7.2: Update Documentation [2 points]
**Goal:** Update all docs for Next.js

**Tasks:**
- [ ] Update README.md
- [ ] Update PRD.md
- [ ] Add Next.js deployment guide
- [ ] Document new file structure

**Acceptance Criteria:**
- README reflects Next.js
- PRD updated
- Clear deployment docs

**Time:** 2-3 hours
**Risk:** Low

---

### Story 7.3: Performance Monitoring Setup [1 point]
**Goal:** Track performance metrics

**Tasks:**
- [ ] Enable Vercel Analytics (free tier)
- [ ] Document baseline metrics
- [ ] Set up monitoring alerts
- [ ] Verify Google Analytics working

**Acceptance Criteria:**
- Vercel Analytics enabled
- Baseline metrics documented
- Google Analytics tracking

**Time:** 1 hour
**Risk:** Low

---

### Story 7.4: Create Rollback Plan [1 point]
**Goal:** Document emergency procedures

**Tasks:**
- [ ] Document how to revert to Vite
- [ ] Test rollback procedure
- [ ] Create backup Vercel deployment
- [ ] Update incident response doc

**Acceptance Criteria:**
- Rollback procedure documented
- Tested successfully
- Team knows process

**Time:** 1-2 hours
**Risk:** Low

---

## Total Story Count

**Phase 1:** 6 stories (9 points)
**Phase 2:** 10 stories (21 points)
**Phase 3:** 5 stories (7 points)
**Phase 4:** 4 stories (6 points)
**Phase 5:** 7 stories (15 points)
**Phase 6:** 8 stories (11 points)
**Phase 7:** 4 stories (5 points)

**TOTAL:** 44 stories, 74 points (~74-150 hours)

---

## Story Velocity Planning

**Assuming 1 developer, 6 hours/day productive time:**

- **Week 1:** Phase 1 + Phase 2 (30 points = 30-60 hours)
- **Week 2:** Phase 3 + Phase 4 + Phase 5 (28 points = 28-56 hours)
- **Week 3:** Phase 6 + Phase 7 (16 points = 16-32 hours)

**Total Timeline:** 3 weeks (assuming no blockers)

---

## Critical Path

**Must complete in order:**

1. Story 1.1 → 1.2 → 1.3 → 1.4 → 1.5 (Foundation)
2. Story 1.6 → 2.x (Navigation, then pages)
3. Story 5.1 before any Story 5.x (Test setup first)
4. Story 6.1 → 6.5 → 6.7 (Build → Deploy → Domain)

**Can parallelize:**
- Phase 3 components (after pages migrated)
- Phase 4 images (independent)
- Individual page migrations in Phase 2

---

## Deferred to Future Phases

**Not included in initial migration:**

- ❌ Blog section (Phase 8+)
- ❌ Strapi CMS integration (Phase 9+)
- ❌ Render.com backend setup (Phase 9+)
- ❌ Supabase database (Phase 9+)
- ❌ Webhook revalidation (Phase 9+)

**Reason:** Keep initial migration focused on stability and 1:1 feature parity with Vite version.

---

## Success Criteria

Migration complete when:

1. ✅ All 44 stories completed
2. ✅ All 397+ tests passing
3. ✅ karstenwade.com running on Next.js
4. ✅ Lighthouse scores ≥90 all categories
5. ✅ All pages migrated (Home, CV, Writing, Papers, Theories)
6. ✅ SEO metadata intact
7. ✅ Images optimized
8. ✅ Vercel deployment stable
9. ✅ Documentation updated
10. ✅ Rollback plan tested

---

## Next: Strapi Integration (Future Phase)

**After successful migration, Phase 8+:**
- Set up Render.com Strapi instance
- Configure Supabase PostgreSQL
- Migrate content to CMS
- Implement webhooks
- Add blog functionality

**Estimated:** Additional 3-4 weeks
