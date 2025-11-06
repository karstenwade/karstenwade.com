# Accessibility (WCAG AA Compliance)

This site follows Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards to ensure all visitors can access and use the content.

## Implemented Features

### Keyboard Navigation

**Skip Link:**
- A "Skip to main content" link appears when tabbing through the page
- Allows keyboard users to bypass navigation and jump directly to content
- Located at the very top of the page, before navigation

**Focus Indicators:**
- All interactive elements (links, buttons) have visible focus outlines
- 2px solid outline in primary brand color
- 2px offset for clear visibility
- Applies to: links, buttons, inputs, textareas, selects, and tabbable elements

**Tab Order:**
- Logical tab order follows visual layout
- All interactive elements are keyboard accessible
- No keyboard traps

### Semantic HTML

**Landmark Regions:**
- `<nav>` for navigation menu
- `<main id="main-content">` for page content
- `<footer>` for site footer
- Proper heading hierarchy (`<h1>` through `<h6>`)

**ARIA Labels:**
- Navigation has `aria-label="Main navigation"`
- Loading states use `aria-live="polite"` and `aria-busy="true"`
- Hamburger menu uses `aria-expanded` and `aria-controls`
- All form inputs have associated labels

### Screen Reader Support

**Alt Text:**
- All images have descriptive alt text
- Decorative images use empty alt (`alt=""`)
- Icons have `aria-label` or `aria-hidden="true"` as appropriate

**Live Regions:**
- Loading indicators use `aria-live` for status updates
- Dynamic content changes are announced to screen readers

**Link Text:**
- All links have descriptive text
- No "click here" or ambiguous link text
- External links indicated with `rel="noopener noreferrer"`

### Color Contrast

**WCAG AA Compliance:**
- Text color: 4.5:1 minimum contrast ratio for normal text
- Large text (18pt+): 3:1 minimum contrast ratio
- Primary brand color chosen for accessibility
- Focus indicators have 3:1 contrast against background

**Color Independence:**
- Information never conveyed by color alone
- Interactive states use multiple indicators (color + underline/border)

### Mobile Accessibility

**Touch Targets:**
- Minimum 44x44px touch target size for interactive elements
- Adequate spacing between tappable elements
- Responsive design scales well on all devices

**Viewport:**
- Proper viewport meta tag for mobile rendering
- Content reflows without horizontal scrolling
- Text resizable up to 200% without loss of functionality

## Testing

### Automated Testing

**axe-core:**
```bash
npm install -D @axe-core/react axe-core
```

The site is tested with axe-core for automated accessibility audits.

### Manual Testing

**Keyboard Navigation:**
1. Use Tab to navigate through all interactive elements
2. Verify skip link appears when tabbing from top
3. Ensure all functionality available without mouse
4. Check modal/dropdown keyboard accessibility

**Screen Readers:**
- Test with NVDA (Windows) or VoiceOver (Mac)
- Verify all content is announced properly
- Check landmark navigation
- Confirm form labels are associated

**Browser Testing:**
- Chrome with built-in Lighthouse accessibility audit
- Firefox Accessibility Inspector
- Safari VoiceOver

## Known Accessibility Features

✅ **Keyboard Navigation:**
- Skip to main content link
- Visible focus indicators on all interactive elements
- Logical tab order

✅ **Semantic HTML:**
- Proper heading hierarchy
- Landmark regions (nav, main, footer)
- Descriptive link text

✅ **ARIA:**
- Labels on navigation
- Live regions for dynamic content
- Proper button/link roles

✅ **Color Contrast:**
- WCAG AA compliant color combinations
- 4.5:1 ratio for body text
- 3:1 ratio for large text and UI components

✅ **Mobile:**
- Responsive design
- Touch target sizes
- No pinch-zoom required

## Reporting Accessibility Issues

If you encounter accessibility barriers on this site, please report them by:
1. Opening an issue on GitHub
2. Including details about:
   - The accessibility issue
   - Which page/feature is affected
   - Your assistive technology (if applicable)
   - Browser and operating system

We are committed to maintaining and improving accessibility.

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe Accessibility Testing](https://www.deque.com/axe/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
