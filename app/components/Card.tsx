import { Card as ShadcnCard, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { cn } from '@/lib/utils'

export interface CardProps {
  title: string
  description: string
  link: string
  image?: string
  className?: string
  external?: boolean
}

const Card = ({ title, description, link, image, className = '', external = false }: CardProps) => {
  // Determine if link is external (starts with http:// or https://)
  const isExternal = external || link.startsWith('http://') || link.startsWith('https://')

  return (
    <article className={cn('card', image && 'card--with-image', className)}>
      <a
        href={link}
        className="block no-underline text-inherit hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-xl transition-all"
        aria-label={title}
        {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
      >
        <ShadcnCard className="h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-gray-200">
          {image && (
            <div className="card__image-container overflow-hidden rounded-t-xl">
              <img
                src={image}
                alt={title}
                className="card__image w-full h-48 object-cover transition-transform duration-200 hover:scale-105"
                loading="lazy"
              />
            </div>
          )}
          <CardHeader className={cn(!image && 'pt-6')}>
            <CardTitle className="card__title">
              <h3 className="text-xl font-semibold leading-tight tracking-tight">
                {title}
              </h3>
            </CardTitle>
          </CardHeader>
          <CardContent className="card__content pt-0">
            <CardDescription>
              <p className="card__description text-sm text-gray-600">
                {description}
              </p>
            </CardDescription>
          </CardContent>
        </ShadcnCard>
      </a>
    </article>
  )
}

export default Card
