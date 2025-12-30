/**
 * Paper Lifecycle Hooks
 *
 * These hooks sync paper content to ZeroDB when:
 * - A paper is created
 * - A paper is updated
 * - A paper is published
 * - A paper is deleted
 */

import zeroDBService from '../../../../services/zerodb';

interface PaperData {
  id: number;
  title: string;
  slug: string;
  abstract?: string;
  content?: string;
  version?: string;
  publication_date?: string;
  pdf_url?: string;
  external_url?: string;
  github_path?: string;
  github_sha?: string;
  source?: string;
  sync_locked?: boolean;
  featured?: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  author?: { id: number; name: string } | null;
  category?: { id: number; name: string } | null;
  tags?: Array<{ id: number; name: string }> | null;
}

interface LifecycleEvent {
  result?: PaperData;
  params?: {
    where?: { id?: number };
    data?: Partial<PaperData>;
  };
}

export default {
  /**
   * After creating a paper, sync to ZeroDB
   */
  async afterCreate(event: LifecycleEvent) {
    const { result } = event;
    if (!result) return;

    try {
      // Sync to Tables API
      await zeroDBService.syncPaper({
        id: result.id,
        title: result.title,
        slug: result.slug,
        abstract: result.abstract,
        content: result.content,
        version: result.version,
        publication_date: result.publication_date,
        pdf_url: result.pdf_url,
        external_url: result.external_url,
        github_path: result.github_path,
        github_sha: result.github_sha,
        source: result.source,
        sync_locked: result.sync_locked,
        featured: result.featured,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        author: result.author,
        category: result.category,
        tags: result.tags,
      });

      // Sync embeddings for semantic search (if enabled)
      await zeroDBService.syncPaperEmbeddings({
        id: result.id,
        title: result.title,
        slug: result.slug,
        abstract: result.abstract,
        content: result.content,
        version: result.version,
        tags: result.tags,
        author: result.author,
        category: result.category,
      });

      // Track content sync event (if enabled)
      await zeroDBService.trackContentSync('paper', result.id, 'created');
    } catch (error) {
      console.error('[ZeroDB] Failed to sync paper after create:', error);
      // Don't throw - we don't want to fail the Strapi operation
    }
  },

  /**
   * After updating a paper, sync to ZeroDB
   */
  async afterUpdate(event: LifecycleEvent) {
    const { result } = event;
    if (!result) return;

    try {
      // Sync to Tables API
      await zeroDBService.syncPaper({
        id: result.id,
        title: result.title,
        slug: result.slug,
        abstract: result.abstract,
        content: result.content,
        version: result.version,
        publication_date: result.publication_date,
        pdf_url: result.pdf_url,
        external_url: result.external_url,
        github_path: result.github_path,
        github_sha: result.github_sha,
        source: result.source,
        sync_locked: result.sync_locked,
        featured: result.featured,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        author: result.author,
        category: result.category,
        tags: result.tags,
      });

      // Sync embeddings for semantic search (if enabled)
      await zeroDBService.syncPaperEmbeddings({
        id: result.id,
        title: result.title,
        slug: result.slug,
        abstract: result.abstract,
        content: result.content,
        version: result.version,
        tags: result.tags,
        author: result.author,
        category: result.category,
      });

      // Track content sync event (if enabled)
      await zeroDBService.trackContentSync('paper', result.id, 'updated');
    } catch (error) {
      console.error('[ZeroDB] Failed to sync paper after update:', error);
    }
  },

  /**
   * After deleting a paper, remove from ZeroDB
   */
  async afterDelete(event: LifecycleEvent) {
    const { result } = event;
    if (!result?.id) return;

    try {
      await zeroDBService.deletePaper(result.id);
      // Track content sync event (if enabled)
      await zeroDBService.trackContentSync('paper', result.id, 'deleted');
    } catch (error) {
      console.error('[ZeroDB] Failed to delete paper:', error);
    }
  },

  /**
   * After deleting many papers, remove from ZeroDB
   * Note: Strapi v5 uses afterDeleteMany for bulk operations
   */
  async afterDeleteMany(event: { params?: { where?: { id?: { $in: number[] } } } }) {
    const ids = event.params?.where?.id?.$in;
    if (!ids?.length) return;

    try {
      for (const id of ids) {
        await zeroDBService.deletePaper(id);
      }
    } catch (error) {
      console.error('[ZeroDB] Failed to delete papers:', error);
    }
  },
};
