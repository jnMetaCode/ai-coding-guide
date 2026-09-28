# Gemini CLI 最佳实践

> ⚠️ **重要变化（2026-06-18 起）**：据 [Google Developers Blog](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)，Gemini CLI **已停止服务个人用户**（免费的 Gemini Code Assist 个人版、Google AI Pro / Ultra 账号登录都不能用了）。企业用户（Gemini Code Assist Standard / Enterprise）和**付费 Gemini API key** 仍可继续使用，Google 也继续为企业用户提供更新和支持。个人开发者请改用 **Antigravity CLI**（迁移步骤见[下文](#迁移到-antigravity-cli个人用户)）——它保留了 Skills、Hooks、Subagents，Extensions 变成了 Antigravity plugins。

> Gemini CLI 是 Google 的命令行 AI 编程工具。最大优势：**超大上下文窗口（Gemini 3 模型 1M tokens）**。适合大代码库分析、长任务执行。

---

## 核心概念

| 概念 | 说明 | 用途 |
|------|------|------|
| **GEMINI.md** | 项目配置文件 | 类似 Claude Code 的 CLAUDE.md |
| **Tools** | 内置工具（读写文件、执行命令等） | Agent 能力基础 |
| **Extensions** | 扩展插件 | 连接 Google 服务和第三方 API |
| **Context Window** | 1M tokens（Gemini 3 模型） | 能一次性理解超大代码库 |
| **Sandbox** | 安全沙箱 | 隔离执行不信任的代码 |
| **Skills** | `.gemini/skills/` 或 `.agents/skills/` | `gemini skills install / list / uninstall` 管理 |
| **其他内置能力** | 原生 MCP、Hooks、Subagents、Plan Mode、Policy Engine、Checkpointing、Headless 模式 | 和 Claude Code / Codex 基本对齐 |

---

## 快速上手

### 安装

```bash
npm install -g @google/gemini-cli

# 或 Homebrew
brew install gemini-cli
```

安装后运行 `gemini` 进入交互模式，按提示用企业 Google 账号（Code Assist Standard / Enterprise）登录，或设置付费的 `GEMINI_API_KEY`。个人 Google 账号登录自 2026-06-18 起已不可用。

> 最新安装方式请参考 [官方仓库](https://github.com/google-gemini/gemini-cli)。

### GEMINI.md — 项目配置

```markdown
# 项目背景
这是一个 Go 微服务项目，包含 12 个服务。

# 目录结构
- cmd/         — 各服务入口
- internal/    — 内部包
- pkg/         — 公共包
- proto/       — Protobuf 定义
- deployments/ — K8s 配置

# 常用命令
- 编译所有服务：make build-all
- 跑测试：make test
- 生成 proto：make proto-gen
- 本地启动：docker compose up

# 注意
- 服务间通信用 gRPC，不要用 HTTP
- 配置统一走 Viper，不要硬编码
```

---

## 超大上下文的正确用法

Gemini CLI 的 1M tokens 上下文窗口是它的核心优势。但大不等于好——关键是用对。

### 适合大上下文的场景

```
# 1. 整个项目架构分析
读取整个 src/ 目录，画出模块依赖关系图。
哪些模块耦合度最高？给出解耦建议。

# 2. 全局重构评估
如果要把 ORM 从 GORM 换成 sqlc，
影响范围有多大？列出所有需要改的文件。

# 3. 跨服务问题排查
用户下单后没收到通知。
从 order-service 到 notification-service 的完整调用链，
每个环节的代码都看一下，找出哪里断了。
```

### 不适合大上下文的场景

```
❌ 不要把整个 node_modules 塞进去
❌ 不要一次分析 10 万行代码然后问"有没有 bug"
❌ 不要用大上下文替代精确定位
```

---

## 提示词技巧

### 1. 批量分析

```
依次检查 src/ 下每个 Go 文件的错误处理：
1. 有没有忽略 error 返回值（_ = xxx）
2. 有没有用 fmt.Println 打印错误而不是 log
3. 有没有 panic 在非 main 函数里
列出所有问题，按文件分组。
```

### 2. 代码库导航

```
我刚接手这个项目，帮我理解：
1. 请求从 HTTP 进来到返回响应，经过哪些层？
2. 数据库操作封装在哪一层？
3. 认证和授权是怎么做的？
4. 有没有文档或注释说明架构决策？
给我一份简洁的架构概览。
```

### 3. 代码迁移评估

```
这个项目想从 Python 2 迁移到 Python 3。
扫描所有 .py 文件，找出：
1. print 语句（不是函数）
2. unicode/str 类型问题
3. 已废弃的标准库用法
4. 不兼容的第三方库版本
按迁移优先级排序。
```

---

## 与 Claude Code 的区别

| 维度 | Gemini CLI | Claude Code |
|------|-----------|-------------|
| 上下文窗口 | 1M tokens（Gemini 3） | 1M tokens（Opus 5.5 / Sonnet 5.5） |
| 个人用户 | 2026-06-18 起停止服务（仅企业账号 / 付费 API key 可用） | Pro / Max 等订阅或 API |
| Agent 能力 | ★★☆ | ★★★ |
| 工具生态 | Google 服务集成好 | MCP 生态最丰富 |
| Skill 支持 | 有（`.gemini/skills/` 或 `.agents/skills/`） | 有（`.claude/skills/`） |
| 适合 | 大代码库分析、已有 Google 企业订阅 | 复杂 Agent 任务、需要强执行力 |

**建议组合**：用 Gemini CLI 做大规模分析和理解，用 Claude Code 做精确的修改和执行。

---

## 常见陷阱

| 陷阱 | 说明 | 解决 |
|------|------|------|
| 上下文太大反而慢 | 1M 全塞满处理很慢 | 只在需要全局视角时用大上下文 |
| 个人账号登录失败 | 2026-06-18 起不再服务个人用户 | 改用 Antigravity CLI，或用企业账号 / 付费 API key |
| 工具能力弱于 Claude Code | 文件操作、命令执行不如 CC | 分析用 Gemini，执行用 CC |

---

## 迁移到 Antigravity CLI（个人用户）

> 以下内容均来自 Google 官方文档，最后核对：2026-09-29。官方迁移指南：[Migration from Gemini CLI](https://antigravity.google/docs/cli/gcli-migration)。

### 安装与登录

命令名是 **`agy`**（[安装文档](https://antigravity.google/docs/cli/install/)）：

```bash
# macOS / Linux（安装到 ~/.local/bin/agy）
curl -fsSL https://antigravity.google/cli/install.sh | bash

# Windows PowerShell
irm https://antigravity.google/cli/install.ps1 | iex
```

- **Google 账号登录**：首次运行 `agy` 会打开浏览器登录，凭据存进系统 keyring；SSH 环境下改为手动打开 URL 授权。退出用 `/logout`
- **Gemini API key**：在 `~/.gemini/antigravity-cli/settings.json` 里写 `{"modelProvider": "gemini"}`，再 `export GEMINI_API_KEY=...`，适合无浏览器的 headless / CI 场景

### 配置迁移对照

| 项目 | Gemini CLI | Antigravity CLI |
|------|-----------|-----------------|
| 上下文文件 | `GEMINI.md` / `AGENTS.md`、`~/.gemini/GEMINI.md` | **不用改**，规则相同 |
| 全局 Skills | `~/.gemini/skills/` | `~/.gemini/antigravity-cli/skills/` |
| 项目 Skills | `.gemini/skills/` | `.agents/skills/`（**需手动移动**） |
| Extensions | Gemini 扩展 | 插件：`agy plugin import gemini` 自动转换 |
| MCP | `~/.gemini/settings.json` 里的 `mcpServers` | 全局 `~/.gemini/config/mcp_config.json`，项目 `.agents/mcp_config.json`；远程服务器的 `url` / `httpUrl` 改为 `serverUrl` |
| Hooks | （迁移指南未列出） | 项目 `.agents/hooks.json`，全局 `~/.gemini/config/hooks.json` 或 `~/.gemini/antigravity-cli/settings.json`（[Hooks](https://antigravity.google/docs/hooks/)） |
| Subagents | （迁移指南未列出） | 项目 `.agents/agents/<name>.md`，全局 `~/.gemini/config/agents/<name>.md`（[Subagents](https://antigravity.google/docs/subagents/)） |

- 首次运行 `agy` 时如果检测到旧配置，会弹出迁移清单：转换扩展和全局设置、把会话 token 迁到系统 keyring。部分自定义终端主题不支持
- `agy plugin import gemini` 会解析旧扩展，把其中的 skills、MCP 服务器迁过来，旧的自定义 commands 会转成 skills
- 官方迁移指南**没有**提到 Hooks 和 Subagents 的自动转换，建议按上表的新路径手动检查

### 价格与额度

据 [Plans 文档](https://antigravity.google/docs/plans/) 和 [定价页](https://antigravity.google/pricing)：个人可以免费用（$0，每周限额），CLI 属于所有计划都有的功能；Google AI Pro / Ultra 额度更高，每 5 小时刷新，另有每周上限；Pro / Ultra 用户还可以加购 AI Credits。CLI 里用 `/usage` 看额度，`/credits` 看 AI Credits。

### 和 Gemini CLI 的主要区别

- 用 Go 重写，响应更快；支持异步多 Agent 工作流（[Google Developers Blog](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)）
- 和 Antigravity 2.0 桌面端共用同一套 agent harness，设置自动同步，会话可以在 CLI 和桌面端之间互导（[CLI Overview](https://antigravity.google/docs/cli/overview/)）
- 新增 `/plan`、`/agents`、`/codesearch`、`/diff`、`/permissions`、`/resume`、`/usage` 等斜杠命令

### 迁移清单

1. 安装 `agy`，运行后登录 Google 账号（或配置 `GEMINI_API_KEY`）
2. 在首次启动弹出的迁移清单里确认转换
3. 运行 `agy plugin import gemini`，看输出确认每个扩展是否迁移成功
4. 把项目里的 `.gemini/skills/` 移到 `.agents/skills/`
5. 检查 MCP 配置是否已迁到 `mcp_config.json`，远程服务器的 `url` / `httpUrl` 是否已改成 `serverUrl`
6. 把 Hooks、Subagents 放到上表列出的新路径
7. `GEMINI.md` / `AGENTS.md` 不用动，在项目里跑一次 `agy` 确认规则已生效

---

## 配置模板

| 模板 | 用途 |
|------|------|
| [GEMINI.md](templates/GEMINI.md) | 项目配置文件模板，复制到项目根目录后按需修改 |

---

## 延伸阅读

- [Gemini CLI 官方文档](https://github.com/google-gemini/gemini-cli)
- [gemini-cli-tips](https://github.com/addyosmani/gemini-cli-tips) — Addy Osmani 的 30 个技巧
- [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) — Skills 方法论（也支持 Gemini CLI）
