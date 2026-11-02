import { useEffect, useRef, useState } from 'react'
import './PomodoroTimer.css'

const modes = {
  focus: { label: '🍵 Focus' },
  shortBreak: { label: '🌸 Short Break' },
  longBreak: { label: '🌙 Long Break' },
}

const defaultDurations = { focus: 25, shortBreak: 5, longBreak: 15 }

function PomodoroTimer() {
  const [selectedMode, setSelectedMode] = useState('focus')
  const [durations, setDurations] = useState(defaultDurations)
  const [draftDurations, setDraftDurations] = useState(defaultDurations)
  const [settingsError, setSettingsError] = useState('')
  const [seconds, setSeconds] = useState(defaultDurations.focus * 60)
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
    setSeconds(durations[selectedMode] * 60)
  }

  function handleModeChange(mode) {
    setIsRunning(false)
    endTimeRef.current = null
    setSelectedMode(mode)
    setSeconds(durations[mode] * 60)
  }

  function handleSaveSettings(event) {
    event.preventDefault()
    const savedDurations = {}

    for (const mode of Object.keys(modes)) {
      const value = draftDurations[mode]
      const minutes = Number(value)

      if (String(value).trim() === '' || !Number.isInteger(minutes) || minutes < 1 || minutes > 180) {
        setSettingsError(`${modes[mode].label}: enter a whole number between 1 and 180 minutes.`)
        return
      }

      savedDurations[mode] = minutes
    }

    setDurations(savedDurations)
    setDraftDurations(savedDurations)
    setSettingsError('')
    setIsRunning(false)
    endTimeRef.current = null
    setSeconds(savedDurations[selectedMode] * 60)
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
      <form className="timer-settings" onSubmit={handleSaveSettings} noValidate>
        <h3>Settings</h3>
        <p id="duration-help">Session lengths in minutes (1–180).</p>
        <div className="timer-settings-fields">
          {Object.entries(modes).map(([mode, { label }]) => (
            <label key={mode}>
              {label}
              <input
                type="number"
                min="1"
                max="180"
                step="1"
                required
                aria-describedby="duration-help settings-error"
                value={draftDurations[mode]}
                onChange={(event) => setDraftDurations({
                  ...draftDurations,
                  [mode]: event.target.value,
                })}
              />
            </label>
          ))}
        </div>
        <p id="settings-error" className="settings-error" role="alert">{settingsError}</p>
        <button type="submit">Save Settings</button>
      </form>
    </section>
  )
}

export default PomodoroTimer
