# karstenwade.com

## CRITICAL RULES - READ FIRST

**Before starting ANY dev server, check `.claude/rules/port-management.md`**

| Service | Port | URL |
|---------|------|-----|
| Next.js dev server | **3001** | http://localhost:3001 |
| Strapi CMS | **1337** | http://localhost:1337/admin |

**Forbidden ports:** 3000, 5173, or any unlisted port.

---

## Overview
Personal professional website for Karsten Wade - a static Next.js site with Strapi CMS for blog content management and ZeroDB for data storage.

## Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Package Manager**: npm
- **CMS**: Strapi (headless)
- **Database**: ZeroDB (via MCP)
- **Styling**: Tailwind CSS
- **Testing**: Vitest (unit)
- **Deployment**: Static export

## Development Workflow

### Getting Started
```bash
npm install
npm run dev
```

The dev server runs at: http://localhost:3001

For CMS development:
```bash
cd cms
npm run develop
```
Strapi admin runs at: http://localhost:1337/admin

### TDD Red-Green-Refactor Workflow
1. **Red**: Write a failing test first
2. **Green**: Write minimal code to make the test pass
3. **Refactor**: Clean up code while keeping tests green

### Branch Naming Convention
- `feature/{issue-number}-{short-description}` - New features
- `bugfix/{issue-number}-{short-description}` - Bug fixes
- `chore/{issue-number}-{short-description}` - Maintenance tasks

### Pre-Commit Checklist
Before committing, ensure:
- [ ] All tests pass (`npm run test:unit`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] No console.log or debug statements in production code

### Pull Request Process
1. Create feature branch from `main`
2. Make changes following TDD workflow
3. Push branch and create PR via GitHub
4. Ensure CI checks pass
5. Request review and address feedback
6. Squash and merge when approved

## Project Structure
```
karstenwade.com/
├── app/                  # Next.js App Router (pages + components)
│   ├── components/      # React components (including ui/)
│   ├── blog/            # Blog listing and detail pages
│   ├── papers/          # Papers section with dynamic routes
│   ├── writing/         # Writing page
│   ├── cv/              # CV page
│   └── page.tsx         # Homepage
├── data/                 # Static content data files
├── lib/                  # Shared utilities and services
│   ├── services/        # contentService, paperService, githubApi
│   ├── strapi.ts        # Strapi API client
│   └── utils.ts         # cn() utility
├── types/                # TypeScript type definitions
├── styles/               # Design system (CSS variables)
├── test/                 # Test setup and utilities
├── cms/                  # Strapi CMS (separate npm project)
├── public/              # Static assets
├── scripts/             # Build scripts
└── out/                 # Static export output
```

## Key Directories
- `app/` - Next.js pages and components
- `data/` - Static content data files
- `lib/` - Shared utilities, services, and API clients
- `types/` - TypeScript type definitions
- `cms/` - Strapi CMS backend

## Environment Variables
Copy `.env.example` to `.env.local`:
```
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=<your-token>
ZERODB_API_KEY=<your-key>
```

## Architecture Patterns
- **Static Export**: Site builds to static HTML for deployment
- **ISR-like pattern**: Strapi content fetched at build time via `generateStaticParams`
- **Component colocation**: Components live in `app/components/`
- **Type safety**: Full TypeScript with strict mode

## Important Notes
- This project follows **AINative Studio coding standards** (see `.ainative/` symlink)
- **ZERO TOLERANCE**: No third-party AI tool attribution in commits, PRs, or code comments
- Use AINative branding only: "Built by AINative Dev Team", "Built Using AINative Studio", etc.
- Copyright belongs to Karsten Wade unless content is explicitly open licensed
- Blog content comes from Strapi CMS via API
- All pages must work with `output: 'export'` (static site)

## Content Licensing
- Site code and original content: Copyright Karsten Wade
- Open Source Way Guidebook content: CC BY-SA 4.0
- Third-party assets: See individual licenses

## API Integration
- **Strapi**: REST API for blog posts, papers metadata
- **ZeroDB**: MCP integration for vector storage and search
