[简体中文](./README.md) | **English**

# Aider Best Practices

> Aider is an open-source CLI AI coding tool. Its defining feature is being **Git-native** — every change is auto-committed, with built-in version control support. It works with virtually all major LLMs (Claude, GPT, DeepSeek, Qwen, local models), making it the most flexible AI coding CLI out there.
>
> ⚠️ **Maintenance status (verified 2026-09)**: the latest PyPI release is still 0.86.2 (published 2026-02-12), and the last GitHub commit was around 2026-05 — development has clearly slowed. There is **no native MCP support**. Built-in model metadata lags behind new model releases, so newer models need a bit of manual config (see "New model config" below).

---

## Core Concepts

| Concept | Description | Use Case |
|---------|-------------|----------|
| **Chat Modes** | `code` / `ask` / `architect` | Different modes for different tasks |
| **Auto Git Commits** | Every change auto-committed | Roll back anytime |
| **Repo Map** | Extracts key symbols and their definition lines (signatures), graph-ranked by references | Understand large codebases |
| **Multi-Model Support** | Claude/GPT/DeepSeek/Ollama etc. | Flexible selection, cost control |
| **Lint & Test** | Built-in code checking and testing | Auto-verify after changes |

---

## Getting Started

### Installation

```bash
python -m pip install aider-install && aider-install
# Or: uv tool install --force --python python3.12 --with pip aider-chat@latest
# Or: pipx install aider-chat

# Set an API key (pick one)
export ANTHROPIC_API_KEY=sk-xxx    # Claude
export OPENAI_API_KEY=sk-xxx       # GPT
export DEEPSEEK_API_KEY=sk-xxx     # DeepSeek
```

### Basic Usage

```bash
cd /your/project
aider

# Specify a model (pass the latest Claude model ID explicitly)
aider --model anthropic/claude-sonnet-5-5

# Use DeepSeek (cheaper)
aider --model deepseek/deepseek-v4-pro

# Use a local model (free)
aider --model ollama/qwen3-coder
```

> The built-in aliases are outdated: `--model sonnet` → `claude-sonnet-4-6`, `--model opus` → `claude-opus-4-7`, and `--model deepseek` still points to `deepseek/deepseek-chat`, which was retired on 2026-07-24. Always spell out the full model ID.

### Three Chat Modes

```bash
# code mode (default) — directly edits code
/code Add a retry decorator to utils.py

# ask mode — read-only, no changes
/ask What's the time complexity of this function?

# architect mode — design first, implement later
/architect Design a task queue system. Give me the plan, don't write code yet
```

---

## Prompting Tips

### 1. Adding Files to Context

```bash
# Manually add files
/add src/models/user.py src/api/auth.py

# Add an entire directory
/add src/services/

# Remove files you don't need
/drop src/legacy/old_auth.py
```

Aider only modifies files that have been added. This is how you precisely control scope.

### 2. Architect Mode for Large Tasks

```
/architect

I need to add a WebSocket real-time notification system to the project.
Requirements:
1. User online/offline notifications
2. Real-time new message push
3. Channel subscribe/unsubscribe support
4. Handle disconnect and reconnect

Give me a technical plan first, including:
- Which libraries to use
- Data flow design
- Which new files to create
- Which existing files to modify

Once confirmed, I'll switch to code mode to implement.
```

### 3. Leverage Auto Git Commits

```bash
# Every change gets its own commit — roll back anytime
git log --oneline  # View Aider's commit history
git diff HEAD~1    # See the last change
git revert HEAD    # Not happy? One-command rollback

# Mark AI commits: a Co-authored-by trailer is added by default; tune it with the --attribute-* flags
aider --attribute-commit-message-author   # Prefix commit messages for AI changes with "aider: "
# Customize the commit message style
aider --commit-prompt "Write commit messages in Conventional Commits format"
```

### 4. Multi-Model Strategy

