# Next.js Migration Plan — Complete Vite Removal (v3.0)

**karstenwade.com: Complete Vite-to-Next.js Migration**

**Version:** 3.0
**Created:** 2025-11-25
**Updated:** 2026-03-14
**Status:** In Progress
**Budget:** $0/month (Free tiers only)
**Story Size:** Fibonacci (1, 2, 3, 5, 8)

> **Update 2026-03-14:** v3.0 — The site is ~75% migrated. This plan completes the migration by removing all Vite remnants, consolidating shared code from `src/` to root-level directories, and establishing a clean Next.js-only project structure.

---

## Context

karstenwade.com is approximately 75% migrated to Next.js 15 App Router. The `app/` directory is the production codebase (what CI builds and deploys), but a `src/` directory of Vite-era code persists — containing data files, services, components, and configs that are partially depended on and partially dead code. The AINative Studio portfolio is standardizing on Next.js for SSG/SSR to maximize agent search friendliness. This PRD completes that migration, removes all Vite remnants, and establishes a clean Next.js backend that a separate frontend repository can later consume.

**Modeled after**: AINative-Studio/ainative-website conversion (3 sprints, 8 epics, 240+ issues, 172 points). Scaled down for this smaller personal site (~26 components, 6 routes).

---

## Goals

1. **Remove all Vite configuration, dependencies, and dead code**
2. **Consolidate shared code** (data, services, types) from `src/` to root-level directories
3. **Establish clean Next.js-only project structure** ready for future frontend repo separation
4. **Maintain visual and functional parity** with current production site
5. **Update CI/CD, testing, and documentation** to reflect Next.js-only architecture

## Non-Goals

- Frontend redesign (separate repo/session later)
- New features or content changes
- CMS (Strapi) changes
- Deployment platform migration

---

## Agile Process

### Methodology
- **2 Sprints**, ~1 week each
- **Fibonacci estimation**: 0, 1, 2, 3, 5, 8
- **TDD Red-Green-Refactor** on every code change
- **Branch per story**: `feature/{issue}-{slug}` or `chore/{issue}-{slug}`
- **PR per story** with test evidence

### Definition of Done (per story)
- [ ] Failing test written first (Red)
- [ ] Minimal code to pass (Green)
- [ ] Refactored with tests still green
- [ ] `npm run test:unit` passes
- [ ] `npm run lint` passes
- [ ] `npm run type-check` passes
- [ ] `npm run build` succeeds
- [ ] PR created with test execution evidence

### Agent Team Assignments

| Agent | Role in Migration |
|-------|-------------------|
| **Plan** | Sprint planning, story breakdown, dependency mapping |
| **Explore** | Codebase investigation, import tracing, dead code detection |
| **TDD Developer** | All implementation work (Red-Green-Refactor) |
| **QA Testing Strategist** | Test strategy per epic, coverage verification |
| **DevOps Infrastructure** | CI/CD pipeline updates |
| **DX Optimizer** | Config consolidation, developer experience |
| **Tech Docs Writer** | Documentation updates |
| **Security Engineer** | Dependency audit, vulnerability check on removed packages |

---

## Current State Analysis

### What's Already Next.js
- `app/` directory with App Router (layout, pages, components)
- `next.config.ts` with `output: 'export'` (SSG)
- `npm run dev:next` / `npm run build:next` scripts
- GitHub Actions CI/CD uses Next.js build
- Server components fetch from Strapi at build time

### Vite Remnants to Remove
- `vite.config.ts`, `vitest.config.ts` (Vite configs)
- `index.html` (Vite SPA entry point)
- `src/App.tsx`, `src/main.tsx` (Vite SPA shell)
- `src/vite-pages/` (Vite router pages)
- `src/components/` (duplicated in `app/components/`)
- `src/hooks/usePageTracking.ts` (uses react-router-dom)
- `src/vite-env.d.ts`
- `public/vite.svg`
- npm deps: `react-router-dom`, `react-helmet-async`, `@vitejs/plugin-react`, `@tailwindcss/vite`

