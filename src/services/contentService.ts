// Content service abstraction layer
// Provides unified interface for accessing content from various sources
// This abstraction allows easy migration from static data to CMS (e.g., Strapi)

import type { Essay } from '../data/essays'
import type { Poem } from '../data/poetry'
import type { Story } from '../data/fiction'
import type { Paper } from '../data/papers'
import { strapiClient, type Writing } from '../lib/strapi'

/**
 * Content service interface contracts
 * These define the API that components should use to access content
 */
export interface IContentService {
  getEssays(): Promise<Essay[]>
  getPoems(): Promise<Poem[]>
  getStories(): Promise<Story[]>
  getPapers(forceRefresh?: boolean): Promise<Paper[]>
}

/**
 * Static data content service
 * Implementation that fetches content from static data files
 * This will be replaced with a CMS-based implementation (e.g., StrapiContentService)
 */
export class StaticContentService implements IContentService {
  /**
   * Get all essays
   */
  async getEssays(): Promise<Essay[]> {
    const { essays } = await import('../data/essays')
    return essays
  }

  /**
   * Get all poems
   */
  async getPoems(): Promise<Poem[]> {
    const { poems } = await import('../data/poetry')
    return poems
  }

  /**
   * Get all stories
   */
  async getStories(): Promise<Story[]> {
    const { stories } = await import('../data/fiction')
    return stories
  }

  /**
   * Get all papers
   *
   * @returns Array of Paper objects
   */
  async getPapers(): Promise<Paper[]> {
    // For static content, just return the hardcoded papers
    // In the future, this could use paperService.getPapers() for dynamic loading
    const { papers } = await import('../data/papers')
    return papers
  }
}

/**
 * Content service singleton instance
 * Components should use this instance to access content
 *
 * Example usage:
 * ```typescript
 * import { contentService } from '../services/contentService'
 *
 * const essays = await contentService.getEssays()
 * ```
 */
export const contentService: IContentService = new StaticContentService()

/**
 * Strapi-based content service
 * Implementation that fetches content from ZeroDB (synced from Strapi)
 */
export class StrapiContentService implements IContentService {
  /**
   * Convert ZeroDB Writing to Essay format
   */
  private writingToEssay(writing: Writing): Essay {
    return {
      title: writing.title,
      excerpt: writing.excerpt || '',
      fullText: writing.content || '',
      dateWritten: writing.date_written || writing.created_at,
      theme: writing.theme || '',
      wordCount: writing.word_count || 0,
      tags: writing.tags || [],
      slug: writing.slug,
      featured: writing.featured || false,
    }
  }

  /**
   * Convert ZeroDB Writing to Poem format
   */
  private writingToPoem(writing: Writing): Poem {
    return {
      title: writing.title,
      excerpt: writing.excerpt || '',
      firstLine: writing.first_line || '',
      fullText: writing.content || '',
      dateWritten: writing.date_written || writing.created_at,
      form: writing.form || 'Free Verse',
      theme: writing.theme || '',
      tags: writing.tags || [],
      slug: writing.slug,
      featured: writing.featured || false,
    }
  }

  /**
   * Convert ZeroDB Writing to Story format
   */
  private writingToStory(writing: Writing): Story {
    return {
      title: writing.title,
      excerpt: writing.excerpt || '',
      fullText: writing.content || '',
      dateWritten: writing.date_written || writing.created_at,
      genre: writing.genre || 'Fiction',
      theme: writing.theme || '',
      wordCount: writing.word_count || 0,
      tags: writing.tags || [],
      slug: writing.slug,
      featured: writing.featured || false,
    }
  }

  /**
   * Get all essays from ZeroDB
   */
  async getEssays(): Promise<Essay[]> {
    try {
      const writings = await strapiClient.getEssays()
      return writings.map(w => this.writingToEssay(w))
    } catch (error) {
      console.error('[StrapiContentService] Failed to fetch essays:', error)
      // Fallback to static data
      const { essays } = await import('../data/essays')
      return essays
    }
  }

  /**
   * Get all poems from ZeroDB
   */
  async getPoems(): Promise<Poem[]> {
    try {
      const writings = await strapiClient.getPoems()
      return writings.map(w => this.writingToPoem(w))
    } catch (error) {
      console.error('[StrapiContentService] Failed to fetch poems:', error)
      // Fallback to static data
      const { poems } = await import('../data/poetry')
      return poems
    }
  }

  /**
   * Get all stories from ZeroDB
   */
  async getStories(): Promise<Story[]> {
    try {
      const writings = await strapiClient.getStories()
      return writings.map(w => this.writingToStory(w))
    } catch (error) {
      console.error('[StrapiContentService] Failed to fetch stories:', error)
      // Fallback to static data
      const { stories } = await import('../data/fiction')
      return stories
    }
  }

  /**
   * Get all papers from ZeroDB
   */
  async getPapers(): Promise<Paper[]> {
    try {
      const { papers } = await strapiClient.getPapers({ limit: 100 })
      return papers.map(p => ({
        id: p.slug,
        slug: p.slug,
        title: p.title,
        description: p.abstract, // Use abstract as description
        abstract: p.abstract,
        externalUrl: p.external_url || '',
        pdfUrl: p.pdf_url || undefined,
        repository: p.github_path
          ? `https://github.com/karstenwade/papers/blob/main/${p.github_path}`
          : '',
        publicationDate: p.publication_date || p.created_at,
        lastUpdated: p.updated_at,
        version: p.version,
        category: p.category || 'Uncategorized',
        tags: p.tags || [],
        featured: p.featured,
      }))
    } catch (error) {
      console.error('[StrapiContentService] Failed to fetch papers:', error)
      // Fallback to static data
      const { papers } = await import('../data/papers')
      return papers
    }
  }
}

/**
 * Factory function to create content service instances
 * Useful for testing or switching between different implementations
 *
 * @param type - The type of content service to create
 * @returns Content service instance
 */
export function createContentService(
  type: 'static' | 'strapi' = 'static'
): IContentService {
  switch (type) {
    case 'static':
      return new StaticContentService()
    case 'strapi':
      return new StrapiContentService()
    default:
      return new StaticContentService()
  }
}
