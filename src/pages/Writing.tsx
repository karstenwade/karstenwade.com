import SEO from '../components/SEO'
import Poetry from '../components/Poetry'
import Fiction from '../components/Fiction'
import './Writing.css'

export interface WritingProps {
  className?: string
}

const Writing = ({ className = '' }: WritingProps) => {
  return (
    <>
      <SEO
        title="Writing - Karsten Wade"
        description="Poetry and prose by Karsten Wade exploring open source communities, collaboration, and the evolving relationship between humans and AI."
        keywords="poetry, fiction, writing, open source literature, AI stories, collaboration writing"
        ogUrl="https://karstenwade.github.io/karstenwade.com/writing"
      />
      <main className={`writing ${className}`}>
        <div className="writing__header">
          <h1 className="writing__title">Writing</h1>
          <p className="writing__description">
            Poetry and prose exploring open source communities, collaboration,
            and the evolving relationship between humans and AI.
          </p>
        </div>

        <Poetry />
        <Fiction />
      </main>
    </>
  )
}

export default Writing
