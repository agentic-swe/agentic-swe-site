import { Link } from 'react-router-dom'
import { formatPostDate, postsNewestFirst, rssHref } from '../blog/format'

export function BlogPage() {
  const posts = postsNewestFirst()

  return (
    <main id="main-content" className="page-main reveal visible blog-page">
      <p className="section-label">// blog</p>
      <h1>Blog</h1>
      <p className="blog-lede">
        Release notes, design decisions, and field notes for the open-source pack. Subscribe with{' '}
        <a href={rssHref}>RSS</a>.
      </p>

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ol className="blog-list">
          {posts.map((post) => (
            <li key={post.slug} className="blog-list__item">
              <Link className="hub-card" to={`/blog/${post.slug}`}>
                <time className="blog-date" dateTime={post.date}>
                  {formatPostDate(post.date)}
                </time>
                <h2 className="blog-list__title">{post.title}</h2>
                <p>{post.description}</p>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </main>
  )
}
