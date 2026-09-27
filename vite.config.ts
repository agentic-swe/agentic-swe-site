import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
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

// Production bundle → site/dist/ (deploy this folder, not the whole site/ tree).
export default defineConfig({
  plugins: [react(), directoryIndexRedirect()],
  base: viteBase(),
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
