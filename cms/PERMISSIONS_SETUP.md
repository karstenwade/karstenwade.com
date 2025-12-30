# Strapi Public Permissions Setup Guide

## Overview

Strapi v5 requires authentication by default. To allow the Next.js frontend to access content without authentication, you must configure public read permissions.

## Quick Start

### Option 1: Automated Script (Recommended)

```bash
cd /home/quaid/Documents/Projects/karstenwade.com/src/karstenwade.com/cms
node scripts/configure-public-permissions-simple.js <admin-email> <admin-password>
```

Example:
```bash
node scripts/configure-public-permissions-simple.js admin@example.com mySecurePassword
```

### Option 2: Manual Configuration (UI)

1. **Open Strapi Admin Panel**
   - Navigate to: http://localhost:1337/admin
   - Log in with your admin credentials

2. **Access Settings**
   - Click **Settings** in the left sidebar
   - Navigate to **USERS & PERMISSIONS PLUGIN** → **Roles**

3. **Edit Public Role**
   - Click on the **Public** role
   - You'll see all available permissions organized by content type

4. **Enable Read Permissions**
   For each content type, check these permissions:
   - ✅ **find** (list all entries)
   - ✅ **findOne** (get single entry)

   Content types to configure:
   - api::blog-post.blog-post
   - api::paper.paper
   - api::writing.writing
   - api::tosw-chapter.tosw-chapter
   - api::tutorial.tutorial
   - api::event.event
   - api::author.author
   - api::category.category
   - api::tag.tag

5. **Save Changes**
   - Click **Save** in the top-right corner
   - Wait for confirmation

## Verification

### Test with curl

```bash
# Should return 200 OK with JSON data
curl http://localhost:1337/api/blog-posts

# Should return 200 OK with JSON data
curl http://localhost:1337/api/authors

# Should return 200 OK with JSON data
curl http://localhost:1337/api/categories
```

### Expected Response

**Success (200 OK):**
```json
{
  "data": [...],
  "meta": {
    "pagination": {...}
  }
}
```

**Failure (403 Forbidden):**
```json
{
  "data": null,
  "error": {
    "status": 403,
    "name": "ForbiddenError",
    "message": "Forbidden"
  }
}
```

### Automated Test Script

```bash
cd /home/quaid/Documents/Projects/karstenwade.com/src/karstenwade.com/cms
chmod +x scripts/test-public-api.sh
./scripts/test-public-api.sh
```

## Understanding Strapi Permissions

### Role Types

1. **Public** - Unauthenticated users (what we're configuring)
2. **Authenticated** - Logged-in users
3. **Author** - Content creators
4. **Admin** - Full access

### Permission Levels

- **find** - List/query entries (GET /api/content-type)
- **findOne** - Get single entry (GET /api/content-type/:id)
- **create** - Create new entries (POST /api/content-type)
- **update** - Modify entries (PUT /api/content-type/:id)
- **delete** - Remove entries (DELETE /api/content-type/:id)

For a public website, we only need **find** and **findOne**.

## Troubleshooting

### Still Getting 403 After Configuration

1. **Clear browser cache and Strapi cache:**
   ```bash
   cd cms
   rm -rf .cache
   npm run develop
   ```

2. **Check Strapi version:**
   ```bash
   cd cms
   npm list @strapi/strapi
   ```
   Should be v5.x.x

3. **Verify admin role vs. public role:**
   - Admin roles (in Settings → Administration Panel → Roles) control admin panel access
   - Public roles (in Settings → Users & Permissions Plugin → Roles) control API access
   - **You need to configure the Users & Permissions Plugin Public role**

4. **Check for custom policies:**
   - Look for custom route middlewares in `cms/src/api/*/routes/*.ts`
   - These might override public permissions

### Authentication Failed

1. **Reset admin password:**
   - Go to http://localhost:1337/admin/auth/forgot-password
   - Or create a new admin user via the UI

2. **Check database:**
   ```bash
   cd cms
   ls -lah .tmp/data.db
   ```
   If missing, restart Strapi to recreate it

### Content Types Not Found (404)

1. **Verify content type exists:**
   ```bash
   cd cms/src/api
   ls -la
   ```
   You should see directories for each content type

2. **Check content type configuration:**
   ```bash
   cat cms/src/api/blog-post/content-types/blog-post/schema.json
   ```

3. **Restart Strapi:**
   ```bash
   cd cms
   npm run develop
   ```

## Alternative: API Tokens

Instead of public permissions, you can use API tokens for server-side requests:

1. **Create API Token:**
   - Go to Settings → API Tokens → Create new API Token
   - Name: "Next.js Frontend"
   - Token type: "Read-only"
   - Duration: "Unlimited"
   - Copy the token (shown only once!)

2. **Add to Next.js environment:**
   ```bash
   # In /home/quaid/Documents/Projects/karstenwade.com/src/karstenwade.com/.env.local
   STRAPI_API_TOKEN=your-token-here
   ```

3. **Use in API calls:**
   ```typescript
   const response = await fetch(`${STRAPI_URL}/api/blog-posts`, {
     headers: {
       'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
     },
   });
   ```

**Note:** For a public website with static site generation, public permissions are more appropriate than API tokens.

## Security Considerations

### What This Configuration Does

- ✅ Enables public READ access (find, findOne)
- ❌ Blocks CREATE operations (still requires authentication)
- ❌ Blocks UPDATE operations (still requires authentication)
- ❌ Blocks DELETE operations (still requires authentication)

### Best Practices

1. **Production Environment:**
   - Use environment-specific configurations
   - Enable rate limiting
   - Use a CDN for caching
   - Monitor API usage

2. **Sensitive Data:**
   - Don't expose sensitive fields in public API
   - Use field-level permissions or custom controllers
   - Consider using the draft/publish feature

3. **Performance:**
   - Enable pagination for large datasets
   - Use field selection to minimize response size
   - Cache responses with appropriate TTLs

## Scripts Reference

| Script | Purpose |
|--------|---------|
| `configure-public-permissions-simple.js` | Main configuration script (recommended) |
| `configure-public-permissions-v2.js` | Alternative with prompts |
| `configure-public-permissions.ts` | TypeScript version |
| `test-public-api.sh` | Verify permissions are working |

## Related Documentation

- [Strapi Users & Permissions Plugin](https://docs.strapi.io/user-docs/users-roles-permissions)
- [Strapi REST API](https://docs.strapi.io/dev-docs/api/rest)
- [Public API Configuration](https://docs.strapi.io/user-docs/users-roles-permissions/configuring-end-users-roles)

## Next Steps

After configuring permissions:

1. ✅ Test all API endpoints
2. ✅ Update Next.js `.env.local` with `NEXT_PUBLIC_STRAPI_URL=http://localhost:1337`
3. ✅ Restart Next.js dev server to pick up changes
4. ✅ Verify blog posts load on frontend
5. ✅ Deploy to production with production Strapi URL

## Questions?

- Check Strapi logs: `cd cms && npm run develop`
- Review API responses: Use browser DevTools Network tab
- Test with curl: `curl -v http://localhost:1337/api/blog-posts`
