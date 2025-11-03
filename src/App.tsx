import './styles/App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Karsten Wade</h1>
        <p className="tagline">Collaborative Experience Consulting</p>
      </header>

      <main className="app-main">
        <section className="hero">
          <h2>Welcome</h2>
          <p>
            Karsten Wade is a <strong>collaboration catalyst</strong> and{' '}
            <strong>open collaboration expert</strong> specializing in developer
            experience (DevEx) and community building.
          </p>
          <p>
            With deep expertise in <strong>human systems</strong> and{' '}
            <strong>contribution enablement</strong>, Karsten helps organizations
            unlock the power of collaborative work.
          </p>
        </section>

        <section className="expertise">
          <h2>Expertise Areas</h2>
          <ul>
            <li>Collaborative experience consulting</li>
            <li>Developer experience (DevEx) facilitation</li>
            <li>Open collaboration methodologies</li>
            <li>Community catalyst and contribution enabler</li>
            <li>Human systems expertise</li>
          </ul>
        </section>
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Karsten Wade. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
