[简体中文](./tool-selection.md) | **English**

# Multi-Tool Selection Guide

> Different AI coding tools excel at different things. Pick the right tool and double your productivity; pick the wrong one and you'll waste time fighting it.

---

## Quick Reference: Which Tool for What

| Scenario | Recommended Tool | Why |
|----------|-----------------|-----|
| **Daily coding** (completions, small edits) | Cursor / Copilot | IDE integration, just press Tab |
| **Complex refactoring** (cross-file, architecture-level) | Claude Code | Strongest Agent capabilities, understands the whole project |
| **New project scaffolding** | Claude Code | Starting from scratch needs big-picture planning ability |
| **Bug debugging** | Claude Code | Can read logs, run commands, do systematic analysis |
| **Code review** | Claude Code / Cursor | Claude Code is more thorough, Cursor is quicker |
| **Learning a new codebase** | Cursor (Ask mode) | Select code and ask questions — the most natural interaction |
| **Writing tests** | Claude Code | Can run tests, check coverage, auto-fix failures |
| **Documentation / comments** | Copilot | Inline completion makes writing comments seamless |
| **Frontend UI tweaks** | Cursor | Live preview + visual editing |
| **CLI / scripting** | Claude Code / Codex CLI | CLI-native, fits terminal workflows |
| **Exploring large codebases** | Claude Code | Opus/Sonnet 5.5 both have 1M context (Gemini CLI is also 1M, but no longer serves individual users — enterprise / paid API keys only) |
| **CI / automated code review** | Codex CLI | Official GitHub Action with built-in restricted sandbox proxy |
| **Already on ChatGPT Plus/Pro** | Codex CLI | Subscription quota included; OS-kernel sandbox out of the box |
| **Fully offline / zero API cost** | Codex CLI or Aider | `codex --oss --local-provider ollama` runs local models |
| **Enterprise command safety policy** | Codex CLI | Starlark `prefix_rule()` DSL — finer-grained than approval modes |

---

## Tool Capability Comparison

| Capability | Claude Code | Codex CLI | Cursor | Copilot | Gemini CLI |
|------------|:---:|:---:|:---:|:---:|:---:|
| Code completion | -- | -- | 3/3 | 3/3 | -- |
| Conversational coding | 3/3 | 3/3 | 2/3 | 2/3 | 3/3 |
| Autonomous Agent execution | 3/3 | 3/3 | 2/3 | 2/3 | 2/3 |
| Terminal command execution | 3/3 | 3/3 | -- | -- | 3/3 |
| Multi-file coordination | 3/3 | 2/3 | 2/3 | 2/3 | 2/3 |
| Project rules config | 3/3 | 3/3 | 3/3 | 2/3 | 2/3 |
| Extensibility (MCP) | 3/3 | 3/3 | 2/3 | 2/3 | 2/3 |
| Sandbox depth | OS-level Bash sandbox + hooks | **OS kernel** | -- | -- | -- |
| Local model support | -- | 3/3 (--oss) | -- | -- | -- |
| Context window | 3/3 (1M) | 2/3 | 2/3 | 2/3 | 3/3 (1M) |
| IDE integration | -- | -- | 3/3 | 3/3 | -- |
| Free tier | 1/3 | 2/3 (ChatGPT plan included) | 1/3 | 2/3 | -- (individual free tier ended) |

---

## Recommended Combos

### Combo 1: Claude Code + Cursor (Most Popular)

```
Claude Code -> Architecture design, complex refactoring, debugging, testing
Cursor      -> Daily coding, small edits, UI tweaks, quick Q&A
```

Best for: Full-stack developers who work on both frontend and backend

### Combo 2: Claude Code + Copilot (Lightweight)

```
Claude Code -> Agent tasks (refactoring, generation, debugging)
Copilot     -> Inline completion, writing comments, simple Q&A
```

Best for: Backend developers, VS Code users

### Combo 3: Copilot Free + Aider with a Local Model (Budget-Friendly)

```
Copilot Free           -> Inline completion, simple Q&A
Aider + local model    -> Terminal Agent tasks (e.g. `aider --model ollama/qwen3-coder`)
```

Best for: Solo developers who want to keep costs down (IDE completion + terminal Agent with zero subscriptions; Trae's free tier, Auto mode only, also works)

### Combo 4: Codex CLI + Cursor (ChatGPT Subscribers)

```
Codex CLI -> Agent tasks, CI auto-review, kernel-level sandbox execution
Cursor    -> Daily coding, Tab completion
```

Best for: ChatGPT Plus/Pro subscribers who want their plan to drive Agent value;
especially for security-sensitive work needing kernel-level sandbox (Seatbelt / bubblewrap).

### Combo 5: Codex CLI + Claude Code (Dual CLI)

```
Codex CLI    -> Fast iteration, CI/scripting, token-efficient micro-edits
Claude Code  -> Cross-12-file refactors, dependency-graph-heavy precision work
```

Best for: High-intensity full-time devs running "keystrokes vs commits" in parallel.
Community consensus: *Codex for keystrokes, Claude Code for commits.*

---

## When to Switch Tools

Signals that it's time to switch from one tool to another:

| Signal | Action |
|--------|--------|
| Cursor's completion is wrong after 3 attempts | Switch to Claude Code for systematic analysis |
| Claude Code conversation is too long and quality drops | Start a new conversation, or switch to Cursor for remaining small tasks |
| Need to see live results | Switch to Cursor / Copilot (in-IDE preview) |
| Need to run commands to verify | Switch to Claude Code / Codex CLI (in-terminal) |
| Need to understand a large codebase | Switch to Claude Code (1M context) |
| Need to run a non-interactive Agent in CI | Switch to Codex CLI (`codex exec --json` + official Action) |
| Handling sensitive data / offline environment | Switch to Codex CLI (`--oss --local-provider ollama`) |
| Need kernel-level sandbox guarantees | Switch to Codex CLI (Seatbelt / bubblewrap) |
