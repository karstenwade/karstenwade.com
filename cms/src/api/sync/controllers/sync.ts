/**
 * Sync Controller
 * Manual triggers for GitHub sync operations
 */

import type { Context } from 'koa';
import githubSyncService from '../../../services/github-sync';

export default {
  /**
   * Sync TOSW chapters from theopensourceway/guidebook
   * Route: POST /api/sync/tosw-chapters
   *
   * Query params:
   * - forceRefresh: boolean (default: false)
   */
  async syncToswChapters(ctx: Context) {
    try {
      const forceRefresh = ctx.query.forceRefresh === 'true';

      console.log(`[Sync API] Starting TOSW chapters sync (forceRefresh: ${forceRefresh})...`);

      const result = await githubSyncService.syncToswChapters(forceRefresh);

      console.log(
        `[Sync API] TOSW sync complete: ${result.created} created, ${result.updated} updated, ${result.unchanged} unchanged, ${result.errors.length} errors`
      );

      ctx.body = {
        success: true,
        result: {
          created: result.created,
          updated: result.updated,
          unchanged: result.unchanged,
          errorCount: result.errors.length,
          errors: result.errors,
        },
        message: `Sync complete: ${result.created + result.updated} chapters synced`,
      };
    } catch (error) {
      console.error('[Sync API] Error syncing TOSW chapters:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return ctx.internalServerError(`TOSW sync failed: ${errorMessage}`);
    }
  },

  /**
   * Sync papers from karstenwade/papers
   * Route: POST /api/sync/papers
   *
   * Query params:
   * - forceRefresh: boolean (default: false)
   */
  async syncPapers(ctx: Context) {
    try {
      const forceRefresh = ctx.query.forceRefresh === 'true';

      console.log(`[Sync API] Starting papers sync (forceRefresh: ${forceRefresh})...`);

      const result = await githubSyncService.syncPapers(forceRefresh);

      console.log(
        `[Sync API] Papers sync complete: ${result.created} created, ${result.updated} updated, ${result.unchanged} unchanged, ${result.errors.length} errors`
      );

      ctx.body = {
        success: true,
        result: {
          created: result.created,
          updated: result.updated,
          unchanged: result.unchanged,
          errorCount: result.errors.length,
          errors: result.errors,
        },
        message: `Sync complete: ${result.created + result.updated} papers synced`,
      };
    } catch (error) {
      console.error('[Sync API] Error syncing papers:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return ctx.internalServerError(`Papers sync failed: ${errorMessage}`);
    }
  },

  /**
   * Sync both TOSW chapters and papers
   * Route: POST /api/sync/all
   *
   * Query params:
   * - forceRefresh: boolean (default: false)
   */
  async syncAll(ctx: Context) {
    try {
      const forceRefresh = ctx.query.forceRefresh === 'true';

      console.log(`[Sync API] Starting full sync (forceRefresh: ${forceRefresh})...`);

      const [papersResult, toswResult] = await Promise.all([
        githubSyncService.syncPapers(forceRefresh),
        githubSyncService.syncToswChapters(forceRefresh),
      ]);

      const totalCreated = papersResult.created + toswResult.created;
      const totalUpdated = papersResult.updated + toswResult.updated;
      const totalUnchanged = papersResult.unchanged + toswResult.unchanged;
      const totalErrors = papersResult.errors.length + toswResult.errors.length;

      console.log(
        `[Sync API] Full sync complete: ${totalCreated} created, ${totalUpdated} updated, ${totalUnchanged} unchanged, ${totalErrors} errors`
      );

      ctx.body = {
        success: true,
        papers: {
          created: papersResult.created,
          updated: papersResult.updated,
          unchanged: papersResult.unchanged,
          errorCount: papersResult.errors.length,
          errors: papersResult.errors,
        },
        tosw: {
          created: toswResult.created,
          updated: toswResult.updated,
          unchanged: toswResult.unchanged,
          errorCount: toswResult.errors.length,
          errors: toswResult.errors,
        },
        totals: {
          created: totalCreated,
          updated: totalUpdated,
          unchanged: totalUnchanged,
          errors: totalErrors,
        },
        message: `Full sync complete: ${totalCreated + totalUpdated} items synced`,
      };
    } catch (error) {
      console.error('[Sync API] Error during full sync:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return ctx.internalServerError(`Full sync failed: ${errorMessage}`);
    }
  },
};
