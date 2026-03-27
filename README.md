# AI 编程工具实战指南

> **8 款主流 AI 编程工具的中文最佳实践** — 不讲概念，只讲怎么用好。从提示词技巧到工作流设计，从单工具精通到多工具协作，帮你把 AI 编程效率拉满。

[![GitHub stars](https://img.shields.io/github/stars/jnMetaCode/ai-coding-guide?style=social)](https://github.com/jnMetaCode/ai-coding-guide)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)

## 目录

- [为什么需要这个指南？](#为什么需要这个指南)
- [覆盖工具](#覆盖工具)
- [通用技巧](#通用技巧)
- [多工具协作工作流](#多工具协作工作流)
- [快速开始](#快速开始)
- [贡献](#贡献)
- [相关项目](#相关项目)
- [项目生态教程](ecosystem.md) — 四个项目的安装和组合使用

---

## 为什么需要这个指南？

AI 编程工具的模型能力已经很强了，但大多数人只用到了 10% 的功能。

- 你可能只会在 Cursor 里按 Tab 接受补全，不知道 `.cursorrules` 能让它理解你的整个项目
- 你可能让 Claude Code 帮你写代码，但不知道用 Agent + Skill + Hook 能让它自动执行完整工作流
- 你可能同时装了好几个工具，但不知道它们可以协作——Claude Code 做架构，Cursor 做实现，Copilot 做补全

**这个指南就是帮你从"能用"到"用好"。**

---

## 覆盖工具

| 工具 | 类型 | 指南状态 |
|------|------|:---:|
| [Claude Code](claude-code/) | CLI Agent | ✅ |
| [Cursor](cursor/) | IDE | ✅ |
| [GitHub Copilot](copilot/) | IDE 插件 | ✅ |
| [Windsurf](windsurf/) | IDE | ✅ |
| [Gemini CLI](gemini-cli/) | CLI | ✅ |
| [Kiro](kiro/) | IDE | ✅ |
| [Aider](aider/) | CLI | ✅ |
| [Trae](trae/) | IDE | ✅ |

---

## 通用技巧

不管你用哪个工具，这些通用方法论都能帮你写出更好的提示词、设计更好的工作流。

| 主题 | 说明 |
|------|------|
| [提示词工程](common/prompting.md) | AI 编程场景下的提示词技巧，不是通用 prompt engineering |
| [需求拆解](common/task-decomposition.md) | 把大任务拆成 AI 能一次做好的小任务 |
| [代码审查](common/code-review.md) | 让 AI 审查代码的最佳实践 |
| [调试方法论](common/debugging.md) | 用 AI 高效调试的系统方法 |
| [上下文管理](common/context-management.md) | 控制 AI 的上下文窗口，避免"变笨" |
| [测试策略](common/testing.md) | 用 AI 写测试的方法和注意事项 |
| [安全注意事项](common/security.md) | AI 编程中的安全风险和防护 |

---

## 多工具协作工作流

真正高效的做法不是只用一个工具，而是让不同工具发挥各自的长处。

| 工作流 | 说明 |
|--------|------|
| [Claude Code + Cursor 协作](workflows/claude-code-cursor.md) | Claude Code 做架构设计和复杂重构，Cursor 做日常编码 |
| [Claude Code + Copilot 协作](workflows/claude-code-copilot.md) | Claude Code 做 Agent 任务，Copilot 做行内补全 |
| [多工具选型指南](workflows/tool-selection.md) | 什么场景用什么工具，一张表说清楚 |

---

## 快速开始

**第一次用 AI 编程工具？** 从这里开始：

1. 读 [提示词工程](common/prompting.md) — 了解怎么和 AI 说话
2. 选一个你用的工具，读对应指南的"快速上手"章节
3. 读 [需求拆解](common/task-decomposition.md) — 学会给 AI 分配任务
4. 读 [上下文管理](common/context-management.md) — 让 AI 保持"聪明"

**已经用了一段时间？** 直接看：

1. 你用的工具的"进阶技巧"章节
2. [多工具协作工作流](workflows/) — 组合使用效率翻倍
3. [相关项目](#相关项目) — 方法论、专家角色、多角色编排

---

## 贡献

欢迎参与！详见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

简单来说：补技巧、修过时内容、分享协作经验，提 Issue 或 PR 都可以。

---

## 致谢

本指南参考了以下优秀的开源项目：

- [claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) — Claude Code 最佳实践
- [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) — Cursor 规则集合
- [awesome-copilot](https://github.com/github/awesome-copilot) — GitHub Copilot 官方资源
- [gemini-cli-tips](https://github.com/addyosmani/gemini-cli-tips) — Gemini CLI 技巧
- [Everything Claude Code](https://github.com/anthropics/everything-claude-code) — 本能评分、AgentShield、多语言规则
- [BMAD-METHOD](https://github.com/bmadcode/BMAD-METHOD) — 完整 SDLC、Agent 角色、多平台

---

## 相关项目

这几个项目相辅相成，覆盖 AI 编程的完整链路：

```
学会用工具 → 注入方法论 → 加载专家角色 → 多角色编排 → 安全防护
(guide)     (superpowers)  (agents)       (orchestrator) (shellward)
```

| 项目 | 定位 | 说明 |
|------|------|------|
| **本项目** | 📖 教学 | 8 款工具怎么用好，从入门到进阶 |
| [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) | 🧠 方法论 | 20 个 skills，让 AI 学会怎么思考和做事（TDD、调试、代码审查等） |
| [agency-agents-zh](https://github.com/jnMetaCode/agency-agents-zh) | 👤 专家角色 | 187 个专业角色，让 AI 变成安全工程师、DBA、产品经理等 |
| [agency-orchestrator](https://github.com/jnMetaCode/agency-orchestrator) | 🔗 编排 | 用 YAML 让多个角色协作完成复杂任务 |
| [shellward](https://github.com/jnMetaCode/shellward) | 🛡️ 安全 | 防止 AI Agent 执行危险命令、泄露敏感数据 |

👉 **[完整安装教程和组合使用指南 →](ecosystem.md)**

---

<div align="center">

**让 AI 编程工具真正为你所用**

[Star 本项目](https://github.com/jnMetaCode/ai-coding-guide) · [提交 Issue](https://github.com/jnMetaCode/ai-coding-guide/issues) · [贡献内容](https://github.com/jnMetaCode/ai-coding-guide/pulls)

</div>
