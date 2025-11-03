# Design System Documentation

## Wide Horizon Clubhouse Theme

A warm, welcoming design system inspired by open spaces, community gathering, and collaborative work.

## Color Palette

### Primary Colors - Warm Horizon Tones

| Color | Hex | Variable | Usage |
|-------|-----|----------|-------|
| ![#D97038](https://via.placeholder.com/20/D97038/D97038) Sunset Orange | `#D97038` | `--color-primary` | Primary brand color, CTAs, links |
| ![#E69663](https://via.placeholder.com/20/E69663/E69663) Lighter Sunset | `#E69663` | `--color-primary-light` | Hover states, accents |
| ![#B85A2A](https://via.placeholder.com/20/B85A2A/B85A2A) Deeper Sunset | `#B85A2A` | `--color-primary-dark` | Active states, emphasis |

### Secondary Colors - Sky and Earth Tones

| Color | Hex | Variable | Usage |
|-------|-----|----------|-------|
| ![#5B8FA3](https://via.placeholder.com/20/5B8FA3/5B8FA3) Horizon Blue | `#5B8FA3` | `--color-secondary` | Secondary actions, info |
| ![#7FAABB](https://via.placeholder.com/20/7FAABB/7FAABB) Sky Blue | `#7FAABB` | `--color-secondary-light` | Backgrounds, subtle accents |
| ![#456B7A](https://via.placeholder.com/20/456B7A/456B7A) Deep Ocean | `#456B7A` | `--color-secondary-dark` | Depth, shadows |

### Accent Colors - Community Warmth

| Color | Hex | Variable | Usage |
|-------|-----|----------|-------|
| ![#C85C5C](https://via.placeholder.com/20/C85C5C/C85C5C) Welcoming Red | `#C85C5C` | `--color-accent` | Highlights, errors |
| ![#D98585](https://via.placeholder.com/20/D98585/D98585) Soft Coral | `#D98585` | `--color-accent-light` | Gentle emphasis |
| ![#A04646](https://via.placeholder.com/20/A04646/A04646) Rich Burgundy | `#A04646` | `--color-accent-dark` | Strong emphasis |

### Neutral Colors - Natural Materials

| Color | Hex | Variable | Usage |
|-------|-----|----------|-------|
| ![#F8F6F4](https://via.placeholder.com/20/F8F6F4/F8F6F4) Warm White | `#F8F6F4` | `--color-neutral-100` | Backgrounds |
| ![#E8E4E0](https://via.placeholder.com/20/E8E4E0/E8E4E0) Light Sand | `#E8E4E0` | `--color-neutral-200` | Secondary backgrounds |
| ![#D1CBC3](https://via.placeholder.com/20/D1CBC3/D1CBC3) Stone | `#D1CBC3` | `--color-neutral-300` | Borders, dividers |
| ![#A39C94](https://via.placeholder.com/20/A39C94/A39C94) Weathered Wood | `#A39C94` | `--color-neutral-400` | Disabled states |
| ![#73695E](https://via.placeholder.com/20/73695E/73695E) Dark Wood | `#A39C94` | `--color-neutral-500` | Tertiary text |
| ![#4A433B](https://via.placeholder.com/20/4A433B/4A433B) Charcoal | `#4A433B` | `--color-neutral-600` | Secondary text |
| ![#2D2821](https://via.placeholder.com/20/2D2821/2D2821) Deep Shadow | `#2D2821` | `--color-neutral-700` | Dark backgrounds |
| ![#1A1612](https://via.placeholder.com/20/1A1612/1A1612) Almost Black | `#1A1612` | `--color-neutral-800` | Primary text, dark mode |

### Semantic Colors

| Purpose | Hex | Variable |
|---------|-----|----------|
| Success | ![#5A9367](https://via.placeholder.com/20/5A9367/5A9367) `#5A9367` | `--color-success` |
| Warning | ![#D9A538](https://via.placeholder.com/20/D9A538/D9A538) `#D9A538` | `--color-warning` |
| Error | ![#C85C5C](https://via.placeholder.com/20/C85C5C/C85C5C) `#C85C5C` | `--color-error` |
| Info | ![#5B8FA3](https://via.placeholder.com/20/5B8FA3/5B8FA3) `#5B8FA3` | `--color-info` |

## Typography

### Font Families

- **Body & Headings:** Open Sans (Google Fonts)
  - Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Special Elements:** TT2020 (monospace) - *Note: TT2020 requires separate licensing*
- **Code:** SF Mono, Consolas, Monaco fallbacks

### Font Scales

Using fluid typography with `clamp()` for responsive scaling:

| Scale | Size Range | Variable |
|-------|------------|----------|
| xs | 12-14px | `--font-size-xs` |
| sm | 14-16px | `--font-size-sm` |
| base | 16-18px | `--font-size-base` |
| md | 18-20px | `--font-size-md` |
| lg | 20-24px | `--font-size-lg` |
| xl | 24-32px | `--font-size-xl` |
| 2xl | 32-48px | `--font-size-2xl` |
| 3xl | 40-64px | `--font-size-3xl` |

### Line Heights

- **Tight** (`1.25`) - Headings, compact UI
- **Snug** (`1.375`) - Subheadings
- **Normal** (`1.5`) - Body text
- **Relaxed** (`1.625`) - Long-form content
- **Loose** (`2.0`) - Special emphasis

## Spacing Scale

Based on 4px (0.25rem) increments:

| Variable | Value | Pixels |
|----------|-------|--------|
| `--space-1` | 0.25rem | 4px |
| `--space-2` | 0.5rem | 8px |
| `--space-3` | 0.75rem | 12px |
| `--space-4` | 1rem | 16px |
| `--space-5` | 1.25rem | 20px |
| `--space-6` | 1.5rem | 24px |
| `--space-8` | 2rem | 32px |
| `--space-10` | 2.5rem | 40px |
| `--space-12` | 3rem | 48px |
| `--space-16` | 4rem | 64px |
| `--space-20` | 5rem | 80px |
| `--space-24` | 6rem | 96px |

## Border Radius

- **sm** (`4px`) - Buttons, inputs, small cards
- **md** (`8px`) - Cards, modals
- **lg** (`12px`) - Large cards, featured content
- **xl** (`16px`) - Hero sections
- **full** (`9999px`) - Pills, avatar shapes

## Shadows

Layered, subtle shadows using neutral tones:

- **xs** - Minimal depth
- **sm** - Buttons, inputs
- **md** - Cards, dropdown menus
- **lg** - Modals, popovers
- **xl** - Full-page overlays

## Transitions

- **Fast** (`150ms`) - Hover states, simple interactions
- **Base** (`250ms`) - Default animations
- **Slow** (`350ms`) - Complex state changes

Using `cubic-bezier(0.4, 0, 0.2, 1)` for natural motion.

## Z-Index Scale

Organized layers for predictable stacking:

| Layer | Value | Usage |
|-------|-------|-------|
| `--z-base` | 0 | Default layer |
| `--z-dropdown` | 1000 | Dropdown menus |
| `--z-sticky` | 1100 | Sticky headers |
| `--z-fixed` | 1200 | Fixed navigation |
| `--z-modal-backdrop` | 1300 | Modal overlays |
| `--z-modal` | 1400 | Modal content |
| `--z-popover` | 1500 | Popovers, tooltips |
| `--z-tooltip` | 1600 | Tooltips (highest) |

## Breakpoints

| Name | Value | Variable |
|------|-------|----------|
| sm | 640px | `--breakpoint-sm` |
| md | 768px | `--breakpoint-md` |
| lg | 1024px | `--breakpoint-lg` |
| xl | 1280px | `--breakpoint-xl` |
| 2xl | 1536px | `--breakpoint-2xl` |

## Usage Examples

### Using Colors

```css
.button-primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.button-primary:hover {
  background-color: var(--color-primary-dark);
}
```

### Using Typography

```css
.hero-title {
  font-family: var(--font-heading);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.body-text {
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
}
```

### Using Spacing

```css
.card {
  padding: var(--space-6);
  margin-bottom: var(--space-8);
  gap: var(--space-4);
}
```

### Using Shadows and Transitions

```css
.elevated-card {
  box-shadow: var(--shadow-md);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.elevated-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

## Accessibility

All colors meet WCAG AA contrast requirements:

- **Primary on white:** 4.5:1 minimum
- **Text on backgrounds:** 4.5:1 for normal text, 3:1 for large text
- **Focus indicators:** 2px solid outline with 2px offset

## Future Enhancements

- Dark mode color palette (commented in variables.css)
- TT2020 font integration (requires licensing)
- Additional semantic color variants
- Component-specific design tokens
