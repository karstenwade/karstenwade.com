/**
 * Poem Lifecycle Hooks
 *
 * Syncs poem content to ZeroDB strapi_writings table with writing_type='poem'
 */

import zeroDBService from '../../../../services/zerodb';

interface PoemData {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  first_line?: string;
  full_text?: string;
  date_written?: string;
  form?: string;
  theme?: string;
  tags?: string[] | null;
  featured?: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  author?: { id: number; name: string; documentId?: string } | null;
}

interface LifecycleEvent {
  result?: PoemData;
  params?: {
    where?: { id?: number };
    data?: Partial<PoemData>;
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
        writing_type: 'poem',
        excerpt: result.excerpt,
        content: result.full_text,
        date_written: result.date_written,
        word_count: result.full_text?.split(/\s+/).length || 0,
        form: result.form,
        genre: null,
        theme: result.theme,
        first_line: result.first_line,
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
        writing_type: 'poem',
        genre: null,
        theme: result.theme,
        first_line: result.first_line,
        tags: result.tags?.map((t: string) => ({ id: 0, name: t })) || null,
        author: result.author,
      });

      await zeroDBService.trackContentSync('poem', result.id, 'created');
    } catch (error) {
      console.error('[ZeroDB] Failed to sync poem after create:', error);
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
        writing_type: 'poem',
        excerpt: result.excerpt,
        content: result.full_text,
        date_written: result.date_written,
        word_count: result.full_text?.split(/\s+/).length || 0,
        form: result.form,
        genre: null,
        theme: result.theme,
        first_line: result.first_line,
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
        writing_type: 'poem',
        genre: null,
        theme: result.theme,
        first_line: result.first_line,
        tags: result.tags?.map((t: string) => ({ id: 0, name: t })) || null,
        author: result.author,
      });

      await zeroDBService.trackContentSync('poem', result.id, 'updated');
    } catch (error) {
      console.error('[ZeroDB] Failed to sync poem after update:', error);
    }
  },

  async afterDelete(event: LifecycleEvent) {
    const { result } = event;
    if (!result?.id) return;

    try {
      await zeroDBService.deleteWriting(result.id);
      await zeroDBService.trackContentSync('poem', result.id, 'deleted');
    } catch (error) {
      console.error('[ZeroDB] Failed to delete poem:', error);
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
      console.error('[ZeroDB] Failed to delete poems:', error);
    }
  },
};
