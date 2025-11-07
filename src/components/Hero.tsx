import './Hero.css'

export interface HeroProps {
  className?: string
}

const Hero = ({ className = '' }: HeroProps) => {
  return (
    <header className={`hero ${className}`} role="banner">
      <div className="hero__image-container">
        <img
          src="/karstenwade.com/assets/images/karsten-wade-headshot.jpg"
          alt="Karsten Wade - Collaborative Experience Consultant"
          className="hero__image"
        />
      </div>

      <div className="hero__content">
        <h1 className="hero__name">Karsten Wade</h1>
        <h2 className="hero__tagline">Collaborative Experience Consulting</h2>

        <div className="hero__bio">
          <p className="hero__bio-intro">
            Karsten Wade is a <strong>collaboration catalyst</strong> and{' '}
            <strong>open collaboration expert</strong> specializing in{' '}
            <strong>developer experience (DevEx)</strong> and community building.
          </p>

          <p className="hero__bio-detail">
            With deep expertise in <strong>human systems</strong> and{' '}
            <strong>contribution enablement</strong>, Karsten helps organizations
            unlock the power of collaborative work.
          </p>
        </div>
      </div>
    </header>
  )
}

export default Hero
