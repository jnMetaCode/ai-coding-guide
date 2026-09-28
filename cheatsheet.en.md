[简体中文](./cheatsheet.md) | **English**

# 10-Tool Cheatsheet

> Key parameters, commands, and hotkeys for all 10 tools on one page. Models and pricing move fast — check each tool's website for the current truth.
>
> Snapshot date: **2026-09**

---

## 1. Pick a Tool in 30 Seconds

| What you want | First pick | Alternatives |
|---------------|------------|--------------|
| Tab completion inside an IDE | **Cursor** | Copilot / Devin Desktop (formerly Windsurf) / Trae |
| Agent in the terminal for complex tasks | **Claude Code** | **Codex CLI** / Aider / Gemini CLI |
| Already subscribed to ChatGPT | **Codex CLI** | Cursor with GPT |
| Analyze a huge codebase in one pass | **Claude Code** (Opus/Sonnet 5.5 both have 1M context) | Gemini CLI (1M; individual users must switch to Antigravity CLI) / Aider + map mode |
| Tight budget / zero cost | **Trae** (free plan, Auto mode only) or **Aider + local models** | `codex --oss --local-provider ollama`; Copilot / Kiro free tiers |
| Direct network in China (no VPN) | **Trae** | OpenClaw + local model |
| Team collaboration, spec-driven | **Kiro** (Spec) | Claude Code plan mode |
| Git-native, multi-model | **Aider** | — |
| AI agent automation (beyond coding) | **OpenClaw** | — |
| Stick with VS Code, nothing new to install | **Copilot** | Cursor / Devin Desktop / Trae are VS Code forks |

---

## 2. Capability Matrix

| Dimension | Claude Code | Codex CLI | Cursor | Copilot | Devin Desktop (formerly Windsurf) | Gemini CLI | Kiro | Aider | Trae | OpenClaw |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Type** | CLI | CLI | IDE | IDE plugin | IDE | CLI | IDE | CLI | IDE | Agent framework |
| **Vendor** | Anthropic | OpenAI | Cursor (owned by SpaceX) | GitHub | Cognition | Google | AWS | OSS | ByteDance | OpenClaw Foundation |
| **Tab completion** | — | — | ★★★ | ★★★ | ★★★ | — | ★★ | — | ★★ | — |
| **Agent execution** | ★★★ | ★★★ | ★★★ | ★★★ | ★★★ | ★★ | ★★ | ★★ | ★★ | ★★★ |
| **Runs in terminal** | ★★★ | ★★★ | ★ | ★★ (Copilot CLI) | ★ | ★★★ | ★★ (Kiro CLI) | ★★★ | — | ★★★ |
| **Context window** | **1M** (Haiku 200K) | per model | per model | per model | per model | **1M** | per model | per model | per model | per model |
| **MCP support** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | Native |
| **Hook automation** | ✅ (30+ events) | ✅ (12 events, on by default) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (lint/test) | — | ✅ (Cron) |
| **Subagent** | ✅ | ✅ (TOML) | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ (custom agents) | ✅ (workspaces) |
| **Sandbox** | OS-level Bash sandbox (Seatbelt/bubblewrap) | OS-level (Seatbelt/bubblewrap) | — | — | — | — | — | — | — | — |
| **Multi-model** | ★ (Claude only) | ★ (OpenAI only) | ★★★ | ★★ | ★★★ | ★ (Gemini only) | ★★ | ★★★ (almost any LLM) | ★★ | ★★★ |
| **Open source** | — | ✅ Apache-2.0 | — | — | — | ✅ Apache-2.0 | — | ✅ Apache-2.0 | — | ✅ MIT |
| **Direct access in China** | — | — | — | — | — | — | — | — | ✅ (China edition trae.cn) | ✅ (with local model) |
| **Pricing model** | Pro/Max plan / API | ChatGPT plan / API | Free / $20 Pro | Free / from $10 Pro (AI Credits) | Free / $20 Pro | Enterprise / paid API key (free personal tier discontinued) | Free 50 credits / $20 Pro | Whatever LLM you pick | Free (Auto) / $20 Pro | OSS free |

---

## 3. Config Files at a Glance

Knowing where each tool keeps its config is half the onboarding battle.

