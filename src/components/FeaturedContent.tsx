import Card from './Card'
import { featuredItems, maxFeatured } from '../data/featuredContent'
import './FeaturedContent.css'

export interface FeaturedContentProps {
  className?: string
}

const FeaturedContent = ({ className = '' }: FeaturedContentProps) => {
  // Get featured items, sorted by priority, limited to maxFeatured
  const items = featuredItems
    .sort((a, b) => a.priority - b.priority)
    .slice(0, maxFeatured)

  // Get the internal URL for each featured item
  const getItemPath = (type: string, slug: string): string => {
    // For papers, link to internal paper page
    if (type === 'paper') {
      return `/papers/${slug}`
    }

    // For poems, link to Writing page with anchor
    if (type === 'poem') {
      return `/writing#${slug}`
    }

    // For general writing, link to Writing page
    if (type === 'writing') {
      return '/writing'
    }

    // For theories, link to theories page
    if (type === 'theory') {
      return '/theories'
    }

    return '/'
  }

  return (
    <section
      className={`featured-content ${className}`}
      role="region"
      aria-label="Featured Content"
    >
      <h2 className="featured-content__heading">Featured Work</h2>

      <div className="cards-grid cards-grid--featured">
        {items.map((item) => (
          <div key={item.slug} data-testid="featured-card">
            <Card
              title={item.headline}
              description={item.subheadline}
              link={getItemPath(item.type, item.slug)}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedContent
