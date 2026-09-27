/**
 * Doc slugs, titles, and bundled markdown paths (see DocPage glob).
 */
export const GITHUB_REPO_MAIN = 'https://github.com/agentic-swe/agentic-swe/blob/main'

export const DOC_SLUGS = [
  'installation',
  'golden-path',
  'host-support-tiers',
  'multi-platform-support',
  'usage',
  'durable-memory',
  'catalog-routing',
  'troubleshooting',
  'claude-code-plugin',
  'cursor-plugin',
  'check-commands',
  'examples',
  'distribution',
  'release-checklist',
  'subagent-catalog',
  'product-positioning',
  'adoption-one-pager',
  'licensing',
  'privacy',
  'opencode',
  'codex',
  'antigravity',
  'doubt-driven-verification',
  'cross-model-review',
  'context-packs',
  'owai-spec',
  'policy-as-code',
  'adaptive-track-router',
  'runtime-facade',
  'glossary',
] as const

export type DocSlug = (typeof DOC_SLUGS)[number]

export type DocMeta = {
  title: string
  description?: string
  /** Path relative to DocPage for import.meta.glob */
  globKey: string
}

/** Basename in content/docs → slug (for markdown link rewriting). */
export const MARKDOWN_FILE_TO_SLUG: Record<string, DocSlug> = {
  'installation.md': 'installation',
  'golden-path.md': 'golden-path',
  'host-support-tiers.md': 'host-support-tiers',
  'multi-platform-support.md': 'multi-platform-support',
  'usage.md': 'usage',
  'durable-memory.md': 'durable-memory',
  'catalog-routing.md': 'catalog-routing',
  'troubleshooting.md': 'troubleshooting',
  'claude-code-plugin.md': 'claude-code-plugin',
  'cursor-plugin.md': 'cursor-plugin',
  'check-commands.md': 'check-commands',
  'examples.md': 'examples',
  'distribution.md': 'distribution',
  'release-checklist.md': 'release-checklist',
  'subagent-catalog.md': 'subagent-catalog',
  'product-positioning.md': 'product-positioning',
  'adoption-one-pager.md': 'adoption-one-pager',
  'licensing.md': 'licensing',
  'privacy.md': 'privacy',
  'README.opencode.md': 'opencode',
  'README.codex.md': 'codex',
  'antigravity.md': 'antigravity',
  'doubt-driven-verification.md': 'doubt-driven-verification',
  'cross-model-review.md': 'cross-model-review',
  'context-packs.md': 'context-packs',
  'owai-spec.md': 'owai-spec',
  'policy-as-code.md': 'policy-as-code',
  'adaptive-track-router.md': 'adaptive-track-router',
  'runtime-facade.md': 'runtime-facade',
  'glossary.md': 'glossary',
}

export const DOC_REGISTRY: Record<DocSlug, DocMeta> = {
  installation: {
    title: 'Installation Guide',
    description:
      'Primary path: agentic-swe setup --host. Claude Code, Cursor, Codex, OpenCode, Antigravity, VS Code, Windsurf, Kiro, and Copilot.',
    globKey: '../content/docs/installation.md',
  },
  'golden-path': {
    title: 'Golden path (15 minutes)',
    description: 'Claude Code: setup → /work → .worklogs → gate; lean and standard examples.',
    globKey: '../content/docs/golden-path.md',
  },
  'host-support-tiers': {
    title: 'Host capabilities',
    description:
      'Stable, partial, and instruction-only hosts: lifecycle adapters, hook trust, Restricted Mode, and MCP fallback.',
    globKey: '../content/docs/host-support-tiers.md',
  },
  'multi-platform-support': {
    title: 'Multi-platform support',
    description:
      'One pack across coding hosts. Setup command, hook files, and what each lifecycle actually runs.',
    globKey: '../content/docs/multi-platform-support.md',
  },
  usage: {
    title: 'Usage',
    description: 'How to run the pipeline: /work, tracks, commands, and worklogs.',
    globKey: '../content/docs/usage.md',
  },
  'durable-memory': {
    title: 'Durable memory',
    description:
      'Automatic local memory on the normal session lifecycle. npm commands are bootstrap, diagnosis, and recovery.',
    globKey: '../content/docs/durable-memory.md',
  },
  'catalog-routing': {
    title: 'Catalog routing & CI',
    description: 'catalog:lint, catalog:route, semantic index, model tier hints, session-start.',
    globKey: '../content/docs/catalog-routing.md',
  },
  troubleshooting: {
    title: 'Troubleshooting',
    description: 'Setup, doctor, host parity, hook receipts, trust, Restricted Mode, and MCP fallback.',
    globKey: '../content/docs/troubleshooting.md',
  },
  'claude-code-plugin': {
    title: 'Claude Code plugin',
    description: 'Manifest, layout, commands vs skills, and validation.',
    globKey: '../content/docs/claude-code-plugin.md',
  },
  'cursor-plugin': {
    title: 'Cursor plugin',
    description: 'Setup installs the local plugin, session start and stop hooks, and the target CLAUDE.md merge.',
    globKey: '../content/docs/cursor-plugin.md',
  },
  'check-commands': {
    title: '/check commands',
    description: 'Budget, transition, and artifact enforcement.',
    globKey: '../content/docs/check-commands.md',
  },
  examples: {
    title: 'Examples',
    description: 'Sample prompts and artifact shapes.',
    globKey: '../content/docs/examples.md',
  },
  distribution: {
    title: 'Distribution',
    description: 'Current ways to get the pack: setup, marketplace, source checkout, this site, and npm.',
    globKey: '../content/docs/distribution.md',
  },
  'release-checklist': {
    title: 'Release checklist',
    description: 'Automated checks and manual smoke before tags (maintainers).',
    globKey: '../content/docs/release-checklist.md',
  },
  'subagent-catalog': {
    title: 'Subagent catalog',
    description: 'Specialist agents and selection.',
    globKey: '../content/docs/subagent-catalog.md',
  },
  'product-positioning': {
    title: 'Product fit',
    description: 'When the local workflow pack fits, and when it does not.',
    globKey: '../content/docs/product-positioning.md',
  },
  'adoption-one-pager': {
    title: 'Who this is for',
    description: 'A short evaluation sheet: what a pilot includes and what this repository does not ship.',
    globKey: '../content/docs/adoption-one-pager.md',
  },
  licensing: {
    title: 'Licensing',
    description: 'MIT terms for using and redistributing the pack. Not legal advice.',
    globKey: '../content/docs/licensing.md',
  },
  privacy: {
    title: 'Privacy',
    description:
      'Local transcripts, memory files, hook receipts, host model processing, and optional off-machine calls.',
    globKey: '../content/docs/privacy.md',
  },
  opencode: {
    title: 'OpenCode',
    description: 'Setup, chat-turn lifecycle, and where work state lives.',
    globKey: '../content/docs/README.opencode.md',
  },
  codex: {
    title: 'Codex',
    description: 'Setup, hook trust, and automatic memory after you approve hooks.',
    globKey: '../content/docs/README.codex.md',
  },
  antigravity: {
    title: 'Google Antigravity',
    description: 'Setup, PreInvocation and Stop hooks, and how that differs from Gemini CLI.',
    globKey: '../content/docs/antigravity.md',
  },
  'doubt-driven-verification': {
    title: 'Doubt-Driven Verification',
    description: 'Bounded adversarial review protocol: CLAIM/EXTRACT/DOUBT/RECONCILE/STOP with 3-cycle cap.',
    globKey: '../content/docs/doubt-driven-verification.md',
  },
  'cross-model-review': {
    title: 'Cross-model review',
    description: 'Fourth panel axis using Codex/Gemini CLIs with sandbox-read-only safety.',
    globKey: '../content/docs/cross-model-review.md',
  },
  'context-packs': {
    title: 'Context packs',
    description: 'Typed, schema-validated artifact for delegation: five-level hierarchy and trust levels.',
    globKey: '../content/docs/context-packs.md',
  },
  'owai-spec': {
    title: 'OWAI specification',
    description: 'Open Work-item Interchange spec with L1/L2/L3 conformance levels.',
    globKey: '../content/docs/owai-spec.md',
  },
  'policy-as-code': {
    title: 'Policy-as-Code',
    description: 'Typed org/repo policies for track rules, mandatory subagents, and budget overrides.',
    globKey: '../content/docs/policy-as-code.md',
  },
  'adaptive-track-router': {
    title: 'Adaptive Track Router',
    description: 'Cost-aware track selection learned from completed worklogs via TF-IDF similarity.',
    globKey: '../content/docs/adaptive-track-router.md',
  },
  'runtime-facade': {
    title: 'Runtime facade',
    description:
      'Typed actions with adapters for Claude Code, Cursor, Codex, OpenCode, and Gemini CLI.',
    globKey: '../content/docs/runtime-facade.md',
  },
  glossary: {
    title: 'Glossary',
    description: 'Plain-language definitions: lifecycle, gates, receipts, Restricted Mode, and advisory memory.',
    globKey: '../content/docs/glossary.md',
  },
}

export function isDocSlug(s: string): s is DocSlug {
  return (DOC_SLUGS as readonly string[]).includes(s)
}

/** Old public URLs → slug (for redirects). */
export const LEGACY_MD_TO_SLUG: Record<string, DocSlug> = {
  '/installation.md': 'installation',
  '/golden-path.md': 'golden-path',
  '/host-support-tiers.md': 'host-support-tiers',
  '/usage.md': 'usage',
  '/durable-memory.md': 'durable-memory',
  '/catalog-routing.md': 'catalog-routing',
  '/troubleshooting.md': 'troubleshooting',
  '/claude-code-plugin.md': 'claude-code-plugin',
  '/cursor-plugin.md': 'cursor-plugin',
  '/check-commands.md': 'check-commands',
  '/examples.md': 'examples',
  '/distribution.md': 'distribution',
  '/release-checklist.md': 'release-checklist',
  '/subagent-catalog.md': 'subagent-catalog',
  '/product-positioning.md': 'product-positioning',
  '/adoption-one-pager.md': 'adoption-one-pager',
  '/licensing.md': 'licensing',
  '/privacy.md': 'privacy',
  '/README.opencode.md': 'opencode',
  '/README.codex.md': 'codex',
  '/antigravity.md': 'antigravity',
  '/doubt-driven-verification.md': 'doubt-driven-verification',
  '/cross-model-review.md': 'cross-model-review',
  '/context-packs.md': 'context-packs',
  '/owai-spec.md': 'owai-spec',
  '/policy-as-code.md': 'policy-as-code',
  '/adaptive-track-router.md': 'adaptive-track-router',
  '/runtime-facade.md': 'runtime-facade',
  '/glossary.md': 'glossary',
}
