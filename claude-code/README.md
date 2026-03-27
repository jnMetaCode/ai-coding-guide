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

**需要专业角色？** 用 [agency-agents-zh](https://github.com/jnMetaCode/agency-agents-zh) 的 187 个 AI 专家角色：

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

## 技巧速查表

按场景分类，一行一个技巧。

### 提示词

| 技巧 | 说明 |
|------|------|
| "先分析再动手" | 让 Claude 先读代码、给方案，确认后再改。避免一上来就重写 |
| "推翻重来" | 如果第一次实现不满意，说"扔掉这个方案，用你现在了解到的信息重新设计一个优雅的实现" |
| "考考我" | 说"帮我审查这个改动，问我问题，直到你确认我理解了再提 PR" |
| 限定范围 | "只改这一个文件，不要动其他文件，不要加新依赖" |

### CLAUDE.md

| 技巧 | 说明 |
|------|------|
| 控制在 200 行以内 | 太长 AI 会忽略后面的内容。大项目拆到 `.claude/rules/` |
| "跑测试"测试法 | 任何人打开 Claude Code 说"跑测试"就能成功 → 说明你的 CLAUDE.md 写够了 |
| 用 settings.json 代替"不要" | "不要修改 x 文件"写在 CLAUDE.md 容易被忽略，用 settings.json 的权限控制更可靠 |
| 加 `<important>` 标签 | 关键规则用 `<important>` 包裹，模型会更重视 |

### Agent 与 Subagent

| 技巧 | 说明 |
|------|------|
| 按功能拆 subagent | 创建"支付模块专用 agent"而不是泛泛的"后端工程师" |
| 对抗式测试 | 一个 agent 写代码，另一个 agent（独立上下文）找 bug。同一个模型，分开上下文就能找到问题 |
| Skill 的 description 写给模型看 | description 决定模型何时自动触发，写"当用户要做 X 时触发"而不是人类摘要 |
| Skill 里加 gotchas 章节 | 把 Claude 犯过的错记在 skill 里，这是最高信噪比的内容 |

### 工作流

| 技巧 | 说明 |
|------|------|
| 上下文 50% 时手动 `/compact` | 不要等自动压缩，主动压缩能保持 AI 质量 |
| 跑偏了按 Esc Esc 回退 | 用 checkpoint 回滚到上一步，而不是在错误的上下文里继续修 |
| PR 保持小而聚焦 | 理想 PR 中位数约 120 行。大改动拆成多个 PR |
| 先合并迁移再做新功能 | 半迁移的代码库会让 AI 选错模式。保持代码库干净 |
| PostToolUse hook 自动格式化 | 让 Claude 专注逻辑，格式化交给 hook，避免 CI 失败 |

### 调试

| 技巧 | 说明 |
|------|------|
| 让它跑命令看输出 | "跑 pnpm test 把失败的输出贴出来分析"比"测试挂了帮我修"好 10 倍 |
| 缩小范围再开问 | "只看 auth.ts 第 45-80 行"比"这个模块有 bug"好 |
| 用 git log 对比 | "看最近改动，对比改动前后，找哪次引入了 bug" |

> 更多技巧参考 [claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice)（22k+ star）。

---

## 常见陷阱

| 陷阱 | 说明 | 解决 |
|------|------|------|
| 上下文溢出 | 对话太长 AI 变笨 | 定期开新对话，用 CLAUDE.md 传递上下文 |
| 幻觉 API | AI 编造不存在的 API | 让它先查文档或 `grep` 确认 |
| 过度重构 | 你说修个 bug 它把整个文件重写了 | 明确说"只改这一处，不要重构" |
| 测试没跑 | AI 说"完成了"但没验证 | 用 verification skill 或 hook 强制验证 |
| 忽略错误处理 | 快速实现但没考虑异常 | 在提示词里明确要求错误处理 |

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
- [agency-agents-zh](https://github.com/jnMetaCode/agency-agents-zh) — 187 个 AI 专家角色
