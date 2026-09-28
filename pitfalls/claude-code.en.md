[简体中文](./claude-code.md) | **English**

# Claude Code Pitfalls

> The "Common Pitfalls" table in the main README is a quick reference. This page goes deeper: every pitfall has **Symptom → Cause → Recovery → Prevention**. You'll hit these.
>
> Found a new one? Open an Issue or PR.

---

## Pitfall 1: Context Overflow — The AI Starts Making Things Up

**Symptom**
- Late in a conversation, the AI invents details that were never discussed
- Constraints you stated earlier are forgotten
- Responses get shorter and vaguer, ending mid-thought

**Cause**
Claude has a context window limit. As conversation + tool calls approach it, auto-compaction kicks in: earlier conversation is **summarized**, and details or constraints stated only in chat can get lost in the summary (the root `CLAUDE.md` is re-read after compaction, so it survives). It won't tell you. It pretends to remember, by confabulating.

**Recovery**
```
/context              # Inspect context usage
/compact              # Compress context, keep key decisions
```
Or just **start a new session** and pass important info through `CLAUDE.md`.

**Prevention**
- `/compact` at 50%, not 80%
- One conversation per task. Close it when done, open fresh for next.
- Don't rely on conversation memory for critical decisions — write them to `CLAUDE.md` or `docs/`.

---

## Pitfall 2: Hallucinated APIs — It Invents a Function That Doesn't Exist

**Symptom**
- AI writes `someLib.fancyMethod()` — but that method doesn't exist
- References non-existent config keys, non-existent CLI flags
- Code looks plausible, crashes with `TypeError: x is not a function`

**Cause**
LLM training data may have had an older version of the API, or never did. When unsure, it generates what "should" exist. No grep, no docs → confabulation.

**Recovery**
- Force verification: `First grep for this method and confirm it exists before using it.`
- Run it, paste the error: `Here's the runtime error. Check the library's latest docs.`

**Prevention**
Add to `CLAUDE.md`:

```markdown
## Coding discipline
- Before using any third-party API, Read the type definitions or source
  under node_modules/ to confirm it exists
- Don't guess unknown APIs — check docs or ask me
```

---

## Pitfall 3: Over-Refactoring — You Ask for One Line, It Changes Hundreds

**Symptom**
- You ask: "add a parameter to this function"
- It rewrites the whole file
- Along the way: renames variables, adds comments, reformats, changes error handling style
- The diff looks like a full-file rewrite; your actual ask is buried in the middle

**Cause**
Claude defaults to "make it better." It treats quality improvements as a bonus. Without explicit boundaries, it will polish everything it sees.

**Recovery**
After the fact, diff is a mess:

```
Revert all non-essential changes. Keep only [the specific change I asked for].
Formatting, renames, added comments — all reverted.
```

**Prevention**
Be explicit in the prompt:

```
Change only the createUser function in userService.ts.
Don't rename, don't add comments, don't reformat, don't touch other files.
If you see other issues, tell me — don't fix them.
```

Add `<important>` tags to protect critical files:

```markdown
<important>
Do not auto-refactor code under src/legacy/. That's a compatibility shim.
</important>
```

---

## Pitfall 4: Fake Verification — "Tests Passed" But It Didn't Run Them

**Symptom**
- AI says "all tests pass ✅"
- You run `pnpm test` — red everywhere
- Or: it ran some tests but not the failing ones, and claims success based on the partial run

**Cause**
Claude sometimes **infers** tests should pass from reading the code, instead of actually running them. Or it runs partial tests and doesn't parse the full output.

**Recovery**
- Interrupt with a hard negative: "Don't infer. Run `pnpm test` and paste the **full output**."
- Demand verifiable artifacts: "After running, paste me the coverage report."

