import { useEffect, useRef, useState } from 'react'

const videoUrl = `${import.meta.env.BASE_URL}media/agentic-swe-showreel.mp4`
const posterUrl = `${import.meta.env.BASE_URL}media/agentic-swe-showreel-poster.jpg`

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const minutes = Math.floor(total / 60)
  const remainder = total % 60
  return `${minutes}:${remainder.toString().padStart(2, '0')}`
}

/**
 * Lifecycle showreel. It autoplays muted and looped, with a persistent pause
 * control and a seek bar so a frame can be held and inspected. Reduced-motion
 * visitors start on the poster until they press play.
 */
export function Showreel() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reducedMotion] = useState(prefersReducedMotion)
  const [paused, setPaused] = useState(reducedMotion)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (video && Number.isFinite(video.duration)) setDuration(video.duration)
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pauseForMotion = () => {
      if (!query.matches) return
      videoRef.current?.pause()
      setPaused(true)
    }
    query.addEventListener('change', pauseForMotion)
    return () => query.removeEventListener('change', pauseForMotion)
  }, [])

  function toggle() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      void video.play().catch(() => setPaused(true))
    } else {
      video.pause()
    }
  }

  function seek(value: number) {
    const video = videoRef.current
    if (!video || !Number.isFinite(video.duration)) return
    video.currentTime = value
    setProgress(value)
  }

  const position = `${formatTime(progress)} of ${formatTime(duration)}`

  return (
    <figure className="showreel">
      <video
        ref={videoRef}
        className="showreel__video"
        src={videoUrl}
        poster={posterUrl}
        width={1920}
        height={1080}
        autoPlay={!reducedMotion}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Agentic SWE showreel. Press pause to hold a frame, or drag the timeline to move through it."
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)}
        onClick={toggle}
      />
      <figcaption className="visually-hidden">
        Agentic SWE showreel: one command, a governed pipeline, 138 specialists, the memory ladder, a human approval gate, and the final receipt.
      </figcaption>
      <div className="showreel__controls">
        <button
          type="button"
          className="showreel__toggle"
          onClick={toggle}
          aria-label={paused ? 'Play showreel' : 'Pause showreel'}
        >
          {paused ? <PlayIcon /> : <PauseIcon />}
          <span>{paused ? 'Play' : 'Pause'}</span>
        </button>
        <label className="showreel__seek">
          <span className="visually-hidden">Showreel position</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(progress, duration || 0)}
            aria-valuetext={position}
            onChange={(event) => seek(Number(event.target.value))}
          />
        </label>
        <span className="showreel__time" aria-hidden="true">
          {formatTime(progress)} / {formatTime(duration)}
        </span>
      </div>
    </figure>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M4 2.5v11l10-5.5-10-5.5z" fill="currentColor" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M3 2h3.2v12H3V2zm6.8 0H13v12H9.8V2z" fill="currentColor" />
    </svg>
  )
}
