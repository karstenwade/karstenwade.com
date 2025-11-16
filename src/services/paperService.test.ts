import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  fetchPapersFromGitHub,
  getPapers,
  clearPapersCache,
  PaperParsingError,
} from './paperService'
import * as githubApi from './githubApi'

// Mock githubApi module
vi.mock('./githubApi', () => ({
  fetchMarkdownFiles: vi.fn(),
  fetchFileContent: vi.fn(),
  GitHubApiError: class GitHubApiError extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'GitHubApiError'
    }
  },
}))

describe('Paper Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearPapersCache()
  })

  afterEach(() => {
    clearPapersCache()
  })

  describe('fetchPapersFromGitHub', () => {
    it('should fetch and parse papers successfully', async () => {
      const mockMarkdown = `---
title: Test Paper
abstract: This is a test paper about testing
publicationDate: 2024-01-15
version: 1.0
category: Testing
tags: [test, example, paper]
featured: true
pdfUrl: https://example.com/paper.pdf
---

# Test Paper

This is the content of the paper.`

      vi.mocked(githubApi.fetchMarkdownFiles).mockResolvedValue([
        'test-paper.md',
        'README.md',
      ])
      vi.mocked(githubApi.fetchFileContent).mockResolvedValue(mockMarkdown)

      const papers = await fetchPapersFromGitHub()

      expect(papers).toHaveLength(1)
      expect(papers[0]).toMatchObject({
        title: 'Test Paper',
        abstract: 'This is a test paper about testing',
        publicationDate: '2024-01-15',
        version: '1.0',
        category: 'Testing',
        tags: ['test', 'example', 'paper'],
        featured: true,
        pdfUrl: 'https://example.com/paper.pdf',
      })
      expect(papers[0].externalUrl).toContain('github.com')
      expect(papers[0].externalUrl).toContain('test-paper.md')
    })

    it('should handle papers without optional fields', async () => {
      const mockMarkdown = `---
title: Minimal Paper
abstract: Minimal paper example
publicationDate: 2024-02-01
version: 1.0
category: Example
tags: [minimal]
---

# Minimal Paper`

      vi.mocked(githubApi.fetchMarkdownFiles).mockResolvedValue(['minimal.md'])
      vi.mocked(githubApi.fetchFileContent).mockResolvedValue(mockMarkdown)

      const papers = await fetchPapersFromGitHub()

      expect(papers).toHaveLength(1)
      expect(papers[0].featured).toBe(false)
      expect(papers[0].pdfUrl).toBeUndefined()
      expect(papers[0].description).toBeTruthy()
    })

    it('should filter out README.md files', async () => {
      vi.mocked(githubApi.fetchMarkdownFiles).mockResolvedValue([
        'README.md',
        'readme.MD',
        'ReAdMe.markdown',
      ])

      const papers = await fetchPapersFromGitHub()

      expect(papers).toHaveLength(0)
      expect(githubApi.fetchFileContent).not.toHaveBeenCalled()
    })

    it('should throw PaperParsingError for missing required fields', async () => {
      const invalidMarkdown = `---
title: Incomplete Paper
abstract: Missing other fields
---

# Content`

      vi.mocked(githubApi.fetchMarkdownFiles).mockResolvedValue([
        'incomplete.md',
      ])
      vi.mocked(githubApi.fetchFileContent).mockResolvedValue(invalidMarkdown)

      const papers = await fetchPapersFromGitHub()

      // Should skip invalid paper but not throw
      expect(papers).toHaveLength(0)
    })

    it('should handle invalid tags format', async () => {
      const invalidMarkdown = `---
title: Invalid Tags
abstract: Paper with invalid tags
publicationDate: 2024-01-01
version: 1.0
category: Test
tags: not-an-array
---

# Content`

      vi.mocked(githubApi.fetchMarkdownFiles).mockResolvedValue(['invalid.md'])
      vi.mocked(githubApi.fetchFileContent).mockResolvedValue(invalidMarkdown)

      const papers = await fetchPapersFromGitHub()

      // Should skip paper with invalid tags
      expect(papers).toHaveLength(0)
    })

    it('should continue processing after individual paper errors', async () => {
      const validMarkdown = `---
title: Valid Paper
abstract: This is valid
publicationDate: 2024-01-15
version: 1.0
category: Testing
tags: [test]
---

# Valid`

      const invalidMarkdown = `---
title: Invalid Paper
---

# Invalid`

      vi.mocked(githubApi.fetchMarkdownFiles).mockResolvedValue([
        'valid.md',
        'invalid.md',
      ])
      vi.mocked(githubApi.fetchFileContent)
        .mockResolvedValueOnce(validMarkdown)
        .mockResolvedValueOnce(invalidMarkdown)

      const papers = await fetchPapersFromGitHub()

      // Should have successfully parsed valid paper
      expect(papers).toHaveLength(1)
      expect(papers[0].title).toBe('Valid Paper')
    })

    it('should handle GitHub API errors', async () => {
      vi.mocked(githubApi.fetchMarkdownFiles).mockRejectedValue(
        new githubApi.GitHubApiError('API rate limit exceeded')
      )

      await expect(fetchPapersFromGitHub()).rejects.toThrow(PaperParsingError)
      await expect(fetchPapersFromGitHub()).rejects.toThrow(
        'Failed to fetch papers from GitHub'
      )
    })

    it('should handle markdown without frontmatter', async () => {
      const plainMarkdown = '# Just a heading\n\nSome content'

      vi.mocked(githubApi.fetchMarkdownFiles).mockResolvedValue(['plain.md'])
      vi.mocked(githubApi.fetchFileContent).mockResolvedValue(plainMarkdown)

      const papers = await fetchPapersFromGitHub()

      // Should skip paper without frontmatter
      expect(papers).toHaveLength(0)
    })
  })

  describe('getPapers', () => {
    it('should cache papers', async () => {
      const mockMarkdown = `---
title: Cached Paper
abstract: Testing cache
publicationDate: 2024-01-01
version: 1.0
category: Cache
tags: [cache]
---

# Content`

      vi.mocked(githubApi.fetchMarkdownFiles).mockResolvedValue(['cached.md'])
      vi.mocked(githubApi.fetchFileContent).mockResolvedValue(mockMarkdown)

      // First call: should fetch
      const papers1 = await getPapers(false, 60000) // 1 minute cache
      expect(githubApi.fetchMarkdownFiles).toHaveBeenCalledTimes(1)

      // Second call: should use cache
      const papers2 = await getPapers(false, 60000)
      expect(githubApi.fetchMarkdownFiles).toHaveBeenCalledTimes(1) // Still 1
      expect(papers2).toEqual(papers1)
    })

    it('should refresh cache when forceRefresh is true', async () => {
      const mockMarkdown = `---
title: Refresh Test
abstract: Testing refresh
publicationDate: 2024-01-01
version: 1.0
category: Test
tags: [test]
---

# Content`

      vi.mocked(githubApi.fetchMarkdownFiles).mockResolvedValue([
        'refresh.md',
      ])
      vi.mocked(githubApi.fetchFileContent).mockResolvedValue(mockMarkdown)

      // First call
      await getPapers(false, 60000)
      expect(githubApi.fetchMarkdownFiles).toHaveBeenCalledTimes(1)

      // Force refresh
      await getPapers(true, 60000)
      expect(githubApi.fetchMarkdownFiles).toHaveBeenCalledTimes(2)
    })

    it('should refresh cache when TTL expires', async () => {
      const mockMarkdown = `---
title: TTL Test
abstract: Testing TTL
publicationDate: 2024-01-01
version: 1.0
category: Test
tags: [test]
---

# Content`

      vi.mocked(githubApi.fetchMarkdownFiles).mockResolvedValue(['ttl.md'])
      vi.mocked(githubApi.fetchFileContent).mockResolvedValue(mockMarkdown)

      // First call with very short TTL
      await getPapers(false, 1) // 1ms cache
      expect(githubApi.fetchMarkdownFiles).toHaveBeenCalledTimes(1)

      // Wait for cache to expire
      await new Promise((resolve) => setTimeout(resolve, 10))

      // Second call: should fetch again
      await getPapers(false, 1)
      expect(githubApi.fetchMarkdownFiles).toHaveBeenCalledTimes(2)
    })
  })

  describe('clearPapersCache', () => {
    it('should clear the cache', async () => {
      const mockMarkdown = `---
title: Clear Test
abstract: Testing clear
publicationDate: 2024-01-01
version: 1.0
category: Test
tags: [test]
---

# Content`

      vi.mocked(githubApi.fetchMarkdownFiles).mockResolvedValue(['clear.md'])
      vi.mocked(githubApi.fetchFileContent).mockResolvedValue(mockMarkdown)

      // Fetch and cache
      await getPapers(false, 60000)
      expect(githubApi.fetchMarkdownFiles).toHaveBeenCalledTimes(1)

      // Clear cache
      clearPapersCache()

      // Fetch again: should call API
      await getPapers(false, 60000)
      expect(githubApi.fetchMarkdownFiles).toHaveBeenCalledTimes(2)
    })
  })
})
