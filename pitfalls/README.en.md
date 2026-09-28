[简体中文](./README.md) | **English**

# Pitfalls Collection

> Every tool README has a "Common Pitfalls" quick-reference table. This directory **goes deeper**: every pitfall follows the **Symptom → Cause → Recovery → Prevention** format.
>
> Goal: not a filler checklist, but to help you **not hit the same trap twice**.

---

## Index by Tool

| Tool | # of pitfalls | Topics |
|------|--------------|--------|
| [Claude Code](./claude-code.en.md) | 8 | Context overflow / hallucinated APIs / over-refactoring / fake verification / CLAUDE.md ignored / git amend / plan drift / subagent context |
| [Cursor](./cursor.en.md) | 8 | Agent rogue / Tab blast / rules not applied / @file silent fail / Agent·Ask mode confusion / model switching / Notepads removed / stale index |
| [GitHub Copilot](./copilot.en.md) | 8 | Outdated APIs / Agent reads .env / instructions too long / #file vs Agent search / MCP silent fail / IDE differences / AI Credits exhausted / custom agents not discovered |
| [Aider](./aider.en.md) | 7 | Auto-commit swallows WIP / /add misses deps / model-switch quality drop / lint loop burns tokens / stale map / Architect→Code drift / amend chaos |

---

## Other Tools

Devin Desktop (formerly Windsurf) / Codex CLI / Gemini CLI / Kiro / Trae / OpenClaw pitfall pages aren't written yet. You're welcome to:

1. Check if you've hit any pain points with the tool you use
2. Send a PR using the template below

---

## Template for New Pitfall Pages

File naming: `pitfalls/<tool-name>.md` (Chinese) + `pitfalls/<tool-name>.en.md` (English parallel)

Structure:

```markdown
# <Tool> Pitfalls

> One-line positioning: what's uniquely painful about this tool

## Pitfall 1: One-line title

**Symptom**
What you actually saw (be specific)

**Cause**
Why it happens (in your own words — don't just parrot the docs)

**Recovery**
How to climb out if already stuck (commands / prompts copy-ready > prose)

**Prevention**
How to avoid next time (prompt / config / Hook / Skill)

...(about 8 pitfalls, quality over quantity)

## Contribute a Pitfall
Template: see claude-code.en.md end

## Related
- Link to the tool's own README
- Link to relevant common/ methodologies
```

---

## Quality Bar

Pitfalls of writing pitfalls (the meta-pitfall):

- ❌ **Tutorial-in-disguise**: "how to use it" repackaged as "pitfall" (e.g., "forgetting to save" is not a pitfall)
- ❌ **Paraphrased FAQ**: value is in pain you actually hit and actually fixed
- ❌ **Symptom and cause conflated**: readers can't tell "is this me?"
- ✅ **Reproducible symptoms**: readers can recognize themselves
- ✅ **Concrete recovery**: give a command or prompt, not "pay attention"
- ✅ **Copy-pasteable prevention**: directly droppable into `CLAUDE.md` / `.cursor/rules/*.mdc` / settings.json

---

## Related

- [common/debugging.en.md](../common/debugging.en.md) — Systematic debugging methodology
- [workflows/scenarios.en.md](../workflows/scenarios.en.md) — Real-world dialogue scripts with interrupt phrases
