# 10 款工具速查表（Cheatsheet）

> 一页看完所有工具的关键参数、命令、快捷键。模型和定价变化快，具体以各官网为准。
>
> 信息截止：**2026-09**

---

## 一、按问题选工具（30 秒决策）

| 你的诉求 | 首选 | 备选 |
|---------|------|------|
| 在 IDE 里按 Tab 补全 | **Cursor** | Copilot / Devin Desktop（原 Windsurf）/ Trae |
| 终端里跑 Agent 做复杂任务 | **Claude Code** | **Codex CLI** / Aider / Gemini CLI |
| 已订阅 ChatGPT，想顺手用 | **Codex CLI** | Cursor 接 GPT |
| 超大代码库一次性分析 | **Claude Code**（Opus/Sonnet 5.5 均 1M 上下文） | Gemini CLI（1M，个人用户需改用 Antigravity CLI）/ Aider + Map 模式 |
| 预算紧 / 零成本 | **Trae**（免费版，仅 Auto 模式）或 **Aider + 本地模型** | `codex --oss --local-provider ollama`；Copilot / Kiro 免费档 |
| 国内直连，不用 VPN | **Trae** | OpenClaw + 本地模型 |
| 团队协作，规格驱动 | **Kiro**（Spec） | Claude Code + plan mode |
| Git 原生，多模型切换 | **Aider** | — |
| AI Agent 自动化（非纯编程） | **OpenClaw** | — |
| 只有 VS Code、不想装新东西 | **Copilot** | Cursor / Devin Desktop / Trae 都是 VS Code 分叉 |

---

## 二、能力矩阵

| 维度 | Claude Code | Codex CLI | Cursor | Copilot | Devin Desktop（原 Windsurf） | Gemini CLI | Kiro | Aider | Trae | OpenClaw |
|------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **类型** | CLI | CLI | IDE | IDE 插件 | IDE | CLI | IDE | CLI | IDE | Agent 框架 |
| **出品方** | Anthropic | OpenAI | Cursor（SpaceX 旗下） | GitHub | Cognition | Google | AWS | 开源 | 字节 | OpenClaw 基金会 |
| **Tab 补全** | — | — | ★★★ | ★★★ | ★★★ | — | ★★ | — | ★★ | — |
| **Agent 执行** | ★★★ | ★★★ | ★★★ | ★★★ | ★★★ | ★★ | ★★ | ★★ | ★★ | ★★★ |
| **终端内运行** | ★★★ | ★★★ | ★ | ★★（Copilot CLI） | ★ | ★★★ | ★★（Kiro CLI） | ★★★ | — | ★★★ |
| **上下文窗口** | **1M**（Haiku 200K） | 跟模型 | 跟模型 | 跟模型 | 跟模型 | **1M** | 跟模型 | 跟模型 | 跟模型 | 跟模型 |
| **MCP 支持** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | 原生 |
| **Hook 自动化** | ✅（30+ 事件） | ✅（12 事件，默认开启） | ✅ | ✅ | ✅ | ✅ | ✅ | ✅（lint/test） | — | ✅（Cron） |
| **Subagent** | ✅ | ✅（TOML） | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅（自定义 Agent） | ✅（Agent 空间） |
| **沙箱机制** | OS 级 Bash 沙箱（Seatbelt/bubblewrap） | OS 级（Seatbelt/bubblewrap） | — | — | — | — | — | — | — | — |
| **多模型切换** | ★（仅 Claude） | ★（仅 OpenAI） | ★★★ | ★★ | ★★★ | ★（仅 Gemini） | ★★ | ★★★（几乎所有 LLM） | ★★ | ★★★ |
| **开源** | — | ✅ Apache-2.0 | — | — | — | ✅ Apache-2.0 | — | ✅ Apache-2.0 | — | ✅ MIT |
| **国内直连** | — | — | — | — | — | — | — | — | ✅（国内版 trae.cn） | ✅（需配本地模型） |
| **定价模式** | Pro/Max 订阅 / API | ChatGPT 订阅 / API | 免费 / $20 Pro | 免费 / $10 Pro 起（AI Credits） | 免费 / $20 Pro | 企业版 / 付费 API Key（个人免费已停） | 免费 50 credits / $20 Pro | 按你选的 LLM | 免费（Auto）/ $20 Pro | 开源免费 |

---

## 三、项目配置文件一览

知道每个工具的配置文件放哪、叫什么，是快速上手的关键。

