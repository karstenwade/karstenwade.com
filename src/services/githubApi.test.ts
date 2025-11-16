import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  fetchRepositoryContents,
  fetchFileContent,
  fetchMarkdownFiles,
  GitHubApiError,
  type GitHubContent,
  type GitHubFileContent,
} from './githubApi'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch as unknown as typeof fetch

describe('GitHub API Client', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('fetchRepositoryContents', () => {
    it('should fetch directory contents successfully', async () => {
      const mockResponse: GitHubContent[] = [
        {
          name: 'paper1.md',
          path: 'paper1.md',
          sha: 'abc123',
          size: 1024,
          url: 'https://api.github.com/repos/karstenwade/papers/contents/paper1.md',
          html_url: 'https://github.com/karstenwade/papers/blob/main/paper1.md',
          git_url: 'https://api.github.com/repos/karstenwade/papers/git/blobs/abc123',
          download_url: 'https://raw.githubusercontent.com/karstenwade/papers/main/paper1.md',
          type: 'file',
          _links: {
            self: 'https://api.github.com/repos/karstenwade/papers/contents/paper1.md',
            git: 'https://api.github.com/repos/karstenwade/papers/git/blobs/abc123',
            html: 'https://github.com/karstenwade/papers/blob/main/paper1.md',
          },
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers(),
      })

      const result = await fetchRepositoryContents('karstenwade', 'papers', '')

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/karstenwade/papers/contents/',
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: 'application/vnd.github.v3+json',
          }),
        })
      )
    })

    it('should handle single file response', async () => {
      const mockResponse: GitHubContent = {
        name: 'README.md',
        path: 'README.md',
        sha: 'def456',
        size: 512,
        url: 'https://api.github.com/repos/karstenwade/papers/contents/README.md',
        html_url: 'https://github.com/karstenwade/papers/blob/main/README.md',
        git_url: 'https://api.github.com/repos/karstenwade/papers/git/blobs/def456',
        download_url: 'https://raw.githubusercontent.com/karstenwade/papers/main/README.md',
        type: 'file',
        _links: {
          self: 'https://api.github.com/repos/karstenwade/papers/contents/README.md',
          git: 'https://api.github.com/repos/karstenwade/papers/git/blobs/def456',
          html: 'https://github.com/karstenwade/papers/blob/main/README.md',
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers(),
      })

      const result = await fetchRepositoryContents('karstenwade', 'papers', 'README.md')

      expect(result).toEqual([mockResponse])
    })

    it('should throw GitHubApiError on 404', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Not Found' }),
        headers: new Headers(),
      })

      await expect(
        fetchRepositoryContents('karstenwade', 'nonexistent', '')
      ).rejects.toThrow(GitHubApiError)
    })

    it('should retry on rate limit (403)', async () => {
      const mockResponse: GitHubContent[] = []

      // First attempt: rate limited
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: async () => ({ message: 'API rate limit exceeded' }),
        headers: new Headers({
          'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 1),
        }),
      })

      // Second attempt: success
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers(),
      })

      const result = await fetchRepositoryContents('karstenwade', 'papers', '')

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('fetchFileContent', () => {
    it('should fetch and decode file content successfully', async () => {
      const fileContent = 'Hello, World!'
      const base64Content = btoa(fileContent) // base64 encode

      const mockResponse: GitHubFileContent = {
        name: 'test.md',
        path: 'test.md',
        sha: 'xyz789',
        size: fileContent.length,
        url: 'https://api.github.com/repos/karstenwade/papers/contents/test.md',
        html_url: 'https://github.com/karstenwade/papers/blob/main/test.md',
        git_url: 'https://api.github.com/repos/karstenwade/papers/git/blobs/xyz789',
        download_url: 'https://raw.githubusercontent.com/karstenwade/papers/main/test.md',
        type: 'file',
        content: base64Content,
        encoding: 'base64',
        _links: {
          self: 'https://api.github.com/repos/karstenwade/papers/contents/test.md',
          git: 'https://api.github.com/repos/karstenwade/papers/git/blobs/xyz789',
          html: 'https://github.com/karstenwade/papers/blob/main/test.md',
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers(),
      })

      const result = await fetchFileContent('karstenwade', 'papers', 'test.md')

      expect(result).toBe(fileContent)
    })

    it('should throw error if content type is not file', async () => {
      const mockResponse: GitHubContent = {
        name: 'directory',
        path: 'directory',
        sha: 'dir123',
        size: 0,
        url: 'https://api.github.com/repos/karstenwade/papers/contents/directory',
        html_url: 'https://github.com/karstenwade/papers/tree/main/directory',
        git_url: 'https://api.github.com/repos/karstenwade/papers/git/trees/dir123',
        download_url: null,
        type: 'dir',
        _links: {
          self: 'https://api.github.com/repos/karstenwade/papers/contents/directory',
          git: 'https://api.github.com/repos/karstenwade/papers/git/trees/dir123',
          html: 'https://github.com/karstenwade/papers/tree/main/directory',
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers(),
      })

      await expect(
        fetchFileContent('karstenwade', 'papers', 'directory')
      ).rejects.toThrow('Expected file, got dir')
    })
  })

  describe('fetchMarkdownFiles', () => {
    it('should filter and return only markdown files', async () => {
      const mockResponse: GitHubContent[] = [
        {
          name: 'paper1.md',
          path: 'paper1.md',
          sha: 'abc123',
          size: 1024,
          url: 'https://api.github.com/repos/karstenwade/papers/contents/paper1.md',
          html_url: 'https://github.com/karstenwade/papers/blob/main/paper1.md',
          git_url: 'https://api.github.com/repos/karstenwade/papers/git/blobs/abc123',
          download_url: 'https://raw.githubusercontent.com/karstenwade/papers/main/paper1.md',
          type: 'file',
          _links: {
            self: 'https://api.github.com/repos/karstenwade/papers/contents/paper1.md',
            git: 'https://api.github.com/repos/karstenwade/papers/git/blobs/abc123',
            html: 'https://github.com/karstenwade/papers/blob/main/paper1.md',
          },
        },
        {
          name: 'paper2.markdown',
          path: 'paper2.markdown',
          sha: 'def456',
          size: 2048,
          url: 'https://api.github.com/repos/karstenwade/papers/contents/paper2.markdown',
          html_url: 'https://github.com/karstenwade/papers/blob/main/paper2.markdown',
          git_url: 'https://api.github.com/repos/karstenwade/papers/git/blobs/def456',
          download_url: 'https://raw.githubusercontent.com/karstenwade/papers/main/paper2.markdown',
          type: 'file',
          _links: {
            self: 'https://api.github.com/repos/karstenwade/papers/contents/paper2.markdown',
            git: 'https://api.github.com/repos/karstenwade/papers/git/blobs/def456',
            html: 'https://github.com/karstenwade/papers/blob/main/paper2.markdown',
          },
        },
        {
          name: 'README.txt',
          path: 'README.txt',
          sha: 'ghi789',
          size: 512,
          url: 'https://api.github.com/repos/karstenwade/papers/contents/README.txt',
          html_url: 'https://github.com/karstenwade/papers/blob/main/README.txt',
          git_url: 'https://api.github.com/repos/karstenwade/papers/git/blobs/ghi789',
          download_url: 'https://raw.githubusercontent.com/karstenwade/papers/main/README.txt',
          type: 'file',
          _links: {
            self: 'https://api.github.com/repos/karstenwade/papers/contents/README.txt',
            git: 'https://api.github.com/repos/karstenwade/papers/git/blobs/ghi789',
            html: 'https://github.com/karstenwade/papers/blob/main/README.txt',
          },
        },
        {
          name: 'directory',
          path: 'directory',
          sha: 'jkl012',
          size: 0,
          url: 'https://api.github.com/repos/karstenwade/papers/contents/directory',
          html_url: 'https://github.com/karstenwade/papers/tree/main/directory',
          git_url: 'https://api.github.com/repos/karstenwade/papers/git/trees/jkl012',
          download_url: null,
          type: 'dir',
          _links: {
            self: 'https://api.github.com/repos/karstenwade/papers/contents/directory',
            git: 'https://api.github.com/repos/karstenwade/papers/git/trees/jkl012',
            html: 'https://github.com/karstenwade/papers/tree/main/directory',
          },
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers(),
      })

      const result = await fetchMarkdownFiles('karstenwade', 'papers', '')

      expect(result).toEqual(['paper1.md', 'paper2.markdown'])
    })
  })
})
