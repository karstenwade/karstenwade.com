# GitHub Sync Usage Guide

This guide shows how to sync content from GitHub repositories into the Strapi CMS.

## Quick Start

### Prerequisites

1. Install dependencies:
```bash
cd cms
npm install
```

2. (Optional) Set GitHub token for higher rate limits:
```bash
export GITHUB_ACCESS_TOKEN=ghp_your_token_here
```

### Sync Papers from karstenwade/papers

```bash
cd cms
npm run sync:papers
```

This will:
- Fetch all markdown files from `karstenwade/papers/papers/` directory
- Parse frontmatter (title, abstract, version, etc.)
- Create or update entries in Strapi's `api::paper.paper` content type
- Skip files that haven't changed (based on SHA)
- Skip locked entries (`sync_locked: true`)

Example output:
```
[Sync Papers] Starting...
[Sync Papers] Fetching papers from GitHub...
[GitHub Sync] Starting papers sync...
[GitHub Sync] Found 3 markdown files
[GitHub Sync] Created paper: papers/Understanding_CollabX.md
[GitHub Sync] Updated paper: papers/Open_Source_Community.md
[GitHub Sync] Papers sync complete: 1 created, 1 updated, 1 unchanged, 0 errors

═══════════════════════════════════════════
         SYNC COMPLETE
═══════════════════════════════════════════
✓ Created:    1
↻ Updated:    1
- Unchanged:  1
✗ Errors:     0
═══════════════════════════════════════════
```

### Sync TOSW Chapters from theopensourceway/guidebook

```bash
cd cms
npm run sync:tosw
```

This will:
- Fetch all markdown files from `theopensourceway/guidebook` repository
- Extract title from first H1, description from first paragraph
- Determine section from directory structure
- Extract chapter order from filename (e.g., `01-intro.md` → 1)
- Create or update entries in `api::tosw-chapter.tosw-chapter`
- Apply CC BY-SA 4.0 license metadata

## Advanced Usage

### Force Refresh

Re-sync all files even if SHA hasn't changed:

```bash
cd cms
npm run sync:papers -- --force
npm run sync:tosw -- --force
```

Use this when:
- Testing mapping changes
- Recovering from data corruption
- Manual edits need to be overwritten (except locked entries)

### Protecting Entries from Sync

To prevent an entry from being updated or deleted by GitHub sync:

1. In Strapi admin UI, edit the entry
2. Set `sync_locked: true`
3. Save

OR via code:

```typescript
await strapi.documents('api::paper.paper').update({
  documentId: 'some-document-id',
  data: {
    sync_locked: true
  }
});
```

Locked entries:
- Will NOT be updated during sync (even with `--force`)
- Will NOT be deleted by webhook events
- Can still be manually edited in Strapi admin

## Content Type Schemas

### Paper Schema

**Required fields:**
- `title` (String) - From frontmatter
- `abstract` (Text) - From frontmatter

**Optional fields:**
- `description` (String) - From frontmatter or truncated abstract
- `content` (Richtext) - Full markdown content
- `version` (String) - Default: "1.0"
- `publication_date` (Date) - From frontmatter
- `last_updated` (Date) - From frontmatter
- `pdf_url` (String) - From frontmatter
- `doi` (String) - From frontmatter
- `external_url` (String) - GitHub raw file URL
- `github_path` (String) - File path in repository
- `github_sha` (String) - Commit SHA for change detection
- `source` (String) - Always "github-papers"
- `featured` (Boolean) - From frontmatter, default: false
- `sync_locked` (Boolean) - Prevents sync updates

### TOSW Chapter Schema

**Required fields:**
- `title` (String) - Extracted from first H1
- `content` (Richtext) - Full markdown content

**Optional fields:**
- `description` (String) - First paragraph after title
- `section` (String) - Directory name (e.g., "getting-started")
- `section_order` (Integer) - Currently always 0
- `chapter_order` (Integer) - From filename prefix (e.g., "01-" → 1)
- `github_path` (String) - File path in repository
- `github_sha` (String) - Commit SHA for change detection
- `external_url` (String) - GitHub raw file URL
- `source` (String) - Always "github-tosw"
- `license` (String) - Always "CC BY-SA 4.0"
- `sync_locked` (Boolean) - Prevents sync updates

## Frontmatter Examples

### Paper Frontmatter

```yaml
---
title: Understanding Collaborative Experiences
abstract: |
  This paper explores the nature of collaborative work in open source
  communities, examining how developers coordinate efforts and share knowledge.
description: A deep dive into open source collaboration patterns
version: 1.0
publicationDate: 2024-01-15
category: community
tags:
  - open-source
  - collaboration
featured: false
pdfUrl: https://example.com/paper.pdf
doi: 10.1234/example.5678
---

# Introduction

This paper explores...
```