### Shared Code in `src/` (actively imported by `app/`)
- `src/data/*.ts` — papers, essays, fiction, poetry, CV, featuredContent, theories
- `src/services/contentService.ts`, `paperService.ts`, `githubApi.ts`
- `src/lib/strapi.ts`, `src/lib/utils.ts`
- `src/types/index.ts`
- `src/styles/variables.css`
- `src/components/ui/` — shadcn primitives (button, card)

### Key Coupling
- Path alias `@/*` resolves to `./src/*` — this is the single most impactful thing to change

---

## Target Directory Structure

```
karstenwade.com/
  app/                    # Next.js App Router (pages + components)
    components/           # All React components (including ui/)
    blog/, papers/, writing/, cv/  # Routes
    globals.css           # Single CSS entry point
    layout.tsx, page.tsx  # Root layout and homepage
  data/                   # Static content data files
  lib/                    # Shared utilities and services
    services/             # contentService, paperService, githubApi
    strapi.ts             # Strapi/ZeroDB client
    utils.ts              # cn() utility
    zerodb-client.ts      # ZeroDB search client (already here)
  types/                  # TypeScript type definitions
  styles/                 # Design system
    variables.css         # CSS custom properties
  test/                   # Test setup and utilities
  cms/                    # Strapi CMS (unchanged)
  public/                 # Static assets (minus vite.svg)
  scripts/                # Build scripts
```

---

## Sprint 1: Foundation & Consolidation (34 points)

### Epic 1.1: Configuration Cleanup (8 points)

**Agents**: DX Optimizer (lead), Explore (audit), TDD Developer (implementation)

| # | Story | Pts | TDD Approach | Agent |
|---|-------|-----|--------------|-------|
| 1.1.1 | Remove Vite config files (`vite.config.ts`, `tsconfig.node.json`, `index.html`, `public/vite.svg`, `src/vite-env.d.ts`) | 2 | Green: verify build still works after removal | DX Optimizer |
| 1.1.2 | Update `tsconfig.json`: change `@/*` paths from `./src/*` to `./*`, remove Vite-specific config | 3 | Red: write test that imports from new path fail; Green: update tsconfig; Refactor: verify all imports resolve | TDD Developer |
| 1.1.3 | Update `package.json`: rename `dev:next`→`dev`, `build:next`→`build`, `start:next`→`start`; remove Vite scripts | 2 | Green: verify `npm run dev` starts Next.js on port 3001 | DX Optimizer |
| 1.1.4 | Remove Vite npm dependencies: `@vitejs/plugin-react`, `@tailwindcss/vite`, `react-router-dom`, `react-helmet-async` | 1 | Green: `npm run build` succeeds without them | DX Optimizer |

**Acceptance**: `npm run dev` starts Next.js. `npm run build` runs `next build`. No Vite config files remain.

### Epic 1.2: Data & Service Layer Migration (13 points)

**Agents**: Explore (trace imports), TDD Developer (lead), QA Testing Strategist (coverage)

| # | Story | Pts | TDD Approach | Agent |
|---|-------|-----|--------------|-------|
| 1.2.1 | Move `src/data/*.ts` to `data/` at project root | 3 | Red: test importing from `@/data/papers` with new alias; Green: move files, update alias; Refactor: clean up any re-exports | TDD Developer |
| 1.2.2 | Move `src/services/*.ts` to `lib/services/` | 3 | Red: test service imports from new paths; Green: move files, convert relative imports to `@/` style; Refactor: consolidate any duplicate service logic | TDD Developer |
| 1.2.3 | Move `src/lib/strapi.ts` and `src/lib/utils.ts` to `lib/` (alongside existing `lib/zerodb-client.ts`) | 2 | Red: test imports; Green: move files; Refactor: verify Strapi client initializes correctly | TDD Developer |
| 1.2.4 | Move `src/types/index.ts` to `types/` at project root | 2 | Red: type imports fail from new path; Green: move and update imports | TDD Developer |
| 1.2.5 | Update all `@/` import paths across `app/**/*.tsx` to reflect new locations; move `src/components/ui/` to `app/components/ui/` | 3 | Green: `npm run type-check` passes with zero errors; full build succeeds | TDD Developer + Explore |

