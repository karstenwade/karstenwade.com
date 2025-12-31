/**
 * GitHub Webhook Service
 * Handles webhook signature verification and payload parsing
 */

import crypto from 'crypto';

export interface WebhookPayload {
  repository: {
    full_name: string;
  };
  ref: string;
  commits: Array<{
    id: string;
    added: string[];
    modified: string[];
    removed: string[];
  }>;
}

export interface ParsedWebhookData {
  repository: string;
  branch: string;
  added: string[];
  modified: string[];
  removed: string[];
}

/**
 * Verify GitHub webhook signature using HMAC SHA-256
 * Uses timing-safe comparison to prevent timing attacks
 *
 * @param payload - Raw request body as string
 * @param signature - X-Hub-Signature-256 header value
 * @param secret - GitHub webhook secret
 * @returns true if signature is valid
 */
export function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    // GitHub signature format: sha256=<hex-digest>
    if (!signature.startsWith('sha256=')) {
      return false;
    }

    const hmac = crypto.createHmac('sha256', secret);
    const expectedSignature = 'sha256=' + hmac.update(payload).digest('hex');

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );
  } catch (error) {
    // timingSafeEqual throws if buffers are different lengths
    return false;
  }
}

/**
 * Parse GitHub webhook payload to extract changed markdown files
 *
 * @param payload - GitHub webhook payload
 * @returns Parsed webhook data with repository info and changed files
 */
export function parseWebhookPayload(payload: WebhookPayload): ParsedWebhookData {
  // Extract repository name
  const repository = payload.repository.full_name;

  // Extract branch name from ref (refs/heads/branch-name)
  const branch = payload.ref.replace('refs/heads/', '');

  // Collect all changed markdown files from commits
  const added: string[] = [];
  const modified: string[] = [];
  const removed: string[] = [];

  for (const commit of payload.commits) {
    // Filter for markdown files only
    const mdAdded = commit.added.filter((file) => file.endsWith('.md'));
    const mdModified = commit.modified.filter((file) => file.endsWith('.md'));
    const mdRemoved = commit.removed.filter((file) => file.endsWith('.md'));

    added.push(...mdAdded);
    modified.push(...mdModified);
    removed.push(...mdRemoved);
  }

  return {
    repository,
    branch,
    added,
    modified,
    removed,
  };
}

/**
 * Identify which repository the webhook is from
 *
 * @param fullName - Repository full name (owner/repo)
 * @returns Repository identifier or null if unknown
 */
export function identifyRepository(fullName: string): string | null {
  // Map of known repositories
  const repositoryMap: Record<string, string> = {
    'karstenwade/papers': 'papers',
    'theopensourceway/guidebook': 'guidebook',
  };

  return repositoryMap[fullName] || null;
}

/**
 * Strapi service factory
 */
export default {
  verifySignature,
  parseWebhookPayload,
  identifyRepository,
};
