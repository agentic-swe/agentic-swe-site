# Runtime facade

Phases use a **host-agnostic action vocabulary** that runtime adapters translate into host-specific commands. Write pipeline logic once; run it on Claude Code, Codex, Gemini CLI, or any future host.

## Typed actions

The `typed-actions.schema.json` defines actions like:

| Action | What it does |
|---|---|
| `READ_FILE` | Read a file with optional offset/limit |
| `WRITE_FILE` | Write contents to a file |
| `EDIT_FILE` | Replace a string in a file |
| `RUN` | Execute a shell command |
| `SEARCH` | Search file contents by pattern |
| `GLOB` | Find files by pattern |
| `SPAWN_SUBAGENT` | Delegate to a specialist agent |
| `LIST_DIR` | List directory contents |
| `GIT` | Run a git subcommand |
| `WEB_FETCH` | Fetch a URL |

## Runtime adapters

Each host has an adapter under `scripts/lib/runtime/`:

| Adapter | Host | Translation example |
|---|---|---|
| `claude-code.cjs` | Claude Code | `READ_FILE` → `Read` tool, `RUN` → `Bash` tool |
| `codex.cjs` | Codex | `READ_FILE` → `read_file`, `RUN` → `shell` |
| `gemini.cjs` | Gemini CLI | `READ_FILE` → `read_file`, `RUN` → `run_shell_command` |

## How phases use it

Phases continue to be written in plain markdown with instructions. The typed-actions schema is the **contract layer** between phase logic and host execution — it ensures that when a phase says "read this file and run this command," every host translates it consistently.

## Adding a new host

1. Create `scripts/lib/runtime/<host>.cjs` implementing the `translate(action)` function
2. Map each action type to the host's tool vocabulary
3. Add tests under `test/runtime/<host>.test.js`

## Why this matters

"Write once, run on any agent host" — backed by tests, not marketing copy. Lock-in becomes ours (the action vocabulary), not the host's (their tool names). As new hosts emerge, adding an adapter is a single file.
