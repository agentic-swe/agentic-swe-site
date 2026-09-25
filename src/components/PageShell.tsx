import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import logoMarkSrc from '../assets/logo-mark.svg?url'
import { AmbientBackground } from './AmbientBackground'
import { SetupButton } from './SetupButton'

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-active' : undefined

export function PageShell() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <AmbientBackground />
      <div className="content-wrap">
        <header className="site-header">
          <nav className="site-nav" aria-label="Primary navigation">
            <Link to="/" className="logo">
              <img
                className="logo-mark"
                src={logoMarkSrc}
                alt=""
                width={32}
                height={32}
                decoding="async"
              />
              <span className="logo-wordmark">
                agentic<span>SWE</span>
              </span>
            </Link>
            <button
              type="button"
              className="mobile-toggle"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="primary-menu"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              <span aria-hidden>{menuOpen ? '×' : 'Menu'}</span>
            </button>
            {/* Any nav activation dismisses the mobile menu; the panel is only
                collapsible at small widths, where every child is a link. */}
            <div
              id="primary-menu"
              className={`nav-links${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <NavLink to="/product" className={navClass}>
                Product
              </NavLink>
              <NavLink to="/capabilities" className={navClass}>
                Capabilities
              </NavLink>
              <NavLink to="/guide" className={navClass}>
                How it works
              </NavLink>
              <NavLink to="/documentation" className={navClass}>
                Docs
              </NavLink>
              <NavLink to="/workspace" className={navClass}>
                Workspace
              </NavLink>
              <SetupButton className="nav-cta" />
            </div>
          </nav>
        </header>

        <Outlet />

        <footer className="site-footer">
          <div>
            <Link to="/" className="footer-brand">Agentic SWE</Link>
            <p>Engineering intelligence that remembers how to ship.</p>
          </div>
          <nav aria-label="Footer navigation">
            <Link to="/documentation">Documentation</Link>
            <Link to="/support">Support</Link>
            <a href="https://github.com/agentic-swe/agentic-swe" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </nav>
          <p className="footer-meta">Open source · MIT · Suraj Gupta</p>
        </footer>
      </div>
    </>
  )
}
