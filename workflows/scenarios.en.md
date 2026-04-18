[简体中文](./scenarios.md) | **English**

# Real-World Scenarios: Dialogue Scripts

> Earlier pages cover "how to use" the tools. This page shows "a full run." Three end-to-end scripts for common scenarios — copy and adapt.
>
> Scripts use `pnpm` as an example. Swap it for your package manager (npm/yarn/bun).

---

## Scenario 1: Refactor a Complex Module with Claude Code

Goal: untangle a tightly-coupled payment module. Letting the AI do it in one shot usually drifts. Break it into three steps.

### Step 1: Survey the current state

```
Read everything under src/services/payment/ and do three things:
1. Draw the call graph (who calls what)
2. List current problems (duplication, cycles, missing tests, etc.)
3. Do NOT modify any code. Write output to docs/payment-analysis.md.

Do it now, then stop and wait for my confirmation.
```

### Step 2: Ask for a plan, not code

```
Based on that analysis, give me 2 refactor plans. For each:
- Core idea (one sentence)
- Scope (which files change, estimated LOC)
- 2-3 pros, 2-3 cons
- Risks

Do not start coding. Wait for me to pick one.
```

### Step 3: Execute the chosen plan, step by step

```
Execute plan 1 in four phases. Pause after each:

① Extract a shared PaymentGateway interface
② Convert WechatPay / AlipayPay into implementations
③ Add unit tests for each implementation (coverage > 80%)
④ Add end-to-end integration tests

Requirements:
- Run `pnpm test` after each phase to verify nothing broke
- Commit once per phase with a clear message
- Ask me before making non-obvious decisions
```

**The three gates** that keep the AI on rails: step 1 says "don't modify code," step 2 says "don't write code," step 3 says "pause after each phase."

---

## Scenario 2: Build a New Feature with Claude Code + Cursor

Goal: ship an order-export feature. Claude Code does design and scaffolding, Cursor fills in the implementation.

### Step 1: Claude Code — architecture design

```
Requirement: add an order export feature to the admin dashboard.
Must support CSV/Excel, filter by date range + order status,
and stream large exports (no OOM).

Analyze and write to docs/design/order-export.md:
1. DB query strategy (offset vs cursor pagination)
2. API design (routes, params, response shape)
3. Frontend UX (button location, progress feedback)
4. Key library choices (CSV lib, Excel lib)

Document only. No code.
```

### Step 2: Claude Code — generate scaffolding

```
Based on docs/design/order-export.md, generate skeletons:
- src/app/api/orders/export/route.ts
- src/services/order-export.service.ts
- src/components/order-export-dialog.tsx

Each file: signatures + TODO comments only, no implementation.
Type definitions should be complete so IDE autocomplete works in the next step.
```

### Step 3: Switch to Cursor — fill in the implementation

Open the skeletons in Cursor and use Composer file by file. Example prompt for `order-export.service.ts`:

```
@order-export.service.ts Implement each method per the TODOs.
@docs/design/order-export.md Follow the design doc.
Use cursor pagination, 1000 rows per batch, to avoid memory blowups.
```

### Step 4: Back to Claude Code — test and review

```
Cursor just finished the implementation. Now you review:

1. Run `pnpm typecheck` and `pnpm test`. Paste any errors and fix them.
2. Review against common/code-review.en.md using its five dimensions
   (security > correctness > performance > maintainability > tests).
3. Verify alignment with docs/design/order-export.md.
4. Finally, write the PR description: what changed and what's tested.
```

**Division principle**: architecture → Claude Code (broad reasoning), implementation → Cursor (fast in-IDE loop), final verification → Claude Code (systematic).

---

## Scenario 3: Backfilling Tests on a Legacy Project

Goal: an untested legacy codebase. Use AI to push coverage up fast.

### One prompt, full workflow

```
Backfill tests under src/services/ using this workflow:

Priority (do in order):
1. Core business: payment/, order/, auth/
2. External dependencies: database/, api-client/
3. Utilities: utils/, helpers/

Per-file process:
1. Read the code, list critical paths and edge cases (output a checklist)
2. Show me the checklist. I confirm before you write any tests.
3. Use Vitest. Put tests in __tests__/ or as *.test.ts
4. After each file, run `pnpm test` to confirm green
5. Commit per file. Message: which file's tests were added.

Quality bar:
- Target 80% coverage, not 100% (skip trivial getters/setters)
- Test behavior, not implementation (don't mock everything internal)
- Cover edge cases: empty, oversized, concurrent, malformed input

Start with src/services/payment/.
```

### When it goes off the rails

Interrupt phrases for common failure modes:

| Symptom | Interrupt phrase |
|---------|------------------|
| Tests are all mocks, no real logic verified | "Too many mocks. Switch to integration tests with an in-memory DB." |
| Over-testing — every single function | "Only test public APIs and critical paths. Don't test private methods in isolation." |
| Tests fail but AI keeps going | "Stop. Run `pnpm test`, paste failures, fix before continuing." |
| Too many files modified at once | "Stop. Get the current file's tests green before moving on." |

---

## Universal Interrupt Phrases

Keep these in your back pocket:

```
Stop. Before writing code, explain your understanding and plan.
I'll confirm before you proceed.
```

```
Discard this approach. Redesign using what you learned so far.
```

```
Change only this one file. Don't touch others. No new dependencies.
```

```
Run `pnpm test` and paste the failure output. Don't guess.
```

```
Give me 3 possible causes and how to investigate each.
I'll confirm before you change anything.
```
