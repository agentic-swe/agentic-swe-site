import { useEffect, useId, useRef, useState } from 'react'
import {
  DEFAULT_SETUP_HOST,
  SETUP_HOSTS,
  findSetupHost,
  type SetupHost,
  type SetupHostId,
} from '../setup/automated-setup'

const HOST_STORAGE_KEY = 'agentic-swe:setup-host'

function readSavedHost(): SetupHostId {
  try {
    return findSetupHost(window.localStorage.getItem(HOST_STORAGE_KEY)).id
  } catch {
    return DEFAULT_SETUP_HOST
  }
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

type SetupButtonProps = { className?: string }

export function SetupButton({ className = 'btn btn-primary' }: SetupButtonProps) {
  const [hostId, setHostId] = useState<SetupHostId>(readSavedHost)
  const [menuOpen, setMenuOpen] = useState(false)
  const [status, setStatus] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const host = findSetupHost(hostId)

  useEffect(() => {
    if (!menuOpen) return
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === 'Escape' : !rootRef.current?.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', close)
    }
  }, [menuOpen])

  const runSetup = async (target: SetupHost) => {
    setMenuOpen(false)
    setHostId(target.id)
    try {
      window.localStorage.setItem(HOST_STORAGE_KEY, target.id)
    } catch {
      /* Private browsing can block storage; the choice just won't persist. */
    }
    // Copying first keeps a fallback when the host's URL handler is not registered.
    const copied = await copyText(target.prompt)
    if (target.link) {
      window.location.href = target.link(target.prompt)
      setStatus(
        `Opening ${target.name} with the setup prompt. Press Enter there to run it.` +
          (copied ? ' The prompt is also on your clipboard.' : ''),
      )
    } else {
      setStatus(
        copied
          ? `Setup prompt copied. Paste it into ${target.name} and press Enter.`
          : `Could not copy automatically; open the installation guide for ${target.name}.`,
      )
    }
  }

  return (
    <div className="setup-split" ref={rootRef} data-setup="automated">
      <button type="button" className={`${className} setup-split__main`} onClick={() => runSetup(host)}>
        Set up in {host.name}
      </button>
      <button
        type="button"
        className={`${className} setup-split__toggle`}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls={menuId}
        aria-label="Choose another editor for setup"
        onClick={(event) => {
          event.stopPropagation()
          setMenuOpen((open) => !open)
        }}
      >
        <span aria-hidden>▾</span>
      </button>
      {menuOpen && (
        <ul className="setup-split__menu" id={menuId} role="menu" onClick={(event) => event.stopPropagation()}>
          {SETUP_HOSTS.map((option) => (
            <li key={option.id} role="none">
              <button type="button" role="menuitem" onClick={() => runSetup(option)}>
                <span>{option.name}</span>
                <small>{option.link ? 'Opens with prompt' : 'Copies prompt'}</small>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="setup-split__status" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  )
}
