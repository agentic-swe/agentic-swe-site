# Distribution

How people get the pack today. Publishing mechanics for maintainers are on the [Release checklist](release-checklist.md).

Current pack **3.4.0** is the GitHub `main` line ([pull request #73](https://github.com/agentic-swe/agentic-swe/pull/73)). The GitHub installer tracks `main` and installs that version. `agentic-swe work status` shows the active work item.

## Channels you can use

| Channel | What you get |
|---------|----------------|
| **`agentic-swe setup --host <host>`** | The primary install, from a checkout of the current source or from a CLI whose help lists that host. See [Installation](/docs/installation#overview). |
| **Claude Code marketplace** | **`/plugin marketplace add agentic-swe/agentic-swe`** then **`/plugin install agentic-swe@agentic-swe-catalog`**. Setup runs these when the Claude CLI is available. |
| **Cursor local plugin** | Setup writes **`~/.cursor/plugins/local/agentic-swe`**. |
| **Source checkout** | Clone [agentic-swe/agentic-swe](https://github.com/agentic-swe/agentic-swe) to develop the pack or to run setup from that tree. |
| **This site** | Guides and reference at [agentic-swe.github.io/agentic-swe](https://agentic-swe.github.io/agentic-swe/). |
| **npm** | Optional mirror **`@agentic-swe/agentic-swe`**. Use it only when **`npm view @agentic-swe/agentic-swe version`** reports **3.4.0**. Until then, use the GitHub installer. |

Gemini CLI still loads **`gemini-extension.json`** and **`GEMINI.md`**. That context file is not the Antigravity hook adapter.

## Docs site

The public site is GitHub Pages for **agentic-swe**, built from the **agentic-swe-site** repository. Documentation routes under **`/docs/*`** render the markdown in that site repository. Old **`/agentic-swe-site/`** links redirect to the same page.

A custom domain, when one is configured, follows [GitHub’s custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Maintainers

Release wiring, smoke, and the record you keep before a tag are on the [Release checklist](release-checklist.md). Do not describe an npm version as current until it is the version **`npm view`** returns.
