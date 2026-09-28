[简体中文](./README.md) | **English**

# Kiro Best Practices

> Kiro is an AI IDE from AWS. Its defining feature is **Spec-driven Development** — instead of having AI write code directly, it first generates requirement specs, design docs, and an implementation task list. You review and approve the spec, then Kiro implements accordingly. Well suited for team collaboration and projects that demand high-quality deliverables. Generally available since 2025-11-17, it now spans IDE, CLI, Web, Mobile, and Crew.

---

## Core Concepts

| Concept | Description | Use Case |
|---------|-------------|----------|
| **Spec** | Requirement specification document | AI writes the spec first, implements after approval |
| **Steering** | `.kiro/steering/*.md` | Project-level rules and guidelines |
| **Hooks** | Event triggers in `.kiro/hooks/*.json` | Auto-validate/test after the agent edits files |
| **Agent** | Background autonomous execution | Completes complex tasks automatically |
| **MCP** | Supported in IDE / CLI / Web | Connect external tools and data sources |

### New in 2026

- **Kiro CLI / Web / Mobile**: the same agent harness in your terminal, browser, and phone
- **Kiro Crew** (2026-08-04): an open-source (Apache 2.0) background-agent workspace that runs on Kiro CLI and reuses your existing `.kiro` config — good for async migrations, ticket triage, PR follow-ups
- **Powers**: on-demand capability packs with built-in domain knowledge that extend the agent
- **AGENTS.md**: supported; place it in the workspace root or `~/.kiro/steering/`, always included

### Pricing

| Plan | Price | Monthly credits |
|------|-------|-----------------|
| Free | $0 | 50 |
| Pro | $20/mo | 1,000 |
| Pro+ | $40/mo | 2,000 |
| Pro Max | $100/mo | 5,000 |
| Power | $200/mo | 10,000 |

Paid plans bill overage at $0.04/credit; unused credits don't roll over. See [kiro.dev/pricing](https://kiro.dev/pricing/) for the latest.

---

## Getting Started

### Installation

Download from [kiro.dev](https://kiro.dev). Sign in with GitHub, Google, AWS Builder ID, or an organization identity (IAM Identity Center / external IdP).

### Steering Files — Project Configuration

Create rule files under `.kiro/steering/`:

```markdown
---
inclusion: always
---

# Project Rules

## Tech Stack
Java 17 + Spring Boot 3 + MyBatis Plus + MySQL 8

## Code Standards
- Controller layer only handles parameter validation and routing
- Service layer handles business logic
- DAO layer only handles database operations
- Wrap all return values with Result<T>
- Use custom BusinessException for errors

## Naming Conventions
- Package names: all lowercase
- Class names: PascalCase
- Method names: camelCase
- Constants: UPPER_SNAKE_CASE
```

Steering uses the `inclusion` frontmatter field to control loading — four modes:
- `inclusion: always` — Loaded for every conversation (default)
- `inclusion: fileMatch` + `fileMatchPattern: "**/*.java"` — Loaded only when working with matching files (an array also works)
- `inclusion: manual` — Referenced on demand with `#file-name` (or via `/`) in chat
- `inclusion: auto` + `name` / `description` — The agent decides whether to load it based on the description

Global steering lives in `~/.kiro/steering/` and applies to every workspace.

### Spec-Driven Development

Kiro's workflow differs from other tools:

```
1. You describe the requirement
2. Kiro generates a Spec: requirements.md (bugfix.md for a Bugfix Spec) + design.md + tasks.md
3. You review and revise the Spec
4. Once confirmed, Kiro works through tasks.md task by task, with live progress
```

Specs come in several workflows: **Requirements-First** (requirements, then design), **Design-First** (settle the technical approach first), **Quick Spec** (requirements/design/tasks in one pass with no approval gates), and **Bugfix Spec** for systematically diagnosing and fixing bugs.

This is slower than "just write the code," but produces higher quality output. Especially good for:
- Team collaboration (Specs can be reviewed)
- Complex features (think it through before building)
- Projects that need documentation

---

## Prompting Tips

### 1. Making Specs More Precise

```
Add a refund feature to the order module.

Business rules:
- Refunds allowed within 7 days of payment
- Both partial and full refunds supported
- Refunds over $500 require approval
- Refund to the original payment method

Generate the Spec first. I'll confirm before you implement.
```

### 2. Leverage Hooks for Auto-Validation

Each hook file is a standalone JSON file under `.kiro/hooks/` (kebab-case name, e.g. `java-verify.json`):

```json
{
  "version": "v1",
  "hooks": [
    {
      "name": "Compile on save",
      "trigger": "PostFileSave",
      "matcher": "\\.java$",
      "action": { "type": "command", "command": "mvn compile -q" }
    },
    {
      "name": "Test on test save",
      "trigger": "PostFileSave",
      "matcher": "Test\\.java$",
      "action": { "type": "command", "command": "mvn test -q" }
    }
  ]
}
```

Auto-compiles whenever the agent saves a Java file, auto-runs tests when it saves a test file. Note: file triggers only respond to **changes made by the agent** — saving manually in the editor doesn't fire them. Besides `command`, `action.type` can be `agent` (inject a prompt to steer the agent).

Available triggers: Prompt Submit, Agent Stop, Session Start (IDE), Agent Spawn (CLI), Pre/Post Tool Use, File Create / Save / Delete, and Pre/Post Task Execution (around spec tasks). In JSON they're PascalCase, with file triggers prefixed by `Post` (e.g. `PostFileSave`) — see the [Hooks docs](https://kiro.dev/docs/hooks/) for exact names.

### 3. Organize Steering by Module

```
.kiro/steering/
├── always.md              # Global rules (inclusion: always)
├── api.md                 # API rules (fileMatch: src/controller/**)
├── database.md            # Database rules (fileMatch: src/mapper/**)
└── testing.md             # Testing rules (fileMatch: src/test/**)
```

---

## How It Differs from Other Tools

| Dimension | Kiro | Claude Code | Cursor |
|-----------|------|-------------|--------|
| Core philosophy | Spec first | Agent execution | IDE completion |
| Best for | Team collaboration, high-quality delivery | Individual high-velocity development | Daily coding |
| Rules system | Steering (four modes) + AGENTS.md | CLAUDE.md + Skills | Rules (globs) |
| Development flow | Requirements -> Spec -> Implementation -> Verification | Requirements -> Implementation -> Verification | Requirements -> Implementation |
| AWS integration | 3/3 | 1/3 | 1/3 |

---

## Configuration Templates

| Template | Purpose |
|----------|---------|
| [steering-always.md](templates/steering-always.md) | Steering global rules template (Java + Spring Boot), copy to `.kiro/steering/` |

---

## Further Reading

- [Kiro Official Docs](https://kiro.dev/docs)
- [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) — Skills methodology (also supports Kiro)
