---
name: release-notes
description: Draft user-facing release notes from a git log range. Trigger when the user asks for "release notes", "changelog entry", or "what shipped this week" with a git ref range. Output is markdown sections grouped by Features / Fixes / Breaking with PR links.
---

# Release Notes Drafter

Generate clear, user-facing release notes from `git log` between two refs.

## When to fire

- User mentions: "release notes", "changelog", "what shipped", "summarize this milestone"
- A git ref range or version tag is in scope (e.g. `v1.2.0..HEAD`, `last-tag..main`)

## Inputs you should gather

1. The two refs (default: `<latest tag>..HEAD` if user didn't specify)
2. Audience: end users (default), API consumers, internal team
3. Output format: markdown (default), JSON, or plain text

## Steps

1. Run `git log <from>..<to> --pretty=format:'%h%x09%s%x09%an' --no-merges`
2. For each commit, classify:
   - `feat:` / `add:` → **Features**
   - `fix:` / `bugfix:` → **Fixes**
   - `BREAKING CHANGE:` (in body) → **Breaking** (top of doc, explicit migration note)
   - everything else (`chore:`, `docs:`, `refactor:`, `test:`) → omit unless user-visible
3. For each entry, rewrite the commit message in user-facing language (no `feat(api):` prefix; no internal jargon)
4. If there's a PR number in the commit (`(#1234)`), link it
5. Group by category, sort by impact (breaking > features > fixes > minor)

## Output template

```markdown
## <version> — <date>

### ⚠️ Breaking changes
- <one-sentence summary>. **Migration:** <what to do>. ([#PR])

### ✨ Features
- <user-visible benefit>. ([#PR])

### 🐛 Fixes
- <symptom that's now fixed>. ([#PR])
```

## Gotchas

- Don't dump raw commit messages — rewrite from the *user's* perspective
- Squash-merged repos: each merge commit covers many internal commits; read the PR description for context
- Conventional Commit `chore:` and `docs:` rarely belong in user-facing notes
- If `BREAKING CHANGE:` is in the body of a `feat:`, the entry must surface as Breaking, not Feature
- For monorepos, prefix entries with the affected package name (`[@org/auth]`)

## References

- See `references/conventional-commits.md` for the full type list
- See `examples/v1.2.0.md` for a polished sample
