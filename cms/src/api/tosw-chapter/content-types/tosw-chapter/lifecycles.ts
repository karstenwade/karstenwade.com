/**
 * TOSW Chapter Lifecycle Hooks
 *
 * These hooks sync TOSW chapter content to ZeroDB when:
 * - A chapter is created
 * - A chapter is updated
 * - A chapter is published
 * - A chapter is deleted
 */

import zeroDBService from '../../../../services/zerodb';

interface ToswChapterData {
  id: number;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  section?: string;
  section_order?: number;
  chapter_order?: number;
  github_path?: string;
  github_sha?: string;
  source?: string;
  sync_locked?: boolean;
  license?: string;
  external_url?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  category?: { id: number; name: string } | null;
  tags?: Array<{ id: number; name: string }> | null;
}

interface LifecycleEvent {
  result?: ToswChapterData;
  params?: {
    where?: { id?: number };
    data?: Partial<ToswChapterData>;
  };
}

export default {
  /**
   * After creating a TOSW chapter, sync to ZeroDB
   */
  async afterCreate(event: LifecycleEvent) {
    const { result } = event;
    if (!result) return;

    try {
      // Sync to Tables API
      await zeroDBService.syncToswChapter({
        id: result.id,
        title: result.title,
        slug: result.slug,
        description: result.description,
        content: result.content,
        section: result.section,
        section_order: result.section_order,
        chapter_order: result.chapter_order,
        github_path: result.github_path,
        github_sha: result.github_sha,
        source: result.source,
        sync_locked: result.sync_locked,
        license: result.license,
        external_url: result.external_url,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        category: result.category,
        tags: result.tags,
      });

      // Sync embeddings for semantic search (if enabled)
      await zeroDBService.syncToswChapterEmbeddings({
        id: result.id,
        title: result.title,
        slug: result.slug,
        description: result.description,
        content: result.content,
        section: result.section,
        tags: result.tags,
        category: result.category,
      });

      // Track content sync event (if enabled)
      await zeroDBService.trackContentSync('tosw-chapter', result.id, 'created');
    } catch (error) {
      console.error('[ZeroDB] Failed to sync TOSW chapter after create:', error);
      // Don't throw - we don't want to fail the Strapi operation
    }
  },

  /**
   * After updating a TOSW chapter, sync to ZeroDB
   */
  async afterUpdate(event: LifecycleEvent) {
    const { result } = event;
    if (!result) return;

    try {
      // Sync to Tables API
      await zeroDBService.syncToswChapter({
        id: result.id,
        title: result.title,
        slug: result.slug,
        description: result.description,
        content: result.content,
        section: result.section,
        section_order: result.section_order,
        chapter_order: result.chapter_order,
        github_path: result.github_path,
        github_sha: result.github_sha,
        source: result.source,
        sync_locked: result.sync_locked,
        license: result.license,
        external_url: result.external_url,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        category: result.category,
        tags: result.tags,
      });

      // Sync embeddings for semantic search (if enabled)
      await zeroDBService.syncToswChapterEmbeddings({
        id: result.id,
        title: result.title,
        slug: result.slug,
        description: result.description,
        content: result.content,
        section: result.section,
        tags: result.tags,
        category: result.category,
      });

      // Track content sync event (if enabled)
      await zeroDBService.trackContentSync('tosw-chapter', result.id, 'updated');
    } catch (error) {
      console.error('[ZeroDB] Failed to sync TOSW chapter after update:', error);
    }
  },

  /**
   * After deleting a TOSW chapter, remove from ZeroDB
   */
  async afterDelete(event: LifecycleEvent) {
    const { result } = event;
    if (!result?.id) return;

    try {
      await zeroDBService.deleteToswChapter(result.id);
      // Track content sync event (if enabled)
      await zeroDBService.trackContentSync('tosw-chapter', result.id, 'deleted');
    } catch (error) {
      console.error('[ZeroDB] Failed to delete TOSW chapter:', error);
    }
  },

  /**
   * After deleting many TOSW chapters, remove from ZeroDB
   * Note: Strapi v5 uses afterDeleteMany for bulk operations
   */
  async afterDeleteMany(event: { params?: { where?: { id?: { $in: number[] } } } }) {
    const ids = event.params?.where?.id?.$in;
    if (!ids?.length) return;

    try {
      for (const id of ids) {
        await zeroDBService.deleteToswChapter(id);
      }
    } catch (error) {
      console.error('[ZeroDB] Failed to delete TOSW chapters:', error);
    }
  },
};
