# Tailwind CSS & Shadcn UI Migration

This document details the migration from custom CSS to Tailwind CSS v4 and Shadcn UI components, completed as part of Epic 13.

## Overview

**Migration Period**: November 2024
**Tailwind Version**: 4.1.17 (PostCSS plugin)
**Shadcn UI**: Latest (via CLI)
**Status**: ✅ Complete

## Migration Summary

### Components Migrated

| Component | Custom CSS Lines Removed | Tailwind Implementation | Tests Passing |
|-----------|-------------------------|------------------------|---------------|
| Navigation | 290 lines | Tailwind utilities + responsive breakpoints | 20/20 ✅ |
| Card | 232 lines | Shadcn Card primitives | 21/21 ✅ |
| Hero | 216 lines | Tailwind utilities + gradient | 28/28 ✅ |
| Button | N/A (new) | Shadcn Button with 6 variants | 28/28 ✅ |

**Total CSS Removed**: 738 lines of custom CSS
**Total Tests**: 97 tests passing for migrated components

### Global Styles Updated

- `tailwind.config.js`: Extended with "Wide Horizon Clubhouse" design tokens
- `app/globals.css`: Global styles with @layer directives (merged from former src/styles/)
- `styles/variables.css`: Preserved for fluid typography and runtime theming

## Architecture Decisions

### Tailwind v4 Setup

We use the **PostCSS plugin** approach for Tailwind v4:

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

**Why PostCSS instead of a Vite plugin?**
- Required for Next.js compatibility
- Standard integration path for Next.js projects
- Full Tailwind v4 feature support

### CSS Variables Strategy

We maintain CSS variables alongside Tailwind for:

1. **Fluid Typography**: Using `clamp()` for responsive text sizing
2. **Runtime Theming**: Dark mode support (future enhancement)
3. **Dynamic Values**: Colors/spacing that may need JavaScript changes

Example:
```css
/* styles/variables.css */
--font-size-3xl: clamp(2.5rem, 2rem + 2.5vw, 4rem);

/* Used in both places */
h1 { font-size: var(--font-size-3xl); }  /* Direct CSS */
<h1 className="text-5xl">...</h1>        /* Tailwind equivalent */
```

### Design Token Integration

All design tokens from `styles/variables.css` are now available as Tailwind utilities via `tailwind.config.js`:

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: { DEFAULT: '#D97038', light: '#E69663', dark: '#B85A2A' },
      secondary: { DEFAULT: '#5B8FA3', light: '#7FAABB', dark: '#456B7A' },
      // ... full palette
    },
    // ... spacing, shadows, transitions, etc.
  }
}
```

Usage:
```tsx
// Option 1: Tailwind utilities
<div className="bg-primary text-white shadow-lg" />

// Option 2: CSS variables
<div style={{ backgroundColor: 'var(--color-primary)' }} />
```

### @layer Organization

Global styles organized into Tailwind layers for proper CSS cascade:

```css
/* app/globals.css */
@layer base {
  /* Typography defaults, focus styles, semantic HTML */
  body { margin: 0; font-family: var(--font-body); }
  h1, h2, h3 { font-weight: var(--font-weight-bold); }
}

@layer utilities {
  /* Custom utilities like .skip-link */
  .skip-link { position: absolute; /* ... */ }
}
```

**Why this matters**: Ensures custom styles play nicely with Tailwind's reset and don't get purged.

## Migration Process (for future components)

### 1. Identify Component CSS

```bash
# Find component CSS file
ls app/components/MyComponent.css

# Count lines to migrate
wc -l app/components/MyComponent.css
```

### 2. Run Existing Tests (RED phase)

```bash
npx vitest run app/components/MyComponent.test.tsx
```

Ensure all tests pass before migration.

### 3. Migrate to Tailwind Utilities

**Common Patterns**:

| Custom CSS | Tailwind Equivalent |
|------------|-------------------|
| `display: flex;` | `flex` |
| `flex-direction: column;` | `flex-col` |
| `gap: 1rem;` | `gap-4` |
| `padding: 2rem;` | `p-8` |
| `border-radius: 0.5rem;` | `rounded-md` |
| `background: linear-gradient(...)` | `bg-gradient-to-br from-white to-gray-100` |

**Responsive Design**:
```tsx
// Before (CSS)
@media (min-width: 768px) {
  .component { flex-direction: row; }
}

// After (Tailwind)
<div className="flex-col md:flex-row">
```

### 4. Preserve CSS Class Names for Tests

Keep BEM-style class names alongside Tailwind for test compatibility:

```tsx
// Keep both!
<div className={cn(
  'hero',  // For tests
  'flex flex-col md:flex-row gap-8'  // Tailwind styling
)}>
```

### 5. Run Tests Again (GREEN phase)

```bash
npx vitest run app/components/MyComponent.test.tsx
```

All tests should still pass.

### 6. Remove CSS File

```bash
git rm app/components/MyComponent.css
```

### 7. Verify Build

```bash
npm run build
```

Check bundle size and ensure no errors.

## Shadcn UI Components

### Installation

```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

