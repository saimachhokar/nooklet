import { useEffect, useRef, useState } from 'react'
import './PomodoroTimer.css'

function PomodoroTimer() {
  const [seconds, setSeconds] = useState(1500)
  const [isRunning, setIsRunning] = useState(false)
  const endTimeRef = useRef(null)

  useEffect(() => {
    if (!isRunning) return

    const intervalId = setInterval(() => {
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
    setSeconds(1500)
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`

  return (
    <section className="pomodoro-timer" aria-labelledby="timer-heading">
      <h2 id="timer-heading">🍵 Focus Time</h2>
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
