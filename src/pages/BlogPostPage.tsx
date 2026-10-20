import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { formatPostDate, rssHref } from '../blog/format'
import { BLOG_POSTS } from '../blog/posts.js'
import { MarkdownBody } from '../docs/MarkdownBody'

/** Lazy glob: each post is its own chunk, fetched only when its route is visited. */
const rawModules = import.meta.glob<string>('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
})

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = BLOG_POSTS.find((item) => item.slug === slug) ?? null
  const loader = post ? rawModules[`../content/blog/${post.slug}.md`] : undefined

  const [loaded, setLoaded] = useState<{ slug: string; markdown: string } | null>(null)
  const [failedSlug, setFailedSlug] = useState<string | null>(null)

  useEffect(() => {
    if (!loader || !post) return
    let cancelled = false
    void loader()
      .then((markdown) => {
        if (!cancelled) setLoaded({ slug: post.slug, markdown })
      })
      .catch(() => {
        if (!cancelled) setFailedSlug(post.slug)
      })
    return () => {
      cancelled = true
    }
  }, [loader, post])

  if (!post) return <Navigate to="/blog" replace />

  if (loader === undefined || failedSlug === post.slug) {
    return (
      <main id="main-content" className="page-main reveal visible">
        <p className="section-label">// blog</p>
        <h1>Missing post</h1>
        <p>
          No bundled content for <code>{post.slug}</code>. <Link to="/blog">Back to the blog</Link>
        </p>
      </main>
    )
  }

  // Only content belonging to the slug currently in the URL may render.
  const markdown = loaded?.slug === post.slug ? loaded.markdown : undefined
  if (markdown === undefined) {
    return (
      <main id="main-content" className="route-loading" aria-busy="true" aria-live="polite">
        <span className="route-loading__signal" aria-hidden />
        Loading {post.title}
      </main>
    )
  }

  return (
    <main id="main-content" className="page-main reveal visible doc-markdown-root doc-article">
      <header className="doc-article__header">
        <p className="section-label">// blog</p>
        <nav className="doc-breadcrumb" aria-label="Breadcrumb">
          <ol className="doc-breadcrumb__list">
            <li className="doc-breadcrumb__item">
              <Link to="/blog">Blog</Link>
            </li>
            <li className="doc-breadcrumb__item" aria-current="page">
              {post.title}
            </li>
          </ol>
        </nav>
        <h1 className="doc-article__title">{post.title}</h1>
        <time className="blog-date" dateTime={post.date}>
          {formatPostDate(post.date)}
        </time>
      </header>

      <MarkdownBody markdown={markdown} />

      <nav className="doc-see-also" aria-label="More from the blog">
        <strong>More</strong> — <Link to="/blog">All posts</Link> · <a href={rssHref}>RSS feed</a>
      </nav>
    </main>
  )
}
