#!/usr/bin/env node
/**
 * Sync catalog counts from a local agentic-swe pack into this site:
 *   - rewrites src/data/catalog-counts.ts
 *   - rewrites <!-- catalog-counts:start kind=... --> ... <!-- catalog-counts:end --> blocks
 *     in docs and HTML files
 *
 * Usage:
 *   AGENTIC_SWE_PACK=/path/to/agentic-swe node scripts/sync-catalog-counts.mjs
 *   AGENTIC_SWE_PACK=/path/to/agentic-swe node scripts/sync-catalog-counts.mjs --check
 *
 * If AGENTIC_SWE_PACK is not set, defaults to "../agentic-swe" relative to repo root.
 *
 * Cross-repo SoT note:
 *   The truth lives in the agentic-swe pack at agents/subagents/. This script reads it
 *   and propagates downstream. Run after the pack ships a new version.
 *   The agentic-swe pack itself uses scripts/render-catalog-counts.cjs for its own
 *   docs; this script mirrors that pattern.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');

const PACK_ROOT = process.env.AGENTIC_SWE_PACK
  ? path.resolve(process.env.AGENTIC_SWE_PACK)
  : path.resolve(SITE_ROOT, '..', 'agentic-swe');

const SUBAGENTS_ROOT = path.join(PACK_ROOT, 'agents', 'subagents');

const CATEGORY_LABELS = {
  'language-specialists': 'Language Specialists',
  'infrastructure': 'Infrastructure',
  'quality-security': 'Quality & Security',
  'data-ai': 'Data & AI',
  'developer-experience': 'Developer Experience',
  'specialized-domains': 'Specialized Domains',
  'business-product': 'Business & Product',
  'core-development': 'Core Development',
  'meta-orchestration': 'Meta & Orchestration',
  'research-analysis': 'Research & Analysis',
};

const DOC_TARGETS = [
  // index.html intentionally omitted — meta description doesn't accept HTML comments
  // inside attribute strings, so we keep the count hardcoded there and rely on a
  // manual bump (rare; it's a single line). The TS data module + marker docs
  // below catch the common-case drift.
  'src/content/docs/usage.md',
  'src/content/docs/adoption-one-pager.md',
  'src/content/docs/subagent-catalog.md',
];

const TS_DATA_FILE = 'src/data/catalog-counts.ts';

const MARKER_RE = /<!--\s*catalog-counts:start\s+kind=([\w-]+)\s*-->(\r?\n)?([\s\S]*?)(\r?\n)?<!--\s*catalog-counts:end\s*-->/g;

function computeCounts() {
  if (!fs.existsSync(SUBAGENTS_ROOT)) {
    throw new Error(
      `agentic-swe pack not found at ${PACK_ROOT}. Set AGENTIC_SWE_PACK=/path/to/agentic-swe`
    );
  }
  const byCategory = {};
  for (const dirent of fs.readdirSync(SUBAGENTS_ROOT, { withFileTypes: true })) {
    if (!dirent.isDirectory() || dirent.name === 'custom') continue;
    const dir = path.join(SUBAGENTS_ROOT, dirent.name);
    const count = fs.readdirSync(dir).filter((f) => f.endsWith('.md')).length;
    if (count > 0) byCategory[dirent.name] = count;
  }
  const categories = Object.entries(byCategory)
    .map(([slug, count]) => ({ slug, label: CATEGORY_LABELS[slug] || slug, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  const total = categories.reduce((sum, c) => sum + c.count, 0);
  return { total, categories };
}

function renderTable(counts) {
  return [
    '| Category | Count |',
    '|----------|------:|',
    ...counts.categories.map((c) => `| ${c.label} | ${c.count} |`),
  ].join('\n');
}

function renderInline(counts) {
  const parts = counts.categories.map((c) => `${c.label} (${c.count})`);
  return `Across ${counts.categories.length} categories — ${parts.join(', ')}.`;
}

function renderShortTotal(counts) { return `${counts.total}+ subagents`; }
function renderTotalLine(counts) { return `${counts.total}+ specialized subagents`; }
function renderTotal(counts) { return `${counts.total}+`; }
function renderCategoryCount(counts, slug) {
  const cat = counts.categories.find((c) => c.slug === slug);
  if (!cat) throw new Error(`Unknown category slug: ${slug}`);
  return String(cat.count);
}

function renderForKind(kind, counts) {
  if (kind.startsWith('cat-')) {
    const slug = kind.slice(4);
    return renderCategoryCount(counts, slug);
  }
  switch (kind) {
    case 'table': return renderTable(counts);
    case 'inline': return renderInline(counts);
    case 'short-total': return renderShortTotal(counts);
    case 'total-line': return renderTotalLine(counts);
    case 'total': return renderTotal(counts);
    default: throw new Error(`Unknown kind: ${kind}`);
  }
}

function renderTsModule(counts) {
  const lines = [
    '/**',
    ' * Single source of truth for agentic-swe catalog counts on the marketing/docs site.',
    ' *',
    ' * DO NOT EDIT BY HAND.',
    ' *',
    ' * Regenerate from a local agentic-swe pack checkout:',
    ' *',
    ' *   AGENTIC_SWE_PACK=/path/to/agentic-swe npm run sync:counts',
    ' *',
    ' * Or, if @agentic-swe/agentic-swe is installed locally:',
    ' *',
    ' *   npm run sync:counts',
    ' *',
    ' * The script reads agents/subagents/ from the pack and rewrites this file +',
    ' * the marker blocks in docs.',
    ' */',
    '',
    'export interface CatalogCategory {',
    '  slug: string;',
    '  label: string;',
    '  count: number;',
    '}',
    '',
    'export interface CatalogCounts {',
    '  total: number;',
    '  categories: CatalogCategory[];',
    '}',
    '',
    'export const CATALOG_COUNTS: CatalogCounts = {',
    `  total: ${counts.total},`,
    '  categories: [',
    ...counts.categories.map(
      (c) => `    { slug: '${c.slug}', label: '${c.label.replace(/'/g, "\\'")}', count: ${c.count} },`
    ),
    '  ],',
    '};',
    '',
    'export const CATALOG_TOTAL = CATALOG_COUNTS.total;',
    '',
  ];
  return lines.join('\n');
}

