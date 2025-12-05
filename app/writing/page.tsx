'use client'

import { useState } from 'react'
import Navigation from '../components/Navigation'
import Poetry from '@/components/Poetry'
import Essays from '@/components/Essays'
import Fiction from '@/components/Fiction'

type WritingTab = 'poetry' | 'essays' | 'fiction'

export default function Writing() {
  const [activeTab, setActiveTab] = useState<WritingTab>('poetry')

  return (
    <>
      <Navigation />
      <main id="main-content" className="writing max-w-4xl mx-auto px-4 py-8">
        <div className="writing__header text-center mb-8">
          <h1 className="writing__title text-4xl font-bold text-gray-900 mb-2">Writing</h1>
          <p className="writing__description text-xl text-gray-600">
            Poetry, essays, and prose
          </p>
        </div>

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
