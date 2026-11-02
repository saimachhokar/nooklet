import { useState } from 'react'
import PomodoroTimer from './components/PomodoroTimer.jsx'
import StudyCompanion from './components/StudyCompanion.jsx'
import './App.css'

function App() {
  const [timerState, setTimerState] = useState({ mode: 'focus', status: 'idle' })

  return (
    <main className="welcome-page">
      <section className="welcome-card" aria-labelledby="welcome-heading">
        <h1 id="welcome-heading">🌷 Nooklet</h1>
        <p className="tagline">Your little corner of focus.</p>
        <p className="description">A cozy space to focus, study, and grow.</p>
        <button type="button">Let's Focus</button>
        <PomodoroTimer onTimerStateChange={setTimerState} />
        <StudyCompanion mode={timerState.mode} status={timerState.status} />
      </section>
    </main>
  )
}

export default App
