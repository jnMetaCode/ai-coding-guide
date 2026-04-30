[简体中文](./README.md) | **English**

# OpenAI Codex CLI Best Practices

> Codex CLI is OpenAI's open-source terminal coding agent, written in Rust — sitting alongside Claude Code and Gemini CLI as the "big three" terminal agents. This guide is verified against the official docs (developers.openai.com/codex) and the [openai/codex](https://github.com/openai/codex) repo at v0.125.0 (April 2026).

> ⚠️ Note: this is the **new Codex CLI** released in 2025 (open-source, terminal agent), *not* the original Codex model that was deprecated in 2023. The product family also includes **Codex App** (desktop) and **Codex Web** (cloud agent at `chatgpt.com/codex`); this doc covers the CLI only.

---

## Core Concepts

| Concept | Description | Use Case |
|---------|-------------|----------|
| **AGENTS.md** | Project/global instruction file | Like Claude Code's CLAUDE.md; auto-loaded on launch |
| **Approval Mode** | When does Codex pause to ask | `untrusted` / `on-request` / `never` |
| **Sandbox Mode** | What files/network it can touch | `read-only` / `workspace-write` / `danger-full-access` |
| **Profile** | Named bundle of config | `--profile work` to swap model/permissions |
| **Subagent** | Child agent for bounded tasks | TOML-defined, can have its own model/sandbox |
| **Skill** | Reusable workflow (SKILL.md) | Package a recurring task as a named capability |
| **MCP Server** | External tool integration | STDIO or HTTP/OAuth |
| **Plan Mode** | Plan before acting | `/plan` or Shift+Tab |

---

## Getting Started

### Installation

```bash
# npm (recommended)
npm install -g @openai/codex

# or Homebrew (macOS)
brew install --cask codex

# or download a GitHub Release binary (macOS arm64/x64, Linux x64/arm64)
# https://github.com/openai/codex/releases/latest
```

System requirements (from official install docs): macOS 12+, Ubuntu 20.04+ / Debian 10+, Windows 11 (WSL2), 4 GB RAM (8 GB recommended), optional Git 2.23+.

### Authentication

```bash
codex            # On first launch, choose "Sign in with ChatGPT"
```

Two options:

- **ChatGPT account login** (officially recommended) — uses your ChatGPT Plus / Pro / Business / Edu / Enterprise quota; opens a browser for OAuth.
- **API key** — for CI, corporate proxies, or precise per-token billing; needs extra setup (see `developers.openai.com/codex/auth`).

### Your First Run

```bash
cd /your/project
codex
```

Inside the TUI, try these (from the official quickstart):

```
> Tell me about this project
> Find and fix bugs in my codebase with minimal, high-confidence changes
> Build a classic Snake game in this repo
```

> 💡 **Official advice**: `git commit` or create a checkpoint before any non-trivial task. If Codex's changes aren't what you want, you can roll back instantly.

### AGENTS.md — Project Instruction File

Drop an `AGENTS.md` at your repo root (or run `/init` to scaffold one):

```markdown
# Project
Next.js 14 + TypeScript admin dashboard.

# Layout
- src/app/api/      route handlers
- src/components/   UI components (PascalCase)
- src/lib/db/       Drizzle data access layer

# Build / Test / Lint
- Dev:    pnpm dev
- Test:   pnpm test         (Vitest — must pass after every change)
- Types:  pnpm typecheck
- Lint:   pnpm lint --fix

# Conventions
- TS strict mode
- All DB access through Drizzle, no raw SQL
- Don't bypass husky pre-commit hooks

# Don't
- Don't touch src/legacy/
- Don't add runtime deps without asking
```

Discovery order (important):

```
~/.codex/AGENTS.override.md   ← temp global override
~/.codex/AGENTS.md            ← personal global
<git root>/AGENTS.md          ← team-shared
<subdir>/AGENTS.md            ← module-local (overrides parents)
```

Files are concatenated from shallow to deep; closer-to-cwd files win. Default 32 KiB cap per file, tunable via `project_doc_max_bytes`.

