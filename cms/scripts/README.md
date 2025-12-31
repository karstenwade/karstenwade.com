# CMS Scripts

This directory contains utility scripts for managing the Strapi CMS.

## GitHub Sync Scripts

These scripts manually trigger synchronization of content from GitHub repositories into Strapi.

### Sync Papers

Syncs papers from the `karstenwade/papers` repository:

```bash
cd cms
npm run sync:papers
```

Force refresh (re-sync even if SHA matches):

```bash
cd cms
npm run sync:papers -- --force
```

### Sync TOSW Chapters

Syncs chapters from `theopensourceway/guidebook` repository:

```bash
cd cms
npm run sync:tosw
```

Force refresh:

```bash
cd cms
npm run sync:tosw -- --force
```

## Environment Variables

For higher GitHub API rate limits (recommended), set:

```bash
export GITHUB_ACCESS_TOKEN=ghp_your_token_here
```

Without a token: 60 requests/hour
With a token: 5000 requests/hour

## What Gets Synced?

### Papers
- **Source**: `karstenwade/papers/papers/*.md`
- **Content Type**: `api::paper.paper`
- **Fields**: title, abstract, content, version, publication_date, pdf_url, doi, etc.
- **Sync Strategy**: SHA-based change detection
- **Locked Protection**: Entries with `sync_locked: true` are skipped

### TOSW Chapters
- **Source**: `theopensourceway/guidebook/**/*.md`
- **Content Type**: `api::tosw-chapter.tosw-chapter`
- **Fields**: title, description, content, section, chapter_order, license
- **Sync Strategy**: SHA-based change detection
- **Locked Protection**: Entries with `sync_locked: true` are skipped

## Troubleshooting

### "GITHUB_ACCESS_TOKEN not set"

This is a warning, not an error. The script will work but with lower API rate limits.

### "Failed to parse frontmatter"

Check that the markdown file has valid YAML frontmatter:

```yaml
---
title: My Paper Title
abstract: Paper abstract here
---

# Content starts here
```

### "Strapi initialization failed"

Make sure Strapi is not already running. These scripts start their own Strapi instance.

### Network errors

The scripts will continue processing other files if one fails. Check the error output for specific file failures.

## Implementation Details

These scripts:
1. Initialize a Strapi instance (without starting the HTTP server)
2. Import the `github-sync` service
3. Call the appropriate sync method (`syncPapers()` or `syncToswChapters()`)
4. Display formatted results
5. Cleanly shut down Strapi
6. Exit with code 0 (success) or 1 (error)

See `/home/quaid/Documents/Projects/karstenwade.com/src/karstenwade.com/cms/src/services/README-github-sync.md` for full GitHub sync service documentation.
