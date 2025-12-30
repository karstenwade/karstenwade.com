/**
 * Writing Lifecycle Hooks
 *
 * These hooks sync writing content to ZeroDB when:
 * - A writing is created
 * - A writing is updated
 * - A writing is published
 * - A writing is deleted
 */

import zeroDBService from '../../../../services/zerodb';

interface WritingData {
  id: number;
  title: string;
  slug: string;
  writing_type?: 'poetry' | 'fiction' | 'non-fiction' | 'essay' | 'other';
  excerpt?: string;
  content?: string;
  date_written?: string;
  word_count?: number;
  form?: string;
  genre?: string;
  theme?: string;
  first_line?: string;
  source?: string;
  featured?: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  author?: { id: number; name: string } | null;
  tags?: Array<{ id: number; name: string }> | null;
}

interface LifecycleEvent {
  result?: WritingData;
  params?: {
    where?: { id?: number };
    data?: Partial<WritingData>;
  };
}

export default {
  /**
   * After creating a writing, sync to ZeroDB
   */
  async afterCreate(event: LifecycleEvent) {
    const { result } = event;
    if (!result) return;

    try {
      // Sync to Tables API
      await zeroDBService.syncWriting({
        id: result.id,
        title: result.title,
        slug: result.slug,
        writing_type: result.writing_type,
        excerpt: result.excerpt,
        content: result.content,
        date_written: result.date_written,
        word_count: result.word_count,
        form: result.form,
        genre: result.genre,
        theme: result.theme,
        first_line: result.first_line,
        source: result.source,
        featured: result.featured,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        author: result.author,
        tags: result.tags,
      });

      // Sync embeddings for semantic search (if enabled)
      await zeroDBService.syncWritingEmbeddings({
        id: result.id,
        title: result.title,
        slug: result.slug,
        excerpt: result.excerpt,
        content: result.content,
        writing_type: result.writing_type,
        genre: result.genre,
        theme: result.theme,
        first_line: result.first_line,
        tags: result.tags,
        author: result.author,
      });

      // Track content sync event (if enabled)
      await zeroDBService.trackContentSync('writing', result.id, 'created');
    } catch (error) {
      console.error('[ZeroDB] Failed to sync writing after create:', error);
      // Don't throw - we don't want to fail the Strapi operation
    }
  },

  /**
   * After updating a writing, sync to ZeroDB
   */
  async afterUpdate(event: LifecycleEvent) {
    const { result } = event;
    if (!result) return;

    try {
      // Sync to Tables API
      await zeroDBService.syncWriting({
        id: result.id,
        title: result.title,
        slug: result.slug,
        writing_type: result.writing_type,
        excerpt: result.excerpt,
        content: result.content,
        date_written: result.date_written,
        word_count: result.word_count,
        form: result.form,
        genre: result.genre,
        theme: result.theme,
        first_line: result.first_line,
        source: result.source,
        featured: result.featured,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        author: result.author,
        tags: result.tags,
      });

      // Sync embeddings for semantic search (if enabled)
      await zeroDBService.syncWritingEmbeddings({
        id: result.id,
        title: result.title,
        slug: result.slug,
        excerpt: result.excerpt,
        content: result.content,
        writing_type: result.writing_type,
        genre: result.genre,
        theme: result.theme,
        first_line: result.first_line,
        tags: result.tags,
        author: result.author,
      });

      // Track content sync event (if enabled)
      await zeroDBService.trackContentSync('writing', result.id, 'updated');
    } catch (error) {
      console.error('[ZeroDB] Failed to sync writing after update:', error);
    }
  },

  /**
   * After deleting a writing, remove from ZeroDB
   */
  async afterDelete(event: LifecycleEvent) {
    const { result } = event;
    if (!result?.id) return;

    try {
      await zeroDBService.deleteWriting(result.id);
      // Track content sync event (if enabled)
      await zeroDBService.trackContentSync('writing', result.id, 'deleted');
    } catch (error) {
      console.error('[ZeroDB] Failed to delete writing:', error);
    }
  },

  /**
   * After deleting many writings, remove from ZeroDB
   * Note: Strapi v5 uses afterDeleteMany for bulk operations
   */
  async afterDeleteMany(event: { params?: { where?: { id?: { $in: number[] } } } }) {
    const ids = event.params?.where?.id?.$in;
    if (!ids?.length) return;

    try {
      for (const id of ids) {
        await zeroDBService.deleteWriting(id);
      }
    } catch (error) {
      console.error('[ZeroDB] Failed to delete writings:', error);
    }
  },
};
