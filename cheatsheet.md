# 10 款工具速查表（Cheatsheet）

> 一页看完所有工具的关键参数、命令、快捷键。模型和定价变化快，具体以各官网为准。
>
> 信息截止：**2026-04**

---

## 一、按问题选工具（30 秒决策）

| 你的诉求 | 首选 | 备选 |
|---------|------|------|
| 在 IDE 里按 Tab 补全 | **Cursor** | Copilot / Windsurf / Trae |
| 终端里跑 Agent 做复杂任务 | **Claude Code** | **Codex CLI** / Aider / Gemini CLI |
| 已订阅 ChatGPT，想顺手用 | **Codex CLI** | Cursor 接 GPT |
| 超大代码库一次性分析 | **Gemini CLI**（2M 上下文） | Aider + Map 模式 |
| 预算紧 / 零成本 | **Trae**（免费）或 **Gemini CLI**（免费额度） | Aider + 本地模型；或 `codex --oss --local-provider ollama` |
| 国内直连，不用 VPN | **Trae** | OpenClaw + 本地模型 |
| 团队协作，规格驱动 | **Kiro**（Spec） | Claude Code + plan mode |
| Git 原生，多模型切换 | **Aider** | — |
| AI Agent 自动化（非纯编程） | **OpenClaw** | — |
| 只有 VS Code、不想装新东西 | **Copilot** | Cursor/Windsurf/Trae 都是 VS Code 分叉 |

---

## 二、能力矩阵

| 维度 | Claude Code | Codex CLI | Cursor | Copilot | Windsurf | Gemini CLI | Kiro | Aider | Trae | OpenClaw |
|------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **类型** | CLI | CLI | IDE | IDE 插件 | IDE | CLI | IDE | CLI | IDE | Agent 框架 |
| **出品方** | Anthropic | OpenAI | Cursor | GitHub | Codeium | Google | AWS | 开源 | 字节 | 开源 |
| **Tab 补全** | — | — | ★★★ | ★★★ | ★★★ | — | ★★ | — | ★★ | — |
| **Agent 执行** | ★★★ | ★★★ | ★★★ | ★★★ | ★★★ | ★★ | ★★ | ★★ | ★★ | ★★★ |
| **终端内运行** | ★★★ | ★★★ | ★ | — | ★ | ★★★ | — | ★★★ | — | ★★★ |
| **上下文窗口** | 200K | 跟模型 | 跟模型 | 跟模型 | 跟模型 | **2M** | 跟模型 | 跟模型 | 跟模型 | 跟模型 |
| **MCP 支持** | ✅ | ✅ | ✅ | ✅ | ✅ | 扩展机制 | — | — | — | 原生 |
| **Hook 自动化** | ✅ | ✅（beta，复用 Claude schema） | — | — | — | — | ✅ | ✅（lint/test） | — | ✅（Cron） |
| **Subagent** | ✅ | ✅（TOML） | — | — | — | — | — | — | — | ✅（Agent 空间） |
| **沙箱机制** | App 层 + Hook | OS 内核（Seatbelt/Landlock） | — | — | — | — | — | — | — | — |
| **多模型切换** | ★（仅 Claude） | ★（仅 OpenAI） | ★★★ | ★★ | ★★★ | ★（仅 Gemini） | ★★ | ★★★（几乎所有 LLM） | ★★ | ★★★ |
| **开源** | — | ✅ Apache-2.0 | — | — | — | — | — | ✅ MIT | — | ✅ MIT |
| **国内直连** | — | — | — | — | — | — | — | — | ✅ | ✅（需配本地模型） |
| **定价模式** | API / Pro 订阅 | ChatGPT 订阅 / API | 免费 / $20 Pro | 免费 / $10 Pro | 免费 / 订阅 | 慷慨免费额度 | 预览免费 | 按你选的 LLM | 免费（有额度） | 开源免费 |

---

## 三、项目配置文件一览

知道每个工具的配置文件放哪、叫什么，是快速上手的关键。

| 工具 | 主配置文件 | 位置 | 备注 |
|------|-----------|------|------|
| Claude Code | `CLAUDE.md` + `.claude/` | 项目根 | 控制在 200 行以内，大项目拆到 `.claude/rules/` |
| Codex CLI | `AGENTS.md` + `.codex/config.toml` | 项目根 | `~/.codex/AGENTS.md` 全局；子目录 AGENTS.md 覆盖父级 |
| Cursor | `.cursor/rules/*.md` | 项目根 | 支持 `globs` 按文件类型加载 |
| Copilot | `.github/copilot-instructions.md` | 项目根 | 同目录 `agents/` `chatModes/` |
| Windsurf | `.windsurfrules` | 项目根 | 单文件，不支持拆分 |
| Gemini CLI | `GEMINI.md` | 项目根 | 结构类似 CLAUDE.md |
| Kiro | `.kiro/steering/*.md` | 项目根 | 三种模式：`always` / `globs` / `manual` |
| Aider | `.aider.conf.yml` | 项目根 | YAML，含模型/lint/test 配置 |
| Trae | `.trae/rules/project_rules.md` | 项目根 | 支持中文规则 |
| OpenClaw | `~/.openclaw/openclaw.json` | 用户目录 | JSON5，热加载 |

---

## 四、核心命令速查

### Claude Code

