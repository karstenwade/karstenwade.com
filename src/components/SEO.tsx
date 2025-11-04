import { Helmet } from 'react-helmet-async'

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  twitterCard?: 'summary' | 'summary_large_image'
}

const SEO = ({
  title = 'Karsten Wade - Collaborative Experience Consulting',
  description = 'Karsten Wade - Collaborative experience consulting, open collaboration expert, and DevEx facilitator. Co-founder of Red Hat\'s OSPO and author of The Open Source Way.',
  keywords = 'collaborative experience consulting, collaboration catalyst, developer experience, DevEx, community catalyst, open source, OSPO, community architecture',
  ogTitle,
  ogDescription,
  ogImage = '/karstenwade.com/og-image.png',
  ogUrl = 'https://karstenwade.github.io/karstenwade.com/',
  twitterCard = 'summary_large_image',
}: SEOProps) => {
  const finalOgTitle = ogTitle || title
  const finalOgDescription = ogDescription || description

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Karsten Wade" />

      {/* Open Graph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:site_name" content="Karsten Wade" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content="@quaid" />

      {/* Bluesky - uses Open Graph and Twitter Card tags above, plus creator */}
      <meta property="bluesky:creator" content="@quaid.bsky.app" />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <link rel="canonical" href={ogUrl} />
    </Helmet>
  )
}

export default SEO
