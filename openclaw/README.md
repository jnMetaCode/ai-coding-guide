# OpenClaw 最佳实践

> OpenClaw 是一个开源的 AI 个人助手框架（33 万+ GitHub Stars），核心特色是 **本地运行 + 多平台连接 + 自主执行任务**。它不只是聊天机器人，而是能浏览网页、读写文件、执行命令、调度定时任务的 AI Agent。支持 Claude、GPT、DeepSeek、本地模型等多种 LLM。

---

## 核心概念

| 概念 | 说明 | 用途 |
|------|------|------|
| **Gateway** | 后台常驻的 WebSocket 网关 | 路由消息、管理 Agent |
| **Channel** | 消息平台连接 | 接入 WeChat、Telegram、Slack、Discord 等 |
| **Skill** | `SKILL.md` 定义的能力模块 | 教 AI 怎么做事（类似 Claude Code 的 Skills） |
| **Agent** | 独立的 AI 工作空间 | 不同任务用不同 Agent |
| **Cron** | 定时任务调度 | 自动化周期性工作 |
| **Tool** | 内置工具（浏览器、文件、Shell） | 让 AI 有"手"去执行操作 |

---

## 快速上手

### 安装

```bash
# macOS / Linux / WSL2（推荐）
curl -fsSL https://openclaw.ai/install.sh | bash

# 或用 npm
npm install -g openclaw@latest
openclaw onboard --install-daemon

# 验证安装
openclaw --version
openclaw doctor
```

系统要求：Node.js 22.14+（推荐 24）

### 初始化

```bash
# 交互式引导（设置模型、频道等）
openclaw onboard

# 查看网关状态
openclaw gateway status

# 启动网关
openclaw gateway start
```

### 配置文件

配置文件位于 `~/.openclaw/openclaw.json`（JSON5 格式，支持注释）：

```json5
{
  // 模型设置
  "models": {
    "default": "claude-sonnet-4-20250514",
    // 也可以用 DeepSeek 省钱
    // "default": "deepseek/deepseek-chat",
  },

  // 频道（按需开启）
  "channels": {
    "telegram": { "enabled": true },
    "webchat": { "enabled": true },
  },
}
```

修改后自动热加载，不需要重启。

---

## 提示词技巧

### 1. Skills — 教 AI 新能力

OpenClaw 的 Skills 和 Claude Code 的 Skills 类似，用 Markdown 定义：

```markdown
---
name: code-reviewer
description: 审查代码质量，找出安全漏洞和性能问题
user-invocable: true
---

# 代码审查

你是一个资深代码审查员。当用户让你审查代码时：

1. 先通读整个文件，理解上下文
2. 检查安全问题（注入、XSS、敏感数据泄露）
3. 检查性能问题（N+1 查询、内存泄漏）
4. 检查代码规范（命名、结构、注释）
5. 给出具体修改建议，附带代码示例
```

Skills 的三个加载位置（优先级从高到低）：

```
项目目录/skills/     → 项目级（最高优先级）
~/.openclaw/skills/  → 全局级
内置 skills/         → 默认（最低优先级）
```

安装社区 Skill：

```bash
# 从 ClawHub 安装
openclaw skills install <skill-slug>

# 查看已安装的 Skills
openclaw skills list
```

### 2. 多模型策略

```bash
# 查看可用模型
openclaw models list

# 设置默认模型
openclaw models set default claude-sonnet-4-20250514

# 复杂任务用 Claude
openclaw models set default claude-sonnet-4-20250514

# 日常对话用 DeepSeek（便宜）
openclaw models set default deepseek/deepseek-chat

# 完全免费用本地模型
openclaw models set default ollama/qwen2.5-coder
```

### 3. 自动化任务

OpenClaw 支持 Cron 定时任务，适合自动化：

