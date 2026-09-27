# Durable memory

Reviewed 27 Sep 2026 against runtime source **3.3.1**, including [merged pull request #71](https://github.com/agentic-swe/agentic-swe/pull/71) (merge commit `3d9788d`). npm still listed **3.3.0**, which does not include the new adapters.

The pack keeps a **local** project index in **`.agentic-swe/memory.sqlite`** and injects a bounded **memory prime** digest into the session. The digest is **advisory**. **`state.json`**, **`progress.md`**, and repository files stay authoritative.

You do not run npm commands after each task. Session start and session stop run the same maintenance cycle.

Spec for tables and retrieval modes: [memory-graph.md](https://github.com/agentic-swe/agentic-swe/blob/main/docs/specs/memory-graph.md).

## What runs automatically

On a normal lifecycle the hook:

- indexes markdown that changed since the last session
- refreshes **`.agentic-swe/lessons.json`** and **`.agentic-swe/style-profile.json`**
- scores the transcript and stores a node only when evidence converges (a decision, a lesson, or a well-formed command plus a path or outcome)
- quarantines malformed or duplicate procedures in **`.agentic-swe/procedures.json`**
- writes **`.agentic-swe/hook-receipts.jsonl`**
- writes **`.agentic-swe/hook-notice.md`** when a step fails, and injects that notice into the next session

Prose that only looks like a command is dropped. Secrets that match the pack’s patterns are redacted before storage. That redaction is best-effort, not a guarantee.

## Which hosts run it

| Host | Transcript capture |
|------|--------------------|
| Claude Code, Cursor, OpenCode, Codex, Antigravity, Windsurf, Kiro | Yes, when the host boundary in [Host capabilities](host-support-tiers.md) is satisfied |
| GitHub Copilot CLI and coding agent | Yes when those hooks run. IDE chat coverage varies |
| Generic VS Code | Maintenance only. No agent transcript |
| Cline, Roo, Continue, Junie, Zed | No automatic capture. MCP tools are explicit |

Codex capture waits on hook trust. Windsurf capture waits on Restricted Mode being off.

## Opt out

| Variable | Effect |
|----------|--------|
| **`AGENTIC_SWE_HOOK_LIFECYCLE=0`** | Skip indexing, reflection, and procedure hygiene |
| **`AGENTIC_SWE_MEMORY_PRIME=0`** | Skip the injected digest. Prime is on unless you set this |
| **`AGENTIC_SWE_GIT_WARM=0`** | Skip git team-chunk warm at session start |
| **`AGENTIC_SWE_CHAT_WARM=0`** | Skip transcript and organic-work warm at session start |
| **`AGENTIC_SWE_EVOLVE_ON_STOP=0`** | Skip evolution on stop |
| **`AGENTIC_SWE_PROJECT_ROOT`** | Project root. Otherwise the hook `cwd`, then the shell directory |
| **`AGENTIC_SWE_MEMORY_PRIME_QUERY`** | Default query when the CLI is not given one |
| **`AGENTIC_SWE_WORK_DIR`** | When set to **`.worklogs/<id>`**, prime receives that work id |

Skill scaffold on stop stays off unless **`AGENTIC_SWE_EVOLVE_SKILLS=1`**.

## Bootstrap, diagnostics, and recovery

Run these from a pack checkout, or with **`${CLAUDE_PLUGIN_ROOT}`** pointing at the installed pack. They are not part of normal task flow.

| Command | When |
|---------|------|
| **`npm run memory-index`** | Rebuild the full graph after a corrupt index, or before you enable embeddings |
| **`npm run memory-prime`** | Print the digest the hook would inject |
| **`npm run memory-reflect`** | Rebuild lessons when a receipt says reflection failed |
| **`npm run cold-start-warm`** | Warm a repository outside the hook path |
| **`npm run memory-compact`** | Write **`context-compact.md`** for one work item (**`--work-dir`**) |
| **`npm run memory-import`** | Merge a JSON bundle. Needs **`import_adapter.enabled`** or **`--force`** |
| **`npm run memory-sliding-summary`** | Build **`sliding-summary.md`** from a transcript file |

Config merges **`config/memory.default.json`**, then **`AGENTIC_SWE_MEMORY_CONFIG`**, then **`.agentic-swe/memory.json`** in the target project.

Personal chunks live in **`~/.agentic-swe/memory.sqlite`** (override **`AGENTIC_SWE_PERSONAL_ROOT`**). Team events under **`.agentic-swe/sync/events/`** are ingested into the **project** database. Both stay on disk until you delete them or commit them yourself.

## Retrieval and embeddings

Default **`prime.retrieval_mode`** is **`auto`**: hybrid lexical plus semantic retrieval when embedding rows exist, otherwise lexical.

Embeddings are **off** until you set **`embeddings.enabled`** and a provider:

- **`ollama`** on your machine
- **`openai`**, which sends chunk text to OpenAI
- **`test`**, deterministic vectors for CI

The same switch feeds [catalog semantic routing](catalog-routing.md). An optional sliding-summary LLM and [cross-model review](cross-model-review.md) are separate opt-ins. They are not part of the default lifecycle.

## Related

- [Host capabilities](host-support-tiers.md) · [Usage](usage.md) · [Privacy](privacy.md) · [Glossary](glossary.md)
