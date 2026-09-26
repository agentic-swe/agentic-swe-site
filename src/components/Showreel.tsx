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
    <section id="showreel" className="home-section home-section--showreel" aria-labelledby="showreel-title">
      <header className="home-section__head">
        <p className="section-label">// showreel</p>
        <h2 id="showreel-title" className="home-section__title">
          The whole lifecycle in fifteen seconds
        </h2>
        <p className="home-section__lead">
          One command in, a governed pipeline, routed specialists, memory that descends toward zero tokens, a
          human gate, and a receipt out.
        </p>
      </header>

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
    </section>
  )
}