| Tool | Main config | Location | Notes |
|------|------------|----------|-------|
| Claude Code | `CLAUDE.md` + `.claude/` | Project root | Keep under 200 lines; split to `.claude/rules/` for big projects (`paths:` for path-scoped loading); falls back to `AGENTS.md` when there's no CLAUDE.md |
| Codex CLI | `AGENTS.md` + `.codex/config.toml` | Project root | `~/.codex/AGENTS.md` for global; nested AGENTS.md overrides parents |
| Cursor | `.cursor/rules/*.mdc` | Project root | Must be `.mdc` (plain `.md` is ignored); frontmatter `description` / `globs` / `alwaysApply`; also reads `AGENTS.md` |
| Copilot | `.github/copilot-instructions.md` | Project root | Also `.github/instructions/*.instructions.md` (`applyTo`) and `.github/agents/*.agent.md`; chatModes is deprecated |
| Devin Desktop (formerly Windsurf) | `.devin/rules/*.md` | Project root | `trigger: always_on / model_decision / glob / manual`; `.windsurfrules` kept only for backward compatibility |
| Gemini CLI | `GEMINI.md` | Project root | Structure similar to CLAUDE.md |
| Kiro | `.kiro/steering/*.md` | Project root | Four `inclusion:` modes: `always` / `fileMatch` / `manual` / `auto`; global `~/.kiro/steering/` |
| Aider | `.aider.conf.yml` | Project root | YAML with model/lint/test settings |
| Trae | `.trae/rules/*.md` | Project root | Read recursively, up to three levels; can import `AGENTS.md` / `CLAUDE.md` |
| OpenClaw | `~/.openclaw/openclaw.json` | User home | JSON5, hot-reloaded |

---

## 4. Essential Commands

### Claude Code

```bash
# Install & run
curl -fsSL https://claude.ai/install.sh | bash   # Officially recommended (brew / winget / npm also work)
claude                          # Enter interactive
claude --resume                 # Resume last session
claude --model haiku            # Cheap model for simple tasks
claude -p "task" --output-format json   # Headless

# Inside the session
/compact                        # Compress context
/context                        # Show context usage
/effort                         # Adjust thinking depth (low → max)
Shift+Tab                       # Cycle permission modes (incl. plan / auto)
/code-review                    # Review current changes
Esc                             # Interrupt current generation
```

### Codex CLI

```bash
# Install & run
curl -fsSL https://chatgpt.com/codex/install.sh | sh   # Officially recommended (npm / brew also work)
codex                              # Enter TUI (first-run guides ChatGPT login)
codex --sandbox workspace-write    # Default combo (`--full-auto` has been removed)
codex --sandbox read-only          # Read-only exploration
codex --add-dir ../sibling-repo    # Add writable dirs without opening the whole sandbox
codex --yolo                       # Skip sandbox AND approvals (only when externally sandboxed)
codex exec --json "..." | jq -c .  # JSONL output for downstream scripts
codex --oss --local-provider ollama -m qwen3-coder   # Free, fully local
codex app-server                   # For integrating Codex into other programs (old mcp-server removed)
codex resume                       # Resume last session

# Inside the TUI
/init                              # Scaffold AGENTS.md
/plan       Shift+Tab              # Plan mode
/model                             # Switch model
/review                            # Review diff / branch / commit
/compact                           # Compress conversation
/multi-agents                      # Manage subagents (alias /subagents)
/import                            # Migrate config from Claude Code / Cursor
/diff                              # Git diff (including untracked)
/debug-config                      # Diagnose config.toml not taking effect
```

### Cursor

```
Tab             — Accept completion
Cmd+I / Cmd+L   — Toggle the Agent sidebar (selection auto-attached)
Shift+Tab       — Cycle Agent / Ask / Plan modes
Cmd+E           — Switch Agent layout
Cmd+K           — Inline edit
Esc             — Reject completion

@Files @Folders @Terminals @Chats @Branch @Browser   — References
(Notepads were removed in 2.0 — use rules / skills instead)
```

### GitHub Copilot

```
Tab             — Accept completion
Esc             — Reject completion
Ctrl+Cmd+I      — Open the Chat view
Shift+Cmd+I     — Open Chat in Agent mode
Cmd+I           — Inline chat
Alt+] / Alt+[   — Cycle completion suggestions

#file #selection #terminal #problems   — References
#codebase                               — Force semantic search over the whole project (Agent searches automatically anyway)
/agents                                 — Pick a custom agent (.github/agents/)
```

### Devin Desktop (formerly Windsurf)

