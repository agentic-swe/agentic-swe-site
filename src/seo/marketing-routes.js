/** Static public routes. Doc slugs (src/docs/registry.ts) and blog posts (src/blog/posts.js) are added at build time. */
export const MARKETING_ROUTES = [
  {
    path: '/',
    title: 'Agentic SWE — Engineering work with a record you can review',
    description:
      'Open-source local workflow for AI coding. It records decisions in your repository, waits for a person at approval, and can reuse a proven procedure. No hosted runtime.',
  },
  {
    path: '/product',
    title: 'Product · Agentic SWE',
    description:
      'Agentic SWE is a local workflow and runtime package. Approval waits for a person, then the governed workflow can continue. No hosted service and no invented ROI.',
  },
  {
    path: '/capabilities',
    title: 'Capabilities · Agentic SWE',
    description:
      'Track routing, memory replay, and governance, plus current host coverage: stable native lifecycle, partial Copilot, VS Code maintenance, and an explicit MCP fallback.',
  },
  {
    path: '/guide',
    title: 'How it works · Agentic SWE',
    description:
      'The local state machine, setup CLI, human gates, memory lifecycle, and which hosts actually capture transcripts.',
  },
  {
    path: '/documentation',
    title: 'Documentation · Agentic SWE',
    description:
      'Install, usage, and reference for Agentic SWE. Maintainer checklists are separate from the evaluation path.',
  },
  {
    path: '/support',
    title: 'Support · Agentic SWE',
    description:
      'Fixes for install, hosts, gates, and validation, and where to ask for help with the open-source pack.',
  },
  {
    path: '/workspace',
    title: 'Workspace demo · Agentic SWE',
    description:
      'Static demonstration of a governed work item: phases, a diff, tests, and an approval gate. Nothing on this page changes a repository.',
  },
  {
    path: '/evaluate',
    title: 'Evaluate the project · Agentic SWE',
    description:
      'A plain-language evaluation path for developers, managers, security, stakeholders, and partners. Open source, no hosted runtime, no fabricated traction or ROI.',
  },
  {
    path: '/blog',
    title: 'Blog · Agentic SWE',
    description:
      'Release notes, design decisions, and field notes for the Agentic SWE local workflow pack. Available as an RSS feed.',
  },
  {
    path: '/waitlist',
    title: 'Team and Enterprise waitlist · Agentic SWE',
    description:
      'Join the waitlist for optional paid Team and Enterprise auditor features. The open-source pack stays MIT and local.',
  },
]
