import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/** GitHub project Pages: `https://<owner>.github.io/<repo>/` → set `VITE_BASE=/<repo>/` when building. */
function viteBase(): string {
  const raw = process.env.VITE_BASE?.trim()
  if (!raw || raw === '/') return '/'
  const withSlashes = raw.startsWith('/') ? raw : `/${raw}`
  return withSlashes.endsWith('/') ? withSlashes : `${withSlashes}/`
}

/**
 * Preview matches GitHub Pages: an extensionless directory URL redirects to the
 * trailing-slash index so `curl -L` lands on that route's 200 HTML.
 */
function directoryIndexRedirect(): Plugin {
  return {
    name: 'directory-index-redirect',
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || (req.method !== 'GET' && req.method !== 'HEAD')) return next()
        const question = req.url.indexOf('?')
        const pathname = question === -1 ? req.url : req.url.slice(0, question)
        const search = question === -1 ? '' : req.url.slice(question)
        if (pathname.endsWith('/') || path.posix.extname(pathname)) return next()
        const base = server.config.base === '/' ? '' : server.config.base.replace(/\/$/, '')
        if (base && pathname !== base && !pathname.startsWith(`${base}/`)) return next()
        const relative = (base ? pathname.slice(base.length) : pathname).replace(/^\//, '')
        const indexFile = path.resolve(server.config.root, server.config.build.outDir, relative, 'index.html')
        if (!fs.existsSync(indexFile)) return next()
        res.statusCode = 301
        res.setHeader('Location', `${pathname}/${search}`)
        res.end()
      })
    },
  }
}

const DEFAULT_PLAUSIBLE_SRC = 'https://plausible.io/js/script.js'

/**
 * Cookieless Plausible pageviews, only when `VITE_PLAUSIBLE_DOMAIN` is set.
 * The script records history navigation itself, so SPA route changes count without app code.
 */
function plausibleAnalytics(domain: string | undefined, src: string | undefined): Plugin {
  const dataDomain = domain?.trim()
  const scriptSrc = src?.trim() || DEFAULT_PLAUSIBLE_SRC
  if (dataDomain && !/^[a-z0-9.-]+(,[a-z0-9.-]+)*$/i.test(dataDomain)) {
    throw new Error(`VITE_PLAUSIBLE_DOMAIN must be a comma-separated list of hostnames, got "${dataDomain}"`)
  }
  if (dataDomain && !/^https:\/\/[^\s"'<>]+$/.test(scriptSrc)) {
    throw new Error(`VITE_PLAUSIBLE_SRC must be an https URL, got "${scriptSrc}"`)
  }
  return {
    name: 'plausible-analytics',
    transformIndexHtml() {
      if (!dataDomain) return []
      return [
        {
          tag: 'script',
          attrs: { defer: true, 'data-domain': dataDomain, src: scriptSrc },
          injectTo: 'head',
        },
      ]
    },
  }
}

// Production bundle → site/dist/ (deploy this folder, not the whole site/ tree).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [
      react(),
      directoryIndexRedirect(),
      plausibleAnalytics(env.VITE_PLAUSIBLE_DOMAIN, env.VITE_PLAUSIBLE_SRC),
    ],
    base: viteBase(),
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
  }
})
