# AI Coding Tools — The Practical Guide

> **Hands-on best practices for 10 AI coding tools** — No hype, just what works. Prompt techniques, workflow design, multi-tool orchestration, and copy-paste configs to maximize your AI-assisted development.

[简体中文](./README.md) | **English**

[![GitHub stars](https://img.shields.io/github/stars/jnMetaCode/ai-coding-guide?style=social)](https://github.com/jnMetaCode/ai-coding-guide)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)

<table>
<tr>
<td align="center"><strong>10 Tools</strong><br/>Full coverage</td>
<td align="center"><strong>66 Tips</strong><br/>Claude Code deep-dive</td>
<td align="center"><strong>7 Methodologies</strong><br/>Prompting / Debug / Test</td>
<td align="center"><strong>Copy-paste Configs</strong><br/>Ready to use</td>
</tr>
</table>

---

## Getting Started

**Start with the [📋 Cheatsheet](cheatsheet.en.md)** — all 10 tools on one page: type, context window, config files, core commands. Know what to pick, how to set it up, how to use it.

**Pick a path based on your profile:**

| You are... | Recommended reading order |
|------------|---------------------------|
| Total newcomer to AI coding | [Cheatsheet](cheatsheet.en.md) → [Copilot](copilot/) (free tier) or [Cursor](cursor/) (free tier) → [Prompt Engineering](common/prompting.en.md) |
| Frontend / daily coding | [Cursor](cursor/) → [Prompt Engineering](common/prompting.en.md) → [Scenarios](workflows/scenarios.en.md) |
| Backend / refactoring / big projects | [Claude Code](claude-code/) → [Task Decomposition](common/task-decomposition.en.md) → [Scenarios](workflows/scenarios.en.md) |
| Migrating from Copilot | [Copilot](copilot/) → [Claude Code](claude-code/) (compare) → [Tool Selection](workflows/tool-selection.en.md) |
| Already on ChatGPT Plus/Pro | [Codex CLI](codex/) → [Claude Code](claude-code/) (compare) → [Tool Selection](workflows/tool-selection.en.md) |
| Cost-conscious / solo dev | [Cheatsheet](cheatsheet.en.md) → [Gemini CLI](gemini-cli/) or [Aider](aider/) + local models |
| Team / high-quality delivery | [Kiro](kiro/) → [Code Review](common/code-review.en.md) → [Testing](common/testing.en.md) |

**Already using AI tools?** Jump to: [Cheatsheet](cheatsheet.en.md) · [Advanced Tips](#9-tool-guides) · [Real-World Workflows](#real-world-workflows) · [Ecosystem](#ecosystem)

---

## 10 Tool Guides

| Tool | Type | Highlights |
|------|------|-----------|
| [**Claude Code**](claude-code/README.en.md) | CLI Agent | 66 tips, Agent + Skill + Hook workflows |
| [**Codex CLI**](codex/README.en.md) | CLI Agent | OpenAI's open-source (Rust), Sandbox + AGENTS.md, ChatGPT-plan friendly |
| [**Cursor**](cursor/README.en.md) | IDE | .cursorrules config, Composer Agent mode |
| [**GitHub Copilot**](copilot/README.en.md) | IDE Plugin | Inline completion + Agent mode + custom instructions |
| [**OpenClaw**](openclaw/README.en.md) | AI Agent Framework | 338k Stars, multi-platform + Skills + Cron automation |
| [Windsurf](windsurf/README.en.md) | IDE | Cascade Agent, automatic context |
| [Gemini CLI](gemini-cli/README.en.md) | CLI | By Google, large codebase analysis |
| [Kiro](kiro/README.en.md) | IDE | By AWS, spec-driven development |
| [Aider](aider/README.en.md) | CLI | Git-native, supports almost any LLM |
| [Trae](trae/README.en.md) | IDE | By ByteDance, free Claude/GPT access |

> Every guide follows the same structure: **Core Concepts → Quick Start → Prompt Tips → Advanced Usage → Config Templates**

---

## Universal Methodologies

These apply regardless of which tool you use:

| Topic | What it solves |
|-------|---------------|
| [Prompt Engineering](common/prompting.en.md) | Prompt techniques specific to AI coding — not generic prompt engineering |
| [Task Decomposition](common/task-decomposition.en.md) | Breaking large tasks into AI-manageable pieces |
| [Code Review](common/code-review.en.md) | Best practices for AI-assisted code review |
| [Debugging](common/debugging.en.md) | Systematic debugging methodology with AI |
| [Context Management](common/context-management.en.md) | Managing the context window to prevent AI from "getting dumber" |
| [Testing Strategy](common/testing.en.md) | Writing tests with AI — approaches and pitfalls |
| [Security](common/security.en.md) | Security risks in AI-assisted coding and how to mitigate them |

---

## Real-World Workflows

How real projects run end-to-end, and how different tools play to their strengths.

| Workflow | Description |
|----------|-------------|
| [Real-World Scenarios](workflows/scenarios.en.md) | Refactor, collaborative dev, test backfill — 3 end-to-end scripts, copy and adapt |
| [⚠️ Pitfalls](pitfalls/README.en.md) | Claude Code / Cursor / Copilot — 8 real-world traps each, with Symptom / Cause / Recovery / Prevention |
| [Claude Code + Cursor](workflows/claude-code-cursor.en.md) | Claude Code for architecture & complex refactoring, Cursor for daily coding |
| [Claude Code + Copilot](workflows/claude-code-copilot.en.md) | Claude Code for agentic tasks, Copilot for inline completions |
| [Tool Selection Guide](workflows/tool-selection.en.md) | Which tool for which scenario — one table to rule them all |

---

## Ecosystem

These projects work together to cover the full AI-assisted development pipeline:

```
Learn the tools → Inject methodologies → Load expert roles → Orchestrate roles → Safety guardrails
(guide)           (superpowers)         (agents)            (orchestrator)      (shellward)
```

| Project | Purpose | One-liner | Setup |
|---------|---------|-----------|-------|
| **This repo** (ai-coding-guide) | 📖 Practical Guide | 66 Claude Code tips + best practices for 9 tools + config templates | — |
| [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) ![](https://img.shields.io/github/stars/jnMetaCode/superpowers-zh?style=flat&label=⭐) | 🧠 Methodology | 20 skills teaching AI how to work (TDD / debugging / code review) | [Install & Use](ecosystem.en.md#1-superpowers-zh--inject-work-methodology-into-ai) |
| [agency-agents-zh](https://github.com/jnMetaCode/agency-agents-zh) ![](https://img.shields.io/github/stars/jnMetaCode/agency-agents-zh?style=flat&label=⭐) | 🎭 Expert Roles | 211 **plug-and-play** AI specialists, incl. 46 China-native (Xiaohongshu / Douyin / Feishu / DingTalk) | [Install & Use](ecosystem.en.md#2-agency-agents-zh--211-ai-expert-roles) |
| [agency-orchestrator](https://github.com/jnMetaCode/agency-orchestrator) | 🚀 Orchestration Engine | One prompt → 211 specialists collaborate, **plan in minutes** (9 LLMs / 6 free) | [Install & Use](ecosystem.en.md#3-agency-orchestrator--multi-role-yaml-orchestration) |
| [shellward](https://github.com/jnMetaCode/shellward) | 🛡️ Security Middleware | 8-layer defense + DLP dataflow + injection detection, **zero-dep** (MCP Server included) | [Install & Use](ecosystem.en.md#4-shellward--security-guardrails-for-ai-agents) |

> [Full ecosystem setup guide →](ecosystem.en.md)

---

## Why This Guide?

Most AI coding resources fall into two camps: shallow "getting started" posts, or single-tool deep dives. This guide fills the gap:

- **Practical over theoretical** — Every tip has been tested in real projects. No "AI will change everything" filler.
- **Cross-tool coverage** — Compare approaches across 9 tools. Know when to use Cursor vs Claude Code vs Copilot.
- **Multi-tool workflows** — The biggest wins come from combining tools. We show you how.
- **Copy-paste ready** — Config templates, prompt snippets, and .cursorrules you can drop into your project today.
- **Prompt engineering for code** — Generic prompt guides don't cover the nuances of AI coding. This one does.

---

## 📚 Further Learning

This project covers "how to use the 9 tools well." Want to go deeper? See **[Further Learning Resources](resources.en.md)** — a curated list of **20+ high-quality GitHub repos / blogs / podcasts** organized by topic (Prompt Engineering / MCP Ecosystem / Claude Code Deep Dive / Agent Engineering / Chinese Resources / Official Blogs).

## 🆕 Changelog

See **[CHANGELOG](CHANGELOG.en.md)** for important updates. Latest major update: **2026-04** added cheatsheet, 31 deep pitfalls, end-to-end scenario scripts, persona-based learning paths, and 20+ external learning resources.

---

## Contributing

Contributions welcome! See [CONTRIBUTING.en.md](./CONTRIBUTING.en.md).

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
