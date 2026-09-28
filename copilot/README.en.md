[简体中文](./README.md) | **English**

# GitHub Copilot Best Practices

> GitHub Copilot is the built-in AI coding assistant for VS Code and JetBrains IDEs. Its core strength is **seamless integration** — no tool switching needed, just write code in your editor and get completions and suggestions naturally. Copilot Agent mode evolves it from a completion tool into an autonomous agent that can tackle tasks independently.
>
> Last updated: 2026-09.

---

## Core Concepts

| Concept | Description | Use Case |
|---------|-------------|----------|
| **Code Completion** | Inline gray suggestions | Daily coding, press Tab to accept |
| **Chat** | Chat view `⌃⌘I` | Q&A, code explanations |
| **Agent Mode** | Autonomously completes multi-step tasks (`⇧⌘I` opens chat in agent mode) | Complex tasks, cross-file changes |
| **Copilot Instructions** | `.github/copilot-instructions.md` | Project-level configuration |
| **Instructions files** | `.github/instructions/*.instructions.md`, scoped by path via `applyTo` | Per-directory / per-file-type rules |
| **Custom Agents** | `.github/agents/*.agent.md` (formerly Chat Modes) | Security auditor, testing expert, etc. |
| **MCP Server** | `.vscode/mcp.json`, extends Copilot's tool capabilities | Connect to databases, APIs, etc. |
| **# References** | `#file` `#selection` `#terminal` `#codebase` | Pinpoint context precisely |

---

## Getting Started

### Copilot Instructions — Project Configuration

Create `.github/copilot-instructions.md` in your project root:

```markdown
# Project Guidelines

## Tech Stack
- Python 3.12 + FastAPI + SQLAlchemy 2.0
- Database: PostgreSQL
- Cache: Redis
- Testing: pytest

## Code Standards
- Type annotations must be complete, using Python 3.10+ syntax
- Prefix all async functions with `async_`
- All endpoints must use Pydantic models for input validation
- Use custom exception classes for errors, never bare Exception

## Directory Conventions
- src/api/     — FastAPI routes
- src/models/  — SQLAlchemy models
- src/schemas/ — Pydantic models
- src/services/ — Business logic
- tests/       — Tests (mirrors src structure)
```

### # Reference Tips

```
# Reference a file
#file:src/models/user.py Write a user registration endpoint based on this model

# Reference selected code
#selection What performance issues does this code have?

# Reference terminal output
#terminal Check the error and help me fix it

# Reference VS Code problems panel
#problems Fix these type errors for me

# Force a semantic search of the codebase
#codebase Where in the project do we build SQL by string concatenation?
```

---

## Agent Mode

Copilot Agent was the biggest update of 2025. Enter a task in the chat, and Agent will:

1. Analyze requirements -> 2. Search relevant files -> 3. Create a plan -> 4. Execute step by step -> 5. Run tests to verify

### Using Agent Mode

Select Agent mode in Chat (or press `⇧⌘I` to jump straight in). The agent searches the codebase on its own — no need for `@workspace`:

```
Add rate limiting to all endpoints under src/api/,
using Redis as the counter. Max 60 requests per user per minute.
Requirements:
1. A reusable rate_limit decorator
2. Redis connection config
3. Return 429 status when limit exceeded
4. Add tests for each endpoint
```

### Agent + MCP for Extended Capabilities

Use MCP Servers to give Agent access to external tools. Create `.vscode/mcp.json` in your project (the top-level key is `servers`):

```json
{
  "servers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://..."]
    }
  }
}
```

Then you can say:

```
Look up the structure of the users table in the database,
then generate a SQLAlchemy model and Pydantic schema based on the actual columns.
```

---

## Prompting Tips

### 1. Write Good Comments for Better Completions

```python
# Completion quality depends on context. A single comment tells Copilot what you need:

# Count the number of business days between two dates, excluding weekends and public holidays
def count_business_days(start: date, end: date) -> int:
    # Copilot will auto-complete the full implementation
```

### 2. Custom Agents for Specialized Reviews

Create `.github/agents/security-reviewer.agent.md`:

```markdown
---
name: Security Reviewer
description: Review code security against OWASP Top 10
---

You are a security review expert. When reviewing code:
1. Check against each item in the OWASP Top 10
2. Focus on SQL injection, XSS, CSRF, and authorization bypass
3. Check for sensitive data stored in plaintext or leaked in logs
4. Label risk levels: 🔴 Critical / 🟡 Medium / 🟢 Low
```

Select it from the **Agent dropdown** in the Chat view, or type `/agents` in the chat input to pick it from the list.

### 3. Let the Agent Search the Whole Codebase

```
Are there any hardcoded secrets or sensitive values in the project?
Find them all and refactor to use environment variables.
```

The agent searches the codebase automatically; add `#codebase` when you want to force a semantic search.

---

## Advanced Tips

