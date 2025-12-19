# Gap Analysis: ainative-strapi-mcp-server vs karstenwade.com Strapi

**Date:** 2025-12-16
**Package Analyzed:** `ainative-strapi-mcp-server@1.0.0`
**Target CMS:** karstenwade.com Strapi v5

## Executive Summary

The `ainative-strapi-mcp-server` NPM package provides 18 MCP (Model Context Protocol) operations for AI assistants to manage Strapi CMS content. This analysis identifies gaps between what the MCP server expects and what karstenwade.com's Strapi instance currently provides.

## Content Types Comparison

| MCP Server Expects | karstenwade.com Has | Status |
|-------------------|---------------------|--------|
| `api::blog-post.blog-post` | `api::article.article` | **Rename/Remap needed** |
| `api::tutorial.tutorial` | - | **Missing** |
| `api::event.event` | - | **Missing** |
| `api::tag.tag` | - | **Missing** |
| `api::author.author` | `api::author.author` | Exists |
| `api::category.category` | `api::category.category` | Exists |

## MCP Server Operations

### Blog Post Operations (8 total)
1. `strapi_create_blog_post` - Create a new blog post
2. `strapi_list_blog_posts` - List blog posts with advanced filtering
3. `strapi_get_blog_post` - Get a specific blog post by document ID
4. `strapi_update_blog_post` - Update an existing blog post
5. `strapi_publish_blog_post` - Publish or unpublish a blog post
6. `strapi_list_authors` - List all authors
7. `strapi_list_categories` - List all blog categories
8. `strapi_list_tags` - List all blog tags

### Tutorial Operations (5 total)
1. `strapi_create_tutorial` - Create a step-by-step tutorial
2. `strapi_list_tutorials` - List tutorials with filtering
3. `strapi_get_tutorial` - Get a specific tutorial by document ID
4. `strapi_update_tutorial` - Update an existing tutorial
5. `strapi_publish_tutorial` - Publish or unpublish a tutorial

### Event Operations (5 total)
1. `strapi_create_event` - Create a new event
2. `strapi_list_events` - List events with filtering
3. `strapi_get_event` - Get a specific event by document ID
4. `strapi_update_event` - Update an existing event
5. `strapi_publish_event` - Publish or unpublish an event

## Detailed Field Gap Analysis

### 1. Blog Post (`api::blog-post.blog-post`)

**MCP Server expects `blog-post`, karstenwade.com has `article`**

| Field | MCP Server | karstenwade.com article | Gap |
|-------|-----------|------------------------|-----|
| title | Required (string) | title | None |
| slug | Required (UID) | slug | None |
| content | Required (markdown/richtext) | uses `blocks` (dynamic zone) | **Need content field** |
| excerpt | Optional (text) | description | Map `description` to `excerpt` |
| reading_time | Optional (integer) | missing | **Add field** |
| published_date | Optional (datetime) | publishedAt (built-in) | None |
| author | Relation (author) | author relation | None |
| category | Relation (category) | category relation | None |
| tags | Relation (tag, many) | missing | **Add relation** |
| cover | Media | cover | None |

**Actions Required:**
1. Rename `article` content type to `blog-post`
2. Add `content` field (richtext/markdown)
3. Add `reading_time` field (integer)
4. Add `tags` relation (many-to-many with tag)

### 2. Tutorial (`api::tutorial.tutorial`)

**Completely missing - needs to be created**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | String | Yes | Tutorial title |
| slug | UID | Yes | URL-friendly identifier |
| content | Richtext | Yes | Full tutorial content (markdown) |
| description | Text | No | Short description/summary |
| difficulty | Enum | No | beginner, intermediate, advanced |
| duration | Integer | No | Estimated duration in minutes |
| author | Relation | No | Relation to author |
| category | Relation | No | Relation to category |
| tags | Relation | No | Many-to-many with tags |

### 3. Event (`api::event.event`)

