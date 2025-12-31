/**
 * GitHub Sync Service Tests
 *
 * Test-Driven Development approach:
 * - Tests written BEFORE implementation
 * - Covers all edge cases and error conditions
 * - Uses AAA pattern (Arrange, Act, Assert)
 */

import { describe, expect, test, beforeEach, jest } from '@jest/globals';

// Test data constants
const MOCK_PAPER_MARKDOWN = `---
title: "Test Paper"
abstract: "This is a test abstract"
version: "1.0"
publication_date: "2024-01-15"
category: "community"
tags: ["open-source", "collaboration"]
featured: false
pdf_url: "https://example.com/paper.pdf"
---

# Test Paper Content

This is the main content of the paper.
`;

const MOCK_TOSW_MARKDOWN = `# Getting Started with Open Source

This is the first paragraph describing the chapter.

## Section 1

More content here.
`;

const MOCK_GITHUB_FILES = [
  {
    name: 'paper1.md',
    path: 'papers/paper1.md',
    sha: 'abc123',
    type: 'file' as const,
    download_url: 'https://raw.githubusercontent.com/karstenwade/papers/main/papers/paper1.md',
  },
  {
    name: 'paper2.md',
    path: 'papers/paper2.md',
    sha: 'def456',
    type: 'file' as const,
    download_url: 'https://raw.githubusercontent.com/karstenwade/papers/main/papers/paper2.md',
  },
  {
    name: 'README.md',
    path: 'README.md',
    sha: 'ghi789',
    type: 'file' as const,
  },
];

const MOCK_TOSW_FILES = [
  {
    name: '01-introduction.md',
    path: 'getting-started/01-introduction.md',
    sha: 'tosw123',
    type: 'file' as const,
    download_url: 'https://raw.githubusercontent.com/theopensourceway/guidebook/main/getting-started/01-introduction.md',
  },
];

