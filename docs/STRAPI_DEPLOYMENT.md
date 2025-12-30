# Strapi CMS Deployment Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  VERCEL PROJECT 1: karstenwade.com (Next.js)            │
│    - Root directory: /                                  │
│    - Framework: Next.js                                 │
│    - URL: https://karstenwade.com                       │
└─────────────────────────────────────────────────────────┘
                      ↓ (reads from)
┌─────────────────────────────────────────────────────────┐
│  ZERODB (Production Database)                           │
│    - Content storage for frontend reads                 │
│    - Vector embeddings for search                       │
│    - API: api.ainative.studio                           │
└─────────────────────────────────────────────────────────┘
                      ↑ (syncs to)
┌─────────────────────────────────────────────────────────┐
│  VERCEL PROJECT 2: karstenwade-cms (Strapi)             │
│    - Root directory: /cms                               │
│    - Framework: Other (Node.js)                         │
│    - URL: https://cms.karstenwade.com                   │
└─────────────────────────────────────────────────────────┘
```

## Prerequisites

1. Vercel account with ability to create multiple projects
2. PostgreSQL database (Neon, Supabase, or similar)
3. ZeroDB project at api.ainative.studio
4. GitHub repository connected to Vercel

## Deployment Steps

### Step 1: Deploy Next.js Frontend

1. Go to Vercel Dashboard → "Add New Project"
2. Import the `karstenwade/karstenwade.com` repository
3. Configure:
   - **Root Directory**: Leave empty (uses repo root)
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build:next`
   - **Output Directory**: `.next`

4. Add environment variables:
   ```
   NEXT_PUBLIC_STRAPI_URL=https://cms.karstenwade.com
   ZERODB_API_URL=https://api.ainative.studio
   ZERODB_PROJECT_ID=<your-project-id>
   ```

5. Deploy

### Step 2: Deploy Strapi CMS

1. Go to Vercel Dashboard → "Add New Project"
2. Import the same repository
3. Configure:
   - **Root Directory**: `cms`
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add environment variables (see below)
5. Deploy

### Step 3: Configure PostgreSQL

For production, Strapi requires PostgreSQL. Recommended providers:
- **Neon** (free tier available)
- **Supabase** (free tier available)
- **Railway** (usage-based pricing)

Create a database and get the connection string.

## Environment Variables

### Strapi CMS (cms.karstenwade.com)

| Variable | Description | Required |
|----------|-------------|----------|
| `HOST` | Server host | Yes (0.0.0.0) |
| `PORT` | Server port | Yes (1337) |
| `APP_KEYS` | Encryption keys (comma-separated) | Yes |
| `ADMIN_JWT_SECRET` | Admin panel JWT secret | Yes |
| `API_TOKEN_SALT` | API token salt | Yes |
| `TRANSFER_TOKEN_SALT` | Transfer token salt | Yes |
| `JWT_SECRET` | JWT secret | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `PUBLIC_URL` | Public URL of CMS | Yes |
| `ZERODB_API_URL` | ZeroDB API URL | Yes |
| `ZERODB_PROJECT_ID` | ZeroDB project ID | Yes |
| `ZERODB_USERNAME` | ZeroDB username | Yes |
| `ZERODB_PASSWORD` | ZeroDB password | Yes |
| `ZERODB_EMBEDDINGS_ENABLED` | Enable embeddings sync | No (true) |
| `ZERODB_EVENTS_ENABLED` | Enable event tracking | No (true) |
| `GITHUB_ACCESS_TOKEN` | GitHub token for sync | No |
| `GITHUB_WEBHOOK_SECRET` | Webhook signature secret | No |

### Generate Security Keys

```bash
# Generate APP_KEYS (need 4)
openssl rand -base64 32
openssl rand -base64 32
openssl rand -base64 32
openssl rand -base64 32

# Generate secrets
openssl rand -base64 32  # ADMIN_JWT_SECRET
openssl rand -base64 32  # API_TOKEN_SALT
openssl rand -base64 32  # TRANSFER_TOKEN_SALT
openssl rand -base64 32  # JWT_SECRET
```

