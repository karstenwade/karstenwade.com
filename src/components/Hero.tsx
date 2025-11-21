import { cn } from '@/lib/utils'

export interface HeroProps {
  className?: string
}

const Hero = ({ className = '' }: HeroProps) => {
  return (
    <header
      className={cn(
        'hero',
        'flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16',
        'px-4 py-8 md:px-8 md:py-12 lg:px-12 lg:py-16',
        'bg-gradient-to-br from-white to-gray-100',
        'border-b border-gray-200',
        className
      )}
      role="banner"
    >
      <div className="hero__image-container flex justify-center items-start flex-shrink-0">
        <img
          src={`${import.meta.env.BASE_URL}assets/images/karsten-wade-headshot.jpg`}
          alt="Karsten Wade - Collaborative Experience Consultant"
          className={cn(
            'hero__image',
            'w-[200px] h-[200px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px]',
            'rounded-full object-cover',
            'border-4 border-blue-600 shadow-lg',
            'transition-transform duration-300',
            'hover:scale-105',
            'focus-visible:outline focus-visible:outline-3 focus-visible:outline-blue-600 focus-visible:outline-offset-4'
          )}
        />
      </div>

      <div className="hero__content flex flex-col gap-4 text-center md:text-left flex-1">
        <h1 className="hero__name m-0 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
          Karsten Wade
        </h1>
        <h2 className="hero__tagline m-0 text-xl md:text-2xl lg:text-3xl font-semibold leading-tight text-blue-600">
          Collaborative Experience Consulting
        </h2>

        <div className="hero__bio flex flex-col gap-3 max-w-[600px] mx-auto md:mx-0 md:max-w-none lg:max-w-[700px]">
          <p className="hero__bio-intro m-0 text-lg md:text-lg lg:text-xl leading-relaxed text-gray-600">
            Karsten Wade is a <strong className="text-gray-900 font-semibold">collaboration catalyst</strong> and{' '}
            <strong className="text-gray-900 font-semibold">open collaboration expert</strong> specializing in{' '}
            <strong className="text-gray-900 font-semibold">developer experience (DevEx)</strong> and community building.
          </p>

          <p className="hero__bio-detail m-0 text-base md:text-base lg:text-lg leading-relaxed text-gray-600">
            With deep expertise in <strong className="text-gray-900 font-semibold">human systems</strong> and{' '}
            <strong className="text-gray-900 font-semibold">contribution enablement</strong>, Karsten helps organizations
            unlock the power of collaborative work.
          </p>
        </div>
      </div>
    </header>
  )
}

export default Hero
