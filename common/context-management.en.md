[简体中文](./context-management.md) | **English**

# Context Management

> The "intelligence" of your AI coding tool is directly proportional to context quality. Too little and it doesn't understand your project. Too much and it actually gets dumber. Managing context well is a key skill for effective AI-assisted development.

---

## How Context Works

Every AI coding tool has a **context window** — think of it as the AI's "working memory."

| Tool | Context Window | Notes |
|---|---|---|
| Claude Code | 1M tokens | Opus/Sonnet 5.5 both 1M (Haiku 200K) |
| Cursor | per model | Depends on the selected model |
| Copilot | per model | Depends on the selected model; includes open files |
| Gemini CLI | 1M tokens | Large window, but bigger isn't always better (no longer serves individual users — enterprise / paid API keys only) |

**Key insight**: More context is not always better. Stuffing in irrelevant information causes "attention dilution" — important details get buried.

---

## Core Strategies

### 1. Feed Precisely, Don't Dump Everything

```
❌ Bad: "Look at the entire src/ directory and find the bug"
✅ Good: "Look at the refreshToken function in src/services/auth.ts —
    users report getting 'token expired' after refresh.
    Also check src/middleware/auth.ts to see how tokens are validated."
```

### 2. Project Config Files Are Your Most Efficient Context

Every tool has a project config file that loads automatically at startup:

| Tool | Config File | Purpose |
|---|---|---|
| Claude Code | `CLAUDE.md` | Project background, conventions, common commands |
| Cursor | `.cursor/rules/*.mdc` | Project rules (`.cursorrules` is legacy) |
| Copilot | `.github/copilot-instructions.md` | Project guidelines |
| Devin Desktop (formerly Windsurf) | `.devin/rules/*.md` | Project rules (`.windsurfrules` kept only for backward compatibility) |
| Gemini CLI | `GEMINI.md` | Project config |

**A well-written config file = the most critical context automatically included in every conversation.**

### 3. Refresh Periodically During Long Conversations

The longer a conversation runs, the less weight earlier messages carry. When AI starts "forgetting" or producing lower-quality responses:

```
# Claude Code
> /clear    # Clear current conversation, start fresh

# Or summarize manually
> Here's what we've done so far: [summary].
  Now continue with [next task].
```

### 4. Use Files to Pass Context, Not Chat

```
❌ Bad: Pasting 500 lines of code into the chat for analysis
✅ Good: The code is already in a file — just tell AI where to look
    "Read the processRefund function in src/services/payment.ts, lines 100-150"
```

---

## Tool-Specific Context Management

### Claude Code

```bash
# Use CLAUDE.md for persistent context
# Use Memory for cross-conversation recall
# Use /clear to reset the conversation

# For large projects: use subagents to isolate context
"Use a subagent to analyze the src/payment/ code —
 don't pollute the main conversation's context."
```

### Cursor

```
# Use @ references for precise context control
@src/models/user.ts @src/schemas/user.ts
Write a user registration endpoint based on these two files

# Use Rules / Skills to save frequently used context (Notepads were removed in 2.0)
# Use Rules globs to auto-load rules by file type

# Open related files as implicit context
# Cursor reads your currently open tabs
```

### Copilot

```
# Use #file #selection #terminal for precise references
#file:src/models/user.py Write tests based on this model

# Open related files — Copilot reads your open tabs
# Close unrelated files — reduce noise

# Agent mode auto-searches for related files
# But you can use #file to narrow scope and improve accuracy
```

---

## Common Issues

| Problem | Cause | Solution |
|---|---|---|
| AI gives inaccurate answers | Not enough context, or too much noise | Reference specific relevant files |
| AI gets progressively worse | Conversation too long, context overflow | Start a new conversation with your config file |
| AI forgets earlier agreements | Early messages lose weight over time | Put important conventions in the config file |
| AI invents non-existent APIs | Insufficient reference material | Have it grep/search to confirm before using |
| AI re-does work it already completed | Doesn't remember prior progress | Track progress with a todo/plan |
