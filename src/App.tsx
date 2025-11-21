import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { usePageTracking } from './hooks/usePageTracking'
import Navigation from './components/Navigation'
import './styles/App.css'

// Lazy load route components for code splitting
const Home = lazy(() => import('./pages/Home'))
const Writing = lazy(() => import('./pages/Writing'))
const CV = lazy(() => import('./pages/CV'))
const OpenPapers = lazy(() => import('./pages/OpenPapers'))
const PaperDetail = lazy(() => import('./pages/PaperDetail'))

// Loading fallback component
const LoadingFallback = () => (
  <div className="loading-fallback" aria-live="polite" aria-busy="true">
    <p>Loading...</p>
  </div>
)

function AppContent() {
  // Track page views on route changes
  usePageTracking()

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navigation />

      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/cv" element={<CV />} />
          <Route path="/papers" element={<OpenPapers />} />
          <Route path="/papers/:slug" element={<PaperDetail />} />
        </Routes>
      </Suspense>

      <footer className="app-footer">
        <p>
          &copy; 2025 Karsten Wade. All rights reserved.
          {' • '}
          <span className="app-footer__privacy">
            This site uses Google Analytics to understand usage. No personal information is collected beyond standard analytics data.
          </span>
        </p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
