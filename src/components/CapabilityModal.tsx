import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'

export type CapabilityDetail = {
  title: string
  icon: string
  iconClass: string
  summary: string
  benefits: string[]
  docSlug?: string
}

type CapabilityModalProps = {
  open: boolean
  detail: CapabilityDetail | null
  onClose: () => void
}

export function CapabilityModal({ open, detail, onClose }: CapabilityModalProps) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open || !detail) return null

  return createPortal(
    <div className="install-modal-root" role="presentation">
      <button type="button" className="install-modal-backdrop" aria-label="Close" onClick={onClose} />
      <div
        className="install-modal-panel capability-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="install-modal-header">
          <h2 id={titleId} className="install-modal-title">
            <span className={`feature-icon ${detail.iconClass}`} aria-hidden>
              {detail.icon}
            </span>
            {detail.title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="install-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </header>
        <div className="install-modal-body capability-modal-body">
          <p className="capability-modal-summary">{detail.summary}</p>
          <h3>Why it matters</h3>
          <ul className="capability-modal-benefits">
            {detail.benefits.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          {detail.docSlug && (
            <Link
              to={`/docs/${detail.docSlug}`}
              className="capability-modal-doc-link"
              onClick={onClose}
            >
              Read the documentation &rarr;
            </Link>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
