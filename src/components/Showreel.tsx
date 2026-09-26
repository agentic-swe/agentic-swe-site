import { useState } from 'react'

const videoUrl = `${import.meta.env.BASE_URL}media/agentic-swe-showreel.mp4`
const posterUrl = `${import.meta.env.BASE_URL}media/agentic-swe-showreel-poster.jpg`

/**
 * 15-second lifecycle showreel rendered from `showreel/showreel.html`.
 * Autoplays muted on loop; under `prefers-reduced-motion` it stays on the
 * poster until the visitor presses play.
 */
export function Showreel() {
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  return (
    <figure className="showreel">
      <video
        className="showreel__video"
        src={videoUrl}
        poster={posterUrl}
        width={1920}
        height={1080}
        autoPlay={!reducedMotion}
        controls={reducedMotion}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Agentic SWE showreel: one command, a governed pipeline, 138 specialists, the memory ladder, a human approval gate, and the final receipt"
      />
    </figure>
  )
}
