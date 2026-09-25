import { lazy, Suspense } from 'react'
import { MotionConfig } from 'framer-motion'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LEGACY_MD_TO_SLUG } from './docs/registry'
import { PageShell } from './components/PageShell'
import { ScrollToTop } from './components/ScrollToTop'

const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })))
const CapabilitiesPage = lazy(() =>
  import('./pages/CapabilitiesPage').then((module) => ({ default: module.CapabilitiesPage })),
)
const DocumentationPage = lazy(() =>
  import('./pages/DocumentationPage').then((module) => ({ default: module.DocumentationPage })),
)
const InstallationGuidePage = lazy(() =>
  import('./pages/InstallationGuidePage').then((module) => ({ default: module.InstallationGuidePage })),
)
const DocPage = lazy(() => import('./pages/DocPage').then((module) => ({ default: module.DocPage })))
const GuidePage = lazy(() => import('./pages/GuidePage').then((module) => ({ default: module.GuidePage })))
const ProductPage = lazy(() => import('./pages/ProductPage').then((module) => ({ default: module.ProductPage })))
const WorkspacePage = lazy(() =>
  import('./pages/WorkspacePage').then((module) => ({ default: module.WorkspacePage })),
)
const SupportPage = lazy(() => import('./pages/SupportPage').then((module) => ({ default: module.SupportPage })))

/** Matches `base` in `vite.config.ts` (e.g. GitHub Pages subpath). Root deploy uses `undefined`. */
const routerBasename =
  (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '') || undefined

function RouteLoading() {
  return (
    <main id="main-content" className="route-loading" aria-busy="true" aria-live="polite">
      <span className="route-loading__signal" aria-hidden />
      Loading interface
    </main>
  )
}

export default function App() {
  // Respect prefers-reduced-motion; with Reduce motion off in System Settings, motion runs at full strength.
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename={routerBasename}>
        <ScrollToTop />
        <Routes>
          {Object.entries(LEGACY_MD_TO_SLUG).map(([legacyPath, slug]) => (
            <Route
              key={legacyPath}
              path={legacyPath}
              element={<Navigate to={`/docs/${slug}`} replace />}
            />
          ))}
          <Route element={<PageShell />}>
            <Route path="/" element={<Suspense fallback={<RouteLoading />}><HomePage /></Suspense>} />
            <Route path="/guide" element={<Suspense fallback={<RouteLoading />}><GuidePage /></Suspense>} />
            <Route path="/documentation" element={<Suspense fallback={<RouteLoading />}><DocumentationPage /></Suspense>} />
            <Route path="/docs/installation" element={<Suspense fallback={<RouteLoading />}><InstallationGuidePage /></Suspense>} />
            <Route path="/docs/:slug" element={<Suspense fallback={<RouteLoading />}><DocPage /></Suspense>} />
            <Route path="/support" element={<Suspense fallback={<RouteLoading />}><SupportPage /></Suspense>} />
            <Route path="/capabilities" element={<Suspense fallback={<RouteLoading />}><CapabilitiesPage /></Suspense>} />
            <Route path="/product" element={<Suspense fallback={<RouteLoading />}><ProductPage /></Suspense>} />
            <Route path="/workspace" element={<Suspense fallback={<RouteLoading />}><WorkspacePage /></Suspense>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}