| 工具 | 主配置文件 | 位置 | 备注 |
|------|-----------|------|------|
| Claude Code | `CLAUDE.md` + `.claude/` | 项目根 | 控制在 200 行以内，大项目拆到 `.claude/rules/`（`paths:` 按路径加载）；无 CLAUDE.md 时读 `AGENTS.md` |
| Codex CLI | `AGENTS.md` + `.codex/config.toml` | 项目根 | `~/.codex/AGENTS.md` 全局；子目录 AGENTS.md 覆盖父级 |
| Cursor | `.cursor/rules/*.mdc` | 项目根 | 必须是 `.mdc`（纯 `.md` 会被忽略）；frontmatter `description` / `globs` / `alwaysApply`；也读 `AGENTS.md` |
| Copilot | `.github/copilot-instructions.md` | 项目根 | 另有 `.github/instructions/*.instructions.md`（`applyTo`）、`.github/agents/*.agent.md`；chatModes 已废弃 |
| Devin Desktop（原 Windsurf） | `.devin/rules/*.md` | 项目根 | `trigger: always_on / model_decision / glob / manual`；`.windsurfrules` 仅向后兼容 |
| Gemini CLI | `GEMINI.md` | 项目根 | 结构类似 CLAUDE.md |
| Kiro | `.kiro/steering/*.md` | 项目根 | `inclusion: always / fileMatch / manual / auto` 四种模式；全局 `~/.kiro/steering/` |
| Aider | `.aider.conf.yml` | 项目根 | YAML，含模型/lint/test 配置 |
| Trae | `.trae/rules/*.md` | 项目根 | 递归读取三层；可导入 `AGENTS.md` / `CLAUDE.md` |
| OpenClaw | `~/.openclaw/openclaw.json` | 用户目录 | JSON5，热加载 |

---

## 四、核心命令速查

### Claude Code

```bash
# 安装与启动
curl -fsSL https://claude.ai/install.sh | bash   # 官方推荐（也可 brew / winget / npm）
claude                          # 进入交互模式
claude --resume                 # 恢复上次对话
claude --model haiku            # 简单任务用便宜模型
claude -p "任务" --output-format json   # headless 模式

# 交互中
/compact                        # 压缩上下文
/context                        # 看上下文占用
/effort                         # 调思考深度（low → max）
Shift+Tab                       # 切换权限模式（含 plan / auto）
/code-review                    # 审查当前改动
Esc                             # 打断当前生成
```

### Codex CLI

```bash
# 安装与启动
curl -fsSL https://chatgpt.com/codex/install.sh | sh   # 官方推荐（也可 npm / brew）
codex                              # 进入 TUI（首次会引导登录 ChatGPT）
codex --sandbox workspace-write    # 默认搭配（`--full-auto` 已移除）
codex --sandbox read-only          # 只读探索
codex --add-dir ../sibling-repo    # 不放开沙箱、只多加可写目录
codex --yolo                       # 跳过沙箱+审批（仅在外部已隔离的环境用）
codex exec --json "..." | jq -c .  # JSONL 输出给后续脚本
codex --oss --local-provider ollama -m qwen3-coder   # 本地零成本
codex app-server                   # 供其他程序集成（原 mcp-server 已移除）
codex resume                       # 恢复上次对话

# 交互中
/init                              # scaffold AGENTS.md
/plan       Shift+Tab              # Plan 模式
/model                             # 切换模型
/review                            # 审查 diff/分支/commit
/compact                           # 压缩上下文
/multi-agents                      # 管理 subagent（别名 /subagents）
/import                            # 从 Claude Code / Cursor 迁移配置
/diff                              # 看 git diff（含未跟踪）
/debug-config                      # 排查 config.toml 不生效
```

### Cursor

```
Tab             — 接受补全
Cmd+I / Cmd+L   — 打开/关闭 Agent 侧栏（选中代码自动带入）
Shift+Tab       — 在 Agent / Ask / Plan 模式间切换
Cmd+E           — 切换 Agent 布局
Cmd+K           — 行内编辑
Esc             — 拒绝补全

@Files @Folders @Terminals @Chats @Branch @Browser   — 引用
（Notepads 已在 2.0 移除，改用 rules / skills）
```

### GitHub Copilot

```
Tab             — 接受补全
Esc             — 拒绝补全
Ctrl+Cmd+I      — 打开 Chat 视图
Shift+Cmd+I     — 以 Agent 模式打开 Chat
Cmd+I           — 行内 Chat
Alt+] / Alt+[   — 切换补全建议

#file #selection #terminal #problems   — 引用
#codebase                               — 强制语义检索全项目（Agent 会自动搜索）
/agents                                 — 选择自定义 Agent（.github/agents/）
```

### Devin Desktop（原 Windsurf）

