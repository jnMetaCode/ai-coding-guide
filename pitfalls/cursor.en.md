[简体中文](./cursor.md) | **English**

# Cursor Pitfalls

> Cursor is powerful but has its own traps. 8 real-world pitfalls, each with Symptom / Cause / Recovery / Prevention.
>
> Note: the old Composer panel is now the **Agent panel** (Agent / Ask / Plan modes); "Composer" is now the name of Cursor's own model. Last updated: 2026-09.
>
> Hit a new one? Open an Issue or PR.

---

## Pitfall 1: Agent Goes Rogue — Edits Files You Didn't Touch

**Symptom**
- You ask the Agent to change one feature; the diff spans 6 files
- Some of those files you never opened; it found them across directories and edited them
- Worst case: it "refactored" something in `src/utils/` and broke an unrelated feature

**Cause**
Agent mode has cross-file edit permission by default. It searches related files and decides "these need changing too." Without explicit boundaries, it defines "related."

**Recovery**
```
Stop. Revert all changes outside [files I specified].
Keep only the changes in @src/pages/order/list.tsx.
```

**Prevention**
For big changes, switch to **Plan mode** (`Shift+Tab`) first so it lists the files it intends to touch, then execute. Set the scope explicitly in the prompt:

```
Only these two files:
@src/pages/order/list.tsx @src/pages/order/detail.tsx

If other files need changes to complete this, tell me first.
```

Or codify it in `.cursor/rules/boundaries.mdc` (`alwaysApply: true`):

```markdown
## Agent boundaries
- Unless I @ the file, don't modify it
- src/utils/ and src/types/ are shared code — notify before editing
```

---

## Pitfall 2: Tab Blasts Out a Page of Code, Esc Comes Too Late

**Symptom**
- You just wanted a variable name; Tab dumps 30 lines
- The generated code looks OK but has subtle bugs (hardcoded data, wrong type assumptions)
- "Reflexive Undo" becomes a habit — development slows down

**Cause**
Cursor's Tab completion predicts "the next full chunk," not single-line completion. At info-dense points (function/file start), it'll produce a whole function body.

**Recovery**
- Long completion: press `Esc` to reject
- Accepted something bad: `Cmd+Z` to undo, or `Cmd+K` the selection: "what's wrong with this?"

**Prevention**
- If it's too distracting, snooze or disable Tab in `Cursor Settings → Tab`
- Write **function signature and types first**, then let it complete — fuller signature → better completion
- Comment the intent before waiting for completion:

```typescript
// Count business days between two dates, excluding weekends and CN holidays
function countBusinessDays(start: Date, end: Date): number {
  // Tab completion now has enough to work with
}
```

---

## Pitfall 3: Lots of Rules, None of Them Applied

**Symptom**
- You spend half a day writing 300 lines of `.cursorrules`, or drop a pile of `.md` files into `.cursor/rules/`
- In practice, the AI ignores half of them
- New rules feel like "shouting into a void"

**Cause**
Two common reasons:
1. **Wrong file format**: rules in `.cursor/rules/` must be `.mdc`; a plain `.md` file has no frontmatter and is ignored by the rules system. A root `.cursorrules` file is legacy, kept only for compatibility
2. **A single rule is too long**: hundreds of lines bury the important parts — official advice is to keep each rule under 500 lines

**Recovery**
Split into `.cursor/rules/` (the **directory**, with `.mdc` files):

```
.cursor/rules/
├── global.mdc          # Core rules with alwaysApply: true
├── react.mdc           # Loads when globs match .tsx files
├── api.mdc             # Loads when globs match src/api/
└── testing.mdc         # Loads when globs match *.test.ts
```

Add frontmatter for conditional loading:

```markdown
---
description: React component rules
globs: src/components/**/*.tsx
alwaysApply: false
---

# React component rules
- Props must be declared with interface
- Components must handle loading and error states
```

**Prevention**
- **Start new projects with `.cursor/rules/*.mdc`**, skip `.cursorrules` entirely; to share rules across tools, use `AGENTS.md`
- Keep each rule focused on one topic, short and specific
- Very specific, situational rules → make them manual (no `globs`, `alwaysApply: false`) and @ them when needed; full methodologies → Skills (`.cursor/skills/`)

---

## Pitfall 4: @ Reference Doesn't Actually Load

**Symptom**
- You say `@src/types/user.ts fix the API to match this type`
- Generated code uses guessed field names/types, not your real ones
- Looking closely: it never actually read the file

**Cause**
Common reasons:
1. Path is wrong (case / picked the wrong same-named file)
2. The file is large and the Agent only read part of it
3. You edited but haven't saved

