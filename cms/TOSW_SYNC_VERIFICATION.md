# TOSW Sync Verification Guide

This document helps you verify that the TOSW chapter sync is working correctly.

## Pre-Sync Checklist

Before running the sync, verify:

- [ ] Strapi database is initialized
- [ ] `tosw_chapters` content type exists in Strapi
- [ ] `.env` file exists (optional: contains GITHUB_ACCESS_TOKEN)
- [ ] Internet connection is active

## Running the Sync

```bash
cd cms
npm run sync:tosw
```

## Expected Repository Structure

The sync pulls from: `theopensourceway/guidebook`

**Expected sections** (directories in the repo):
- Community building sections (actual names will vary)
- Getting started guides
- Best practices
- Case studies
- Etc.

Each section contains numbered markdown files like:
- `01-introduction.md`
- `02-getting-started.md`
- `03-advanced-topics.md`

## Verification Steps

### 1. Check Sync Output

Expected console output:
```
[Sync TOSW] Starting...
[GitHub Sync] Starting TOSW chapters sync...
[GitHub Sync] Found X sections
[GitHub Sync] Processing Y files in [section-name]
[GitHub Sync] Created chapter: [path]
...
═══════════════════════════════════════════
         SYNC COMPLETE
═══════════════════════════════════════════
✓ Created:    X
↻ Updated:    Y
- Unchanged:  Z
✗ Errors:     0
═══════════════════════════════════════════
```

**What to verify:**
- "Created" count should be > 0 on first sync
- "Errors" should be 0
- Section names should make sense
- File paths should show `.md` files

### 2. Check Strapi Database

#### Via Strapi Admin UI

1. Start Strapi if not running:
   ```bash
   cd cms
   npm run develop
   ```

2. Go to: http://localhost:1337/admin

3. Navigate to: **Content Manager** → **TOSW Chapter**

4. Verify:
   - [ ] Chapters appear in the list
   - [ ] Titles are properly extracted (not filename)
   - [ ] Descriptions are populated
   - [ ] `section` field shows directory name
   - [ ] `chapter_order` shows correct numbering
   - [ ] `license` is "CC BY-SA 4.0"
   - [ ] `source` is "github-tosw"
   - [ ] `github_path` shows the file path
   - [ ] `github_sha` is populated

#### Via API

```bash
# Get all chapters
curl http://localhost:1337/api/tosw-chapters | jq

# Count chapters
curl -s http://localhost:1337/api/tosw-chapters | jq '.data | length'

# Get a specific chapter
curl http://localhost:1337/api/tosw-chapters/1 | jq
```

Expected response structure:
```json
{
  "data": [
    {
      "id": 1,
      "documentId": "abc123",
      "title": "Introduction to Open Source",
      "description": "This chapter introduces...",
      "content": "# Introduction to Open Source\n\n...",
      "section": "getting-started",
      "chapter_order": 1,
      "github_path": "getting-started/01-introduction.md",
      "github_sha": "abc123...",
      "license": "CC BY-SA 4.0",
      "source": "github-tosw",
      "publishedAt": "2024-12-27T..."
    }
  ]
}
```

### 3. Verify Field Mapping

Pick a random chapter and verify:

| Field | What to Check |
|-------|---------------|
| **title** | Should be from first H1, not filename |
| **description** | First paragraph after title, ~1-3 sentences |
| **content** | Full markdown content including headers |
| **section** | Directory name (e.g., "community-101") |
| **chapter_order** | Number from filename (e.g., "01-" → 1) |
| **github_path** | Full path like "section/01-file.md" |
| **github_sha** | 40-character SHA hash |
| **license** | Always "CC BY-SA 4.0" |
| **source** | Always "github-tosw" |

### 4. Test Re-Sync Behavior

Test that SHA-based change detection works:

```bash
# First sync (creates all)
npm run sync:tosw

# Second sync (should skip all)
npm run sync:tosw
# Expected: "Unchanged: X, Created: 0, Updated: 0"

# Force refresh (re-syncs all)
npm run sync:tosw -- --force
# Expected: "Updated: X" (all chapters updated)
```

### 5. Verify Markdown Parsing

Check that frontmatter is handled correctly:

**Files with frontmatter** should work:
```markdown
---
custom: metadata
---
# Chapter Title

First paragraph description.
```

