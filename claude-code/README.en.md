[简体中文](./README.md) | **English**

# Claude Code Best Practices

> Claude Code is Anthropic's official CLI AI coding tool. It's not just a code completion tool — it's an Agent that understands your entire project and executes complex tasks autonomously.

---

## Core Concepts

Before diving into tips, get familiar with these core concepts:

| Concept | Description | Use Case |
|---------|-------------|----------|
| **Subagent** | Child process Agent, executes tasks independently | Parallel processing, context isolation |
| **Command** | Shortcuts starting with `/` | Quick access to common operations |
| **Skill** | Methodology files under `.claude/skills/` | Teach the AI how to do things |
| **Hook** | Scripts that run before/after tool calls | Automated validation, notifications |
| **MCP Server** | Model Context Protocol service | Extend AI capabilities (databases, APIs, etc.) |
| **Memory** | Persistent memory | Retain context across conversations |
| **Checkpoint** | Auto-saved snapshots | Safe rollback |

---

## Getting Started

### Installation

```bash
# Install globally via npm
npm install -g @anthropic-ai/claude-code

# Or run directly with npx
npx @anthropic-ai/claude-code
```

### First Run

```bash
cd /your/project
claude
```

Once in interactive mode, try these:

```
# Understand the project
> What does this project do? Walk me through the architecture.

# Small task
> Add a truncate function to utils/string.ts that cuts strings at a given length and appends an ellipsis.

# Big task (just describe it — Claude Code plans and executes automatically)
> Refactor all endpoints under src/api/ to use a unified error handling format.
```

### CLAUDE.md — Project Configuration File

Create a `CLAUDE.md` in your project root. Claude Code reads it on every startup:

```markdown
# Project Overview
This is an e-commerce admin dashboard built with Next.js 14 + TypeScript.

# Code Conventions
- Use TypeScript strict mode
- Components use PascalCase
- API routes go under src/app/api/
- Tests use Vitest, placed in __tests__/

# Common Commands
- Dev server: pnpm dev
- Run tests: pnpm test
- Type check: pnpm typecheck
- Lint: pnpm lint

# Important Notes
- Do NOT modify anything under src/legacy/ — it's a compatibility layer for the old version
- Database migrations must be generated via drizzle-kit — never write raw SQL
```

---

## Prompting Tips

### 1. Provide Full Context in One Go

```
❌ Bad: Add a login feature.
✅ Good: Add a JWT login endpoint under src/app/api/. Use bcrypt for password
    verification, set token expiry to 7 days, and return errors in a unified
    { code, message } format. Follow the style of src/app/api/register/route.ts.
```

### 2. Point to Reference Files

```
Follow the style of src/components/UserTable.tsx.
Create a new src/components/OrderTable.tsx with
pagination, sorting, and search using TanStack Table.
```

### 3. Analyze First, Act Second

```
Read src/services/payment.ts and src/services/order.ts first.
Analyze the current payment flow for issues,
propose improvements, and wait for my confirmation before making changes.
```

### 4. Limit the Scope

```
Only modify src/utils/date.ts.
Don't touch other files. Don't add new dependencies.
```

### 5. Draw Red Lines with Negatives

```
Implement a caching layer.
Don't use Redis — use in-memory caching.
Don't add new dependencies — use a plain Map.
Don't change any existing function signatures.
```

---

## Advanced Techniques

### Agent Capabilities

Claude Code is an Agent by design — describe the task and it plans and executes autonomously:

```
> Add unit tests to the entire project, targeting 80% coverage.
```

Claude Code will: read code → make a plan → write tests → run tests → fix failures → verify passing.

> **Tip**: No special commands or flags needed. Just describe the desired outcome. Claude Code decides on its own whether multi-step execution is necessary.

### Subagent Parallelism

Split large tasks across multiple Subagents running in parallel:

```
Do these three things in parallel:
1. Add pagination parameters to src/api/users.ts
2. Add date filtering to src/api/orders.ts
3. Add search to src/api/products.ts
Use subagents to execute each one independently.
```

### Skill Files

Skills are one of the most powerful features. Place methodology files under `.claude/skills/` and the AI loads them automatically:

```
.claude/skills/
├── brainstorming.md      # Requirements analysis workflow
├── debugging.md          # Debugging methodology
├── code-review.md        # Code review standards
└── verification.md       # Pre-completion verification
```

**Quick-install superpowers-zh** (20 battle-tested skills):

```bash
cd /your/project
npx superpowers-zh
# Auto-detects project type, installs to .claude/skills/
# Also supports Cursor, Gemini CLI, etc.
```

