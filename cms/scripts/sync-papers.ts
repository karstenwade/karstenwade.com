#!/usr/bin/env node
/**
 * Script to manually trigger GitHub sync for papers
 *
 * Usage:
 *   npm run sync:papers
 *   npm run sync:papers -- --force  (force refresh all)
 */

import Strapi from '@strapi/strapi';

async function main() {
  console.log('[Sync Papers] Starting...');

  // Parse args
  const forceRefresh = process.argv.includes('--force');
  if (forceRefresh) {
    console.log('[Sync Papers] Force refresh mode enabled');
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
    console.log('[Sync Papers] Fetching papers from GitHub...');
    const result = await service.syncPapers(forceRefresh);

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
    console.error('[Sync Papers] Fatal error:', error);
    process.exit(1);
  } finally {
    // Cleanup Strapi
    await app.destroy();
  }
}

main();