```bash
# 安装与启动
npm install -g @anthropic-ai/claude-code
claude                          # 进入交互模式
claude --resume                 # 恢复上次对话
claude --model haiku            # 简单任务用便宜模型
claude -p "任务" --output-format json   # headless 模式

# 交互中
/compact                        # 压缩上下文
/plan                           # 进入 plan 模式
Esc                             # 打断当前生成
```

### Codex CLI

```bash
# 安装与启动
npm install -g @openai/codex
codex                              # 进入 TUI（首次会引导登录 ChatGPT）
codex --sandbox workspace-write    # 默认搭配（v0.125.0 起 `--full-auto` 已废弃，用此替代）
codex --sandbox read-only          # 只读探索
codex --add-dir ../sibling-repo    # 不放开沙箱、只多加可写目录
codex --yolo                       # 跳过沙箱+审批（仅在外部已隔离的环境用）
codex exec --json "..." | jq -c .  # JSONL 输出给后续脚本
codex --oss --local-provider ollama -m qwen2.5-coder   # 本地零成本
codex mcp-server                   # 把 Codex 暴露给其他 Agent 当工具
codex resume                       # 恢复上次对话

# 交互中
/init                              # scaffold AGENTS.md
/plan       Shift+Tab              # Plan 模式
/model                             # 切换模型
/review                            # 审查 diff/分支/commit
/compact                           # 压缩上下文
/agent                             # 切换 subagent thread
/diff                              # 看 git diff（含未跟踪）
/debug-config                      # 排查 config.toml 不生效
```

### Cursor

```
Tab             — 接受补全
Cmd+L           — 打开 Chat（选中代码自动带入）
Cmd+I           — 打开 Composer（Agent 模式）
Cmd+K           — 行内编辑
Cmd+Shift+L     — 把当前文件加入 Chat 上下文
Esc             — 拒绝补全

@file @folder @web @terminal     — 引用
@notepad:名称                    — 引用 Notepad
```

### GitHub Copilot

```
Tab             — 接受补全
Esc             — 拒绝补全
Cmd+Shift+I     — 打开 Chat
Cmd+I           — 行内编辑
Alt+] / Alt+[   — 切换补全建议

#file #selection #terminal #problems   — 引用
@workspace                              — 全项目上下文
```

### Windsurf

```
Write 模式      — 直接写代码（类 Composer）
Chat 模式       — 对话问答

@file @folder @web     — 引用
Cascade 会自动追踪你的编辑流，不用手动贴上下文
```

### Gemini CLI

```bash
npm install -g @google/gemini-cli
gemini                          # 进入交互
# 利用 2M 上下文做大代码库分析（不适合小任务）
```

### Kiro

```
1. 描述需求 → 2. Kiro 生成 Spec → 3. 审查确认 → 4. 自动实现 + 测试

Steering 加载模式：
- always            每次对话都加载
- globs: ["*.java"]  按文件匹配
- manual            手动激活
```

### Aider

```bash
# 安装与启动
pip install aider-chat
aider --model claude-sonnet-4-5
aider --model deepseek/deepseek-chat   # 便宜
aider --model ollama/qwen2.5-coder     # 本地免费

# 交互中
/add file1 file2      — 添加文件到上下文
/drop file            — 移除文件
/code                 — code 模式（直接改）
/ask                  — ask 模式（只问不改）
/architect            — 先设计后实现
```

### Trae

```
Builder 模式    — Agent，跨文件修改
Chat 模式       — 对话

@file @folder @web     — 引用
免费模型：Claude / GPT，按任务复杂度自选
```

### OpenClaw

```bash
openclaw onboard                    # 初始化
openclaw gateway start              # 启动网关
openclaw doctor                     # 诊断

openclaw skills install <slug>      # 安装 Skill
openclaw cron add "0 9 * * *" "..."  # 定时任务
openclaw models set default <model>  # 切换模型
openclaw channels add telegram       # 添加消息频道
```

---

## 五、选型决策流程

```
┌─ 主要在终端工作？
│   ├─ 要最强 Agent 能力 / 大型重构 → Claude Code
│   ├─ 已订阅 ChatGPT / 想要内核级沙箱 → Codex CLI
│   ├─ 要超大上下文 / 免费 → Gemini CLI
│   └─ 要多模型灵活切换 / Git 原生 → Aider
│
├─ 主要在 IDE 里？
│   ├─ 不想装新 IDE → GitHub Copilot（VS Code/JetBrains 插件）
│   ├─ 愿意换 IDE，预算足 → Cursor
│   ├─ 喜欢 AI 主动帮忙 → Windsurf
│   ├─ 要中文 / 国内网络 / 免费 → Trae
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
| **Gemini CLI + Cursor** | 预算敏感：2M 免费分析 + 20$ IDE |
| **Aider + 本地 LLM** | 零 API 成本：`ollama/qwen2.5-coder` + Aider |
| **Codex CLI --oss + Ollama** | 零 API 成本但要 Codex 的 Agent 体验：内核级沙箱 + 本地模型 |
| **Claude Code + OpenClaw** | 编程 + 自动化：CC 写代码，OpenClaw 跑定时任务 |

详见 [多工具选型指南](workflows/tool-selection.md) 和 [实战场景脚本](workflows/scenarios.md)。

---

## 七、延伸阅读

- 各工具详细教程：见项目顶层目录的每个工具 README
- 提示词技巧：[common/prompting.md](common/prompting.md)
- 方法论总览：见项目 README 的 [通用方法论](README.md#-通用方法论) 章节
