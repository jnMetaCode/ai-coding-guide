# 多工具选型指南

> 不同的 AI 编程工具擅长不同的事。选对工具，效率翻倍；选错工具，事倍功半。

---

## 一张表选工具

| 场景 | 推荐工具 | 原因 |
|------|---------|------|
| **日常编码**（补全、小修改） | Cursor / Copilot | IDE 集成，按 Tab 就行 |
| **复杂重构**（跨文件、架构级） | Claude Code | Agent 能力最强，理解整个项目 |
| **新项目搭建** | Claude Code | 从零开始需要全局规划能力 |
| **Bug 调试** | Claude Code | 能看日志、跑命令、系统化分析 |
| **代码审查** | Claude Code / Cursor | Claude Code 更系统，Cursor 更快捷 |
| **学习新代码库** | Cursor + Chat | 选中代码问问题，交互最自然 |
| **写测试** | Claude Code | 能跑测试、看覆盖率、自动修复 |
| **文档/注释** | Copilot | 行内补全写注释最顺手 |
| **前端 UI 调整** | Cursor | 实时预览 + 可视化编辑 |
| **命令行/脚本** | Claude Code / Gemini CLI | CLI 原生，适合终端工作流 |
| **大代码库探索** | Gemini CLI | 上下文窗口最大（2M tokens） |
| **CI / 自动化代码审查** | Codex CLI | 官方 GitHub Action 内置受限沙箱代理 |
| **已订阅 ChatGPT Plus/Pro** | Codex CLI | 订阅自带额度，开箱即用，OS 内核级沙箱 |
| **完全离线 / 零 API 成本** | Codex CLI 或 Aider | `codex --oss --local-provider ollama` 走本地模型 |
| **企业级命令安全策略** | Codex CLI | Starlark DSL `prefix_rule()`，比 approval 更细粒度 |

---

## 工具能力对比

| 能力 | Claude Code | Codex CLI | Cursor | Copilot | Gemini CLI |
|------|:---:|:---:|:---:|:---:|:---:|
| 代码补全 | — | — | ★★★ | ★★★ | — |
| 对话式编程 | ★★★ | ★★★ | ★★☆ | ★★☆ | ★★★ |
| Agent 自主执行 | ★★★ | ★★★ | ★★☆ | ★★☆ | ★★☆ |
| 终端命令执行 | ★★★ | ★★★ | — | — | ★★★ |
| 多文件协调 | ★★★ | ★★☆ | ★★☆ | ★★☆ | ★★☆ |
| 项目规则配置 | ★★★ | ★★★ | ★★★ | ★★☆ | ★★☆ |
| 扩展能力（MCP） | ★★★ | ★★★ | ★★☆ | ★★☆ | ★★☆ |
| 沙箱级别 | App 层+Hook | **OS 内核** | — | — | — |
| 本地模型支持 | — | ★★★（--oss） | — | — | — |
| 上下文窗口 | ★★☆ | ★★☆ | ★★☆ | ★★☆ | ★★★ |
| IDE 集成 | — | — | ★★★ | ★★★ | — |
| 免费额度 | ★☆☆ | ★★☆（含 ChatGPT 订阅） | ★☆☆ | ★★☆ | ★★★ |

---

## 推荐组合

### 组合一：Claude Code + Cursor（最流行）

```
Claude Code → 架构设计、复杂重构、调试、测试
Cursor     → 日常编码、小修改、UI 调整、快速问答
```

适合：全栈开发者，前后端都写

### 组合二：Claude Code + Copilot（轻量）

```
Claude Code → Agent 任务（重构、生成、调试）
Copilot     → 行内补全、写注释、简单问答
```

适合：后端开发者，VS Code 用户

### 组合三：Gemini CLI + Cursor（预算友好）

```
Gemini CLI → 大规模分析、代码探索（免费）
Cursor     → 日常编码、交互式修改
```

适合：个人开发者，想控制成本

### 组合四：Codex CLI + Cursor（ChatGPT 订阅者）

```
Codex CLI → Agent 任务、CI 自动审查、内核沙箱执行
Cursor    → 日常编码、Tab 补全
```

适合：ChatGPT Plus/Pro 订阅者，想让订阅额度产生 Agent 价值；
特别适合需要内核级沙箱（Seatbelt / Landlock）的安全敏感场景。

### 组合五：Codex CLI + Claude Code（双 CLI）

```
Codex CLI    → 快速迭代、CI/脚本、token 效率高的小改动
Claude Code  → 跨 12 个文件的大重构、依赖图复杂的精修
```

适合：高强度全职开发，"keystrokes vs commits" 双管齐下；
社区共识：*Codex for keystrokes, Claude Code for commits.*

---

## 切换策略

什么时候从一个工具切到另一个：

| 信号 | 动作 |
|------|------|
| Cursor 补全改了 3 次还不对 | 切 Claude Code，让它系统分析 |
| Claude Code 对话太长开始变笨 | 开新对话，或切 Cursor 做剩余小任务 |
| 需要看实时效果 | 切 Cursor / Copilot（IDE 内预览） |
| 需要跑命令验证 | 切 Claude Code / Gemini CLI（终端内） |
| 需要理解大代码库 | 切 Gemini CLI（上下文最大） |
| 要在 CI 跑非交互 Agent | 切 Codex CLI（`codex exec --json` + 官方 Action） |
| 处理敏感数据 / 离线环境 | 切 Codex CLI（`--oss --local-provider ollama`） |
| 需要内核级沙箱保证 | 切 Codex CLI（Seatbelt / Landlock） |