**Prevention**
Enforce with a Hook:

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{ "type": "command", "command": "pnpm test --run --reporter=basic" }]
    }]
  }
}
```

Or install superpowers-zh's `verification` skill — it blocks "done" claims without real test runs.

---

## Pitfall 5: CLAUDE.md Ignored — Rules Written, Rules Not Followed

**Symptom**
- `CLAUDE.md` clearly says "use pnpm, not npm" — it runs `npm install` anyway
- Says "tests go in `__tests__/`" — it writes them next to source anyway

**Cause**
When `CLAUDE.md` exceeds ~200 lines, trailing rules get "marginalized." Claude auto-summarizes long docs, losing detail. Another common cause: rules phrased as suggestions, not requirements.

**Recovery**
```
# In the current session
From now on, strictly follow CLAUDE.md section X.
The key rules are: [restate them yourself].
```

**Prevention**
- Keep `CLAUDE.md` under 200 lines
- For large projects, split into `.claude/rules/` with `paths:` frontmatter for path-based loading
- Mark critical rules with `<important>`
- Use "must / forbidden" instead of "should / try to":

```markdown
## Forbidden
- ❌ Never use npm — this project uses pnpm
- ❌ Never put tests next to source — must go in __tests__/
```

---

## Pitfall 6: `git --amend` Eats Your Uncommitted Work

**Symptom**
- You ask Claude "tweak the last commit"
- It runs `git commit --amend`
- Stuff you had staged but not yet committed gets folded in — or silently lost

**Cause**
`--amend` folds all currently-staged content into the previous commit. Claude doesn't know what else is in your staging area.

**Recovery**
```bash
git reflog                    # Find the pre-amend commit
git reset --hard HEAD@{N}     # Roll back (N is the reflog index)
```

**Prevention**
- Don't let Claude use `--amend` — explicitly say "create a new commit, don't amend"
- Lock it down in `.claude/settings.json`:

```json
{
  "permissions": {
    "deny": ["Bash(git commit --amend*)"]
  }
}
```

---

## Pitfall 7: Plan Mode Writes a Good Plan, Execution Drifts

**Symptom**
- `/plan` produces a clean, well-structured plan
- You approve, execution starts — first two steps are fine
- Step 3 onwards it "improvises" away from the plan

**Cause**
Plan mode gives you a **starting point**, not a locked script. Claude adapts during execution; sometimes it adapts too far. Especially when a step fails, it tends to "try a different approach" instead of stopping to ask.

**Recovery**
```
Stop. Compare what you're doing now to step N of the original plan.
Does it match? If it drifts, explain why. I'll decide whether to
keep drifting or return to the plan.
```

**Prevention**
- Make the plan atomic: each step verifiable, not "step 3: refactor the login flow"
- Require pauses at key checkpoints:

```
Execute the plan. After each step:
1. Run the relevant tests
2. Summarize the change in one sentence
3. Pause and wait for my OK before the next step
```

---

## Pitfall 8: Subagent Context Mismatch

**Symptom**
- Main agent asks subagent A to write code, subagent B to run tests
- B reports "tests failed, file not found"
- But A "wrote" the file — except A's "write" was just returned text, never persisted to disk

**Cause**
Subagents don't share a live filesystem view. If the main agent doesn't persist A's output before handing off to B, A "knows" the file exists in its context but disk may not.

**Recovery**
```
Stop. Let me verify state.
Run: ls -la src/newfile.ts && cat src/newfile.ts
Confirm the file exists before proceeding.
```

**Prevention**
- **Pass results between agents via files, not messages**
- Main agent orchestrates: "A, write the code **to disk**, then tell me the path. B, read that path and run tests."
- Beyond 2 subagents, consider sequential main-agent execution — reliability beats parallelism.

---

## Found a new pitfall?

Real pain is the best content. PRs welcome. Template:

```markdown
## Pitfall N: One-line title

**Symptom**
What you actually saw (be specific)

**Cause**
Why it happens (in your own words)

**Recovery**
How to climb out if you're already stuck

**Prevention**
How to avoid next time (prompt / config / Hook / Skill)
```

---

## Related Methodologies

- [common/debugging.en.md](../common/debugging.en.md) — Systematic debugging methodology
- [common/context-management.en.md](../common/context-management.en.md) — Managing the context window
- [workflows/scenarios.en.md](../workflows/scenarios.en.md) — Real-world dialogue scripts with interrupt phrases
