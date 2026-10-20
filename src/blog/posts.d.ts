export type BlogPost = {
  slug: string
  title: string
  /** ISO calendar date, `YYYY-MM-DD`. */
  date: string
  description: string
}

export const BLOG_POSTS: readonly BlogPost[]
