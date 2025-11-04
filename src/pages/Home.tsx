import SEO from '../components/SEO'
import Hero from '../components/Hero'
import FeaturedContent from '../components/FeaturedContent'
import './Home.css'

export interface HomeProps {
  className?: string
}

const Home = ({ className = '' }: HomeProps) => {
  return (
    <>
      <SEO
        title="Karsten Wade - Collaborative Experience Consulting"
        description="Karsten Wade - Open collaboration expert, community architect, and DevEx facilitator. Co-founder of Red Hat's OSPO and author of The Open Source Way."
        ogUrl="https://karstenwade.github.io/karstenwade.com/"
      />
      <main className={`home ${className}`}>
        <Hero />
        <FeaturedContent />
      </main>
    </>
  )
}

export default Home
