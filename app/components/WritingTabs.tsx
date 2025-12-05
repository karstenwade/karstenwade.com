'use client'

import { useState } from 'react'
import type { Poem } from '@/data/poetry'
import type { Essay } from '@/data/essays'
import type { Story } from '@/data/fiction'
import PoetryList from './PoetryList'
import EssaysList from './EssaysList'
import FictionList from './FictionList'

type WritingTab = 'poetry' | 'essays' | 'fiction'

interface WritingTabsProps {
  poems: Poem[]
  essays: Essay[]
  stories: Story[]
}

export default function WritingTabs({ poems, essays, stories }: WritingTabsProps) {
  const [activeTab, setActiveTab] = useState<WritingTab>('poetry')

  return (
    <>
      <div className="writing__tabs flex justify-center gap-2 mb-8" role="tablist" aria-label="Writing categories">
        <button
          role="tab"
          aria-selected={activeTab === 'poetry'}
          aria-controls="poetry-panel"
          id="poetry-tab"
          className={`writing__tab px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'poetry'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('poetry')}
        >
          Poetry
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'essays'}
          aria-controls="essays-panel"
          id="essays-tab"
          className={`writing__tab px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'essays'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('essays')}
        >
          Essays
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'fiction'}
          aria-controls="fiction-panel"
          id="fiction-tab"
          className={`writing__tab px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'fiction'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
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
        {activeTab === 'poetry' && <PoetryList poems={poems} />}
      </div>

      <div
        role="tabpanel"
        id="essays-panel"
        aria-labelledby="essays-tab"
        hidden={activeTab !== 'essays'}
      >
        {activeTab === 'essays' && <EssaysList essays={essays} />}
      </div>

      <div
        role="tabpanel"
        id="fiction-panel"
        aria-labelledby="fiction-tab"
        hidden={activeTab !== 'fiction'}
      >
        {activeTab === 'fiction' && <FictionList stories={stories} />}
      </div>
    </>
  )
}
