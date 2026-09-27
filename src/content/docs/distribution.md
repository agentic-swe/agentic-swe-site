# Distribution

How people get the pack today. Publishing mechanics for maintainers are on the [Release checklist](release-checklist.md).

Reviewed 27 Sep 2026. Runtime source **3.3.1** includes [merged pull request #71](https://github.com/agentic-swe/agentic-swe/pull/71). The npm registry still listed `@agentic-swe/agentic-swe` at **3.3.0**; install from the current source tree when you need the merged adapters.

## Channels you can use

| Channel | What you get |
|---------|----------------|
| **`agentic-swe setup --host <host>`** | The primary install, from a checkout of the reviewed source or from a CLI whose help lists that host. See [Installation](/docs/installation#overview). |
| **Claude Code marketplace** | **`/plugin marketplace add agentic-swe/agentic-swe`** then **`/plugin install agentic-swe@agentic-swe-catalog`**. Setup runs these when the Claude CLI is available. |
| **Cursor local plugin** | Setup writes **`~/.cursor/plugins/local/agentic-swe`**. |
| **Source checkout** | Clone [agentic-swe/agentic-swe](https://github.com/agentic-swe/agentic-swe) to develop the pack or to run setup from that tree. |
| **This site** | Guides and reference at [agentic-swe.github.io/agentic-swe-site](https://agentic-swe.github.io/agentic-swe-site/). |
| **npm** | Package **`@agentic-swe/agentic-swe`**. At this review the published version was **3.3.0**. Check **`agentic-swe version`** before you rely on a host adapter. |

Gemini CLI still loads **`gemini-extension.json`** and **`GEMINI.md`**. That context file is not the Antigravity hook adapter.

## Docs site

The public site is GitHub Pages for **agentic-swe-site**. Documentation routes under **`/docs/*`** render the markdown in this site repository.

A custom domain, when one is configured, follows [GitHub’s custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Maintainers

Release wiring, smoke, and the record you keep before a tag are on the [Release checklist](release-checklist.md). Do not describe an npm version as current until it is the version **`npm view`** returns.