**Acceptance**: All imports resolve. `npm run type-check` passes. `npm run build` succeeds. No files remain in `src/data/`, `src/services/`, `src/lib/`, `src/types/`.

### Epic 1.3: CSS & Styling Consolidation (8 points)

**Agents**: TDD Developer (lead), QA Testing Strategist (visual parity)

| # | Story | Pts | TDD Approach | Agent |
|---|-------|-----|--------------|-------|
| 1.3.1 | Move `src/styles/variables.css` to `styles/variables.css`; update import in `app/globals.css` | 3 | Red: CSS variable test checks `var(--color-primary)` resolves; Green: move file, update import path; Refactor: verify all CSS vars still defined | TDD Developer |
| 1.3.2 | Merge needed base styles from `src/styles/index.css` into `app/globals.css` | 2 | Red: test for skip-link utility and body defaults; Green: merge styles; Refactor: deduplicate | TDD Developer |
| 1.3.3 | Update `tailwind.config.js` content paths: remove `./index.html` and `./src/**/*` | 2 | Green: build succeeds, no missing Tailwind classes | TDD Developer |
| 1.3.4 | Delete all remaining CSS files in `src/` | 1 | Green: build and tests still pass | TDD Developer |

**Acceptance**: Visual parity with current production. No CSS imports reference `src/`.

### Epic 1.4: Dead Code Removal (5 points)

**Agents**: Explore (verify dead code), TDD Developer (deletion), Security Engineer (dep audit)

| # | Story | Pts | TDD Approach | Agent |
|---|-------|-----|--------------|-------|
| 1.4.1 | Delete `src/App.tsx`, `src/App.test.tsx`, `src/main.tsx` | 2 | Green: build passes, no import references these files | TDD Developer |
| 1.4.2 | Delete `src/components/` directory entirely | 2 | Green: verify no `app/` files import from `src/components/` (after ui/ moved in 1.2.5) | Explore + TDD Developer |
| 1.4.3 | Delete `src/vite-pages/`, `src/hooks/usePageTracking.ts`; remove empty `src/` directory | 1 | Green: `src/` directory no longer exists, build passes | TDD Developer |

**Acceptance**: `src/` directory no longer exists. No dangling imports.

---

## Sprint 2: Testing, Quality & Launch (21 points)

### Epic 2.1: Testing Infrastructure Update (8 points)

**Agents**: QA Testing Strategist (lead), TDD Developer (implementation)

| # | Story | Pts | TDD Approach | Agent |
|---|-------|-----|--------------|-------|
| 2.1.1 | Update `vitest.config.ts`: change `@` alias to `.`, update `include` patterns to `app/**/*.test.*` and `lib/**/*.test.*` | 3 | Red: existing tests fail with old paths; Green: update config; Refactor: verify all test files discovered | QA Testing Strategist |
| 2.1.2 | Move test setup from `src/test/setup.ts` to `test/setup.ts`; update CSS variable import | 2 | Green: test setup loads correctly, `npm run test:unit` passes | TDD Developer |
| 2.1.3 | Migrate relevant `src/**/*.test.tsx` tests to new locations alongside source files | 3 | Green: all migrated tests pass, coverage not worse than before | TDD Developer |

**Acceptance**: `npm run test:unit` passes. Coverage maintained or improved.

### Epic 2.2: Lint & TypeScript Cleanup (5 points)

**Agents**: DX Optimizer (lead), TDD Developer

| # | Story | Pts | TDD Approach | Agent |
|---|-------|-----|--------------|-------|
| 2.2.1 | Update `eslint.config.js`: remove `eslint-plugin-react-refresh` (Vite-specific), update paths | 2 | Green: `npm run lint` passes | DX Optimizer |
| 2.2.2 | Update or remove `components.json` (shadcn/ui config pointing to `src/`) | 2 | Green: shadcn components resolvable from new paths | DX Optimizer |
| 2.2.3 | Clean up `tsconfig.json` include/exclude for final directory structure | 1 | Green: `npm run type-check` passes | TDD Developer |