---

## Prompting Tips

OpenAI's recommended four-element prompt template (from `developers.openai.com/codex/learn/best-practices`):

```
Goal:        what to change or build
Context:     which files, docs, errors matter
Constraints: standards, architecture, safety rules
Done when:   the completion bar
```

### 1. Be precise, not verbose

```
❌ optimize the login flow
✅ Goal: switch src/app/api/login/route.ts from bcrypt.compareSync to async compare
   Context: called by src/components/LoginForm.tsx; error shape { code, message } must stay
   Constraints: don't touch the schema, don't add deps
   Done when: pnpm test passes; 100 concurrent logins show no event-loop blocking warnings
```

### 2. Reference files with `@`, don't paste

```
@src/services/payment.ts @src/services/order.ts
Read both, analyze the retry logic in the failure path, propose a fix, wait for my OK before editing.
```

Letting Codex pull files itself saves tokens and avoids accidental truncation.

### 3. Tune reasoning effort

Push harder for hard problems, dial back for easy ones:

- **low** — small edits, formatting
- **medium / high** — most refactors and bugfixes
- **xhigh** — architectural, multi-file, deeply coupled

Switch in the TUI via shortcut, or set the default in `config.toml`.

### 4. Plan first, act second

```
/plan
  Walk src/api/, unify all routes onto the new error-handling middleware
```

Or hit **Shift+Tab** to enter Plan Mode. Codex lays out the plan and asks clarifying questions before writing code — strongly recommended for multi-file work.

### 5. Make it test and self-review

```
After your changes:
1) Run pnpm test, paste any failing output
2) Run pnpm typecheck, confirm no new type errors
3) Use /review to self-audit the diff and flag risks
```

Quoting the official guide verbatim: *Don't stop at asking Codex to make a change. Ask it to create tests when needed, run checks, confirm results, and review work before accepting.*

---

## Approval & Sandbox (the two big safety knobs)

Codex's distinguishing design — two independent dimensions.

### Sandbox (what it can touch)

| Mode | Behavior |
|------|----------|
| `read-only` | Read only; any write/exec/network needs approval |
| `workspace-write` ⭐ default | Read + edit inside workspace + run routine commands; out-of-workspace writes or network need approval |
| `danger-full-access` | No restrictions — **not recommended** |

Enforcement (verified against `codex-rs/cli/src/debug_sandbox.rs`):

- **macOS** — Seatbelt (built-in)
- **Linux / WSL2** — **Landlock** kernel LSM + seccomp filtering (requires Linux 5.13+ with Landlock enabled)
- **Windows** — Restricted-token sandbox (active in PowerShell)

> Tip: `codex sandbox seatbelt|landlock|windows -- <cmd>` is the debug subcommand to verify whether a single command would survive the sandbox.

### Approval (when it asks)

| Mode | Behavior |
|------|----------|
| `untrusted` | Only known-safe read ops auto-run; everything else asks |
| `on-request` ⭐ default | Auto-runs inside sandbox; only asks when going outside |
| `never` | Never asks (CI / scripts — pair with a tight sandbox) |

### Common Combos

```bash
# Local dev — just run `codex` (defaults are already workspace-write + on-request)
codex

# Explicit form (equivalent to the above)
codex --sandbox workspace-write

# Just look around, don't edit
codex --sandbox read-only

# Add a few writable dirs outside the workspace (without going full-open)
codex --add-dir ../sibling-repo --add-dir /tmp/scratch

# Non-interactive in CI / scripts
codex exec --sandbox workspace-write --ask-for-approval never "run tests and fix failures"

# Open the sandbox fully (you understand the consequences)
codex --sandbox danger-full-access --ask-for-approval never

# Full YOLO: skip approvals AND drop the sandbox (only when externally sandboxed, e.g. Docker)
codex --yolo
# equivalent to: codex --dangerously-bypass-approvals-and-sandbox
```

