#!/usr/bin/env tsx
/**
 * Generate sitemap.xml for karstenwade.com
 *
 * Fetches papers from GitHub and generates a sitemap with:
 * - Static pages (home, writing, cv, theories, papers)
 * - Individual paper pages (dynamically fetched)
 *
 * Usage:
 *   npm run generate-sitemap
 *   tsx scripts/generate-sitemap.ts
 */

import { writeFileSync } from 'fs'
import { join } from 'path'
import { fetchPapersFromGitHub } from '../src/services/paperService'

const BASE_URL = 'https://karstenwade.com'

interface SitemapURL {
  loc: string
  lastmod: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

/**
 * Static pages configuration
 */
const staticPages: SitemapURL[] = [
  {
    loc: `${BASE_URL}/`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 1.0,
  },
  {
    loc: `${BASE_URL}/papers`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    loc: `${BASE_URL}/writing`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    loc: `${BASE_URL}/cv`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    loc: `${BASE_URL}/theories`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.8,
  },
]

/**
 * Generate XML sitemap string
 */
function generateSitemapXML(urls: SitemapURL[]): string {
  const urlEntries = urls
    .map(
      (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority.toFixed(1)}</priority>
  </url>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`
}

/**
 * Main sitemap generation function
 */
async function main() {
  console.log('🗺️  Generating sitemap.xml...')

  try {
    // Start with static pages
    const allUrls: SitemapURL[] = [...staticPages]

    // Fetch papers from GitHub and add individual paper pages
    console.log('📄 Fetching papers from GitHub...')
    try {
      const papers = await fetchPapersFromGitHub()

      if (papers.length > 0) {
        console.log(`✅ Found ${papers.length} papers`)

        papers.forEach((paper) => {
          // Generate slug from paper's external URL
          const pathParts = paper.externalUrl.split('/')
          const filename = pathParts[pathParts.length - 1]
          const slug = filename.replace(/\.m(arkdown|d)$/i, '')

          allUrls.push({
            loc: `${BASE_URL}/papers/${slug}`,
            lastmod: paper.lastUpdated || paper.publicationDate,
            changefreq: 'monthly',
            priority: 0.8,
          })
        })
      } else {
        console.warn('⚠️  No papers found in repository')
      }
    } catch (error) {
      console.warn('⚠️  Failed to fetch papers from GitHub:', error)
      console.warn('   Continuing with static pages only')
    }

    // Generate XML
    const sitemapXML = generateSitemapXML(allUrls)

    // Write to public/sitemap.xml
    const outputPath = join(process.cwd(), 'public', 'sitemap.xml')
    writeFileSync(outputPath, sitemapXML, 'utf-8')

    console.log(`✅ Sitemap generated successfully!`)
    console.log(`   Total URLs: ${allUrls.length}`)
    console.log(`   Output: ${outputPath}`)
  } catch (error) {
    console.error('❌ Error generating sitemap:', error)
    process.exit(1)
  }
}

// Run main function
main()

export { main as generateSitemap }
