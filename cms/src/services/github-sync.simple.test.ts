/**
 * GitHub Sync Service - Simplified Tests
 *
 * Core functionality tests without complex mocking
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { GitHubSyncService } from './github-sync';

describe('GitHubSyncService - Core Functionality', () => {
  let service: GitHubSyncService;

  beforeEach(() => {
    service = new GitHubSyncService();
  });

  describe('parseFrontmatter', () => {
    it('should parse valid YAML frontmatter', () => {
      const markdown = `---
title: Test Paper
abstract: This is a test
version: 1.0
---

# Content
Body text here.`;

      const result = service.parseFrontmatter(markdown);

      expect(result.frontmatter).toEqual({
        title: 'Test Paper',
        abstract: 'This is a test',
        version: 1.0, // YAML parses numeric values
      });
      expect(result.content).toContain('# Content');
      expect(result.content).toContain('Body text here.');
    });

    it('should handle markdown without frontmatter', () => {
      const markdown = '# Just a heading\n\nSome content.';
      const result = service.parseFrontmatter(markdown);

      expect(result.frontmatter).toEqual({});
      expect(result.content).toBe(markdown);
    });

    it('should throw on malformed frontmatter', () => {
      const badMarkdown = '---\ntitle: "Unclosed\n---';
      expect(() => service.parseFrontmatter(badMarkdown)).toThrow();
    });
  });

  describe('needsUpdate', () => {
    it('should return true when entry has no github_sha', () => {
      const entry = { title: 'Test' };
      expect(service.needsUpdate(entry, 'new-sha')).toBe(true);
    });

    it('should return true when github_sha differs', () => {
      const entry = { github_sha: 'old-sha' };
      expect(service.needsUpdate(entry, 'new-sha')).toBe(true);
    });

    it('should return false when github_sha matches', () => {
      const entry = { github_sha: 'same-sha' };
      expect(service.needsUpdate(entry, 'same-sha')).toBe(false);
    });

    it('should return false when entry is sync_locked', () => {
      const entry = { github_sha: 'old-sha', sync_locked: true };
      expect(service.needsUpdate(entry, 'new-sha')).toBe(false);
    });

    it('should return true when entry is null', () => {
      expect(service.needsUpdate(null, 'new-sha')).toBe(true);
    });
  });

  describe('mapPaperToStrapi', () => {
    it('should map GitHub file to Strapi format', () => {
      const file = {
        name: 'test.md',
        path: 'papers/test.md',
        sha: 'abc123',
        type: 'file' as const,
        download_url: 'https://example.com/test.md',
      };

      const parsed = {
        frontmatter: {
          title: 'Test Paper',
          abstract: 'This is a test abstract',
          version: '2.0',
          publicationDate: '2024-01-15',
          featured: true,
        },
        content: '# Test Content',
      };

      const result = service.mapPaperToStrapi(file, parsed);

      expect(result).toMatchObject({
        title: 'Test Paper',
        abstract: 'This is a test abstract',
        version: '2.0',
        publication_date: '2024-01-15',
        featured: true,
        github_path: 'papers/test.md',
        github_sha: 'abc123',
        external_url: 'https://example.com/test.md',
        source: 'github-papers',
        content: '# Test Content',
      });
    });

    it('should use defaults for missing fields', () => {
      const file = {
        name: 'minimal.md',
        path: 'papers/minimal.md',
        sha: 'def456',
        type: 'file' as const,
      };

      const parsed = {
        frontmatter: {
          title: 'Minimal Paper',
          abstract: 'Short abstract',
        },
        content: 'Content',
      };

      const result = service.mapPaperToStrapi(file, parsed);

      expect(result.version).toBe('1.0');
      expect(result.featured).toBe(false);
      expect(result.source).toBe('github-papers');
    });

    it('should extract description from abstract', () => {
      const longAbstract = 'A'.repeat(500);
      const file = {
        name: 'test.md',
        path: 'test.md',
        sha: 'sha',
        type: 'file' as const,
      };

      const parsed = {
        frontmatter: { title: 'Test', abstract: longAbstract },
        content: '',
      };

      const result = service.mapPaperToStrapi(file, parsed);

      expect(result.description).toBeDefined();
      expect(result.description.length).toBeLessThanOrEqual(300);
    });
  });

  describe('mapToswChapterToStrapi', () => {
    it('should extract title from first H1', () => {
      const file = {
        name: '01-intro.md',
        path: 'getting-started/01-intro.md',
        sha: 'sha123',
        type: 'file' as const,
      };

      const parsed = {
        frontmatter: {},
        content: '# Getting Started\n\nThis is the intro.\n\nMore text.',
      };

      const result = service.mapToswChapterToStrapi(file, parsed, 'getting-started');

      expect(result.title).toBe('Getting Started');
    });

    it('should extract description from first paragraph', () => {
      const file = {
        name: 'chapter.md',
        path: 'section/chapter.md',
        sha: 'sha',
        type: 'file' as const,
      };

      const parsed = {
        frontmatter: {},
        content: '# Title\n\nThis is the description paragraph.\n\n## Section\nMore content.',
      };

      const result = service.mapToswChapterToStrapi(file, parsed, 'section');

      expect(result.description).toBe('This is the description paragraph.');
    });

    it('should extract chapter order from filename', () => {
      const file = {
        name: '05-chapter.md',
        path: 'section/05-chapter.md',
        sha: 'sha',
        type: 'file' as const,
      };

      const parsed = {
        frontmatter: {},
        content: '# Chapter',
      };

      const result = service.mapToswChapterToStrapi(file, parsed, 'section');

      expect(result.chapter_order).toBe(5);
    });

    it('should default chapter order to 0 when no number', () => {
      const file = {
        name: 'intro.md',
        path: 'section/intro.md',
        sha: 'sha',
        type: 'file' as const,
      };

      const parsed = {
        frontmatter: {},
        content: '# Intro',
      };

      const result = service.mapToswChapterToStrapi(file, parsed, 'section');

      expect(result.chapter_order).toBe(0);
    });

    it('should set correct metadata', () => {
      const file = {
        name: 'test.md',
        path: 'section/test.md',
        sha: 'sha',
        type: 'file' as const,
        download_url: 'https://example.com/test.md',
      };

      const parsed = {
        frontmatter: {},
        content: '# Test',
      };

      const result = service.mapToswChapterToStrapi(file, parsed, 'my-section');

      expect(result.section).toBe('my-section');
      expect(result.source).toBe('github-tosw');
      expect(result.license).toBe('CC BY-SA 4.0');
      expect(result.github_path).toBe('section/test.md');
      expect(result.github_sha).toBe('sha');
      expect(result.external_url).toBe('https://example.com/test.md');
    });

    it('should use filename as fallback title', () => {
      const file = {
        name: 'my-chapter.md',
        path: 'section/my-chapter.md',
        sha: 'sha',
        type: 'file' as const,
      };

      const parsed = {
        frontmatter: {},
        content: 'No H1 heading here\n\nJust paragraphs.',
      };

      const result = service.mapToswChapterToStrapi(file, parsed, 'section');

      expect(result.title).toBe('my-chapter');
    });
  });

  describe('Repository configuration', () => {
    it('should have correct default repository names', () => {
      expect(service.papersRepo).toBe('karstenwade/papers');
      expect(service.toswRepo).toBe('theopensourceway/guidebook');
    });

    it('should read GitHub token from environment', () => {
      const originalToken = process.env.GITHUB_ACCESS_TOKEN;

      process.env.GITHUB_ACCESS_TOKEN = 'test-token-123';
      const testService = new GitHubSyncService();
      expect(testService.githubToken).toBe('test-token-123');

      // Restore
      if (originalToken) {
        process.env.GITHUB_ACCESS_TOKEN = originalToken;
      } else {
        delete process.env.GITHUB_ACCESS_TOKEN;
      }
    });
  });
});
