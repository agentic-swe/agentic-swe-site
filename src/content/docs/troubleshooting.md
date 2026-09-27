# Troubleshooting

Install with **`agentic-swe setup --host <host>`** from the repository root. See [installation.md](installation.md). **`/install`** is only a Claude Code recovery step when policy merge was skipped. Do not use it as the fix on Cursor, Codex, OpenCode, or the other hosts.

## Slash commands like `/work` are missing

**Claude Code:** the plugin is not enabled for this project. Run **`agentic-swe setup --host claude-code`**, or inside Claude Code run **`/plugin install agentic-swe@agentic-swe-catalog`**. Open Claude Code in the target repository. Commands come from **`${CLAUDE_PLUGIN_ROOT}/commands/`**.

**Other hosts:** setup installs the portable pack under **`.agentic-swe/commands/`**. If the host has no slash UI, open the command file and ask the session to follow it. See [Host capabilities](host-support-tiers.md).

## Doctor and host parity

From the repository root:

```bash
agentic-swe doctor
agentic-swe host-parity
```

**`doctor`** checks the tool, detected hosts, manifest drift, and parity. **`host-parity`** prints **stable**, **partial**, or **instruction-only**.

- **Codex** stays idle until you trust repository or plugin hooks.
- **Windsurf** stays idle while Restricted Mode is on. Turn it off and start a new Cascade session.
- **Copilot** can be partial: CLI and coding-agent hooks run; IDE chat may not provide a transcript.
- **VS Code** is partial on purpose: maintenance without agent transcript capture.
- **Cline, Roo, Continue, Junie, and Zed** are instruction-only. Use **`AGENTS.md`** and call the MCP tools. Merging **`integrations/fallback/agentic-swe-memory.mcp.json`** does not start automatic capture.

## Hook receipts and notices

After a session, read **`.agentic-swe/hook-receipts.jsonl`**. The last line is the latest lifecycle run. When a step fails, **`.agentic-swe/hook-notice.md`** is injected next time. Fix the error named there, then start a new session. **`npm run memory-index`** and **`npm run memory-reflect`** are recovery commands when a receipt says the index or lessons failed. They are not the normal path.

## Install seems partial

Run setup again for that host. It is safe to repeat. Then:

```bash
agentic-swe doctor
agentic-swe repair
```

**`repair`** restores drifted owned files. **`agentic-swe update`** replaces owned files from the current pack. On Claude Code only, **`/install`** can finish a missed **`CLAUDE.md`** merge.

## Memory did not update

1. Confirm the host is one with a lifecycle. See [Durable memory](durable-memory.md).
2. Confirm you did not set **`AGENTIC_SWE_HOOK_LIFECYCLE=0`**.
3. For Codex, trust the hooks. For Windsurf, disable Restricted Mode.
4. Read the receipt. A VS Code or Copilot IDE session with no transcript section is expected.
5. Instruction-only hosts must call **`agentic_swe_memory_refresh`** themselves.

## Cross-host recovery

Switching editors does not require a new work item. **`.worklogs/`** and **`.agentic-swe/memory.sqlite`** stay in the repository.

1. **`agentic-swe setup --host <new-host>`** from the repository root.
2. **`agentic-swe doctor`** and **`agentic-swe host-parity`**.
3. Read the newest hook receipt after one session on the new host.
4. If files drifted, **`agentic-swe repair`**. Do not delete **`memory.sqlite`** unless you intend to drop the index. Rebuild with **`npm run memory-index`** only after that.

## Budget or gate stops every time

Read **`/check budget`** and **`.worklogs/<id>/state.json`**. See [check-commands.md](check-commands.md).

## Work state looks wrong after upgrading the pack

From a pack checkout, **`node scripts/migrate-work-state.js`** previews a migration. Add **`--apply`** to write it. See **`CHANGELOG.md`**. Edges live in **`state-machine.json`** and must match **`CLAUDE.md`**.

## Node, git, or `gh` missing

Setup and lifecycle hooks need **Node.js 18+** and **git**. **`gh`** is only for pull-request steps. A plugin-only Claude session still needs Node when the stop hook records memory.

## Legacy `.claude/` copy

After setup, remove vendored **`.claude/commands`** and **`.claude/phases`** if you do not want duplicates. Move **`.claude/.work/`** to **`.worklogs/`** if needed.

## `catalog:lint` fails after editing subagents

**`npm run catalog:lint`** (also part of **`npm run verify`**) checks frontmatter, names, tools, and description overlap. See [Catalog routing](catalog-routing.md).

## Semantic `catalog:route` errors

**`npm run catalog:index`** writes **`.agentic-swe/catalog-embeddings.json`**. Embeddings are optional and call a provider when you enable them. Use **`--mode lexical`** to skip that. See [Durable memory](durable-memory.md).

## Still stuck

Include **`agentic-swe doctor`** output, the last hook receipt, **`agentic-swe version`**, and the host name when you ask for help. Follow [Golden path](golden-path.md) once on a scratch repository to separate install issues from project issues.
