[简体中文](./copilot.md) | **English**

# GitHub Copilot Pitfalls

> Copilot is the oldest AI coding tool and most underestimated — people think "it's just completion," but Agent mode and MCP support are deep. 8 real-world pitfalls. Last updated: 2026-09.
>
> Hit a new one? Open an Issue or PR.

---

## Pitfall 1: Completion Uses Outdated APIs

**Symptom**
- Generated code uses an old library API
- You paste it and get `Deprecated: use xxx instead` or `is not a function`
- After bumping the library, Copilot still suggests the old API

**Cause**
Copilot's completion is based on training data + currently open files. The library version in training may predate your installed version, and Copilot doesn't read your `package.json`.

**Recovery**
- Open the **new API's docs page as a tab** (Copilot reads open tabs)
- Or annotate the file:

```typescript
// Using TanStack Query v5 API (useQuery signature: useQuery({ queryKey, queryFn }))
import { useQuery } from '@tanstack/react-query';
```

**Prevention**
Declare key library versions and API style in `.github/copilot-instructions.md`:

```markdown
## Key dependency versions
- React 19 (use useTransition, useOptimistic)
- TanStack Query v5 (new useQuery signature)
- Zod v3 (not v2 chained object() style)
```

---

## Pitfall 2: Agent Mode Reads `.env` or Sensitive Files

**Symptom**
- You ask Agent to adjust config; it scans `.env` and reads keys into context
- You see your real API key in the Chat window
- Worst: completion suggestions leak real secrets

**Cause**
Files in `.gitignore` can still be read by Copilot. GitHub's **content exclusion** can only be configured by admins at the repository / organization / enterprise level, and the official docs state plainly: **agent mode in Copilot Chat in IDEs does not support content exclusion**. So even with exclusions configured, agent mode may still read `.env`, `.aws/credentials`, `id_rsa` and the like.