function rewriteMarkers(filePath, counts) {
  if (!fs.existsSync(filePath)) return { status: 'missing' };
  const before = fs.readFileSync(filePath, 'utf8');
  MARKER_RE.lastIndex = 0;
  let touched = false;
  const after = before.replace(MARKER_RE, (_m, kind, lead, _body, trail) => {
    touched = true;
    const body = renderForKind(kind, counts);
    return `<!-- catalog-counts:start kind=${kind} -->${lead || ''}${body}${trail || ''}<!-- catalog-counts:end -->`;
  });
  if (!touched) return { status: 'no-marker' };
  if (after === before) return { status: 'unchanged' };
  return { status: 'changed', after };
}

function main() {
  const check = process.argv.includes('--check');
  const counts = computeCounts();
  let drift = false;
  let updates = 0;

  // TS data module
  const tsPath = path.join(SITE_ROOT, TS_DATA_FILE);
  const tsExpected = renderTsModule(counts);
  const tsActual = fs.existsSync(tsPath) ? fs.readFileSync(tsPath, 'utf8') : '';
  if (tsActual !== tsExpected) {
    if (check) {
      process.stderr.write(`DRIFT: ${TS_DATA_FILE}\n`);
      drift = true;
    } else {
      fs.writeFileSync(tsPath, tsExpected);
      process.stdout.write(`UPDATED: ${TS_DATA_FILE}\n`);
      updates++;
    }
  }

  // Marker blocks
  for (const rel of DOC_TARGETS) {
    const abs = path.join(SITE_ROOT, rel);
    const r = rewriteMarkers(abs, counts);
    if (r.status === 'missing') { process.stderr.write(`MISSING: ${rel}\n`); drift = true; continue; }
    if (r.status === 'no-marker') { process.stderr.write(`NO-MARKER: ${rel}\n`); drift = true; continue; }
    if (r.status === 'changed') {
      if (check) { process.stderr.write(`DRIFT: ${rel}\n`); drift = true; }
      else { fs.writeFileSync(abs, r.after); process.stdout.write(`UPDATED: ${rel}\n`); updates++; }
    } else if (!check) {
      process.stdout.write(`OK: ${rel}\n`);
    }
  }

  if (check && drift) {
    process.stderr.write('\nFix with: npm run sync:counts\n');
    process.exit(1);
  }
  if (!check) {
    process.stdout.write(`\nPack: ${PACK_ROOT}\nTotal subagents: ${counts.total}\nUpdated ${updates} file(s).\n`);
  }
}

try { main(); } catch (err) {
  process.stderr.write(`Error: ${err.message}\n`);
  process.exit(1);
}
