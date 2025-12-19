/**
 * ZeroDB Client for Next.js Frontend
 *
 * Provides semantic search capabilities for blog posts and tutorials
 * using ZeroDB's Embeddings API.
 *
 * Usage:
 *   import { searchBlogPosts, searchTutorials, getRelatedContent } from '@/lib/zerodb-client';
 *
 *   // Search blog posts
 *   const results = await searchBlogPosts('machine learning basics');
 *
 *   // Get related tutorials
 *   const related = await getRelatedContent('tutorial', 'intro-to-react', 3);
 */

// ==========================================
// Types
// ==========================================

export interface SearchResult {
  id: string;
  score: number;
  text: string;
  metadata: {
    content_type: string;
    strapi_id: number;
    slug: string;
    title: string;
    author?: string | null;
    category?: string | null;
    tags?: string[];
    difficulty?: string;
  };
}

export interface SearchOptions {
  limit?: number;
  threshold?: number;
  category?: string;
  tags?: string[];
}

interface SemanticSearchResponse {
  results: SearchResult[];
  query: string;
  total_results: number;
  model: string;
  processing_time_ms: number;
}

// ==========================================
// Configuration
// ==========================================

const ZERODB_API_URL = process.env.NEXT_PUBLIC_ZERODB_API_URL || 'https://api.ainative.studio';
const ZERODB_PROJECT_ID = process.env.NEXT_PUBLIC_ZERODB_PROJECT_ID || '';
const ZERODB_API_KEY = process.env.ZERODB_API_KEY || '';

/**
 * Check if ZeroDB search is configured
 */
export function isSearchConfigured(): boolean {
  return !!(ZERODB_PROJECT_ID && ZERODB_API_KEY);
}

// ==========================================
// API Client
// ==========================================

/**
 * Make authenticated request to ZeroDB API
 */
async function zerodbRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  body?: unknown
): Promise<T> {
  if (!isSearchConfigured()) {
    throw new Error('ZeroDB search not configured. Set ZERODB_PROJECT_ID and ZERODB_API_KEY.');
  }

  const response = await fetch(`${ZERODB_API_URL}${endpoint}`, {
    method,
    headers: {
      'X-API-Key': ZERODB_API_KEY,
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

// ==========================================
// Semantic Search Functions
// ==========================================

/**
 * Search blog posts using natural language query
 *
 * @param query - Natural language search query
 * @param options - Search options (limit, threshold, category, tags)
 * @returns Array of matching blog posts with similarity scores
 *
 * @example
 * const posts = await searchBlogPosts('open source community building');
 */
export async function searchBlogPosts(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResult[]> {
  const { limit = 10, threshold = 0.7, category, tags } = options;

  // Build metadata filter
  const filter: Record<string, unknown> = { content_type: 'blog-post' };
  if (category) filter.category = category;
  if (tags?.length) filter.tags = { $in: tags };

  const response = await zerodbRequest<SemanticSearchResponse>(
    `/v1/public/${ZERODB_PROJECT_ID}/embeddings/search`,
    'POST',
    {
      query,
      top_k: limit,
      namespace: 'blog_embeddings',
      filter,
      similarity_threshold: threshold,
      include_metadata: true,
    }
  );

  return response.results;
}

/**
 * Search tutorials using natural language query
 *
 * @param query - Natural language search query
 * @param options - Search options (limit, threshold, category, tags)
 * @returns Array of matching tutorials with similarity scores
 *
 * @example
 * const tutorials = await searchTutorials('getting started with React');
 */
export async function searchTutorials(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResult[]> {
  const { limit = 10, threshold = 0.7, category, tags } = options;

  // Build metadata filter
  const filter: Record<string, unknown> = { content_type: 'tutorial' };
  if (category) filter.category = category;
  if (tags?.length) filter.tags = { $in: tags };

  const response = await zerodbRequest<SemanticSearchResponse>(
    `/v1/public/${ZERODB_PROJECT_ID}/embeddings/search`,
    'POST',
    {
      query,
      top_k: limit,
      namespace: 'tutorial_embeddings',
      filter,
      similarity_threshold: threshold,
      include_metadata: true,
    }
  );

  return response.results;
}

/**
 * Search all content (blog posts and tutorials) using natural language query
 *
 * @param query - Natural language search query
 * @param options - Search options (limit, threshold)
 * @returns Array of matching content with similarity scores
 *
 * @example
 * const results = await searchAllContent('developer experience');
 */
export async function searchAllContent(
  query: string,
  options: SearchOptions = {}
): Promise<{ blogPosts: SearchResult[]; tutorials: SearchResult[] }> {
  const [blogPosts, tutorials] = await Promise.all([
    searchBlogPosts(query, options),
    searchTutorials(query, options),
  ]);

  return { blogPosts, tutorials };
}

/**
 * Get related content based on an existing piece of content
 *
 * Uses the content's title and description to find semantically similar items.
 *
 * @param contentType - Type of content ('blog-post' or 'tutorial')
 * @param title - Title of the current content
 * @param description - Description/excerpt of the current content
 * @param limit - Maximum number of related items to return
 * @returns Array of related content with similarity scores
 *
 * @example
 * const related = await getRelatedContent('blog-post', 'Building Open Source Communities', 'How to...', 3);
 */
export async function getRelatedContent(
  contentType: 'blog-post' | 'tutorial',
  title: string,
  description: string = '',
  limit: number = 5
): Promise<SearchResult[]> {
  // Use title and description as the search query
  const query = `${title}. ${description}`.trim();

  const namespace = contentType === 'blog-post' ? 'blog_embeddings' : 'tutorial_embeddings';

  const response = await zerodbRequest<SemanticSearchResponse>(
    `/v1/public/${ZERODB_PROJECT_ID}/embeddings/search`,
    'POST',
    {
      query,
      top_k: limit + 1, // Get one extra to filter out current content
      namespace,
      similarity_threshold: 0.6, // Lower threshold for related content
      include_metadata: true,
    }
  );

  // Filter out the current content (it would have the highest score)
  return response.results
    .filter(result => result.metadata.title !== title)
    .slice(0, limit);
}

// ==========================================
// Utility Functions
// ==========================================

/**
 * Format search results for display
 *
 * @param results - Array of search results
 * @returns Formatted results with percentage scores
 */
export function formatSearchResults(results: SearchResult[]): {
  id: string;
  slug: string;
  title: string;
  relevance: string;
  category?: string;
  tags?: string[];
}[] {
  return results.map(result => ({
    id: result.id,
    slug: result.metadata.slug,
    title: result.metadata.title,
    relevance: `${Math.round(result.score * 100)}%`,
    category: result.metadata.category || undefined,
    tags: result.metadata.tags,
  }));
}
