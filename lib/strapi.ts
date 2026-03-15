/**
 * Strapi/ZeroDB Client for Next.js Frontend
 *
 * This client fetches blog content from ZeroDB (synced from Strapi).
 * Architecture:
 * - Strapi manages content via SQLite (admin interface)
 * - Lifecycle hooks sync content to ZeroDB
 * - This client reads from ZeroDB for production performance
 */

// Blog Post type matching ZeroDB schema
export interface BlogPost {
  id: string
  strapi_id: number
  title: string
  slug: string
  excerpt: string
  content: string
  reading_time: number
  published_at: string | null
  created_at: string
  updated_at: string
  author: string | null
  category: string | null
  tags: string[]
}

// Tutorial type matching ZeroDB schema
export interface Tutorial {
  id: string
  strapi_id: number
  title: string
  slug: string
  description: string
  content: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  published_at: string | null
  created_at: string
  updated_at: string
  author: string | null
  category: string | null
  tags: string[]
}

// Event type matching ZeroDB schema
export interface Event {
  id: string
  strapi_id: number
  title: string
  slug: string
  description: string
  short_description: string
  event_type: string
  start_date: string
  end_date: string | null
  timezone: string
  is_virtual: boolean
  location: string
  venue_name: string
  city: string
  country: string
  virtual_url: string
  registration_url: string
  max_attendees: number | null
  current_attendees: number
  is_free: boolean
  price: number | null
  status: string
  published_at: string | null
  created_at: string
  updated_at: string
  organizer: string | null
  category: string | null
}

// Paper type matching ZeroDB schema
export interface Paper {
  id: string
  strapi_id: number
  title: string
  slug: string
  abstract: string
  content: string
  version: string
  publication_date: string | null
  pdf_url: string | null
  external_url: string | null
  github_path: string | null
  source: 'github-papers' | 'github-tosw' | 'manual'
  featured: boolean
  created_at: string
  updated_at: string
  author: string | null
  category: string | null
  tags: string[]
}

// Writing type matching ZeroDB schema
export interface Writing {
  id: string
  strapi_id: number
  title: string
  slug: string
  writing_type: 'poem' | 'essay' | 'story'
  excerpt: string
  content: string
  date_written: string | null
  word_count: number
  form: string | null  // for poems
  genre: string | null  // for stories
  theme: string | null
  first_line: string | null  // for poems
  source: 'manual' | 'migrated'
  featured: boolean
  created_at: string
  updated_at: string
  author: string | null
  tags: string[]
}

// TOSW Chapter type matching ZeroDB schema
export interface ToswChapter {
  id: string
  strapi_id: number
  title: string
  slug: string
  description: string
  content: string
  section: string
  section_order: number
  chapter_order: number
  github_path: string | null
  source: 'github-tosw' | 'manual'
  license: string
  external_url: string | null
  created_at: string
  updated_at: string
  category: string | null
  tags: string[]
}

interface ZeroDBConfig {
  apiUrl: string
  projectId: string
  username: string
  password: string
}

interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

interface QueryResult<T> {
  rows: T[]
  total_count: number
}

class StrapiClient {
  private config: ZeroDBConfig
  private accessToken: string | null = null
  private tokenExpiry: Date | null = null

  constructor() {
    this.config = {
      apiUrl: process.env.ZERODB_API_URL || 'https://api.ainative.studio',
      projectId: process.env.ZERODB_PROJECT_ID || '',
      username: process.env.ZERODB_USERNAME || '',
      password: process.env.ZERODB_PASSWORD || '',
    }
  }

  /**
   * Check if the client is properly configured
   */
  isConfigured(): boolean {
    return !!(
      this.config.projectId &&
      this.config.username &&
      this.config.password
    )
  }

