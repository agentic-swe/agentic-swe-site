import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { assertResponsiveCss, assertSetupHosts } from '../scripts/audit-checks.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

test('homepage shells wrap at a phone width instead of clipping', () => {
  const css = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8')
  assertResponsiveCss(css)
})

test('setup host picker includes Windsurf, Kiro, and Copilot without renaming VS Code', () => {
  assertSetupHosts()
})
