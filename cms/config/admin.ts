export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
    // Token expiration time for admin JWT (default: 30 days)
    options: {
      expiresIn: env('ADMIN_JWT_EXPIRES_IN', '30d'),
    },
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    // Disable NPS survey in production
    nps: env.bool('FLAG_NPS', false),
    // Disable Enterprise Edition promotion in production
    promoteEE: env.bool('FLAG_PROMOTE_EE', false),
  },
  // Rate limiting configuration
  rateLimit: {
    // Rate limit for admin login (requests per interval)
    max: env.int('ADMIN_RATE_LIMIT_MAX', 10),
    interval: env.int('ADMIN_RATE_LIMIT_INTERVAL', 60000), // 1 minute
    // Rate limit for forgot password
    delayOnBlock: env.int('ADMIN_RATE_LIMIT_DELAY', 3000), // 3 seconds
  },
  // Admin panel settings
  watchIgnoreFiles: [
    '**/config/sync/**',
  ],
  // Audit logs retention (days)
  auditLogs: {
    enabled: env.bool('ADMIN_AUDIT_LOGS', true),
    retentionDays: env.int('ADMIN_AUDIT_RETENTION_DAYS', 90),
  },
});
