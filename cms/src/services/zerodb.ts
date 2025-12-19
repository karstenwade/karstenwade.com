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

// ==========================================
// Embeddings API Types
// ==========================================

interface EmbeddingsResponse {
  embeddings: number[][];
  model: string;
  dimensions: number;
  count: number;
  processing_time_ms: number;
}

interface EmbedAndStoreResponse {
  success: boolean;
  vectors_stored: number;
  embeddings_generated: number;
  model: string;
  dimensions: number;
  namespace: string;
  processing_time_ms: number;
}

interface EmbedAndStoreDocument {
  id: string;
  text: string;
  metadata?: Record<string, unknown>;
}

interface SearchResult {
  id: string;
  score: number;
  text: string;
  metadata?: Record<string, unknown>;
}

interface SemanticSearchResponse {
  results: SearchResult[];
  query: string;
  total_results: number;
  model: string;
  processing_time_ms: number;
}

interface SemanticSearchOptions {
  namespace: string;
  top_k?: number;
  similarity_threshold?: number;
  filter?: Record<string, unknown>;
  include_metadata?: boolean;
}

// ==========================================
// Analytics Event Types
// ==========================================

interface AnalyticsEventData {
  user_id?: string;
  content_type?: string;
  content_id?: string | number;
  action?: string;
  metadata?: Record<string, unknown>;
}

interface AnalyticsEventResponse {
  id: string;
  event_type: string;
  timestamp: string;
  success: boolean;
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

  // ==========================================
  // Embeddings API
  // ==========================================

  /**
   * Check if embeddings feature is enabled
   */
  isEmbeddingsEnabled(): boolean {
    return process.env.ZERODB_EMBEDDINGS_ENABLED === 'true';
  }

  /**
   * Generate embeddings for an array of texts
   * Uses BAAI/bge-small-en-v1.5 model (384 dimensions)
   *
   * @param texts - Array of texts to generate embeddings for (max 100)
   * @returns Array of embeddings (384 dimensions each)
   */
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    if (!this.isConfigured()) {
      throw new Error('[ZeroDB] Service not configured');
    }

    if (texts.length > 100) {
      throw new Error('[ZeroDB] Maximum 100 texts per request');
    }

    const response = await this.request<EmbeddingsResponse>(
      `/v1/public/${this.config.projectId}/embeddings/generate`,
      'POST',
      {
        texts,
        model: 'BAAI/bge-small-en-v1.5', // 384 dimensions
      }
    );

