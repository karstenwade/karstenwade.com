/**
 * Integration tests for GitHub Webhook Controller
 * Tests the complete webhook handling flow
 */

describe('GitHub Webhook Controller', () => {
  describe('handleWebhook', () => {
    it('should reject requests without X-Hub-Signature-256 header', async () => {
      // Arrange
      const ctx = {
        request: {
          body: { repository: { full_name: 'karstenwade/papers' } },
          headers: {},
        },
        badRequest: jest.fn(),
      };

      // Act
      await handleWebhook(ctx);

      // Assert
      expect(ctx.badRequest).toHaveBeenCalledWith('Missing signature header');
    });

    it('should reject requests with invalid signature', async () => {
      // Arrange
      const ctx = {
        request: {
          body: { repository: { full_name: 'karstenwade/papers' } },
          headers: {
            'x-hub-signature-256': 'sha256=invalid-signature',
          },
          rawBody: JSON.stringify({ repository: { full_name: 'karstenwade/papers' } }),
        },
        unauthorized: jest.fn(),
      };

      // Act
      await handleWebhook(ctx);

      // Assert
      expect(ctx.unauthorized).toHaveBeenCalledWith('Invalid signature');
    });

    it('should process valid push events', async () => {
      // Arrange
      const payload = {
        repository: { full_name: 'karstenwade/papers' },
        ref: 'refs/heads/main',
        commits: [
          {
            id: 'abc123',
            added: ['new-paper.md'],
            modified: ['existing-paper.md'],
            removed: ['old-paper.md'],
          },
        ],
      };

      const rawBody = JSON.stringify(payload);
      const secret = process.env.GITHUB_WEBHOOK_SECRET || 'test-secret';
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', secret);
      const signature = 'sha256=' + hmac.update(rawBody).digest('hex');

      const ctx = {
        request: {
          body: payload,
          headers: {
            'x-hub-signature-256': signature,
            'x-github-event': 'push',
          },
          rawBody,
        },
        body: null,
      };

      // Mock the github sync service
      const mockGithubSync = {
        syncFile: jest.fn().mockResolvedValue({ success: true }),
        deleteFile: jest.fn().mockResolvedValue({ success: true }),
      };

      // Act
      await handleWebhook(ctx, mockGithubSync);

      // Assert
      expect(mockGithubSync.syncFile).toHaveBeenCalledTimes(2); // added + modified
      expect(mockGithubSync.deleteFile).toHaveBeenCalledTimes(1); // removed
      expect(ctx.body).toMatchObject({
        success: true,
        processed: expect.any(Number),
      });
    });

    it('should ignore non-push events', async () => {
      // Arrange
      const payload = {
        repository: { full_name: 'karstenwade/papers' },
      };

      const rawBody = JSON.stringify(payload);
      const secret = process.env.GITHUB_WEBHOOK_SECRET || 'test-secret';
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', secret);
      const signature = 'sha256=' + hmac.update(rawBody).digest('hex');

      const ctx = {
        request: {
          body: payload,
          headers: {
            'x-hub-signature-256': signature,
            'x-github-event': 'pull_request',
          },
          rawBody,
        },
        body: null,
      };

      // Act
      await handleWebhook(ctx);

      // Assert
      expect(ctx.body).toMatchObject({
        success: true,
        message: 'Event type pull_request ignored',
      });
    });

    it('should reject webhooks from unknown repositories', async () => {
      // Arrange
      const payload = {
        repository: { full_name: 'unknown/repo' },
        ref: 'refs/heads/main',
        commits: [],
      };

      const rawBody = JSON.stringify(payload);
      const secret = process.env.GITHUB_WEBHOOK_SECRET || 'test-secret';
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', secret);
      const signature = 'sha256=' + hmac.update(rawBody).digest('hex');

      const ctx = {
        request: {
          body: payload,
          headers: {
            'x-hub-signature-256': signature,
            'x-github-event': 'push',
          },
          rawBody,
        },
        badRequest: jest.fn(),
      };

      // Act
      await handleWebhook(ctx);

      // Assert
      expect(ctx.badRequest).toHaveBeenCalledWith(
        expect.stringContaining('Unknown repository')
      );
    });

    it('should only process markdown files', async () => {
      // Arrange
      const payload = {
        repository: { full_name: 'karstenwade/papers' },
        ref: 'refs/heads/main',
        commits: [
          {
            id: 'abc123',
            added: ['paper.md', 'image.png', 'README.md'],
            modified: ['config.json'],
            removed: ['old.md'],
          },
        ],
      };

      const rawBody = JSON.stringify(payload);
      const secret = process.env.GITHUB_WEBHOOK_SECRET || 'test-secret';
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', secret);
      const signature = 'sha256=' + hmac.update(rawBody).digest('hex');

      const ctx = {
        request: {
          body: payload,
          headers: {
            'x-hub-signature-256': signature,
            'x-github-event': 'push',
          },
          rawBody,
        },
        body: null,
      };

      const mockGithubSync = {
        syncFile: jest.fn().mockResolvedValue({ success: true }),
        deleteFile: jest.fn().mockResolvedValue({ success: true }),
      };

      // Act
      await handleWebhook(ctx, mockGithubSync);

      // Assert
      expect(mockGithubSync.syncFile).toHaveBeenCalledTimes(2); // paper.md, README.md
      expect(mockGithubSync.deleteFile).toHaveBeenCalledTimes(1); // old.md
    });

    it('should handle sync errors gracefully', async () => {
      // Arrange
      const payload = {
        repository: { full_name: 'karstenwade/papers' },
        ref: 'refs/heads/main',
        commits: [
          {
            id: 'abc123',
            added: ['paper.md'],
            modified: [],
            removed: [],
          },
        ],
      };

      const rawBody = JSON.stringify(payload);
      const secret = process.env.GITHUB_WEBHOOK_SECRET || 'test-secret';
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', secret);
      const signature = 'sha256=' + hmac.update(rawBody).digest('hex');

      const ctx = {
        request: {
          body: payload,
          headers: {
            'x-hub-signature-256': signature,
            'x-github-event': 'push',
          },
          rawBody,
        },
        body: null,
        internalServerError: jest.fn(),
      };

      const mockGithubSync = {
        syncFile: jest.fn().mockRejectedValue(new Error('Sync failed')),
      };

      // Act
      await handleWebhook(ctx, mockGithubSync);

      // Assert
      expect(ctx.internalServerError).toHaveBeenCalledWith(
        expect.stringContaining('Webhook processing failed')
      );
    });
  });
});

// Type stub for test clarity
async function handleWebhook(ctx: any, githubSyncService?: any): Promise<void> {
  throw new Error('Not implemented - implement in github-webhook.controller.ts');
}
