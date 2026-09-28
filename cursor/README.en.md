[简体中文](./README.md) | **English**

# Cursor Best Practices

> Cursor is an AI-powered IDE based on VS Code. Its core features are Tab completion, the Agent panel (with Agent / Ask / Plan modes) and inline edit. Its strength lies in deep editor integration — select code to start a conversation, preview changes in real time right in the editor.
>
> Note: the old "Composer panel" is now the **Agent panel**; "Composer" now refers to Cursor's own model (e.g. Composer 2.5).
>
> SpaceX completed its acquisition of Cursor on 2026-08-14 ([announcement](https://cursor.com/blog/joining-spacex)). Last updated: 2026-09.

---

## Core Concepts

| Concept | Description | Use Case |
|---------|-------------|----------|
| **Tab Completion** | Context-aware code completion | Speed up daily coding |
| **Agent panel** | Sidepanel; `Shift+Tab` cycles Agent / Ask / Plan modes | Agent edits across files; Ask is read-only Q&A; Plan drafts a plan first |
| **Agents Window** | Multi-agent window since Cursor 3; local / worktree / cloud agents in parallel | Running several tasks at once |
| **Rules** | `.cursor/rules/*.mdc` rule files (must be `.mdc`) | Control AI behavior |
| **AGENTS.md** | Markdown instructions at the root or in any subdirectory | Rules shared across tools |
| **Skills / Subagents / Hooks** | `.cursor/skills/`, `.cursor/agents/`, `.cursor/hooks.json` | Reusable methods, specialist subagents, scripts around agent actions |
| **@ References** | `@Files` `@Folders` `@Terminals` `@Chats` `@Commit` `@Branch` `@Browser` | Pinpoint context precisely |

---

## Getting Started

### .cursor/rules/ — Project Rules

Put rule files under `.cursor/rules/`. **The extension must be `.mdc`** (a plain `.md` file has no frontmatter and is ignored by the rules system). A root-level `.cursorrules` file is the legacy format, kept only for compatibility; `AGENTS.md` (also supported in subdirectories) works too.

`.cursor/rules/project.mdc`:

```markdown
---
description: General project rules
alwaysApply: true
---

# Project Rules

## Tech Stack
- React 18 + TypeScript + Tailwind CSS
- State management: Zustand
- Routing: React Router v6
- Testing: Vitest + Testing Library

## Code Style
- Functional components + Hooks only, no class components
- Define Props with interface, not type
- File names in kebab-case, component names in PascalCase
- One component per file

## Do NOT
- Use the any type
- Use useEffect for data fetching — use TanStack Query instead
- Manipulate the DOM directly — use React refs
```

### @ Reference Tips

```
# Reference a file
@src/components/Button.tsx The Props type on this component is wrong, please fix it

# Reference a folder
@src/api/ Error handling across these endpoints is inconsistent, unify them to...

# Reference terminal
@Terminals Check the error output and help me fix it

# Reference git changes
@Branch Review this branch's changes against main

# Documentation: just paste the link for the Agent to look up
Refer to https://tanstack.com/query/latest and refactor the useEffect data fetching to useQuery
```

> If you're not sure which files matter, skip the @ — the Agent searches the codebase on its own.

---

## Prompting Tips

### 1. Breaking Down Large Tasks with the Agent

For big tasks, switch to **Plan mode** (`Shift+Tab`) to get a plan first, then switch back to Agent mode to execute:

```
Execute the following steps:
1. Read all page components under src/pages/ to understand the routing structure
2. Create src/layouts/DashboardLayout.tsx as a unified layout
3. Migrate all page components to use the new layout
4. Verify the route configuration is correct
Pause after each step and wait for my confirmation before continuing.
```

### 2. Select Code and Chat Directly

Select code and press `Cmd+L` (macOS) to open the Agent panel with the selection included; switch to Ask mode for pure Q&A:

```
# Select a complex regex
Explain what this regex does. Are there any edge cases it doesn't cover?

# Select a function
What's the time complexity of this function? Is there a more optimal approach?

# Select some CSS
Rewrite this CSS using Tailwind classes
```

### 3. Turn Reusable Context into Rules

Notepads were deprecated in October 2025 and removed in 2.0. Move stable conventions you used to keep in a Notepad into a **manually applied rule** (or a Skill) and @ it when needed; for things that change often, reference the live code with `@Files`.

`.cursor/rules/api-spec.mdc`:

```markdown
---
description: API response format and error codes
alwaysApply: false
---

All APIs return this format:
{ code: number, data: T, message: string }

Error codes:
- 400: Bad request
- 401: Unauthenticated
- 403: Forbidden
- 500: Server error

Auth: Bearer Token in Authorization header
```

Reference it in conversation: `@api-spec Implement the user list endpoint following this format`

---

## Advanced Tips

### Splitting Rules into Multiple Files

```
.cursor/rules/
├── global.mdc         # Global rules (code style, naming, etc.)
├── react.mdc          # React-specific rules
├── api.mdc            # API development rules
├── testing.mdc        # Testing rules
└── security.mdc       # Security rules
```

The `description` / `globs` / `alwaysApply` frontmatter decides the rule type:

| Type | How | When loaded |
|------|-----|-------------|
| Always Apply | `alwaysApply: true` | Every conversation |
| Apply Intelligently | `description` only | When the Agent decides it's relevant |
| Apply to Specific Files | `globs` | When matching files are involved |
| Apply Manually | none of the above | When you @ it |

```markdown
---
description: React component rules
globs: src/components/**/*.tsx
alwaysApply: false
---

# React Component Rules
- All components must have a displayName
- Props with more than 3 fields must use a separate interface
- Must handle loading and error states
```

### Skills, Subagents, Hooks

| Capability | Location | Notes |
|------------|----------|-------|
| Skills | `.cursor/skills/`, `.agents/skills/`, `.claude/skills/` | Reusable methodologies the Agent loads on demand |
| Subagents | `.cursor/agents/` (also reads `.claude/agents/`) | Specialist subagents, e.g. code review, writing tests |
| Hooks | `.cursor/hooks.json` | Run scripts before/after Agent actions (e.g. block dangerous commands) |

### Supercharge with superpowers-zh Skills

Writing methodologies by hand is slow. Install them in one command:

```bash
cd /your/project
npx superpowers-zh
# Includes brainstorming, debugging, verification skills, etc.
```

These are **Skills** and belong in a Cursor Skills directory (`.cursor/skills/`, `.agents/skills/` or `.claude/skills/`), not `.cursor/rules/`. Once installed, the Agent loads them on demand for relevant tasks.

### Model Selection Strategy

| Scenario | Recommended Model | Why |
|----------|-------------------|-----|
| Everyday Agent tasks | Composer 2.5 | Cursor's own model — fast and cheap |
| Simple Q&A | Claude Sonnet / GPT-5.x | Best value |
| Complex refactoring / large tasks | Claude Opus / GPT-5.x | Strong comprehension, good multi-file coordination |
| Don't want to pick | Auto (Cursor Router) | Routes automatically based on your Cost / Balance / Intelligence preference |

The list also includes Grok 4.x, Gemini, Kimi, GLM and more — check `Cursor Settings > Models` for what's actually available.

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Accept completion |
| `Cmd+I` / `Cmd+L` | Toggle the Agent sidepanel (selected code auto-included) |
| `Shift+Tab` | Cycle Agent / Ask / Plan modes |
| `Cmd+E` | Toggle the Agent layout |
| `Cmd+K` | Inline edit (after selecting code) |
| `Cmd+Shift+L` | Add selected code to Agent context |

### New in 2026

- **Agents Window** (Cursor 3, 2026-04-02): run local / worktree / cloud agents in parallel
- **Plan mode**: plan first, then act
- **`/loop`**: have the Agent run a task in a loop
- **Cloud subagents**, **Automations** (trigger agents automatically)
- **Cursor Router**: Auto model routing with Cost / Balance / Intelligence options
- **Bugbot + `/review`**: PR and local code review
- **Projects coordinator agent**: one agent orchestrates several agents on a project
- **iOS app**: check on and steer agents from your phone

---

## Common Pitfalls

| Pitfall | Description | Solution |
|---------|-------------|----------|
| Rules ignored | You put `.md` files in `.cursor/rules/` | Rename to `.mdc` and add frontmatter |
| Rules too long | A single rule is thousands of lines, AI can't retain it all | Official advice: keep each rule under 500 lines; split into multiple `.mdc` files with globs |
| Agent goes off the rails | Agent mode edits files it shouldn't | Confirm scope in Plan mode first, limit with `@Files`, or mark no-go zones in rules |
| Completion too aggressive | Tab completion generates too much code at once | Press `Esc` to reject; snooze or disable it in `Cursor Settings → Tab` |
| Not enough context | AI doesn't understand project structure | Use `@Folders` to reference key directories, write good rules / `AGENTS.md` |

👉 **Deep dive**: [Cursor Pitfalls](../pitfalls/cursor.en.md) — 8 real-world traps (Agent rogue / @ reference silent fail / migrating off Notepads and more), each with Symptom / Cause / Recovery / Prevention

---

## Configuration Templates

Copy into your project's `.cursor/rules/` directory **and change the extension to `.mdc`** (e.g. `global.mdc`, `api.mdc`):

| Template | Purpose |
|----------|---------|
| [global.cursorrules.md](templates/global.cursorrules.md) | Global rules (code style, naming, restrictions); save as `.cursor/rules/global.mdc` |
| [api.cursorrules.md](templates/api.cursorrules.md) | API development rules (only active in API directories); save as `.cursor/rules/api.mdc` |

### Model Configuration

Cursor's model selection is configured in the settings UI (`Cursor Settings > Models`) — no need to manually edit JSON.

---

## Further Reading

- [Cursor Official Docs](https://cursor.com/docs)
- [Cursor Rules Docs](https://cursor.com/docs/context/rules)
- [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) — Community rules collection (38k+ stars)
- [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) — Skills methodology (also supports Cursor)
