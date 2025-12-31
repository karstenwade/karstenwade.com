/**
 * GitHub Sync Service
 * Handles syncing markdown content from GitHub repositories to Strapi
 *
 * Features:
 * - Fetch markdown files from GitHub API
 * - Parse frontmatter and content using gray-matter
 * - Create/update Strapi entries via documents API
 * - Handle file deletions
 * - SHA-based change detection
 * - Respect sync_locked flag
 */

import matter from 'gray-matter';

// ==========================================
// Types
// ==========================================

export interface SyncResult {
  success: boolean;
  documentId?: string;
  error?: string;
}

export interface BatchSyncResult {
  created: number;
  updated: number;
  unchanged: number;
  errors: string[];
}

interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  type: 'file' | 'dir';
  download_url?: string;
}

interface ParsedMarkdown {
  frontmatter: Record<string, any>;
  content: string;
}

interface StrapiEntry {
  id?: number;
  documentId?: string;
  github_path?: string;
  github_sha?: string;
  sync_locked?: boolean;
  [key: string]: any;
}

// ==========================================
// GitHub Sync Service Class
// ==========================================

export class GitHubSyncService {
  public readonly papersRepo = 'karstenwade/papers';
  public readonly toswRepo = 'theopensourceway/guidebook';
  public readonly githubToken?: string;
  private strapi: any;

  constructor() {
    this.githubToken = process.env.GITHUB_ACCESS_TOKEN;
  }

  /**
   * Set Strapi instance for testing
   */
  setStrapi(strapiInstance: any) {
    this.strapi = strapiInstance;
  }

  /**
   * Get Strapi instance (use global if not set)
   */
  private getStrapi() {
    return this.strapi || (global as any).strapi;
  }

  // ==========================================
  // Helper Methods
  // ==========================================

  /**
   * Parse markdown frontmatter using gray-matter
   */
  parseFrontmatter(markdown: string): ParsedMarkdown {
    try {
      const parsed = matter(markdown);
      return {
        frontmatter: parsed.data,
        content: parsed.content,
      };
    } catch (error) {
      throw new Error(`Failed to parse frontmatter: ${error.message}`);
    }
  }

  /**
   * Check if entry needs update based on SHA
   */
  needsUpdate(entry: StrapiEntry | null, githubSha: string): boolean {
    if (!entry) return true;
    if (entry.sync_locked) return false;
    if (!entry.github_sha) return true;
    return entry.github_sha !== githubSha;
  }

  /**
   * Fetch repository contents from GitHub
   */
  async fetchRepoContents(
    owner: string,
    repo: string,
    path: string = ''
  ): Promise<GitHubFile[]> {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
    };

