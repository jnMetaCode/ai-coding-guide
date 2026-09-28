[简体中文](./README.md) | **English**

# OpenClaw Best Practices

> OpenClaw is an open-source AI personal assistant framework (390k+ GitHub Stars). Its defining features are **local execution + multi-platform connectivity + autonomous task execution**. It's not just a chatbot — it can browse the web, read and write files, execute commands, and schedule cron jobs. Supports Claude, GPT, DeepSeek, local models, and more.
>
> The project is now stewarded by the **OpenClaw Foundation** (a US 501(c)(3) non-profit) and remains MIT-licensed; versions are now date-based (e.g. `v2026.9.6`).

---

## Core Concepts

| Concept | Description | Use Case |
|---------|-------------|----------|
| **Gateway** | Background-resident WebSocket gateway | Route messages, manage Agents |
| **Channel** | Messaging platform connection (30+) | Connect Telegram, Slack, Discord, Feishu/Lark (official plugin), WeChat (external plugin), etc. |
| **Skill** | Capability module defined in `SKILL.md` | Teach AI how to do things (similar to Claude Code Skills) |
| **Agent** | Independent AI workspace | Different tasks use different Agents |
| **Automations** | Scheduled task scheduler (alias of the `cron` command) | Automate recurring work |
| **Tool** | Built-in tools (browser, filesystem, shell) | Give AI "hands" to execute operations |

---

## Getting Started

### Installation

```bash
# macOS / Linux / WSL2 (recommended)
curl -fsSL https://openclaw.ai/install.sh | bash

# Or via npm
npm install -g openclaw@latest
openclaw onboard --install-daemon

# Verify installation
openclaw --version
openclaw doctor
```

System requirements: Node.js 24.16+ or 26.1+ (26 recommended). The installer script detects and installs Node if needed. On Windows, use PowerShell: `iwr -useb https://openclaw.ai/install.ps1 | iex`

### Initialization

```bash
# Interactive setup (configure models, channels, etc.)
openclaw onboard

# Check gateway status
openclaw gateway status

# Start the gateway
openclaw gateway start
```

### Configuration

Config file is located at `~/.openclaw/openclaw.json` (JSON5 format, comments supported):

```json5
{
  // Model settings (provider/model format)
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-sonnet-5-5",
        // Or use DeepSeek to save money
        // "primary": "deepseek/deepseek-v4-pro",
        "fallbacks": ["deepseek/deepseek-v4-pro"],
      },
    },
  },

  // Channels (enable as needed; WebChat is built into core via the Control UI, no config needed)
  "channels": {
    "telegram": { "enabled": true },
  },
}
```

Changes are hot-reloaded automatically — no restart needed.

---

## Prompting Tips

### 1. Skills — Teach AI New Abilities

OpenClaw Skills work similarly to Claude Code Skills, defined in Markdown:

```markdown
---
name: code-reviewer
description: Review code quality, find security vulnerabilities and performance issues
user-invocable: true
---

# Code Review

You are a senior code reviewer. When asked to review code:

1. Read through the entire file first to understand the context
2. Check for security issues (injection, XSS, sensitive data leaks)
3. Check for performance issues (N+1 queries, memory leaks)
4. Check code standards (naming, structure, comments)
5. Provide specific fix suggestions with code examples
```

Skills load from these locations (highest to lowest priority; for duplicate names the highest source wins):

```
<workspace>/skills/                -> Workspace skills (highest priority)
<workspace>/.agents/skills/        -> Project agent skills
~/.agents/skills/                  -> Personal agent skills
<state-dir>/skills/                -> Managed/locally installed skills
<state-dir>/agents/<agentId>/agent/workshop-skills/  -> Workshop skills
bundled skills                     -> Shipped with the install
skills.load.extraDirs + plugin skills -> Extra directories (lowest priority)
```

Install community Skills:

```bash
# Install from ClawHub
openclaw skills install @owner/<slug>

# List installed Skills
openclaw skills list
```

### 2. Multi-Model Strategy

```bash
# List available models
openclaw models list

# Set default model (writes agents.defaults.model)
openclaw models set anthropic/claude-sonnet-5-5

# Use Claude Opus for complex tasks
openclaw models set anthropic/claude-opus-5-5

# Use DeepSeek for casual chat (cheaper)
openclaw models set deepseek/deepseek-v4-pro

# Use a local model for free
openclaw models set ollama/qwen3-coder
```

