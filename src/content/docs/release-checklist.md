# Release checklist (maintainers)

Use before tagging a release or after changing **`hooks/`**, **`.cursor-plugin/`**, **`.opencode/`**, **`GEMINI.md`**, **`.codex/`**, or **`package.json` `files`**.

## First-run story

A **tagged release** should stay aligned with the public **[Golden path](golden-path.md)**: a new user can run **`agentic-swe setup --host <host>`** and reach **`.worklogs/<id>/`** with a trivial task in about **15 minutes**. Before you publish, confirm **`npm view @agentic-swe/agentic-swe version`** before the docs call that version published. Source reviewed on 27 Sep 2026 was **3.3.1**, including [merged pull request #71](https://github.com/agentic-swe/agentic-swe/pull/71); npm still listed **3.3.0**.

1. Re-read **Golden path** for drift (commands, marketplace owner, paths). If you changed **memory** scripts, hooks, or config, re-read **[Durable memory](durable-memory.md)** and the repo **`docs/specs/memory-graph.md`** for drift.
2. Run the **automated** bar below (`npm run ci` or equivalent) so wiring and the docs site still build.
3. Optionally run **`npm run test:smoke`** from repo root when **`ANTHROPIC_API_KEY`** is available — LLM smoke is **not** in default `npm test`; it costs tokens but validates phase routing (see **`test/smoke/README.md`**). Record the outcome in the verification table when you use it.

If Golden path or install tabs are broken, treat that as a **release blocker** even when CI is green.

## Automated (CI / local)

Run from repo root (after **`npm ci`** at root, **`npm ci --prefix site`**, and **`npm ci --prefix agents/plugin-runtime/brainstorm-server`** — same as **GitHub Actions**):

```bash
npm run verify
npm run version:check
npm run lint --prefix site
npm run build --prefix site
npm test
```

Or the single aggregate (expects site **`node_modules`** already installed):

```bash
npm run ci
```

When the **Claude CLI** is on **`PATH`**, the same suite also runs **`claude plugin validate`** inside **`test/install-platform-stubs.test.js`** (skipped automatically if `claude` is missing — e.g. some CI images).

`npm test` includes **`test/install-platform-stubs.test.js`**, which automates **per-platform wiring** (not host UI):

| Area | What the tests assert |
|------|------------------------|
| **Claude Code** | **`plugin.json` / `marketplace.json` / `package.json`** versions match; **`hooks/hooks.json`** SessionStart targets **`hooks/session-start`**; **`CLAUDE.md`** + **`references/session-routing-hint.md`** exist; **`claude plugin validate`** when CLI available |
| **Cursor** | **`.cursor-plugin/plugin.json`** paths, version vs **`package.json`**, **`commands/`** / **`agents/`** contain markdown; every **`hooks-cursor.json`** hook resolves a real script |
| **Gemini** | **`gemini-extension.json`** version + **`GEMINI.md`** content signals |
| **Codex** | **`.codex/INSTALL.md`** mentions **AGENTS** / **CLAUDE**; **`AGENTS.md`** present |
| **OpenCode** | **`.opencode/INSTALL.md`**, **`node --check`** on the plugin, **dynamic `import()`** of **`config`** + **`experimental.chat.messages.transform`** and resolved **`paths`** |
| **Packaging** | **`package.json` `files[]`** includes each host bundle path |
| **Work engine** | **`npm run work-engine -- help`** exits 0; **`schemas/work-item.schema.json`** present; **`test/work-engine-*.test.js`** pass with **`npm test`** |

These checks **do not** open Cursor, Codex, OpenCode, or Gemini — use **Manual smoke** below for real host runtime.

## Manual smoke (host runtime)

GitHub-hosted CI cannot install Cursor, Codex, OpenCode, or Gemini for you. Use a **scratch target repo** (small app or empty git project) and this pack as submodule, **`claude --plugin-dir`**, or copy/symlink per platform docs.

| Platform | Minimal check | Pass criteria |
|----------|----------------|---------------|
| **Claude Code** | **`agentic-swe setup --host claude-code`**, or marketplace / `--plugin-dir`; trivial **`/work`**. **`/install`** only if policy merge was skipped | Slash commands visible; **`CLAUDE.md`** merge / **`.worklogs/`** as expected; a hook receipt after the session |
| **Cursor** | **`agentic-swe setup --host cursor`**; reload; open the target project | Session start and stop run; commands discoverable per UI |
| **Codex** | **`agentic-swe setup --host codex`**, then trust hooks | Receipt appears only after trust |
| **OpenCode** | **`agentic-swe setup --host opencode`** | A chat turn runs maintenance; policy is in context |
| **Antigravity** | **`agentic-swe setup --host antigravity`** | PreInvocation and Stop receipts |
| **Windsurf** | **`agentic-swe setup --host windsurf`** with Restricted Mode off | Hooks do not run while Restricted Mode is on |
| **Kiro** | **`agentic-swe setup --host kiro`** | v1 SessionStart and Stop receipts |
| **Copilot** | **`agentic-swe setup --host copilot`** | CLI or coding-agent receipt. Do not require IDE chat capture |
| **VS Code** | **`agentic-swe setup --host vscode`** | Maintenance receipt without agent transcript capture |
| **Gemini CLI** | `gemini extensions install` from repo root (per current Gemini docs) | Extension loads; **`GEMINI.md`** context. This is not the Antigravity hook adapter |

## Record verification (optional but recommended)

After the **automated** bar passes and you have run **any** manual smoke you care about for this cut:

1. Note **`git rev-parse --short HEAD`** (or the **tag** you are shipping, e.g. **`v3.0.0`**).
2. Use **UTC** for the date (`date -u +%Y-%m-%d` or equivalent).
3. Record **who** ran the checks (initials or handle).
4. Mark **✓** only for hosts you actually exercised; use **—** for not run this cycle.
5. In **Notes**, put **app versions** (Cursor build, Claude Code / desktop version, Gemini CLI version, etc.) and optionally a link to the **release PR**, **GitHub Release**, or **CI run**.
6. Spot-check the **public docs site** once per release (e.g. open [Installation](installation.md) and one other `/docs/*` page on **GitHub Pages**) — mark **✓** under **Public docs** when done.

**Where to keep this row:** paste into the **release PR** description, the **GitHub Release** body, a **tag annotation** (`git tag -a …`), or your team’s internal runbook — whichever you use for audit trail.

| Date (UTC) | Commit / tag | Verifier | Public docs | Claude Code | Cursor | Codex | OpenCode | Gemini | Notes |
|------------|--------------|----------|-------------|-------------|--------|-------|----------|--------|-------|
| _YYYY-MM-DD_ | _abc1234 or vX.Y.Z_ | _name_ | ✓/— | ✓/— | ✓/— | ✓/— | ✓/— | ✓/— | _PR #…, host versions, Pages URL if checked_ |

Keep one row per **release** (or per **candidate SHA** if you verify before tagging). Link out for long prose instead of growing the table.
