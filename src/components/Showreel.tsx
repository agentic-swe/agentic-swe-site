import { useEffect, useRef, useState } from 'react'

const videoUrl = `${import.meta.env.BASE_URL}media/agentic-swe-showreel.mp4`
const posterUrl = `${import.meta.env.BASE_URL}media/agentic-swe-showreel-poster.jpg`

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Lifecycle showreel. It autoplays muted and looped; clicking or pressing
 * Space/Enter on the frame pauses and resumes it. Reduced-motion visitors
 * start on the poster until they click.
 */
export function Showreel() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reducedMotion] = useState(prefersReducedMotion)
  const [paused, setPaused] = useState(reducedMotion)

  useEffect(() => {
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

  return (
    <figure className={`showreel${paused ? ' is-paused' : ''}`}>
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
        aria-hidden="true"
        tabIndex={-1}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
      />
      <button
        type="button"
        className="showreel__hit"
        onClick={toggle}
        aria-pressed={paused}
        aria-label={
          paused
            ? 'Play the Agentic SWE showreel'
            : 'Pause the Agentic SWE showreel: one command, a governed pipeline, 138 specialists, the memory ladder, a human approval gate, and the final receipt'
        }
      >
        <span className="showreel__play" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28">
            <path d="M8 5.5v13l10.5-6.5L8 5.5z" fill="currentColor" />
          </svg>
        </span>
      </button>
    </figure>
  )
}