### 3. Automated Tasks

OpenClaw supports scheduled tasks (Automations). `openclaw automations` and `openclaw cron` are the same command, and `create` is an alias for `add`:

```bash
# Send a codebase health report every day at 9 AM
openclaw automations create "0 9 * * *" "Check project code quality and send me a report" --name "Code health daily"

# Send a weekly summary every Monday morning
openclaw automations create "0 9 * * 1" "Summarize last week's Git commits and PRs into a weekly report" --name "Weekly report"

# List all scheduled tasks
openclaw automations list
```

### 4. Multi-Channel Collaboration

OpenClaw's unique advantage is connecting multiple messaging platforms:

```bash
# Add channels
openclaw channels add telegram

# Check channel status
openclaw channels status
```

Use cases:
- **Telegram** — Send messages to AI from anywhere to execute tasks
- **WebChat** — Built into core (Control UI), a browser UI for complex interactions; no `channels add` needed
- **Slack / Lark** — Team collaboration with AI as a team member

---

## Advanced Tips

### Agent Workspaces

Use different Agents for different projects to isolate context:

```bash
# Create a new Agent
openclaw agents add my-project

# List all Agents
openclaw agents list

# Delete an Agent you no longer need
openclaw agents delete old-project
```

### CLI Command Reference

| Command | Purpose |
|---------|---------|
| `openclaw onboard` | Interactive setup |
| `openclaw gateway start/stop/status` | Manage gateway |
| `openclaw channels add/remove/status/login/logout/logs` | Manage messaging channels |
| `openclaw models list/set/status` | Manage models |
| `openclaw skills list/install/update` | Manage Skills |
| `openclaw automations create/list` (alias `cron`) | Scheduled tasks |
| `openclaw agents list/add/delete` | Manage Agent workspaces |
| `openclaw doctor` | Health check and diagnostics |
| `openclaw logs` | View gateway logs |

### Debugging and Troubleshooting

```bash
# Health check (most useful diagnostic command)
openclaw doctor

# View real-time logs
openclaw logs

# Development mode (--dev is a global flag: isolates state under ~/.openclaw-dev, gateway port 19001)
openclaw --dev gateway
```

---

## How It Differs from Other Tools

| Dimension | OpenClaw | Claude Code | Cursor |
|-----------|----------|-------------|--------|
| Type | AI Agent framework | CLI coding assistant | AI IDE |
| Core use case | Multi-platform automation | Code writing and refactoring | Daily coding |
| Runtime | Background daemon (Gateway) | On-demand | Embedded in IDE |
| Messaging platforms | 30+ platforms | Terminal only | IDE only |
| Model support | Claude/GPT/DeepSeek/local | Claude only | Multi-model |
| Skills | SKILL.md | .claude/skills/ | Rules |
| Scheduled tasks | Built-in Automations | No | No |
| Open source | Yes (MIT) | No | No |
| Best for | Automation, multi-platform, all-in-one assistant | Professional coding | Daily coding |

**OpenClaw vs Claude Code**: They're complementary, not competing. Claude Code focuses on programming, OpenClaw focuses on automation and multi-platform connectivity. Use both together.

---

## Common Pitfalls

| Pitfall | Description | Solution |
|---------|-------------|----------|
| Node version too old | Requires 24.16+ or 26.1+ | `nvm install 26` |
| Gateway fails to start | Port conflict or config error | Run `openclaw doctor` to diagnose |
| Skill not taking effect | Path or format incorrect | Check `SKILL.md` frontmatter for name and description |
| Model API errors | API key not set or balance depleted | Run `openclaw models status` to check |
| Channel disconnected | Network or auth issue | Diagnose with `openclaw channels status` / `openclaw channels logs`; if needed, re-authenticate with `openclaw channels logout` + `openclaw channels login` |

---

## Configuration Templates

| Template | Purpose |
|----------|---------|
| [code-reviewer.md](templates/code-reviewer.md) | Code review Skill template, copy to `<workspace>/skills/code-reviewer/SKILL.md` or `~/.agents/skills/code-reviewer/SKILL.md` |

---

## Further Reading

- [OpenClaw Official Docs](https://docs.openclaw.ai)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw) (390k+ stars)
- [ClawHub — Skill Marketplace](https://clawhub.ai)
- [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) — Skills methodology (also supports OpenClaw)
