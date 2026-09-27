# Claude Code

Primary install, from the root of the repository you want to change:

```bash
agentic-swe setup --host claude-code
```

Setup merges root **`CLAUDE.md`**, can add **`.worklogs/`** to **`.gitignore`**, and installs the marketplace plugin (**`agentic-swe@agentic-swe-catalog`**). The Claude CLI must be on `PATH`. Commands, phases, agents, and hooks then resolve from **`${CLAUDE_PLUGIN_ROOT}/`**. You do not copy the pipeline into **`project/.claude/`**.

Session start and stop run memory maintenance and transcript capture. See [Durable memory](../durable-memory.md).

Start work:

```text
/work Add retry logic to the API client
```

Official references: [Plugins](https://code.claude.com/docs/en/plugins) · [Plugins reference](https://code.claude.com/docs/en/plugins-reference)

## Check the install

```bash
agentic-swe doctor
agentic-swe host-parity
```

Claude Code is **stable** when both session boundaries run: manifest present, hooks loaded, and doctor reports the plugin registration.

## Advanced and recovery

Marketplace commands, if you are already inside Claude Code and setup cannot call the CLI:

```text
/plugin marketplace add agentic-swe/agentic-swe
/plugin install agentic-swe@agentic-swe-catalog
```

**`/install`** merges **`CLAUDE.md`** and prepares **`.worklogs/`** when that step was skipped. It is recovery, not the default install.

Local pack development:

```bash
cd /path/to/your/target-project
claude --plugin-dir /path/to/agentic-swe
```

Validate a checkout:

```bash
claude plugin validate /path/to/agentic-swe
```

## Layout

- **`.claude-plugin/plugin.json`** lives under **`.claude-plugin/`**. Portable directories (**`commands/`**, **`agents/`**, **`phases/`**, **`hooks/`**) sit at the repository root. See the [plugin directory structure](https://code.claude.com/docs/en/plugins-reference#plugin-directory-structure).
- **`hooks/hooks.json`** is loaded from the plugin root. Do not also point **`plugin.json`** at that same file.
- **`phases/`**, **`templates/`**, **`references/`**, and **`state-machine.json`** are addressed as **`${CLAUDE_PLUGIN_ROOT}/...`**.

Slash commands are **`commands/*.md`** (**`/work`**, **`/check`**, **`/install`**). A **`skills/`** tree is not required for a valid install.

## Related

- **[Claude Code plugin](../claude-code-plugin.md)**
- **[Usage](../usage.md)** · **[Host capabilities](../host-support-tiers.md)** · **[Troubleshooting](../troubleshooting.md)**