### Next.js Frontend (karstenwade.com)

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_STRAPI_URL` | Strapi CMS URL | Yes |
| `STRAPI_API_TOKEN` | Strapi API token | Yes |
| `ZERODB_API_URL` | ZeroDB API URL | Yes |
| `ZERODB_PROJECT_ID` | ZeroDB project ID | Yes |
| `ZERODB_USERNAME` | ZeroDB username | Yes |
| `ZERODB_PASSWORD` | ZeroDB password | Yes |

## Post-Deployment Setup

### 1. Create Admin User

After first deployment, visit `https://cms.karstenwade.com/admin` and create your admin account.

### 2. Generate API Token

1. Go to Settings → API Tokens
2. Create a new token with "Read-only" permissions
3. Add to Next.js environment variables

### 3. Sync Content from GitHub

```bash
# Via API
curl -X POST https://cms.karstenwade.com/api/sync/papers
curl -X POST https://cms.karstenwade.com/api/sync/tosw-chapters
```

### 4. Configure GitHub Webhook (Optional)

For automatic sync on repository updates:

1. Go to GitHub repo → Settings → Webhooks
2. Add webhook:
   - URL: `https://cms.karstenwade.com/api/github-webhook`
   - Content type: `application/json`
   - Secret: Your `GITHUB_WEBHOOK_SECRET`
   - Events: Push events

## Rollback Procedures

### Vercel Deployment Rollback

1. Go to Vercel Dashboard → Project → Deployments
2. Find the previous working deployment
3. Click "..." → "Promote to Production"

### Database Rollback

PostgreSQL providers typically offer point-in-time recovery:

**Neon:**
```bash
# List branches
neon branches list

# Restore to point in time
neon branches restore --timestamp "2024-01-15T10:00:00Z"
```

**Supabase:**
1. Dashboard → Database → Backups
2. Select backup → Restore

### Content Rollback

If content was synced incorrectly:

1. Stop auto-sync by removing webhook
2. Clear affected content via admin panel
3. Re-run sync with correct data

## Troubleshooting

### Build Fails

**Error: "Cannot find module 'pg'"**
```bash
cd cms && npm install pg --save
```

**Error: "APP_KEYS must be defined"**
- Ensure all required environment variables are set in Vercel

### Database Connection Issues

**Error: "Connection refused"**
- Check DATABASE_URL format
- Verify IP allowlist on database provider
- Check SSL settings (most require `?sslmode=require`)

### Admin Panel Not Loading

**Blank page or 404:**
- Check PUBLIC_URL is set correctly
- Verify build completed successfully
- Check browser console for CORS errors

### Content Not Syncing to ZeroDB

**Warning: "[ZeroDB] Service not configured"**
- Verify ZERODB_* environment variables
- Check ZeroDB project ID is correct
- Test authentication manually

### GitHub Sync Errors

**Error: "GitHub API error: 403"**
- Check GITHUB_ACCESS_TOKEN is valid
- Verify token has repo read permissions
- Check rate limits

## Monitoring

### Vercel Analytics

Enable in Vercel Dashboard → Project → Analytics

### ZeroDB Events

Content sync events are tracked in ZeroDB when `ZERODB_EVENTS_ENABLED=true`.

Query via:
```bash
curl -X GET "https://api.ainative.studio/v1/projects/{project_id}/events?event_type=content_sync"
```

## Maintenance

### Update Strapi

```bash
cd cms
npx @strapi/upgrade latest
npm run build
git commit -am "chore: upgrade Strapi"
git push
```

### Clear Cache

Vercel: Dashboard → Project → Settings → Functions → Clear Cache

### Database Maintenance

Run periodically:
```sql
VACUUM ANALYZE;
```
