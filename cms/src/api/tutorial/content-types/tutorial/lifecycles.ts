/**
 * Tutorial Lifecycle Hooks
 *
 * These hooks sync tutorial content to ZeroDB when:
 * - A tutorial is created
 * - A tutorial is updated
 * - A tutorial is published
 * - A tutorial is deleted
 */

import zeroDBService from '../../../../services/zerodb';

interface TutorialData {
  id: number;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  difficulty?: string;
  duration?: number;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  author?: { id: number; name: string } | null;
  category?: { id: number; name: string } | null;
  tags?: Array<{ id: number; name: string }> | null;
}

interface LifecycleEvent {
  result?: TutorialData;
  params?: {
    where?: { id?: number };
    data?: Partial<TutorialData>;
  };
}

export default {
  /**
   * After creating a tutorial, sync to ZeroDB
   */
  async afterCreate(event: LifecycleEvent) {
    const { result } = event;
    if (!result) return;

    try {
      await zeroDBService.syncTutorial({
        id: result.id,
        title: result.title,
        slug: result.slug,
        description: result.description,
        content: result.content,
        difficulty: result.difficulty,
        duration: result.duration,
        publishedAt: result.publishedAt,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        author: result.author,
        category: result.category,
        tags: result.tags,
      });
    } catch (error) {
      console.error('[ZeroDB] Failed to sync tutorial after create:', error);
    }
  },

  /**
   * After updating a tutorial, sync to ZeroDB
   */
  async afterUpdate(event: LifecycleEvent) {
    const { result } = event;
    if (!result) return;

    try {
      await zeroDBService.syncTutorial({
        id: result.id,
        title: result.title,
        slug: result.slug,
        description: result.description,
        content: result.content,
        difficulty: result.difficulty,
        duration: result.duration,
        publishedAt: result.publishedAt,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        author: result.author,
        category: result.category,
        tags: result.tags,
      });
    } catch (error) {
      console.error('[ZeroDB] Failed to sync tutorial after update:', error);
    }
  },

  /**
   * After deleting a tutorial, remove from ZeroDB
   */
  async afterDelete(event: LifecycleEvent) {
    const { result } = event;
    if (!result?.id) return;

    try {
      await zeroDBService.deleteTutorial(result.id);
    } catch (error) {
      console.error('[ZeroDB] Failed to delete tutorial:', error);
    }
  },

  /**
   * After deleting many tutorials, remove from ZeroDB
   */
  async afterDeleteMany(event: { params?: { where?: { id?: { $in: number[] } } } }) {
    const ids = event.params?.where?.id?.$in;
    if (!ids?.length) return;

    try {
      for (const id of ids) {
        await zeroDBService.deleteTutorial(id);
      }
    } catch (error) {
      console.error('[ZeroDB] Failed to delete tutorials:', error);
    }
  },
};
