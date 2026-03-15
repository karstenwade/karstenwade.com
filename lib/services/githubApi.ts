// GitHub API client for fetching papers from karstenwade/papers repository
// Uses GitHub REST API v3 (no authentication required for public repos)

const GITHUB_API_BASE = 'https://api.github.com'
const RATE_LIMIT_DELAY = 1000 // 1 second delay between requests

/**
 * GitHub API response for repository contents
 */
export interface GitHubContent {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string | null
  type: 'file' | 'dir'
  _links: {
    self: string
    git: string
    html: string
  }
}

/**
 * GitHub API response for file content
 */
export interface GitHubFileContent extends GitHubContent {
  content: string // base64 encoded
  encoding: 'base64'
}

/**
 * Error thrown when GitHub API request fails
 */
export class GitHubApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: unknown
  ) {
    super(message)
    this.name = 'GitHubApiError'
  }
}

/**
 * Delay execution for rate limiting
 */
async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Fetch data from GitHub API with error handling and retry logic
 */
async function fetchFromGitHub<T>(
  url: string,
  retries = 3,
  retryDelay = RATE_LIMIT_DELAY
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'karstenwade.com-website',
        },
      })

      if (!response.ok) {
        // Handle rate limiting
        if (response.status === 403 || response.status === 429) {
          const resetTime = response.headers.get('X-RateLimit-Reset')
          if (resetTime && attempt < retries) {
            const waitTime = parseInt(resetTime) * 1000 - Date.now()
            console.warn(`Rate limited. Waiting ${waitTime}ms before retry...`)
            await delay(Math.max(waitTime, retryDelay))
            continue
          }
        }

        // Handle not found
        if (response.status === 404) {
          throw new GitHubApiError(
            `Resource not found: ${url}`,
            response.status
          )
        }

        // Other errors
        const errorData = await response.json().catch(() => ({}))
        throw new GitHubApiError(
          `GitHub API request failed: ${response.statusText}`,
          response.status,
          errorData
        )
      }

      const data = await response.json()
      return data as T
    } catch (error) {
      if (error instanceof GitHubApiError) {
        throw error
      }

      if (attempt === retries) {
        throw new GitHubApiError(
          `Failed to fetch from GitHub after ${retries} attempts: ${
            error instanceof Error ? error.message : String(error)
          }`
        )
      }

      console.warn(
        `Fetch attempt ${attempt} failed, retrying in ${retryDelay}ms...`
      )
      await delay(retryDelay)
    }
  }

  throw new GitHubApiError('Unexpected error: all retries exhausted')
}

/**
 * Fetch contents of a repository directory or file
 *
 * @param owner - Repository owner (e.g., "karstenwade")
 * @param repo - Repository name (e.g., "papers")
 * @param path - Path within repository (e.g., "" for root, "docs/paper.md" for file)
 * @returns Array of GitHubContent items (for directories) or single GitHubContent (for files)
 */
export async function fetchRepositoryContents(
  owner: string,
  repo: string,
  path = ''
): Promise<GitHubContent[]> {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`
  const data = await fetchFromGitHub<GitHubContent | GitHubContent[]>(url)

  // GitHub API returns single object for files, array for directories
  return Array.isArray(data) ? data : [data]
}

/**
 * Fetch the content of a file from GitHub
 *
 * @param owner - Repository owner (e.g., "karstenwade")
 * @param repo - Repository name (e.g., "papers")
 * @param path - Path to file (e.g., "paper.md")
 * @returns Decoded file content as string
 */
export async function fetchFileContent(
  owner: string,
  repo: string,
  path: string
): Promise<string> {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`
  const data = await fetchFromGitHub<GitHubFileContent>(url)

  if (data.type !== 'file') {
    throw new GitHubApiError(`Expected file, got ${data.type}: ${path}`)
  }

  if (!data.content || data.encoding !== 'base64') {
    throw new GitHubApiError(
      `Invalid file content encoding for ${path}: ${data.encoding}`
    )
  }

  // Decode base64 content
  try {
    // Use built-in atob for base64 decoding in browser/Node 20+
    const decoded = atob(data.content)
    return decoded
  } catch (error) {
    throw new GitHubApiError(
      `Failed to decode file content for ${path}: ${
        error instanceof Error ? error.message : String(error)
      }`
    )
  }
}

/**
 * Fetch all markdown files from a repository path
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param path - Path within repository (default: root)
 * @returns Array of markdown file paths
 */
export async function fetchMarkdownFiles(
  owner: string,
  repo: string,
  path = ''
): Promise<string[]> {
  const contents = await fetchRepositoryContents(owner, repo, path)

  const markdownFiles = contents
    .filter(
      (item) =>
        item.type === 'file' &&
        (item.name.endsWith('.md') || item.name.endsWith('.markdown'))
    )
    .map((item) => item.path)

  return markdownFiles
}