    console.log(`[ZeroDB] Generated ${response.count} embeddings (${response.dimensions} dimensions) in ${response.processing_time_ms}ms`);
    return response.embeddings;
  }

  /**
   * Embed and store content in ZeroDB vector database
   * Generates embeddings and stores them in a single operation
   *
   * @param documents - Array of documents with id, text, and optional metadata
   * @param namespace - Vector namespace for organization
   * @param upsert - Update if exists (default: true)
   */
  async embedAndStoreContent(
    documents: EmbedAndStoreDocument[],
    namespace: string,
    upsert = true
  ): Promise<EmbedAndStoreResponse> {
    if (!this.isConfigured()) {
      throw new Error('[ZeroDB] Service not configured');
    }

    if (!this.isEmbeddingsEnabled()) {
      console.warn('[ZeroDB] Embeddings not enabled, skipping embed-and-store');
      return {
        success: false,
        vectors_stored: 0,
        embeddings_generated: 0,
        model: 'BAAI/bge-small-en-v1.5',
        dimensions: 384,
        namespace,
        processing_time_ms: 0,
      };
    }

    const response = await this.request<EmbedAndStoreResponse>(
      `/v1/public/${this.config.projectId}/embeddings/embed-and-store`,
      'POST',
      {
        documents,
        namespace,
        upsert,
      }
    );

    console.log(`[ZeroDB] Stored ${response.vectors_stored} vectors in namespace '${namespace}' (${response.processing_time_ms}ms)`);
    return response;
  }

  /**
   * Perform semantic search using natural language query
   *
   * @param query - Natural language search query
   * @param options - Search options (namespace, top_k, threshold, filters)
   * @returns Array of search results with scores
   */
  async semanticSearch(
    query: string,
    options: SemanticSearchOptions
  ): Promise<SearchResult[]> {
    if (!this.isConfigured()) {
      throw new Error('[ZeroDB] Service not configured');
    }

    const response = await this.request<SemanticSearchResponse>(
      `/v1/public/${this.config.projectId}/embeddings/search`,
      'POST',
      {
        query,
        top_k: options.top_k ?? 10,
        namespace: options.namespace,
        filter: options.filter,
        similarity_threshold: options.similarity_threshold ?? 0.7,
        include_metadata: options.include_metadata ?? true,
      }
    );

    console.log(`[ZeroDB] Semantic search found ${response.total_results} results in ${response.processing_time_ms}ms`);
    return response.results;
  }

  // ==========================================
  // Content Embedding Helpers
  // ==========================================

  /**
   * Generate embedding text for a blog post
   * Combines title, description, and content for better semantic search
   */
  private generateBlogPostEmbeddingText(post: {
    title: string;
    description?: string;
    content?: string;
    tags?: Array<{ name: string }> | null;
  }): string {
    const parts = [post.title];
    if (post.description) parts.push(post.description);
    if (post.content) parts.push(post.content);
    if (post.tags?.length) parts.push(`Tags: ${post.tags.map(t => t.name).join(', ')}`);
    return parts.join('. ');
  }

  /**
   * Generate embedding text for a tutorial
   * Includes difficulty level for better search relevance
   */
  private generateTutorialEmbeddingText(tutorial: {
    title: string;
    description?: string;
    content?: string;
    difficulty?: string;
    tags?: Array<{ name: string }> | null;
  }): string {
    const parts = [tutorial.title];
    if (tutorial.description) parts.push(tutorial.description);
    if (tutorial.difficulty) parts.push(`Difficulty: ${tutorial.difficulty}`);
    if (tutorial.content) parts.push(tutorial.content);
    if (tutorial.tags?.length) parts.push(`Tags: ${tutorial.tags.map(t => t.name).join(', ')}`);
    return parts.join('. ');
  }

  /**
   * Sync blog post embeddings to ZeroDB
   * Called from syncBlogPost lifecycle hook
   */
  async syncBlogPostEmbeddings(post: {
    id: number;
    title: string;
    slug: string;
    description?: string;
    content?: string;
    tags?: Array<{ name: string }> | null;
    author?: { name: string } | null;
    category?: { name: string } | null;
  }): Promise<void> {
    if (!this.isEmbeddingsEnabled()) {
      return;
    }

    try {
      const embeddingText = this.generateBlogPostEmbeddingText(post);

      await this.embedAndStoreContent(
        [{
          id: `blog_${post.id}`,
          text: embeddingText,
          metadata: {
            content_type: 'blog-post',
            strapi_id: post.id,
            slug: post.slug,
            title: post.title,
            author: post.author?.name || null,
            category: post.category?.name || null,
            tags: post.tags?.map(t => t.name) || [],
          },
        }],
        'blog_embeddings'
      );

      console.log(`[ZeroDB] Synced embeddings for blog post: ${post.slug}`);
    } catch (error) {
      console.error(`[ZeroDB] Failed to sync blog post embeddings:`, error);
      // Don't throw - embedding sync failure shouldn't fail content sync
    }
  }

  /**
   * Sync tutorial embeddings to ZeroDB
   * Called from syncTutorial lifecycle hook
   */
  async syncTutorialEmbeddings(tutorial: {
    id: number;
    title: string;
    slug: string;
    description?: string;
    content?: string;
    difficulty?: string;
    tags?: Array<{ name: string }> | null;
    author?: { name: string } | null;
    category?: { name: string } | null;
  }): Promise<void> {
    if (!this.isEmbeddingsEnabled()) {
      return;
    }

    try {
      const embeddingText = this.generateTutorialEmbeddingText(tutorial);

      await this.embedAndStoreContent(
        [{
          id: `tutorial_${tutorial.id}`,
          text: embeddingText,
          metadata: {
            content_type: 'tutorial',
            strapi_id: tutorial.id,
            slug: tutorial.slug,
            title: tutorial.title,
            difficulty: tutorial.difficulty || 'beginner',
            author: tutorial.author?.name || null,
            category: tutorial.category?.name || null,
            tags: tutorial.tags?.map(t => t.name) || [],
          },
        }],
        'tutorial_embeddings'
      );

      console.log(`[ZeroDB] Synced embeddings for tutorial: ${tutorial.slug}`);
    } catch (error) {
      console.error(`[ZeroDB] Failed to sync tutorial embeddings:`, error);
      // Don't throw - embedding sync failure shouldn't fail content sync
    }
  }

  // ==========================================
  // Analytics Event Tracking
  // ==========================================

  /**
   * Check if event tracking is enabled
   */
  isEventsEnabled(): boolean {
    return process.env.ZERODB_EVENTS_ENABLED === 'true';
  }

  /**
   * Track an analytics event in ZeroDB
   *
   * @param eventType - Type of event (content_sync, content_view, search_query, etc.)
   * @param data - Event data including user_id, content_type, content_id, action, metadata
   */
  async trackEvent(eventType: string, data: AnalyticsEventData): Promise<void> {
    if (!this.isConfigured()) {
      console.warn('[ZeroDB] Service not configured, skipping event tracking');
      return;
    }

    if (!this.isEventsEnabled()) {
      return;
    }

    try {
      const response = await this.request<AnalyticsEventResponse>(
        `/v1/public/${this.config.projectId}/database/events`,
        'POST',
        {
          event_type: eventType,
          data: {
            ...data,
            timestamp: new Date().toISOString(),
          },
        }
      );

      console.log(`[ZeroDB] Tracked event '${eventType}': ${response.id}`);
    } catch (error) {
      console.error(`[ZeroDB] Failed to track event '${eventType}':`, error);
      // Don't throw - event tracking failure shouldn't fail main operation
    }
  }

  /**
   * Track content sync event
   */
  async trackContentSync(contentType: string, contentId: number, action: 'created' | 'updated' | 'deleted'): Promise<void> {
    await this.trackEvent('content_sync', {
      content_type: contentType,
      content_id: contentId,
      action,
      metadata: {
        synced_at: new Date().toISOString(),
      },
    });
  }
}

// Export singleton instance
const zeroDBService = new ZeroDBService();
export default zeroDBService;

// Export types for use in other files
export type {
  SearchResult,
  SemanticSearchOptions,
  EmbedAndStoreDocument,
  AnalyticsEventData,
};