**Files without frontmatter** should work:
```markdown
# Chapter Title

First paragraph description.
```

### 6. Edge Cases to Test

Test these scenarios:

- [ ] Files with long titles (>100 chars)
- [ ] Files with special characters in titles
- [ ] Files with complex markdown (tables, code blocks)
- [ ] Files without clear first paragraph
- [ ] Files with multiple H1 headers (should use first)
- [ ] Sections with no numbered files
- [ ] Files with unconventional numbering (e.g., "10-", "100-")

## Common Issues and Solutions

### No chapters created

**Possible causes:**
- Repository structure changed
- Network error
- GitHub API rate limit

**Debug steps:**
1. Check console output for errors
2. Verify repository exists: https://github.com/theopensourceway/guidebook
3. Check GITHUB_ACCESS_TOKEN is set
4. Try with `--force` flag

### Wrong titles extracted

**Cause:** Markdown doesn't start with H1

**Solution:** File should start with:
```markdown
# Actual Title Here

First paragraph...
```

### Missing descriptions

**Cause:** No paragraph immediately after title

**Solution:** Ensure structure:
```markdown
# Title

This is the description paragraph.

## Next Section
```

### Chapter order is 0

**Cause:** Filename doesn't start with number

**Expected:** `01-intro.md`, `02-basics.md`
**Problem:** `intro.md`, `basics.md`

### Sync locked warnings

**Cause:** Chapter has `sync_locked: true`

**To unlock:**
```javascript
// Via Strapi admin or API
await strapi.documents('api::tosw-chapter.tosw-chapter').update({
  documentId: 'chapter-id',
  data: { sync_locked: false }
});
```

## Performance Benchmarks

Expected sync times (varies by network):

| Chapters | Time (no cache) | Time (cached) |
|----------|----------------|---------------|
| 10-20    | 30-60s         | 5-10s         |
| 40-60    | 2-3 min        | 10-20s        |
| 100+     | 5-10 min       | 30-60s        |

With GITHUB_ACCESS_TOKEN: Much faster due to higher rate limits

## Data Integrity Checks

### Check for duplicates

```bash
# Via API - check for duplicate github_path
curl -s http://localhost:1337/api/tosw-chapters | \
  jq -r '.data[].github_path' | \
  sort | \
  uniq -d
# Should return empty (no duplicates)
```

### Check for missing fields

```bash
# Find chapters without required fields
curl -s http://localhost:1337/api/tosw-chapters | \
  jq '.data[] | select(.title == null or .content == null or .section == null)'
# Should return empty
```

### Verify unique slugs

```bash
# Check slug uniqueness
curl -s http://localhost:1337/api/tosw-chapters | \
  jq -r '.data[].slug' | \
  sort | \
  uniq -d
# Should return empty
```

## Reporting Issues

If you encounter issues:

1. **Collect information:**
   - Full console output
   - Error messages
   - Specific file paths that failed
   - Network status
   - GitHub API rate limit status

2. **Check logs:**
   - Strapi logs in console
   - Database queries (if needed)

3. **Test with a single file:**
   ```javascript
   // Via Strapi console
   const result = await githubSyncService.syncSingleToswChapter(
     'section-name/01-file.md',
     'sha-hash'
   );
   ```

## Success Criteria

The sync is successful when:

- ✓ All chapters from GitHub are in Strapi
- ✓ Titles are human-readable (not filenames)
- ✓ Descriptions are populated
- ✓ Content includes full markdown
- ✓ Sections match directory structure
- ✓ Chapter order reflects filename numbering
- ✓ No duplicate entries
- ✓ All fields are properly typed
- ✓ Re-sync skips unchanged files
- ✓ Force refresh updates all files

## Next Steps After Verification

Once verified:

1. **Set up automated sync:**
   - Add cron job (see SYNC_TOSW_INSTRUCTIONS.md)
   - Configure GitHub webhook (optional)

2. **Configure public API:**
   - Set permissions in Strapi admin
   - Test public API access

3. **Integrate with Next.js frontend:**
   - Update `src/lib/strapi.ts` to fetch TOSW chapters
   - Create display pages
   - Add navigation/search

4. **Monitor ongoing syncs:**
   - Check sync logs regularly
   - Monitor for errors
   - Verify content stays current
