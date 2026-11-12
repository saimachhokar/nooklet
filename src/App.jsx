import { useEffect, useState } from 'react'
import PomodoroTimer from './components/PomodoroTimer.jsx'
import StudyCompanion from './components/StudyCompanion.jsx'
import './App.css'

const themes = {
  cafe: 'Cozy Café',
  matcha: 'Matcha Garden',
  midnight: 'Midnight Focus',
}

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem('nooklet-theme')
    return Object.hasOwn(themes, savedTheme) ? savedTheme : 'cafe'
  })
  const [timerState, setTimerState] = useState({ mode: 'focus', status: 'idle' })

  useEffect(() => {
    window.localStorage.setItem('nooklet-theme', theme)
  }, [theme])

  return (
    <main className="welcome-page" data-theme={theme}>
      <div className="welcome-card">
        <header className="dashboard-header">
          <div className="dashboard-brand">
            <h1 id="welcome-heading">🌷 Nooklet</h1>
            <p className="tagline">Your little corner of focus.</p>
          </div>
          <div className="theme-selector" role="group" aria-label="Cozy room theme">
            {Object.entries(themes).map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={theme === id}
                onClick={() => setTheme(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <button type="button">Let's Focus</button>
        </header>
        <div className="study-dashboard">
          <PomodoroTimer onTimerStateChange={setTimerState} />
          <StudyCompanion mode={timerState.mode} status={timerState.status} />
        </div>
      </div>
    </main>
  )
}

export default App