  /**
   * Authenticate with ZeroDB and get access token
   */
  private async authenticate(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken
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
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`ZeroDB authentication failed: ${error}`)
    }

    const data: TokenResponse = await response.json()
    this.accessToken = data.access_token
    this.tokenExpiry = new Date(Date.now() + 25 * 60 * 1000) // 25 minutes

    return this.accessToken
  }

  /**
   * Make authenticated request to ZeroDB API
   */
  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    body?: unknown
  ): Promise<T> {
    const token = await this.authenticate()

    const response = await fetch(`${this.config.apiUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      // Cache for 60 seconds in production, no cache in dev
      next: { revalidate: process.env.NODE_ENV === 'production' ? 60 : 0 },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`ZeroDB API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  // ==========================================
  // Blog Post Operations
  // ==========================================

  /**
   * Get all published blog posts
   */
  async getBlogPosts(options?: {
    limit?: number
    offset?: number
    category?: string
    tag?: string
  }): Promise<{ posts: BlogPost[]; total: number }> {
    if (!this.isConfigured()) {
      console.warn('[Strapi] Client not configured, returning empty results')
      return { posts: [], total: 0 }
    }

    const filters: Record<string, unknown> = {
      published_at: { $ne: null },
    }

    if (options?.category) {
      filters.category = options.category
    }

    if (options?.tag) {
      filters.tags = { $contains: options.tag }
    }

    try {
      const result = await this.request<QueryResult<BlogPost>>(
        `/v1/projects/${this.config.projectId}/tables/strapi_blog_posts/rows/query`,
        'POST',
        {
          filter: filters,
          limit: options?.limit || 20,
          offset: options?.offset || 0,
          sort: { published_at: -1 },
        }
      )

      return {
        posts: result.rows,
        total: result.total_count,
      }
    } catch (error) {
      console.error('[Strapi] Failed to fetch blog posts:', error)
      return { posts: [], total: 0 }
    }
  }

  /**
   * Get a single blog post by slug
   */
  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    if (!this.isConfigured()) {
      console.warn('[Strapi] Client not configured')
      return null
    }

    try {
      const result = await this.request<QueryResult<BlogPost>>(
        `/v1/projects/${this.config.projectId}/tables/strapi_blog_posts/rows/query`,
        'POST',
        {
          filter: { slug, published_at: { $ne: null } },
          limit: 1,
        }
      )

      return result.rows[0] || null
    } catch (error) {
      console.error('[Strapi] Failed to fetch blog post:', error)
      return null
    }
  }

  /**
   * Get all unique categories from blog posts
   */
  async getBlogCategories(): Promise<string[]> {
    const { posts } = await this.getBlogPosts({ limit: 100 })
    const categories = new Set<string>()
    posts.forEach(post => {
      if (post.category) categories.add(post.category)
    })
    return Array.from(categories).sort()
  }

  /**
   * Get all unique tags from blog posts
   */
  async getBlogTags(): Promise<string[]> {
    const { posts } = await this.getBlogPosts({ limit: 100 })
    const tags = new Set<string>()
    posts.forEach(post => {
      post.tags?.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }

  // ==========================================
  // Tutorial Operations
  // ==========================================

  /**
   * Get all published tutorials
   */
  async getTutorials(options?: {
    limit?: number
    offset?: number
    difficulty?: string
    category?: string
  }): Promise<{ tutorials: Tutorial[]; total: number }> {
    if (!this.isConfigured()) {
      return { tutorials: [], total: 0 }
    }

    const filters: Record<string, unknown> = {
      published_at: { $ne: null },
    }

    if (options?.difficulty) {
      filters.difficulty = options.difficulty
    }

    if (options?.category) {
      filters.category = options.category
    }

    try {
      const result = await this.request<QueryResult<Tutorial>>(
        `/v1/projects/${this.config.projectId}/tables/strapi_tutorials/rows/query`,
        'POST',
        {
          filter: filters,
          limit: options?.limit || 20,
          offset: options?.offset || 0,
          sort: { published_at: -1 },
        }
      )

      return {
        tutorials: result.rows,
        total: result.total_count,
      }
    } catch (error) {
      console.error('[Strapi] Failed to fetch tutorials:', error)
      return { tutorials: [], total: 0 }
    }
  }

  /**
   * Get a single tutorial by slug
   */
  async getTutorialBySlug(slug: string): Promise<Tutorial | null> {
    if (!this.isConfigured()) {
      return null
    }

    try {
      const result = await this.request<QueryResult<Tutorial>>(
        `/v1/projects/${this.config.projectId}/tables/strapi_tutorials/rows/query`,
        'POST',
        {
          filter: { slug, published_at: { $ne: null } },
          limit: 1,
        }
      )

      return result.rows[0] || null
    } catch (error) {
      console.error('[Strapi] Failed to fetch tutorial:', error)
      return null
    }
  }

  // ==========================================
  // Event Operations
  // ==========================================

  /**
   * Get upcoming events
   */
  async getEvents(options?: {
    limit?: number
    offset?: number
    status?: string
    isVirtual?: boolean
  }): Promise<{ events: Event[]; total: number }> {
    if (!this.isConfigured()) {
      return { events: [], total: 0 }
    }

    const filters: Record<string, unknown> = {
      published_at: { $ne: null },
    }

    if (options?.status) {
      filters.status = options.status
    }

    if (options?.isVirtual !== undefined) {
      filters.is_virtual = options.isVirtual
    }

    try {
      const result = await this.request<QueryResult<Event>>(
        `/v1/projects/${this.config.projectId}/tables/strapi_events/rows/query`,
        'POST',
        {
          filter: filters,
          limit: options?.limit || 20,
          offset: options?.offset || 0,
          sort: { start_date: 1 },
        }
      )

      return {
        events: result.rows,
        total: result.total_count,
      }
    } catch (error) {
      console.error('[Strapi] Failed to fetch events:', error)
      return { events: [], total: 0 }
    }
  }

  /**
   * Get a single event by slug
   */
  async getEventBySlug(slug: string): Promise<Event | null> {
    if (!this.isConfigured()) {
      return null
    }

    try {
      const result = await this.request<QueryResult<Event>>(
        `/v1/projects/${this.config.projectId}/tables/strapi_events/rows/query`,
        'POST',
        {
          filter: { slug, published_at: { $ne: null } },
          limit: 1,
        }
      )

      return result.rows[0] || null
    } catch (error) {
      console.error('[Strapi] Failed to fetch event:', error)
      return null
    }
  }

  // ==========================================
  // Paper Operations
  // ==========================================

  /**
   * Get all papers with optional filtering
   */
  async getPapers(options?: {
    limit?: number
    offset?: number
    featured?: boolean
  }): Promise<{ papers: Paper[]; total: number }> {
    if (!this.isConfigured()) {
      console.warn('[Strapi] Client not configured, returning empty results')
      return { papers: [], total: 0 }
    }

    const filters: Record<string, unknown> = {}

    if (options?.featured !== undefined) {
      filters.featured = options.featured
    }

    try {
      const result = await this.request<QueryResult<Paper>>(
        `/v1/projects/${this.config.projectId}/tables/strapi_papers/rows/query`,
        'POST',
        {
          filter: filters,
          limit: options?.limit || 20,
          offset: options?.offset || 0,
          sort: { publication_date: -1, created_at: -1 },
        }
      )

      return {
        papers: result.rows,
        total: result.total_count,
      }
    } catch (error) {
      console.error('[Strapi] Failed to fetch papers:', error)
      return { papers: [], total: 0 }
    }
  }

  /**
   * Get a single paper by slug
   */
  async getPaperBySlug(slug: string): Promise<Paper | null> {
    if (!this.isConfigured()) {
      console.warn('[Strapi] Client not configured')
      return null
    }

    try {
      const result = await this.request<QueryResult<Paper>>(
        `/v1/projects/${this.config.projectId}/tables/strapi_papers/rows/query`,
        'POST',
        {
          filter: { slug },
          limit: 1,
        }
      )

      return result.rows[0] || null
    } catch (error) {
      console.error('[Strapi] Failed to fetch paper:', error)
      return null
    }
  }

  // ==========================================
  // Writing Operations
  // ==========================================

  /**
   * Get all writings with optional filtering
   */
  async getWritings(options?: {
    limit?: number
    offset?: number
    type?: 'poem' | 'essay' | 'story'
  }): Promise<{ writings: Writing[]; total: number }> {
    if (!this.isConfigured()) {
      console.warn('[Strapi] Client not configured, returning empty results')
      return { writings: [], total: 0 }
    }

    const filters: Record<string, unknown> = {}

    if (options?.type) {
      filters.writing_type = options.type
    }

    try {
      const result = await this.request<QueryResult<Writing>>(
        `/v1/projects/${this.config.projectId}/tables/strapi_writings/rows/query`,
        'POST',
        {
          filter: filters,
          limit: options?.limit || 20,
          offset: options?.offset || 0,
          sort: { date_written: -1, created_at: -1 },
        }
      )

      return {
        writings: result.rows,
        total: result.total_count,
      }
    } catch (error) {
      console.error('[Strapi] Failed to fetch writings:', error)
      return { writings: [], total: 0 }
    }
  }

  /**
   * Get a single writing by slug
   */
  async getWritingBySlug(slug: string): Promise<Writing | null> {
    if (!this.isConfigured()) {
      console.warn('[Strapi] Client not configured')
      return null
    }

    try {
      const result = await this.request<QueryResult<Writing>>(
        `/v1/projects/${this.config.projectId}/tables/strapi_writings/rows/query`,
        'POST',
        {
          filter: { slug },
          limit: 1,
        }
      )

      return result.rows[0] || null
    } catch (error) {
      console.error('[Strapi] Failed to fetch writing:', error)
      return null
    }
  }

  /**
   * Get all poems
   */
  async getPoems(options?: { limit?: number }): Promise<Writing[]> {
    const { writings } = await this.getWritings({
      limit: options?.limit,
      type: 'poem',
    })
    return writings
  }

  /**
   * Get all essays
   */
  async getEssays(options?: { limit?: number }): Promise<Writing[]> {
    const { writings } = await this.getWritings({
      limit: options?.limit,
      type: 'essay',
    })
    return writings
  }

  /**
   * Get all stories
   */
  async getStories(options?: { limit?: number }): Promise<Writing[]> {
    const { writings } = await this.getWritings({
      limit: options?.limit,
      type: 'story',
    })
    return writings
  }

  // ==========================================
  // TOSW Chapter Operations
  // ==========================================

  /**
   * Get all TOSW chapters with optional filtering
   */
  async getToswChapters(options?: {
    limit?: number
    section?: string
  }): Promise<{ chapters: ToswChapter[]; total: number }> {
    if (!this.isConfigured()) {
      console.warn('[Strapi] Client not configured, returning empty results')
      return { chapters: [], total: 0 }
    }

    const filters: Record<string, unknown> = {}

    if (options?.section) {
      filters.section = options.section
    }

    try {
      const result = await this.request<QueryResult<ToswChapter>>(
        `/v1/projects/${this.config.projectId}/tables/strapi_tosw_chapters/rows/query`,
        'POST',
        {
          filter: filters,
          limit: options?.limit || 100,
          sort: { section_order: 1, chapter_order: 1 },
        }
      )

      return {
        chapters: result.rows,
        total: result.total_count,
      }
    } catch (error) {
      console.error('[Strapi] Failed to fetch TOSW chapters:', error)
      return { chapters: [], total: 0 }
    }
  }

  /**
   * Get a single TOSW chapter by slug
   */
  async getToswChapterBySlug(slug: string): Promise<ToswChapter | null> {
    if (!this.isConfigured()) {
      console.warn('[Strapi] Client not configured')
      return null
    }

    try {
      const result = await this.request<QueryResult<ToswChapter>>(
        `/v1/projects/${this.config.projectId}/tables/strapi_tosw_chapters/rows/query`,
        'POST',
        {
          filter: { slug },
          limit: 1,
        }
      )

      return result.rows[0] || null
    } catch (error) {
      console.error('[Strapi] Failed to fetch TOSW chapter:', error)
      return null
    }
  }

  /**
   * Get all unique sections from TOSW chapters
   */
  async getToswSections(): Promise<string[]> {
    const { chapters } = await this.getToswChapters({ limit: 1000 })
    const sections = new Set<string>()
    chapters.forEach(chapter => {
      if (chapter.section) sections.add(chapter.section)
    })
    return Array.from(sections).sort()
  }
}

// Export singleton instance
export const strapiClient = new StrapiClient()

// Export types
export type { ZeroDBConfig, QueryResult }
