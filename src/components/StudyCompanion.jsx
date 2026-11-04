import { useState } from 'react'
import cleoImage from '../assets/cleo.png'
import cleoSleepImage from '../assets/cleo-sleep.png'
import mochiImage from '../assets/mochi.png'
import mochiSleepImage from '../assets/mochi-sleep.png'
import './StudyCompanion.css'

const companions = {
  mochi: {
    name: 'Mochi',
    emoji: '🐱',
    images: {
      awake: mochiImage,
      sleeping: mochiSleepImage,
    },
    alt: 'Mochi, a fluffy cream-and-gray cat wearing a pink bow',
  },
  cleo: {
    name: 'Cleo',
    emoji: '🐶',
    images: {
      awake: cleoImage,
      sleeping: cleoSleepImage,
    },
    alt: 'Cleo, a fluffy cream-and-caramel Shih Tzu wearing a pink plaid bow',
  },
}

function StudyCompanion({ mode, status }) {
  const [selectedCompanion, setSelectedCompanion] = useState('cleo')
  const companion = companions[selectedCompanion]
  const isSleeping = status === 'running'
    && (mode === 'shortBreak' || mode === 'longBreak')

  let animation = 'idle'
  if (status === 'paused') {
    animation = 'paused'
  } else if (status === 'completed') {
    animation = 'completed'
  } else if (status === 'running') {
    animation = mode === 'focus' ? 'focus' : 'sleepy'
  }

  let message = 'Your study buddy is ready to focus with you!'

  if (status === 'completed') {
    message = 'You did it! Your study buddy is proud of you! 🎉'
  } else if (status === 'paused') {
    message = 'Your study buddy is waiting for you! ☕'
  } else if (status === 'running') {
    if (mode === 'focus') {
      message = 'Your study buddy is studying with you! 📚'
    } else if (mode === 'shortBreak') {
      message = 'Time for a little rest! 💤'
    } else if (mode === 'longBreak') {
      message = 'Your study buddy is enjoying a cozy break! 🌙'
    }
  }

  return (
    <section className="study-companion" aria-labelledby="companion-heading">
      <h2 id="companion-heading">Choose Your Study Buddy 🐾</h2>
      <div className="companion-options" role="group" aria-label="Study buddy">
        {Object.entries(companions).map(([id, { name, emoji }]) => (
          <button
            key={id}
            type="button"
            aria-pressed={selectedCompanion === id}
            onClick={() => setSelectedCompanion(id)}
          >
            {emoji} {name}
          </button>
        ))}
      </div>
      <div className="companion-preview" aria-live="polite">
        <img
          className={`companion-image companion-image--${animation}`}
          src={isSleeping ? companion.images.sleeping : companion.images.awake}
          alt={isSleeping ? `${companion.name} resting with eyes closed` : companion.alt}
        />
        <h3>{companion.name}</h3>
      </div>
      <p role="status">{message}</p>
    </section>
  )
}

export default StudyCompanion
