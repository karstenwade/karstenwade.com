/**
 * Story Lifecycle Hooks
 *
 * Syncs story content to ZeroDB strapi_writings table with writing_type='story'
 */

import zeroDBService from '../../../../services/zerodb';

interface StoryData {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  full_text?: string;
  date_written?: string;
  genre?: string;
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
  result?: StoryData;
  params?: {
    where?: { id?: number };
    data?: Partial<StoryData>;
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
        writing_type: 'story',
        excerpt: result.excerpt,
        content: result.full_text,
        date_written: result.date_written,
        word_count: result.word_count || result.full_text?.split(/\s+/).length || 0,
        form: null,
        genre: result.genre,
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
        writing_type: 'story',
        genre: result.genre,
        theme: result.theme,
        first_line: null,
        tags: result.tags?.map((t: string) => ({ id: 0, name: t })) || null,
        author: result.author,
      });

      await zeroDBService.trackContentSync('story', result.id, 'created');
    } catch (error) {
      console.error('[ZeroDB] Failed to sync story after create:', error);
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
        writing_type: 'story',
        excerpt: result.excerpt,
        content: result.full_text,
        date_written: result.date_written,
        word_count: result.word_count || result.full_text?.split(/\s+/).length || 0,
        form: null,
        genre: result.genre,
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
        writing_type: 'story',
        genre: result.genre,
        theme: result.theme,
        first_line: null,
        tags: result.tags?.map((t: string) => ({ id: 0, name: t })) || null,
        author: result.author,
      });

      await zeroDBService.trackContentSync('story', result.id, 'updated');
    } catch (error) {
      console.error('[ZeroDB] Failed to sync story after update:', error);
    }
  },

  async afterDelete(event: LifecycleEvent) {
    const { result } = event;
    if (!result?.id) return;

    try {
      await zeroDBService.deleteWriting(result.id);
      await zeroDBService.trackContentSync('story', result.id, 'deleted');
    } catch (error) {
      console.error('[ZeroDB] Failed to delete story:', error);
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
      console.error('[ZeroDB] Failed to delete stories:', error);
    }
  },
};
