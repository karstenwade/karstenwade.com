# Strapi Public Permissions Configuration

This directory contains scripts to configure public read access for Strapi CMS content types.

## Problem

By default, Strapi v5 requires authentication for all API requests. This causes 403 Forbidden errors when trying to access content from the Next.js frontend.

## Solution

Enable public read permissions (find and findOne) for all content types using the Users & Permissions plugin.

## Usage

### Option 1: Automated Script (Recommended)

Run the configuration script:

```bash
cd cms
node scripts/configure-public-permissions-v2.js
```

You'll be prompted for:
- Admin email (the email you used when creating the admin account)
- Admin password

The script will:
1. Authenticate with the Strapi admin API
2. Find the "Public" role
3. Enable `find` and `findOne` permissions for all content types
4. Display test commands to verify the configuration

### Option 2: Manual Configuration via Admin Panel

1. Open Strapi Admin: http://localhost:1337/admin
2. Go to Settings → Users & Permissions → Roles
3. Click on "Public" role
4. For each content type (blog-post, paper, author, category, tag, etc.):
   - Expand the content type
   - Check the boxes for:
     - ✓ find
     - ✓ findOne
5. Click "Save"

## Content Types Configured

The script enables public read access for:

- **blog-post** - Blog articles
- **paper** - Academic papers and publications
- **writing** - Other writings
- **tosw-chapter** - The Open Source Way chapters
- **tutorial** - Tutorial content
- **event** - Events and webinars
- **author** - Author information
- **category** - Content categories
- **tag** - Content tags

## Verification

After running the script, test the API endpoints:

```bash
# Test blog posts
curl http://localhost:1337/api/blog-posts

# Test authors
curl http://localhost:1337/api/authors

# Test categories
curl http://localhost:1337/api/categories

# Test tags
curl http://localhost:1337/api/tags

# Test a specific blog post (replace :id with actual ID)
curl http://localhost:1337/api/blog-posts/1
```

You should receive JSON responses instead of 403 Forbidden errors.

## Troubleshooting

### 403 Forbidden Error

If you still get 403 errors after running the script:

1. Check that Strapi is running: http://localhost:1337/_health
2. Verify admin credentials are correct
3. Try manual configuration via admin panel
4. Check Strapi logs for errors:
   ```bash
   cd cms
   npm run develop
   ```

### Authentication Failed

If the script fails to authenticate:

1. Verify admin credentials
2. Check if admin user exists in Strapi admin panel
3. Create a new admin user if needed:
   - Open http://localhost:1337/admin
   - Follow the setup wizard if it appears

### "Public role not found"

If the script can't find the public role:

1. Check that the Users & Permissions plugin is installed
2. Verify Strapi version is v5.x
3. Try accessing http://localhost:1337/admin/settings/users-permissions/roles

## Security Notes

- This configuration only enables READ operations (find, findOne)
- CREATE, UPDATE, and DELETE operations remain protected
- Consider implementing rate limiting for production deployments
- Use environment-specific configurations for production vs. development

## API Token Alternative

Instead of configuring public permissions, you can use an API token:

1. Go to Settings → API Tokens in Strapi admin
2. Create a new token with "Read-only" permissions
3. Add the token to `.env.local` in the Next.js project:
   ```
   STRAPI_API_TOKEN=your-token-here
   ```

However, for a public website, configuring public read permissions is more appropriate.

## Files

- `configure-public-permissions-v2.js` - Main configuration script (JavaScript)
- `configure-public-permissions.ts` - TypeScript version (alternative)
- `test-public-api.sh` - Test script to verify permissions
- `README-permissions.md` - This documentation

## References

- [Strapi Users & Permissions Plugin](https://docs.strapi.io/user-docs/users-roles-permissions)
- [Strapi REST API Documentation](https://docs.strapi.io/dev-docs/api/rest)
- [Strapi Public Role Configuration](https://docs.strapi.io/user-docs/users-roles-permissions/configuring-end-users-roles)
