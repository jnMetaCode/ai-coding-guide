[简体中文](./CONTRIBUTING.md) | **English**

# Contributing

Thanks for your interest in the AI Coding Practical Guide.

## What to Contribute

Welcome contribution types (ordered by "most valued"):

### 🔥 High priority: real pitfalls you've hit

Write a [`pitfalls/<tool>.md`](./pitfalls/README.en.md) entry for a pitfall you actually hit. **Must be real**, not speculation.

Format: Symptom / Cause / Recovery / Prevention. Full template in [pitfalls/README.en.md](./pitfalls/README.en.md).

Tools not yet covered: Codex CLI / Windsurf / Gemini CLI / Kiro / Trae / OpenClaw.

### 🔥 Practical tool tips

Add to the "Prompt Tips" or "Advanced Usage" section of a tool's `README.en.md`. Every tip must:
- Have a concrete scenario (not "this is better" but "in scenario X, Y beats Z")
- Include a ❌/✅ comparison or a copy-ready prompt
- Include verifiable outcomes (what was run, what was seen)

### ⚡ End-to-end dialogue scripts

Add to [`workflows/scenarios.en.md`](./workflows/scenarios.en.md). A complete runnable prompt sequence that covers an entire flow from requirement to acceptance.

### ⚡ Fix outdated info

AI tools move fast. Spot outdated content (versions, pricing, commands, feature deltas) and fix it:
- [`cheatsheet.en.md`](./cheatsheet.en.md) — comparison parameters
- Each `<tool>/README.en.md` — commands and hotkeys
- [`ecosystem.en.md`](./ecosystem.en.md) — ecosystem project specs (role counts, features)

### ⚡ Translation and bilingual maintenance

All content has `.md` (Chinese) and `.en.md` (English) parallels. When you contribute:
- Update Chinese → sync to English (draft is fine; others will polish)
- Translating existing zh-only files to English is a valid contribution
- Files under `templates/` **do not** need translation (they're project-specific configs)

CI automatically verifies every `.md` has a matching `.en.md`.

## Process

1. Fork this repo
2. Create a feature branch: `git checkout -b add-xxx-tip`
3. Commit your changes (Chinese or English in commit messages, either is fine)
4. Push to your fork: `git push origin add-xxx-tip`
5. Open a Pull Request

CI runs on PR:
- **Link Check** — validates internal and external Markdown links
- **Bilingual Parity** — ensures bilingual pairs are complete

If CI is red, check the Actions output and fix.

## Content Standards

- **Practical first** — every tip should have a concrete scenario, no hand-waving
- **Code examples** — use ❌/✅ comparisons
- **Concise** — one paragraph beats three when the content fits
- **Accurate** — commands, configs, APIs must be verified, not invented
- **Avoid "pitfall of pitfalls"** — don't dress up operator errors as pitfalls (e.g. "forgetting to save a file" is not a pitfall). See quality bar in [pitfalls/README.en.md](./pitfalls/README.en.md).

## File Layout

```
cheatsheet.md             — 9-tool cheatsheet (comparison + command reference)
ecosystem.md              — Related ecosystem projects (superpowers / agents / etc.)

<tool>/README.md          — Full guide for one tool (10 tools total)
<tool>/templates/         — Copy-ready config templates

common/xxx.md             — Cross-tool methodologies (prompting / debugging / ...)
workflows/xxx.md          — Multi-tool workflows + real-world dialogue scripts
pitfalls/<tool>.md        — Deep pitfall collection per tool
```

## License

Contributions are accepted under [Apache 2.0](./LICENSE).
