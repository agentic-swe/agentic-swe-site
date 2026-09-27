# Google Antigravity

**Quick setup**

1. Install Antigravity: [Get started](https://antigravity.google/docs/get-started).

2. From the root of the repository you want to change:

   ```bash
   agentic-swe setup --host antigravity
   ```

   Setup merges **`CLAUDE.md`**, copies **`GEMINI.md`** when it is missing, installs **`.agentic-swe/`**, and merges **`.agents/hooks.json`**. **PreInvocation** maintains memory. **Stop** captures the transcript.

3. Gemini CLI reads **`GEMINI.md`** and does not use those IDE hooks. A CLI session is not Stop capture.

**More detail:** [Installation](/docs/installation#antigravity) · [Host capabilities](host-support-tiers.md) · [Durable memory](durable-memory.md)
