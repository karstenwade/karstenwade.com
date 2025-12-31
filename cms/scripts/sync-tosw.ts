#!/usr/bin/env node
/**
 * Script to manually trigger GitHub sync for TOSW chapters
 *
 * Usage:
 *   npm run sync:tosw
 *   npm run sync:tosw -- --force  (force refresh all)
 */

import Strapi from '@strapi/strapi';

async function main() {
  console.log('[Sync TOSW] Starting...');

  // Parse args
  const forceRefresh = process.argv.includes('--force');
  if (forceRefresh) {
    console.log('[Sync TOSW] Force refresh mode enabled');
  }

  // Initialize Strapi
  const appContext = await Strapi.compile();
  const app = await Strapi(appContext).load();

  try {
    // Import the github-sync service
    // @ts-ignore - dynamic import from Strapi
    const githubSyncService = await import('../src/services/github-sync');
    const service = githubSyncService.default;

    // Set Strapi instance
    service.setStrapi(app);

    // Run sync
    console.log('[Sync TOSW] Fetching chapters from GitHub...');
    const result = await service.syncToswChapters(forceRefresh);

    // Display results
    console.log('\n═══════════════════════════════════════════');
    console.log('         SYNC COMPLETE');
    console.log('═══════════════════════════════════════════');
    console.log(`✓ Created:    ${result.created}`);
    console.log(`↻ Updated:    ${result.updated}`);
    console.log(`- Unchanged:  ${result.unchanged}`);
    console.log(`✗ Errors:     ${result.errors.length}`);
    console.log('═══════════════════════════════════════════\n');

    if (result.errors.length > 0) {
      console.log('Errors encountered:');
      result.errors.forEach(err => console.error(`  - ${err}`));
      console.log('');
    }

    // Exit successfully
    process.exit(0);
  } catch (error) {
    console.error('[Sync TOSW] Fatal error:', error);
    process.exit(1);
  } finally {
    // Cleanup Strapi
    await app.destroy();
  }
}

main();
