import './Card.css'

export interface CardProps {
  title: string
  description: string
  link: string
  image?: string
  className?: string
}

const Card = ({ title, description, link, image, className = '' }: CardProps) => {
  const cardClasses = [
    'card',
    image ? 'card--with-image' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <article className={cardClasses}>
      <a href={link} className="card__link" aria-label={title}>
        {image && (
          <div className="card__image-container">
            <img
              src={image}
              alt={title}
              className="card__image"
              loading="lazy"
            />
          </div>
        )}
        <div className="card__content">
          <h3 className="card__title">{title}</h3>
          <p className="card__description">{description}</p>
        </div>
      </a>
    </article>
  )
}

export default Card
