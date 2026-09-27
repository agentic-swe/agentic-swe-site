import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseLegacyRedirects, publicRoutes, readRegistrySource, SITE_ORIGIN } from './site-routes.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const SHELL_SELECTORS = [
  '.content-wrap',
  '.site-header',
  '.site-nav',
  '.site-footer',
  'main',
  '.hero',
  '.hero__inner',
  '.hero__reel',
  '.showreel',
  '.home-section',
  '.page-main',
  '.workspace',
  '.capabilities-page',
]

function ruleBlock(css, selector) {
  const pattern = new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{`)
  const match = pattern.exec(css)
  if (!match) return null
  const start = match.index + match[0].length
  const end = css.indexOf('}', start)
  return css.slice(start, end)
}

export function assertResponsiveCss(css) {
  const errors = []
  const shell = css.match(/\/\* responsive-shells \*\/([\s\S]*?)\n\}/)
  if (!shell) {
    errors.push('missing /* responsive-shells */ block')
  } else {
    const block = shell[1]
    if (!/min-width:\s*0/.test(block)) errors.push('responsive shells missing min-width: 0')
    if (!/max-width:\s*100%/.test(block)) errors.push('responsive shells missing max-width: 100%')
    for (const selector of SHELL_SELECTORS) {
      if (!block.includes(selector)) errors.push(`responsive shells missing ${selector}`)
    }
  }

  const eyebrow = ruleBlock(css, '.hero__eyebrow')
  if (!eyebrow) errors.push('missing .hero__eyebrow')
  else {
    if (!/flex-wrap:\s*wrap/.test(eyebrow)) errors.push('.hero__eyebrow must wrap')
    if (!/max-width:\s*100%/.test(eyebrow)) errors.push('.hero__eyebrow must be max-width 100%')
    if (/white-space:\s*nowrap/.test(eyebrow)) errors.push('.hero__eyebrow must not use nowrap')
  }

  const actions = ruleBlock(css, '.hero__actions')
  if (!actions || !/flex-wrap:\s*wrap/.test(actions) || !/max-width:\s*100%/.test(actions)) {
    errors.push('.hero__actions must wrap within the viewport')
  }

  const title = ruleBlock(css, '.hero__title')
  if (!title || !/max-width:\s*min\(/.test(title)) {
    errors.push('.hero__title must cap width with max-width: min(...)')
  }

  const video = ruleBlock(css, '.showreel__video')
  if (!video || !/max-width:\s*100%/.test(video) || !/min-width:\s*0/.test(video)) {
    errors.push('.showreel__video must shrink below its intrinsic frame size')
  }

  const inlineCode = ruleBlock(css, ':not(pre) > code')
  if (inlineCode && /white-space:\s*nowrap/.test(inlineCode)) {
    errors.push('inline code nowrap expands narrow pages; allow it to wrap')
  }

  if (/overflow-x:\s*(hidden|clip)/.test(css.match(/body\s*\{[^}]*\}/)?.[0] ?? '')) {
    errors.push('body overflow clipping is not the overflow fix')
  }

  if (errors.length) {
    throw new Error(errors.join('\n'))
  }
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, files)
    else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) files.push(full)
  }
  return files
}

export function collectInternalPaths(srcDir = path.join(root, 'src')) {
  const paths = new Set()
  const patterns = [
    /(?:\bto|\bpath)\s*=\s*["'](\/[^"'#?]*)["']/g,
    /\bto:\s*["'](\/[^"'#?]*)["']/g,
    /\bpathname:\s*["'](\/[^"'#?]*)["']/g,
  ]
  for (const file of walk(srcDir)) {
    const text = fs.readFileSync(file, 'utf8')
    for (const pattern of patterns) {
      for (const match of text.matchAll(pattern)) {
        const route = match[1]
        if (!route || route.includes(':') || route.includes('${')) continue
        paths.add(route.length > 1 ? route.replace(/\/$/, '') : route)
      }
    }
  }
  return [...paths].sort()
}

export function assertInternalRouteCoverage(routes = publicRoutes(), legacy = parseLegacyRedirects(readRegistrySource())) {
  const known = new Set(routes.map((route) => route.path))
  for (const redirect of legacy) known.add(redirect.from)
  const missing = collectInternalPaths().filter((route) => !known.has(route))
  if (missing.length) {
    throw new Error(`internal paths missing from public routes:\n${missing.join('\n')}`)
  }
}

export function assertOriginSync() {
  const source = fs.readFileSync(path.join(root, 'src/data/project-status.ts'), 'utf8')
  const match = source.match(/SITE_ORIGIN = '([^']+)'/)
  if (!match || match[1] !== SITE_ORIGIN) {
    throw new Error('SITE_ORIGIN drifted between project-status.ts and site-routes.mjs')
  }
}

export function assertSetupHosts() {
  const source = fs.readFileSync(path.join(root, 'src/setup/automated-setup.ts'), 'utf8')
  const errors = []
  for (const id of ['windsurf', 'kiro', 'copilot', 'vscode', 'claude-code', 'cursor']) {
    if (!source.includes(`id: '${id}'`)) errors.push(`missing setup host ${id}`)
  }
  if (source.includes('VS Code (Copilot)')) errors.push('VS Code must not be named as Copilot')
  if (!source.includes("name: 'VS Code'")) errors.push('generic VS Code label missing')
  if (!source.includes("name: 'GitHub Copilot'")) errors.push('Copilot needs its own host label')
  if (!source.includes("name: 'Windsurf'") || !source.includes("name: 'Kiro'")) {
    errors.push('Windsurf and Kiro labels missing')
  }
  if (errors.length) throw new Error(errors.join('\n'))
}
