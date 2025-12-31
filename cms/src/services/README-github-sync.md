# GitHub Sync Service

## Overview

The GitHub Sync Service automatically synchronizes markdown content from GitHub repositories to Strapi CMS. It supports two content types:

1. **Papers** - From `karstenwade/papers` repository
2. **TOSW Chapters** - From `theopensourceway/guidebook` repository

## Architecture

```
GitHub Repositories          GitHub Sync Service         Strapi CMS
─────────────────           ────────────────────        ──────────
karstenwade/papers    ─┐
                       │    ┌─────────────────┐
theopensourceway/      ├───►│ GitHubSyncService│──────► Documents API
  guidebook           ─┘    │                 │
                            │ - Parse MD      │
Webhook Events ────────────►│ - Map fields    │
(push, delete)              │ - SHA tracking  │
                            └─────────────────┘
```

## Features

- **SHA-based Change Detection**: Only syncs files when content changes
- **Frontmatter Parsing**: Uses `gray-matter` to extract metadata from markdown
- **Sync Lock Protection**: Respects `sync_locked` flag to prevent overwrites
- **Error Resilience**: Collects errors but continues processing other files
- **Webhook Support**: Single file sync for GitHub webhook events
- **Full Repository Sync**: Batch sync for cron jobs or manual triggers

## Installation

The service is already configured. Dependencies:
- `gray-matter` - Markdown frontmatter parsing (already in package.json)
- Strapi v5 Documents API

## Usage

### Full Repository Sync

```typescript
import githubSyncService from './services/github-sync';

// Sync all papers from karstenwade/papers
const papersResult = await githubSyncService.syncPapers();
console.log(`Created: ${papersResult.created}`);
console.log(`Updated: ${papersResult.updated}`);
console.log(`Unchanged: ${papersResult.unchanged}`);
console.log(`Errors: ${papersResult.errors.length}`);

// Sync all TOSW chapters from theopensourceway/guidebook
const toswResult = await githubSyncService.syncToswChapters();

// Force refresh (re-sync even if SHA matches)
const forceResult = await githubSyncService.syncPapers(true);
```

### Webhook Integration

```typescript
// In webhook controller (POST /api/github-webhook)
import githubSyncService from './services/github-sync';

// Handle file added or modified
const result = await githubSyncService.syncFile(
  'papers',                    // repository name
  'papers/my-paper.md',        // file path
  'main'                       // branch
);

if (result.success) {
  console.log(`Synced: ${result.documentId}`);
} else {
  console.error(`Error: ${result.error}`);
}

// Handle file deleted
const deleteResult = await githubSyncService.deleteFile(
  'guidebook',
  'getting-started/intro.md'
);
```

### Single File Sync

```typescript
// Sync a specific paper
const success = await githubSyncService.syncSinglePaper(
  'papers/Understanding_CollabX.md',
  'abc123...'  // GitHub SHA
);

// Sync a specific TOSW chapter
const success = await githubSyncService.syncSingleToswChapter(
  'getting-started/community-101.md',
  'def456...'
);
```

## Content Mapping

### Papers (karstenwade/papers)

**GitHub Frontmatter → Strapi Fields**

| Frontmatter Field | Strapi Field | Notes |
|-------------------|--------------|-------|
| `title` | `title` | Required |
| `abstract` | `abstract` | Required |
| `description` | `description` | From frontmatter or truncated abstract |
| `version` | `version` | Default: "1.0" |
| `publicationDate` | `publication_date` | ISO date string |
| `lastUpdated` | `last_updated` | ISO date string |
| `pdfUrl` | `pdf_url` | |
| `doi` | `doi` | |
| `featured` | `featured` | Default: false |
| (file path) | `github_path` | e.g., "papers/paper.md" |
| (commit SHA) | `github_sha` | For change detection |
| (computed) | `external_url` | GitHub raw URL |
| (constant) | `source` | "github-papers" |

**Example Paper Frontmatter:**

```yaml
---
title: Understanding Collaborative Experiences
abstract: A deep dive into the nature of collaborative work
version: 1.0
publicationDate: 2024-01-15
category: community
tags:
  - open-source
  - collaboration
featured: false
pdfUrl: https://example.com/paper.pdf
---

# Introduction

This paper explores...
```

### TOSW Chapters (theopensourceway/guidebook)

**Markdown Content → Strapi Fields**

| Source | Strapi Field | Extraction Method |
|--------|--------------|-------------------|
| First H1 | `title` | Regex: `/^#\s+(.+)$/m` |
| First paragraph | `description` | First non-heading line after title |
| Full markdown | `content` | Entire file content |
| Directory name | `section` | From file path |
| Filename number | `chapter_order` | e.g., "01-intro.md" → 1 |
| File path | `github_path` | e.g., "getting-started/01-intro.md" |
| Commit SHA | `github_sha` | For change detection |
| (computed) | `external_url` | GitHub raw URL |
| (constant) | `source` | "github-tosw" |
| (constant) | `license` | "CC BY-SA 4.0" |