(The widely shared `github.copilot.advanced.exclude` setting is not an official exclusion mechanism — don't rely on it.)

**Recovery**
If secrets already hit Chat history: start a new session / clear the current one **and rotate the affected keys immediately**.

**Prevention**
- **Keep secrets out of the project directory**: inject them via `direnv` / `1Password CLI` from outside, never on disk in the repo
- Configure content exclusion at repo / org level — it covers completions and regular Chat at least (not agent mode)
- Pay attention to the agent's confirmation prompts before it reads files or runs commands; don't blanket-approve
- State "don't read `.env*`, `*.pem`, `*.key`" in instructions — a soft constraint that only lowers the odds

---

## Pitfall 3: `.github/copilot-instructions.md` Too Long, Key Points Buried

**Symptom**
- You wrote 20 rules in instructions
- Agent follows the first few, ignores the rest
- Especially in Chat, detail rules barely take effect

**Cause**
The instructions file is injected into context as a whole. The longer and messier it gets, the less weight each rule carries, and rules unrelated to the current task compete for attention.

**Recovery**
Split by role:
- Stable core rules → `.github/copilot-instructions.md` (keep it short)
- Path-scoped rules → `.github/instructions/*.instructions.md` with an `applyTo` glob
- Specialist personas → `.github/agents/*.agent.md`
- Full methodologies → Agent Skills (`.github/skills/`)

**Prevention**
Keep instructions **cross-scenario globals only** (tech stack, naming, forbidden patterns). Scenario-specific rules:

```
.github/
├── copilot-instructions.md          # Core rules
├── instructions/
│   ├── python.instructions.md       # applyTo: "**/*.py"
│   └── tests.instructions.md        # applyTo: "tests/**"
└── agents/
    ├── security-reviewer.agent.md   # Security review
    └── migration-helper.agent.md    # Project migration
```

---

## Pitfall 4: `#file` References Don't Match What the Agent Finds

**Symptom**
- You say `#file:src/api/user.ts apply this change`
- Copilot gets it mostly right, but not exactly
- Another time you just say "change user.ts" — the agent searches on its own and finds 2 user.ts files (the project has two with the same name)

**Cause**
- `#file` precisely references the path you give
- Agent mode searches the codebase automatically (`#codebase` forces a semantic search)
- With duplicate filenames, automatic search may pick the wrong one

**Recovery**
Explicit path beats fuzzy search:

```
❌ Fix the register method in user.ts
✅ #file:src/api/v2/user.ts fix the register method
```

**Prevention**
- Avoid duplicate filenames in your project (`user.ts` × 3 is a smell)
- If duplicates must exist, always reference by full path, not filename
- Use automatic search / `#codebase` for **discovery** ("is there an X?"), not for **targeting** ("change X")

---

## Pitfall 5: MCP Server Configured But Not Working

**Symptom**
- You configured an MCP server, but Chat doesn't use its tools when it should; takes a different path
- No error, just silently unused

**Cause**
Four common reasons:
1. **Wrong config location or format**: VS Code's MCP config lives in `.vscode/mcp.json` with a top-level `servers` key; the old `github.copilot.chat.mcpServers` in `settings.json` is not the current way to configure it
2. Startup command wrong (`npx` path, arg order)
3. You're not in agent mode, or the tools aren't enabled in the tools picker
4. Server starts OK but tool schema is malformed; Copilot can't recognize it

**Recovery**
```jsonc
// .vscode/mcp.json
{
  "servers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    }
  }
}
```

Then run **MCP: List Servers** from the Command Palette, pick your server → **Show Output** for logs. When a server fails, the Chat view also shows an error indicator you can click to see the output.

**Prevention**
- Verify MCP with an official sample server (e.g. `@modelcontextprotocol/server-filesystem`) first
- Then swap to your own server
- Keep VS Code and Copilot extensions on latest

---

## Pitfall 6: JetBrains and VS Code Features Out of Sync

**Symptom**
- VS Code users on your team get a new feature that JetBrains users don't have yet
- The same config behaves a bit differently in the two IDEs

**Cause**
- VS Code is usually where new Copilot features ship first
- The gap has narrowed a lot, though: custom agents, subagents and the plan agent went GA in JetBrains in March 2026, along with AGENTS.md / CLAUDE.md support
- A few of the newest features may still land in JetBrains a bit later, and outdated plugins make the gap more visible

**Recovery**
Update the Copilot plugin in JetBrains first; if a feature is missing, check the official docs for its IDE support.

**Prevention**
- For team-shared rules, prefer formats both IDEs support (`.github/copilot-instructions.md`, `AGENTS.md`, `.agent.md`)
- Before depending on a new feature, confirm every IDE your team uses supports it
- Keep plugins up to date

---

## Pitfall 7: Running Out of AI Credits / Free Allowance

**Symptom**
- Copilot Free worked fine; one day completions or Chat stop working ("usage limit reached"-style messages)
- Paid users find agent mode or code review warning about insufficient credits mid-month
- The notification in VS Code isn't always prominent, so it's easy to miss

**Cause**
Since 2026-06-01 Copilot bills in **GitHub AI Credits**:
- Chat, agent mode, code review, the cloud agent, Copilot CLI, etc. consume credits (code review also consumes GitHub Actions minutes)
- Code completions are unlimited on paid plans; Free includes 2,000 completions + a small credit allowance per month
- Each plan includes a monthly allowance (Pro 1,500 / Pro+ 7,000 / Max 20,000 credits; Business 1,900 and Enterprise 3,900 per user); beyond that you buy more or wait for next month
- Requests to large, high-reasoning models burn credits faster

**Recovery**
- GitHub Account → Copilot settings to check usage
- Near the cap: upgrade to Pro / Pro+ / Max, set an additional spending limit, or lean on another tool for the rest of the month

**Prevention**
- Heavy users: pay for Pro ($10/mo) or higher from day 1, don't try to squeeze Free
- Use cheaper models for small everyday tasks; switch to large models for complex work
- Teams: align allowances and spending limits with admins
- Build a "Copilot out of credits" fallback plan (switch to Claude Code or Cursor)

---

## Pitfall 8: Custom Agent Not Discovered

**Symptom**
- You wrote a specialist role file and typed `@security-review` in Chat — Copilot doesn't recognize it
- Or it doesn't show up in the Agent dropdown at all
- Or you selected it but it behaves like plain Chat

**Cause**
- **Wrong invocation**: custom agents aren't invoked with `@name` — pick them from the **Agent dropdown** in the Chat view, or type `/agents` in the chat input to open the list
- **Still on the old format**: Chat Modes (`.github/chatModes/*.chatmode.md`) are deprecated; they're now called custom agents
- **Wrong location or extension**: must be `*.agent.md` under `.github/agents/` (`.claude/agents/` also works)
- Missing frontmatter, or `user-invocable: false` is set (hides it from the dropdown)

**Recovery**
Rename/move the file to `.github/agents/security-review.agent.md` and check the frontmatter:

```markdown
---
name: security-review
description: Security review using OWASP Top 10
---

# Role content below
```

Then pick it from the Agent dropdown.

**Prevention**
- Generate the file with **Chat: New Custom Agent** from the Command Palette and edit from there, rather than writing from scratch
- Rename old `.chatmode.md` files to `.agent.md` and move them into `.github/agents/`
- Add `tools` in frontmatter to restrict tools, or `model` to pin a model

---

## Contribute a Pitfall

Template: see [claude-code.en.md end](./claude-code.en.md#found-a-new-pitfall).

---

## Related

- [Copilot Full Guide](../copilot/README.en.md)
- [common/security.en.md](../common/security.en.md) — AI coding security risks
- [common/context-management.en.md](../common/context-management.en.md) — Context management
