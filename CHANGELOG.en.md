[简体中文](./CHANGELOG.md) | **English**

# Changelog

> See `git log` for full commit history. This file records user-facing major updates.

## Late April 2026 · OpenAI Codex CLI Guide Added

### 🆕 New Tool: Codex CLI (now 10 tools total)

**📂 [`codex/`](codex/) — OpenAI's open-source terminal agent (Rust, Apache-2.0)**
- Verified against v0.125.0 (2026-04-24) and `developers.openai.com/codex` official docs
- Full coverage: core concepts / install & auth / AGENTS.md discovery chain / Approval & Sandbox dual knobs / TOML subagents / MCP / Skills / Plan Mode
- Side-by-side comparison with Claude Code (sandbox internals, pricing model, sweet spots)
- 10 common pitfalls (CI hangs on approval prompt, config not taking effect, duplicate installs, etc.)
- Templates: `AGENTS.md` + `config.toml` (with 4 profiles) + `agent-explorer.toml`

### 🔄 Index Sync

- **README.md / README.en.md**: "9 tools" → "10 tools", tool table now includes Codex CLI, profile-based reading paths add "Already on ChatGPT Plus/Pro"
- **cheatsheet.md / cheatsheet.en.md**: capability matrix gets a Codex column plus a new "Sandbox" row, config-file table gets AGENTS.md, commands cheat sheet gets a Codex section, decision flow and combo recommendations both updated

### 🔬 Second-pass source-code verification

Before publishing, the guide was cross-checked directly against `codex-rs` source (`utils/cli/src/shared_options.rs`, `tui/src/cli.rs`, `exec/src/cli.rs`, `cli/src/main.rs`, `models-manager/models.json`). Six factual issues were caught and fixed:

1. **Linux sandbox**: `bubblewrap` → `Landlock` kernel LSM (`debug_sandbox.rs` imports `codex_sandboxing::landlock`)
2. **`--full-auto` removed**: source ships a migration warning *"`--full-auto` is deprecated; use `--sandbox workspace-write` instead."* — every example switched
3. **`--output-format json` does not exist**: the real flag is `--json` (emits JSONL, not a single JSON object)
4. **`/side` does not exist**: never appeared in `slash_commands` docs — removed; replaced with real ones (`/diff`, `/mention`, `/debug-config`, `/new`, `/clear`)
5. **`codex config path` / `codex config validate` do not exist**: there's no `config` subcommand — the right diagnostic is the TUI `/debug-config` slash command
6. **Added `--yolo` and `--add-dir`**: verified in source as the current recommended danger/expansion flags

Model names verified: `gpt-5.5` / `gpt-5.4` / `gpt-5.3-codex` all present in the canonical `models-manager/models.json` list.

### 🔬 Fourth-pass schema-level verification (config / subagent TOML structures)

Cross-checked against the actual Rust struct definitions (`config_toml.rs::ConfigToml`, `profile_toml.rs::ConfigProfile`, `config_toml.rs::AgentsToml/AgentRoleToml`, `core/src/config/agent_roles.rs::RawAgentRoleFileToml`):

- **`web_search` is a top-level key** (valid values `disabled`/`cached`/`live`), not under `[features]`; template fixed
- **`multi_agent` is not a simple `[features]` bool** (multi-agent uses its own `[multi_agent_v2]` structure); template field removed
- **Subagent TOML fields** = `RawAgentRoleFileToml` flattens all of `ConfigToml`, so `name` / `description` / `developer_instructions` / `model` / `model_reasoning_effort` / `sandbox_mode` / `approval_policy` are all valid; `#[serde(deny_unknown_fields)]` rejects typos at startup
- **`model_reasoning_effort` valid values**: `none` / `minimal` / `low` / `medium` (default) / `high` / `xhigh` (source: `protocol/src/openai_models.rs::ReasoningEffort`)
- **`[agents]` concurrency keys**: `max_threads` / `max_depth` / `job_max_runtime_seconds` / `interrupt_message` match the `AgentsToml` struct
- **`AGENTS_MD_MAX_BYTES = 32 * 1024`** (i.e. 32 KiB) — default verified directly in source

### 📚 v2 content expansion (based on high-star community guides)

