# GitHub Sync - Quick Command Reference

## Setup (One-Time)

```bash
# Navigate to CMS directory
cd /home/quaid/Documents/Projects/karstenwade.com/src/karstenwade.com/cms

# Install dependencies (includes tsx)
npm install

# Optional: Set GitHub token for higher rate limits
export GITHUB_ACCESS_TOKEN=ghp_your_token_here
```

## Sync Papers

```bash
# From project root
cd /home/quaid/Documents/Projects/karstenwade.com/src/karstenwade.com/cms

# Run sync
npm run sync:papers

# OR force refresh all papers (ignore SHA check)
npm run sync:papers -- --force
```

## Sync TOSW Chapters

```bash
# From project root
cd /home/quaid/Documents/Projects/karstenwade.com/src/karstenwade.com/cms

# Run sync
npm run sync:tosw

# OR force refresh all chapters
npm run sync:tosw -- --force
```

## Expected Output

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

## What Gets Synced?

### Papers
- **Source**: karstenwade/papers repository
- **Path**: `papers/*.md`
- **Destination**: Strapi content type `api::paper.paper`

### TOSW Chapters
- **Source**: theopensourceway/guidebook repository
- **Path**: `**/*.md` (all sections)
- **Destination**: Strapi content type `api::tosw-chapter.tosw-chapter`

## Troubleshooting

**If you see rate limit errors:**
```bash
export GITHUB_ACCESS_TOKEN=ghp_your_token_here
```

**If Strapi is already running:**
Stop it first, then run the sync scripts (they start their own instance).

**For more details:**
See `GITHUB_SYNC_USAGE.md` in the project root.