```
Code mode (default) — Edit code directly
Plan mode       — Plan first
Ask mode        — Read-only Q&A
Cmd+.           — Switch modes

The local agent has moved from Cascade to Devin Local (with subagent support)
/workflow-name  — Run a workflow from .devin/workflows/
```

### Gemini CLI

```bash
# ⚠️ Service ended for individual/free users on 2026-06-18 — individuals should switch to Antigravity CLI; Enterprise and paid API keys still work
npm install -g @google/gemini-cli   # or brew install gemini-cli
gemini                          # Enter interactive
# The 1M context suits big-codebase analysis (overkill for small tasks)
```

### Kiro

```
1. Describe need → 2. Kiro writes Spec (requirements.md + design.md + tasks.md) → 3. You review → 4. Implement task by task

Steering load modes (frontmatter `inclusion:`):
- always                                     Loaded every conversation
- fileMatch + fileMatchPattern: "**/*.java"  Loaded for matching files
- manual                                     Invoked on demand
- auto                                       Decided automatically from description
```

### Aider

```bash
# Install & run
python -m pip install aider-install && aider-install
aider --model sonnet                   # Built-in alias for a recent Claude Sonnet
aider --model deepseek/deepseek-v4-pro # Cheap (deepseek-chat was retired in 2026-07)
aider --model ollama/qwen3-coder       # Free, local

# Inside the session
/add file1 file2      — Add files to context
/drop file            — Remove file
/code                 — Code mode (edit directly)
/ask                  — Ask mode (no edits)
/architect            — Design first, then implement
```

### Trae

```
Agent mode      — Multi-file edits (build your own agents: prompt + tools + MCP)
Chat mode       — Q&A

@file @folder @web     — References
Free plan is Auto mode only; the international edition dropped Claude models in 2025-09
```

### OpenClaw

```bash
openclaw onboard                    # Initial setup
openclaw gateway start              # Start the gateway
openclaw doctor                     # Diagnostics

openclaw skills install @owner/<slug>  # Install a ClawHub Skill
openclaw automations create ...        # Scheduled task (cron still works as an alias)
openclaw models set anthropic/claude-sonnet-5-5  # Switch model (provider/model)
openclaw channels add telegram       # Add messaging channel
```

---

## 5. Decision Flow

```
┌─ Mostly working in a terminal?
│   ├─ Strongest Agent / big refactors → Claude Code
│   ├─ Already on ChatGPT / kernel-level sandbox → Codex CLI
│   ├─ Google ecosystem / enterprise license → Gemini CLI (individuals → Antigravity CLI)
│   └─ Multi-model / Git-native → Aider
│
├─ Mostly in an IDE?
│   ├─ Don't want a new IDE    → GitHub Copilot (VS Code/JetBrains plugin)
│   ├─ Willing to switch, budget ok → Cursor
│   ├─ Want the AI to be proactive / local + cloud agent board → Devin Desktop (formerly Windsurf)
│   ├─ Chinese UI / local network → Trae (China edition trae.cn)
│   └─ Team / spec-driven      → Kiro
│
└─ Non-coding AI automation?
    └─ Multi-platform, cron, skills → OpenClaw
```

---

## 6. Recommended Combos

| Combo | When |
|-------|------|
| **Claude Code + Cursor** | Most popular full-stack combo: CLI for heavy lifting, IDE for daily work |
| **Codex CLI + Cursor** | For ChatGPT subscribers: CLI as Agent, IDE for completions |
| **Codex CLI + Claude Code** | Two CLIs, complementary: Codex for CI/scripts, Claude Code for big refactors |
| **Claude Code + Copilot** | Lightweight for pure VS Code users |
| **Copilot Free + Aider with local model** | Budget-conscious: IDE completion + terminal agent, zero subscriptions |
| **Aider + local LLM** | Zero API cost: `ollama/qwen3-coder` + Aider |
| **Codex CLI --oss + Ollama** | Zero API cost but you want Codex's agent experience: kernel-level sandbox + local model |
| **Claude Code + OpenClaw** | Coding + automation: CC codes, OpenClaw runs scheduled tasks |

See [Tool Selection Guide](workflows/tool-selection.en.md) and [Real-World Scenarios](workflows/scenarios.en.md) for details.

---

## 7. Further Reading

- Per-tool deep dives: each tool's README at the project root
- Prompt techniques: [common/prompting.en.md](common/prompting.en.md)
- Methodology overview: see the [Universal Methodologies](README.en.md#universal-methodologies) section in the main README
