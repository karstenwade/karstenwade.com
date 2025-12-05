# Free Tier Constraints & Optimization

**Goal:** Run karstenwade.com entirely on free tiers ($0/month budget)

---

## Platform Free Tier Limits

### Vercel (Next.js Frontend)
**Free Tier (Hobby Plan):**
- ✅ 100 GB bandwidth/month
- ✅ 6,000 build minutes/month
- ✅ Unlimited serverless function executions
- ✅ 100 GB-hours serverless function execution time/month
- ✅ Custom domain with automatic HTTPS
- ✅ Automatic deployments from Git
- ✅ Preview deployments for all branches
- ⚠️ 1 concurrent build only
- ⚠️ 10-second max serverless function duration

**Our Usage Estimate:**
- **Bandwidth:** ~5-10 GB/month (low-traffic personal site)
- **Builds:** ~50/month (assuming 1-2 deploys/day during development)
- **Function time:** Minimal (static site with occasional revalidation)
- **Risk:** LOW - well within limits

### Railway (Strapi CMS Backend)
**Free Tier (Trial Plan):**
- ⚠️ $5 in free credits/month
- ⚠️ Credits expire if not used
- ⚠️ No free tier after trial ends (requires payment method)
- ✅ 512 MB RAM per service
- ✅ 1 GB disk storage
- ✅ Shared CPU
- ⚠️ Services sleep after 30 minutes of inactivity

**Alternative: Railway Developer Plan**
- $5/month base fee
- $5 in included usage credits
- **NOT FREE** - requires payment

**Our Usage Estimate:**
- **Cost:** ~$3-4/month (estimated)
- **Risk:** MEDIUM - May exceed $5/month free credits
- **Mitigation:**
  - Keep Strapi minimal (no media uploads initially)
  - Use external image hosting (Cloudinary free tier)
  - Monitor Railway dashboard daily during first month

**⚠️ CRITICAL DECISION NEEDED:**
Railway no longer offers a permanent free tier. Options:
1. **Pay $5/month for Railway** (cheapest Strapi hosting)
2. **Self-host Strapi** on free services (Render.com has 750hr/month free)
3. **Delay Strapi integration** until budget available
4. **Keep .ts data files** (no CMS, current approach)

**Recommendation:** Check **Render.com** (750 free hours/month) or **Fly.io** (3 shared-cpu VMs free)

### Alternative: Render.com (Strapi Backend)
**Free Tier:**
- ✅ 750 hours/month per service (enough for 24/7 uptime)
- ✅ 512 MB RAM
- ✅ Automatic HTTPS
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ Cold starts can take 30-60 seconds
- ✅ PostgreSQL free tier: 90 days, then expires

**Our Usage Estimate:**
- **Cost:** $0/month ✅
- **Risk:** LOW - 750 hours covers full month
- **Trade-off:** Cold starts for first visitor after idle period

### Cloudinary (Image Hosting)
**Free Tier:**
- ✅ 25 GB storage
- ✅ 25 GB bandwidth/month
- ✅ Image transformations/optimization
- ✅ Generous API limits

**Our Usage Estimate:**
- **Storage:** <1 GB (personal site)
- **Bandwidth:** <5 GB/month
- **Risk:** LOW - well within limits

---

## Recommended Architecture (Zero Cost)

```
┌─────────────────────────────────────────────┐
│  USER REQUEST                                │
│  https://karstenwade.com                     │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  VERCEL (Next.js 15)                         │
│  - Static site generation (SSG)              │
│  - On-demand revalidation                    │
│  - API routes for webhooks                   │
│  Free Tier: ✅ 100 GB bandwidth              │
└─────────────────┬───────────────────────────┘
                  │
                  │ (Fetch content via API)
                  ▼
┌─────────────────────────────────────────────┐
│  RENDER.COM (Strapi CMS)                     │
│  - Headless CMS                              │
│  - REST API                                  │
│  - PostgreSQL database (90-day trial)        │
│  Free Tier: ✅ 750 hours/month               │
│  Trade-off: ⚠️ Cold starts (30-60s)         │
└─────────────────┬───────────────────────────┘
                  │
                  │ (Webhook on content publish)
                  ▼
┌─────────────────────────────────────────────┐
│  VERCEL API ROUTE                            │
│  /api/revalidate                             │
│  - Receives Strapi webhook                   │
│  - Triggers on-demand revalidation           │
└─────────────────────────────────────────────┘
```

