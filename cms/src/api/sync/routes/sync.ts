/**
 * Sync Routes
 * Admin routes for manually triggering GitHub sync operations
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/sync/tosw-chapters',
      handler: 'sync.syncToswChapters',
      config: {
        // Require authentication for manual sync
        auth: false, // Set to true in production to require admin auth
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/sync/papers',
      handler: 'sync.syncPapers',
      config: {
        auth: false, // Set to true in production to require admin auth
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/sync/all',
      handler: 'sync.syncAll',
      config: {
        auth: false, // Set to true in production to require admin auth
        policies: [],
        middlewares: [],
      },
    },
  ],
};
