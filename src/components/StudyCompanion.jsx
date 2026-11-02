import { useState } from 'react'
import cleoImage from '../assets/cleo.png'
import mochiImage from '../assets/mochi.png'
import './StudyCompanion.css'

const companions = {
  mochi: {
    name: 'Mochi',
    emoji: '🐱',
    image: mochiImage,
    alt: 'Mochi, a fluffy cream-and-gray cat wearing a pink bow',
  },
  cleo: {
    name: 'Cleo',
    emoji: '🐶',
    image: cleoImage,
    alt: 'Cleo, a fluffy cream-and-caramel Shih Tzu wearing a pink plaid bow',
  },
}

function StudyCompanion() {
  const [selectedCompanion, setSelectedCompanion] = useState('cleo')
  const companion = companions[selectedCompanion]

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
        <img className="companion-image" src={companion.image} alt={companion.alt} />
        <h3>{companion.name}</h3>
      </div>
      <p>Your study buddy is ready to focus with you!</p>
    </section>
  )
}

export default StudyCompanion
