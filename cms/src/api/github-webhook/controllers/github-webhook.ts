/**
 * GitHub Webhook Controller
 * Handles POST requests from GitHub webhooks
 */

import type { Context } from 'koa';
import webhookService from '../services/github-webhook';
import githubSyncService from '../../../services/github-sync';

export default {
  /**
   * Handle GitHub webhook POST request
   * Route: POST /api/github-webhook
   *
   * Flow:
   * 1. Verify X-Hub-Signature-256 header
   * 2. Parse webhook payload
   * 3. Only process 'push' events
   * 4. Identify repository
   * 5. Process changed markdown files
   * 6. Return sync results
   */
  async handleWebhook(ctx: Context) {
    try {
      // Step 1: Verify signature
      const signature = ctx.request.headers['x-hub-signature-256'] as string;
      if (!signature) {
        return ctx.badRequest('Missing signature header');
      }

      const secret = process.env.GITHUB_WEBHOOK_SECRET;
      if (!secret) {
        console.error('[GitHub Webhook] GITHUB_WEBHOOK_SECRET not configured');
        return ctx.internalServerError('Webhook secret not configured');
      }

      // Get raw body for signature verification
      // In Strapi/Koa, we stringify the parsed body for signature verification
      // Note: For production, consider using koa-bodyparser with rawBody option
      const rawBody = JSON.stringify(ctx.request.body);

      const isValid = webhookService.verifySignature(rawBody, signature, secret);
      if (!isValid) {
        console.warn('[GitHub Webhook] Invalid signature received');
        return ctx.unauthorized('Invalid signature');
      }

      // Step 2: Check event type (only process push events)
      const eventType = ctx.request.headers['x-github-event'] as string;
      if (eventType !== 'push') {
        console.log(`[GitHub Webhook] Ignoring event type: ${eventType}`);
        return (ctx.body = {
          success: true,
          message: `Event type ${eventType} ignored`,
        });
      }

      // Step 3: Parse payload
      const payload = ctx.request.body;
      const parsedData = webhookService.parseWebhookPayload(payload);

      // Step 4: Identify repository
      const repository = webhookService.identifyRepository(parsedData.repository);
      if (!repository) {
        console.warn(
          `[GitHub Webhook] Unknown repository: ${parsedData.repository}`
        );
        return ctx.badRequest(
          `Unknown repository: ${parsedData.repository}. Only karstenwade/papers and theopensourceway/guidebook are supported.`
        );
      }

      console.log(
        `[GitHub Webhook] Processing push to ${repository}/${parsedData.branch}`
      );
      console.log(
        `[GitHub Webhook] Files - Added: ${parsedData.added.length}, Modified: ${parsedData.modified.length}, Removed: ${parsedData.removed.length}`
      );

      // Step 5: Process changed files
      const results = {
        synced: [] as string[],
        deleted: [] as string[],
        errors: [] as { file: string; error: string }[],
      };

      // Process added and modified files (sync to Strapi)
      const filesToSync = [...parsedData.added, ...parsedData.modified];
      for (const file of filesToSync) {
        try {
          const result = await githubSyncService.syncFile(
            repository,
            file,
            parsedData.branch
          );
          if (result.success) {
            results.synced.push(file);
            console.log(`[GitHub Webhook] Synced: ${file}`);
          } else {
            results.errors.push({ file, error: result.error || 'Unknown error' });
            console.error(`[GitHub Webhook] Failed to sync ${file}: ${result.error}`);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          results.errors.push({ file, error: errorMessage });
          console.error(`[GitHub Webhook] Error syncing ${file}:`, error);
        }
      }

      // Process removed files (delete from Strapi)
      for (const file of parsedData.removed) {
        try {
          const result = await githubSyncService.deleteFile(repository, file);
          if (result.success) {
            results.deleted.push(file);
            console.log(`[GitHub Webhook] Deleted: ${file}`);
          } else {
            results.errors.push({ file, error: result.error || 'Unknown error' });
            console.error(`[GitHub Webhook] Failed to delete ${file}: ${result.error}`);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          results.errors.push({ file, error: errorMessage });
          console.error(`[GitHub Webhook] Error deleting ${file}:`, error);
        }
      }

      // Step 6: Return results
      const totalProcessed = results.synced.length + results.deleted.length;
      console.log(
        `[GitHub Webhook] Processing complete: ${totalProcessed} files processed, ${results.errors.length} errors`
      );

      ctx.body = {
        success: true,
        repository,
        branch: parsedData.branch,
        processed: totalProcessed,
        synced: results.synced.length,
        deleted: results.deleted.length,
        errors: results.errors,
      };
    } catch (error) {
      console.error('[GitHub Webhook] Unexpected error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return ctx.internalServerError(`Webhook processing failed: ${errorMessage}`);
    }
  },
};
