/**
 * GitHub Webhook Routes
 * Defines the webhook endpoint for receiving GitHub push events
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/github-webhook',
      handler: 'github-webhook.handleWebhook',
      config: {
        // Disable authentication - webhook is authenticated via signature
        auth: false,
        // No additional policies needed
        policies: [],
        // Middlewares can be added here if needed
        middlewares: [],
      },
    },
  ],
};
