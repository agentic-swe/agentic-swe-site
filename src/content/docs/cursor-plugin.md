# Cursor plugin

**Quick install**

From the root of the repository you are changing:

```bash
agentic-swe setup --host cursor
```

Reload the window. Setup installs **`~/.cursor/plugins/local/agentic-swe`**, merges **`CLAUDE.md`**, and can gitignore **`.worklogs/`**. Policy and work state live in that project.

The curl script **`scripts/install-cursor-plugin.sh`** is a recovery path when setup cannot run. **`AGENTIC_SWE_TARGET_REPO`** and **`AGENTIC_SWE_AUTO_GITIGNORE=1`** are flags for that script, not the default install.

**Work dashboard:** Cursor’s **`hooks/hooks-cursor.json`** runs session start and stop. It does not include the Claude **`UserPromptSubmit`** hook that auto-starts the dashboard. In Cursor, start the dashboard yourself from the project root, for example **`npm run swe-dashboard`** (or **`node …/scripts/swe-dashboard-server.cjs --cwd .`**) and open the printed **`http://127.0.0.1:47822/`** URL. See the pack’s **[swe-dashboard command](https://github.com/agentic-swe/agentic-swe/blob/main/commands/swe-dashboard.md)**.

**Session start and stop:** **`hooks/hooks-cursor.json`** runs **`hooks/session-start`** and **`hooks/session-stop`**. Memory prime is on by default. Set **`AGENTIC_SWE_MEMORY_PRIME=0`** to skip it. Stop captures the transcript. See [Durable memory](durable-memory.md).

**More detail:** [Installation](installation.md) · [Multi-platform support](multi-platform-support.md) · [Durable memory](durable-memory.md) · [Troubleshooting](troubleshooting.md)
