export function AmbientBackground() {
  return (
    <div className="ambient-field" aria-hidden>
      <div className="ambient-field__mesh" />
      <div className="ambient-field__trace ambient-field__trace--one" />
      <div className="ambient-field__trace ambient-field__trace--two" />
    </div>
  )
}
