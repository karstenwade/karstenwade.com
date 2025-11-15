# Vercel Deployment Guide
# karstenwade.com - Primary Deployment

**Last Updated:** 2025-11-14

This document provides comprehensive instructions for deploying karstenwade.com to Vercel as the primary hosting platform.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Initial Vercel Setup](#initial-vercel-setup)
4. [Custom Domain Configuration](#custom-domain-configuration)
5. [Environment Variables](#environment-variables)
6. [Deployment Process](#deployment-process)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)
9. [Maintenance](#maintenance)

---

## Overview

**Deployment Architecture:**
- **Primary Hosting:** Vercel
- **Custom Domain:** karstenwade.com
- **Base Path:** `/` (root)
- **Build Framework:** Vite
- **HTTPS:** Automatic SSL (Let's Encrypt via Vercel)
- **CDN:** Vercel's global edge network
- **Deploy Method:** Automatic Git integration

**Mirror Deployment:**
- GitHub Pages at https://karstenwade.github.io/karstenwade.com/
- See [DNS_CONFIGURATION.md](./DNS_CONFIGURATION.md) for GitHub Pages setup

**Why Vercel?**
- Zero-config deployment for Vite projects
- Automatic HTTPS with custom domains
- Global CDN for fast content delivery
- Deploy previews for pull requests
- Native SPA routing support
- Excellent performance optimization

---

## Prerequisites

Before deploying to Vercel, ensure you have:

- [x] GitHub repository at https://github.com/karstenwade/karstenwade.com
- [x] Vercel account (free tier works fine)
- [x] Access to DNS configuration for karstenwade.com
- [x] Project builds successfully (`npm run build`)
- [x] vercel.json configuration file in project root

---

## Initial Vercel Setup

### Step 1: Create Vercel Account

1. Go to https://vercel.com/signup
2. Sign up with GitHub account (recommended for seamless integration)
3. Authorize Vercel to access your GitHub repositories

### Step 2: Import Project

1. Click "Add New..." → "Project" in Vercel dashboard
2. Select "Import Git Repository"
3. Find and select `karstenwade/karstenwade.com` repository
4. Click "Import"

### Step 3: Configure Build Settings

Vercel should auto-detect the Vite framework. Verify these settings:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**Important:** Do NOT set `GITHUB_PAGES=true` environment variable for Vercel builds. This variable is only for GitHub Pages builds.

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (typically 1-2 minutes)
3. Vercel will provide a temporary URL: `karstenwade-com-xxxxx.vercel.app`

---

## Custom Domain Configuration

### Step 1: Add Domain in Vercel

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Domains"
3. Click "Add Domain"
4. Enter: `karstenwade.com`
5. Click "Add"

### Step 2: Add WWW Subdomain (Optional)

1. Click "Add Domain" again
2. Enter: `www.karstenwade.com`
3. Select "Redirect to karstenwade.com"
4. Click "Add"

### Step 3: Configure DNS

Vercel will provide DNS configuration instructions. You need to add these records at your DNS provider:

#### Option A: Using Vercel Nameservers (Recommended)

If you want Vercel to manage DNS:

1. Vercel will provide nameserver addresses
2. Update nameservers at your domain registrar
3. Wait for propagation (can take 24-48 hours)

#### Option B: Using A Records

If you want to keep your current DNS provider:

```
Type: A
Host: @ (or karstenwade.com)
Value: 76.76.21.21
TTL: 3600
```

**For WWW subdomain:**
```
Type: CNAME
Host: www
Value: cname.vercel-dns.com
TTL: 3600
```

### Step 4: Verify Domain

1. After adding DNS records, click "Verify" in Vercel dashboard
2. Vercel will check DNS configuration
3. Once verified, HTTPS certificate provisioning begins automatically
4. Certificate typically ready in 1-2 minutes

---

## Environment Variables

### Production Environment

Vercel builds do NOT need the `GITHUB_PAGES` environment variable.

The conditional base path logic in `vite.config.ts` will automatically use `/` for Vercel:

```typescript
const isGitHubPages = process.env.GITHUB_PAGES === 'true'
const base = isGitHubPages ? '/karstenwade.com/' : '/'
```

**Do NOT set:**
- ❌ GITHUB_PAGES=true (this is only for GitHub Pages builds)

### Optional Environment Variables

If you need to add environment variables:

1. Go to project settings in Vercel
2. Click "Environment Variables"
3. Add variables for Production, Preview, or Development
4. Redeploy for changes to take effect

---

## Deployment Process

### Automatic Deployment

Vercel automatically deploys on every push to the `main` branch:

1. Push code to `main` branch on GitHub
2. Vercel detects changes via webhook
3. Build starts automatically
4. Build output logged in Vercel dashboard
5. If successful, deployment goes live instantly
6. If failed, previous deployment remains live

**Deployment Flow:**
```
git push origin main
    ↓
GitHub webhook triggers Vercel
    ↓
Vercel runs: npm install
    ↓
Vercel runs: npm run build
    ↓
Build creates dist/ directory (base path: '/')
    ↓
Vercel deploys to edge network
    ↓
Live at https://karstenwade.com
```

### Preview Deployments

Every pull request gets a preview deployment:

1. Create pull request on GitHub
2. Vercel automatically builds and deploys preview
3. Preview URL posted as PR comment
4. Test changes before merging
5. Preview URL format: `karstenwade-com-git-branch-name.vercel.app`

### Manual Deployment

To trigger a manual deployment:

1. Go to Vercel dashboard
2. Click "Deployments" tab
3. Click "Redeploy" on any previous deployment
4. Or use Vercel CLI: `vercel --prod`

---

## Verification

### Check Deployment Status

1. Go to Vercel dashboard → "Deployments"
2. Latest deployment should show "Ready" status
3. Click deployment to view build logs

### Verify Website

```bash
# Test custom domain
curl -I https://karstenwade.com
# Should return: HTTP/2 200

# Test WWW redirect
curl -I https://www.karstenwade.com
# Should return: HTTP/1.1 308 with Location: https://karstenwade.com/

# Test HTTP redirect
curl -I http://karstenwade.com
# Should return: HTTP/1.1 308 with Location: https://karstenwade.com/
```

### Browser Testing

1. Visit https://karstenwade.com
2. Check that site loads correctly
3. Test navigation (all routes should work)
4. Verify images load correctly
5. Check SSL certificate (padlock icon)
6. Test responsive design (mobile/desktop)

### Performance Testing

Use Vercel Analytics or external tools:

```bash
# Lighthouse CLI
npm install -g lighthouse
lighthouse https://karstenwade.com --view

# Expected scores:
# Performance: > 90
# Accessibility: > 90
# Best Practices: > 90
# SEO: > 90
```

---

## Troubleshooting

### Build Failures

**Problem:** Build fails in Vercel dashboard

**Solutions:**
1. Check build logs in Vercel dashboard
2. Verify `npm run build` works locally
3. Check Node.js version compatibility
4. Ensure all dependencies are in package.json
5. Look for environment-specific issues

**Common causes:**
- Missing dependencies
- TypeScript errors
- Build configuration issues
- Node.js version mismatch

### Domain Not Resolving

**Problem:** karstenwade.com doesn't load or shows "Domain not configured"

**Solutions:**
1. Verify DNS records are configured correctly
2. Check DNS propagation: https://www.whatsmydns.net/
3. Wait 24-48 hours for full propagation
4. Flush local DNS cache:
   ```bash
   # macOS
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

   # Linux
   sudo systemd-resolve --flush-caches
   ```
5. Verify domain status in Vercel dashboard (should show "Valid Configuration")

### SSL Certificate Issues

**Problem:** HTTPS not working or certificate errors

**Solutions:**
1. Wait for certificate provisioning (can take a few minutes)
2. Verify domain is properly configured in Vercel
3. Check that DNS has fully propagated
4. Remove and re-add domain in Vercel settings
5. Check Vercel status page: https://www.vercel-status.com/

### 404 Errors on Routes

**Problem:** Direct navigation to routes like /cv or /writing returns 404

**Solutions:**
1. Verify vercel.json has rewrite rules:
   ```json
   "rewrites": [
     {
       "source": "/(.*)",
       "destination": "/index.html"
     }
   ]
   ```
2. Ensure React Router is configured correctly
3. Check that base path is set to `/` (not `/karstenwade.com/`)
4. Redeploy after fixing vercel.json

### Images Not Loading

**Problem:** Images return 404 or don't display

**Solutions:**
1. Verify images are in `public/` directory
2. Check image paths use correct base path
3. Ensure images are committed to Git
4. Verify build output includes images in dist/
5. Check browser console for specific errors

---

## Maintenance

### Regular Checks

- **Weekly:** Monitor deployment status in Vercel dashboard
- **Monthly:** Review build times and performance metrics
- **Quarterly:** Check for Vercel platform updates

### Monitoring

Vercel provides built-in monitoring:

1. Go to project dashboard
2. Click "Analytics" tab
3. View:
   - Page views
   - Top pages
   - Performance metrics
   - Deployment frequency

**External Monitoring:**
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Configure Lighthouse CI for performance tracking
- Monitor SSL certificate expiry (auto-renewed by Vercel)

### Updates and Upgrades

**Framework Updates:**
```bash
# Update Vite and React
npm update vite @vitejs/plugin-react react react-dom

# Update all dependencies
npm update

# Rebuild and test
npm run build
npm run preview
```

**Vercel Platform:**
- Vercel automatically updates infrastructure
- No manual maintenance required
- Check Vercel changelog for new features

### Rollback

If a deployment has issues:

1. Go to Vercel dashboard → "Deployments"
2. Find previous working deployment
3. Click "..." → "Promote to Production"
4. Previous version goes live instantly

**Or via Git:**
```bash
# Revert problematic commit
git revert HEAD
git push origin main

# Vercel auto-deploys reverted version
```

---

## Legacy URL Redirects

The site includes permanent redirects (HTTP 301) for content migrated from the previous WordPress site:

**Redirected URLs:**
- `/2022/09/20/bonn-cemetery-alter-friedhof/` → `/writing#bonn-cemetery-alter-friedhof`
- `/2022/09/19/time-banking-on-the-rhine/` → `/writing#time-banking-on-the-rhine`
- `/2021/05/14/pardon-me-while-i-leak-some-life-onto-this-page/` → `/writing#pardon-me-while-i-leak-some-life-onto-this-page`

**Configuration:**
Redirects are defined in `vercel.json`:

```json
"redirects": [
  {
    "source": "/2022/09/20/bonn-cemetery-alter-friedhof/",
    "destination": "/writing#bonn-cemetery-alter-friedhof",
    "permanent": true
  },
  ...
]
```

**Testing Redirects:**
```bash
# Test redirect (after deployment)
curl -I https://karstenwade.com/2022/09/20/bonn-cemetery-alter-friedhof/
# Should return: HTTP/1.1 308 Permanent Redirect
# Location: https://karstenwade.com/writing#bonn-cemetery-alter-friedhof
```

---

## Vercel CLI (Optional)

Install Vercel CLI for local development and manual deployments:

```bash
# Install globally
npm install -g vercel

# Login to Vercel
vercel login

# Link local project
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployments
vercel ls

# View logs
vercel logs
```

---

## Additional Resources

### Official Documentation
- [Vercel Documentation](https://vercel.com/docs)
- [Vite on Vercel](https://vercel.com/docs/frameworks/vite)
- [Custom Domains](https://vercel.com/docs/concepts/projects/custom-domains)
- [Vercel CLI](https://vercel.com/docs/cli)

### Tools
- [Vercel Status](https://www.vercel-status.com/)
- [DNS Propagation Checker](https://www.whatsmydns.net/)
- [SSL Certificate Checker](https://www.ssllabs.com/ssltest/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

### Support
- Vercel Community: https://github.com/vercel/vercel/discussions
- Vercel Support: https://vercel.com/support
- Project Issues: https://github.com/karstenwade/karstenwade.com/issues

---

## Summary Checklist

### Initial Setup
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Verify build settings
- [ ] Deploy to preview URL
- [ ] Test preview deployment

### Custom Domain Setup
- [ ] Add karstenwade.com in Vercel
- [ ] Configure DNS records
- [ ] Wait for DNS propagation
- [ ] Verify domain in Vercel
- [ ] Enable HTTPS (automatic)
- [ ] Add www subdomain redirect

### Post-Setup Verification
- [ ] Site loads at https://karstenwade.com
- [ ] HTTPS works and redirects from HTTP
- [ ] WWW redirects to apex domain
- [ ] All routes work correctly (no 404s)
- [ ] Images load correctly
- [ ] Navigation works
- [ ] SSL certificate is valid
- [ ] Performance meets targets (Lighthouse > 90)

### Documentation
- [x] Vercel deployment guide created
- [x] PRD updated with Vercel as primary
- [x] README updated
- [ ] Team notified of deployment process

---

**Questions or Issues?**

Open an issue on GitHub: https://github.com/karstenwade/karstenwade.com/issues

---

*Last verified: 2025-11-14*