**Example TOSW Chapter:**

```markdown
# Getting Started with Open Source

This chapter introduces the basics of open source collaboration
and community building.

## What is Open Source?

Open source is...
```

Maps to:
- **title**: "Getting Started with Open Source"
- **description**: "This chapter introduces the basics of open source collaboration and community building."
- **content**: Full markdown
- **section**: "getting-started" (from directory)
- **chapter_order**: 1 (from "01-" prefix)

## API Methods

### Class: GitHubSyncService

#### Full Sync Methods

**`syncPapers(forceRefresh?: boolean): Promise<BatchSyncResult>`**

Syncs all markdown files from `karstenwade/papers/papers/` directory.

- **forceRefresh**: If true, re-syncs even if SHA matches
- **Returns**: { created, updated, unchanged, errors[] }

**`syncToswChapters(forceRefresh?: boolean): Promise<BatchSyncResult>`**

Syncs all markdown files from `theopensourceway/guidebook` repository.

- Recursively processes section directories
- Skips hidden and special directories (`.git`, `node_modules`, etc.)
- **Returns**: { created, updated, unchanged, errors[] }

#### Single File Methods

**`syncSinglePaper(filePath: string, sha: string): Promise<boolean>`**

Syncs a single paper file.

- **filePath**: Path to file in repository (e.g., "papers/paper.md")
- **sha**: GitHub commit SHA
- **Returns**: true on success, false on error

**`syncSingleToswChapter(filePath: string, sha: string): Promise<boolean>`**

Syncs a single TOSW chapter file.

- Extracts section from file path
- **Returns**: true on success, false on error

#### Webhook Methods

**`syncFile(repository: string, filePath: string, branch: string): Promise<SyncResult>`**

Routes file sync based on repository identifier.

- **repository**: "papers", "karstenwade/papers", "guidebook", or "theopensourceway/guidebook"
- **filePath**: Path to file in repository
- **branch**: Git branch name (e.g., "main")
- **Returns**: { success, documentId?, error? }

**`deleteFile(repository: string, filePath: string): Promise<SyncResult>`**

Deletes Strapi entry when file is removed from GitHub.

- Respects `sync_locked` flag (skips deletion)
- Returns success even if file not found
- **Returns**: { success, documentId?, error? }

#### Helper Methods

**`parseFrontmatter(markdown: string): ParsedMarkdown`**

Parses YAML frontmatter from markdown using `gray-matter`.

- **Returns**: { frontmatter: object, content: string }
- **Throws**: Error on malformed YAML

**`needsUpdate(entry: StrapiEntry | null, githubSha: string): boolean`**

Determines if entry needs updating based on SHA comparison.

- Returns `false` if entry is `sync_locked`
- Returns `true` if SHAs differ or entry has no SHA

**`mapPaperToStrapi(file: GitHubFile, parsed: ParsedMarkdown): any`**

Maps GitHub paper data to Strapi format.

**`mapToswChapterToStrapi(file: GitHubFile, parsed: ParsedMarkdown, section: string): any`**

Maps GitHub chapter data to Strapi format.

**`fetchRepoContents(owner: string, repo: string, path?: string): Promise<GitHubFile[]>`**

Fetches directory contents from GitHub API.

- Uses `GITHUB_ACCESS_TOKEN` env var if available
- **Throws**: Error on API failure

**`fetchFileContent(owner: string, repo: string, path: string, branch?: string): Promise<string>`**

Fetches raw file content from GitHub.

- Uses `raw.githubusercontent.com` URL
- Default branch: "main"

## Configuration

### Environment Variables

```bash
# Optional: Increase GitHub API rate limit (recommended)
GITHUB_ACCESS_TOKEN=ghp_your_token_here
```

Without a token, you're limited to 60 requests/hour. With a token: 5000 requests/hour.

### Repository Configuration

Edit `src/services/github-sync.ts` to change repositories:

```typescript
export class GitHubSyncService {
  public readonly papersRepo = 'karstenwade/papers';
  public readonly toswRepo = 'theopensourceway/guidebook';
  // ...
}
```

## Error Handling

The service follows these principles:

1. **Batch operations continue on errors**: If one file fails, others still process
2. **Errors are collected**: All errors returned in `errors[]` array
3. **Detailed logging**: All operations logged to Strapi console
4. **Graceful degradation**: Network errors don't crash the service

Example error handling:

```typescript
const result = await githubSyncService.syncPapers();

if (result.errors.length > 0) {
  console.error('Some files failed to sync:');
  result.errors.forEach(err => console.error(err));
}

console.log(`Successfully synced ${result.created + result.updated} files`);
```

## Sync Lock Protection

To prevent GitHub from overwriting manual edits in Strapi:

```typescript
// In Strapi admin UI or via API
await strapi.documents('api::paper.paper').update({
  documentId: 'some-id',
  data: {
    sync_locked: true  // Prevents future sync updates
  }
});
```