**Alternative: PostgreSQL for Strapi**
- Render.com PG: 90 days free, then expires
- **Supabase:** PostgreSQL free tier (500 MB, unlimited bandwidth)
- **Neon:** PostgreSQL free tier (0.5 GB storage, 1 compute hour/month)

**Recommendation:** Use **Supabase PostgreSQL** (permanent free tier)

---

## Cost Optimization Strategies

### 1. Minimize Vercel Builds
- ❌ Don't use time-based ISR (causes automatic rebuilds)
- ✅ Use on-demand revalidation only (triggered by webhooks)
- ✅ Test locally before deploying
- ✅ Batch multiple changes into single deploy

### 2. Minimize Strapi Activity
- ✅ Enable Strapi caching
- ✅ Keep Strapi service sleeping when not in use
- ✅ Batch content updates (don't publish every tiny change)
- ⚠️ Accept cold start delays (30-60s on first request)

### 3. Optimize Images
- ✅ Use next/image for automatic optimization
- ✅ Host images on Cloudinary (free tier)
- ✅ Use modern formats (WebP, AVIF)
- ✅ Lazy load below-the-fold images

### 4. Reduce Bundle Size
- ✅ Use Next.js automatic code splitting
- ✅ Import only needed components from libraries
- ✅ Remove unused dependencies
- ✅ Use dynamic imports for heavy components

---

## Monitoring & Alerts

### Vercel Dashboard
Monitor daily during first month:
- [ ] Bandwidth usage (stay under 100 GB)
- [ ] Build minutes (stay under 6,000)
- [ ] Function execution time

### Render.com Dashboard
Monitor weekly:
- [ ] Service uptime hours (stay under 750/month)
- [ ] Cold start frequency
- [ ] Database storage (if using Render PG)

### Supabase Dashboard (if using)
Monitor weekly:
- [ ] Database size (stay under 500 MB)
- [ ] API requests

---

## Contingency Plan

**If we exceed free tier limits:**

### Scenario 1: Vercel Bandwidth Exceeded
- **Trigger:** >80 GB bandwidth in a month
- **Action:**
  - Move images to Cloudinary
  - Enable aggressive caching
  - Optimize bundle size

### Scenario 2: Render.com Hours Exceeded
- **Trigger:** >700 hours used in month
- **Action:**
  - Switch to Fly.io free tier (3 VMs)
  - Or temporarily disable Strapi, use .ts files

### Scenario 3: Supabase Storage Exceeded
- **Trigger:** >400 MB database size
- **Action:**
  - Archive old content
  - Reduce content in CMS
  - Consider Neon PostgreSQL

---

## Free Tier Comparison

| Service | Free Tier | Best For | Limitations |
|---------|-----------|----------|-------------|
| **Vercel** | 100 GB bandwidth, 6K build min | Next.js hosting | 1 concurrent build |
| **Render.com** | 750 hrs/month | Strapi backend | Cold starts |
| **Railway** | $5 credit/month | Quick setup | Not actually free |
| **Fly.io** | 3 shared VMs | Strapi + flexibility | More complex setup |
| **Supabase** | 500 MB PG database | PostgreSQL | Database only |
| **Neon** | 0.5 GB storage | PostgreSQL | Small storage |
| **Cloudinary** | 25 GB storage + bandwidth | Images | Generous limits |

---

## Recommended Stack (Zero Cost)

```
Frontend:  Vercel (Next.js)
Backend:   Render.com (Strapi)
Database:  Supabase (PostgreSQL)
Images:    Cloudinary
Analytics: Google Analytics (already integrated)
```

**Total Monthly Cost:** $0 ✅

**Trade-offs:**
- ⚠️ Cold starts on Strapi (30-60 seconds after idle)
- ⚠️ Supabase 500 MB database limit (enough for text content)
- ⚠️ Need to monitor usage monthly

**When to Upgrade:**
- Traffic exceeds 100 GB bandwidth/month
- Database exceeds 500 MB
- Cold starts become unacceptable for users
- Render.com hours consistently exceed 750/month
