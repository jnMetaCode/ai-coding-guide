# Claude Code 最佳实践

> Claude Code 是 Anthropic 官方的 CLI AI 编程工具。它不只是一个代码补全工具，而是一个能理解整个项目、执行复杂任务的 Agent。

---

## 核心概念

在深入技巧之前，先搞清楚 Claude Code 的几个核心概念：

| 概念 | 说明 | 用途 |
|------|------|------|
| **Subagent** | 子进程 Agent，独立执行任务 | 并行处理、隔离上下文 |
| **Command** | `/` 开头的快捷命令 | 快速执行常用操作 |
| **Skill** | `.claude/skills/` 下的方法论文件 | 教 AI 怎么做事 |
| **Hook** | 工具调用前后的钩子脚本 | 自动化校验、通知 |
| **MCP Server** | Model Context Protocol 服务 | 扩展 AI 能力（数据库、API 等） |
| **Memory** | 持久化记忆 | 跨对话保留上下文 |
| **Checkpoint** | 自动保存点 | 安全回滚 |

---

## 快速上手

### 安装

```bash
# npm 全局安装
npm install -g @anthropic-ai/claude-code

# 或者直接用 npx
npx @anthropic-ai/claude-code
```

### 第一次使用

```bash
cd /your/project
claude
```

进入交互模式后，试试这几个命令：

```
# 了解项目
> 这个项目是做什么的？帮我梳理一下架构

# 做一个小任务
> 给 utils/string.ts 加一个 truncate 函数，超过指定长度截断并加省略号

# 做大任务（直接描述，Claude Code 会自动规划执行）
> 重构 src/api/ 下所有接口，统一错误处理格式
```

### CLAUDE.md — 项目配置文件

在项目根目录创建 `CLAUDE.md`，Claude Code 每次启动都会读取：

```markdown
# 项目说明
这是一个 Next.js 14 + TypeScript 的电商后台管理系统。

# 代码规范
- 使用 TypeScript strict mode
- 组件用 PascalCase 命名
- API 路由放在 src/app/api/ 下
- 测试用 Vitest，放在 __tests__/ 下

# 常用命令
- 启动开发：pnpm dev
- 跑测试：pnpm test
- 类型检查：pnpm typecheck
- Lint：pnpm lint

# 注意事项
- 不要修改 src/legacy/ 下的代码，那是旧版本兼容层
- 数据库 migration 必须通过 drizzle-kit 生成，不要手写 SQL
```

---

## 提示词技巧

### 1. 给足上下文，一次说清楚

```
❌ 差：加个登录功能
✅ 好：给 src/app/api/ 加一个 JWT 登录接口。用 bcrypt 验证密码，
    token 过期时间 7 天，错误返回统一的 { code, message } 格式。
    参考 src/app/api/register/route.ts 的风格。
```

### 2. 指定参考文件

```
参考 src/components/UserTable.tsx 的风格，
给 src/components/ 新建一个 OrderTable.tsx，
支持分页、排序、搜索，用 TanStack Table。
```

### 3. 先让它分析，再让它动手

```
先读 src/services/payment.ts 和 src/services/order.ts，
分析一下现在的支付流程有什么问题，
给出改进方案，确认后再改。
```

### 4. 限制范围

```
只改 src/utils/date.ts 这一个文件。
不要动其他文件，不要加新依赖。
```

### 5. 用否定句划红线

```
实现缓存功能。
不要用 Redis，用内存缓存。
不要引入新依赖，用 Map 实现。
不要修改现有接口的签名。
```

---

## 进阶技巧

### Agent 能力

Claude Code 本身就是 Agent——直接描述任务，它会自主规划和执行：

```
> 给整个项目加上单元测试，覆盖率目标 80%
```

Claude Code 会自己：读代码 → 制定计划 → 写测试 → 跑测试 → 修复失败 → 验证通过

> **提示**：不需要特殊命令或 flag。直接描述你想要的结果，Claude Code 会自动决定是否需要多步骤执行。

### Subagent 并行

大任务可以拆成多个 Subagent 并行执行：

```
同时做这三件事：
1. 给 src/api/users.ts 加分页参数
2. 给 src/api/orders.ts 加日期筛选
3. 给 src/api/products.ts 加搜索功能
用 subagent 并行执行，每个独立完成。
```

### Skill 文件

Skill 是最强大的功能之一。在 `.claude/skills/` 下放方法论文件，AI 会自动加载：

```
.claude/skills/
├── brainstorming.md      # 需求分析流程
├── debugging.md          # 调试方法论
├── code-review.md        # 代码审查规范
└── verification.md       # 完成前验证
```

**快速安装 superpowers-zh**（20 个经过实战验证的 skill）：

```bash
cd /your/project
npx superpowers-zh
# 自动检测项目类型，安装到 .claude/skills/
# 也支持 Cursor、Gemini CLI 等工具
```