**Completely missing - needs to be created**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | String | Yes | Event title |
| slug | UID | Yes | URL-friendly identifier |
| description | Text | No | Event description |
| event_type | Enum | No | webinar, workshop, meetup, conference |
| start_date | DateTime | Yes | Event start date/time |
| end_date | DateTime | No | Event end date/time |
| location | String | No | Physical or virtual location |
| registration_url | String | No | URL for registration |
| max_attendees | Integer | No | Maximum capacity |
| is_virtual | Boolean | No | Whether event is online |
| timezone | String | No | Event timezone |

**Note:** Event type designed as foundation for open-source lu.ma alternative.

### 4. Tag (`api::tag.tag`)

**Completely missing - needs to be created**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Tag name (unique) |
| slug | UID | Yes | URL-friendly identifier |
| description | Text | No | Tag description |
| blog_posts | Relation | No | Many-to-many with blog-posts |
| tutorials | Relation | No | Many-to-many with tutorials |

### 5. Author (`api::author.author`)

**Exists - needs verification**

| Field | MCP Expects | karstenwade.com Has | Status |
|-------|-------------|---------------------|--------|
| name | String | name | OK |
| email | String | email | OK |
| avatar | Media | avatar | OK |
| bio | Text | - | May need to add |
| articles | Relation | articles | OK |

### 6. Category (`api::category.category`)

**Exists - needs verification**

| Field | MCP Expects | karstenwade.com Has | Status |
|-------|-------------|---------------------|--------|
| name | String | name | OK |
| slug | UID | slug | OK |
| description | Text | description | OK |
| articles | Relation | articles | OK |

## Implementation Plan

### Phase 1: Core Content Types
1. [x] Create `tag` content type
2. [x] Rename `article` to `blog-post`
3. [x] Add missing fields to `blog-post` (content, reading_time, tags)

### Phase 2: Extended Content Types
4. [x] Create `tutorial` content type
5. [x] Create `event` content type

### Phase 3: ZeroDB Integration
6. [ ] Update lifecycle hooks for new content types
7. [ ] Create ZeroDB tables for tutorials and events
8. [ ] Update sync metadata tracking

### Phase 4: Frontend Integration
9. [ ] Update Next.js to consume new content types
10. [ ] Create tutorial listing/detail pages
11. [ ] Create event listing/detail pages

## API Endpoint Mapping

The MCP server uses Strapi's Content Manager admin API:

```
POST /content-manager/collection-types/api::blog-post.blog-post
GET  /content-manager/collection-types/api::blog-post.blog-post
GET  /content-manager/collection-types/api::blog-post.blog-post/:documentId
PUT  /content-manager/collection-types/api::blog-post.blog-post/:documentId
POST /content-manager/collection-types/api::blog-post.blog-post/:documentId/actions/publish
POST /content-manager/collection-types/api::blog-post.blog-post/:documentId/actions/unpublish
```

## Environment Configuration

The MCP server requires these environment variables:

```bash
STRAPI_URL=https://your-strapi-instance.com
STRAPI_ADMIN_EMAIL=admin@example.com
STRAPI_ADMIN_PASSWORD=your-secure-password
```

## Testing Checklist

After implementation, verify:

- [ ] `strapi_create_blog_post` creates posts successfully
- [ ] `strapi_list_blog_posts` returns filtered results
- [ ] `strapi_publish_blog_post` toggles publish state
- [ ] `strapi_create_tutorial` creates tutorials with difficulty levels
- [ ] `strapi_create_event` creates events with all event types
- [ ] `strapi_list_tags` returns all tags
- [ ] Author and category relations work correctly
- [ ] ZeroDB sync triggers on all CRUD operations

## References

- [ainative-strapi-mcp-server README](./cms/node_modules/ainative-strapi-mcp-server/README.md)
- [Strapi v5 Content API](https://docs.strapi.io/dev-docs/api/content-api)
- [Model Context Protocol](https://modelcontextprotocol.io/)
