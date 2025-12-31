# TOSW Chapter Sync Instructions

This guide explains how to sync TOSW (The Open Source Way) chapters from the `theopensourceway/guidebook` GitHub repository into your local Strapi CMS.

## Prerequisites

1. **GitHub Access Token** (Optional but recommended)
   - Without token: 60 requests/hour
   - With token: 5000 requests/hour
   - Set in `.env` file: `GITHUB_ACCESS_TOKEN=ghp_your_token_here`

2. **Strapi Database**
   - Make sure Strapi has been initialized at least once
   - The `tosw_chapters` content type should exist

## Method 1: Standalone Script (Recommended)

Run the sync without starting the Strapi server:

```bash
cd cms
npm run sync:tosw
```

### Options

**Force refresh** (re-sync all chapters even if unchanged):
```bash
npm run sync:tosw -- --force
```

### Expected Output

```
[Sync TOSW] Starting...
[Sync TOSW] Fetching chapters from GitHub...
[GitHub Sync] Starting TOSW chapters sync...
[GitHub Sync] Found 5 sections
[GitHub Sync] Processing 8 files in community-101
[GitHub Sync] Created chapter: community-101/01-introduction.md
...

═══════════════════════════════════════════
         SYNC COMPLETE
═══════════════════════════════════════════
✓ Created:    42
↻ Updated:    0
- Unchanged:  0
✗ Errors:     0
═══════════════════════════════════════════
```

## Method 2: API Endpoint

If Strapi is running, you can trigger sync via HTTP:

```bash
# Start Strapi first
cd cms
npm run develop

# In another terminal, trigger sync
curl -X POST http://localhost:1337/api/sync/tosw-chapters

# Force refresh
curl -X POST "http://localhost:1337/api/sync/tosw-chapters?forceRefresh=true"
```

### Response Format

```json
{
  "success": true,
  "result": {
    "created": 42,
    "updated": 0,
    "unchanged": 0,
    "errorCount": 0,
    "errors": []
  },
  "message": "Sync complete: 42 chapters synced"
}
```

## Method 3: Strapi Console

You can also run the sync from Strapi's interactive console:

```bash
cd cms
npm run console
```

Then in the console:
```javascript
const { GitHubSyncService } = require('./src/services/github-sync');
const service = new GitHubSyncService();
service.setStrapi(strapi);
const result = await service.syncToswChapters();
console.log(result);
```

## What Gets Synced

The sync pulls all markdown files from `theopensourceway/guidebook` and maps them to Strapi fields:

| GitHub → Strapi |
|-----------------|
| First H1 → `title` |
| First paragraph → `description` |
| Full markdown → `content` |
| Directory name → `section` |
| Filename prefix (e.g., "01-") → `chapter_order` |
| File path → `github_path` |
| Commit SHA → `github_sha` |
| "CC BY-SA 4.0" → `license` |
| "github-tosw" → `source` |

## Viewing Synced Content

1. **Via Strapi Admin**
   - Go to http://localhost:1337/admin
   - Navigate to "Content Manager" → "TOSW Chapter"
   - You'll see all synced chapters

2. **Via API**
   ```bash
   curl http://localhost:1337/api/tosw-chapters
   ```

## Troubleshooting

### "GitHub API error: 403 rate limit exceeded"

**Solution:** Set `GITHUB_ACCESS_TOKEN` in `.env`:
```bash
# Get a token from https://github.com/settings/tokens
# Add to cms/.env
GITHUB_ACCESS_TOKEN=ghp_your_token_here
```

### "Failed to parse frontmatter"

**Cause:** Malformed YAML in a markdown file

**Solution:** Check the error message for the specific file and fix YAML syntax

### "Entry not updating despite changes"

**Check:**
1. Is `sync_locked` set to true? (prevents updates)
2. Has the GitHub SHA actually changed?
3. Are you using `--force` flag?

### "Script hangs or times out"

**Possible causes:**
- Network issues
- GitHub API rate limiting
- Large repository (many files)

**Solutions:**
- Check internet connection
- Set GITHUB_ACCESS_TOKEN
- Use `--force` flag sparingly

## Sync Lock Protection

To prevent accidental overwrites of manually edited content:

1. **Lock a chapter** (via Strapi admin or API):
   ```javascript
   await strapi.documents('api::tosw-chapter.tosw-chapter').update({
     documentId: 'some-id',
     data: { sync_locked: true }
   });
   ```

2. **Locked chapters will NOT be:**
   - Updated during sync
   - Deleted by webhook events
   - Affected by `--force` flag

## Advanced: Automated Sync

### Cron Job

Add to `cms/config/cron-tasks.ts`:

```typescript
export default {
  // Daily at 3 AM UTC
  '0 3 * * *': async ({ strapi }) => {
    const githubSyncService = await import('../src/services/github-sync');
    const service = githubSyncService.default;
    service.setStrapi(strapi);

    const result = await service.syncToswChapters();
    strapi.log.info('Daily TOSW sync complete', result);
  },
};
```

### GitHub Webhook

For real-time updates when content changes on GitHub:

1. Create webhook in GitHub repo settings
2. Payload URL: `https://your-strapi.com/api/github-webhook`
3. Content type: `application/json`
4. Events: Just the push event
5. Set `GITHUB_WEBHOOK_SECRET` in `.env`

## API Routes

All sync endpoints are available at `/api/sync/`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sync/tosw-chapters` | POST | Sync TOSW chapters only |
| `/api/sync/papers` | POST | Sync papers only |
| `/api/sync/all` | POST | Sync both TOSW and papers |

### Query Parameters

- `forceRefresh=true` - Re-sync even if SHA matches

## Files Reference

- **Service:** `cms/src/services/github-sync.ts`
- **Script:** `cms/scripts/sync-tosw.ts`
- **Controller:** `cms/src/api/sync/controllers/sync.ts`
- **Routes:** `cms/src/api/sync/routes/sync.ts`
- **Schema:** `cms/src/api/tosw-chapter/content-types/tosw-chapter/schema.json`
- **Documentation:** `cms/src/services/README-github-sync.md`

## Next Steps

1. Run the sync: `npm run sync:tosw`
2. Check Strapi admin: http://localhost:1337/admin
3. Verify chapters appear in "Content Manager" → "TOSW Chapter"
4. Test API access: `curl http://localhost:1337/api/tosw-chapters`

## Need Help?

- Check detailed logs during sync
- Review error messages for specific issues
- Consult `cms/src/services/README-github-sync.md` for technical details
- Verify `.env` configuration