### Custom Instructions and Extension Files

Copilot supports these files to fine-tune behavior:

| File | Purpose |
|------|---------|
| `.github/copilot-instructions.md` | Global project instructions |
| `.github/instructions/*.instructions.md` | Scoped by path via the `applyTo` glob in frontmatter |
| `AGENTS.md` / `CLAUDE.md` | Cross-tool instruction files, also read by Copilot |
| `.github/agents/*.agent.md` | Custom agents (`.chatmode.md` is deprecated — rename to `.agent.md` to migrate) |
| `.github/prompts/*.prompt.md` | Reusable prompts, invoked in Chat as `/name` |
| `.github/skills/`, `.claude/skills/`, `.agents/skills/` | Agent Skills, loaded on demand |
| Hooks | Run scripts before/after agent actions |

`applyTo` example (`.github/instructions/python.instructions.md`):

```markdown
---
applyTo: "**/*.py"
---

- All functions must have type annotations
- Use pytest, not unittest
```

If you use superpowers-zh, put the skill files under `.github/skills/`, `.claude/skills/` or `.agents/skills/` — Copilot Agent loads them on demand as Agent Skills.

### VS Code Keyboard Shortcuts (macOS)

| Shortcut | Action |
|----------|--------|
| `Tab` | Accept completion |
| `Esc` | Reject completion |
| `⌃⌘I` | Open the Chat view |
| `⇧⌘I` | Open chat in agent mode |
| `⌘I` | Inline chat (in the editor) |
| `Alt+]` / `Alt+[` | Cycle through completion suggestions |

### Completion Optimization

Tips for more accurate Copilot completions:

1. **Keep related files open** — Copilot reads open tabs as context
2. **Write thorough type annotations** — More complete types = more accurate completions
3. **Write function signatures first** — Define the name, parameters, and return type, then let Copilot complete the body
4. **Keep files short** — Large files add context noise, causing Copilot to drift

### Billing and Plans

Since 2026-06-01 Copilot bills usage in **GitHub AI Credits**: Chat, agent mode, code review, the cloud agent, Copilot CLI, etc. consume credits; code completions stay unlimited on paid plans.

| Plan | Price | Included per month |
|------|-------|--------------------|
| Free | $0 | 2,000 completions + a small credit allowance |
| Pro | $10/mo | 1,500 credits |
| Pro+ | $39/mo | 7,000 credits |
| Max | $100/mo | 20,000 credits |
| Business | $19/seat/mo | 1,900 credits per user |
| Enterprise | $39/seat/mo | 3,900 credits per user |

See the [official plans page](https://docs.github.com/en/copilot/get-started/plans) for the latest.

### New in 2026

- **Copilot coding agent renamed to Copilot cloud agent**: takes an Issue to a PR in the cloud
- **GitHub Copilot app**: desktop app, GA on 2026-06-17, available on all plans
- **Copilot CLI GA**: Copilot agent in the terminal
- **Agent Plugins 1.0**: package and distribute custom agents, skills and more
- **Copilot code review**: consumes AI Credits + GitHub Actions minutes
- **JetBrains**: custom agents, subagents and the plan agent went GA in March 2026, with AGENTS.md / CLAUDE.md support

---

## Common Pitfalls

| Pitfall | Description | Solution |
|---------|-------------|----------|
| Outdated API completions | Copilot suggests deprecated library APIs | Open the library source or docs as a tab for context |
| Agent edits wrong files | Multi-file changes touch things they shouldn't | Use `#file` to limit scope |
| Sensitive files get read | Agent mode in the IDE doesn't support content exclusion, so `.env` etc. may still be read | Keep secrets out of the project directory; content exclusion is configured at repo/org/enterprise level and doesn't apply to agent mode |
| Instructions too long | Key points get buried, later rules work poorly | Trim to essential rules; move situational rules into `.instructions.md` (`applyTo`) or custom agents |

👉 **Deep dive**: [Copilot Pitfalls](../pitfalls/copilot.en.md) — 8 real-world traps (Agent reads .env / MCP silent fail / running out of credits and more), each with Symptom / Cause / Recovery / Prevention

---

## Configuration Templates

Copy directly into your project:

| Template | Purpose |
|----------|---------|
| [copilot-instructions.md](templates/copilot-instructions.md) | Project guidelines template, copy to `.github/copilot-instructions.md` |
| [security-reviewer.agent.md](templates/security-reviewer.agent.md) | Security reviewer custom agent, copy to `.github/agents/` |

---

## Further Reading

- [Copilot Official Docs](https://docs.github.com/en/copilot)
- [VS Code Copilot customization docs](https://code.visualstudio.com/docs/copilot/customization/custom-agents) — Custom agents, instructions, MCP
- [awesome-copilot](https://github.com/github/awesome-copilot) — Official resource collection (27k+ stars)
- [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) — Skills methodology (also supports VS Code Copilot)