```
Code 模式（默认）— 直接改代码
Plan 模式       — 先出方案
Ask 模式        — 只读问答
Cmd+.           — 切换模式

本地 Agent 已从 Cascade 换成 Devin Local（支持 subagent）
/工作流名        — 运行 .devin/workflows/ 里的工作流
```

### Gemini CLI

```bash
# ⚠️ 2026-06-18 起个人/免费用户停止服务，个人请改用 Antigravity CLI；企业版与付费 API Key 仍可用
npm install -g @google/gemini-cli   # 或 brew install gemini-cli
gemini                          # 进入交互
# 1M 上下文适合大代码库分析（不适合小任务）
```

### Kiro

```
1. 描述需求 → 2. Kiro 生成 Spec（requirements.md + design.md + tasks.md）→ 3. 审查确认 → 4. 按 tasks 逐项实现

Steering 加载模式（frontmatter `inclusion:`）：
- always                                     每次对话都加载
- fileMatch + fileMatchPattern: "**/*.java"  按文件匹配
- manual                                     手动激活
- auto                                       按 description 自动判断
```

### Aider

```bash
# 安装与启动
python -m pip install aider-install && aider-install
aider --model sonnet                   # 内置别名，指向较新的 Claude Sonnet
aider --model deepseek/deepseek-v4-pro # 便宜（deepseek-chat 已于 2026-07 退役）
aider --model ollama/qwen3-coder       # 本地免费

# 交互中
/add file1 file2      — 添加文件到上下文
/drop file            — 移除文件
/code                 — code 模式（直接改）
/ask                  — ask 模式（只问不改）
/architect            — 先设计后实现
```

### Trae

```
Agent 模式      — 跨文件修改（可自建 Agent：提示词 + 工具 + MCP）
Chat 模式       — 对话

@file @folder @web     — 引用
免费版仅 Auto 模式；国际版已于 2025-09 下架 Claude 模型
```

### OpenClaw

```bash
openclaw onboard                    # 初始化
openclaw gateway start              # 启动网关
openclaw doctor                     # 诊断

openclaw skills install @owner/<slug>  # 安装 ClawHub Skill
openclaw automations create ...        # 定时任务（cron 仍是别名）
openclaw models set anthropic/claude-sonnet-5-5  # 切换模型（provider/model）
openclaw channels add telegram       # 添加消息频道
```

---

## 五、选型决策流程

```
┌─ 主要在终端工作？
│   ├─ 要最强 Agent 能力 / 大型重构 → Claude Code
│   ├─ 已订阅 ChatGPT / 想要内核级沙箱 → Codex CLI
│   ├─ Google 生态 / 企业授权 → Gemini CLI（个人用户 → Antigravity CLI）
│   └─ 要多模型灵活切换 / Git 原生 → Aider
│
├─ 主要在 IDE 里？
│   ├─ 不想装新 IDE → GitHub Copilot（VS Code/JetBrains 插件）
│   ├─ 愿意换 IDE，预算足 → Cursor
│   ├─ 喜欢 AI 主动帮忙 / 本地+云端 Agent 看板 → Devin Desktop（原 Windsurf）
│   ├─ 要中文 / 国内网络 → Trae（国内版 trae.cn）
│   └─ 团队协作 / 规格驱动 → Kiro
│
└─ 做编程以外的 AI 自动化？
    └─ 多平台、定时任务、Skill 生态 → OpenClaw
```

---

## 六、组合推荐

| 组合 | 场景 |
|------|------|
| **Claude Code + Cursor** | 最流行全栈组合：CLI 做重活、IDE 做日常 |
| **Codex CLI + Cursor** | ChatGPT 订阅者顺手用：CLI 做 Agent、IDE 做补全 |
| **Codex CLI + Claude Code** | 双 CLI 互补：Codex 跑 CI/脚本、Claude Code 做大重构 |
| **Claude Code + Copilot** | 纯 VS Code 用户的轻量选择 |
| **Copilot 免费版 + Aider 本地模型** | 预算敏感：IDE 补全 + 终端 Agent 都零订阅 |
| **Aider + 本地 LLM** | 零 API 成本：`ollama/qwen3-coder` + Aider |
| **Codex CLI --oss + Ollama** | 零 API 成本但要 Codex 的 Agent 体验：内核级沙箱 + 本地模型 |
| **Claude Code + OpenClaw** | 编程 + 自动化：CC 写代码，OpenClaw 跑定时任务 |

详见 [多工具选型指南](workflows/tool-selection.md) 和 [实战场景脚本](workflows/scenarios.md)。

---

## 七、延伸阅读

- 各工具详细教程：见项目顶层目录的每个工具 README
- 提示词技巧：[common/prompting.md](common/prompting.md)
- 方法论总览：见项目 README 的 [通用方法论](README.md#-通用方法论) 章节
