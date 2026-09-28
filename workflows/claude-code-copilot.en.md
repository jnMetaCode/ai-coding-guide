[简体中文](./claude-code-copilot.md) | **English**

# Claude Code + Copilot Workflow

> Claude Code handles Agent-level tasks, Copilot handles inline completion. The two tools have a clean division of labor and don't conflict — one runs in the terminal, the other in the editor.

---

## Division of Labor

| Task | Claude Code | Copilot |
|------|:---:|:---:|
| Cross-file refactoring | Yes | |
| Writing test suites | Yes | |
| Debugging (inspecting logs, running commands) | Yes | |
| Architecture design | Yes | |
| Inline code completion | | Yes |
| Writing comments / docs | | Yes |
| Small function implementations | | Yes |
| Code comprehension (select and ask) | | Yes |

---

## Typical Workflow

```
1. Claude Code creates file skeletons
   > Create all files under src/services/notification/ per the design

2. VS Code + Copilot fills in the implementation
   Open the files Claude Code created, write code with Copilot auto-completing

3. Claude Code runs tests and reviews
   > Run tests for any issues, then do a code review

4. VS Code + Copilot handles small touch-ups
   Make quick edits in the editor based on review feedback
```

---

## Why This Works

- **No context switching** — Claude Code lives in the terminal, Copilot lives in VS Code, each doing its own thing
- **Cost control** — Copilot paid plans include unlimited code completions, no extra charges for heavy completion usage (Chat / Agent are billed in AI Credits)
- **Strong complementarity** — Claude Code isn't great at inline completion, Copilot isn't great at Agent tasks
