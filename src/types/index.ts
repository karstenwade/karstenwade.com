/**
 * Type definitions for karstenwade.com
 */

/**
 * Professional identity areas for Karsten Wade
 */
export type ProfessionalIdentity =
  | 'collaborative-experience-consulting'
  | 'collaboration-catalyst'
  | 'open-collaboration-expert'
  | 'developer-experience-expert'
  | 'devex-collaboration-facilitator'
  | 'human-systems-expertise'
  | 'community-catalyst'
  | 'contribution-enabler';

/**
 * Content types for the website
 */
export type ContentType = 'poetry' | 'fiction' | 'cv' | 'theories' | 'open-papers';

/**
 * Navigation route configuration
 */
export interface RouteConfig {
  path: string;
  label: string;
  description: string;
}

/**
 * Content metadata
 */
export interface ContentMeta {
  title: string;
  description: string;
  date?: string;
  tags?: string[];
  type: ContentType;
}

/**
 * Featured content card data
 */
export interface FeaturedCard {
  title: string;
  description: string;
  link: string;
  image?: string;
  type: ContentType;
}
