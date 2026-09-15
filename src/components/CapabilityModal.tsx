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

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function focusableWithin(panel: HTMLElement): HTMLElement[] {
  return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) => element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement,
  )
}

export function CapabilityModal({ open, detail, onClose }: CapabilityModalProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  // Keyed on `open` only: an inline `onClose` must not re-run the focus and scroll-lock setup.
  useEffect(() => {
    if (!open) return

    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return
      const items = focusableWithin(panel)
      if (items.length === 0) {
        event.preventDefault()
        panel.focus()
        return
      }

      const first = items[0]
      const last = items[items.length - 1]
      const index = items.indexOf(document.activeElement as HTMLElement)
      if (event.shiftKey && index <= 0) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && (index === -1 || index === items.length - 1)) {
        event.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.body.style.overflow = previousOverflow
      if (opener && document.contains(opener)) opener.focus()
    }
  }, [open])

  if (!open || !detail) return null

  return createPortal(
    <div className="install-modal-root" role="presentation">
      <div className="install-modal-backdrop" aria-hidden="true" onClick={onClose} />
      <div
        ref={panelRef}
        className="install-modal-panel capability-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className="install-modal-header">
          <h2 id={titleId} className="install-modal-title">
            <span className={`feature-icon ${detail.iconClass}`} aria-hidden="true">
              {detail.icon}
            </span>
            {detail.title}
          </h2>
          <button type="button" className="install-modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </header>
        <div className="install-modal-body capability-modal-body">
          <p className="capability-modal-summary">{detail.summary}</p>
          <h3>Why it matters</h3>
          <ul className="capability-modal-benefits">
            {detail.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
          {detail.docSlug && (
            <Link to={`/docs/${detail.docSlug}`} className="capability-modal-doc-link" onClick={onClose}>
              Read the documentation &rarr;
            </Link>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
