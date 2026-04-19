# AI 编程工具实战指南

**简体中文** | [English](./README.en.md)

> **9 款主流 AI 编程工具的中文最佳实践** — 不讲概念，只讲怎么用好。从提示词技巧到工作流设计，从单工具精通到多工具协作，帮你把 AI 编程效率拉满。

[![GitHub stars](https://img.shields.io/github/stars/jnMetaCode/ai-coding-guide?style=social)](https://github.com/jnMetaCode/ai-coding-guide)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)

<table>
<tr>
<td align="center"><strong>9 款工具</strong><br/>全覆盖教程</td>
<td align="center"><strong>66 个技巧</strong><br/>Claude Code 深度</td>
<td align="center"><strong>7 套方法论</strong><br/>提示词/调试/测试</td>
<td align="center"><strong>可复制模板</strong><br/>即装即用配置</td>
</tr>
</table>

---

## 🚀 快速开始

**先看一眼 [📋 速查表](cheatsheet.md)** — 9 款工具一页横向对比：类型、上下文、配置文件、常用命令。知道自己选哪个、怎么配、怎么用。

**按画像走推荐路径：**

| 你是... | 推荐顺序 |
|---------|---------|
| 纯新手，还没用过 AI 编程 | [速查表](cheatsheet.md) → [Trae](trae/)（免费入门）→ [提示词工程](common/prompting.md) |
| 前端 / 日常编码为主 | [Cursor](cursor/) → [提示词工程](common/prompting.md) → [实战场景](workflows/scenarios.md) |
| 后端 / 重构 / 大项目 | [Claude Code](claude-code/) → [需求拆解](common/task-decomposition.md) → [实战场景](workflows/scenarios.md) |
| 从 Copilot 迁来 | [Copilot](copilot/) → [Claude Code](claude-code/)（对比差异）→ [多工具选型](workflows/tool-selection.md) |
| 控成本 / 独立开发者 | [速查表](cheatsheet.md) → [Gemini CLI](gemini-cli/) 或 [Aider](aider/) + 本地模型 |
| 团队协作 / 高质量交付 | [Kiro](kiro/) → [代码审查](common/code-review.md) → [测试策略](common/testing.md) |

**已经在用了？** 直接看：[速查表](cheatsheet.md) · [进阶技巧](#-9-款工具教程) · [实战工作流](#-实战工作流) · [生态项目](#-相关项目)

---

## 🔧 9 款工具教程

| 工具 | 类型 | 亮点 |
|------|------|------|
| [**Claude Code**](claude-code/) | CLI Agent | 66 个技巧，Agent + Skill + Hook 完整工作流 |
| [**Cursor**](cursor/) | IDE | .cursorrules 配置，Composer Agent 模式 |
| [**GitHub Copilot**](copilot/) | IDE 插件 | 行内补全 + Agent 模式 + 自定义指令 |
| [**OpenClaw**](openclaw/) | AI Agent 框架 | 338k Stars，多平台连接 + Skills + Cron 自动化 |
| [Windsurf](windsurf/) | IDE | Cascade Agent，自动上下文 |
| [Gemini CLI](gemini-cli/) | CLI | Google 出品，大代码库分析 |
| [Kiro](kiro/) | IDE | AWS 出品，Spec 驱动开发 |
| [Aider](aider/) | CLI | Git 原生，支持几乎所有 LLM |
| [Trae](trae/) | IDE | 字节出品，免费 Claude/GPT，国内直连 |

> 每个工具都有：**核心概念 → 快速上手 → 提示词技巧 → 进阶用法 → 配置模板**

---

## 📚 通用方法论

不管用哪个工具，这些方法都能让你写出更好的提示词、设计更高效的工作流：

| 主题 | 解决什么问题 |
|------|-------------|
| [提示词工程](common/prompting.md) | AI 编程场景下的提示词技巧，不是通用 prompt engineering |
| [需求拆解](common/task-decomposition.md) | 把大任务拆成 AI 能一次做好的小任务 |
| [代码审查](common/code-review.md) | 让 AI 审查代码的最佳实践 |
| [调试方法论](common/debugging.md) | 用 AI 高效调试的系统方法 |
| [上下文管理](common/context-management.md) | 控制 AI 的上下文窗口，避免"变笨" |
| [测试策略](common/testing.md) | 用 AI 写测试的方法和注意事项 |
| [安全注意事项](common/security.md) | AI 编程中的安全风险和防护 |

---

## 🔗 实战工作流

真实项目怎么跑完整流程，以及不同工具怎么各展所长。

| 工作流 | 说明 |
|--------|------|
| [实战场景脚本](workflows/scenarios.md) | 重构 / 协作开发 / 补测试——3 个端到端对话脚本，复制改就能用 |
| [⚠️ 陷阱合集](pitfalls/) | Claude Code / Cursor / Copilot 各 8 个真实踩坑，症状 / 根因 / 出坑 / 预防 四段式 |
| [Claude Code + Cursor 协作](workflows/claude-code-cursor.md) | Claude Code 做架构设计和复杂重构，Cursor 做日常编码 |
| [Claude Code + Copilot 协作](workflows/claude-code-copilot.md) | Claude Code 做 Agent 任务，Copilot 做行内补全 |
| [多工具选型指南](workflows/tool-selection.md) | 什么场景用什么工具，一张表说清楚 |

---

## 🌐 相关项目

这几个项目相辅相成，覆盖 AI 编程的完整链路：

```
学会用工具 → 注入方法论 → 加载专家角色 → 多角色编排 → 安全防护
(guide)     (superpowers)  (agents)       (orchestrator) (shellward)
```

| 项目 | 定位 | 一句话 | 教程 |
|------|------|-------|------|
| **本项目**（ai-coding-guide） | 📖 实战教程 | 66 个 Claude Code 技巧 + 9 款工具最佳实践 | — |
| [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) | 🧠 工作方法论 | 20 个 skills 教 AI 怎么干活（TDD / 调试 / 代码审查等） | [安装与使用](ecosystem.md#1-superpowers-zh--给-ai-注入工作方法论) |
| [agency-agents-zh](https://github.com/jnMetaCode/agency-agents-zh) | 🎭 专家角色库 | 211 个 AI 专家，含 46 中国原创（小红书 / 抖音 / 飞书 / 钉钉） | [安装与使用](ecosystem.md#2-agency-agents-zh--211-个-ai-专家角色) |
| [agency-orchestrator](https://github.com/jnMetaCode/agency-orchestrator) | 🚀 编排引擎 | 一句话调度 211 专家协作，DAG 并行 + 9 家 LLM（6 免费） | [安装与使用](ecosystem.md#3-agency-orchestrator--多角色-yaml-编排) |
| [shellward](https://github.com/jnMetaCode/shellward) | 🛡️ 安全中间件 | 8 层防御 + DLP 数据流 + 注入检测 + MCP Server | [安装与使用](ecosystem.md#4-shellward--ai-agent-安全防护) |

👉 **[完整安装教程和组合使用指南 →](ecosystem.md)**

---

## 交流 · Community

微信公众号 **「AI不止语」**（微信搜索 `AI_BuZhiYu`）— 技术问答 · 项目更新 · 实战文章

| 渠道 | 加入方式 |
|------|---------|
| QQ 2群 | [点击加入](https://qm.qq.com/q/EeNQA9xCxy)（群号 1071280067） |
| 微信群 | 关注公众号后回复「群」获取入群方式 |

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

<div align="center">

**让 AI 编程工具真正为你所用**

[Star 本项目](https://github.com/jnMetaCode/ai-coding-guide) · [提交 Issue](https://github.com/jnMetaCode/ai-coding-guide/issues) · [贡献内容](https://github.com/jnMetaCode/ai-coding-guide/pulls)

</div>
