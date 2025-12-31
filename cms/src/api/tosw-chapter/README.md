# TOSW Chapter Content Type

## Overview
The TOSW (The Open Source Way) Chapter content type stores chapters from The Open Source Way guidebook, synced from the GitHub repository at https://github.com/theopensourceway/guidebook.

## Purpose
- Store and manage chapters from The Open Source Way guidebook
- Enable content sync from GitHub repository
- Provide semantic search capabilities for guidebook content
- Maintain proper attribution and licensing (CC BY-SA 4.0)

## Schema Fields

### Core Content
- **title** (string, required): Chapter title
- **slug** (uid, required): URL-friendly identifier (auto-generated from title)
- **description** (text, max 500 chars): Short chapter summary
- **content** (richtext): Full chapter content in markdown/richtext format

### Organization
- **section** (string, required): Guidebook section (e.g., "Introduction", "Community", "Governance")
- **section_order** (integer, min 0): Order within the overall guidebook (default: 0)
- **chapter_order** (integer, min 0): Order within the section (default: 0)

### GitHub Sync
- **github_path** (string): Path to file in GitHub repository
- **github_sha** (string): Git commit SHA for tracking changes
- **source** (enum): Content source
  - `github-tosw`: Synced from GitHub (default)
  - `manual`: Manually created/edited
- **sync_locked** (boolean): If true, prevents automatic sync from GitHub (default: false)

### Metadata
- **external_url** (string): Link to original content on theopensourceway.org
- **license** (string): Content license (default: "CC BY-SA 4.0")

### Relations
- **category** (manyToOne): Single category assignment
- **tags** (manyToMany): Multiple tags for categorization

## Draft & Publish
Supports Strapi's draft/publish workflow:
- Drafts can be edited without affecting published content
- Published content is visible via the API
- Unpublished drafts are hidden from public API

## Lifecycle Hooks
Located in `content-types/tosw-chapter/lifecycles.ts`:

### Current (Placeholder)
- **afterCreate**: Logs chapter creation
- **afterUpdate**: Logs chapter updates
- **afterDelete**: Logs chapter deletion
- **afterDeleteMany**: Logs bulk deletion

### Future Integration (TODO)
- Sync to ZeroDB Tables API
- Generate and store embeddings for semantic search
- Track content sync events
- Respect `sync_locked` flag to prevent overwrites

## API Endpoints
Standard Strapi REST endpoints (auto-generated):

```
GET    /api/tosw-chapters          # List chapters
GET    /api/tosw-chapters/:id      # Get single chapter
POST   /api/tosw-chapters          # Create chapter
PUT    /api/tosw-chapters/:id      # Update chapter
DELETE /api/tosw-chapters/:id      # Delete chapter
```

Query parameters support:
- Filtering: `?filters[section][$eq]=Introduction`
- Sorting: `?sort=section_order:asc,chapter_order:asc`
- Pagination: `?pagination[page]=1&pagination[pageSize]=25`
- Population: `?populate[category]=*&populate[tags]=*`

## Usage Examples

### Creating a Chapter
```typescript
const chapter = await strapi.entityService.create('api::tosw-chapter.tosw-chapter', {
  data: {
    title: 'Introduction to Open Source',
    section: 'Introduction',
    section_order: 1,
    chapter_order: 1,
    content: '# Introduction\n\nThis chapter covers...',
    source: 'github-tosw',
    github_path: 'introduction/getting-started.adoc',
    github_sha: 'abc123...',
    external_url: 'https://theopensourceway.org/introduction/',
    license: 'CC BY-SA 4.0',
    publishedAt: new Date(),
  },
});
```

### Querying Chapters by Section
```typescript
const chapters = await strapi.entityService.findMany('api::tosw-chapter.tosw-chapter', {
  filters: { section: 'Community' },
  sort: { chapter_order: 'asc' },
  populate: ['category', 'tags'],
});
```

### Locking Chapter from Sync
```typescript
await strapi.entityService.update('api::tosw-chapter.tosw-chapter', chapterId, {
  data: { sync_locked: true },
});
```

## Testing
To test the content type after Strapi restart:

1. Start Strapi: `cd cms && npm run develop`
2. Access admin: http://localhost:1337/admin
3. Navigate to Content Manager > TOSW Chapters
4. Create a test chapter
5. Verify lifecycle hooks log to console
6. Test relations with categories and tags
7. Test draft/publish workflow

## Integration Notes

### GitHub Sync (Future)
- Sync script will read from https://github.com/theopensourceway/guidebook
- Parse AsciiDoc files and convert to richtext
- Extract metadata from frontmatter
- Update only if `github_sha` differs and `sync_locked` is false

### ZeroDB Sync (Future)
- Store full chapter content in Tables API
- Generate embeddings for semantic search
- Enable cross-content search (blog posts + TOSW chapters)
- Track sync events for monitoring

## License
Content stored in this content type is licensed under CC BY-SA 4.0 as specified in The Open Source Way guidebook.

## Related Files
- Schema: `content-types/tosw-chapter/schema.json`
- Controller: `controllers/tosw-chapter.ts`
- Service: `services/tosw-chapter.ts`
- Routes: `routes/tosw-chapter.ts`
- Lifecycles: `content-types/tosw-chapter/lifecycles.ts`
- Category schema: `../category/content-types/category/schema.json` (updated)
- Tag schema: `../tag/content-types/tag/schema.json` (updated)
