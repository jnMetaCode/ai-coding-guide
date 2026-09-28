# GitHub Copilot 最佳实践

> GitHub Copilot 是 VS Code / JetBrains 内置的 AI 编程助手。它的核心优势是**无缝集成** — 不需要切换工具，在编辑器里自然地写代码就有补全和建议。Copilot Agent 模式让它从补全工具进化成了能独立完成任务的 Agent。
>
> 信息更新于 2026-09。

---

## 核心概念

| 概念 | 说明 | 用途 |
|------|------|------|
| **代码补全** | 行内灰色建议 | 日常编码，按 Tab 接受 |
| **Chat** | Chat 视图 `⌃⌘I` | 问答、解释代码 |
| **Agent 模式** | 自主完成多步骤任务（`⇧⌘I` 直接以 Agent 模式打开） | 复杂任务、跨文件修改 |
| **Copilot Instructions** | `.github/copilot-instructions.md` | 项目级配置 |
| **Instructions 文件** | `.github/instructions/*.instructions.md`，用 `applyTo` 按路径生效 | 按目录/文件类型细化规则 |
| **自定义 Agent** | `.github/agents/*.agent.md`（原 Chat Modes） | 安全审查、测试专家等 |
| **MCP Server** | `.vscode/mcp.json`，扩展 Copilot 的工具能力 | 连接数据库、API 等 |
| **#引用** | `#file` `#selection` `#terminal` `#codebase` | 精确指定上下文 |

---

## 快速上手

### Copilot Instructions — 项目配置

在项目根目录创建 `.github/copilot-instructions.md`：

```markdown
# 项目指引

## 技术栈
- Python 3.12 + FastAPI + SQLAlchemy 2.0
- 数据库：PostgreSQL
- 缓存：Redis
- 测试：pytest

## 代码规范
- 类型注解必须完整，使用 Python 3.10+ 语法
- async 函数统一加 `async_` 前缀
- 所有接口必须有 Pydantic 模型做入参校验
- 错误用自定义异常类，不要用裸 Exception

## 目录约定
- src/api/     — FastAPI 路由
- src/models/  — SQLAlchemy 模型
- src/schemas/ — Pydantic 模型
- src/services/ — 业务逻辑
- tests/       — 测试（镜像 src 结构）
```

### # 引用技巧

```
# 引用文件
#file:src/models/user.py 基于这个模型写一个用户注册接口

# 引用选中代码
#selection 这段代码有什么性能问题？

# 引用终端输出
#terminal 看看报错信息帮我修

# 引用 VS Code 问题面板
#problems 帮我修复这些类型错误

# 强制做一次代码库语义搜索
#codebase 项目里哪些地方在直接拼接 SQL？
```

---

## Agent 模式

Copilot Agent 是 2025 年最大的更新。从对话框输入任务，Agent 会：

1. 分析需求 → 2. 搜索相关文件 → 3. 制定计划 → 4. 逐步执行 → 5. 运行测试验证

### 使用 Agent 模式

在 Chat 中选择 Agent 模式（或按 `⇧⌘I` 直接进入）。Agent 会自己搜索代码库，不需要再加 `@workspace`：

```
给 src/api/ 下所有接口加上 rate limiting，
使用 Redis 做计数器，每个用户每分钟最多 60 次请求。
需要：
1. 一个可复用的 rate_limit 装饰器
2. Redis 连接配置
3. 超限时返回 429 状态码
4. 给每个接口加上测试
```

### Agent + MCP 扩展能力

通过 MCP Server 让 Agent 访问外部工具。在项目里创建 `.vscode/mcp.json`（顶层键是 `servers`）：

```json
{
  "servers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://..."]
    }
  }
}
```

然后你可以说：

```
查一下数据库里 users 表的结构，
然后根据实际字段生成 SQLAlchemy 模型和 Pydantic schema。
```

---

## 提示词技巧

### 1. 写好注释让补全更准

```python
# 补全质量取决于上下文。写一行注释，补全就知道你要什么：

# 计算两个日期之间的工作日天数，排除周末和中国法定节假日
def count_business_days(start: date, end: date) -> int:
    # Copilot 会自动补全完整实现
```

### 2. 用自定义 Agent 做专项审查

创建 `.github/agents/security-reviewer.agent.md`：

```markdown
---
name: 安全审查员
description: 按 OWASP Top 10 审查代码安全
---

你是一名安全审查专家。审查代码时：
1. 按 OWASP Top 10 逐项检查
2. 关注 SQL 注入、XSS、CSRF、权限绕过
3. 检查敏感数据是否明文存储或日志泄露
4. 标注风险等级：🔴 严重 / 🟡 中等 / 🟢 低
```

在 Chat 视图的 **Agent 下拉框**里选中它，或在输入框里输入 `/agents` 打开列表选择。

### 3. 让 Agent 全局搜索

```
项目里有没有硬编码的密钥或敏感信息？
帮我全部找出来，改成环境变量。
```

Agent 会自动搜索代码库；想强制做一次语义搜索时加上 `#codebase`。

---

## 进阶技巧

### 自定义指令与扩展文件

Copilot 支持这些文件来细化行为：

