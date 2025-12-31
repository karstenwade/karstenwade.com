/**
 * Essay Lifecycle Hooks
 *
 * Syncs essay content to ZeroDB strapi_writings table with writing_type='essay'
 */

import zeroDBService from '../../../../services/zerodb';

interface EssayData {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  full_text?: string;
  date_written?: string;
  theme?: string;
  word_count?: number;
  tags?: string[] | null;
  featured?: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  author?: { id: number; name: string; documentId?: string } | null;
}

interface LifecycleEvent {
  result?: EssayData;
  params?: {
    where?: { id?: number };
    data?: Partial<EssayData>;
  };
}

export default {
  async afterCreate(event: LifecycleEvent) {
    const { result } = event;
    if (!result) return;

    try {
      await zeroDBService.syncWriting({
        id: result.id,
        title: result.title,
        slug: result.slug,
        writing_type: 'essay',
        excerpt: result.excerpt,
        content: result.full_text,
        date_written: result.date_written,
        word_count: result.word_count || result.full_text?.split(/\s+/).length || 0,
        form: null,
        genre: null,
        theme: result.theme,
        first_line: null,
        source: 'migrated',
        featured: result.featured,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        author: result.author,
        tags: result.tags?.map((t: string) => ({ id: 0, name: t })) || null,
      });

      await zeroDBService.syncWritingEmbeddings({
        id: result.id,
        title: result.title,
        slug: result.slug,
        excerpt: result.excerpt,
        content: result.full_text,
        writing_type: 'essay',
        genre: null,
        theme: result.theme,
        first_line: null,
        tags: result.tags?.map((t: string) => ({ id: 0, name: t })) || null,
        author: result.author,
      });

      await zeroDBService.trackContentSync('essay', result.id, 'created');
    } catch (error) {
      console.error('[ZeroDB] Failed to sync essay after create:', error);
    }
  },

  async afterUpdate(event: LifecycleEvent) {
    const { result } = event;
    if (!result) return;

    try {
      await zeroDBService.syncWriting({
        id: result.id,
        title: result.title,
        slug: result.slug,
        writing_type: 'essay',
        excerpt: result.excerpt,
        content: result.full_text,
        date_written: result.date_written,
        word_count: result.word_count || result.full_text?.split(/\s+/).length || 0,
        form: null,
        genre: null,
        theme: result.theme,
        first_line: null,
        source: 'migrated',
        featured: result.featured,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        author: result.author,
        tags: result.tags?.map((t: string) => ({ id: 0, name: t })) || null,
      });

      await zeroDBService.syncWritingEmbeddings({
        id: result.id,
        title: result.title,
        slug: result.slug,
        excerpt: result.excerpt,
        content: result.full_text,
        writing_type: 'essay',
        genre: null,
        theme: result.theme,
        first_line: null,
        tags: result.tags?.map((t: string) => ({ id: 0, name: t })) || null,
        author: result.author,
      });

      await zeroDBService.trackContentSync('essay', result.id, 'updated');
    } catch (error) {
      console.error('[ZeroDB] Failed to sync essay after update:', error);
    }
  },

  async afterDelete(event: LifecycleEvent) {
    const { result } = event;
    if (!result?.id) return;

    try {
      await zeroDBService.deleteWriting(result.id);
      await zeroDBService.trackContentSync('essay', result.id, 'deleted');
    } catch (error) {
      console.error('[ZeroDB] Failed to delete essay:', error);
    }
  },

  async afterDeleteMany(event: { params?: { where?: { id?: { $in: number[] } } } }) {
    const ids = event.params?.where?.id?.$in;
    if (!ids?.length) return;

    try {
      for (const id of ids) {
        await zeroDBService.deleteWriting(id);
      }
    } catch (error) {
      console.error('[ZeroDB] Failed to delete essays:', error);
    }
  },
};