Maps to Strapi fields:
- `title`: "Understanding Collaborative Experiences"
- `abstract`: Full abstract text
- `description`: "A deep dive into open source collaboration patterns"
- `version`: "1.0"
- `publication_date`: 2024-01-15
- `pdf_url`: "https://example.com/paper.pdf"
- `doi`: "10.1234/example.5678"
- `featured`: false

### TOSW Chapter (No Frontmatter Needed)

```markdown
# Getting Started with Open Source

This chapter introduces the basics of open source collaboration
and community building.

## What is Open Source?

Open source is a development model...
```

Maps to Strapi fields:
- `title`: "Getting Started with Open Source"
- `description`: "This chapter introduces the basics of open source collaboration and community building."
- `content`: Full markdown
- `section`: "getting-started" (from directory)
- `chapter_order`: 1 (from "01-intro.md" filename)
- `license`: "CC BY-SA 4.0"

## Automation Options

### Manual Sync (Current)

Run scripts manually when you want to sync:
```bash
npm run sync:papers
npm run sync:tosw
```

### Cron Job (Future)

Add to `cms/config/cron-tasks.ts`:

```typescript
export default {
  // Daily sync at 3:00 AM UTC
  '0 3 * * *': async ({ strapi }) => {
    const githubSyncService = strapi.service('github-sync');
    await githubSyncService.syncPapers();
    await githubSyncService.syncToswChapters();
  },
};
```

### GitHub Webhook (Future)

Real-time sync when files change in GitHub:

1. Configure webhook in GitHub repo settings:
   - Payload URL: `https://your-domain.com/api/github-webhook`
   - Content type: `application/json`
   - Secret: (set in `GITHUB_WEBHOOK_SECRET` env var)
   - Events: Push events only

2. Set environment variable:
```bash
GITHUB_WEBHOOK_SECRET=your-webhook-secret
```

3. Webhook handler already implemented at:
   - Route: `/api/github-webhook`
   - Controller: `cms/src/api/github-webhook/controllers/github-webhook.ts`

## Troubleshooting

### Rate Limiting

**Symptom**: "GitHub API error: 403 rate limit exceeded"

**Solution**: Set `GITHUB_ACCESS_TOKEN` environment variable

```bash
export GITHUB_ACCESS_TOKEN=ghp_your_token_here
```

**Rate limits:**
- Without token: 60 requests/hour
- With token: 5000 requests/hour

### Parse Errors

**Symptom**: "Failed to parse frontmatter"

**Cause**: Malformed YAML in frontmatter

**Solution**: Check YAML syntax:
- Use proper indentation (2 spaces)
- Quote strings with special characters
- Use `|` for multiline strings
- Ensure `---` delimiters are on their own lines

### Entry Not Updating

**Symptom**: File changed in GitHub but Strapi entry unchanged

**Possible causes:**
1. Entry is `sync_locked`
2. SHA hasn't actually changed (GitHub may cache)
3. Syncing wrong repository/branch

**Solution**:
```bash
# Check if locked in Strapi admin UI
# Or force refresh
npm run sync:papers -- --force
```

### Network Errors

**Symptom**: "Failed to fetch file content: 404"

**Possible causes:**
1. File doesn't exist in GitHub
2. Wrong branch name
3. Private repo without token
4. Incorrect repository path

**Solution**: Verify file exists at:
```
https://raw.githubusercontent.com/karstenwade/papers/main/papers/filename.md
```

## Architecture

The sync system has three layers:

### 1. GitHub Sync Service
**Location**: `cms/src/services/github-sync.ts`

**Responsibilities:**
- Fetch files from GitHub API
- Parse markdown frontmatter
- Map fields to Strapi format
- Create/update/delete Strapi entries
- SHA-based change detection

### 2. Sync Scripts
**Location**: `cms/scripts/sync-*.ts`

**Responsibilities:**
- Initialize Strapi instance
- Call sync service methods
- Display formatted results
- Clean shutdown

### 3. Webhook Handler
**Location**: `cms/src/api/github-webhook/`

**Responsibilities:**
- Verify GitHub webhook signature
- Parse webhook payload
- Route to appropriate sync method
- Handle single file changes

## Related Documentation

- **Service README**: `cms/src/services/README-github-sync.md`
- **Scripts README**: `cms/scripts/README.md`
- **Paper Schema**: `cms/src/api/paper/content-types/paper/schema.json`
- **TOSW Schema**: `cms/src/api/tosw-chapter/content-types/tosw-chapter/schema.json`

## License

- **Papers**: Copyright Karsten Wade (unless specified otherwise in frontmatter)
- **TOSW Chapters**: CC BY-SA 4.0 (The Open Source Way guidebook)
- **Sync Service Code**: Part of karstenwade.com project
