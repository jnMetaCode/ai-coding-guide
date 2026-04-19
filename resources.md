# 延伸学习资源

> 本项目讲"9 款工具怎么用好"。要继续深入，这里是精选外部资源。**不求全，只求高质量**——每个条目都说清楚"什么情况值得看"。
>
> 信息截止：**2026-04**。链接失效请提 Issue。

---

## 🧭 快速导航

| 想解决什么 | 去哪看 |
|-----------|--------|
| 系统学 Prompt 工程 | [官方交互教程 / 吴恩达课 / DAIR 指南](#-prompt-工程) |
| 找工具的最佳实践集 | [awesome 列表系列](#%EF%B8%8F-工具专项-awesome-列表) |
| Claude Code 进阶 | [官方仓库 / Hooks / Cookbook](#-claude-code-进阶) |
| MCP 服务器生态 | [MCP 官方 + awesome-mcp-servers](#-mcp-生态) |
| 中文高质量参考 | [Datawhale / 黄峰达 / AutoDev](#-中文优秀资源) |
| 追新工具动态 | [博客 / 播客 / Newsletter](#-博客--播客--newsletter) |

---

## 📝 Prompt 工程

- [anthropics/prompt-eng-interactive-tutorial](https://github.com/anthropics/prompt-eng-interactive-tutorial) · ⭐ 高 · 英
  - Anthropic 官方 **9 章交互式 Prompt 教程**，可运行 Jupyter
  - 系统入门 Prompt 工程最快的路径，2-3 小时能跑完

- [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide) · ⭐ 60k+ · 英（有中文翻译）
  - Prompt 工程百科全书：CoT、ReAct、RAG、Tool-use 各种 pattern
  - 想深入原理、看各种技术名词对应什么场景时翻

- [datawhalechina/prompt-engineering-for-developers](https://github.com/datawhalechina/prompt-engineering-for-developers) · ⭐ 13k+ · 中
  - Datawhale 翻译的**吴恩达 Prompt 工程系列**+ 中文注解
  - 中文用户看视频 + 跟代码的最佳组合

- [phodal/prompt-patterns](https://github.com/phodal/prompt-patterns) · ⭐ 1k+ · 中
  - 国内知名架构师黄峰达写的 Prompt 模式与 DSL 设计指南
  - 写复杂 AI 编程工作流、设计可复用 Prompt 时的进阶参考

---

## 🛠️ 工具专项 Awesome 列表

- [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) · ⭐ 30k+ · 英
  - 社区收集的 `.cursorrules` 文件大全，按技术栈分类
  - 新项目起手抄一份对应技术栈的 rules

- [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) · ⭐ 高 · 英
  - Claude Code 社区最全资源：技巧、Skills、Hooks、工作流
  - Claude Code 进阶后想找社区最佳实践

- [github/awesome-copilot](https://github.com/github/awesome-copilot) · ⭐ 高 · 英
  - GitHub 官方维护的 Copilot 资源集合
  - 查 Copilot 的 instruction / Chat mode / Agent 示例

- [addyosmani/gemini-cli-tips](https://github.com/addyosmani/gemini-cli-tips) · ⭐ 中 · 英
  - Google 开发者 Addy Osmani 整理的 **30 个 Gemini CLI 技巧**
  - Gemini CLI 用户直接抄作业

- [detailobsessed/awesome-windsurf](https://github.com/detailobsessed/awesome-windsurf) · ⭐ 中 · 英
  - Windsurf 社区资源集合（规则、工作流、MCP）
  - 用 Windsurf Cascade 找社区模式

---

## 🤖 Claude Code 进阶

- [anthropics/claude-code](https://github.com/anthropics/claude-code) · 官方 · 英
  - **官方仓库**，Issues 和 Discussions 是新功能 / 新技巧的一手信息源
  - 追 Claude Code 新特性（slash command / hooks / skill 新能力）

- [anthropics/courses](https://github.com/anthropics/courses) · ⭐ 高 · 英
  - Anthropic 官方课程合集：Prompt、Tool use、RAG、MCP 全套
  - 想系统吃透 Anthropic 全家桶

- [anthropics/anthropic-cookbook](https://github.com/anthropics/anthropic-cookbook) · ⭐ 高 · 英
  - Claude API 实战示例：多模态、工具调用、RAG、Agent 模式
  - 用 Claude API 做定制化 AI 编程工具时的参考

- [disler/claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery) · ⭐ 中 · 英
  - Claude Code Hooks 深度实战
  - 做自动化 Hook 工作流（质量门禁、通知、检查）时直接抄

---

## 🔌 MCP 生态

- [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) · 官方 · 英
  - **MCP 官方服务器合集**：文件系统、数据库、Git、Slack 等
  - 给 Claude Code / Cursor 加外部能力时第一站

- [punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) · ⭐ 高 · 英
  - 社区维护的 MCP 服务器列表，更新频繁
  - 找第三方 MCP（浏览器、PostgreSQL、特定 API）

---

## 🏗️ Agent 工程化

- [humanlayer/12-factor-agents](https://github.com/humanlayer/12-factor-agents) · ⭐ 高 · 英
  - 构建**生产级 LLM Agent 的 12 条原则**，2025 工程化标杆
  - 从"玩票 Agent"进阶到"能上线的 Agent"必读

- [x1xhlol/system-prompts-and-models-of-ai-tools](https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools) · ⭐ 高 · 英
  - 整理的 Cursor、Windsurf、v0、Devin 等工具的**系统 Prompt**
  - 想逆向学习顶级 AI 编程工具怎么写 Prompt

- [openai/openai-cookbook](https://github.com/openai/openai-cookbook) · ⭐ 高 · 英
  - OpenAI 官方示例：工具调用、结构化输出、Agent 模式
  - 跨 LLM 参考，Copilot / Codex 用户交叉看

---

## 🇨🇳 中文优秀资源

- [datawhalechina/llm-cookbook](https://github.com/datawhalechina/llm-cookbook) · ⭐ 22k+ · 中
  - Datawhale 的 LLM 开发中文指南合集
  - 把 LLM 能力嵌入自己项目时的中文参考手册

- [liaokongVFX/LangChain-Chinese-Getting-Started-Guide](https://github.com/liaokongVFX/LangChain-Chinese-Getting-Started-Guide) · ⭐ 8k+ · 中
  - LangChain 中文入门指南：Agent / Chain / Memory
  - 自己造 AI 编程工具、Agent 型助手的基础

- [phodal/aigc](https://github.com/phodal/aigc) · ⭐ 1k+ · 中
  - 黄峰达《构筑大语言模型应用》电子书
  - AI 编程架构师视角，适合看工程化与团队落地

- [unit-mesh/auto-dev](https://github.com/unit-mesh/auto-dev) · ⭐ 3k+ · 中英
  - **国产 JetBrains AI 编程插件**，支持自定义 Agent + 中文 DevIns 脚本
  - IDEA/PyCharm 生态里的 AI 编程选择

---

## 📡 博客 / 播客 / Newsletter

- [Anthropic Engineering Blog](https://www.anthropic.com/engineering) · 英
  - Anthropic 官方工程博客，Claude Code 新特性和最佳实践首发
  - 每月更新，**必订**

- [Simon Willison's Weblog](https://simonwillison.net/) · 英
  - LLM 圈最勤奋独立博主，几乎每天更新 AI 工具实测
  - 追新工具发布和 CLI 级技巧

- [Latent Space](https://www.latent.space/) · 英
  - swyx 主持的 AI 工程播客 + newsletter
  - 采访 Cursor / Anthropic / GitHub 核心团队的第一手观点

- [宝玉的分享](https://baoyu.io/) · 中
  - 宝玉翻译整理的大量 AI 编程英文好文**中文版**
  - 不想读英文原文时的高质量中转站

---

## 📌 本项目与外部资源的关系

这个项目定位**"中文 AI 编程工具实战指南"**——覆盖 9 款工具的具体使用。外部资源是补充：

```
外部资源教原理和通用方法 → 本项目教具体工具怎么用
     ↓                           ↓
  Prompt 工程 / Agent 设计    Claude Code 66 技巧
  LLM 应用架构                Cursor 配置模板
  MCP 生态                    陷阱合集与实战脚本
```

不重复造轮子，有外部好资源就指过去。

---

## 贡献

发现好资源请提 PR 加到对应分类。**质量要求**：
- 仓库至少 500 star，或明确为官方/权威资源
- 持续更新（一次性博文不收录）
- 说清楚"什么场景值得看"，不能只有名字
- 不收录：付费课程、付费社群、个人微信号

详见 [CONTRIBUTING.md](./CONTRIBUTING.md)。
