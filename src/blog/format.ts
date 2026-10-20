import { BLOG_POSTS, type BlogPost } from './posts.js'

const DATE_FORMAT = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })

/** Calendar dates render in UTC so a post never shows the previous day west of Greenwich. */
export function formatPostDate(isoDate: string): string {
  return DATE_FORMAT.format(new Date(`${isoDate}T00:00:00Z`))
}

export function postsNewestFirst(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date))
}

export const rssHref = `${import.meta.env.BASE_URL ?? '/'}rss.xml`
