# OpenClaw 最佳实践

> OpenClaw 是一个开源的 AI 个人助手框架（39 万+ GitHub Stars），核心特色是 **本地运行 + 多平台连接 + 自主执行任务**。它不只是聊天机器人，而是能浏览网页、读写文件、执行命令、调度定时任务的 AI Agent。支持 Claude、GPT、DeepSeek、本地模型等多种 LLM。
>
> 项目现由 **OpenClaw Foundation**（美国 501(c)(3) 非营利组织）托管，保持 MIT 许可；版本号改为日期格式（如 `v2026.9.6`）。

---

## 核心概念

| 概念 | 说明 | 用途 |
|------|------|------|
| **Gateway** | 后台常驻的 WebSocket 网关 | 路由消息、管理 Agent |
| **Channel** | 消息平台连接（30+） | 接入 Telegram、Slack、Discord、飞书（官方插件）、微信（外部插件）等 |
| **Skill** | `SKILL.md` 定义的能力模块 | 教 AI 怎么做事（类似 Claude Code 的 Skills） |
| **Agent** | 独立的 AI 工作空间 | 不同任务用不同 Agent |
| **Automations** | 定时任务调度（`cron` 命令的别名） | 自动化周期性工作 |
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

系统要求：Node.js 24.16+ 或 26.1+（推荐 26）。安装脚本会自动检测并安装 Node。Windows 可用 PowerShell：`iwr -useb https://openclaw.ai/install.ps1 | iex`

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
  // 模型设置（provider/model 格式）
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-sonnet-5-5",
        // 也可以用 DeepSeek 省钱
        // "primary": "deepseek/deepseek-v4-pro",
        "fallbacks": ["deepseek/deepseek-v4-pro"],
      },
    },
  },

  // 频道（按需开启；WebChat 内置在核心的 Control UI 里，不用单独配置）
  "channels": {
    "telegram": { "enabled": true },
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

Skills 的加载位置（优先级从高到低，同名 Skill 以高优先级为准）：

```
<workspace>/skills/                → 工作区 Skills（最高优先级）
<workspace>/.agents/skills/        → 项目级 agent Skills
~/.agents/skills/                  → 个人 agent Skills
<state-dir>/skills/                → 托管/本地安装的 Skills
<state-dir>/agents/<agentId>/agent/workshop-skills/  → Workshop Skills
内置 Skills                         → 随安装包附带
skills.load.extraDirs + 插件 Skills → 额外目录（最低优先级）
```

安装社区 Skill：

```bash
# 从 ClawHub 安装
openclaw skills install @owner/<slug>

# 查看已安装的 Skills
openclaw skills list
```

### 2. 多模型策略

```bash
# 查看可用模型
openclaw models list

# 设置默认模型（写入 agents.defaults.model）
openclaw models set anthropic/claude-sonnet-5-5

# 复杂任务用 Claude Opus
openclaw models set anthropic/claude-opus-5-5

# 日常对话用 DeepSeek（便宜）
openclaw models set deepseek/deepseek-v4-pro

# 完全免费用本地模型
openclaw models set ollama/qwen3-coder
```

### 3. 自动化任务

OpenClaw 支持定时任务（Automations），适合自动化。`openclaw automations` 和 `openclaw cron` 是同一个命令，`create` 是 `add` 的别名：

```bash
# 每天早上 9 点发送代码库健康报告
openclaw automations create "0 9 * * *" "检查项目代码质量，生成报告发送给我" --name "代码健康日报"

# 每周一早上发送周报摘要
openclaw automations create "0 9 * * 1" "汇总上周的 Git 提交和 PR，生成周报" --name "周报"

# 查看所有定时任务
openclaw automations list
```

### 4. 多频道协作

OpenClaw 的独特优势是连接多个消息平台：

```bash
# 添加频道
openclaw channels add telegram

# 查看频道状态
openclaw channels status
```

应用场景：
- **Telegram** — 随时随地发消息让 AI 执行任务
- **WebChat** — 核心内置（Control UI），浏览器界面做复杂交互，无需 `channels add`
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
| `openclaw channels add/remove/status/login/logout/logs` | 管理消息频道 |
| `openclaw models list/set/status` | 管理模型 |
| `openclaw skills list/install/update` | 管理 Skills |
| `openclaw automations create/list`（别名 `cron`） | 定时任务 |
| `openclaw agents list/add/delete` | 管理 Agent 工作空间 |
| `openclaw doctor` | 健康检查和诊断 |
| `openclaw logs` | 查看网关日志 |

### 调试和排查

```bash
# 健康检查（最有用的排查命令）
openclaw doctor

# 查看实时日志
openclaw logs

# 开发模式（--dev 是全局参数：状态隔离到 ~/.openclaw-dev，网关端口 19001）
openclaw --dev gateway
```

---

## 与其他工具的区别

| 维度 | OpenClaw | Claude Code | Cursor |
|------|----------|-------------|--------|
| 类型 | AI Agent 框架 | CLI 编程助手 | AI IDE |
| 核心场景 | 多平台自动化 | 代码编写和重构 | 日常编码 |
| 运行方式 | 后台常驻（Gateway） | 按需启动 | IDE 内嵌 |
| 消息平台 | 30+ 平台 | 仅终端 | 仅 IDE |
| 模型支持 | Claude/GPT/DeepSeek/本地 | 仅 Claude | 多模型 |
| Skills | SKILL.md | .claude/skills/ | Rules |
| 定时任务 | ✅ 内置 Automations | ❌ | ❌ |
| 开源 | ✅（MIT） | ❌ | ❌ |
| 适合 | 自动化、多平台、全能助手 | 专业编程 | 日常编码 |

**OpenClaw vs Claude Code**：不是替代关系，而是互补。Claude Code 专注编程，OpenClaw 专注自动化和多平台连接。可以同时使用。

---

## 常见陷阱

| 陷阱 | 说明 | 解决 |
|------|------|------|
| Node 版本不够 | 需要 24.16+ 或 26.1+ | `nvm install 26` |
| Gateway 启动失败 | 端口被占用或配置错误 | `openclaw doctor` 诊断 |
| Skill 不生效 | 路径或格式不对 | 检查 `SKILL.md` frontmatter 的 name 和 description |
| 模型 API 报错 | Key 未设置或余额不足 | `openclaw models status` 检查 |
| 频道连接断开 | 网络或认证问题 | `openclaw channels status` / `openclaw channels logs` 定位，必要时 `openclaw channels logout` + `openclaw channels login` 重新认证 |

---

## 配置模板

| 模板 | 用途 |
|------|------|
| [code-reviewer.md](templates/code-reviewer.md) | 代码审查 Skill 模板，复制到 `<workspace>/skills/code-reviewer/SKILL.md` 或 `~/.agents/skills/code-reviewer/SKILL.md` |

---

## 延伸阅读

- [OpenClaw 官方文档](https://docs.openclaw.ai)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)（390k+ stars）
- [ClawHub — Skill 市场](https://clawhub.ai)
- [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) — Skills 方法论（也支持 OpenClaw）