```bash
# Complex architecture design — use the strongest model
aider --model anthropic/claude-opus-5-5
/architect Design a microservices split plan

# Daily coding — use a cost-effective model
aider --model deepseek/deepseek-v4-pro
/code Implement user-service according to the plan

# Code review — use a free local model
aider --model ollama/qwen3-coder
/ask Any issues with this code?
```

---

## Advanced Tips

### .aider.conf.yml — Project Configuration

```yaml
# .aider.conf.yml
model: anthropic/claude-sonnet-5-5
auto-commits: true
auto-lint: true
auto-test: true
test-cmd: pytest
lint-cmd: ruff check
```

### New Model Config — `.aider.model.settings.yml`

Aider sends a `temperature` parameter by default, but newer Claude models (Sonnet 5.5, Opus 5.5, etc.) reject non-default temperature values with a 400 error. Add this to your project root or home directory:

```yaml
# .aider.model.settings.yml
- name: anthropic/claude-sonnet-5-5
  edit_format: diff
  use_repo_map: true
  use_temperature: false
```

For models missing from Aider's built-in metadata, you'll get an "unknown context window" warning on startup. It's usually safe to ignore, or you can fill it in via `.aider.model.metadata.json`.

### Lint + Test Automation

```yaml
# After every change, automatically:
# 1. Run the linter
# 2. Run related tests
# 3. If either fails, auto-fix and retry
auto-lint: true
auto-test: true
lint-cmd: "ruff check --fix"
test-cmd: "pytest -x"
```

### Git Workflow Integration

```bash
# Work on a feature branch
git checkout -b feature/add-notifications
aider

# Every Aider change stays on this branch
# When done, follow your normal PR process
git push -u origin feature/add-notifications
```

---

## How It Differs from Other CLI Tools

| Dimension | Aider | Claude Code | Gemini CLI |
|-----------|-------|-------------|------------|
| Git integration | 3/3 (auto-commit) | 2/3 (manual) | 1/3 |
| Model flexibility | 3/3 (almost all LLMs) | 1/3 (Claude only) | 1/3 (Gemini only) |
| Agent capabilities | 2/3 | 3/3 | 2/3 |
| Context management | Manual /add /drop | Automatic | Automatic |
| Open source | Fully open source | No | Open source |
| Cost control | 3/3 (free models available) | 1/3 | 3/3 |
| Best for | Flexibility, saving money, Git power users | Complex Agent tasks | Large codebase analysis |

> Gemini CLI stopped serving individual/free users (including Google AI Pro/Ultra subscribers) on 2026-06-18. Enterprise licenses and paid API keys still work; the official migration path for individuals is Antigravity CLI. The "Cost control" row no longer applies to individual users.

---

## Common Pitfalls

| Pitfall | Description | Solution |
|---------|-------------|----------|
| Auto-commit commits your edits too | If a file Aider is about to edit has your uncommitted changes, it first commits them separately (`--dirty-commits` is on by default) | Commit/`git stash` yourself before the session, use `--no-dirty-commits`, or work on a dedicated branch |
| `/add` misses deps | Incomplete context, AI guesses from filenames | Have it `/ask` list dependencies first, then `/add` all of them |
| Model-switch quality drop | Cheaper model → cliff drop in output quality | Switch by task type; return to Claude for complex work |
| Lint loop burns tokens | `auto-lint` retries failing checks via LLM | Use `--fix` linters; if it still loops, turn it off with `--no-auto-lint` |

👉 **Deep dive**: [Aider Pitfalls](../pitfalls/aider.en.md) — 7 real-world traps, each with Symptom / Cause / Recovery / Prevention

---

## Configuration Templates

| Template | Purpose |
|----------|---------|
| [.aider.conf.yml](templates/aider.conf.yml) | Project config template (multi-model, lint, test config), copy to project root |

---

## Further Reading

- [Aider Official Docs](https://aider.chat/docs/)
- [Aider GitHub](https://github.com/Aider-AI/aider) (49k+ stars)
- [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) — Skills methodology (also supports Aider)
