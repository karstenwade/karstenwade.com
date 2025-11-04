import Poetry from '../components/Poetry'
import './Writing.css'

export interface WritingProps {
  className?: string
}

const Writing = ({ className = '' }: WritingProps) => {
  return (
    <main className={`writing ${className}`}>
      <div className="writing__header">
        <h1 className="writing__title">Writing</h1>
        <p className="writing__description">
          Poetry and prose exploring open source communities, collaboration,
          and the evolving relationship between humans and AI.
        </p>
      </div>

      <Poetry />
    </main>
  )
}

export default Writing
