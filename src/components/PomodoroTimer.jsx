import { useEffect, useRef, useState } from 'react'
import './PomodoroTimer.css'

const modes = {
  focus: { label: '🍵 Focus', duration: 25 * 60 },
  shortBreak: { label: '🌸 Short Break', duration: 5 * 60 },
  longBreak: { label: '🌙 Long Break', duration: 15 * 60 },
}

function PomodoroTimer() {
  const [selectedMode, setSelectedMode] = useState('focus')
  const [seconds, setSeconds] = useState(modes.focus.duration)
  const [isRunning, setIsRunning] = useState(false)
  const endTimeRef = useRef(null)

  useEffect(() => {
    if (!isRunning) return

    const intervalId = setInterval(() => {
      if (endTimeRef.current === null) return

      // Recalculate from the clock, even if the browser delayed this callback.
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000))
      setSeconds(remaining)

      if (remaining === 0) {
        clearInterval(intervalId)
        endTimeRef.current = null
        setIsRunning(false)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [isRunning])

  function handleStart() {
    if (isRunning || seconds === 0) return

    endTimeRef.current = Date.now() + seconds * 1000
    setIsRunning(true)
  }

  function handlePause() {
    if (!isRunning) return

    // Read the clock here too: the displayed seconds may be out of date.
    const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000))
    setSeconds(remaining)
    setIsRunning(false)
    endTimeRef.current = null
  }

  function handleReset() {
    setIsRunning(false)
    endTimeRef.current = null
    setSeconds(modes[selectedMode].duration)
  }

  function handleModeChange(mode) {
    setIsRunning(false)
    endTimeRef.current = null
    setSelectedMode(mode)
    setSeconds(modes[mode].duration)
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`

  return (
    <section className="pomodoro-timer" aria-labelledby="timer-heading">
      <h2 id="timer-heading">{modes[selectedMode].label} Time</h2>
      <div className="timer-modes" role="group" aria-label="Session mode">
        {Object.entries(modes).map(([mode, { label }]) => (
          <button
            key={mode}
            type="button"
            aria-pressed={selectedMode === mode}
            onClick={() => handleModeChange(mode)}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="timer-display">{formattedTime}</p>
      <div className="timer-controls">
        <button type="button" onClick={handleStart} disabled={isRunning || seconds === 0}>
          Start
        </button>
        <button type="button" onClick={handlePause}>Pause</button>
        <button type="button" onClick={handleReset}>Reset</button>
      </div>
    </section>
  )
}

export default PomodoroTimer