    if (this.githubToken) {
      headers['Authorization'] = `Bearer ${this.githubToken}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json() as Promise<GitHubFile[]>;
  }

  /**
   * Fetch file content from GitHub
   */
  async fetchFileContent(
    owner: string,
    repo: string,
    path: string,
    branch: string = 'main'
  ): Promise<string> {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch file content: ${response.status} ${response.statusText}`
      );
    }

    return response.text();
  }

  /**
   * Map paper data from GitHub to Strapi format
   */
  mapPaperToStrapi(file: GitHubFile, parsed: ParsedMarkdown): any {
    const { frontmatter, content } = parsed;

    // Extract description from abstract or frontmatter
    const description = frontmatter.description ||
      (frontmatter.abstract ? frontmatter.abstract.substring(0, 300) : undefined);

    // Generate slug from title or filename
    const title = frontmatter.title || file.name.replace('.md', '');
    const slug = this.generateSlug(title);

    return {
      title,
      slug,
      abstract: frontmatter.abstract,
      description,
      content,
      version: String(frontmatter.version || '1.0'),
      publication_date: frontmatter.publicationDate || frontmatter.publication_date,
      last_updated: frontmatter.lastUpdated,
      pdf_url: frontmatter.pdfUrl || frontmatter.pdf_url,
      doi: frontmatter.doi,
      external_url: file.download_url,
      github_path: file.path,
      github_sha: file.sha,
      source: 'github-papers',
      featured: frontmatter.featured || false,
      publishedAt: new Date().toISOString(),
    };
  }

  /**
   * Generate URL-safe slug from title
   */
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 200);
  }

  /**
   * Map TOSW chapter from GitHub to Strapi format
   */
  mapToswChapterToStrapi(
    file: GitHubFile,
    parsed: ParsedMarkdown,
    section: string
  ): any {
    const { content } = parsed;

    // Extract title from first H1
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : file.name.replace('.md', '');

    // Extract description from first paragraph after title
    // Match first H1, then find the next paragraph (non-empty line that's not a heading)
    const paragraphMatch = content.match(/^#\s+.+\n\n([^#\n][^\n]+)/m);
    // Truncate to 500 chars max (Strapi schema limit)
    const rawDescription = paragraphMatch ? paragraphMatch[1].trim() : '';
    const description = rawDescription.length > 500 ? rawDescription.substring(0, 497) + '...' : rawDescription;

    // Extract chapter order from filename (e.g., "01-intro.md" -> 1)
    const orderMatch = file.name.match(/^(\d+)-/);
    const chapterOrder = orderMatch ? parseInt(orderMatch[1], 10) : 0;

    // Generate slug from section and title for uniqueness
    const slug = this.generateSlug(`${section}-${title}`);

    return {
      title,
      slug,
      description,
      content,
      section,
      section_order: 0, // Can be set based on directory order if needed
      chapter_order: chapterOrder,
      github_path: file.path,
      github_sha: file.sha,
      external_url: file.download_url,
      source: 'github-tosw',
      license: 'CC BY-SA 4.0',
      publishedAt: new Date().toISOString(),
    };
  }

  // ==========================================
  // Full Repository Sync Methods
  // ==========================================

  /**
   * Sync all papers from karstenwade/papers repository
   */
  async syncPapers(forceRefresh: boolean = false): Promise<BatchSyncResult> {
    const strapi = this.getStrapi();
    const result: BatchSyncResult = {
      created: 0,
      updated: 0,
      unchanged: 0,
      errors: [],
    };

    try {
      strapi.log.info('[GitHub Sync] Starting papers sync...');

      // Fetch papers directory from GitHub
      const [owner, repo] = this.papersRepo.split('/');
      // Fetch from repo root (papers are at root level, not in a subdirectory)
      const files = await this.fetchRepoContents(owner, repo, '');

      // Filter markdown files only, excluding README files
      const markdownFiles = files.filter(
        (file) => file.type === 'file' &&
                  file.name.endsWith('.md') &&
                  file.name.toLowerCase() !== 'readme.md'
      );

      strapi.log.info(
        `[GitHub Sync] Found ${markdownFiles.length} markdown files`
      );

      // Process each file
      for (const file of markdownFiles) {
        try {
          // Check if entry exists
          const existingEntries = await strapi.documents('api::paper.paper').findMany({
            filters: { github_path: file.path },
          });

          const existingEntry = existingEntries?.[0];

          // Skip if no update needed (unless force refresh)
          if (!forceRefresh && existingEntry && !this.needsUpdate(existingEntry, file.sha)) {
            result.unchanged++;
            continue;
          }

          // Skip if locked
          if (existingEntry?.sync_locked) {
            strapi.log.warn(
              `[GitHub Sync] Skipping locked entry: ${file.path}`
            );
            result.unchanged++;
            continue;
          }

          // Fetch and parse file content
          const content = await this.fetchFileContent(owner, repo, file.path);
          const parsed = this.parseFrontmatter(content);
          const paperData = this.mapPaperToStrapi(file, parsed);

          // Create or update (status: 'published' makes entry public in Strapi v5)
          if (existingEntry) {
            await strapi.documents('api::paper.paper').update({
              documentId: existingEntry.documentId,
              data: paperData,
              status: 'published',
            });
            result.updated++;
            strapi.log.info(`[GitHub Sync] Updated paper: ${file.path}`);
          } else {
            await strapi.documents('api::paper.paper').create({
              data: paperData,
              status: 'published',
            });
            result.created++;
            strapi.log.info(`[GitHub Sync] Created paper: ${file.path}`);
          }
        } catch (error) {
          const errorMsg = `Error processing ${file.path}: ${error.message}`;
          result.errors.push(errorMsg);
          strapi.log.error(`[GitHub Sync] ${errorMsg}`);
        }
      }

      strapi.log.info(
        `[GitHub Sync] Papers sync complete: ${result.created} created, ${result.updated} updated, ${result.unchanged} unchanged, ${result.errors.length} errors`
      );
    } catch (error) {
      const errorMsg = `Fatal error during papers sync: ${error.message}`;
      result.errors.push(errorMsg);
      strapi.log.error(`[GitHub Sync] ${errorMsg}`);
    }

    return result;
  }

  /**
   * Sync all TOSW chapters from theopensourceway/guidebook repository
   */
  async syncToswChapters(forceRefresh: boolean = false): Promise<BatchSyncResult> {
    const strapi = this.getStrapi();
    const result: BatchSyncResult = {
      created: 0,
      updated: 0,
      unchanged: 0,
      errors: [],
    };

    try {
      strapi.log.info('[GitHub Sync] Starting TOSW chapters sync...');

      // Fetch root directory
      const [owner, repo] = this.toswRepo.split('/');
      const rootContents = await this.fetchRepoContents(owner, repo);

      // Find section directories (skip hidden/special dirs)
      const sections = rootContents.filter(
        (item) =>
          item.type === 'dir' &&
          !item.name.startsWith('.') &&
          !['node_modules', 'dist', 'build'].includes(item.name)
      );

      strapi.log.info(`[GitHub Sync] Found ${sections.length} sections`);

      // Process each section
      for (const section of sections) {
        try {
          // Fetch files in section
          const sectionFiles = await this.fetchRepoContents(
            owner,
            repo,
            section.path
          );

          // Filter markdown files, excluding README files (section info, not chapters)
          const markdownFiles = sectionFiles.filter(
            (file) => file.type === 'file' &&
                      file.name.endsWith('.md') &&
                      file.name.toLowerCase() !== 'readme.md'
          );

          strapi.log.info(
            `[GitHub Sync] Processing ${markdownFiles.length} files in ${section.name}`
          );

          // Process each chapter file
          for (const file of markdownFiles) {
            try {
              // Check if entry exists
              const existingEntries = await strapi
                .documents('api::tosw-chapter.tosw-chapter')
                .findMany({
                  filters: { github_path: file.path },
                });

              const existingEntry = existingEntries?.[0];

              // Skip if no update needed
              if (!forceRefresh && existingEntry && !this.needsUpdate(existingEntry, file.sha)) {
                result.unchanged++;
                continue;
              }

              // Skip if locked
              if (existingEntry?.sync_locked) {
                result.unchanged++;
                continue;
              }

              // Fetch and parse content
              const content = await this.fetchFileContent(owner, repo, file.path);
              const parsed = this.parseFrontmatter(content);
              const chapterData = this.mapToswChapterToStrapi(
                file,
                parsed,
                section.name
              );

              // Create or update (status: 'published' makes entry public in Strapi v5)
              if (existingEntry) {
                await strapi
                  .documents('api::tosw-chapter.tosw-chapter')
                  .update({
                    documentId: existingEntry.documentId,
                    data: chapterData,
                    status: 'published',
                  });
                result.updated++;
                strapi.log.info(`[GitHub Sync] Updated chapter: ${file.path}`);
              } else {
                await strapi
                  .documents('api::tosw-chapter.tosw-chapter')
                  .create({
                    data: chapterData,
                    status: 'published',
                  });
                result.created++;
                strapi.log.info(`[GitHub Sync] Created chapter: ${file.path}`);
              }
            } catch (error) {
              const errorMsg = `Error processing ${file.path}: ${error.message}`;
              result.errors.push(errorMsg);
              strapi.log.error(`[GitHub Sync] ${errorMsg}`);
            }
          }
        } catch (error) {
          const errorMsg = `Error processing section ${section.name}: ${error.message}`;
          result.errors.push(errorMsg);
          strapi.log.error(`[GitHub Sync] ${errorMsg}`);
        }
      }

      strapi.log.info(
        `[GitHub Sync] TOSW sync complete: ${result.created} created, ${result.updated} updated, ${result.unchanged} unchanged, ${result.errors.length} errors`
      );
    } catch (error) {
      const errorMsg = `Fatal error during TOSW sync: ${error.message}`;
      result.errors.push(errorMsg);
      strapi.log.error(`[GitHub Sync] ${errorMsg}`);
    }

    return result;
  }

  /**
   * Sync a single paper file (for webhook)
   */
  async syncSinglePaper(filePath: string, sha: string): Promise<boolean> {
    const strapi = this.getStrapi();

    try {
      const [owner, repo] = this.papersRepo.split('/');

      // Check if exists
      const existingEntries = await strapi.documents('api::paper.paper').findMany({
        filters: { github_path: filePath },
      });

      const existingEntry = existingEntries?.[0];

      // Skip if locked
      if (existingEntry?.sync_locked) {
        strapi.log.warn(`[GitHub Sync] Paper is locked: ${filePath}`);
        return true;
      }

      // Fetch and parse
      const content = await this.fetchFileContent(owner, repo, filePath);
      const parsed = this.parseFrontmatter(content);

      const file: GitHubFile = {
        name: filePath.split('/').pop() || '',
        path: filePath,
        sha,
        type: 'file',
      };

      const paperData = this.mapPaperToStrapi(file, parsed);

      // Create or update (status: 'published' for Strapi v5)
      if (existingEntry) {
        await strapi.documents('api::paper.paper').update({
          documentId: existingEntry.documentId,
          data: paperData,
          status: 'published',
        });
        strapi.log.info(`[GitHub Sync] Updated single paper: ${filePath}`);
      } else {
        await strapi.documents('api::paper.paper').create({
          data: paperData,
          status: 'published',
        });
        strapi.log.info(`[GitHub Sync] Created single paper: ${filePath}`);
      }

      return true;
    } catch (error) {
      strapi.log.error(
        `[GitHub Sync] Error syncing single paper ${filePath}: ${error.message}`
      );
      return false;
    }
  }

  /**
   * Sync a single TOSW chapter (for webhook)
   */
  async syncSingleToswChapter(filePath: string, sha: string): Promise<boolean> {
    const strapi = this.getStrapi();

    try {
      const [owner, repo] = this.toswRepo.split('/');

      // Extract section from path
      const pathParts = filePath.split('/');
      const section = pathParts.length > 1 ? pathParts[0] : 'unknown';

      // Check if exists
      const existingEntries = await strapi
        .documents('api::tosw-chapter.tosw-chapter')
        .findMany({
          filters: { github_path: filePath },
        });

      const existingEntry = existingEntries?.[0];

      // Skip if locked
      if (existingEntry?.sync_locked) {
        return true;
      }

      // Fetch and parse
      const content = await this.fetchFileContent(owner, repo, filePath);
      const parsed = this.parseFrontmatter(content);

      const file: GitHubFile = {
        name: pathParts[pathParts.length - 1],
        path: filePath,
        sha,
        type: 'file',
      };

      const chapterData = this.mapToswChapterToStrapi(file, parsed, section);

      // Create or update (status: 'published' for Strapi v5)
      if (existingEntry) {
        await strapi
          .documents('api::tosw-chapter.tosw-chapter')
          .update({
            documentId: existingEntry.documentId,
            data: chapterData,
            status: 'published',
          });
        strapi.log.info(`[GitHub Sync] Updated chapter: ${filePath}`);
      } else {
        await strapi
          .documents('api::tosw-chapter.tosw-chapter')
          .create({
            data: chapterData,
            status: 'published',
          });
        strapi.log.info(`[GitHub Sync] Created chapter: ${filePath}`);
      }

      return true;
    } catch (error) {
      strapi.log.error(
        `[GitHub Sync] Error syncing chapter ${filePath}: ${error.message}`
      );
      return false;
    }
  }

  // ==========================================
  // Webhook-Oriented Methods
  // ==========================================

  /**
   * Sync a file from GitHub webhook event
   * Routes to appropriate handler based on repository
   */
  async syncFile(
    repository: string,
    filePath: string,
    branch: string
  ): Promise<SyncResult> {
    const strapi = this.getStrapi();

    try {
      strapi.log.info(
        `[GitHub Sync] Webhook sync: ${repository}/${filePath} (${branch})`
      );

      // Determine which repository and content type
      if (repository === 'papers' || repository === 'karstenwade/papers') {
        // Sync as paper
        const success = await this.syncSinglePaper(filePath, '');

        if (success) {
          // Get the synced entry to return documentId
          const entries = await strapi.documents('api::paper.paper').findMany({
            filters: { github_path: filePath },
          });

          return {
            success: true,
            documentId: entries?.[0]?.documentId,
          };
        } else {
          return {
            success: false,
            error: 'Failed to sync paper',
          };
        }
      } else if (
        repository === 'guidebook' ||
        repository === 'theopensourceway/guidebook'
      ) {
        // Sync as TOSW chapter
        const success = await this.syncSingleToswChapter(filePath, '');

        if (success) {
          const entries = await strapi
            .documents('api::tosw-chapter.tosw-chapter')
            .findMany({
              filters: { github_path: filePath },
            });

          return {
            success: true,
            documentId: entries?.[0]?.documentId,
          };
        } else {
          return {
            success: false,
            error: 'Failed to sync TOSW chapter',
          };
        }
      } else {
        return {
          success: false,
          error: `Unknown repository: ${repository}`,
        };
      }
    } catch (error) {
      strapi.log.error(
        `[GitHub Sync] Webhook sync error: ${error.message}`
      );
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Delete a file from Strapi when removed from GitHub
   * For use with webhook delete events
   */
  async deleteFile(repository: string, filePath: string): Promise<SyncResult> {
    const strapi = this.getStrapi();

    try {
      strapi.log.info(
        `[GitHub Sync] Webhook delete: ${repository}/${filePath}`
      );

      // Determine which repository and content type
      if (repository === 'papers' || repository === 'karstenwade/papers') {
        // Delete paper
        const entries = await strapi.documents('api::paper.paper').findMany({
          filters: { github_path: filePath },
        });

        if (entries && entries.length > 0) {
          const entry = entries[0];

          // Check if locked
          if (entry.sync_locked) {
            strapi.log.warn(
              `[GitHub Sync] Skipping delete of locked paper: ${filePath}`
            );
            return {
              success: true,
              documentId: entry.documentId,
            };
          }

          await strapi.documents('api::paper.paper').delete({
            documentId: entry.documentId,
          });

          strapi.log.info(`[GitHub Sync] Deleted paper: ${filePath}`);
          return {
            success: true,
            documentId: entry.documentId,
          };
        } else {
          // File not found in Strapi (already deleted or never synced)
          return {
            success: true,
          };
        }
      } else if (
        repository === 'guidebook' ||
        repository === 'theopensourceway/guidebook'
      ) {
        // Delete TOSW chapter
        const entries = await strapi
          .documents('api::tosw-chapter.tosw-chapter')
          .findMany({
            filters: { github_path: filePath },
          });

        if (entries && entries.length > 0) {
          const entry = entries[0];

          if (entry.sync_locked) {
            strapi.log.warn(
              `[GitHub Sync] Skipping delete of locked chapter: ${filePath}`
            );
            return {
              success: true,
              documentId: entry.documentId,
            };
          }

          await strapi.documents('api::tosw-chapter.tosw-chapter').delete({
            documentId: entry.documentId,
          });

          strapi.log.info(`[GitHub Sync] Deleted chapter: ${filePath}`);
          return {
            success: true,
            documentId: entry.documentId,
          };
        } else {
          return {
            success: true,
          };
        }
      } else {
        return {
          success: false,
          error: `Unknown repository: ${repository}`,
        };
      }
    } catch (error) {
      strapi.log.error(
        `[GitHub Sync] Webhook delete error: ${error.message}`
      );
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// ==========================================
// Singleton Instance Export
// ==========================================

const githubSyncService = new GitHubSyncService();
export default githubSyncService;
