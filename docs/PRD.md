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

### GitHub Pages Configuration

**Primary Deployment:**
- **Host:** GitHub Pages
- **URL:** https://karstenwade.com (custom domain)
- **Fallback:** https://karstenwade.github.io/karstenwade.com/
- **Deploy Method:** GitHub Actions workflow
- **Branch:** gh-pages (auto-deployed from main)

**DNS Configuration:**
- **Apex domain:** karstenwade.com → GitHub Pages
- **WWW subdomain:** www.karstenwade.com → karstenwade.com
- **HTTPS:** Enforced via GitHub Pages
- **CDN:** GitHub's global CDN

**Deployment Flow:**
1. Push to `main` branch
2. GitHub Actions builds site (`npm run build`)
3. Static files deployed to `gh-pages` branch
4. GitHub Pages serves from `gh-pages`
5. DNS resolves karstenwade.com to GitHub Pages
6. Site available globally via CDN

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

### Epic 8: Custom Domain & DNS 🆕 IN PROGRESS
- Story 8.1: Configure custom domain in GitHub Pages
- Story 8.2: Set up DNS records for karstenwade.com
- Story 8.3: Enable HTTPS with custom domain
- Story 8.4: Add www subdomain redirect
- Story 8.5: Update documentation with DNS configuration

---

## DNS Configuration Requirements

### Story 8.1: Configure Custom Domain in GitHub Pages
**Acceptance Criteria:**
- [ ] Custom domain `karstenwade.com` configured in GitHub Pages settings
- [ ] CNAME file created in public/ directory
- [ ] GitHub Pages recognizes custom domain
- [ ] HTTPS certificate provisioning initiated

### Story 8.2: Set up DNS Records
**Acceptance Criteria:**
- [ ] A records pointing to GitHub Pages IPs:
  - 185.199.108.153
  - 185.199.109.153
  - 185.199.110.153
  - 185.199.111.153
- [ ] AAAA records (IPv6) configured (optional)
- [ ] DNS propagation verified

### Story 8.3: Enable HTTPS
**Acceptance Criteria:**
- [ ] GitHub Pages HTTPS enforced
- [ ] SSL certificate active
- [ ] HTTP redirects to HTTPS
- [ ] Certificate auto-renewal configured

### Story 8.4: WWW Subdomain
**Acceptance Criteria:**
- [ ] CNAME record: www.karstenwade.com → karstenwade.com
- [ ] www redirects to apex domain
- [ ] HTTPS works for both domains

### Story 8.5: Documentation
**Acceptance Criteria:**
- [ ] README updated (remove DreamHost references)
- [ ] DNS configuration documented
- [ ] Troubleshooting guide created
- [ ] CURRENT_STATE.md updated

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
