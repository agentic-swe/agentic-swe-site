import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import logoMarkSrc from '../assets/logo-mark.svg?url'
import { DOCS_REVIEWED_LABEL, SOURCE_REPO, SOURCE_VERSION } from '../data/project-status'
import { AmbientBackground } from './AmbientBackground'
import { SetupButton } from './SetupButton'

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-active' : undefined

const sitemapHref = `${import.meta.env.BASE_URL ?? '/'}sitemap.xml`

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
              <NavLink to="/evaluate" className={navClass}>
                Evaluate
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
            <p>A local workflow for engineering work you can review. No hosted runtime.</p>
          </div>
          <div className="footer-navs">
            <nav aria-label="Evaluate the project">
              <p className="footer-nav-label">Evaluate</p>
              <Link to="/evaluate">Project status</Link>
              <Link to="/product">Product</Link>
              <Link to="/documentation">Documentation</Link>
              <Link to="/support">Support</Link>
              <a href={sitemapHref}>Sitemap</a>
            </nav>
            <nav aria-label="Maintainer documentation">
              <p className="footer-nav-label">Maintainers</p>
              <Link to="/docs/release-checklist">Release checklist</Link>
              <Link to="/docs/distribution">Distribution</Link>
              <a href={SOURCE_REPO} target="_blank" rel="noopener noreferrer">
                Source
              </a>
            </nav>
          </div>
          <p className="footer-meta">
            Open source · MIT · Suraj Gupta · source v{SOURCE_VERSION} · docs reviewed {DOCS_REVIEWED_LABEL} ·{' '}
            <Link to="/evaluate">Project status</Link>
          </p>
        </footer>
      </div>
    </>
  )
}