// Mock documents API
const mockDocuments = {
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// Mock Strapi global
const mockStrapi = {
  documents: jest.fn(() => mockDocuments),
  log: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
};

// Make strapi available globally for tests
(global as any).strapi = mockStrapi;

// Import after global setup
let GitHubSyncService: any;
let githubSyncService: any;

beforeEach(async () => {
  // Reset mocks before each test
  jest.clearAllMocks();
  mockDocuments.findMany.mockReset();
  mockDocuments.create.mockReset();
  mockDocuments.update.mockReset();
  mockDocuments.delete.mockReset();

  // Dynamic import to ensure strapi is set up
  const module = await import('./github-sync');
  GitHubSyncService = (module as any).GitHubSyncService;
  githubSyncService = (module as any).default;
});

describe('GitHubSyncService', () => {
  describe('Constructor and Configuration', () => {
    test('should initialize with correct repository configurations', () => {
      expect(githubSyncService).toBeDefined();
      expect(githubSyncService.papersRepo).toBe('karstenwade/papers');
      expect(githubSyncService.toswRepo).toBe('theopensourceway/guidebook');
    });

    test('should read GITHUB_ACCESS_TOKEN from environment if available', () => {
      const originalToken = process.env.GITHUB_ACCESS_TOKEN;
      process.env.GITHUB_ACCESS_TOKEN = 'test_token_123';

      const service = new GitHubSyncService();
      expect(service.githubToken).toBe('test_token_123');

      // Restore
      if (originalToken) {
        process.env.GITHUB_ACCESS_TOKEN = originalToken;
      } else {
        delete process.env.GITHUB_ACCESS_TOKEN;
      }
    });
  });

  describe('parseFrontmatter', () => {
    test('should parse valid YAML frontmatter', () => {
      const result = githubSyncService.parseFrontmatter(MOCK_PAPER_MARKDOWN);

      expect(result).toBeDefined();
      expect(result.frontmatter).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.frontmatter.title).toBe('Test Paper');
      expect(result.frontmatter.abstract).toBe('This is a test abstract');
      expect(result.frontmatter.tags).toEqual(['open-source', 'collaboration']);
    });

    test('should extract content without frontmatter', () => {
      const result = githubSyncService.parseFrontmatter(MOCK_PAPER_MARKDOWN);

      expect(result.content).toContain('# Test Paper Content');
      expect(result.content).toContain('This is the main content of the paper');
      expect(result.content).not.toContain('---');
    });

    test('should handle markdown without frontmatter', () => {
      const markdown = '# Just a title\n\nSome content.';
      const result = githubSyncService.parseFrontmatter(markdown);

      expect(result.frontmatter).toEqual({});
      expect(result.content).toBe(markdown);
    });

    test('should handle empty frontmatter', () => {
      const markdown = '---\n---\n\n# Content';
      const result = githubSyncService.parseFrontmatter(markdown);

      expect(result.frontmatter).toEqual({});
      expect(result.content).toContain('# Content');
    });

    test('should throw error on malformed frontmatter', () => {
      const badMarkdown = '---\ntitle: "Unclosed quote\n---\nContent';

      expect(() => {
        githubSyncService.parseFrontmatter(badMarkdown);
      }).toThrow();
    });
  });

  describe('needsUpdate', () => {
    test('should return true when SHAs differ', () => {
      const existingEntry = { github_sha: 'old_sha_123' };
      const newSha = 'new_sha_456';

      const result = githubSyncService.needsUpdate(existingEntry, newSha);

      expect(result).toBe(true);
    });

    test('should return false when SHAs match', () => {
      const existingEntry = { github_sha: 'same_sha' };
      const newSha = 'same_sha';

      const result = githubSyncService.needsUpdate(existingEntry, newSha);

      expect(result).toBe(false);
    });

    test('should return true when existing entry has no SHA', () => {
      const existingEntry = {};
      const newSha = 'new_sha';

      const result = githubSyncService.needsUpdate(existingEntry, newSha);

      expect(result).toBe(true);
    });

    test('should return true when existing entry is null', () => {
      const result = githubSyncService.needsUpdate(null, 'new_sha');

      expect(result).toBe(true);
    });
  });

  describe('mapPaperToStrapi', () => {
    test('should map GitHub file with frontmatter to Strapi entry', () => {
      const file = MOCK_GITHUB_FILES[0];
      const parsed = githubSyncService.parseFrontmatter(MOCK_PAPER_MARKDOWN);

      const mapped = githubSyncService.mapPaperToStrapi(file, parsed);

      expect(mapped).toMatchObject({
        title: 'Test Paper',
        abstract: 'This is a test abstract',
        version: '1.0',
        publication_date: '2024-01-15',
        featured: false,
        pdf_url: 'https://example.com/paper.pdf',
        github_path: 'papers/paper1.md',
        github_sha: 'abc123',
        external_url: file.download_url,
        source: 'github-papers',
        content: parsed.content,
      });
    });

    test('should handle missing optional fields', () => {
      const file = { ...MOCK_GITHUB_FILES[0] };
      const minimalMarkdown = `---
title: "Minimal Paper"
abstract: "Short abstract"
---

Content here.`;
      const parsed = githubSyncService.parseFrontmatter(minimalMarkdown);

      const mapped = githubSyncService.mapPaperToStrapi(file, parsed);

      expect(mapped.title).toBe('Minimal Paper');
      expect(mapped.abstract).toBe('Short abstract');
      expect(mapped.version).toBe('1.0'); // Default
      expect(mapped.pdf_url).toBeUndefined();
      expect(mapped.featured).toBe(false); // Default
    });

    test('should extract description from abstract if not provided', () => {
      const file = MOCK_GITHUB_FILES[0];
      const parsed = githubSyncService.parseFrontmatter(MOCK_PAPER_MARKDOWN);

      const mapped = githubSyncService.mapPaperToStrapi(file, parsed);

      // Description should be truncated abstract (first 300 chars)
      expect(mapped.description).toBeDefined();
      expect(mapped.description.length).toBeLessThanOrEqual(300);
    });
  });

  describe('mapToswChapterToStrapi', () => {
    test('should extract title from first H1 heading', () => {
      const file = MOCK_TOSW_FILES[0];
      const parsed = githubSyncService.parseFrontmatter(MOCK_TOSW_MARKDOWN);

      const mapped = githubSyncService.mapToswChapterToStrapi(file, parsed, 'getting-started');

      expect(mapped.title).toBe('Getting Started with Open Source');
    });

    test('should extract description from first paragraph', () => {
      const file = MOCK_TOSW_FILES[0];
      const parsed = githubSyncService.parseFrontmatter(MOCK_TOSW_MARKDOWN);

      const mapped = githubSyncService.mapToswChapterToStrapi(file, parsed, 'getting-started');

      expect(mapped.description).toBe('This is the first paragraph describing the chapter.');
    });

    test('should extract section from directory name', () => {
      const file = MOCK_TOSW_FILES[0];
      const parsed = githubSyncService.parseFrontmatter(MOCK_TOSW_MARKDOWN);

      const mapped = githubSyncService.mapToswChapterToStrapi(file, parsed, 'getting-started');

      expect(mapped.section).toBe('getting-started');
    });

    test('should extract chapter order from filename', () => {
      const file = MOCK_TOSW_FILES[0]; // 01-introduction.md
      const parsed = githubSyncService.parseFrontmatter(MOCK_TOSW_MARKDOWN);

      const mapped = githubSyncService.mapToswChapterToStrapi(file, parsed, 'getting-started');

      expect(mapped.chapter_order).toBe(1);
    });

    test('should set license to CC BY-SA 4.0', () => {
      const file = MOCK_TOSW_FILES[0];
      const parsed = githubSyncService.parseFrontmatter(MOCK_TOSW_MARKDOWN);

      const mapped = githubSyncService.mapToswChapterToStrapi(file, parsed, 'getting-started');

      expect(mapped.license).toBe('CC BY-SA 4.0');
    });

    test('should handle files without numbering', () => {
      const file = {
        ...MOCK_TOSW_FILES[0],
        name: 'introduction.md',
      };
      const parsed = githubSyncService.parseFrontmatter(MOCK_TOSW_MARKDOWN);

      const mapped = githubSyncService.mapToswChapterToStrapi(file, parsed, 'getting-started');

      expect(mapped.chapter_order).toBe(0); // Default when no number found
    });
  });

  describe('fetchRepoContents', () => {
    test('should fetch repository contents from GitHub API', async () => {
      // Mock global fetch
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => MOCK_GITHUB_FILES,
      });
      (global as any).fetch = mockFetch;

      const result = await githubSyncService.fetchRepoContents('karstenwade', 'papers', 'papers');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/karstenwade/papers/contents/papers',
        expect.any(Object)
      );
      expect(result).toEqual(MOCK_GITHUB_FILES);
    });

    test('should include auth header if token is provided', async () => {
      const originalToken = process.env.GITHUB_ACCESS_TOKEN;
      process.env.GITHUB_ACCESS_TOKEN = 'test_token';

      const service = new GitHubSyncService();
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      });
      (global as any).fetch = mockFetch;

      await service.fetchRepoContents('owner', 'repo');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test_token',
          }),
        })
      );

      // Restore
      if (originalToken) {
        process.env.GITHUB_ACCESS_TOKEN = originalToken;
      } else {
        delete process.env.GITHUB_ACCESS_TOKEN;
      }
    });

    test('should throw error on failed fetch', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });
      (global as any).fetch = mockFetch;

      await expect(
        githubSyncService.fetchRepoContents('owner', 'nonexistent')
      ).rejects.toThrow();
    });

    test('should handle network errors', async () => {
      const mockFetch = jest.fn().mockRejectedValue(new Error('Network error'));
      (global as any).fetch = mockFetch;

      await expect(
        githubSyncService.fetchRepoContents('owner', 'repo')
      ).rejects.toThrow('Network error');
    });
  });

  describe('fetchFileContent', () => {
    test('should fetch file content from download URL', async () => {
      const mockContent = MOCK_PAPER_MARKDOWN;
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        text: async () => mockContent,
      });
      (global as any).fetch = mockFetch;

      const result = await githubSyncService.fetchFileContent(
        'karstenwade',
        'papers',
        'papers/paper1.md'
      );

      expect(result).toBe(mockContent);
      expect(mockFetch).toHaveBeenCalled();
    });

    test('should throw error on failed content fetch', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });
      (global as any).fetch = mockFetch;

      await expect(
        githubSyncService.fetchFileContent('owner', 'repo', 'nonexistent.md')
      ).rejects.toThrow();
    });
  });

  describe('syncPapers', () => {
    test('should sync papers and return correct result counts', async () => {
      // Arrange
      const mockFetch = jest.fn()
        .mockResolvedValueOnce({ // First call: fetch repo contents
          ok: true,
          json: async () => [MOCK_GITHUB_FILES[0]], // One file
        })
        .mockResolvedValueOnce({ // Second call: fetch file content
          ok: true,
          text: async () => MOCK_PAPER_MARKDOWN,
        });
      (global as any).fetch = mockFetch;

      mockDocuments.findMany.mockResolvedValue([]); // No existing entries
      mockDocuments.create.mockResolvedValue({ documentId: '1' });

      // Act
      const result = await githubSyncService.syncPapers();

      // Assert
      expect(result.created).toBe(1);
      expect(result.updated).toBe(0);
      expect(result.unchanged).toBe(0);
      expect(result.errors).toHaveLength(0);
      expect(mockStrapi.entityService.create).toHaveBeenCalledTimes(1);
    });

    test('should update existing papers when SHA differs', async () => {
      // Arrange
      const mockFetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [MOCK_GITHUB_FILES[0]],
        })
        .mockResolvedValueOnce({
          ok: true,
          text: async () => MOCK_PAPER_MARKDOWN,
        });
      (global as any).fetch = mockFetch;

      mockStrapi.entityService.findMany.mockResolvedValue([
        {
          id: 1,
          github_path: 'papers/paper1.md',
          github_sha: 'old_sha', // Different SHA
          sync_locked: false,
        },
      ]);
      mockStrapi.entityService.update.mockResolvedValue({ id: 1 });

      // Act
      const result = await githubSyncService.syncPapers();

      // Assert
      expect(result.created).toBe(0);
      expect(result.updated).toBe(1);
      expect(result.unchanged).toBe(0);
      expect(mockStrapi.entityService.update).toHaveBeenCalledTimes(1);
    });

    test('should skip unchanged papers with same SHA', async () => {
      // Arrange
      const mockFetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => [MOCK_GITHUB_FILES[0]],
      });
      (global as any).fetch = mockFetch;

      mockStrapi.entityService.findMany.mockResolvedValue([
        {
          id: 1,
          github_path: 'papers/paper1.md',
          github_sha: 'abc123', // Same SHA
          sync_locked: false,
        },
      ]);

      // Act
      const result = await githubSyncService.syncPapers();

      // Assert
      expect(result.created).toBe(0);
      expect(result.updated).toBe(0);
      expect(result.unchanged).toBe(1);
      expect(mockStrapi.entityService.create).not.toHaveBeenCalled();
      expect(mockStrapi.entityService.update).not.toHaveBeenCalled();
    });

    test('should skip locked entries', async () => {
      // Arrange
      const mockFetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [MOCK_GITHUB_FILES[0]],
        });
      (global as any).fetch = mockFetch;

      mockStrapi.entityService.findMany.mockResolvedValue([
        {
          id: 1,
          github_path: 'papers/paper1.md',
          github_sha: 'old_sha',
          sync_locked: true, // Locked
        },
      ]);

      // Act
      const result = await githubSyncService.syncPapers();

      // Assert
      expect(result.unchanged).toBe(1);
      expect(mockStrapi.entityService.update).not.toHaveBeenCalled();
    });

    test('should collect errors and continue processing', async () => {
      // Arrange
      const mockFetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [MOCK_GITHUB_FILES[0], MOCK_GITHUB_FILES[1]],
        })
        .mockResolvedValueOnce({ // First file succeeds
          ok: true,
          text: async () => MOCK_PAPER_MARKDOWN,
        })
        .mockRejectedValueOnce(new Error('Network error')); // Second file fails
      (global as any).fetch = mockFetch;

      mockStrapi.entityService.findMany.mockResolvedValue([]);
      mockStrapi.entityService.create.mockResolvedValue({ id: 1 });

      // Act
      const result = await githubSyncService.syncPapers();

      // Assert
      expect(result.created).toBe(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Network error');
    });

    test('should respect forceRefresh flag', async () => {
      // Arrange
      const mockFetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [MOCK_GITHUB_FILES[0]],
        })
        .mockResolvedValueOnce({
          ok: true,
          text: async () => MOCK_PAPER_MARKDOWN,
        });
      (global as any).fetch = mockFetch;

      mockStrapi.entityService.findMany.mockResolvedValue([
        {
          id: 1,
          github_path: 'papers/paper1.md',
          github_sha: 'abc123', // Same SHA
          sync_locked: false,
        },
      ]);
      mockStrapi.entityService.update.mockResolvedValue({ id: 1 });

      // Act
      const result = await githubSyncService.syncPapers(true); // Force refresh

      // Assert
      expect(result.updated).toBe(1);
      expect(result.unchanged).toBe(0);
      expect(mockStrapi.entityService.update).toHaveBeenCalledTimes(1);
    });

    test('should filter non-markdown files', async () => {
      // Arrange
      const filesWithNonMarkdown = [
        ...MOCK_GITHUB_FILES,
        {
          name: 'image.png',
          path: 'papers/image.png',
          sha: 'img123',
          type: 'file' as const,
        },
      ];

      const mockFetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => filesWithNonMarkdown,
      });
      (global as any).fetch = mockFetch;

      mockStrapi.entityService.findMany.mockResolvedValue([]);

      // Act
      const result = await githubSyncService.syncPapers();

      // Assert - Only markdown files should be processed
      expect(mockFetch).toHaveBeenCalledTimes(1); // Only repo contents fetch
    });
  });

  describe('syncToswChapters', () => {
    test('should sync TOSW chapters and return correct counts', async () => {
      // Arrange
      const mockFetch = jest.fn()
        .mockResolvedValueOnce({ // Fetch directories
          ok: true,
          json: async () => [{
            name: 'getting-started',
            path: 'getting-started',
            type: 'dir',
          }],
        })
        .mockResolvedValueOnce({ // Fetch files in directory
          ok: true,
          json: async () => [MOCK_TOSW_FILES[0]],
        })
        .mockResolvedValueOnce({ // Fetch file content
          ok: true,
          text: async () => MOCK_TOSW_MARKDOWN,
        });
      (global as any).fetch = mockFetch;

      mockStrapi.entityService.findMany.mockResolvedValue([]);
      mockStrapi.entityService.create.mockResolvedValue({ id: 1 });

      // Act
      const result = await githubSyncService.syncToswChapters();

      // Assert
      expect(result.created).toBe(1);
      expect(result.updated).toBe(0);
      expect(result.errors).toHaveLength(0);
    });

    test('should skip directories that are not sections', async () => {
      // Arrange
      const mockFetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => [{
          name: '.git',
          path: '.git',
          type: 'dir',
        }],
      });
      (global as any).fetch = mockFetch;

      // Act
      const result = await githubSyncService.syncToswChapters();

      // Assert
      expect(result.created).toBe(0);
      expect(mockFetch).toHaveBeenCalledTimes(1); // Only root fetch
    });
  });

  describe('syncSinglePaper', () => {
    test('should sync a single paper by file path and SHA', async () => {
      // Arrange
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        text: async () => MOCK_PAPER_MARKDOWN,
      });
      (global as any).fetch = mockFetch;

      mockStrapi.entityService.findMany.mockResolvedValue([]);
      mockStrapi.entityService.create.mockResolvedValue({ id: 1 });

      // Act
      const result = await githubSyncService.syncSinglePaper('papers/paper1.md', 'abc123');

      // Assert
      expect(result).toBe(true);
      expect(mockStrapi.entityService.create).toHaveBeenCalledTimes(1);
    });

    test('should update existing single paper', async () => {
      // Arrange
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        text: async () => MOCK_PAPER_MARKDOWN,
      });
      (global as any).fetch = mockFetch;

      mockStrapi.entityService.findMany.mockResolvedValue([
        { id: 1, github_path: 'papers/paper1.md', github_sha: 'old', sync_locked: false },
      ]);
      mockStrapi.entityService.update.mockResolvedValue({ id: 1 });

      // Act
      const result = await githubSyncService.syncSinglePaper('papers/paper1.md', 'new123');

      // Assert
      expect(result).toBe(true);
      expect(mockStrapi.entityService.update).toHaveBeenCalledTimes(1);
    });

    test('should return false on error', async () => {
      // Arrange
      const mockFetch = jest.fn().mockRejectedValue(new Error('Network error'));
      (global as any).fetch = mockFetch;

      // Act
      const result = await githubSyncService.syncSinglePaper('papers/bad.md', 'sha');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('syncSingleToswChapter', () => {
    test('should sync a single TOSW chapter', async () => {
      // Arrange
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        text: async () => MOCK_TOSW_MARKDOWN,
      });
      (global as any).fetch = mockFetch;

      mockStrapi.entityService.findMany.mockResolvedValue([]);
      mockStrapi.entityService.create.mockResolvedValue({ id: 1 });

      // Act
      const result = await githubSyncService.syncSingleToswChapter(
        'getting-started/01-introduction.md',
        'sha123'
      );

      // Assert
      expect(result).toBe(true);
      expect(mockStrapi.entityService.create).toHaveBeenCalledTimes(1);
    });

    test('should extract section from file path', async () => {
      // Arrange
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        text: async () => MOCK_TOSW_MARKDOWN,
      });
      (global as any).fetch = mockFetch;

      mockStrapi.entityService.findMany.mockResolvedValue([]);
      mockStrapi.entityService.create.mockResolvedValue({ id: 1 });

      // Act
      await githubSyncService.syncSingleToswChapter(
        'getting-started/01-introduction.md',
        'sha'
      );

      // Assert
      const createCall = mockStrapi.entityService.create.mock.calls[0];
      expect(createCall[2].data.section).toBe('getting-started');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty repository', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      });
      (global as any).fetch = mockFetch;

      const result = await githubSyncService.syncPapers();

      expect(result.created).toBe(0);
      expect(result.updated).toBe(0);
      expect(result.unchanged).toBe(0);
      expect(result.errors).toHaveLength(0);
    });

    test('should handle files with no extension', async () => {
      const fileNoExt = {
        name: 'README',
        path: 'README',
        sha: 'sha',
        type: 'file' as const,
      };

      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => [fileNoExt],
      });
      (global as any).fetch = mockFetch;

      mockStrapi.entityService.findMany.mockResolvedValue([]);

      const result = await githubSyncService.syncPapers();

      // Should skip files without .md extension
      expect(result.created).toBe(0);
    });

    test('should handle very long titles gracefully', async () => {
      const longTitle = 'A'.repeat(500);
      const markdown = `# ${longTitle}\n\nContent`;
      const parsed = githubSyncService.parseFrontmatter(markdown);

      const mapped = githubSyncService.mapToswChapterToStrapi(
        MOCK_TOSW_FILES[0],
        parsed,
        'section'
      );

      // Title should be extracted (may be truncated by Strapi validation)
      expect(mapped.title).toBe(longTitle);
    });

    test('should handle special characters in filenames', async () => {
      const specialFile = {
        name: 'file-with-special_chars (1).md',
        path: 'papers/file-with-special_chars (1).md',
        sha: 'sha',
        type: 'file' as const,
        download_url: 'https://example.com/file',
      };

      const parsed = githubSyncService.parseFrontmatter(MOCK_PAPER_MARKDOWN);
      const mapped = githubSyncService.mapPaperToStrapi(specialFile, parsed);

      expect(mapped.github_path).toBe('papers/file-with-special_chars (1).md');
    });
  });
});