**Acceptance**: `npm run lint` and `npm run type-check` pass with no Vite-specific rules.

### Epic 2.3: CI/CD & Documentation (5 points)

**Agents**: DevOps Infrastructure (CI/CD), Tech Docs Writer (docs)

| # | Story | Pts | TDD Approach | Agent |
|---|-------|-----|--------------|-------|
| 2.3.1 | Update project instructions file: remove Vite references, update project structure, update scripts table | 2 | Review: documentation matches actual project state | Tech Docs Writer |
| 2.3.2 | Update `.github/workflows/ci.yml` and `deploy.yml`: script names match renamed package.json scripts | 1 | Green: CI pipeline passes on test PR | DevOps Infrastructure |
| 2.3.3 | Update `.env.example` and any remaining docs to remove Vite references | 1 | Review: no "vite" references in any docs | Tech Docs Writer |
| 2.3.4 | Create `docs/migration/VITE_TO_NEXTJS_MIGRATION.md` documenting decisions and final state | 1 | Review: complete and accurate | Tech Docs Writer |

**Acceptance**: CI passes. Documentation reflects Next.js-only architecture.

### Epic 2.4: Final Verification & Cleanup (3 points)

**Agents**: QA Testing Strategist (lead), Security Engineer (dep audit), Explore (verification)

| # | Story | Pts | TDD Approach | Agent |
|---|-------|-----|--------------|-------|
| 2.4.1 | Full build verification: `npm run build`, verify `out/` contains all expected static pages | 1 | Green: all routes render correctly in static output | QA Testing Strategist |
| 2.4.2 | Dependency audit: remove unused npm packages, verify no vulnerabilities introduced | 1 | Green: `npm audit` clean, no unused deps | Security Engineer |
| 2.4.3 | Remove `public/404.html` (Next.js generates from `not-found.tsx`), clean up any remaining Vite artifacts | 1 | Green: clean git status after full build | TDD Developer |

**Acceptance**: Clean build. No unused dependencies. Site deploys and renders correctly.

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| `@/*` path alias change breaks imports silently | High | Run `type-check` after every file move; Explore agent traces all imports before moving |
| CSS variables break after moving `variables.css` | Medium | CSS variable tests verify all custom properties resolve; visual comparison |
| Vitest tests reference `src/` paths that no longer exist | Medium | Update vitest config in Sprint 2 first story; run tests after each move |
| `components.json` (shadcn) references old `src/` paths | Low | Update in Sprint 2; only affects future shadcn component additions |
| `contentService.ts` uses relative imports that break when moved | Medium | Convert to `@/` path aliases during move; TDD catches breakage |

## Critical Files

- `tsconfig.json` — path alias change is the single most impactful change
- `package.json` — script renaming, dependency removal
- `src/services/contentService.ts` — most complex file to migrate (relative imports, interface contracts)
- `app/globals.css` — CSS consolidation target
- `vitest.config.ts` — testing infrastructure pivot

## Verification Plan

After all stories complete:
1. `npm run test:unit` — all tests pass with coverage report
2. `npm run lint` — zero warnings/errors
3. `npm run type-check` — zero type errors
4. `npm run build` — successful static export
5. Serve `out/` locally and verify all pages render
6. Compare against current production for visual parity
7. Push to branch, verify CI pipeline passes
8. Deploy to staging, verify live site

---

## Summary

| Sprint | Points | Epics | Stories |
|--------|--------|-------|---------|
| Sprint 1: Foundation & Consolidation | 34 | 4 | 15 |
| Sprint 2: Testing, Quality & Launch | 21 | 4 | 10 |
| **Total** | **55** | **8** | **25** |

**Agent Team Size**: 8 specialized agents
**TDD Coverage**: Every implementation story follows Red-Green-Refactor
**Estimated Duration**: 2 sprints (~1 week each)
