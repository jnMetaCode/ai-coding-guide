# AI Coding Tools — The Practical Guide

> **Hands-on best practices for 9 AI coding tools** — No hype, just what works. Prompt techniques, workflow design, multi-tool orchestration, and copy-paste configs to maximize your AI-assisted development.

[简体中文](./README.md) | **English**

[![GitHub stars](https://img.shields.io/github/stars/jnMetaCode/ai-coding-guide?style=social)](https://github.com/jnMetaCode/ai-coding-guide)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)

<table>
<tr>
<td align="center"><strong>9 Tools</strong><br/>Full coverage</td>
<td align="center"><strong>66 Tips</strong><br/>Claude Code deep-dive</td>
<td align="center"><strong>7 Methodologies</strong><br/>Prompting / Debug / Test</td>
<td align="center"><strong>Copy-paste Configs</strong><br/>Ready to use</td>
</tr>
</table>

---

## Getting Started

**New here?** Three steps:
1. Read [Prompt Engineering](common/prompting.md) — learn how to talk to AI coding tools
2. Pick your tool → read its [Quick Start](#-9-tool-guides) section
3. Read [Task Decomposition](common/task-decomposition.md) — learn how to break work into AI-sized chunks

**Already using AI tools?** Jump to: [Advanced Tips](#-9-tool-guides) · [Multi-Tool Workflows](#-multi-tool-workflows) · [Ecosystem](#-ecosystem)

---

## 9 Tool Guides

| Tool | Type | Highlights |
|------|------|-----------|
| [**Claude Code**](claude-code/) | CLI Agent | 66 tips, Agent + Skill + Hook workflows |
| [**Cursor**](cursor/) | IDE | .cursorrules config, Composer Agent mode |
| [**GitHub Copilot**](copilot/) | IDE Plugin | Inline completion + Agent mode + custom instructions |
| [**OpenClaw**](openclaw/) | AI Agent Framework | 338k Stars, multi-platform + Skills + Cron automation |
| [Windsurf](windsurf/) | IDE | Cascade Agent, automatic context |
| [Gemini CLI](gemini-cli/) | CLI | By Google, large codebase analysis |
| [Kiro](kiro/) | IDE | By AWS, spec-driven development |
| [Aider](aider/) | CLI | Git-native, supports almost any LLM |
| [Trae](trae/) | IDE | By ByteDance, free Claude/GPT access |

> Every guide follows the same structure: **Core Concepts → Quick Start → Prompt Tips → Advanced Usage → Config Templates**

---

## Universal Methodologies

These apply regardless of which tool you use:

| Topic | What it solves |
|-------|---------------|
| [Prompt Engineering](common/prompting.md) | Prompt techniques specific to AI coding — not generic prompt engineering |
| [Task Decomposition](common/task-decomposition.md) | Breaking large tasks into AI-manageable pieces |
| [Code Review](common/code-review.md) | Best practices for AI-assisted code review |
| [Debugging](common/debugging.md) | Systematic debugging methodology with AI |
| [Context Management](common/context-management.md) | Managing the context window to prevent AI from "getting dumber" |
| [Testing Strategy](common/testing.md) | Writing tests with AI — approaches and pitfalls |
| [Security](common/security.md) | Security risks in AI-assisted coding and how to mitigate them |

---

## Multi-Tool Workflows

The real productivity gains come from combining tools, not using one in isolation.

| Workflow | Description |
|----------|-------------|
| [Claude Code + Cursor](workflows/claude-code-cursor.md) | Claude Code for architecture & complex refactoring, Cursor for daily coding |
| [Claude Code + Copilot](workflows/claude-code-copilot.md) | Claude Code for agentic tasks, Copilot for inline completions |
| [Tool Selection Guide](workflows/tool-selection.md) | Which tool for which scenario — one table to rule them all |

---

## Ecosystem

These projects work together to cover the full AI-assisted development pipeline:

```
Learn the tools → Inject methodologies → Load expert roles → Orchestrate roles → Safety guardrails
(guide)           (superpowers)         (agents)            (orchestrator)      (shellward)
```

| Project | Purpose | Description |
|---------|---------|-------------|
| **This repo** | Learning | Practical guides for 9 AI coding tools |
| [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) | Methodology | 20 skills for AI coding tools — TDD, debugging, code review, and more |
| [agency-agents-zh](https://github.com/jnMetaCode/agency-agents-zh) | Expert Roles | 187 professional roles — turn AI into a security engineer, DBA, PM, etc. |
| [agency-orchestrator](https://github.com/jnMetaCode/agency-orchestrator) | Orchestration | YAML-based multi-role collaboration for complex tasks |
| [shellward](https://github.com/jnMetaCode/shellward) | Safety | Prevent AI agents from running dangerous commands or leaking sensitive data |

> [Full ecosystem setup guide →](ecosystem.md)

---

## Why This Guide?

Most AI coding resources fall into two camps: shallow "getting started" posts, or single-tool deep dives. This guide fills the gap:

- **Practical over theoretical** — Every tip has been tested in real projects. No "AI will change everything" filler.
- **Cross-tool coverage** — Compare approaches across 9 tools. Know when to use Cursor vs Claude Code vs Copilot.
- **Multi-tool workflows** — The biggest wins come from combining tools. We show you how.
- **Copy-paste ready** — Config templates, prompt snippets, and .cursorrules you can drop into your project today.
- **Prompt engineering for code** — Generic prompt guides don't cover the nuances of AI coding. This one does.

---

## Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md).

In short: add tips, fix outdated content, share workflow experiences — Issues and PRs both work.

---

## Acknowledgments

This guide builds on excellent work from:

- [claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) — Claude Code best practices
- [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) — Cursor rules collection
- [awesome-copilot](https://github.com/github/awesome-copilot) — Official GitHub Copilot resources
- [gemini-cli-tips](https://github.com/addyosmani/gemini-cli-tips) — Gemini CLI tips
- [Everything Claude Code](https://github.com/anthropics/everything-claude-code) — Instinct scoring, AgentShield, multi-language rules
- [BMAD-METHOD](https://github.com/bmadcode/BMAD-METHOD) — Full SDLC, agent roles, multi-platform

---

<div align="center">

**Make AI coding tools actually work for you.**

[Star this repo](https://github.com/jnMetaCode/ai-coding-guide) · [Open an Issue](https://github.com/jnMetaCode/ai-coding-guide/issues) · [Contribute](https://github.com/jnMetaCode/ai-coding-guide/pulls)

</div>