After studying [RoggeOhta/awesome-codex-cli](https://github.com/RoggeOhta/awesome-codex-cli) (280+ resources) and [shanraisshan/codex-cli-best-practice](https://github.com/shanraisshan/codex-cli-best-practice) (50 battle-tested tips), four real features that v1 missed have been added:

- **Real Skill folder structure**: v1 incorrectly described it as a single `SKILL.md` file; source `core-skills/loader.rs` confirms it's a **directory** with optional `references/`, `scripts/`, `examples/`, `agents/openai.yaml`. Canonical path is `~/.agents/skills/` (`~/.codex/skills/` is deprecated). Added the `$skill-name` explicit invocation syntax.
- **Hooks** (beta): 6 events — `PreToolUse` / `PermissionRequest` / `PostToolUse` / `SessionStart` / `UserPromptSubmit` / `Stop`. Source engine is named `ClaudeHooksEngine` — the JSON schema reuses Claude Code's `hooks.json` directly, zero-change migration.
- **Memories** (beta): `/memories` slash command + `[memories] no_memories_if_mcp_or_web_search` safety toggle.
- **Plugins / Marketplace** (v0.121.0+): `codex plugin marketplace add/upgrade/remove`, TUI `/plugins`.
- **Fast Mode**: `/fast on|off|status`, gpt-5.4 at 1.5× speed / 2× credits.

A new "High-Signal Prompting & Workflow Patterns" section consolidates 5 buckets of community wisdom (prompting / planning / AGENTS.md / multi-agent / debugging). The References section now lists 6 high-star community indexes and 4 mainstream workflow frameworks (Superpowers / Spec Kit / oh-my-codex / Compound Engineering).

New [`templates/SKILL.md`](codex/templates/SKILL.md) template (with trigger-style description + Gotchas pattern).

### 🔬 Sixth-pass source verification + v3 content additions

Read the `codex-rs/tui/src/slash_command.rs::SlashCommand` enum directly (46 real slash commands) and caught a third-pass over-correction:

- **`/side` is a real command** ("start a side conversation in an ephemeral fork") — round 3 incorrectly removed it based on a WebFetch summary; restored
- **`/fast` is in the enum** ("toggle Fast mode to enable fastest inference with increased plan usage") — v2 addition was correct
- **Slash command table expanded to 18 entries**: added `/skills`, `/memories`, `/plugins`, `/apps`, `/goal`, `/rename`, `/feedback`, `/approvals`, etc.

`MemoriesToml` source confirms the canonical field is **`disable_on_external_context`**, with `no_memories_if_mcp_or_web_search` as its serde alias (backward-compat). All docs updated to use the canonical name.

Four new feature sections added (each verified in source):

- **§13 OSS local models** — `--oss --local-provider lmstudio|ollama` (from `utils/oss/src/lib.rs`), fully offline + zero API cost
- **§14 Official GitHub Action recipe** — `openai/codex-action@v1` (Apache-2.0, 953 stars) with a complete PR-auto-review workflow YAML
- **§15 Codex as an MCP server** — `codex mcp-server` exposes `codex()` and `codex-reply()` tools for reverse integration with other agents
- **§16 Rules / Execpolicy** — Starlark DSL (`prefix_rule()` + `host_executable()`), validate offline with `codex execpolicy check`

---

## 2026-04 · Major Update: From "Tool Tutorials" to "Full Hands-On Handbook"

### 🆕 New Modules

**📋 [Cheatsheet](cheatsheet.en.md) `cheatsheet.md`**
- 9-tool × 13-dimension capability matrix
- 30-second decision table (pick by need)
- Each tool's config file location + core commands + hotkeys
- Selection decision tree + 5 recommended combos

**⚠️ [Pitfalls Collection](pitfalls/README.en.md) `pitfalls/`**
- **31 deep pitfalls** across 4 tools, each with "Symptom / Cause / Recovery / Prevention"
- Claude Code (8) / Cursor (8) / GitHub Copilot (8) / Aider (7)
- Windsurf / Gemini CLI / Kiro / Trae / OpenClaw — awaiting community contributions

**🎯 [Real-World Scenarios](workflows/scenarios.en.md) `workflows/scenarios.en.md`**
- 3 end-to-end dialogue scripts: refactoring / Cursor+Claude Code collab / legacy test backfill
- Universal "interrupt phrases" reference

**🧭 [Persona-Based Learning Paths](README.en.md) — Main README rewrite**
- Reading paths recommended per 6 user personas (newcomer / frontend / backend / Copilot migrant / cost-sensitive / team collaboration)
- Cheatsheet entry point at the top

**📚 [Further Learning Resources](resources.en.md) `resources.en.md`**
- 20+ curated external resources across 7 categories (Prompt engineering / MCP / Agent / Chinese resources / blogs)
- Each entry: link + scale + "when it's worth your time"

**🛡️ CI Guardrails `.github/workflows/link-check.yml`**
- lychee scans all Markdown links (internal + external)
- Bilingual parity check (every `xxx.md` must have `xxx.en.md`)
- Weekly Monday cron to catch external link rot

**📝 [Contributing Guide](CONTRIBUTING.en.md) — rewritten + English version added**
- Contribution types prioritized (pitfalls > tips > scenarios > fixes > translations)
- New `CONTRIBUTING.en.md` English parallel

### 🔧 Fixes

- **agency-agents-zh role count 187 → 211** (12 references synced)
- **Aider example model name `claude-3-5-sonnet` → `claude-sonnet-4-5`** (13 references)
- **Copilot Pitfall 7 wording fix** ("silent degradation" → "queued or rejected")
- **English README anchor fixes** (`#-9-tool-guides` → `#9-tool-guides`)
- **English README newcomer recommendation**: Trae → Copilot/Cursor Free (international user fit)
- **Cheatsheet removed unverifiable Esc Esc description**

### 📊 Before vs After

| Metric | Before | After |
|--------|-------|-------|
| Markdown files | ~42 | ~65 (+23) |
| Bilingual parity | Partial | **100%** (templates excluded) |
| CI workflows | 0 | 1 (link + bilingual) |
| Pitfalls collection | 4-5 lines per README | 31 deep pitfalls |
| Cheatsheet / decision page | None | `cheatsheet.md` |
| Onboarding | Linear 3 steps | 6 persona paths |

---

## Before 2026-04

See `git log` for history. Early focus:

- 9 standalone tool READMEs
- 7 universal methodologies (prompting / debugging / testing / etc.)
- 3 multi-tool workflows
- Bilingual initialization (most sections)
- Copy-paste config templates
