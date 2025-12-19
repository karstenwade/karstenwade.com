/**
 * ZeroDB HTTP Service for Strapi
 *
 * This service provides HTTP API integration with ZeroDB (api.ainative.studio)
 * to sync Strapi content to ZeroDB tables for production reads.
 *
 * Architecture:
 * - Strapi manages content via SQLite (admin interface)
 * - Lifecycle hooks sync content to ZeroDB via this service
 * - Next.js frontend reads from ZeroDB for performance
 */

interface ZeroDBConfig {
  apiUrl: string;
  projectId: string;
  username: string;
  password: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface ZeroDBRow {
  [key: string]: unknown;
}

interface QueryFilter {
  [key: string]: unknown;
}

class ZeroDBService {
  private config: ZeroDBConfig;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    this.config = {
      apiUrl: process.env.ZERODB_API_URL || 'https://api.ainative.studio',
      projectId: process.env.ZERODB_PROJECT_ID || '',
      username: process.env.ZERODB_USERNAME || '',
      password: process.env.ZERODB_PASSWORD || '',
    };
  }

  /**
   * Authenticate and get access token
   */
  private async authenticate(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken;
    }

    const response = await fetch(`${this.config.apiUrl}/v1/public/auth/login-json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.config.username,
        password: this.config.password,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ZeroDB authentication failed: ${error}`);
    }

    const data = await response.json() as TokenResponse;
    this.accessToken = data.access_token;
    // Set expiry to 25 minutes (tokens expire at 30)
    this.tokenExpiry = new Date(Date.now() + 25 * 60 * 1000);

    return this.accessToken;
  }

  /**
   * Make authenticated request to ZeroDB API
   */
  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: unknown
  ): Promise<T> {
    const token = await this.authenticate();

    const response = await fetch(`${this.config.apiUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ZeroDB API error: ${response.status} - ${error}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    return !!(
      this.config.projectId &&
      this.config.username &&
      this.config.password
    );
  }

  /**
   * Insert rows into a ZeroDB table
   */
  async insertRows(tableId: string, rows: ZeroDBRow[]): Promise<{ inserted_count: number; row_ids: string[] }> {
    return this.request(`/v1/projects/${this.config.projectId}/tables/${tableId}/rows`, 'POST', {
      rows,
    });
  }

  /**
   * Query rows from a ZeroDB table
   */
  async queryRows(
    tableId: string,
    filters?: QueryFilter,
    limit = 100,
    offset = 0
  ): Promise<{ rows: ZeroDBRow[]; total_count: number }> {
    return this.request(`/v1/projects/${this.config.projectId}/tables/${tableId}/rows/query`, 'POST', {
      filter: filters,
      limit,
      offset,
    });
  }

  /**
   * Update rows in a ZeroDB table
   */
  async updateRows(
    tableId: string,
    filters: QueryFilter,
    updates: Partial<ZeroDBRow>
  ): Promise<{ updated_count: number }> {
    return this.request(`/v1/projects/${this.config.projectId}/tables/${tableId}/rows`, 'PUT', {
      filter: filters,
      update: { $set: updates },
    });
  }

  /**
   * Delete rows from a ZeroDB table
   */
  async deleteRows(tableId: string, filters: QueryFilter): Promise<{ deleted_count: number }> {
    return this.request(`/v1/projects/${this.config.projectId}/tables/${tableId}/rows`, 'DELETE', {
      filter: filters,
    });
  }

  // ==========================================
  // Blog Post Operations
  // ==========================================

  /**
   * Sync a blog post to ZeroDB
   */
  async syncBlogPost(blogPost: {
    id: number;
    title: string;
    slug: string;
    description?: string;
    content?: string;
    reading_time?: number;
    publishedAt?: string;
    createdAt?: string;
    updatedAt?: string;
    author?: { name: string } | null;
    category?: { name: string } | null;
    tags?: Array<{ name: string }> | null;
  }): Promise<void> {
    if (!this.isConfigured()) {
      console.warn('[ZeroDB] Service not configured, skipping sync');
      return;
    }

    const tableId = 'strapi_blog_posts';

    // Check if blog post exists
    const existing = await this.queryRows(tableId, { strapi_id: blogPost.id });

    const row: ZeroDBRow = {
      strapi_id: blogPost.id,
      title: blogPost.title,
      slug: blogPost.slug,
      excerpt: blogPost.description || '',
      content: blogPost.content || '',
      reading_time: blogPost.reading_time || 5,
      published_at: blogPost.publishedAt || null,
      created_at: blogPost.createdAt || new Date().toISOString(),
      updated_at: blogPost.updatedAt || new Date().toISOString(),
      author: blogPost.author?.name || null,
      category: blogPost.category?.name || null,
      tags: blogPost.tags?.map(t => t.name) || [],
    };

    if (existing.total_count > 0) {
      // Update existing
      await this.updateRows(tableId, { strapi_id: blogPost.id }, row);
      console.log(`[ZeroDB] Updated blog post: ${blogPost.slug}`);
    } else {
      // Insert new
      await this.insertRows(tableId, [row]);
      console.log(`[ZeroDB] Created blog post: ${blogPost.slug}`);
    }

    // Update sync metadata
    await this.updateSyncMetadata('blog-post', blogPost.id);
  }

  /**
   * Delete a blog post from ZeroDB
   */
  async deleteBlogPost(strapiId: number): Promise<void> {
    if (!this.isConfigured()) {
      console.warn('[ZeroDB] Service not configured, skipping delete');
      return;
    }

    const tableId = 'strapi_blog_posts';
    await this.deleteRows(tableId, { strapi_id: strapiId });
    console.log(`[ZeroDB] Deleted blog post with strapi_id: ${strapiId}`);
  }

  // ==========================================
  // Tutorial Operations
  // ==========================================

  /**
   * Sync a tutorial to ZeroDB
   */
  async syncTutorial(tutorial: {
    id: number;
    title: string;
    slug: string;
    description?: string;
    content?: string;
    difficulty?: string;
    duration?: number;
    publishedAt?: string;
    createdAt?: string;
    updatedAt?: string;
    author?: { name: string } | null;
    category?: { name: string } | null;
    tags?: Array<{ name: string }> | null;
  }): Promise<void> {
    if (!this.isConfigured()) {
      console.warn('[ZeroDB] Service not configured, skipping sync');
      return;
    }

    const tableId = 'strapi_tutorials';

    // Check if tutorial exists
    const existing = await this.queryRows(tableId, { strapi_id: tutorial.id });

    const row: ZeroDBRow = {
      strapi_id: tutorial.id,
      title: tutorial.title,
      slug: tutorial.slug,
      description: tutorial.description || '',
      content: tutorial.content || '',
      difficulty: tutorial.difficulty || 'beginner',
      duration: tutorial.duration || 30,
      published_at: tutorial.publishedAt || null,
      created_at: tutorial.createdAt || new Date().toISOString(),
      updated_at: tutorial.updatedAt || new Date().toISOString(),
      author: tutorial.author?.name || null,
      category: tutorial.category?.name || null,
      tags: tutorial.tags?.map(t => t.name) || [],
    };

    if (existing.total_count > 0) {
      // Update existing
      await this.updateRows(tableId, { strapi_id: tutorial.id }, row);
      console.log(`[ZeroDB] Updated tutorial: ${tutorial.slug}`);
    } else {
      // Insert new
      await this.insertRows(tableId, [row]);
      console.log(`[ZeroDB] Created tutorial: ${tutorial.slug}`);
    }

    // Update sync metadata
    await this.updateSyncMetadata('tutorial', tutorial.id);
  }

  /**
   * Delete a tutorial from ZeroDB
   */
  async deleteTutorial(strapiId: number): Promise<void> {
    if (!this.isConfigured()) {
      console.warn('[ZeroDB] Service not configured, skipping delete');
      return;
    }

    const tableId = 'strapi_tutorials';
    await this.deleteRows(tableId, { strapi_id: strapiId });
    console.log(`[ZeroDB] Deleted tutorial with strapi_id: ${strapiId}`);
  }

  // ==========================================
  // Event Operations
  // ==========================================

  /**
   * Sync an event to ZeroDB
   */
  async syncEvent(event: {
    id: number;
    title: string;
    slug: string;
    description?: string;
    short_description?: string;
    event_type?: string;
    start_date: string;
    end_date?: string;
    timezone?: string;
    is_virtual?: boolean;
    location?: string;
    venue_name?: string;
    city?: string;
    country?: string;
    virtual_url?: string;
    registration_url?: string;
    max_attendees?: number;
    current_attendees?: number;
    is_free?: boolean;
    price?: number;
    status?: string;
    publishedAt?: string;
    createdAt?: string;
    updatedAt?: string;
    organizer?: { name: string } | null;
    category?: { name: string } | null;
  }): Promise<void> {
    if (!this.isConfigured()) {
      console.warn('[ZeroDB] Service not configured, skipping sync');
      return;
    }

    const tableId = 'strapi_events';

    // Check if event exists
    const existing = await this.queryRows(tableId, { strapi_id: event.id });

    const row: ZeroDBRow = {
      strapi_id: event.id,
      title: event.title,
      slug: event.slug,
      description: event.description || '',
      short_description: event.short_description || '',
      event_type: event.event_type || 'meetup',
      start_date: event.start_date,
      end_date: event.end_date || null,
      timezone: event.timezone || 'UTC',
      is_virtual: event.is_virtual ?? true,
      location: event.location || '',
      venue_name: event.venue_name || '',
      city: event.city || '',
      country: event.country || '',
      virtual_url: event.virtual_url || '',
      registration_url: event.registration_url || '',
      max_attendees: event.max_attendees || null,
      current_attendees: event.current_attendees || 0,
      is_free: event.is_free ?? true,
      price: event.price || null,
      status: event.status || 'upcoming',
      published_at: event.publishedAt || null,
      created_at: event.createdAt || new Date().toISOString(),
      updated_at: event.updatedAt || new Date().toISOString(),
      organizer: event.organizer?.name || null,
      category: event.category?.name || null,
    };

    if (existing.total_count > 0) {
      // Update existing
      await this.updateRows(tableId, { strapi_id: event.id }, row);
      console.log(`[ZeroDB] Updated event: ${event.slug}`);
    } else {
      // Insert new
      await this.insertRows(tableId, [row]);
      console.log(`[ZeroDB] Created event: ${event.slug}`);
    }

    // Update sync metadata
    await this.updateSyncMetadata('event', event.id);
  }

  /**
   * Delete an event from ZeroDB
   */
  async deleteEvent(strapiId: number): Promise<void> {
    if (!this.isConfigured()) {
      console.warn('[ZeroDB] Service not configured, skipping delete');
      return;
    }

    const tableId = 'strapi_events';
    await this.deleteRows(tableId, { strapi_id: strapiId });
    console.log(`[ZeroDB] Deleted event with strapi_id: ${strapiId}`);
  }

  // ==========================================
  // Legacy Article Support (deprecated)
  // ==========================================

  /**
   * @deprecated Use syncBlogPost instead
   */
  async syncArticle(article: {
    id: number;
    title: string;
    slug: string;
    description?: string;
    publishedAt?: string;
    createdAt?: string;
    updatedAt?: string;
    author?: { name: string } | null;
    category?: { name: string } | null;
  }): Promise<void> {
    console.warn('[ZeroDB] syncArticle is deprecated, use syncBlogPost instead');
    return this.syncBlogPost({
      ...article,
      content: '',
      reading_time: 5,
      tags: null,
    });
  }

  /**
   * @deprecated Use deleteBlogPost instead
   */
  async deleteArticle(strapiId: number): Promise<void> {
    console.warn('[ZeroDB] deleteArticle is deprecated, use deleteBlogPost instead');
    return this.deleteBlogPost(strapiId);
  }

  // ==========================================
  // Sync Metadata
  // ==========================================

  /**
   * Update sync metadata for tracking
   */
  private async updateSyncMetadata(contentType: string, strapiId: number): Promise<void> {
    const tableId = 'strapi_content_sync';

    try {
      const existing = await this.queryRows(tableId, {
        content_type: contentType,
        strapi_id: strapiId,
      });

      const metadata: ZeroDBRow = {
        content_type: contentType,
        strapi_id: strapiId,
        last_synced: new Date().toISOString(),
        sync_status: 'synced',
      };

      if (existing.total_count > 0) {
        await this.updateRows(tableId, {
          content_type: contentType,
          strapi_id: strapiId,
        }, metadata);
      } else {
        await this.insertRows(tableId, [metadata]);
      }
    } catch (error) {
      console.error('[ZeroDB] Failed to update sync metadata:', error);
      // Don't throw - metadata sync failure shouldn't fail content sync
    }
  }
}

// Export singleton instance
const zeroDBService = new ZeroDBService();
export default zeroDBService;
