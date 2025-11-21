// Content service abstraction layer
// Provides unified interface for accessing content from various sources
// This abstraction allows easy migration from static data to CMS (e.g., Strapi)

import type { Essay } from '../data/essays'
import type { Poem } from '../data/poetry'
import type { Story } from '../data/fiction'
import type { Paper } from '../data/papers'

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
   * @param forceRefresh - Force refresh cache (default: false)
   * @returns Array of Paper objects
   */
  async getPapers(forceRefresh = false): Promise<Paper[]> {
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
      // TODO: Implement StrapiContentService when migrating to Strapi
      throw new Error('Strapi content service not yet implemented')
    default:
      return new StaticContentService()
  }
}
