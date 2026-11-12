import { useEffect, useRef, useState } from 'react'
import './MusicPlayer.css'

const audioFiles = import.meta.glob('../assets/audio/*.{mp3,ogg,wav,m4a}', {
  eager: true,
  import: 'default',
  query: '?url',
})

const audioSources = Object.fromEntries(
  Object.entries(audioFiles).map(([path, source]) => {
    const filename = path.split('/').pop()
    const trackId = filename.slice(0, filename.lastIndexOf('.'))
    return [trackId, source]
  }),
)

const tracks = [
  { id: 'cafe', label: 'Cozy Café' },
  { id: 'matcha', label: 'Matcha Garden' },
  { id: 'midnight', label: 'Midnight Focus' },
].map((track) => ({
  ...track,
  source: audioSources[track.id] ?? '',
}))

function MusicPlayer({ isOpen }) {
  const [selectedTrackId, setSelectedTrackId] = useState('cafe')
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.6)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackError, setPlaybackError] = useState('')
  const audioRef = useRef(null)
  const selectedTrack = tracks.find((track) => track.id === selectedTrackId)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)
    const handleError = () => {
      setIsPlaying(false)
      setPlaybackError('This audio file could not be played.')
    }

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined

    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
    setPlaybackError('')

    if (selectedTrack.source) {
      audio.src = selectedTrack.source
      audio.load()
    } else {
      audio.removeAttribute('src')
      audio.load()
    }

    return () => {
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    }
  }, [selectedTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume
    audio.muted = isMuted
  }, [volume, isMuted])

  async function handlePlayPause() {
    const audio = audioRef.current
    if (!audio || !selectedTrack.source) return

    setPlaybackError('')
    if (audio.paused) {
      try {
        await audio.play()
      } catch {
        setIsPlaying(false)
        setPlaybackError('Playback could not start. Please try again.')
      }
    } else {
      audio.pause()
    }
  }

  return (
    <section
      className="music-player"
      id="background-music-player"
      aria-labelledby="music-player-heading"
      hidden={!isOpen}
    >
      <div className="music-player-heading">
        <div>
          <h2 id="music-player-heading">Background music</h2>
          <p>Choose a cozy soundscape for your study session.</p>
        </div>
      </div>
      <div className="music-track-options" role="group" aria-label="Music selection">
        {tracks.map((track) => (
          <button
            key={track.id}
            className="music-track-option"
            type="button"
            aria-pressed={selectedTrackId === track.id}
            onClick={() => setSelectedTrackId(track.id)}
          >
            <span>{track.label}</span>
            {!track.source && <span className="music-track-missing">Audio needed</span>}
          </button>
        ))}
      </div>
      <div className="music-controls">
        <button
          type="button"
          onClick={handlePlayPause}
          disabled={!selectedTrack.source}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          className="music-mute"
          type="button"
          aria-pressed={isMuted}
          aria-label={isMuted ? 'Unmute music' : 'Mute music'}
          onClick={() => setIsMuted((muted) => !muted)}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
        <label className="music-volume">
          <span>Volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            aria-label="Music volume"
            onChange={(event) => setVolume(Number(event.target.value))}
          />
        </label>
      </div>
      <p className="music-player-status" role="status" aria-live="polite">
        {playbackError || (selectedTrack.source
          ? 'Music plays independently of your focus timer.'
          : `Add a local ${selectedTrack.id} audio file in src/assets/audio to enable playback.`)}
      </p>
      <audio ref={audioRef} preload="none" loop />
    </section>
  )
}

export default MusicPlayer
