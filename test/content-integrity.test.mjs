import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { publicRoutes } from '../scripts/site-routes.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const docsDir = path.join(root, 'src/content/docs')

function markdownFiles(dir = docsDir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) markdownFiles(full, files)
    else if (entry.name.endsWith('.md')) files.push(full)
  }
  return files
}

test('relative markdown links resolve and public route links are registered', () => {
  const routePaths = new Set(publicRoutes().map((route) => route.path))
  const failures = []

  for (const file of markdownFiles()) {
    const source = fs.readFileSync(file, 'utf8')
    for (const match of source.matchAll(/\[[^\]]*]\(([^)]+)\)/g)) {
      const raw = match[1].trim().replace(/^<|>$/g, '')
      if (!raw || raw.startsWith('#') || /^(?:https?:|mailto:)/.test(raw)) continue
      const target = raw.split('#', 1)[0].split('?', 1)[0]
      if (!target) continue
      if (target.startsWith('/')) {
        const normalized = target.length > 1 ? target.replace(/\/$/, '') : target
        if (!routePaths.has(normalized)) {
          failures.push(`${path.relative(root, file)} → unknown route ${target}`)
        }
        continue
      }
      const resolved = path.resolve(path.dirname(file), target)
      if (!resolved.startsWith(docsDir + path.sep) || !fs.existsSync(resolved)) {
        failures.push(`${path.relative(root, file)} → missing file ${target}`)
      }
    }
  }

  assert.deepEqual(failures, [])
})

test('public content rejects retired claims and the previously broken nested source link', () => {
  const files = [
    ...markdownFiles(),
    ...['src/components', 'src/pages'].flatMap((directory) => {
      const absolute = path.join(root, directory)
      return fs.readdirSync(absolute)
        .filter((name) => /\.(?:ts|tsx)$/.test(name))
        .map((name) => path.join(absolute, name))
    }),
  ]
  const retired = [
    'Durable memory (optional)',
    'VS Code and Codex include',
    'Antigravity loads GEMINI',
    'Roadmap Phase 1',
    'Primary ICP',
    'socializing',
    'What not to claim',
    '/agentic-swe/blob/main/site/src/content/docs/',
    'open cross-host pull request',
    'open as of',
    'was open on',
    '3.3.1 plus [pull request #71]',
    'Reviewed 27 Sep 2026',
    'docs reviewed',
    'Pack version reviewed',
    'Source reviewed on',
    'agentic-swe.github.io/agentic-swe-site',
  ]

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8')
    for (const phrase of retired) {
      assert.equal(
        source.includes(phrase),
        false,
        `${path.relative(root, file)} still contains retired text: ${phrase}`,
      )
    }
  }
})

test('current lifecycle boundaries and privacy disclosures remain visible', () => {
  const hostSupport = fs.readFileSync(path.join(docsDir, 'host-support-tiers.md'), 'utf8')
  for (const host of ['Windsurf', 'Kiro', 'GitHub Copilot', 'VS Code', 'Cline', 'Roo Code', 'Continue', 'Junie', 'Zed']) {
    assert.match(hostSupport, new RegExp(host.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  }
  assert.match(hostSupport, /MCP does not imply transcript access/)
  assert.match(hostSupport, /merged pull request #71/)

  const privacy = fs.readFileSync(path.join(docsDir, 'privacy.md'), 'utf8')
  for (const disclosure of [
    'Local transcript scoring',
    '.agentic-swe/memory.sqlite',
    '.agentic-swe/hook-receipts.jsonl',
    '.agentic-swe/hook-notice.md',
    'best-effort',
  ]) {
    assert.ok(privacy.includes(disclosure), `privacy page is missing ${disclosure}`)
  }
})