> ⚠️ **`--full-auto` is deprecated and removed** (v0.125.0 still keeps it inside `codex exec` only to print a migration warning). Use `--sandbox workspace-write` — that's the official replacement; approval defaults to `on-request` already.
>
> 🚨 **CI gotcha**: the default approval mode is interactive — CI will hang on the prompt and time out. `codex exec` + `--ask-for-approval never` is the canonical CI shape.

---

## Advanced

### 1. config.toml — Persistent Preferences

`~/.codex/config.toml` (user) / `.codex/config.toml` (project):

```toml
model = "gpt-5.5"
approval_policy = "on-request"
sandbox_mode = "workspace-write"

[features]
web_search = "cached"     # cached by default; --search switches to live
multi_agent = true

[profiles.review]
model = "gpt-5.5"
approval_policy = "untrusted"
sandbox_mode = "read-only"

[profiles.ci]
approval_policy = "never"
sandbox_mode = "workspace-write"

[mcp_servers.github]
command = "npx @modelcontextprotocol/server-github"
enabled = true
```

Switch profiles:

```bash
codex --profile review              # read-only review pass
codex exec --profile ci "..."       # CI / scripted run
```

### 2. Slash Commands Cheat Sheet

| Command | Use |
|---------|-----|
| `/init` | Scaffold an AGENTS.md in the repo |
| `/model` | Switch model |
| `/plan` | Enter Plan Mode |
| `/review` | Have Codex review the current diff / branch / commit |
| `/compact` | Compress conversation history; free up tokens |
| `/agent` | Switch between active subagent threads (`/multi-agents` alias) |
| `/side` | Open a side conversation in an ephemeral fork — won't pollute main thread |
| `/permissions` `/approvals` | Adjust approval mode on the fly |
| `/resume` `/fork` | Resume / branch from a prior thread |
| `/new` `/clear` | Start a new conversation in the same session / clear and restart |
| `/rename` | Rename the current thread |
| `/diff` | Show git diff (including untracked files) |
| `/mention` | Attach a file to the conversation |
| `/skills` | List / use skills |
| `/memories` | View / generate / reset long-term memory |
| `/mcp` | Inspect MCP server status (`/mcp verbose` for details) |
| `/plugins` `/apps` | Browse plugins / apps |
| `/status` | Session details and token usage |
| `/goal` | Set / view goal for a long-running task |
| `/fast` | Toggle Fast mode (`on`/`off`/`status`) |
| `/debug-config` | Print config layers and requirements diagnostics (**use this when config.toml edits don't take effect**) |
| `/feedback` | Send logs to OpenAI maintainers |

> Complete list (46 commands) lives in source `codex-rs/tui/src/slash_command.rs::SlashCommand`. Just press `/` in the TUI for autocomplete.

### 3. Non-interactive Execution (`exec`)

Treat Codex as a script tool:

```bash
# Single prompt
codex exec "replace all console.log with logger.debug"

# Pipe in
git diff main..HEAD | codex exec "review this diff for bugs"

# Pin model + skip approvals
codex exec -m gpt-5.5 --ask-for-approval never "add unit tests for new files"

# Stream events as JSONL (one JSON object per line)
codex exec --json "..." | jq -c .

# Capture only the final message to a file (handy for scripting)
codex exec -o /tmp/answer.txt "..."
```

### 4. Subagents — Parallel Subtasks

`.codex/agents/explorer.toml`:

```toml
name = "explorer"
description = "Read-only codebase explorer; gathers evidence before any change."
model = "gpt-5.3-codex"
sandbox_mode = "read-only"
developer_instructions = """
Stay in exploration mode.
Trace execution paths, cite files and symbols with file:line.
Never propose changes — just report findings.
"""
```

Invoke from the main thread:

```
Spawn an explorer subagent and have it map all auth logic under src/api/, then report back.
```

Each subagent runs in its own sandbox + model and returns its summary to the main thread. Great for "explore + execute" splits on complex changes.

### 5. MCP — External Tools

```bash
codex mcp add github --command "npx @modelcontextprotocol/server-github"
codex mcp list
```

STDIO and HTTP/OAuth servers supported. Common picks: GitHub, Linear, Slack, databases (Postgres / Supabase). Rule of thumb: **only add tools that remove a real manual loop** — don't pad the list.

### 6. Skills — Reusable Workflows (note: a folder, not a single file)

Package recurring tasks as a **Skill directory**. Codex reads the description to decide *when* to fire and only loads the body on demand ("progressive disclosure"):

```
~/.agents/skills/release-notes/      ← personal (canonical)
.codex/skills/release-notes/         ← project, Codex-only
.agents/skills/release-notes/        ← project, cross-tool (Claude Code/Codex)
└── SKILL.md           # required: name + description + steps
└── references/        # optional: long docs, specs, schemas
└── scripts/           # optional: helper scripts
└── examples/          # optional: I/O examples
└── agents/openai.yaml # optional: Codex-specific metadata
```

> Note: `~/.codex/skills/` still works but is deprecated; new installs should use `~/.agents/skills/`.

How to invoke (from `shanraisshan` battle-tested patterns):

```
$skill-creator                # explicit trigger with $ prefix
/skills                       # list all available skills
> draft this week's release notes  # description match auto-fires; no $ needed
```

**Skill writing rules** (consensus across high-star community repos):

- The description field is a *trigger*, not a summary — write "when should I fire?" not "what is this?"
- A skill is for the model, not human readers — skip filler
- Give goals + constraints, **don't railroad** the model with prescriptive steps
- Add a `## Gotchas` section per skill with Codex's failure modes in this domain — highest-signal content

> Ready-made skill libraries: [ComposioHQ/awesome-codex-skills](https://github.com/ComposioHQ/awesome-codex-skills), [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) (cross-tool).

### 7. Hooks — Inject Custom Scripts into the Agent Loop (beta)

Enable `[features] codex_hooks = true` and Codex will invoke your shell scripts at 6 event points:

| Event | When | Typical Use |
|-------|------|-------------|
| `PreToolUse` | Before any tool call | Block dangerous commands, validate args |
| `PermissionRequest` | When asking to escalate | Auto approve/deny by rule |
| `PostToolUse` | After a tool call | Auto lint / format / test |
| `SessionStart` | Session boot | Inject project-specific context |
| `UserPromptSubmit` | User submits prompt | Insert disclaimer, run safety scan |
| `Stop` | Session ends | Upload logs, clean tmp files |

> 💡 The hooks JSON schema reuses Claude Code's `hooks.json` format directly (the source engine is literally named `ClaudeHooksEngine`), so migrating from Claude Code is zero-change.

Config goes in `.codex/hooks.json`. Reference impl: [shanraisshan/codex-cli-hooks](https://github.com/shanraisshan/codex-cli-hooks).

The two highest-leverage uses:
- **PostToolUse → run prettier / ruff / clang-format** — Codex edits, hook formats, CI stays green
- **PreToolUse → intercept `rm -rf` / `git push --force` / DB DROP** — belt-and-suspenders safety

### 8. Memories — Cross-Session Long-Term Memory (beta)

Enable `[features] memories = true` and Codex carries facts you've confirmed across sessions ("this project uses pnpm — don't suggest npm").

```bash
/memories             # TUI: view / generate / reset
```

Stored under `~/.codex/memories/` — **per-user, not per-project**. Safety toggles (from the source `MemoriesToml` struct):

```toml
[memories]
disable_on_external_context = true   # mark thread "polluted" when external data is touched (MCP / web search) — prevents leaking
                                     # (legacy alias `no_memories_if_mcp_or_web_search` still works)
generate_memories = true             # default true; set to false to stop generating memories from new threads
use_memories = true                  # default true; set to false to skip injecting memories into prompts
```

If a session touches untrusted content (parsed an unfamiliar PDF, ran an unaudited MCP), run `/memories → Reset` immediately.

### 9. Plugins / Marketplace — Distribution (v0.121.0+)

Bundle skills + apps + MCP servers as a distributable plugin (`.codex-plugin/plugin.json`):

```bash
codex plugin marketplace add user/repo            # GitHub shorthand
codex plugin marketplace add ./local-marketplace  # local dir works too
codex plugin marketplace upgrade
codex plugin marketplace remove <name>

# In the TUI
/plugins              # browse installed / available plugins
```

Community marketplace index: [hashgraph-online/awesome-codex-plugins](https://github.com/hashgraph-online/awesome-codex-plugins).

### 10. Fast Mode — 1.5× speed, 2× credits (gpt-5.4 only)

```
/fast on            # enable
/fast status        # current
/fast off           # disable
```

Best when "I know roughly what to change, I just need a fast typist." Pro subscribers can also use `gpt-5.3-codex-spark` for near-realtime micro-iteration.

### 11. Web Search

On by default in `cached` mode (OpenAI's pre-indexed snapshot). For real-time, add `--search`:

```bash
codex --search "Latest React 19 useActionState best practices"
```

### 12. Image Input

```bash
codex -i screenshot.png "match this design in src/components/Pricing.tsx"
```

PNG / JPEG; you can also paste screenshots directly into the TUI composer. Combined with Chrome DevTools / Playwright MCP, Codex can read browser console output itself:

```bash
codex mcp add chrome-devtools --command "npx chrome-devtools-mcp"
codex mcp add playwright --command "npx @playwright/mcp"
```

### 13. Local Open-Source Models (`--oss`)

Source `utils/oss/src/lib.rs` confirms Codex natively supports two local providers:

```bash
# Ollama route
codex --oss --local-provider ollama -m qwen2.5-coder
codex --oss --local-provider ollama -m deepseek-coder-v2

# LM Studio route
codex --oss --local-provider lmstudio
```

Fully offline, zero API cost. Trade-off: local models are noticeably weaker than GPT-5.5. Best for: sensitive on-premise data, no-network environments, bulk low-complexity tasks.

> Model IDs follow Ollama / LM Studio naming (run `ollama list` to see what's local). Codex doesn't maintain a separate catalog.

### 14. CI Integration (Official GitHub Action)

[`openai/codex-action`](https://github.com/openai/codex-action) is the official Apache-2.0 action with a **built-in restricted sandbox proxy**. The canonical PR auto-review workflow:

```yaml
# .github/workflows/codex-review.yml
name: Codex PR review
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v5
        with:
          ref: refs/pull/${{ github.event.pull_request.number }}/merge
      - run: git fetch --no-tags origin "${{ github.event.pull_request.base.ref }}"
      - id: codex
        uses: openai/codex-action@v1
        with:
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          prompt: |
            Review only the changes in PR #${{ github.event.pull_request.number }}:
              git diff ${{ github.event.pull_request.base.sha }}...${{ github.event.pull_request.head.sha }}
            Be concise. Flag bugs, missing tests, and security risks.
      - if: steps.codex.outputs.final-message != ''
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `${{ steps.codex.outputs.final-message }}`
            })
```

⚠️ **The sandbox blocks network by default** — if your review prompt needs to run tests or install deps, do `npm ci` in a step *before* invoking `codex-action`.

### 15. Codex as an MCP Server (Reverse Integration)

```bash
codex mcp-server                    # expose Codex as an MCP server
```

Source confirms this exposes `codex()` and `codex-reply()` MCP tools. Use case: let Claude Code, Cursor, or any other agent call Codex as "a colleague" for parallel work or cross-verification.

### 16. Rules / Execpolicy (Advanced Safety)

Starlark DSL defining command allow/prompt/forbid lists (`prefix_rule()` + `host_executable()`). Drop rule files into `.codex/rules/*.rules`, validate with `codex execpolicy check`:

```starlark
prefix_rule(
    pattern = ["git", ["push", "force-with-lease"]],
    decision = "prompt",
    justification = "force pushes need a human eyeball",
)
prefix_rule(
    pattern = ["rm", "-rf", "/"],
    decision = "forbidden",
    justification = "absolutely not",
)
```

```bash
codex execpolicy check --rules .codex/rules/safety.rules git push --force
# {"matchedRules":[{...}],"decision":"prompt"}
```

Best for enterprise / team setups — finer-grained than approval modes. See [`codex-rs/execpolicy/README.md`](https://github.com/openai/codex/blob/main/codex-rs/execpolicy/README.md).

---

## High-Signal Prompting & Workflow Patterns

Distilled from high-star community guides ([shanraisshan/codex-cli-best-practice](https://github.com/shanraisshan/codex-cli-best-practice) etc.):

### Prompting

```
✅ "Prove to me this works" — make Codex run the tests + git diff main..HEAD itself
✅ "Knowing everything you know now, scrap this and implement the elegant solution"
   (use after a mediocre fix; pushes Codex past local minima)
✅ Codex debugs well by itself — paste the error, say "fix", don't micromanage
```

### Planning

```
✅ /plan for explicit planning on multi-step tasks (Codex auto-plans too, but explicit is more controllable)
✅ Phase-gated plans, each phase has tests — never let it touch 30 files in one shot
✅ Spin up another Codex (or Claude Code) as a "staff engineer" to review your plan
✅ Write detailed specs, kill ambiguity — better input → better output
```

### AGENTS.md

```
✅ Heuristic: a fresh dev should be able to launch codex → "run the tests" → it works first try
   If not, your AGENTS.md is missing build/setup/test commands
✅ Aim for ~150 lines (hard limit is 32 KiB byte-wise) — longer ≠ better
✅ Behavior rules (approval / sandbox / model) belong in config.toml, NOT AGENTS.md
✅ AGENTS.override.md for personal preferences — keeps team's AGENTS.md clean
```

### Multi-Agent & Parallelism

```
✅ Multi-agent = throw more compute at the problem; offload chores to subagents
✅ Test-time compute: one agent writes, another finds bugs — separate context windows help
✅ Use git worktrees for parallel agents to avoid clobbering each other
```

### Debugging

```
✅ Have Codex run the service whose logs you want to watch as a background task
✅ Stuck? Screenshot the issue and feed it in (image input is the most underrated capability)
✅ Agentic search (glob + grep) beats RAG — code drifts faster than indexes refresh
```

---

## Common Pitfalls

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| Browser pops up demanding login | Token expired | Re-run `codex` (or `codex login`) and complete OAuth |
| `429 Too Many Requests` | Rate-limited | Wait for quota; for scripts, switch to API key + throttle |
| CI job hangs and times out | Default approval is interactive | `codex exec --ask-for-approval never` |
| `config.toml` edits don't take effect | Wrong path / config layering overrides yours | Run `/debug-config` in the TUI to see the resolved config stack and requirements |
| `npm i -g` fails with `EACCES` | Global dir owned by root | Install Node via nvm/fnm; never `sudo npm` |
| `which -a codex` shows multiple paths | npm + brew + binary all installed | Remove dupes; `hash -r` your shell |
| Codex "can't see" your edits | Outside workspace / wrong root | `codex --cd <project>` to set the root |
| Long thread getting slow / pricey | Context bloat | `/compact` or `/fork` to trim |
| Two agents clobber the same file | Main + subagent both writing | Give the subagent a git worktree |
| Linux sandbox refuses to start | Kernel < 5.13 or Landlock not enabled | Update the kernel (check `uname -r`); on older distros fall back to `--sandbox read-only` |

---

## Codex CLI vs Claude Code

These two are the closest analogs, but they optimize differently:

| Dimension | Codex CLI | Claude Code |
|-----------|-----------|-------------|
| Vendor | OpenAI | Anthropic |
| Open-source | ✅ Apache-2.0 (Rust) | ❌ Closed-source CLI |
| Sandbox | OS-kernel level (Seatbelt / Landlock) | App-layer + 26 hook events |
| Default account | ChatGPT subscription | Claude API / Pro |
| Config files | `AGENTS.md` + `config.toml` | `CLAUDE.md` + `settings.json` |
| Plan mode | `/plan` or Shift+Tab | `/plan` |
| Subagents | TOML files | Markdown files |
| MCP | ✅ | ✅ |
| Strong suit | Terminal tasks, CI, token efficiency | Big refactors, cross-file dependency reasoning, code style |

Community rule of thumb (echoed across builder.io / datacamp / multiple comparison posts):

> *Codex for keystrokes, Claude Code for commits.*
> Codex shines at "fast iterations + sandboxed execution"; Claude Code shines when one change touches 12 files and the dependency graph matters.

Already paying for ChatGPT and budget-sensitive → Codex comes practically free. Doing a big refactor where code quality is paramount → Claude Code is still the pick. Many teams use both.

---

## Templates

The `templates/` directory provides:

- [`AGENTS.md`](./templates/AGENTS.md) — generic project instruction template
- [`config.toml`](./templates/config.toml) — user-level config with profiles
- [`agent-explorer.toml`](./templates/agent-explorer.toml) — read-only exploration subagent
- [`SKILL.md`](./templates/SKILL.md) — Skill template (with Gotchas + trigger-style description)

---

## References

### Official

- Repo: [openai/codex](https://github.com/openai/codex) (Apache-2.0, Rust)
- Docs: [developers.openai.com/codex](https://developers.openai.com/codex)
- Install guide: [docs/install.md](https://github.com/openai/codex/blob/main/docs/install.md)
- Best practices: [Best practices](https://developers.openai.com/codex/learn/best-practices)
- Sandboxing internals: [Sandboxing](https://developers.openai.com/codex/concepts/sandboxing)
- Slash commands: [Slash commands](https://developers.openai.com/codex/cli/slash-commands)
- Official GitHub Action (CI integration): [openai/codex-action](https://github.com/openai/codex-action)
- Official skills catalog: [openai/skills](https://github.com/openai/skills)

### High-quality community indexes (verified high-star)

- [**RoggeOhta/awesome-codex-cli**](https://github.com/RoggeOhta/awesome-codex-cli) — 280+ resources (subagents, skills, plugins, MCP, IDE integrations, CI), categorized
- [**shanraisshan/codex-cli-best-practice**](https://github.com/shanraisshan/codex-cli-best-practice) — 50 battle-tested prompting tips + complete `.codex/` reference impl (aligned with v0.125.0)
- [**ComposioHQ/awesome-codex-skills**](https://github.com/ComposioHQ/awesome-codex-skills) — 38 commonly-used skills (dev tools, data analysis, Composio 1000+ SaaS integrations)
- [**VoltAgent/awesome-codex-subagents**](https://github.com/VoltAgent/awesome-codex-subagents) — 136+ subagents across 10 domains
- [**hashgraph-online/awesome-codex-plugins**](https://github.com/hashgraph-online/awesome-codex-plugins) — first Plugin marketplace index
- [**agents.md**](https://agents.md) — cross-tool AGENTS.md standard (60k+ adopting projects; works in Codex / Claude Code / Gemini CLI)

### Mainstream workflow frameworks

| Framework | Stars | Flow |
|-----------|-------|------|
| [Superpowers](https://github.com/obra/superpowers) | 171k | Brainstorm → write plan → subagent-driven dev → TDD → review → ship branch |
| [Spec Kit](https://github.com/github/spec-kit) | 92k | `/speckit.constitution → specify → plan → tasks → implement` |
| [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex) | 27k | `$deep-interview → $ralplan → $ralph` |
| [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) | 16k | `/ce-ideate → brainstorm → plan → work → review → compound` |

### Compared to Claude Code

In this repo: [workflows/tool-selection.en.md](../workflows/tool-selection.en.md)

> Verified through: **2026-04-30** (codex CLI v0.125.0). Every CLI flag, subcommand, slash command, and config field in this guide was cross-checked against the `codex-rs` source code; models and pricing change quickly — the OpenAI docs are always the source of truth.
