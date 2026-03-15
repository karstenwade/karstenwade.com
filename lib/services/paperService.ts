// Paper fetching and parsing service
// Fetches papers from GitHub repository and parses markdown frontmatter

import {
  fetchMarkdownFiles,
  fetchFileContent,
  GitHubApiError,
} from './githubApi'
import type { Paper } from '@/data/papers'

const PAPERS_REPO_OWNER = 'karstenwade'
const PAPERS_REPO_NAME = 'papers'

/**
 * Frontmatter metadata extracted from markdown files
 */
export interface PaperFrontmatter {
  title: string
  description?: string
  abstract: string
  publicationDate: string
  lastUpdated?: string
  version: string
  category: string
  tags: string[]
  featured?: boolean
  pdfUrl?: string
}

/**
 * Error thrown when paper parsing fails
 */
export class PaperParsingError extends Error {
  constructor(
    message: string,
    public filePath?: string,
    public cause?: unknown
  ) {
    super(message)
    this.name = 'PaperParsingError'
  }
}

/**
 * Parse YAML frontmatter from markdown content
 *
 * Expects format:
 * ---
 * key: value
 * array: [item1, item2]
 * ---
 * # Markdown content
 */
function parseFrontmatter(markdown: string): {
  frontmatter: Record<string, unknown>
  content: string
} {
  // Match frontmatter between --- delimiters
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = markdown.match(frontmatterRegex)

  if (!match) {
    return {
      frontmatter: {},
      content: markdown,
    }
  }

  const [, frontmatterText, content] = match
  const frontmatter: Record<string, unknown> = {}

  // Parse simple YAML (key: value format)
  const lines = frontmatterText.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    // Handle "key: value" format
    const colonIndex = trimmed.indexOf(':')
    if (colonIndex === -1) continue

    const key = trimmed.slice(0, colonIndex).trim()
    let value: unknown = trimmed.slice(colonIndex + 1).trim()

    // Parse arrays: [item1, item2, item3]
    if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
      const arrayContent = value.slice(1, -1)
      value = arrayContent.split(',').map((item) => item.trim())
    }

    // Parse booleans
    if (value === 'true') value = true
    if (value === 'false') value = false

    frontmatter[key] = value
  }

  return {
    frontmatter,
    content: content.trim(),
  }
}

/**
 * Validate and transform frontmatter to PaperFrontmatter interface
 */
function validateFrontmatter(
  frontmatter: Record<string, unknown>,
  filePath: string
): PaperFrontmatter {
  const required = ['title', 'abstract', 'publicationDate', 'version', 'category', 'tags']
  const missing = required.filter((key) => !frontmatter[key])

  if (missing.length > 0) {
    throw new PaperParsingError(
      `Missing required frontmatter fields: ${missing.join(', ')}`,
      filePath
    )
  }

  // Validate tags is array
  if (!Array.isArray(frontmatter.tags)) {
    throw new PaperParsingError('Frontmatter field "tags" must be an array', filePath)
  }

  return {
    title: String(frontmatter.title),
    description: frontmatter.description ? String(frontmatter.description) : undefined,
    abstract: String(frontmatter.abstract),
    publicationDate: String(frontmatter.publicationDate),
    lastUpdated: frontmatter.lastUpdated ? String(frontmatter.lastUpdated) : undefined,
    version: String(frontmatter.version),
    category: String(frontmatter.category),
    tags: frontmatter.tags as string[],
    featured: frontmatter.featured === true,
    pdfUrl: frontmatter.pdfUrl ? String(frontmatter.pdfUrl) : undefined,
  }
}

/**
 * Transform GitHub markdown file to Paper object
 */
function transformToPaper(
  frontmatter: PaperFrontmatter,
  filePath: string
): Paper {
  // Generate external URL to GitHub
  const externalUrl = `https://github.com/${PAPERS_REPO_OWNER}/${PAPERS_REPO_NAME}/blob/main/${filePath}`

  // Generate repository link
  const repository = `https://github.com/${PAPERS_REPO_OWNER}/${PAPERS_REPO_NAME}`

  return {
    title: frontmatter.title,
    description: frontmatter.description || frontmatter.abstract.slice(0, 150) + '...',
    abstract: frontmatter.abstract,
    externalUrl,
    pdfUrl: frontmatter.pdfUrl,
    repository,
    publicationDate: frontmatter.publicationDate,
    lastUpdated: frontmatter.lastUpdated || frontmatter.publicationDate,
    version: frontmatter.version,
    category: frontmatter.category,
    tags: frontmatter.tags,
    featured: frontmatter.featured || false,
  }
}