After installation, Claude Code loads these skills automatically. Invoke them with `/` commands — e.g., `/brainstorming` for requirements analysis, `/debugging` for systematic debugging. See [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh).

**Need specialized roles?** Use the 277 AI expert personas from [agency-agents-zh](https://github.com/jnMetaCode/agency-agents-zh):

```bash
# Copy role files to .claude/skills/ to use them
# Examples: database optimizer, security engineer, code reviewer, etc.
```

Reference roles in CLAUDE.md:

```markdown
# Roles
When I say "review as a security expert", act according to .claude/skills/security-engineer.md.
```

### Hook Automation

Hooks run scripts automatically before or after tool calls:

```json
// .claude/settings.json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "echo 'About to run a command'" }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          { "type": "command", "command": "pnpm lint --fix" }
        ]
      }
    ]
  }
}
```

> Hook trigger points include `PreToolUse`, `PostToolUse`, `Notification`, etc. Each trigger uses `matcher` to match tool names. See the [official docs](https://docs.anthropic.com/en/docs/claude-code/hooks).

Use cases:
- Auto-run related tests after every file edit
- Auto-lint before every commit
- Auto-add copyright headers to new files

### Git Worktree Isolation

Use worktrees for experimental changes without affecting the main branch:

```
Do this refactor in a git worktree.
If the result is good, merge it. If not, discard it.
```

### Memory Across Conversations

Claude Code stores memory under `~/.claude/` for cross-conversation use:

```
Remember: this project deploys on Vercel,
CI uses GitHub Actions, and the database is Supabase PostgreSQL.
Factor these in for all deployment-related tasks going forward.
```

### Multi-Agent Orchestration

When tasks are complex enough to need multiple AI roles collaborating (e.g., architect designs → developer implements → reviewer audits), use [agency-orchestrator](https://github.com/jnMetaCode/agency-orchestrator) for YAML-based orchestration:

```yaml
# workflow.yaml
name: New Feature Development
steps:
  - agent: Software Architect
    task: Analyze requirements, produce technical design
    output: design.md

  - agent: Backend Developer
    task: Implement code per design.md
    input: design.md

  - agent: Code Reviewer
    task: Review code quality and security
```

Best for: team-scale complex tasks, deliverables requiring multiple review rounds, standardized development workflows.

---

## Debugging Tips

### 1. Let It Read Logs — Don't Let It Guess

```
❌ Bad: Tests are failing, fix them.
✅ Good: Run pnpm test src/api/users.test.ts,
    show me the failure output, analyze the root cause, then fix.
```

### 2. Narrow the Scope

```
Look only at lines 45-80 of src/services/auth.ts.
A user reports "token still shows expired after refresh".
Analyze possible causes first — don't change anything yet.
```

### 3. Diff Analysis

```
Check git log for recent changes to src/api/payment.ts.
Compare logic before and after to find which commit introduced this bug.
```

---

## Tips Cheat Sheet (60+)

Organized by category, one tip per row. Bookmark this section — it's all you need.

### Prompting (12)

| # | Tip | Details |
|---|-----|---------|
| 1 | Analyze before acting | Have Claude read the code and propose a plan. Confirm before it makes changes. Prevents premature rewrites |
| 2 | Start over | Not happy? Say "Scrap this approach. Use what you've learned to design an elegant solution from scratch" |
| 3 | Quiz me | "Review this change and ask me questions until you're confident I understand it, then open the PR" |
| 4 | Limit scope | "Only modify this one file. Don't touch anything else. Don't add new dependencies" |
| 5 | Specify reference files | "Follow the style of src/api/users.ts when writing orders.ts" — 10x better than a vague description |
| 6 | Draw red lines with negatives | "Don't use Redis. Don't add new dependencies. Don't change function signatures" |
| 7 | Ask for 2-3 options | "Give me 2 options with pros and cons. I'll pick one, then you implement it" |
| 8 | Confirm step by step | "Pause after each step and wait for my confirmation. Don't do everything at once" |
| 9 | Define done criteria | "Definition of done: all tests pass + zero TypeScript errors + lint passes" |
| 10 | Use ultrathink for deep reasoning | Start your prompt with "ultrathink" or "think really hard" to trigger extended thinking |
| 11 | Let it write commit messages | "Write a commit message that explains *why* this change was made, not *what* changed" |
| 12 | English prompts are more precise | For complex technical tasks, English prompts yield more precise results. Use your native language for simple tasks |

### CLAUDE.md (10)

| # | Tip | Details |
|---|-----|---------|
| 1 | Keep it under 200 lines | Too long and the AI ignores the bottom. For large projects, split into `.claude/rules/` |
| 2 | The "run tests" test | If anyone opens Claude Code and says "run tests" and it succeeds, your CLAUDE.md is good enough |
| 3 | Use settings.json over "don't" | "Don't modify file X" in CLAUDE.md gets ignored easily. Permission controls in settings.json are more reliable |
| 4 | Use `<important>` tags | Wrap critical rules in `<important>` tags — the model pays more attention to them |
| 5 | List common commands | Include dev, test, build, lint, and deploy commands so the AI doesn't have to guess |
| 6 | List prohibitions | Explicitly state which files are off-limits, which methods are banned, which dependencies must not be added |
| 7 | Document directory structure | Describe key directories so the AI knows where things live |
| 8 | Layer your CLAUDE.md files | Global rules in the root, module-specific rules in subdirectories (e.g., `src/api/CLAUDE.md`) |
| 9 | Update regularly | As the project evolves, keep CLAUDE.md current. Stale rules are worse than no rules |
| 10 | Use `.claude/rules/` for conditional loading | In large projects, use globs to load rules by file type instead of cramming everything in one file |

### Agent & Subagent (10)

| # | Tip | Details |
|---|-----|---------|
| 1 | Split subagents by feature | Create a "payment module agent" — not a generic "backend engineer" |
| 2 | Adversarial testing | One agent writes code, another (with independent context) hunts for bugs |
| 3 | Write skill descriptions for the model | Write "trigger when the user wants to do X" — not a human-friendly summary |
| 4 | Add gotchas to skills | Record mistakes Claude has made inside skill files. Highest signal-to-noise content you can write |
| 5 | `context: fork` for isolation | Run a skill in an isolated subagent; the main context only sees the final result |
| 6 | One agent, one clear task | A single agent with one task succeeds far more often than one agent juggling five |
| 7 | Pass files between agents, not messages | Have agent A write output to a file; agent B reads the file. More reliable than verbal handoffs |
| 8 | Use worktrees for experiments | Run subagents in git worktrees for experimental changes. Discard if unhappy |
| 9 | Extend capabilities with MCP | Connect databases, call APIs, query docs — MCP makes agents 10x more capable |
| 10 | Custom commands for repetitive tasks | Wrap frequent operations into `/command` shortcuts for one-click execution |

### Hooks (8)

| # | Tip | Details |
|---|-----|---------|
| 1 | PostToolUse auto-format | Auto-run prettier/eslint --fix after Claude writes code to prevent formatting issues |
| 2 | PostToolUse auto-test | Auto-run related tests after every file modification to catch issues early |
| 3 | PreToolUse block dangerous ops | Check commands before `Bash` tool execution; block `rm -rf` and similar |
| 4 | Notification hook for alerts | Auto-send Slack/webhook notifications when long tasks complete |
| 5 | Stop hook for forced verification | Remind Claude to verify its own output at the end of each turn |
| 6 | Exit 1 in hooks to block execution | A non-zero exit from a hook script blocks the tool call — use this to enforce rules |
| 7 | Hook stdout as context | Claude sees the hook's stdout, so you can pass extra information through it |
| 8 | Match tool names precisely | Matcher supports `Write\|Edit`, `Bash`, etc. Don't use `*` to match everything |

### Workflow (12)

| # | Tip | Details |
|---|-----|---------|
| 1 | Manually `/compact` at 50% context | Don't wait for auto-compaction. Proactive compaction keeps AI quality high |
| 2 | Esc Esc to revert to checkpoint | Gone off track? Roll back via checkpoint instead of trying to fix in a polluted context |
| 3 | Keep PRs small and focused | Aim for a median of ~120 lines per PR. Split large changes into multiple PRs |
| 4 | Finish migrations before new features | A half-migrated codebase makes the AI pick wrong patterns. Keep the codebase clean |
| 5 | New conversation for new tasks | Start fresh for each independent task. Stale context from old conversations degrades quality |
| 6 | Start with plan mode | For complex tasks, enter plan mode (`/plan`) first. Confirm the plan, then execute |
| 7 | Fast iterations > one perfect shot | Ship an MVP, verify it works, then refine. Don't expect perfection from a single prompt |
| 8 | Let Claude run tests itself | Don't run them for it. Let it run, read output, and fix. That's an agent's sweet spot |
| 9 | Use `--resume` to continue | Interrupted? Use `claude --resume` to restore context and keep going |
| 10 | Use `--print` for non-interactive tasks | In CI/CD: `claude --print "check code style"` for automation |
| 11 | Headless mode for batch tasks | `claude -p "task" --output-format json` is ideal for scripted invocations |
| 12 | Parallel worktrees for throughput | Run multiple Claude instances in separate worktrees to process modules in parallel |

### Git & PRs (8)

| # | Tip | Details |
|---|-----|---------|
| 1 | Let Claude write PR descriptions | "Read the git diff and write a PR description explaining what changed and why" |
| 2 | Squash merge for clean history | AI's intermediate commits are noisy. Squash to keep only the final result |
| 3 | Isolate with feature branches | One branch per task. Claude's changes never touch main directly |
| 4 | Use Claude for code review | "Read this PR's diff and review it for security, performance, and maintainability" |
| 5 | Self-check before committing | "Pre-commit check: any leftover console.log, TODO, or hardcoded values?" |
| 6 | Don't amend the previous commit | Claude sometimes uses `--amend` and overwrites your prior commit. Explicitly say "create a new commit" |
| 7 | Use git stash to protect your work | Have Claude `git stash` before making changes. Unhappy? `git stash pop` to restore |
| 8 | Let Claude resolve merge conflicts | "Look at the conflicting files, resolve by business logic, and preserve valid changes from both sides" |

### Debugging (10)

| # | Tip | Details |
|---|-----|---------|
| 1 | Let it run commands and read output | "Run pnpm test and show me the failure output" is 10x better than "tests are broken, fix them" |
| 2 | Narrow scope before asking | "Look only at auth.ts lines 45-80" beats "this module has a bug" |
| 3 | Use git log to compare | "Check recent changes, compare before and after, find which commit introduced the bug" |
| 4 | Reproduce before fixing | "Write a test case that reproduces this bug first, then fix it and confirm the test goes from red to green" |
| 5 | Binary search with bisect | "Use git bisect to find the commit that introduced this bug" |
| 6 | Read logs, don't guess | "Check the last 50 lines of logs/error.log and analyze the error" |
| 7 | Add temporary logging | "Add console.log at key points to print variable values, run once, and review the output" |
| 8 | Compare working vs. broken | "User A works fine, user B doesn't. Compare the two requests for differences" |
| 9 | Check environment differences | "Works locally but not in production? Compare env vars, dependency versions, and Node version" |
| 10 | Don't fix blindly | "Give me 3 possible causes with investigation steps. I'll confirm before you change any code" |

### Cost & Performance (6)

| # | Tip | Details |
|---|-----|---------|
| 1 | Use Haiku for simple tasks | `claude --model haiku` for straightforward work — 10x cheaper |
| 2 | Use headless mode for batch jobs | Scripted batch calls consume fewer tokens than interactive mode |
| 3 | A precise CLAUDE.md saves tokens | The more precise your context, the fewer files the AI needs to read, and the lower the cost |
| 4 | Avoid repeatedly reading large files | Tell Claude the exact line range instead of having it read the entire file every time |
| 5 | Use `/compact` to free context | Compress long conversations promptly to reduce per-turn token consumption |
| 6 | Monitor usage | Check API usage regularly and set budget caps to avoid overspending |

> For more tips, see [claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice).

---

## Common Pitfalls

| Pitfall | Description | Solution |
|---------|-------------|----------|
| Context overflow | Conversations get too long, AI gets worse | Start new conversations regularly; pass context via CLAUDE.md |
| Hallucinated APIs | AI invents APIs that don't exist | Have it check docs or `grep` to confirm first |
| Over-refactoring | You asked to fix a bug, it rewrites the whole file | Explicitly say "only fix this one thing, don't refactor" |
| Tests not run | AI says "done" without verifying | Use a verification skill or hook to force validation |
| Missing error handling | Quick implementation with no edge case handling | Explicitly require error handling in your prompt |

👉 **Deep dive**: [Claude Code Pitfalls](../pitfalls/claude-code.en.md) — 8 real-world traps, each with Symptom / Cause / Recovery / Prevention

---

## Configuration Templates

Copy these directly into your project:

| Template | Purpose |
|----------|---------|
| [CLAUDE.md](templates/CLAUDE.md) | Project configuration file template — copy to project root and customize |
| [settings.json](templates/settings.json) | Permission configuration template — copy to `.claude/settings.json` |

---

## Further Reading

- [Claude Code Official Docs](https://docs.anthropic.com/en/docs/claude-code)
- [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) — 20 AI coding skills
- [agency-agents-zh](https://github.com/jnMetaCode/agency-agents-zh) — 277 AI expert personas