### Available Components

Currently installed:
- **Button**: 6 variants (default, destructive, outline, secondary, ghost, link)
- **Card**: CardHeader, CardTitle, CardDescription, CardContent, CardFooter

### Creating Tests for Shadcn Components

Comprehensive test template:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button Component', () => {
  describe('Component Rendering', () => {
    it('should render with default variant', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard accessible', async () => {
      const user = userEvent.setup()
      render(<Button>Test</Button>)
      await user.tab()
      expect(screen.getByRole('button')).toHaveFocus()
    })
  })
})
```

## Build Metrics

### Bundle Sizes

After migration:
- **Main CSS Bundle**: 36.25 kB (7.88 kB gzipped)
- **Component CSS**: Code-split by route (0.84 - 11.34 kB)
- **JavaScript**: Minimal increase due to Shadcn components

### Performance Impact

- ✅ No significant impact on build time
- ✅ Tree-shaking effectively removes unused utilities
- ✅ Gzipped sizes remain small and efficient
- ✅ Code splitting preserved for route-based CSS

## Testing Strategy

### Test Categories

1. **Component Tests** (97 tests for migrated components)
   - Rendering
   - Props interface
   - Variants and sizes
   - Accessibility
   - User interactions

2. **Visual Testing** (Manual)
   - Verify responsive breakpoints (320px, 768px, 1024px, 1280px)
   - Check hover/focus states
   - Test keyboard navigation
   - Verify color contrast

3. **Build Validation**
   - `npm run build` succeeds
   - Bundle sizes reasonable
   - No console errors

### Running Tests

```bash
# All tests
npx vitest run

# Specific component
npx vitest run app/components/Button.test.tsx

# Watch mode
npx vitest watch

# Coverage
npx vitest run --coverage
```

### Test Results Summary

**Migrated Components**: 97/97 tests passing ✅
- Navigation: 20/20 ✅
- Card: 21/21 ✅
- Hero: 28/28 ✅
- Button: 28/28 ✅

**Known Issues**:
- Poetry/Fiction/Writing pages have pre-existing react-helmet-async issues (not related to Tailwind migration)

## Accessibility Checklist

All migrated components verify:

- ✅ Semantic HTML elements
- ✅ Proper heading hierarchy (h1-h6)
- ✅ Keyboard navigation (Tab, Enter, Space)
- ✅ Focus-visible states (2px outline)
- ✅ ARIA attributes where needed
- ✅ Screen reader compatibility
- ✅ Color contrast meets WCAG AA
- ✅ Responsive on mobile devices

## Common Pitfalls & Solutions

### Issue: `@apply` doesn't work with custom classes

**Problem**:
```css
.my-class {
  @apply font-body;  /* Error: Unknown utility class */
}
```

**Solution**: Use CSS variables or plain CSS in Tailwind v4:
```css
.my-class {
  font-family: var(--font-body);
}
```

### Issue: Utility classes not generating

**Problem**: Used `gap-6` but class doesn't appear in build.

**Solution**: Ensure correct Tailwind v4 setup with PostCSS plugin:
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // ← Must use PostCSS plugin
  },
}
```

### Issue: Tests fail after migration

**Solution**: Keep original BEM class names for test compatibility:
```tsx
<div className={cn('original-class', 'tailwind utilities')}>
```

## Future Enhancements

### Planned Improvements

1. **Dark Mode**: Enable `prefers-color-scheme` with CSS variables
2. **More Shadcn Components**: Dialog, Sheet, Dropdown Menu, Tooltip
3. **Animation Library**: Consider Framer Motion for complex animations
4. **Custom Plugin**: Extract repeated patterns into Tailwind plugin

### Dark Mode Implementation (Future)

```css
/* variables.css */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: var(--color-neutral-800);
    --color-text-primary: var(--color-neutral-100);
  }
}
```

Then Tailwind utilities automatically respect the CSS variables.

## Resources

### Documentation

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Shadcn UI Components](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)

### Internal References

- Design System: `styles/variables.css`
- Tailwind Config: `tailwind.config.js`
- Global Styles: `app/globals.css`
- Utility Function: `lib/utils.ts` (cn helper)

### Related Issues

- Epic 13: Tailwind CSS & Shadcn UI Integration
  - Story 13.1: Infrastructure setup (#88)
  - Story 13.2: Navigation migration (#94)
  - Story 13.3: Card migration (#89)
  - Story 13.4: Hero migration (#90)
  - Story 13.5: Global styles (#91)
  - Story 13.6: Button component (#92)
  - Story 13.7: Testing and validation (#93)

## Contributors

Migration completed by AINative Dev Team
Project: karstenwade.com
Date: November 2024

---

*This migration documentation was created as part of Story 13.7: Testing and visual regression validation.*