```bash
# 每天早上 9 点发送代码库健康报告
openclaw cron add "0 9 * * *" "检查项目代码质量，生成报告发送给我"

# 每周一早上发送周报摘要
openclaw cron add "0 9 * * 1" "汇总上周的 Git 提交和 PR，生成周报"

# 查看所有定时任务
openclaw cron list
```

### 4. 多频道协作

OpenClaw 的独特优势是连接多个消息平台：

```bash
# 添加频道
openclaw channels add telegram
openclaw channels add webchat

# 查看频道状态
openclaw channels status
```

应用场景：
- **Telegram** — 随时随地发消息让 AI 执行任务
- **WebChat** — 浏览器界面做复杂交互
- **Slack/飞书** — 团队协作，AI 作为团队成员

---

## 进阶技巧

### Agent 工作空间

不同项目用不同 Agent，隔离上下文：

```bash
# 创建新 Agent
openclaw agents add my-project

# 查看所有 Agent
openclaw agents list

# 删除不需要的 Agent
openclaw agents delete old-project
```

### 常用 CLI 命令速查

| 命令 | 用途 |
|------|------|
| `openclaw onboard` | 交互式初始化 |
| `openclaw gateway start/stop/status` | 管理网关 |
| `openclaw channels add/remove/status` | 管理消息频道 |
| `openclaw models list/set` | 管理模型 |
| `openclaw skills list/install` | 管理 Skills |
| `openclaw cron add/list` | 定时任务 |
| `openclaw agents list/add/delete` | 管理 Agent 工作空间 |
| `openclaw doctor` | 健康检查和诊断 |
| `openclaw logs` | 查看网关日志 |

### 调试和排查

```bash
# 健康检查（最有用的排查命令）
openclaw doctor

# 查看实时日志
openclaw logs

# 开发模式（更多调试信息）
openclaw gateway --dev
```

---

## 与其他工具的区别

| 维度 | OpenClaw | Claude Code | Cursor |
|------|----------|-------------|--------|
| 类型 | AI Agent 框架 | CLI 编程助手 | AI IDE |
| 核心场景 | 多平台自动化 | 代码编写和重构 | 日常编码 |
| 运行方式 | 后台常驻（Gateway） | 按需启动 | IDE 内嵌 |
| 消息平台 | 20+ 平台 | 仅终端 | 仅 IDE |
| 模型支持 | Claude/GPT/DeepSeek/本地 | 仅 Claude | 多模型 |
| Skills | SKILL.md | .claude/skills/ | Rules |
| 定时任务 | ✅ 内置 Cron | ❌ | ❌ |
| 开源 | ✅（MIT） | ❌ | ❌ |
| 适合 | 自动化、多平台、全能助手 | 专业编程 | 日常编码 |

**OpenClaw vs Claude Code**：不是替代关系，而是互补。Claude Code 专注编程，OpenClaw 专注自动化和多平台连接。可以同时使用。

---

## 常见陷阱

| 陷阱 | 说明 | 解决 |
|------|------|------|
| Node 版本不够 | 需要 22.14+ | `nvm install 24` |
| Gateway 启动失败 | 端口被占用或配置错误 | `openclaw doctor` 诊断 |
| Skill 不生效 | 路径或格式不对 | 检查 `SKILL.md` frontmatter 的 name 和 description |
| 模型 API 报错 | Key 未设置或余额不足 | `openclaw models status` 检查 |
| 频道连接断开 | 网络或认证问题 | `openclaw channels status` + `openclaw channels reconnect` |

---

## 配置模板

| 模板 | 用途 |
|------|------|
| [code-reviewer.md](templates/code-reviewer.md) | 代码审查 Skill 模板，复制到 `~/.openclaw/skills/` 或项目 `skills/` 目录 |

---

## 延伸阅读

- [OpenClaw 官方文档](https://docs.openclaw.ai)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)（338k+ stars）
- [ClawHub — Skill 市场](https://clawhub.com)
- [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) — Skills 方法论（也支持 OpenClaw）
