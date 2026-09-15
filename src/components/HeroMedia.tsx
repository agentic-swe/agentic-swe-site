const posterUrl = `${import.meta.env.BASE_URL}media/cognitive-field-poster.svg`

/**
 * Decorative execution-field visual for the hero. The artwork is a static SVG,
 * so it carries no motion of its own and needs no reduced-motion branch; the
 * only animation lives on `.hero-media__veil` in CSS, which is disabled under
 * `prefers-reduced-motion`.
 */
export function HeroMedia() {
  return (
    <div className="hero-media" aria-hidden>
      <div className="hero-media__frame">
        <img
          className="hero-media__visual"
          src={posterUrl}
          alt=""
          width={1600}
          height={900}
          loading="eager"
          decoding="async"
        />
        <div className="hero-media__veil" />
        <p className="hero-media__status">
          <span className="signal-dot" />
          execution memory online
        </p>
      </div>
    </div>
  )
}
