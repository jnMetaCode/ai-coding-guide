[简体中文](./CHANGELOG.md) | **English**

# Changelog

> See `git log` for full commit history. This file records user-facing major updates.

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
