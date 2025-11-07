# DNS Configuration Guide
# karstenwade.com → GitHub Pages

**Last Updated:** 2025-11-07

This document provides comprehensive instructions for configuring the custom domain `karstenwade.com` to point to GitHub Pages.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [GitHub Pages Configuration](#github-pages-configuration)
4. [DNS Provider Configuration](#dns-provider-configuration)
5. [HTTPS/SSL Setup](#httpsssl-setup)
6. [WWW Subdomain](#www-subdomain)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)
9. [Maintenance](#maintenance)

---

## Overview

**Deployment Architecture:**
- **Primary Hosting:** GitHub Pages
- **Custom Domain:** karstenwade.com
- **Fallback URL:** https://karstenwade.github.io/karstenwade.com/
- **HTTPS:** Automatic SSL via GitHub Pages (Let's Encrypt)
- **CDN:** GitHub's global CDN

**Removed:**
- ❌ DreamHost mirror deployment
- ❌ Sync scripts
- ❌ Dual hosting

---

## Prerequisites

Before configuring DNS, ensure you have:

- [x] GitHub repository with GitHub Pages enabled
- [x] Access to DNS provider for karstenwade.com
- [x] CNAME file in `public/` directory
- [x] GitHub Actions workflow deploying to gh-pages branch

---

## GitHub Pages Configuration

### Step 1: Add CNAME File

The CNAME file tells GitHub Pages what custom domain to use.

**File:** `public/CNAME`
**Content:**
```
karstenwade.com
```

**Important:**
- File must be named exactly `CNAME` (all caps, no extension)
- Must be in `public/` directory (copied to gh-pages on build)
- Contains only the domain name (one line, no protocol)

### Step 2: Configure Custom Domain in GitHub

1. Go to repository settings: https://github.com/karstenwade/karstenwade.com/settings/pages
2. Under "Custom domain", enter: `karstenwade.com`
3. Click "Save"
4. Wait for DNS check (can take a few minutes)

**What Happens:**
- GitHub creates a CNAME file in gh-pages branch (if not present)
- GitHub begins SSL certificate provisioning
- DNS verification starts

---

## DNS Provider Configuration

### DNS Records Required

Configure these records at your DNS provider:

#### A Records (Apex Domain)

Point karstenwade.com to GitHub Pages IP addresses:

```
Type: A
Host: @ (or karstenwade.com)
Value: 185.199.108.153
TTL: 3600

Type: A
Host: @ (or karstenwade.com)
Value: 185.199.109.153
TTL: 3600

Type: A
Host: @ (or karstenwade.com)
Value: 185.199.110.153
TTL: 3600

Type: A
Host: @ (or karstenwade.com)
Value: 185.199.111.153
TTL: 3600
```

**Why 4 A records?**
- Redundancy and load balancing
- All 4 IPs must be configured for proper GitHub Pages function
- GitHub rotates between these IPs

#### AAAA Records (Optional - IPv6)

For IPv6 support, add:

```
Type: AAAA
Host: @ (or karstenwade.com)
Value: 2606:50c0:8000::153
TTL: 3600

Type: AAAA
Host: @ (or karstenwade.com)
Value: 2606:50c0:8001::153
TTL: 3600

Type: AAAA
Host: @ (or karstenwade.com)
Value: 2606:50c0:8002::153
TTL: 3600

Type: AAAA
Host: @ (or karstenwade.com)
Value: 2606:50c0:8003::153
TTL: 3600
```

### DNS Propagation

After configuring DNS records:
- **Typical propagation time:** 15 minutes to 48 hours
- **Check propagation:** Use https://www.whatsmydns.net/
- **Verify locally:** `dig karstenwade.com +short`

---

## HTTPS/SSL Setup

GitHub Pages provides automatic HTTPS via Let's Encrypt.

### Step 1: Wait for DNS Propagation

SSL certificate can only be provisioned after DNS is fully propagated.

### Step 2: Enable HTTPS

1. Go to GitHub Pages settings
2. Wait for "DNS check successful" message
3. Check "Enforce HTTPS" checkbox
4. SSL certificate provisioning begins (can take a few minutes)

### Verification

```bash
# Check HTTPS redirect
curl -I http://karstenwade.com
# Should return: HTTP/1.1 301 Moved Permanently
# Location: https://karstenwade.com/

# Check SSL certificate
curl -I https://karstenwade.com
# Should return: HTTP/2 200
```

**Certificate Details:**
- **Provider:** Let's Encrypt (via GitHub)
- **Auto-renewal:** Yes (automatic by GitHub)
- **Validity:** 90 days, renewed automatically
- **Cost:** Free

---

## WWW Subdomain

Configure www.karstenwade.com to redirect to karstenwade.com.

### CNAME Record for WWW

```
Type: CNAME
Host: www
Value: karstenwade.com
TTL: 3600
```

**Alternative (points directly to GitHub):**
```
Type: CNAME
Host: www
Value: karstenwade.github.io
TTL: 3600
```

### Behavior

- `www.karstenwade.com` → redirects to → `karstenwade.com`
- HTTP 301 Permanent Redirect
- HTTPS works for both domains

### Verification

```bash
curl -I https://www.karstenwade.com
# Should show 301 redirect to https://karstenwade.com
```

---

## Verification

### DNS Verification

Check that DNS records are correct:

```bash
# Check A records
dig karstenwade.com +short
# Should return all 4 GitHub Pages IPs:
# 185.199.108.153
# 185.199.109.153
# 185.199.110.153
# 185.199.111.153

# Check AAAA records (if configured)
dig karstenwade.com AAAA +short

# Check CNAME for www
dig www.karstenwade.com +short
# Should return: karstenwade.com or karstenwade.github.io
```

### Website Verification

```bash
# Test apex domain
curl -I https://karstenwade.com
# Should return: HTTP/2 200

# Test www subdomain redirect
curl -I https://www.karstenwade.com
# Should return: HTTP/1.1 301 with Location: https://karstenwade.com/

# Test HTTP redirect
curl -I http://karstenwade.com
# Should return: HTTP/1.1 301 with Location: https://karstenwade.com/
```

### Browser Testing

1. Visit `https://karstenwade.com` - should load
2. Visit `http://karstenwade.com` - should redirect to HTTPS
3. Visit `https://www.karstenwade.com` - should redirect to apex domain
4. Check SSL certificate in browser (padlock icon)
5. Verify certificate is valid and issued by Let's Encrypt

### GitHub Pages Status

Check GitHub Pages settings page:
- [ ] Custom domain shows: karstenwade.com
- [ ] DNS check: Successful ✓
- [ ] HTTPS: Enabled ✓
- [ ] Certificate: Provisioned ✓

---

## Troubleshooting

### DNS Not Resolving

**Problem:** `dig karstenwade.com` returns no results or wrong IPs

**Solutions:**
1. Check A records are configured correctly at DNS provider
2. Verify TTL hasn't expired (wait for propagation)
3. Flush local DNS cache:
   ```bash
   # macOS
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

   # Linux
   sudo systemd-resolve --flush-caches

   # Windows
   ipconfig /flushdns
   ```
4. Use Google's DNS to test: `dig @8.8.8.8 karstenwade.com`

### SSL Certificate Not Provisioning

**Problem:** HTTPS checkbox grayed out or "Certificate not yet created"

**Solutions:**
1. Ensure DNS has fully propagated (can take 24-48 hours)
2. Verify CNAME file exists in gh-pages branch
3. Remove and re-add custom domain in GitHub settings
4. Check GitHub Status: https://www.githubstatus.com/
5. Wait 24 hours after DNS changes before troubleshooting further

### 404 Errors

**Problem:** Site shows 404 "There isn't a GitHub Pages site here"

**Solutions:**
1. Verify gh-pages branch exists and has content
2. Check CNAME file is in gh-pages root
3. Verify custom domain matches CNAME file exactly
4. Check GitHub Actions build succeeded
5. Ensure index.html exists in gh-pages root

### Mixed Content Warnings

**Problem:** HTTPS site shows "Not secure" or mixed content warnings

**Solutions:**
1. Ensure all resources use HTTPS URLs
2. Check for hardcoded http:// URLs in code
3. Use protocol-relative URLs: `//example.com/resource.js`
4. Or relative URLs: `/assets/image.png`

### WWW Not Redirecting

**Problem:** www.karstenwade.com doesn't redirect

**Solutions:**
1. Verify CNAME record for www exists
2. Check DNS propagation for www subdomain:
   ```bash
   dig www.karstenwade.com
   ```
3. Wait for DNS propagation (up to 48 hours)
4. GitHub automatically handles www redirect once DNS is configured

### Custom Domain Lost After Deploy

**Problem:** Custom domain resets to username.github.io after deploy

**Solutions:**
1. Ensure CNAME file is in public/ directory (source)
2. Verify Vite copies CNAME to dist/ during build
3. Check GitHub Actions workflow includes CNAME in deployment
4. CNAME must be in gh-pages branch root

---

## Maintenance

### Regular Checks

- **Monthly:** Verify site is accessible and HTTPS works
- **Quarterly:** Check SSL certificate expiry (should auto-renew)
- **Annually:** Review DNS configuration

### DNS Record Updates

If GitHub Pages IP addresses change (rare):
1. Check GitHub Pages documentation for new IPs
2. Update A records at DNS provider
3. Wait for DNS propagation
4. Verify site accessibility

### Certificate Renewal

GitHub handles SSL renewal automatically:
- Certificates renewed ~30 days before expiry
- No action required
- Monitor GitHub status page for issues

### Monitoring

Set up monitoring for:
- **Uptime:** Use service like Uptime Robot
- **SSL expiry:** SSL certificate monitors
- **DNS changes:** DNS monitoring tools

---

## Additional Resources

### Official Documentation
- [GitHub Pages Custom Domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [GitHub Pages IP Addresses](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain)
- [GitHub Status](https://www.githubstatus.com/)

### DNS Tools
- [DNS Propagation Checker](https://www.whatsmydns.net/)
- [DNS Lookup Tool](https://mxtoolbox.com/SuperTool.aspx)
- [SSL Certificate Checker](https://www.ssllabs.com/ssltest/)

### Support
- GitHub Pages Issues: https://github.com/orgs/community/discussions/categories/pages
- DNS Provider Support: Contact your DNS provider

---

## Summary Checklist

### Initial Setup
- [x] Create CNAME file in public/ directory
- [ ] Configure A records at DNS provider
- [ ] Add custom domain in GitHub Pages settings
- [ ] Wait for DNS propagation (up to 48 hours)
- [ ] Enable HTTPS in GitHub Pages settings
- [ ] Configure www CNAME record
- [ ] Verify all redirects work

### Post-Setup Verification
- [ ] DNS resolves correctly (`dig karstenwade.com`)
- [ ] HTTPS works and redirects from HTTP
- [ ] WWW redirects to apex domain
- [ ] SSL certificate is valid
- [ ] Site loads correctly in browsers
- [ ] GitHub Pages shows "DNS check successful"

### Documentation
- [x] DNS configuration documented
- [ ] Team notified of changes
- [ ] Monitoring configured
- [ ] Troubleshooting guide reviewed

---

**Questions or Issues?**

Open an issue on GitHub: https://github.com/karstenwade/karstenwade.com/issues

---

*Last verified: 2025-11-07*
