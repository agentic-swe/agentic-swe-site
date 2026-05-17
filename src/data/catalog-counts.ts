/**
 * Single source of truth for agentic-swe catalog counts on the marketing/docs site.
 *
 * DO NOT EDIT BY HAND.
 *
 * Regenerate from a local agentic-swe pack checkout:
 *
 *   AGENTIC_SWE_PACK=/path/to/agentic-swe npm run sync:counts
 *
 * Or, if @agentic-swe/agentic-swe is installed locally:
 *
 *   npm run sync:counts
 *
 * The script reads agents/subagents/ from the pack and rewrites this file +
 * the marker blocks in docs.
 */

export interface CatalogCategory {
  slug: string;
  label: string;
  count: number;
}

export interface CatalogCounts {
  total: number;
  categories: CatalogCategory[];
}

export const CATALOG_COUNTS: CatalogCounts = {
  total: 138,
  categories: [
    { slug: 'language-specialists', label: 'Language Specialists', count: 29 },
    { slug: 'infrastructure', label: 'Infrastructure', count: 16 },
    { slug: 'specialized-domains', label: 'Specialized Domains', count: 15 },
    { slug: 'quality-security', label: 'Quality & Security', count: 14 },
    { slug: 'data-ai', label: 'Data & AI', count: 13 },
    { slug: 'developer-experience', label: 'Developer Experience', count: 13 },
    { slug: 'business-product', label: 'Business & Product', count: 11 },
    { slug: 'core-development', label: 'Core Development', count: 10 },
    { slug: 'meta-orchestration', label: 'Meta & Orchestration', count: 10 },
    { slug: 'research-analysis', label: 'Research & Analysis', count: 7 },
  ],
};

export const CATALOG_TOTAL = CATALOG_COUNTS.total;
