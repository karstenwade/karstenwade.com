# Strapi Admin Setup Guide

This guide documents the admin panel configuration and security setup for karstenwade.com's Strapi CMS.

## Quick Start

### 1. Generate Secure Secrets

Before running Strapi for the first time, generate secure secrets:

```bash
# Generate 6 unique secrets (run once for each)
for i in {1..6}; do
  openssl rand -base64 32
done
```

Copy each generated value to the corresponding environment variable in `.env`.

### 2. Configure Environment

```bash
cd cms
cp .env.example .env
# Edit .env with your generated secrets
```

### 3. Create Admin User

Start Strapi in development mode:

```bash
npm run develop
```

Navigate to `http://localhost:1337/admin` and create your first admin user.

## Security Configuration

### Environment Variables

| Variable | Purpose | How to Generate |
|----------|---------|-----------------|
| `APP_KEYS` | Application security keys (2+ comma-separated) | `openssl rand -base64 32` |
| `API_TOKEN_SALT` | Salt for generating API tokens | `openssl rand -base64 32` |
| `ADMIN_JWT_SECRET` | Secret for admin JWT tokens | `openssl rand -base64 32` |
| `TRANSFER_TOKEN_SALT` | Salt for data transfer tokens | `openssl rand -base64 32` |
| `JWT_SECRET` | Secret for content API JWT | `openssl rand -base64 32` |
| `ENCRYPTION_KEY` | Key for encrypting sensitive data | `openssl rand -base64 32` |

### Rate Limiting

The admin panel is protected by rate limiting:

| Setting | Default | Description |
|---------|---------|-------------|
| `ADMIN_RATE_LIMIT_MAX` | 10 | Max login attempts per interval |
| `ADMIN_RATE_LIMIT_INTERVAL` | 60000 (1 min) | Rate limit window in ms |
| `ADMIN_RATE_LIMIT_DELAY` | 3000 (3 sec) | Delay after rate limit hit |

### CORS Configuration

CORS is configured to allow requests from:
- `http://localhost:3001` (development)
- `https://karstenwade.com` (production)

To add additional origins, update `CORS_ORIGINS` in `.env`:

```bash
CORS_ORIGINS=http://localhost:3001,https://karstenwade.com,https://staging.karstenwade.com
```

### Content Security Policy

The CSP is configured to:
- Allow connections to `'self'` and all HTTPS origins
- Allow images from Strapi marketplace
- Allow blob and data URIs for media uploads

## Admin Roles

### Super Admin
- Full access to all content types
- Can manage other admin users
- Can manage API tokens
- Can access all settings

### Editor (Recommended for day-to-day use)
- Can create, edit, publish content
- Cannot manage admin users
- Cannot modify settings

### Author
- Can create and edit own content
- Cannot publish without approval
- Cannot delete content

## Creating Admin Users

### Via Admin Panel

1. Go to `Settings` > `Administration panel` > `Users`
2. Click `Invite new user`
3. Enter email and assign role
4. User receives invitation email

### Via Strapi CLI (first user only)

```bash
npm run strapi admin:create-user \
  --email=admin@karstenwade.com \
  --password=SecurePassword123! \
  --firstname=Admin \
  --lastname=User
```

## API Tokens

### Creating API Tokens

1. Go to `Settings` > `API Tokens`
2. Click `Create new API Token`
3. Choose type:
   - **Read-only**: For public API access
   - **Full access**: For admin operations
   - **Custom**: Fine-grained permissions

### Token Types for karstenwade.com

| Token | Type | Purpose |
|-------|------|---------|
| `NEXT_PUBLIC_STRAPI_TOKEN` | Read-only | Frontend content fetching |
| `STRAPI_ADMIN_TOKEN` | Full access | MCP server operations |

## ZeroDB Integration

Strapi syncs content to ZeroDB for production reads:

### Architecture

```
Strapi (SQLite) → Lifecycle Hooks → ZeroDB HTTP API → Next.js Frontend
```

### Configuration

```bash
ZERODB_API_URL=https://api.ainative.studio
ZERODB_PROJECT_ID=your-project-id
ZERODB_USERNAME=your-username
ZERODB_PASSWORD=your-password
```

### Synced Content Types

- `strapi_blog_posts` - Blog posts
- `strapi_tutorials` - Tutorials
- `strapi_events` - Events
- `strapi_content_sync` - Sync metadata

## Audit Logs

Audit logs track all admin actions:

- Enabled by default (`ADMIN_AUDIT_LOGS=true`)
- Retained for 90 days (`ADMIN_AUDIT_RETENTION_DAYS=90`)
- Logs include: user, action, timestamp, affected content

## Security Best Practices

### Production Checklist

- [ ] All secrets are unique and randomly generated
- [ ] Admin JWT expiration is appropriate for your needs
- [ ] Rate limiting is enabled
- [ ] CORS is configured for production domains only
- [ ] Audit logs are enabled
- [ ] Super admin account has strong password
- [ ] API tokens use least-privilege principle
- [ ] HTTPS is enforced (via reverse proxy)

### Password Requirements

For admin accounts:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Session Security

- Admin sessions expire after 30 days by default
- Adjust with `ADMIN_JWT_EXPIRES_IN` environment variable
- Consider shorter expiration for sensitive environments

## Troubleshooting

### "Invalid credentials" on login

1. Check that `ADMIN_JWT_SECRET` hasn't changed
2. Verify user exists in database
3. Check rate limiting isn't blocking attempts

### CORS errors from frontend

1. Verify `CORS_ORIGINS` includes your frontend URL
2. Check for typos in origin URLs
3. Ensure protocol (http/https) matches

### API token not working

1. Verify token hasn't expired
2. Check token permissions match required operations
3. Ensure `Authorization: Bearer <token>` header is correct

## Contact

For admin access requests, contact:
- **Site Owner**: Karsten Wade
- **Email**: [configure as needed]
