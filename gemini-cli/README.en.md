[简体中文](./README.md) | **English**

# Gemini CLI Best Practices

> ⚠️ **Important change (since 2026-06-18)**: According to the [Google Developers Blog](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/), Gemini CLI **no longer serves individual users** (free Gemini Code Assist for individuals and Google AI Pro / Ultra sign-ins no longer work). Enterprise users (Gemini Code Assist Standard / Enterprise) and **paid Gemini API keys** still work, and Google continues to ship updates and support for enterprise users. Individual developers should switch to **Antigravity CLI**, which keeps Skills, Hooks, and Subagents, with Extensions becoming Antigravity plugins.

> Gemini CLI is Google's command-line AI coding tool. Its biggest advantage: **a massive context window (1M tokens on Gemini 3 models)**. Great for large codebase analysis and long-running tasks.

---

## Core Concepts

| Concept | Description | Use Case |
|---------|-------------|----------|
| **GEMINI.md** | Project configuration file | Similar to Claude Code's CLAUDE.md |
| **Tools** | Built-in tools (read/write files, run commands, etc.) | Foundation for Agent capabilities |
| **Extensions** | Plugins | Connect to Google services and third-party APIs |
| **Context Window** | 1M tokens (Gemini 3 models) | Understand massive codebases in a single pass |
| **Sandbox** | Security sandbox | Isolate execution of untrusted code |
| **Skills** | `.gemini/skills/` or `.agents/skills/` | Manage with `gemini skills install / list / uninstall` |
| **Other built-ins** | Native MCP, Hooks, Subagents, Plan Mode, Policy Engine, checkpointing, headless mode | Broadly on par with Claude Code / Codex |

---

## Getting Started

### Installation

```bash
npm install -g @google/gemini-cli

# or Homebrew
brew install gemini-cli
```

After installation, run `gemini` to enter interactive mode and sign in with an enterprise Google account (Code Assist Standard / Enterprise), or set a paid `GEMINI_API_KEY`. Personal Google account sign-in has not worked since 2026-06-18.

> For the latest installation instructions, see the [official repository](https://github.com/google-gemini/gemini-cli).

### GEMINI.md — Project Configuration

```markdown
# Project Background
This is a Go microservices project with 12 services.

# Directory Structure
- cmd/         — Service entry points
- internal/    — Internal packages
- pkg/         — Shared packages
- proto/       — Protobuf definitions
- deployments/ — K8s configs

# Common Commands
- Build all services: make build-all
- Run tests: make test
- Generate protos: make proto-gen
- Local startup: docker compose up

# Important Notes
- Inter-service communication uses gRPC, not HTTP
- All config goes through Viper, no hardcoding
```

---

## Using the Large Context Window Effectively

Gemini CLI's 1M token context window is its core advantage. But bigger isn't always better — the key is using it right.

### Good Use Cases for Large Context

```
# 1. Full project architecture analysis
Read the entire src/ directory and map out module dependencies.
Which modules have the highest coupling? Suggest ways to decouple them.

# 2. Global refactoring assessment
If we want to switch the ORM from GORM to sqlc,
how large is the blast radius? List every file that needs changes.

# 3. Cross-service issue investigation
Users aren't receiving notifications after placing orders.
Trace the full call chain from order-service to notification-service.
Examine the code at each step and find where it breaks.
```

### Poor Use Cases for Large Context

```
Do NOT dump all of node_modules into it
Do NOT analyze 100k lines of code and ask "are there any bugs"
Do NOT use large context as a substitute for precise investigation
```

---

## Prompting Tips

### 1. Batch Analysis

```
Check error handling in every Go file under src/:
1. Are any error return values ignored (_ = xxx)?
2. Is fmt.Println used for errors instead of a proper logger?
3. Is panic called in non-main functions?
List all issues, grouped by file.
```

### 2. Codebase Navigation

```
I just inherited this project. Help me understand:
1. What layers does a request pass through from HTTP in to response out?
2. Which layer handles database operations?
3. How is authentication and authorization implemented?
4. Is there any documentation or comments explaining architecture decisions?
Give me a concise architecture overview.
```

### 3. Code Migration Assessment

```
This project needs to migrate from Python 2 to Python 3.
Scan all .py files and find:
1. Print statements (not function calls)
2. unicode/str type issues
3. Deprecated standard library usage
4. Incompatible third-party library versions
Sort by migration priority.
```

---

## How It Differs from Claude Code

| Dimension | Gemini CLI | Claude Code |
|-----------|-----------|-------------|
| Context window | 1M tokens (Gemini 3) | 1M tokens (Opus 5.5 / Sonnet 5.5) |
| Individual users | No longer served since 2026-06-18 (enterprise accounts / paid API keys only) | Pro / Max subscriptions or API |
| Agent capabilities | 2/3 | 3/3 |
| Tool ecosystem | Strong Google services integration | Richest MCP ecosystem |
| Skill support | Yes (`.gemini/skills/` or `.agents/skills/`) | Yes (`.claude/skills/`) |
| Best for | Large codebase analysis, teams already on Google enterprise plans | Complex Agent tasks, strong execution needed |

**Recommended combo**: Use Gemini CLI for large-scale analysis and comprehension, use Claude Code for precise modifications and execution.

---

## Common Pitfalls

| Pitfall | Description | Solution |
|---------|-------------|----------|
| Too much context slows things down | Filling the full 1M is slow to process | Only use large context when you need a global view |
| Personal account sign-in fails | Individual users are no longer served since 2026-06-18 | Switch to Antigravity CLI, or use an enterprise account / paid API key |
| Weaker tooling than Claude Code | File ops and command execution not as strong | Use Gemini for analysis, Claude Code for execution |

---

## Configuration Templates

| Template | Purpose |
|----------|---------|
| [GEMINI.md](templates/GEMINI.md) | Project config file template, copy to project root and customize |

---

## Further Reading

- [Gemini CLI Official Docs](https://github.com/google-gemini/gemini-cli)
- [gemini-cli-tips](https://github.com/addyosmani/gemini-cli-tips) — Addy Osmani's 30 tips
- [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) — Skills methodology (also supports Gemini CLI)
