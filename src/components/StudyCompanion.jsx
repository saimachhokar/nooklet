import { useState } from 'react'
import './StudyCompanion.css'

const companions = {
  cat: { name: 'Cat', emoji: '🐱' },
  cleo: { name: 'Cleo', emoji: '🐶' },
}

function StudyCompanion() {
  const [selectedCompanion, setSelectedCompanion] = useState('cat')
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
        <span className="companion-emoji" aria-hidden="true">{companion.emoji}</span>
        <h3>{companion.name}</h3>
      </div>
      <p>Your study buddy is ready to focus with you!</p>
    </section>
  )
}

export default StudyCompanion
