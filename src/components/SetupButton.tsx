import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
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
  const toggleRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])
  const menuId = useId()
  const host = findSetupHost(hostId)

  useEffect(() => {
    if (!menuOpen) return
    const selectedIndex = SETUP_HOSTS.findIndex((option) => option.id === hostId)
    itemRefs.current[Math.max(selectedIndex, 0)]?.focus()
  }, [hostId, menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key === 'Escape') {
        event.preventDefault()
        setMenuOpen(false)
        toggleRef.current?.focus()
      } else if (
        event instanceof MouseEvent &&
        !rootRef.current?.contains(event.target as Node)
      ) {
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

  const onMenuKeyDown = (event: ReactKeyboardEvent<HTMLUListElement>) => {
    if (event.key === 'Tab') {
      setMenuOpen(false)
      return
    }
    const current = itemRefs.current.findIndex((item) => item === document.activeElement)
    let next: number | null = null
    if (event.key === 'ArrowDown') next = (current + 1) % SETUP_HOSTS.length
    if (event.key === 'ArrowUp') next = (current - 1 + SETUP_HOSTS.length) % SETUP_HOSTS.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = SETUP_HOSTS.length - 1
    if (next === null) return
    event.preventDefault()
    itemRefs.current[next]?.focus()
  }

  const runSetup = async (target: SetupHost) => {
    setMenuOpen(false)
    window.requestAnimationFrame(() => toggleRef.current?.focus())
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
        ref={toggleRef}
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
        <ul
          className="setup-split__menu"
          id={menuId}
          role="menu"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={onMenuKeyDown}
        >
          {SETUP_HOSTS.map((option, index) => (
            <li key={option.id} role="none">
              <button
                ref={(node) => {
                  itemRefs.current[index] = node
                }}
                type="button"
                role="menuitem"
                tabIndex={-1}
                onClick={() => runSetup(option)}
              >
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
