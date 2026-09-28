[简体中文](./README.md) | **English**

# Trae Best Practices

> Trae is an AI IDE by ByteDance (based on VS Code) with a free tier. Developer-friendly for the Chinese market — Chinese UI, plus a separate edition for mainland China. Great for getting started with AI coding and budget-conscious teams.
>
> ⚠️ **Key changes in 2025-2026**:
> - **No more Claude**: after Anthropic restricted Chinese-controlled companies from using Claude in 2025-09, Trae removed all Claude models.
> - **Renamed**: the IDE was renamed **TraeCode** in 2026-08; the former SOLO was renamed **TRAE Work** on 2026-06-09. trae.ai now offers two downloads: TraeCode and TraeWork.
> - **Two editions**: the international [trae.ai](https://trae.ai) and the mainland [trae.cn](https://www.trae.cn) are separate products; the mainland edition uses domestic models and is directly reachable in China (check trae.cn for its current model list).

---

## Core Concepts

| Concept | Description | Use Case |
|---------|-------------|----------|
| **Agent** | Built-in Agent (called Builder in older versions) + custom agents (prompt + tools + MCP), plus SOLO Coder | Complex tasks, cross-file changes |
| **Chat** | Sidebar conversation | Q&A, understanding code |
| **Completion** | Inline code completion | Daily coding |
| **Rules** | Any `.md` under `.trae/rules/` | Project-level rules |
| **MCP** | One-click add from the MCP marketplace, or project-level `.trae/mcp.json` | Connect external tools |
| **@ References** | `@file` `@folder` `@web` | Pinpoint context precisely |

---

## Getting Started

### Installation

Download TraeCode from [trae.ai](https://trae.ai) (users in mainland China can use [trae.cn](https://www.trae.cn)). Supports macOS / Windows / Linux.

After signing up you can start using it right away — **no API key needed**. International pricing (see [trae.ai/pricing](https://www.trae.ai/pricing) for the latest):

| Plan | Price | Notes |
|------|-------|-------|
| Free | $0 | Auto mode only (model picked for you), limited usage, 5,000 completions/month |
| Pro | $20/month | Auto + all models, unlimited completions |
| Pro+ | $60/month | Higher usage |
| Ultra | $200/month | Highest usage |

### Rules — Project Rules

Create `.trae/rules/project_rules.md` (any `.md` under `.trae/rules/` is read, recursively through subfolders up to three levels deep):

```markdown
---
alwaysApply: true
---

# Project Rules

## Tech Stack
React + TypeScript + Ant Design + UmiJS

## Code Standards
- Use functional components + Hooks
- State management: @umijs/max built-in Model
- Use umi-request for HTTP calls, not fetch/axios directly
- Use CSS Modules for styling

## Localization Standards
- Comments in Chinese
- Commit messages in Chinese
- Variable names in English
```

`alwaysApply: true` in the frontmatter means the rule always applies; alternatively use `globs` (applies to matching files) or `description` (the AI decides when it applies). If your project already has `AGENTS.md` / `CLAUDE.md`, turn on "Include AGENTS.md / CLAUDE.md in context" under Settings > Rules to reuse them.

### Agent Mode

Agent is Trae's autonomous execution mode (called Builder in older versions), similar to Cursor's Agent. Besides the built-in Agent, you can create custom agents with their own prompts, toolsets, and MCP servers:

```
Use Agent mode.
Reference the pattern in src/pages/user/list.tsx,
create a new order list page at src/pages/order/list.tsx.
Requirements:
1. Table uses Ant Design ProTable
2. Support filtering by date, status, and amount
3. Support Excel export
4. Action column: view details, cancel order, refund
```

---

## Prompting Tips

### 1. Match Mode and Model to the Task

The Free plan only offers Auto mode (Trae picks the model); Pro and above let you choose models manually. Allocate wisely:

```
# Complex tasks — Agent mode + the strongest model available to you
Agent mode: refactor the entire auth module

# Simple tasks — Chat mode, Auto is fine
Chat mode: explain this code / write a comment
```

### 2. Chinese-Friendly

Trae has the best Chinese language support — you can interact entirely in Chinese:

```
Refactor the request wrapper in src/utils/request.ts:
1. Add unified loading state management
2. Show errors using Ant Design's message component
3. Auto-redirect to login on 401 errors
4. Set network timeout to 10 seconds
```

### 3. Ant Design Ecosystem

Trae works well with popular Chinese component libraries:

```
@https://ant-design.antgroup.com/components/table-cn
Refer to the Ant Design docs,
add a custom row expansion feature to ProTable
that shows order item details when expanded.
```

---

## How It Differs from Cursor

| Dimension | Trae | Cursor |
|-----------|------|--------|
| Price | Free tier (Auto mode only); Pro $20/month | $20/month |
| Chinese support | 3/3 (Chinese UI) | 1/3 (English only) |
| Access in China | 3/3 (direct access via the trae.cn edition) | 1/3 (requires proxy) |
| Agent capabilities | 2/3 | 3/3 |
| Rules system | 2/3 | 3/3 (glob-based on-demand loading) |
| Extension ecosystem | 2/3 (VS Code compatible) | 3/3 (VS Code compatible) |
| Best for | Getting started, budget-conscious, China-based teams | Advanced users, willing to pay, want the strongest tools |

---

## Common Pitfalls

| Pitfall | Description | Solution |
|---------|-------------|----------|
| Agent runs slow | The Free plan uses the standard queue and may wait | Use Agent for non-urgent tasks, Chat for urgent ones; or upgrade to a paid plan (fast queue) |
| Can't find Claude | Claude was removed in 2025-09 | Use another available model; switch tools if you must have Claude |
| Rules not working | Wrong file path, nesting depth, or frontmatter | Ensure files are under `.trae/rules/` (max three subfolder levels), in `.md` format; check `alwaysApply` / `globs` |

---

## Configuration Templates

| Template | Purpose |
|----------|---------|
| [project_rules.md](templates/project_rules.md) | Project rules template (React + UmiJS + Ant Design), copy to `.trae/rules/` |

---

## Further Reading

- [Trae Official Website](https://trae.ai) (mainland edition: [trae.cn](https://www.trae.cn))
- [Trae Official Docs](https://docs.trae.ai)
- [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) — Skills methodology (also supports Trae)