/**
 * Fetch all papers from GitHub repository
 *
 * @returns Array of Paper objects
 */
export async function fetchPapersFromGitHub(): Promise<Paper[]> {
  try {
    // Fetch all markdown files from repository root
    const markdownFiles = await fetchMarkdownFiles(
      PAPERS_REPO_OWNER,
      PAPERS_REPO_NAME,
      ''
    )

    // Filter out README.md and other non-paper files
    const paperFiles = markdownFiles.filter(
      (file) => !file.toLowerCase().includes('readme')
    )

    if (paperFiles.length === 0) {
      console.warn('No papers found in repository (excluding README)')
      return []
    }

    // Fetch and parse each paper
    const papers: Paper[] = []
    for (const filePath of paperFiles) {
      try {
        // Fetch file content
        const markdown = await fetchFileContent(
          PAPERS_REPO_OWNER,
          PAPERS_REPO_NAME,
          filePath
        )

        // Parse frontmatter
        const { frontmatter } = parseFrontmatter(markdown)

        // Validate and transform
        const paperFrontmatter = validateFrontmatter(frontmatter, filePath)
        const paper = transformToPaper(paperFrontmatter, filePath)

        papers.push(paper)
      } catch (error) {
        console.error(`Failed to parse paper ${filePath}:`, error)
        // Continue processing other papers
        continue
      }
    }

    return papers
  } catch (error) {
    if (error instanceof GitHubApiError) {
      throw new PaperParsingError(
        `Failed to fetch papers from GitHub: ${error.message}`,
        undefined,
        error
      )
    }
    throw error
  }
}

/**
 * Cache for fetched papers
 */
let cachedPapers: Paper[] | null = null
let cacheTimestamp = 0

/**
 * Fetch papers with caching
 *
 * @param forceRefresh - Force refresh cache
 * @param cacheTTL - Cache time-to-live in milliseconds (default: 5 minutes)
 * @returns Array of Paper objects
 */
export async function getPapers(
  forceRefresh = false,
  cacheTTL = 5 * 60 * 1000
): Promise<Paper[]> {
  const now = Date.now()

  if (!forceRefresh && cachedPapers && now - cacheTimestamp < cacheTTL) {
    return cachedPapers
  }

  const papers = await fetchPapersFromGitHub()
  cachedPapers = papers
  cacheTimestamp = now

  return papers
}

/**
 * Clear cached papers
 */
export function clearPapersCache(): void {
  cachedPapers = null
  cacheTimestamp = 0
}

/**
 * Get a single paper by its slug (filename without .md extension)
 *
 * @param slug - The paper slug (e.g., "open-source-way-2.0")
 * @returns Paper object with full content
 * @throws PaperParsingError if paper not found or parsing fails
 */
export async function getPaperBySlug(slug: string): Promise<{
  paper: Paper
  markdown: string
}> {
  try {
    // Construct file path (slug + .md extension)
    const filePath = `${slug}.md`

    // Fetch markdown content
    const markdown = await fetchFileContent(
      PAPERS_REPO_OWNER,
      PAPERS_REPO_NAME,
      filePath
    )

    // Parse frontmatter
    const { frontmatter, content } = parseFrontmatter(markdown)

    // Validate and transform to Paper object
    const paperFrontmatter = validateFrontmatter(frontmatter, filePath)
    const paper = transformToPaper(paperFrontmatter, filePath)

    // Add slug to paper object
    const paperWithSlug: Paper = {
      ...paper,
      slug,
      id: slug,
    }

    return {
      paper: paperWithSlug,
      markdown: content,
    }
  } catch (error) {
    if (error instanceof GitHubApiError) {
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        throw new PaperParsingError(
          `Paper "${slug}" not found in repository`,
          `${slug}.md`,
          error
        )
      }
      throw new PaperParsingError(
        `Failed to fetch paper "${slug}": ${error.message}`,
        `${slug}.md`,
        error
      )
    }
    if (error instanceof PaperParsingError) {
      throw error
    }
    throw new PaperParsingError(
      `Unexpected error loading paper "${slug}"`,
      `${slug}.md`,
      error
    )
  }
}
