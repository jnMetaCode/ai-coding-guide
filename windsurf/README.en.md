[简体中文](./README.md) | **English**

# Devin Desktop (formerly Windsurf) Best Practices

> **Windsurf is now Devin Desktop.** Cognition acquired Windsurf in July 2025, and on 2026-06-02 it was renamed via an automatic update; the website moved from windsurf.com to [devin.ai](https://devin.ai). Existing settings, keybindings and extensions migrate automatically — no reinstall needed.
>
> It's still a VS Code-based AI IDE, but the focus has shifted from "an editor with an agent" to **a command center for local + cloud agents**: the local agent Cascade has been replaced by **Devin Local** (rebuilt in Rust, with subagent support), and the home view is a board for managing all your agents. It still picks up your edits, terminal output and other actions (officially called "real-time awareness" now — the "Flows" term is gone).
>
> Last updated: 2026-09.

---

## Core Concepts

| Concept | Description | Use Case |
|---------|-------------|----------|
| **Devin Local** | Local agent (replaces Cascade), supports subagents | Multi-step tasks inside the editor |
| **Code / Plan / Ask modes** | Code (default, edits code) / Plan (proposes a plan first) / Ask (read-only Q&A); switch with `⌘.` | Pick the mode per task |
| **Agent Command Center** | Kanban view of all local and cloud agents | Running several tasks in parallel |
| **Spaces** | Group sessions, PRs, files and context; agents share context | Organizing work by project/feature |
| **Rules** | `.devin/rules/*.md` (preferred) or `.windsurf/rules/*.md` | Project-level rule configuration |
| **AGENTS.md** | Allowed in any directory; root is always on, subdirectories apply to that directory | Rules shared across tools |
| **Workflows / Skills** | Markdown in `.devin/workflows/`, invoked as `/name`; Devin Local uses Skills instead | Reusable procedures |
| **Hooks** | `.devin/hooks.json`, 12 events | Run scripts before/after agent actions |
| **@ References** | `@file` `@folder` `@web` etc. | Pinpoint context precisely |

---

## Getting Started

### Installation

Download from [devin.ai/download](https://devin.ai/download). Supports macOS / Windows / Linux. Based on VS Code — most existing VS Code extensions are compatible. Existing Windsurf installs auto-update to Devin Desktop; on first launch you can choose to migrate your Windsurf settings.

The CLI launcher changed from `surf` / `windsurf` to `devin-desktop` (the old commands are still kept for now).

### Project Rules — `.devin/rules/`

Create a `.devin/rules/` directory in your project (legacy `.windsurf/rules/` is still read; if both exist, `.devin/rules/` wins). One `.md` file per rule, up to **12,000 characters** per file:

```markdown
---
trigger: always_on
---

# Project Rules

## Tech Stack
Vue 3 + TypeScript + Pinia + Element Plus

## Code Standards
- Use Composition API (script setup syntax)
- Components in PascalCase, files in kebab-case
- Split stores by feature module
- All API requests go through wrappers under src/api/

## Agent Behavior
- Auto-check Props types when modifying components
- Remind to update TypeScript types when modifying API endpoints
- Do not auto-refactor code I haven't asked you to change
```

The `trigger` frontmatter field controls when a rule is loaded:

| trigger | Behavior |
|---------|----------|
| `always_on` | Full content included in every conversation |
| `model_decision` | Only the description is shown; the model reads the full rule when needed |
| `glob` | Loaded when the files being worked on match the glob |
| `manual` | Loaded only when you `@rule-name` it |

Other rule sources:

- **Global rules**: `global_rules.md` (`~/.codeium/windsurf/memories/global_rules.md`, 6,000-character limit), applies to every project
- **AGENTS.md**: at the root it behaves like `always_on`; in a subdirectory it only applies to that directory — handy for sharing one rule set with Claude Code, Cursor, etc.
- **`.windsurfrules`**: root-level single file, **legacy only** — don't use it for new projects

> Cursor users can import `.cursor/rules` into `.devin/rules/`.

### Using Real-Time Awareness

Devin Local picks up your actions (open files, edits, terminal output). Take advantage of this:

```
1. Open a few related files first (so the agent knows what you're working on)
2. Make a small change (so the agent understands your intent)
3. Now ask — you'll get better answers than from a cold start
```

---

## Prompting Tips

### 1. Large Tasks: Plan First, Then Code

Press `⌘.` to switch to Plan mode, get a plan, then switch back to Code mode to execute:

```
[Plan mode]
Migrate all user management pages under src/views/user/ from Options API to Composition API.
Keep functionality unchanged, only change the syntax. List the files to change and what changes in each.

[After approving the plan, switch to Code mode]
Execute the plan file by file. Let me confirm after each one.
```

When you only want answers and no edits, use **Ask mode** (read-only).

### 2. Leverage Real-Time Awareness

```
# You just ran tests in the terminal and saw errors
# The agent already saw them — just say:
The test just failed, help me figure out why.
# Usually no need to paste the error
```

### 3. @ References

```
@src/api/user.ts @src/types/user.ts
The type definitions in these two files are inconsistent. Unify them.
Use types/user.ts as the source of truth.
```

---

## Advanced Tips

### Workflows and Skills

Write repeatable procedures as Markdown in `.devin/workflows/` (12,000 characters per file) and invoke them in chat with `/filename`, e.g. `/release`. Workflows are manual-only.

Note: **Devin Local does not support Workflows** — the official recommendation is to migrate them to Skills (`.devin/skills/`), which the agent can invoke automatically when relevant.

### Hooks

Configure hooks in `.devin/hooks.json`. There are 12 events (e.g. before/after the agent reads a file, writes a file, or runs a command). **A pre-hook script that exits with code 2 blocks the action** — useful for stopping edits to `.env` or dangerous commands.

### Parallel Agents: Agent Command Center

Devin Desktop opens to the Agent Command Center — a kanban board showing both local agent sessions and cloud Devin sessions. Good patterns:

- Local agent for changes you want to watch; cloud Devin for long-running independent tasks
- Use **Spaces** to group the sessions, PRs and files for one feature so agents share context
- Plug in third-party agents (Codex, Claude Agent, OpenCode, etc.) via ACP (Agent Client Protocol); they're managed on the board just like native sessions

### Model Selection

The model picker includes the in-house SWE family (SWE-1.6 / SWE-1.7 / SWE-2), **Adaptive** (automatic model selection), plus third-party models such as Claude, GPT, Gemini, Grok, Kimi and GLM. Use SWE models or Adaptive for everyday work to save credits; switch to the strongest third-party model for complex refactors.

### Pricing

| Plan | Price |
|------|-------|
| Free | $0 |
| Pro | $20/mo |
| Max | $200/mo |
| Teams | $80/mo + $40/seat |

See [devin.ai/pricing](https://devin.ai/pricing) for the latest.

---

## How It Differs from Cursor

| Dimension | Devin Desktop | Cursor |
|-----------|----------|--------|
| Core philosophy | **Agent command center** — one board for local + cloud agents | **Editor-first** — Agents Window for parallel agents |
| Local agent | Devin Local (Code / Plan / Ask) | Agent (Agent / Ask / Plan) |
| Context | Real-time awareness of your actions + @ references | @ references + codebase index |
| Rules | `.devin/rules/*.md`, loading controlled by `trigger` | `.cursor/rules/*.mdc`, loading controlled by `globs`/`alwaysApply` |
| Models | In-house SWE family + Claude/GPT/Gemini etc. | In-house Composer + Claude/GPT/Gemini etc. |
| Best for | People orchestrating several local/cloud agents | People who prefer precise control in the editor |

---

## Common Pitfalls

| Pitfall | Description | Solution |
|---------|-------------|----------|
| Rules still in `.windsurfrules` | The single-file format is legacy only | Move to `.devin/rules/*.md` and use `trigger` for on-demand loading |
| Rules truncated | A file exceeds 12,000 characters | Split by topic into multiple rule files |
| Awareness context gets confused | Switched too many files, the agent loses track | Start a new session |
| Code mode scope creep | Edits files it shouldn't | Confirm scope in Plan mode first, or limit with @ references |
| Workflow does nothing under Devin Local | Devin Local doesn't support Workflows | Migrate to Skills |

---

## Configuration Templates

| Template | Purpose |
|----------|---------|
| [windsurfrules.md](templates/windsurfrules.md) | Project rules template (Vue 3 + TypeScript); copy to `.devin/rules/project.md` (or `.windsurf/rules/` for older setups) |

---

## Further Reading

- [Devin Desktop Official Docs](https://docs.devin.ai/desktop)
- [Devin Desktop FAQ](https://docs.devin.ai/desktop/devin-desktop-faq) — Details on migrating from Windsurf
- [Windsurf is now Devin Desktop](https://devin.ai/blog/windsurf-is-now-devin-desktop) — Official rename announcement
- [awesome-windsurf](https://github.com/detailobsessed/awesome-windsurf) — Community resource collection
- [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) — Skills methodology (also supports Windsurf / Devin Desktop)
