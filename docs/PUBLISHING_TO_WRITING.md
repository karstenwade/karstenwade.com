# Publishing to the Writing Section

This guide explains how to add new content (poetry, essays, and fiction) to the Writing section of karstenwade.com.

## Overview

The Writing section displays three types of creative content:
- **Poetry**: Verse with specific formatting and line breaks
- **Essays**: Personal essays and reflective writing
- **Fiction**: Short stories and narrative fiction

Each type has its own data file, component, and interface.

## Table of Contents

1. [Adding Poetry](#adding-poetry)
2. [Adding Essays](#adding-essays)
3. [Adding Fiction](#adding-fiction)
4. [Metadata Fields](#metadata-fields)
5. [Featured Content](#featured-content)
6. [Testing Locally](#testing-locally)

---

## Adding Poetry

### File Location
`data/poetry.ts`

### Interface
```typescript
export interface Poem {
  title: string
  excerpt: string
  firstLine: string
  fullText: string
  dateWritten: string
  form: string
  theme: string
  tags: string[]
  slug: string
  featured: boolean
}
```

### Example

```typescript
{
  title: 'My Poem Title',
  excerpt: 'First few lines\nof the poem\nfor preview',
  firstLine: 'First few lines',
  fullText: `Complete poem text here
With line breaks preserved
     Indentation is maintained
Using 5 spaces for indented lines

Stanza breaks are preserved with blank lines`,
  dateWritten: '2024-01-15',
  form: 'Free Verse',
  theme: 'Nature, time, meditation',
  tags: ['nature', 'meditation', 'time'],
  slug: 'my-poem-title',
  featured: true,
}
```

### Important: Formatting Preservation

Poetry requires **exact formatting** to preserve line breaks and indentation:

1. **Line Breaks**: Use actual newlines (`\n`) in the text
2. **Indentation**: Use 5 spaces at the start of indented lines
3. **Stanza Breaks**: Leave blank lines between stanzas
4. **Template Literals**: Always use backticks (\`) for `fullText` and `excerpt`

The Poetry component uses `white-space: pre-wrap` CSS to render formatting exactly as written.

**Correct Example:**
```typescript
fullText: `Standing on
     the very sands of time
The river is the rhyme

A new stanza begins here
     with indentation preserved`
```

**Incorrect Example:**
```typescript
fullText: "Standing on the very sands of time The river is the rhyme"  // ❌ Lost formatting
```

### Steps to Add a Poem

1. Open `data/poetry.ts`
2. Add a new object to the `poems` array
3. Fill in all required fields
4. Ensure `slug` is URL-friendly (lowercase, hyphens)
5. Preserve exact formatting in `fullText` and `excerpt`
6. Test locally to verify formatting

---

## Adding Essays

### File Location
`data/essays.ts`

### Interface
```typescript
export interface Essay {
  title: string
  excerpt: string
  fullText: string
  dateWritten: string
  theme: string
  wordCount: number
  tags: string[]
  slug: string
  featured: boolean
}
```

### Example

```typescript
{
  title: 'On Writing and Identity',
  excerpt: "Opening paragraph or first few sentences that hook the reader and introduce the essay's theme.",
  fullText: `Opening paragraph here.

Second paragraph with more depth and exploration of ideas.

Third paragraph continuing the narrative thread.

Closing thoughts and conclusions.`,
  dateWritten: '2024-01-15',
  theme: 'Writing, identity, creativity',
  wordCount: 650,
  tags: ['writing', 'identity', 'creativity', 'essays'],
  slug: 'on-writing-and-identity',
  featured: true,
}
```

### Formatting Notes

- **Paragraphs**: Separate with double newlines (`\n\n`)
- **Italics**: Use `*text*` for italic emphasis
- **Bold**: Use `**text**` for bold (if needed)
- **Word Count**: Actual word count of the full text

### Steps to Add an Essay

1. Open `data/essays.ts`
2. Add a new object to the `essays` array
3. Fill in all required fields
4. Use double newlines between paragraphs
5. Calculate word count
6. Test locally

---

## Adding Fiction

### File Location
`data/fiction.ts`

### Interface
```typescript
export interface Story {
  title: string
  excerpt: string
  fullText: string
  dateWritten: string
  genre: string
  theme: string
  wordCount: number
  tags: string[]
  slug: string
  featured: boolean
}
```

### Example

```typescript
{
  title: 'The Last Commit',
  excerpt: "She stared at the terminal, cursor blinking accusingly. The repository hadn't been touched in three years.",
  fullText: `She stared at the terminal, cursor blinking accusingly. The repository hadn't been touched in three years.

It had been her first open source project. The one that taught her everything about collaboration, about building in public, about the beautiful chaos of distributed teamwork.

Now it sat dormant, a digital ghost town.

She typed: git commit -m "The end is also a beginning"`,
  dateWritten: '2024-01-15',
  genre: 'Flash Fiction',
  theme: 'Open source, nostalgia, new beginnings',
  wordCount: 420,
  tags: ['open-source', 'technology', 'flash-fiction'],
  slug: 'the-last-commit',
  featured: false,
}
```

### Formatting Notes

Same as essays:
- Separate paragraphs with double newlines
- Use `*` for italics, `**` for bold
- Include actual word count

### Steps to Add a Story

1. Open `data/fiction.ts`
2. Add a new object to the `stories` array
3. Fill in all required fields
4. Calculate word count
5. Test locally

---

## Metadata Fields

### Common Fields (All Types)

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `title` | string | Full title of the work | `"Reflections on Code"` |
| `excerpt` | string | Preview text (first lines/paragraph) | `"Opening lines..."` |
| `fullText` | string | Complete text with formatting | `Full text here...` |
| `dateWritten` | string | ISO date format (YYYY-MM-DD) | `"2024-01-15"` |
| `theme` | string | Main themes (comma-separated) | `"Time, nature, meditation"` |
| `tags` | string[] | Keyword tags for search | `['nature', 'time']` |
| `slug` | string | URL-friendly identifier | `"my-poem-title"` |
| `featured` | boolean | Show on featured/top | `true` or `false` |

### Poetry-Specific Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `firstLine` | string | Opening line for sorting | `"When meditating in a place"` |
| `form` | string | Poetic form | `"Free Verse"`, `"Sonnet"` |

### Essays & Fiction-Specific Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `wordCount` | number | Total words in fullText | `730` |

### Fiction-Specific Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `genre` | string | Story genre | `"Flash Fiction"`, `"Short Story"` |

---

## Featured Content

The `featured` flag controls whether content appears prominently:

```typescript
featured: true   // Shows first, highlighted
featured: false  // Normal listing
```

**Best practices:**
- Feature 1-3 poems maximum
- Feature 1-2 essays maximum
- Feature 0-1 fiction pieces
- Update featured content periodically

---

## Testing Locally

Before committing new content:

### 1. Start the development server
```bash
npm run dev
```

### 2. Navigate to the Writing page
Open `http://localhost:3001/writing` in your browser

### 3. Check each tab
- **Poetry**: Verify formatting, line breaks, indentation
- **Essays**: Check paragraph breaks, readability
- **Fiction**: Verify story displays correctly

### 4. Test expand/collapse
Click "Read Full Poem/Essay/Story" to ensure full text displays

### 5. Verify metadata
- Date displays correctly
- Tags are appropriate
- Theme is clear
- Word count is accurate (for essays/fiction)

### 6. Check mobile responsiveness
Resize browser window to test mobile layout

### 7. Accessibility check
- Use keyboard navigation (Tab key)
- Test screen reader compatibility
- Verify ARIA labels

---

## Commit Process

After adding new content:

1. **Test locally** (see above)
2. **Stage changes**:
   ```bash
   git add data/poetry.ts    # or essays.ts or fiction.ts
   ```
3. **Commit with descriptive message**:
   ```bash
   git commit -m "Add new poem: [Title]"
   ```
4. **Push to repository**:
   ```bash
   git push
   ```
5. **Deployment**: GitHub Actions will automatically build and deploy

---

## Common Issues & Solutions

### Poetry formatting lost

**Problem**: Line breaks and indentation don't appear

**Solution**:
- Use template literals (backticks)
- Use actual newlines, not `\n` escape sequences in excerpt
- Add 5 spaces for indentation
- Check that Poetry.css has `white-space: pre-wrap`

### Essay/Fiction paragraphs run together

**Problem**: All text appears as one block

**Solution**:
- Use double newlines (`\n\n`) between paragraphs
- Component splits on `\n\n` to create `<p>` elements

### Content doesn't appear

**Problem**: Added content to data file but doesn't show

**Solution**:
- Check TypeScript syntax (commas, brackets)
- Verify slug is unique
- Check browser console for errors
- Restart dev server

### Featured content not appearing first

**Problem**: Featured items don't appear at top

**Solution**:
- Currently featured items appear in array order
- Place featured items first in the array
- Or implement sorting logic in component

---

## Questions?

For questions or issues:
1. Check existing content in data files for examples
2. Review component code in `app/components/`
3. Test locally before committing
4. Refer to PRD.md for architecture details

---

**Last Updated**: 2024-11-16
**Version**: 1.0
