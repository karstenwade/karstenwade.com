/**
 * Blog Post Lifecycle Hooks
 *
 * These hooks sync blog post content to ZeroDB when:
 * - A blog post is created
 * - A blog post is updated
 * - A blog post is published
 * - A blog post is deleted
 */

import zeroDBService from '../../../../services/zerodb';

interface BlogPostData {
  id: number;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  reading_time?: number;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  author?: { id: number; name: string } | null;
  category?: { id: number; name: string } | null;
  tags?: Array<{ id: number; name: string }> | null;
}

interface LifecycleEvent {
  result?: BlogPostData;
  params?: {
    where?: { id?: number };
    data?: Partial<BlogPostData>;
  };
}

export default {
  /**
   * After creating a blog post, sync to ZeroDB
   */
  async afterCreate(event: LifecycleEvent) {
    const { result } = event;
    if (!result) return;

    try {
      // Sync to Tables API
      await zeroDBService.syncBlogPost({
        id: result.id,
        title: result.title,
        slug: result.slug,
        description: result.description,
        content: result.content,
        reading_time: result.reading_time,
        publishedAt: result.publishedAt,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        author: result.author,
        category: result.category,
        tags: result.tags,
      });

      // Sync embeddings for semantic search (if enabled)
      await zeroDBService.syncBlogPostEmbeddings({
        id: result.id,
        title: result.title,
        slug: result.slug,
        description: result.description,
        content: result.content,
        tags: result.tags,
        author: result.author,
        category: result.category,
      });

      // Track content sync event (if enabled)
      await zeroDBService.trackContentSync('blog-post', result.id, 'created');
    } catch (error) {
      console.error('[ZeroDB] Failed to sync blog post after create:', error);
      // Don't throw - we don't want to fail the Strapi operation
    }
  },

  /**
   * After updating a blog post, sync to ZeroDB
   */
  async afterUpdate(event: LifecycleEvent) {
    const { result } = event;
    if (!result) return;

    try {
      // Sync to Tables API
      await zeroDBService.syncBlogPost({
        id: result.id,
        title: result.title,
        slug: result.slug,
        description: result.description,
        content: result.content,
        reading_time: result.reading_time,
        publishedAt: result.publishedAt,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        author: result.author,
        category: result.category,
        tags: result.tags,
      });

      // Sync embeddings for semantic search (if enabled)
      await zeroDBService.syncBlogPostEmbeddings({
        id: result.id,
        title: result.title,
        slug: result.slug,
        description: result.description,
        content: result.content,
        tags: result.tags,
        author: result.author,
        category: result.category,
      });

      // Track content sync event (if enabled)
      await zeroDBService.trackContentSync('blog-post', result.id, 'updated');
    } catch (error) {
      console.error('[ZeroDB] Failed to sync blog post after update:', error);
    }
  },

  /**
   * After deleting a blog post, remove from ZeroDB
   */
  async afterDelete(event: LifecycleEvent) {
    const { result } = event;
    if (!result?.id) return;

    try {
      await zeroDBService.deleteBlogPost(result.id);
      // Track content sync event (if enabled)
      await zeroDBService.trackContentSync('blog-post', result.id, 'deleted');
    } catch (error) {
      console.error('[ZeroDB] Failed to delete blog post:', error);
    }
  },

  /**
   * After deleting many blog posts, remove from ZeroDB
   * Note: Strapi v5 uses afterDeleteMany for bulk operations
   */
  async afterDeleteMany(event: { params?: { where?: { id?: { $in: number[] } } } }) {
    const ids = event.params?.where?.id?.$in;
    if (!ids?.length) return;

    try {
      for (const id of ids) {
        await zeroDBService.deleteBlogPost(id);
      }
    } catch (error) {
      console.error('[ZeroDB] Failed to delete blog posts:', error);
    }
  },
};