**Recovery**
```
First confirm: what are the fields of User interface in @src/types/user.ts?
List them so I can verify, then start the refactor.
```

Make the AI recite the file contents first to confirm the reference worked.

**Prevention**
- Pick files from the @ popup instead of typing paths by hand
- **Save (Cmd+S) before @ referencing** changed files
- For huge files, name the specific function / class in your prompt so it locates and reads that section

---

## Pitfall 5: Mixing Up Agent / Ask / Inline Edit Kills Productivity

**Symptom**
- In Ask mode: you say "refactor this module" — it just suggests, doesn't edit code
- In Agent mode: you ask "how does this work?" — it answers and starts editing too
- You keep switching and always pick wrong

**Cause**
- **Agent mode**: edits code and runs commands autonomously
- **Ask mode**: read-only Q&A, no edits
- **Plan mode**: drafts a plan first, executes after you approve
- **Inline edit (`Cmd+K`)**: edits the selection only

In the Agent panel (`Cmd+I` / `Cmd+L`), `Shift+Tab` cycles modes — easy to lose track of which one you're in.

**Recovery**
Wrong mode: `Shift+Tab` to the right one and resend.

**Prevention**
Memorize the purpose ↔ entry mapping:

| Intent | Use | Entry |
|--------|-----|-------|
| Ask a question, understand code | Ask mode | Agent panel + `Shift+Tab` |
| Edit a selection | Inline edit | `Cmd+K` |
| Multi-file changes | Plan → Agent mode | Agent panel + `Shift+Tab` |

---

## Pitfall 6: Model Switching Breaks Style Consistency

**Symptom**
- You alternate between Claude and Composer or GPT
- Code style in the same project splits: some files strict types, others sloppy `any`
- You don't even notice it's the model switch

**Cause**
Cursor supports many models (Composer 2.5, Claude, GPT-5.x, Gemini, Grok, etc.) with different default styles: some lean strict, adding types and error handling; others lean terse with minimal comments.

With Auto (Cursor Router), requests are routed based on your Cost / Balance / Intelligence preference, so the model can differ from request to request — which hides this drift.

**Recovery**
Push style into `.cursor/rules/global.mdc` (`alwaysApply: true`) so it applies regardless of model:

```markdown
# Cross-model style
- TypeScript required, no `any`
- Functions must declare return types
- Errors use Result<T, Error>, don't throw
```

**Prevention**
- Enforce style with **rules + linters/formatters**, not by pinning a model
- With Auto, pick the preference per task: Cost / Balance for small everyday edits, Intelligence (or a manually chosen top model) for complex refactors
- For big tasks where consistency matters, pin one model manually from start to finish

---

## Pitfall 7: Still Looking for Notepads — Old Context Never Migrated

**Symptom**
- After upgrading, the Notepads panel is gone, and your saved API spec and conventions "disappeared"
- Or stale snippets (old API design, deprecated style) are still around and the AI gives outdated advice from them

**Cause**
Notepads were deprecated in October 2025 and removed in Cursor 2.0. They were **manually managed** context that never auto-updated, so they drifted from real code over time anyway.

**Recovery**
Move what's still useful to the current mechanisms:
- Stable conventions (API response shape, auth flow) → `.cursor/rules/*.mdc`, set to manual, referenced with `@rule-name`
- Full methodologies / procedures → Skills (`.cursor/skills/`)
- Volatile things (current feature) → don't store them; reference live code with `@Files` / `@Folders`
- Delete stale content while migrating

**Prevention**
- Keep rule files in Git so they're reviewed and evolve with the code
- State each rule's scope and review periodically: "look over every rule untouched for six months"

---

## Pitfall 8: Stale Index — @ References Deleted Files

**Symptom**
- You renamed or deleted a file
- `@` still references it with old contents
- AI suggests changes based on the old file; you apply them; compile fails ("file not found")

**Cause**
Cursor's codebase index doesn't update in real time. After deletions/renames, the index may hold old entries for a while.

**Recovery**
- Check the index status in Cursor Settings' indexing section and resync manually if needed (exact entry point depends on your version)
- Or have the Agent confirm the file exists via search / terminal before continuing

**Prevention**
- After large renames/deletions, make sure the index has caught up before relying on @ references
- If `@` references behave weirdly, check the index first — don't blame the AI

---

## Contribute a Pitfall

Template: see [claude-code.en.md end](./claude-code.en.md#found-a-new-pitfall).

---

## Related

- [Cursor Full Guide](../cursor/README.en.md)
- [common/context-management.en.md](../common/context-management.en.md) — Cross-tool context management
- [workflows/scenarios.en.md](../workflows/scenarios.en.md) — Includes Cursor + Claude Code scenarios
