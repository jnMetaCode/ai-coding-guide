[简体中文](./claude-code-cursor.md) | **English**

# Claude Code + Cursor Workflow

> This is currently the most popular AI coding combo. Claude Code handles the "heavy lifting" (architecture, refactoring, debugging, testing), while Cursor handles the "everyday" (coding, UI, quick edits).

---

## Division of Labor

| Task | Claude Code | Cursor |
|------|:---:|:---:|
| Project initialization / scaffolding | Yes | |
| Architecture design / refactoring | Yes | |
| Writing and running tests | Yes | |
| Bug debugging (requires log inspection) | Yes | |
| Git operations (commits, PRs) | Yes | |
| Daily coding / new feature implementation | | Yes |
| UI tweaks / styling changes | | Yes |
| Code comprehension / learning | | Yes |
| Small changes (tweak a param, add a field) | | Yes |

---

## Typical Workflow

### New Feature Development

```
Phase 1: Design (Claude Code)
> Add a notification system to the project. Support in-app messages and email.
  Analyze the existing architecture first, then propose a design.

Phase 2: Skeleton Code (Claude Code)
> Based on the approved design, create all necessary files and base code structure.
  Include data models, Service interface definitions, and API routes.

Phase 3: Implementation Details (Cursor)
Open Cursor and flesh out the implementation on top of the skeleton Claude Code created.
Use the Agent panel (Cmd+I) to implement business logic file by file.

Phase 4: Testing (Claude Code)
> Write comprehensive tests for the notification module.
  Unit tests + integration tests.
  Run them all and make sure everything passes.

Phase 5: Code Review (Claude Code)
> Review the entire notification module for code quality and security.
```

### Bug Fix

```
Phase 1: Locate (Claude Code)
> Users report "no email received after sending notification."
  Check logs, review recent changes, analyze root cause.

Phase 2: Fix (Cursor or Claude Code)
Simple fix -> Cursor (select code and edit directly)
Complex fix -> Claude Code (requires cross-file coordination)

Phase 3: Verify (Claude Code)
> Run the notification module tests to confirm the fix works
  and no new issues were introduced.
```

---

## Keeping Configuration in Sync

Keep project configuration consistent across both tools:

```
# Write the same core rules in both CLAUDE.md and .cursor/rules/*.mdc
# Or use superpowers-zh, which supports both tools

cd /your/project
npx superpowers-zh  # Auto-detects and installs to .claude/ and .cursor/
```

---

## Things to Watch Out For

1. **Don't edit the same file with both tools simultaneously** — you'll get conflicts
2. **Refresh in Cursor after Claude Code makes changes** — files are already updated on disk
3. **Git is the coordination hub** — changes from both tools are managed through Git
