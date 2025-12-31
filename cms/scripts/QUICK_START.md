# Quick Start: Enable Public API Access

## The Problem
API returns `403 Forbidden` when accessing http://localhost:1337/api/blog-posts

## The Solution
Enable public read permissions for content types.

## Commands

```bash
# 1. Navigate to CMS directory
cd /home/quaid/Documents/Projects/karstenwade.com/src/karstenwade.com/cms

# 2. Run configuration script
node scripts/configure-public-permissions-simple.js admin@example.com yourPassword

# 3. Test API access
./scripts/test-public-api.sh
```

## Expected Output

```
✅ Strapi is running
✅ Authenticated as: admin@example.com
✅ Found API content types: 9
✅ Configured 18 permissions
✅ Successfully updated public role permissions
🎉 Configuration complete!
```

## Test API

```bash
curl http://localhost:1337/api/blog-posts
curl http://localhost:1337/api/authors
curl http://localhost:1337/api/categories
```

Should return JSON with status 200, not 403.

## If It Fails

### Can't authenticate?
- Check admin email/password
- Create new admin at http://localhost:1337/admin

### Still getting 403?
- Configure manually in UI:
  1. Go to http://localhost:1337/admin
  2. Settings → Users & Permissions → Roles
  3. Click "Public"
  4. Check "find" and "findOne" for all content types
  5. Click "Save"

### Need help?
- Read full guide: `cms/PERMISSIONS_SETUP.md`
- Check scripts: `cms/scripts/README-permissions.md`