安装后 Claude Code 会自动加载这些 skill，你可以用 `/` 命令调用，比如 `/brainstorming` 做需求分析、`/debugging` 做系统化调试。详见 [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh)。

**需要专业角色？** 用 [agency-agents-zh](https://github.com/jnMetaCode/agency-agents-zh) 的 277 个 AI 专家角色：

```bash
# 把角色文件复制到 .claude/skills/ 即可使用
# 比如数据库优化师、安全工程师、代码审查员等
```

在 CLAUDE.md 里引用角色：

```markdown
# 角色
当我说"用安全专家审查"时，按 .claude/skills/security-engineer.md 的角色行事。
```

### Hook 自动化

Hook 在工具调用前后自动执行脚本：

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

> Hook 的触发点有 `PreToolUse`、`PostToolUse`、`Notification` 等，每个触发点下用 `matcher` 匹配工具名。详见 [官方文档](https://docs.anthropic.com/en/docs/claude-code/hooks)。

用途：
- 每次修改文件后自动跑相关测试
- 每次提交前自动 lint
- 每次创建文件后自动加版权头

### Git Worktree 隔离开发

做实验性改动时，用 worktree 隔离，不影响主分支：

```
在 git worktree 里做这个重构。
如果效果好就合并，不好就丢弃。
```

### Memory 跨对话记忆

Claude Code 可以在 `~/.claude/` 下存储记忆，跨对话使用：

```
记住：这个项目的部署用的是 Vercel，
CI 用 GitHub Actions，数据库是 Supabase PostgreSQL。
以后做部署相关的任务都要考虑这些。
```

### 多智能体编排

当任务复杂到需要多个 AI 角色协作时（比如架构师设计 → 开发者实现 → 审查员审查），可以用 [agency-orchestrator](https://github.com/jnMetaCode/agency-orchestrator) 做 YAML 编排：

```yaml
# workflow.yaml
name: 新功能开发
steps:
  - agent: 软件架构师
    task: 分析需求，输出技术方案
    output: design.md

  - agent: 后端开发者
    task: 按 design.md 实现代码
    input: design.md

  - agent: 代码审查员
    task: 审查代码质量和安全性
```

适合场景：团队级复杂任务、需要多轮审查的交付、标准化开发流程。

---

## 调试技巧

### 1. 让它看日志，不要让它猜

```
❌ 差：测试挂了，帮我修
✅ 好：跑 pnpm test src/api/users.test.ts，
    把失败的测试输出贴出来，分析根因后再修。
```

### 2. 缩小范围

```
只看 src/services/auth.ts 第 45-80 行的逻辑，
用户反馈说"刷新 token 后还是提示过期"。
先分析可能的原因，不要直接改。
```

### 3. 对比分析

```
git log 看看 src/api/payment.ts 最近的改动，
对比改动前后的逻辑，找出哪次改动引入了这个 bug。
```

---

## 技巧速查表（60+）

按场景分类，一行一个技巧。收藏这一页就够了。

### 提示词（12）

| # | 技巧 | 说明 |
|---|------|------|
| 1 | 先分析再动手 | 让 Claude 先读代码、给方案，确认后再改。避免一上来就重写 |
| 2 | 推翻重来 | 不满意？说"扔掉这个方案，用你现在了解到的信息重新设计一个优雅的实现" |
| 3 | 考考我 | "帮我审查这个改动，问我问题，直到你确认我理解了再提 PR" |
| 4 | 限定范围 | "只改这一个文件，不要动其他文件，不要加新依赖" |
| 5 | 指定参考文件 | "参考 src/api/users.ts 的风格写 orders.ts"，比空描述好 10 倍 |
| 6 | 用否定句划红线 | "不要用 Redis，不要引入新依赖，不要改接口签名" |
| 7 | 给出 2-3 个方案让我选 | "给出 2 个方案，分析优缺点，我选了再做" |
| 8 | 分步确认 | "每步做完暂停等我确认，不要一口气做完" |
| 9 | 明确完成标准 | "完成标准：所有测试通过 + TypeScript 无报错 + lint 通过" |
| 10 | 用 ultrathink 深度思考 | 在提示词开头加"ultrathink"或"think really hard"触发扩展思考 |
| 11 | 让它写 commit message | "帮我写 commit message，描述这次改动的 why 而不是 what" |
| 12 | 英文提示词更精确 | 复杂技术任务用英文描述更精确，简单任务中文即可 |

### CLAUDE.md（10）

| # | 技巧 | 说明 |
|---|------|------|
| 1 | 控制在 200 行以内 | 太长 AI 会忽略后面的内容。大项目拆到 `.claude/rules/` |
| 2 | "跑测试"测试法 | 任何人打开 Claude Code 说"跑测试"就能成功 → CLAUDE.md 写够了 |
| 3 | settings.json 代替"不要" | "不要修改 x 文件"写在 CLAUDE.md 容易被忽略，权限控制更可靠 |
| 4 | 加 `<important>` 标签 | 关键规则用 `<important>` 包裹，模型会更重视 |
| 5 | 写常用命令 | dev、test、build、lint、deploy 命令都写上，AI 不用猜 |
| 6 | 写禁止事项 | 明确列出不能动的文件、不能用的方法、不能引入的依赖 |
| 7 | 写目录结构 | 关键目录说明，让 AI 知道代码在哪里 |
| 8 | 分层 CLAUDE.md | 根目录放全局规则，子目录放模块规则（如 `src/api/CLAUDE.md`） |
| 9 | 定期更新 | 项目演进了 CLAUDE.md 也要跟着更新，过时的规则比没有规则更糟 |
| 10 | 用 `.claude/rules/` 按条件加载 | 大项目用 globs 按文件类型加载规则，避免一次全塞进去 |

### Agent 与 Subagent（10）

| # | 技巧 | 说明 |
|---|------|------|
| 1 | 按功能拆 subagent | 创建"支付模块专用 agent"而不是泛泛的"后端工程师" |
| 2 | 对抗式测试 | 一个 agent 写代码，另一个（独立上下文）找 bug |
| 3 | Skill description 写给模型看 | 写"当用户要做 X 时触发"而不是人类摘要 |
| 4 | Skill 里加 gotchas | 把 Claude 犯过的错记在 skill 里，最高信噪比的内容 |
| 5 | `context: fork` 隔离 | Skill 在独立 subagent 跑，主上下文只看最终结果 |
| 6 | 不要让 agent 做太多事 | 一个 agent 一个明确任务，比一个 agent 做 5 件事成功率高 |
| 7 | agent 之间传文件而不是传消息 | 让 agent A 的输出写到文件，agent B 读文件。比口头传递可靠 |
| 8 | 用 worktree 做实验 | 让 subagent 在 git worktree 里做实验性改动，不满意就丢弃 |
| 9 | 用 MCP 扩展能力 | 连数据库、调 API、查文档 — MCP 让 agent 能做的事多 10 倍 |
| 10 | Custom command 做常用操作 | 把重复性高的操作封装成 `/command`，一键触发 |

### Hook（8）

| # | 技巧 | 说明 |
|---|------|------|
| 1 | PostToolUse 自动格式化 | Claude 写代码后自动跑 prettier/eslint --fix，避免格式问题 |
| 2 | PostToolUse 自动跑测试 | 每次修改文件后自动跑相关测试，及时发现问题 |
| 3 | PreToolUse 拦截危险操作 | 在 `Bash` 工具执行前检查命令，拦截 `rm -rf` 等危险操作 |
| 4 | Notification hook 发通知 | 长任务完成后自动发 Slack/钉钉通知 |
| 5 | Stop hook 强制验证 | 在每轮结束时提醒 Claude 检查自己的输出 |
| 6 | hook 里用 exit 1 阻止执行 | hook 脚本返回非 0 就会阻止工具调用，用于强制规则 |
| 7 | hook 输出作为上下文 | hook 的 stdout 会被 Claude 看到，可以传递额外信息 |
| 8 | 按工具名精确匹配 | matcher 支持 `Write\|Edit`、`Bash` 等，不要用 `*` 匹配所有 |

### 工作流（12）

| # | 技巧 | 说明 |
|---|------|------|
| 1 | 上下文 50% 时手动 `/compact` | 不要等自动压缩，主动压缩能保持 AI 质量 |
| 2 | Esc Esc 回退 checkpoint | 跑偏了用 checkpoint 回滚，不要在错误的上下文里继续修 |
| 3 | PR 保持小而聚焦 | 理想 PR 中位数约 120 行。大改动拆成多个 PR |
| 4 | 先合并迁移再做新功能 | 半迁移的代码库让 AI 选错模式。保持代码库干净 |
| 5 | 新对话做新任务 | 每个独立任务开新对话。旧对话的上下文污染会降低质量 |
| 6 | 用 plan mode 开始 | 复杂任务先进 plan mode（`/plan`），确认方案后再执行 |
| 7 | 多次快速迭代 > 一次完美 | 先出 MVP，跑通后再优化。不要一次提示就期望完美 |
| 8 | 让 Claude 自己跑测试 | 不要替它跑，让它自己跑、看输出、修复。这是 agent 的强项 |
| 9 | 用 `--resume` 继续上次对话 | 中断后用 `claude --resume` 恢复上下文继续工作 |
| 10 | 用 `--print` 做非交互任务 | CI/CD 里用 `claude --print "检查代码风格"` 做自动化 |
| 11 | headless 模式跑批量任务 | `claude -p "任务" --output-format json` 适合脚本调用 |
| 12 | 并行 worktree 提效 | 多个 worktree 跑多个 Claude 实例，并行处理不同模块 |

### Git 与 PR（8）

| # | 技巧 | 说明 |
|---|------|------|
| 1 | 让 Claude 写 PR 描述 | "读 git diff，写 PR 描述，说清楚改了什么、为什么改" |
| 2 | squash merge 保持历史干净 | AI 的中间 commit 很乱，squash 后只保留最终结果 |
| 3 | feature 分支隔离 | 每个任务一个分支，Claude 的改动不影响 main |
| 4 | 用 Claude 做 code review | "读这个 PR 的 diff，按安全性、性能、可维护性三个维度审查" |
| 5 | commit 前让它自查 | "提交前检查：有没有遗留的 console.log、TODO、硬编码？" |
| 6 | 不要 amend 上一个 commit | Claude 有时会 `--amend` 覆盖你之前的提交，明确说"新建 commit" |
| 7 | 用 git stash 保护现场 | 让 Claude 改东西前先 `git stash`，不满意就 `git stash pop` 恢复 |
| 8 | 让 Claude 解决合并冲突 | "看看冲突文件，按业务逻辑解决冲突，保留两边的有效改动" |

### 调试（10）

| # | 技巧 | 说明 |
|---|------|------|
| 1 | 让它跑命令看输出 | "跑 pnpm test 把失败的输出贴出来分析"比"测试挂了帮我修"好 10 倍 |
| 2 | 缩小范围再开问 | "只看 auth.ts 第 45-80 行"比"这个模块有 bug"好 |
| 3 | 用 git log 对比 | "看最近改动，对比改动前后，找哪次引入了 bug" |
| 4 | 先复现再修复 | "先写一个能复现这个 bug 的测试用例，再修复，确保测试从红变绿" |
| 5 | 二分法定位 | "用 git bisect 找到引入 bug 的 commit" |
| 6 | 看日志不要猜 | "查看 logs/error.log 最近 50 行，分析报错原因" |
| 7 | 加临时日志 | "在关键路径加 console.log 打印变量值，跑一次看输出" |
| 8 | 对比正常和异常 | "用户 A 正常、用户 B 异常，对比两个请求的差异" |
| 9 | 检查环境差异 | "本地能跑线上不行？对比环境变量、依赖版本、Node 版本" |
| 10 | 不要盲目修复 | "先给出 3 个可能的原因和排查方法，我确认后再改代码" |

### 性能与成本（6）

| # | 技巧 | 说明 |
|---|------|------|
| 1 | 简单任务用 haiku | `claude --model haiku` 做简单任务，便宜 10 倍 |
| 2 | 批量任务用 headless | 脚本批量调用比交互模式省 token |
| 3 | 精准的 CLAUDE.md 省 token | 上下文越精准，AI 需要读的文件越少，成本越低 |
| 4 | 避免反复读大文件 | 告诉 Claude 具体行号范围，不要每次都读整个文件 |
| 5 | 用 `/compact` 释放上下文 | 长对话及时压缩，减少每轮的 token 消耗 |
| 6 | 监控用量 | 定期检查 API 用量，设置预算上限避免超支 |

> 更多技巧参考 [claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice)。

---

## 常见陷阱

| 陷阱 | 说明 | 解决 |
|------|------|------|
| 上下文溢出 | 对话太长 AI 变笨 | 定期开新对话，用 CLAUDE.md 传递上下文 |
| 幻觉 API | AI 编造不存在的 API | 让它先查文档或 `grep` 确认 |
| 过度重构 | 你说修个 bug 它把整个文件重写了 | 明确说"只改这一处，不要重构" |
| 测试没跑 | AI 说"完成了"但没验证 | 用 verification skill 或 hook 强制验证 |
| 忽略错误处理 | 快速实现但没考虑异常 | 在提示词里明确要求错误处理 |

👉 **深度展开版**：[Claude Code 陷阱合集](../pitfalls/claude-code.md) — 8 个真实踩坑场景，每个带症状 / 根因 / 出坑 / 预防

---

## 配置模板

直接复制到你的项目里用：

| 模板 | 用途 |
|------|------|
| [CLAUDE.md](templates/CLAUDE.md) | 项目配置文件模板，复制到项目根目录后按需修改 |
| [settings.json](templates/settings.json) | 权限配置模板，复制到 `.claude/settings.json` |

---

## 延伸阅读

- [Claude Code 官方文档](https://docs.anthropic.com/en/docs/claude-code)
- [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) — 20 个 AI 编程 skills
- [agency-agents-zh](https://github.com/jnMetaCode/agency-agents-zh) — 277 个 AI 专家角色
