import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { renderRss } from '../scripts/emit-route-pages.mjs'
import { BLOG_POSTS, publicRoutes } from '../scripts/site-routes.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const blogDir = path.join(root, 'src/content/blog')

test('every registered post has markdown and every markdown file is registered', () => {
  const slugs = BLOG_POSTS.map((post) => post.slug)
  assert.equal(new Set(slugs).size, slugs.length, 'duplicate blog slug')
  const files = fs.readdirSync(blogDir).filter((name) => name.endsWith('.md'))
  assert.deepEqual(
    files.map((name) => name.replace(/\.md$/, '')).sort(),
    [...slugs].sort(),
  )
  for (const post of BLOG_POSTS) {
    assert.match(post.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, post.slug)
    assert.match(post.date, /^\d{4}-\d{2}-\d{2}$/, post.slug)
    assert.equal(Number.isNaN(Date.parse(`${post.date}T00:00:00Z`)), false, post.slug)
    assert.ok(post.title.trim(), post.slug)
    assert.ok(post.description.length > 20, post.slug)
  }
})

test('site links in blog posts point at registered routes', () => {
  const routePaths = new Set(publicRoutes().map((route) => route.path))
  const failures = []
  for (const name of fs.readdirSync(blogDir).filter((file) => file.endsWith('.md'))) {
    const source = fs.readFileSync(path.join(blogDir, name), 'utf8')
    for (const match of source.matchAll(/\[[^\]]*]\(([^)]+)\)/g)) {
      const target = match[1].trim().split('#', 1)[0].split('?', 1)[0]
      if (!target.startsWith('/')) continue
      const normalized = target.length > 1 ? target.replace(/\/$/, '') : target
      if (!routePaths.has(normalized)) failures.push(`${name} → unknown route ${target}`)
    }
  }
  assert.deepEqual(failures, [])
})

test('rss feed lists posts newest first with absolute links and escaped text', () => {
  const posts = [
    { slug: 'older', title: 'Older', date: '2026-01-02', description: 'First post for the feed test.' },
    { slug: 'newer', title: 'Ship & <review>', date: '2026-03-04', description: 'Uses "quotes" & brackets.' },
  ]
  const xml = renderRss(posts, '/agentic-swe/')
  assert.match(xml, /^<\?xml version="1.0" encoding="UTF-8"\?>/)
  assert.match(xml, /<link>https:\/\/agentic-swe\.github\.io\/agentic-swe\/blog\/<\/link>/)
  assert.match(
    xml,
    /<atom:link href="https:\/\/agentic-swe\.github\.io\/agentic-swe\/rss\.xml" rel="self" type="application\/rss\+xml" \/>/,
  )
  assert.match(xml, /<title>Ship &amp; &lt;review&gt;<\/title>/)
  assert.match(xml, /<description>Uses &quot;quotes&quot; &amp; brackets\.<\/description>/)
  assert.match(xml, /<guid isPermaLink="true">https:\/\/agentic-swe\.github\.io\/agentic-swe\/blog\/newer\/<\/guid>/)
  assert.match(xml, /<pubDate>Wed, 04 Mar 2026 00:00:00 GMT<\/pubDate>/)
  assert.match(xml, /<lastBuildDate>Wed, 04 Mar 2026 00:00:00 GMT<\/lastBuildDate>/)
  assert.ok(xml.indexOf('/blog/newer/') < xml.indexOf('/blog/older/'), 'newest post first')
  assert.equal(xml.match(/<item>/g).length, 2)
})

test('rss feed rejects an invalid post date', () => {
  assert.throws(
    () => renderRss([{ slug: 'bad', title: 'Bad', date: '2026-13-40', description: 'Not a real date.' }], '/'),
    /invalid blog post date/,
  )
})