| 文件 | 作用 |
|------|------|
| `.github/copilot-instructions.md` | 全局项目指令 |
| `.github/instructions/*.instructions.md` | 用 frontmatter 的 `applyTo`（glob）按路径生效 |
| `AGENTS.md` / `CLAUDE.md` | 跨工具通用的指令文件，Copilot 也会读 |
| `.github/agents/*.agent.md` | 自定义 Agent（原 `.chatmode.md` 已弃用，改名为 `.agent.md` 即可迁移） |
| `.github/prompts/*.prompt.md` | 可复用的 Prompt，在 Chat 里用 `/名字` 调用 |
| `.github/skills/`、`.claude/skills/`、`.agents/skills/` | Agent Skills，Agent 按需加载 |
| Hooks | 在 Agent 动作前后跑脚本 |

`applyTo` 示例（`.github/instructions/python.instructions.md`）：

```markdown
---
applyTo: "**/*.py"
---

- 所有函数必须有类型注解
- 用 pytest，不用 unittest
```

如果你用 superpowers-zh，skill 文件放在 `.github/skills/`、`.claude/skills/` 或 `.agents/skills/` 下，Copilot Agent 会作为 Agent Skills 按需加载。

### VS Code 快捷键（macOS）

| 快捷键 | 功能 |
|--------|------|
| `Tab` | 接受补全 |
| `Esc` | 拒绝补全 |
| `⌃⌘I` | 打开 Chat 视图 |
| `⇧⌘I` | 以 Agent 模式打开 Chat |
| `⌘I` | 行内 Chat（编辑器内） |
| `Alt+]` / `Alt+[` | 切换不同补全建议 |

### 补全优化

让 Copilot 补全更准确的几个技巧：

1. **打开相关文件** — Copilot 会读取当前打开的 tab 作为上下文
2. **写好类型注解** — 类型越完整，补全越准
3. **函数签名先写好** — 先写好函数名、参数、返回类型，再让它补全函数体
4. **保持文件简短** — 大文件上下文噪音多，Copilot 容易跑偏

### 计费与套餐

2026-06-01 起 Copilot 改为按 **GitHub AI Credits** 计费：Chat、Agent 模式、代码审查、云端 Agent、Copilot CLI 等消耗 Credits；代码补全在付费套餐中不限量。

| 套餐 | 价格 | 每月包含 |
|------|------|---------|
| Free | $0 | 2,000 次补全 + 少量 Credits |
| Pro | $10/月 | 1,500 Credits |
| Pro+ | $39/月 | 7,000 Credits |
| Max | $100/月 | 20,000 Credits |
| Business | $19/席位/月 | 每人 1,900 Credits |
| Enterprise | $39/席位/月 | 每人 3,900 Credits |

以 [官方套餐说明](https://docs.github.com/en/copilot/get-started/plans) 为准。

### 2026 新增

- **Copilot coding agent 更名为 Copilot cloud agent**：在云端独立完成 Issue → PR
- **GitHub Copilot App**：桌面应用，2026-06-17 GA，所有套餐可用
- **Copilot CLI GA**：终端里的 Copilot Agent
- **Agent Plugins 1.0**：打包分发自定义 Agent、Skills 等扩展
- **Copilot 代码审查**：消耗 AI Credits + GitHub Actions 分钟数
- **JetBrains**：自定义 Agent、子 Agent、Plan Agent 于 2026 年 3 月 GA，并支持 AGENTS.md / CLAUDE.md

---

## 常见陷阱

| 陷阱 | 说明 | 解决 |
|------|------|------|
| 补全过时 API | Copilot 用了过期的库 API | 打开库的源码或文档作为 tab 上下文 |
| Agent 改错文件 | 多文件修改时动了不该动的 | 用 `#file` 限定范围 |
| 敏感文件被读 | IDE 里的 Agent 模式不支持内容排除（Content Exclusion），`.env` 等照样可能被读 | 敏感信息不落在项目目录；内容排除只能在仓库/组织/企业级配置，且对 Agent 模式无效 |
| Instructions 太长 | 重点被淹没，靠后的规则效果差 | 精简到关键规则，场景化规则拆到 `.instructions.md`（`applyTo`）或自定义 Agent |

👉 **深度展开版**：[Copilot 陷阱合集](../pitfalls/copilot.md) — 8 个真实踩坑场景（Agent 读 .env / MCP 失效 / 额度耗尽 等），每个带症状 / 根因 / 出坑 / 预防

---

## 配置模板

直接复制到你的项目里用：

| 模板 | 用途 |
|------|------|
| [copilot-instructions.md](templates/copilot-instructions.md) | 项目指引模板，复制到 `.github/copilot-instructions.md` |
| [security-reviewer.agent.md](templates/security-reviewer.agent.md) | 安全审查自定义 Agent，复制到 `.github/agents/` |

---

## 延伸阅读

- [Copilot 官方文档](https://docs.github.com/en/copilot)
- [VS Code Copilot 自定义文档](https://code.visualstudio.com/docs/copilot/customization/custom-agents) — 自定义 Agent、Instructions、MCP
- [awesome-copilot](https://github.com/github/awesome-copilot) — 官方资源集合（27k+ star）
- [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) — Skills 方法论（也支持 VS Code Copilot）