Locked entries:
- **Will NOT be updated** during sync (even with `forceRefresh`)
- **Will NOT be deleted** during webhook delete events
- Can still be manually edited in Strapi admin

## Testing

### Run Tests

```bash
cd cms
npm test -- github-sync.simple.test.ts
```

### Test Coverage

The test suite covers:
- Frontmatter parsing (valid, empty, malformed)
- SHA-based update detection
- Paper field mapping
- TOSW chapter field mapping (title, description, chapter order)
- Repository configuration
- Edge cases (long titles, special characters)

## Cron Job Integration

Add to `cms/config/cron-tasks.ts`:

```typescript
export default {
  // Daily sync at 3:00 AM UTC
  '0 3 * * *': async ({ strapi }) => {
    strapi.log.info('[Cron] Starting daily GitHub sync');

    const papersResult = await strapi.service('github-sync').syncPapers();
    const toswResult = await strapi.service('github-sync').syncToswChapters();

    strapi.log.info('[Cron] GitHub sync complete', {
      papers: papersResult,
      tosw: toswResult,
    });
  },
};
```

## Webhook Setup

### 1. Create Webhook Controller

File: `cms/src/api/github-webhook/controllers/github-webhook.ts`

```typescript
import githubSyncService from '../../../services/github-sync';

export default {
  async handleWebhook(ctx) {
    const { repository, action, ref, commits } = ctx.request.body;

    // Only process main branch pushes
    if (ref !== 'refs/heads/main') {
      return ctx.send({ status: 'skipped', reason: 'not main branch' });
    }

    const repoName = repository.name;
    const results = [];

    // Process modified/added files
    for (const commit of commits || []) {
      for (const file of [...commit.added, ...commit.modified]) {
        if (file.endsWith('.md')) {
          const result = await githubSyncService.syncFile(repoName, file, 'main');
          results.push({ file, result });
        }
      }

      // Process deleted files
      for (const file of commit.removed || []) {
        if (file.endsWith('.md')) {
          const result = await githubSyncService.deleteFile(repoName, file);
          results.push({ file, result, action: 'delete' });
        }
      }
    }

    return ctx.send({ status: 'success', results });
  },
};
```

### 2. Configure GitHub Webhook

In GitHub repository settings:

1. Go to Settings > Webhooks > Add webhook
2. **Payload URL**: `https://your-strapi.com/api/github-webhook`
3. **Content type**: `application/json`
4. **Secret**: (recommended for security)
5. **Events**: Just the push event
6. **Active**: ✓

### 3. Verify Webhook Signature (Recommended)

```typescript
import crypto from 'crypto';

function verifyGitHubSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}
```

## Performance Considerations

### Rate Limits

- **Without token**: 60 requests/hour
- **With token**: 5000 requests/hour
- **Recommendation**: Set `GITHUB_ACCESS_TOKEN` environment variable

### Batch Sync Performance

For large repositories:

```typescript
// Papers: ~10-20 files = ~30-60 API calls (list + fetch each file)
// TOSW: ~50-100 files across multiple sections = ~150-300 API calls
// Total: ~5-10 minutes for full sync
```

### Optimization Tips

1. **Use webhooks** for real-time updates (single file sync)
2. **Run cron daily** instead of hourly
3. **Enable caching** if GitHub API becomes bottleneck
4. **Skip unchanged files** (default behavior with SHA check)

## Troubleshooting

### Common Issues

**1. "GitHub API error: 403 rate limit exceeded"**

Solution: Set `GITHUB_ACCESS_TOKEN` environment variable

**2. "Failed to parse frontmatter"**

Cause: Malformed YAML in frontmatter
Solution: Check YAML syntax in the markdown file

**3. "Entry not updating despite changes"**

Check:
- Is `sync_locked` set to `true`?
- Does the GitHub SHA actually differ?
- Are you syncing the correct repository/branch?

**4. "Webhook not triggering sync"**

Check:
- Webhook is configured for "push" events
- Webhook URL is correct
- Files are markdown (.md extension)
- Changes are on the main branch

### Debug Mode

Enable detailed logging:

```typescript
// In sync method
strapi.log.debug('[GitHub Sync] Fetching file:', file.path);
strapi.log.debug('[GitHub Sync] Parsed frontmatter:', parsed.frontmatter);
```

## License

This service is part of the karstenwade.com CMS project.

**Content Licenses:**
- Papers: Copyright Karsten Wade (unless specified otherwise)
- TOSW Chapters: CC BY-SA 4.0 (The Open Source Way guidebook)

## Related Files

- Implementation: `src/services/github-sync.ts`
- Tests: `src/services/github-sync.simple.test.ts`
- Paper schema: `src/api/paper/content-types/paper/schema.json`
- TOSW schema: `src/api/tosw-chapter/content-types/tosw-chapter/schema.json`
- Plan document: `~/.claude/plans/lexical-juggling-karp.md`
