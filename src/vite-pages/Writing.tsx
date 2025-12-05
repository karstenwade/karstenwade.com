import { useState } from 'react'
import SEO from '../components/SEO'
import Poetry from '../components/Poetry'
import Essays from '../components/Essays'
import Fiction from '../components/Fiction'
import './Writing.css'

export interface WritingProps {
  className?: string
}

type WritingTab = 'poetry' | 'essays' | 'fiction'

const Writing = ({ className = '' }: WritingProps) => {
  const [activeTab, setActiveTab] = useState<WritingTab>('poetry')

  return (
    <>
      <SEO
        title="Writing - Karsten Wade"
        description="Poetry, essays, and prose by Karsten Wade"
        keywords="poetry, essays, fiction, writing, open source literature, AI stories, collaboration writing"
        ogUrl="https://karstenwade.github.io/karstenwade.com/writing"
      />
      <main id="main-content" className={`writing ${className}`}>
        <div className="writing__header">
          <h1 className="writing__title">Writing</h1>
          <p className="writing__description">
            Poetry, essays, and prose
          </p>
        </div>

        <div className="writing__tabs" role="tablist" aria-label="Writing categories">
          <button
            role="tab"
            aria-selected={activeTab === 'poetry'}
            aria-controls="poetry-panel"
            id="poetry-tab"
            className={`writing__tab ${activeTab === 'poetry' ? 'writing__tab--active' : ''}`}
            onClick={() => setActiveTab('poetry')}
          >
            Poetry
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'essays'}
            aria-controls="essays-panel"
            id="essays-tab"
            className={`writing__tab ${activeTab === 'essays' ? 'writing__tab--active' : ''}`}
            onClick={() => setActiveTab('essays')}
          >
            Essays
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'fiction'}
            aria-controls="fiction-panel"
            id="fiction-tab"
            className={`writing__tab ${activeTab === 'fiction' ? 'writing__tab--active' : ''}`}
            onClick={() => setActiveTab('fiction')}
          >
            Fiction
          </button>
        </div>

        <div
          role="tabpanel"
          id="poetry-panel"
          aria-labelledby="poetry-tab"
          hidden={activeTab !== 'poetry'}
        >
          {activeTab === 'poetry' && <Poetry />}
        </div>

        <div
          role="tabpanel"
          id="essays-panel"
          aria-labelledby="essays-tab"
          hidden={activeTab !== 'essays'}
        >
          {activeTab === 'essays' && <Essays />}
        </div>

        <div
          role="tabpanel"
          id="fiction-panel"
          aria-labelledby="fiction-tab"
          hidden={activeTab !== 'fiction'}
        >
          {activeTab === 'fiction' && <Fiction />}
        </div>
      </main>
    </>
  )
}

export default Writing
