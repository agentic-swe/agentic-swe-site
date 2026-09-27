# Privacy

This page says what the pack reads and writes on your machine, and what it does not operate. **It is not legal advice.**

Reviewed 27 Sep 2026 against runtime source **3.3.1**, including [merged pull request #71](https://github.com/agentic-swe/agentic-swe/pull/71).

## No project backend

agentic-swe does not run a hosted service for your code, chats, or memory. There is no project telemetry pipeline in this repository. Files stay on disk until **you** commit them, copy them, or point a tool at them.

Your **coding host** still sends prompts, tool calls, and model output to that host’s provider under that product’s terms. Examples include Anthropic (Claude Code), Cursor, OpenAI (Codex), Google (Antigravity and Gemini), Windsurf, Kiro, GitHub Copilot, and OpenCode’s configured model provider. Those requests are governed by the host, not by this repository.

## Local transcript scoring

On hosts with a transcript lifecycle, session stop reads the host transcript, redacts strings that match a small set of secret patterns, and **scores** the text. A chunk is stored only when evidence converges: a decision, a lesson, or a well-formed command together with a path or an outcome. Ordinary prose is dropped. Malformed commands lower the score and can be quarantined.

That redaction is best-effort. Do not rely on it as a secrets filter. Avoid pasting credentials into agent chats.

Generic VS Code maintains files without reading an agent transcript. Copilot IDE chat may not provide one. Instruction-only hosts (Cline, Roo, Continue, Junie, Zed) capture nothing unless you call the MCP tools.

## Files on disk

| Location | Contents |
|----------|----------|
| **`.worklogs/<id>/`** | Work state, progress, audit log, phase notes |
| **`.agentic-swe/memory.sqlite`** | Project chunk and graph index |
| **`~/.agentic-swe/memory.sqlite`** | Personal index, including style constraints |
| **`.agentic-swe/lessons.json`** | Reflection lessons |
| **`.agentic-swe/style-profile.json`** | Local style profile |
| **`.agentic-swe/procedures.json`** | Learned procedures, including quarantined ones |
| **`.agentic-swe/hook-receipts.jsonl`** | One JSON line per lifecycle run |
| **`.agentic-swe/hook-notice.md`** | Last failure, injected into the next session |
| **`.agentic-swe/memory.json`** | Your optional config overrides |

The project database is gitignored by a normal setup. **You** choose whether to commit worklogs or copy a memory database to another machine. Deleting these files deletes the local memory. The pack does not sync them to a project server.

## Optional calls off the machine

These stay off until you enable them:

- **Embeddings** with provider **`openai`** send chunk text to OpenAI. **`ollama`** stays on a host you configure, defaulting to localhost.
- **Sliding summary** with **`--llm`** or **`sliding.llm_enabled`** can call OpenAI to summarize older transcript turns.
- **Cross-model review** runs a Codex or Gemini CLI, or a paste you do yourself, only when you ask for that pass. See [Cross-model review](cross-model-review.md).

Catalog semantic index uses the same embedding switch.

## Hooks

Lifecycle hooks are shell or Node commands in your environment. They write the receipt and notice files above. Review **`hooks/`** and the host adapter JSON that setup merged if you need the exact command line.

Opt out with **`AGENTIC_SWE_HOOK_LIFECYCLE=0`** and **`AGENTIC_SWE_MEMORY_PRIME=0`**.

## Source hosting

The git repository is on GitHub (`agentic-swe/agentic-swe`). GitHub’s privacy statement covers access to that repo: [GitHub Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement).

## Contact

Questions about this project: [GitHub issues](https://github.com/agentic-swe/agentic-swe/issues). Questions about a host account belong to that host’s support.

This summary can miss a jurisdiction or a future host. For a compliance decision, ask a qualified professional.
