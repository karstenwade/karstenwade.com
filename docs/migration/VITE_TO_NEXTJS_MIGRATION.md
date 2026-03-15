# Vite to Next.js Migration — Decision Record

**Date:** 2026-03-15
**Status:** Complete
**Author:** AINative Dev Team

## Decision

Fully remove all Vite remnants from karstenwade.com and establish a clean Next.js 15 App Router architecture with static export (`output: 'export'`).

## Context

The site was originally built as a Vite + React Router SPA. A partial migration to Next.js 15 was completed (~75%), leaving a `src/` directory with Vite-era code that was partially imported by the Next.js `app/` directory and partially dead code.

This created confusion about the canonical source of truth for shared code (data files, services, utilities, types, UI components) and left Vite-specific configuration files that served no purpose.

## What Changed

### Configuration
- **Removed**: `vite.config.ts`, `tsconfig.node.json`, `index.html`, `public/vite.svg`, `src/vite-env.d.ts`
- **Updated**: `tsconfig.json` path alias `@/*` from `./src/*` to `./*`
- **Renamed**: package.json scripts (`dev:next` → `dev`, `build:next` → `build`, `start:next` → `start`)
- **Removed**: Vite npm dependencies (`@vitejs/plugin-react`, `@tailwindcss/vite`, `react-router-dom`, `react-helmet-async`)

### File Moves (src/ → root)
| From | To |
|------|----|
| `src/data/*.ts` | `data/*.ts` |
| `src/services/*.ts` | `lib/services/*.ts` |
| `src/lib/strapi.ts`, `src/lib/utils.ts` | `lib/strapi.ts`, `lib/utils.ts` |
| `src/types/index.ts` | `types/index.ts` |
| `src/components/ui/*.tsx` | `app/components/ui/*.tsx` |
| `src/styles/variables.css` | `styles/variables.css` |
| `src/test/setup.ts` | `test/setup.ts` |

### Dead Code Deleted (~60 files)
- `src/App.tsx`, `src/main.tsx` (Vite SPA shell)
- `src/components/` (24 files — duplicated in `app/components/`)
- `src/vite-pages/` (18 files — replaced by `app/` routes)
- `src/hooks/usePageTracking.ts` (used react-router-dom)
- All component/page CSS files imported only by dead Vite code

### CSS Consolidation
- Moved `src/styles/variables.css` to `styles/variables.css`
- Merged unique base styles from `src/styles/index.css` into `app/globals.css`
- Updated `tailwind.config.js` content paths

### CI/CD
- Updated `vercel.json` build command
- Updated `.github/workflows/ci.yml` and `deploy.yml`
- Removed SPA rewrite rule from `vercel.json`

## Final Project Structure

```
karstenwade.com/
├── app/           # Next.js App Router (pages + components)
├── data/          # Static content data files
├── lib/           # Shared utilities and services
├── types/         # TypeScript type definitions
├── styles/        # Design system (CSS variables)
├── test/          # Test setup and utilities
├── cms/           # Strapi CMS (unchanged)
├── public/        # Static assets
├── scripts/       # Build scripts
└── docs/          # Documentation
```

## Risks Mitigated

- **Path alias change**: Traced all `@/` imports before changing, updated vitest config in parallel
- **CSS breakage**: Created CSS type declarations (`types/css.d.ts`) to replace `vite-env.d.ts`
- **Dead code identification**: Comprehensive import analysis confirmed zero references from `app/`
- **Build verification**: `npm run build` verified after every change

## Verification

All checks pass after migration:
- `npm run test:unit` — all tests pass
- `npm run lint` — no new errors
- `npm run type-check` — zero type errors
- `npm run build` — successful static export with all routes
