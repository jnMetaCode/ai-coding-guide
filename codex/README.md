# OpenAI Codex CLI 最佳实践

**简体中文** | [English](./README.en.md)

> Codex CLI 是 OpenAI 官方的开源终端编程 Agent，用 Rust 写成，与 Claude Code、Gemini CLI 同属"终端 Agent 三巨头"。本文基于官方文档（developers.openai.com/codex）和仓库 [openai/codex](https://github.com/openai/codex) 的 v0.125.0（2026-04）核实整理。

> ⚠️ 注意：这里讲的是 2025 年发布的**新 Codex CLI**（开源、终端 Agent），不是 2023 年退役的旧 Codex 模型。同名产品系列还包括 **Codex App**（桌面端）和 **Codex Web**（云端 Agent，`chatgpt.com/codex`），本文只覆盖 CLI。

---

## 核心概念

| 概念 | 说明 | 用途 |
|------|------|------|
| **AGENTS.md** | 项目/全局指令文件 | 类似 Claude Code 的 CLAUDE.md，启动时自动加载 |
| **Approval Mode** | 何时需要人来批 | `untrusted` / `on-request` / `never` |
| **Sandbox Mode** | 能动什么文件、能不能联网 | `read-only` / `workspace-write` / `danger-full-access` |
| **Profile** | 一组 config 的命名预设 | `--profile work` 一键切换模型/权限 |
| **Subagent** | 子 Agent，独立任务 | TOML 定义，可设置不同模型/权限 |
| **Skill** | 可复用工作流（SKILL.md） | 把重复任务封装成命名能力 |
| **MCP Server** | 外部工具接入 | STDIO 或 HTTP/OAuth |
| **Plan Mode** | 先规划再动手 | `/plan` 或 Shift+Tab 切换 |

---

## 快速上手

### 安装

```bash
# npm（推荐）
npm install -g @openai/codex

# 或 Homebrew (macOS)
brew install --cask codex

# 或下载 GitHub Release 二进制（macOS arm64/x64、Linux x64/arm64）
# https://github.com/openai/codex/releases/latest
```

系统要求（来自官方 install 文档）：macOS 12+、Ubuntu 20.04+/Debian 10+、Windows 11（WSL2），4 GB 内存（建议 8 GB），可选 Git 2.23+。

### 认证

```bash
codex            # 第一次启动，按提示选 "Sign in with ChatGPT"
```

两种方式：

- **ChatGPT 账号登录**（官方推荐）—— 走 ChatGPT Plus / Pro / Business / Edu / Enterprise 订阅额度，开浏览器走 OAuth。
- **API Key** —— 适合 CI、企业代理或想精确按量计费的场景，需要额外设置（详见 `developers.openai.com/codex/auth`）。

### 第一次跑

```bash
cd /your/project
codex
```

进入 TUI 后试这几条（来自官方 quickstart）：

```
> Tell me about this project
> Find and fix bugs in my codebase with minimal, high-confidence changes
> Build a classic Snake game in this repo
```

> 💡 **官方建议**：执行任务前先 `git commit` 或建 checkpoint，Codex 改完不满意可以一键回滚。

### AGENTS.md — 项目指令文件

在项目根目录建 `AGENTS.md`（或运行 `/init` 让 Codex 自动 scaffold）：

```markdown
# 项目说明
Next.js 14 + TypeScript 电商后台。

# 目录约定
- src/app/api/      接口路由
- src/components/   UI 组件（PascalCase）
- src/lib/db/       Drizzle 数据访问层

# 构建 / 测试 / Lint
- 启动：pnpm dev
- 测试：pnpm test         （Vitest，必须在改完后跑）
- 类型：pnpm typecheck
- Lint：pnpm lint --fix

# 工程约束
- TS strict mode
- DB 操作只走 Drizzle，禁止裸 SQL
- 提交前自动 lint，不要绕过 husky

# 不要做的事
- 不要修改 src/legacy/
- 不要新增运行时依赖前不询问
```

加载顺序（重要）：

```
~/.codex/AGENTS.override.md   ← 临时全局覆盖
~/.codex/AGENTS.md            ← 个人全局
项目 git root/AGENTS.md       ← 团队共享
子目录/AGENTS.md              ← 模块级局部规则（覆盖父级）
```

文件按目录从浅到深拼接，越靠近当前目录的越优先生效。默认每个文件最多 32 KiB，可通过 `project_doc_max_bytes` 调。

---

## 提示词技巧

Codex 官方推荐"四元素"提示模板（来源：developers.openai.com/codex/learn/best-practices）：

```
Goal:        要做什么？要改什么？
Context:     涉及哪些文件、文档、错误信息？
Constraints: 约束有哪些？规范、架构、安全要求？
Done when:   完成判定条件是什么？
```

### 1. 精确而不啰嗦

```
❌ 优化下登录功能
✅ Goal: 把 src/app/api/login/route.ts 的密码比对从 bcrypt.compareSync 换成异步 compare
   Context: 该接口被 src/components/LoginForm.tsx 调用，错误返回需保持 { code, message } 结构
   Constraints: 不动 schema、不加新依赖
   Done when: pnpm test 全绿，且并发 100 次登录无 event loop 阻塞警告
```

### 2. 用 `@` 引文件而不是粘贴

```
@src/services/payment.ts @src/services/order.ts
读完这两个文件，分析支付流程的失败重试有什么漏洞，先给方案，确认后再改。
```

让 Codex 自己拉文件比你粘进 prompt 更省 token，也避免"截断到一半"。

### 3. 推理强度按需调

复杂问题让 Codex "think harder"，简单任务用低推理省钱：

- **low** — 简单改动、风格调整
- **medium / high** — 大多数日常重构、Bug 修复
- **xhigh** — 架构级、多文件复杂逻辑

可在 TUI 里通过快捷键切换，或在 config.toml 里设默认。

### 4. 先 Plan 后 Act

```
/plan
  分析 src/api/ 下所有路由，统一改成新的错误处理中间件
```

或者按 **Shift+Tab** 切到 Plan Mode。Codex 会先列计划、问澄清问题，确认后才写代码——多文件任务强烈建议用。

### 5. 让它跑测试 + 自查

```
做完改动后：
1) 跑 pnpm test，把失败用例的输出贴给我
2) 跑 pnpm typecheck，确认没有新增类型错误
3) 用 /review 自查 diff，列出风险点
```

官方原话：*Don't stop at asking Codex to make a change. Ask it to create tests when needed, run checks, confirm results, and review work before accepting.*

---

## Approval & Sandbox（最重要的两个安全旋钮）

这是 Codex 最有特色的设计。两个维度独立配置：

### Sandbox（能动什么）

| 模式 | 行为 |
|------|------|
| `read-only` | 只读，任何写/执行/联网都要批 |
| `workspace-write` ⭐ 默认 | 可读、可改 workspace 内文件、可跑常规命令；写 workspace 外或联网要批 |
| `danger-full-access` | 完全放开，**不推荐** |

技术实现（核实自 `codex-rs/cli/src/debug_sandbox.rs` 源码）：

- **macOS** — Seatbelt（系统自带）
- **Linux / WSL2** — **Landlock** 内核 LSM + seccomp 过滤（需要 Linux 5.13+ 且 Landlock 已启用）
- **Windows** — Restricted token sandbox（PowerShell 下生效）

> 提示：可以用 `codex sandbox seatbelt|landlock|windows -- <cmd>` 这组调试子命令，单独验证某条命令在沙箱里能不能跑。

### Approval（什么时候问你）

| 模式 | 行为 |
|------|------|
| `untrusted` | 只有官方判定为安全的只读操作自动跑，其他都要批 |
| `on-request` ⭐ 默认 | 在 sandbox 内自动跑，越界（写外、联网）才问 |
| `never` | 永不询问（用于 CI / 脚本，配 sandbox 用） |

### 常用组合

```bash
# 本地开发：直接 `codex` 即可（默认就是 workspace-write + on-request）
codex

# 显式指定（与上面等价）
codex --sandbox workspace-write

# 只想让它探一下、不要动手
codex --sandbox read-only

# 加几个 workspace 外的可写目录（不需要全开）
codex --add-dir ../sibling-repo --add-dir /tmp/scratch

# 在 CI / 脚本里非交互执行
codex exec --sandbox workspace-write --ask-for-approval never "跑测试并修复失败用例"

# 临时完全放开沙箱（明白后果再用）
codex --sandbox danger-full-access --ask-for-approval never

# 完全 YOLO：连询问都跳过、不沙箱（仅在外部已隔离环境下用，例如 Docker）
codex --yolo
# 等价于：codex --dangerously-bypass-approvals-and-sandbox
```

> ⚠️ **`--full-auto` 已废弃移除**（v0.125.0 仍在 `codex exec` 里保留作迁移提示）。直接 `--sandbox workspace-write` 就是同义；approval 默认本就是 `on-request`。
>
> 🚨 **CI 踩坑**：默认 approval 是交互式的，CI 里会卡死等输入超时。`codex exec` + `--ask-for-approval never` 是 CI 的标准姿势。

---

## 进阶用法

### 1. config.toml — 持久化偏好

`~/.codex/config.toml`（用户级）/ `.codex/config.toml`（项目级）：

```toml
model = "gpt-5.5"
approval_policy = "on-request"
sandbox_mode = "workspace-write"

[features]
web_search = "cached"     # 默认走缓存；--search 切 live
multi_agent = true

[profiles.review]
model = "gpt-5.5"
approval_policy = "untrusted"
sandbox_mode = "read-only"

[profiles.ci]
approval_policy = "never"
sandbox_mode = "workspace-write"

[mcp_servers.github]
command = "npx @modelcontextprotocol/server-github"
enabled = true
```

切换 profile：

```bash
codex --profile review              # 只读模式跑代码审查
codex exec --profile ci "..."       # CI 用脚本模式
```

### 2. Slash 命令速查

TUI 内常用：

| 命令 | 作用 |
|------|------|
| `/init` | 在仓库 scaffold 一份 AGENTS.md |
| `/model` | 切换模型 |
| `/plan` | 进入 Plan Mode |
| `/review` | 让 Codex 审查当前 diff / 分支 / 指定 commit |
| `/compact` | 压缩对话历史，释放 token |
| `/agent` | 在多个 subagent thread 间切换（`/multi-agents` 别名） |
| `/side` | 在临时 fork 里开支线对话，问完不污染主线 |
| `/permissions` `/approvals` | 临时调权限 |
| `/resume` `/fork` | 恢复 / 从某个时刻分叉对话 |
| `/new` `/clear` | 同 session 内开新对话 / 清屏重开 |
| `/rename` | 给当前 thread 改名 |
| `/diff` | 看 git diff（含未跟踪文件） |
| `/mention` | 把文件挂到对话里 |
| `/skills` | 列出 / 使用 Skill |
| `/memories` | 查看 / 生成 / 重置长期记忆 |
| `/mcp` | 检查 MCP server 状态（`/mcp verbose` 看详情） |
| `/plugins` `/apps` | 浏览插件 / 应用 |
| `/status` | 当前 session 详情、token 使用 |
| `/goal` | 设定 / 查看长任务的目标 |
| `/fast` | 切 Fast mode（`on`/`off`/`status`） |
| `/debug-config` | 打印配置层级与 requirements 诊断（**改 config.toml 不生效时用这个**） |
| `/feedback` | 给 OpenAI 发日志反馈 |

> 完整表（46 个）见源码 `codex-rs/tui/src/slash_command.rs::SlashCommand` 枚举。在 TUI 里按 `/` 也会弹自动补全。

### 3. 非交互执行（exec）

把 Codex 当脚本工具用：

```bash
# 单 prompt
codex exec "把所有 console.log 改成 logger.debug"

# 管道
git diff main..HEAD | codex exec "审查这份 diff，找出潜在 bug"

# 指定模型 + 不询问
codex exec -m gpt-5.5 --ask-for-approval never "为新文件补单测"

# 输出 JSONL（每行一个事件）给后续程序处理
codex exec --json "..." | jq -c .

# 把最后一条 message 单独写到文件（便于脚本提取最终结果）
codex exec -o /tmp/answer.txt "..."
```

### 4. Subagent — 并行子任务

`.codex/agents/explorer.toml`：

```toml
name = "explorer"
description = "Read-only codebase explorer; gathers evidence before any change."
model = "gpt-5.3-codex"
sandbox_mode = "read-only"
developer_instructions = """
Stay in exploration mode.
Trace execution paths, cite files and symbols with file:line.
Never propose changes — just report findings.
"""
```

主 Agent 调用：

```
派一个 explorer subagent 把 src/api/ 所有路由的鉴权逻辑梳理一遍，回来汇总。
```

子 Agent 独立 sandbox + 模型，跑完返回主 thread。适合"探索 + 实施"分离的复杂改动。

### 5. MCP — 外部工具

```bash
# CLI 直接添加
codex mcp add github --command "npx @modelcontextprotocol/server-github"
codex mcp list
```

支持 STDIO 和 HTTP/OAuth 两类 server。常用：GitHub、Linear、Slack、数据库（Postgres / Supabase）。原则：**只接能消除手工动作的工具**，不要凑数。

### 6. Skill — 可复用方法论（注意：是文件夹，不是单文件）

把重复任务封装成一个 **Skill 目录**，Codex 看 description 决定何时触发，只在需要时才载入正文（"渐进披露"）：

```
~/.agents/skills/release-notes/      ← 个人（canonical 路径）
.codex/skills/release-notes/         ← 项目 Codex 专属
.agents/skills/release-notes/        ← 项目跨工具（Claude Code / Codex 等共享）
└── SKILL.md           # 必须：name + description + 主体步骤
└── references/        # 可选：长文档、规范、API schema
└── scripts/           # 可选：辅助脚本（lint / parser / generator）
└── examples/          # 可选：示范输入/输出
└── agents/openai.yaml # 可选：Codex 专属元数据（如限制权限）
```

> 注：`~/.codex/skills/` 也能用但已废弃（向后兼容），新装统一放 `~/.agents/skills/`。

调用方式（来自 shanraisshan 实战经验）：

```
$skill-creator                 # 用 $ 前缀显式触发某个技能
/skills                        # 列出所有可用技能
> 给我做这周 release notes     # 描述匹配会自动触发，无需 $
```

**写 Skill 的要点**（社区高 star 项目共识）：

- description 是触发器，不是摘要——写"什么时候应该 fire"而不是"这是什么"
- Skill 是给模型看的指引，不是给人看的文档——别罗列废话
- 给目标和约束，**别 railroad**（强制每一步怎么做），让模型自己决策路径
- 加一个 `## Gotchas` 段，把 Codex 在这个领域常踩的坑记下来——这是最高信号的内容

> 现成 Skill 库可以直接抄：[ComposioHQ/awesome-codex-skills](https://github.com/ComposioHQ/awesome-codex-skills)、[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills)（跨工具）

### 7. Hooks — 在 Agent 循环里挂自定义脚本（beta）

启用 `[features] codex_hooks = true` 后，Codex 在 6 个事件点会调用你定义的 shell 脚本：

| 事件 | 触发时机 | 典型用途 |
|------|---------|---------|
| `PreToolUse` | 工具调用前 | 危险命令拦截、参数校验 |
| `PermissionRequest` | 申请越界权限时 | 自动批/拒，根据规则 |
| `PostToolUse` | 工具调用后 | 自动 lint / format / 测试 |
| `SessionStart` | session 启动 | 加载项目特定上下文 |
| `UserPromptSubmit` | 用户提交 prompt 时 | 注入企业 disclaimer / 安全扫描 |
| `Stop` | session 结束 | 上传日志 / 清理临时文件 |

> 💡 hook schema 直接复用 Claude Code 的 `hooks.json` 格式（源码引擎名 `ClaudeHooksEngine`），所以从 Claude Code 迁移过来零改动。

配置文件 `.codex/hooks.json`，参考实现：[shanraisshan/codex-cli-hooks](https://github.com/shanraisshan/codex-cli-hooks)。

最常见的两个 use case：
- **PostToolUse 跑 prettier/ruff** — Codex 改完代码自动格式化，避免 CI 红
- **PreToolUse 拦截 `rm -rf` / `git push --force` / 数据库 DROP** — 双保险

### 8. Memories — 跨 session 的长期记忆（beta）

启用 `[features] memories = true`，Codex 会在 session 之间保留你确认过的事实（"这个项目用 pnpm，不要建议 npm"）。

```bash
/memories             # TUI 里查看 / 生成 / 重置
```

存在 `~/.codex/memories/`（per-user，**不是 per-project**）。安全开关（来自源码 `MemoriesToml` 结构）：

```toml
[memories]
disable_on_external_context = true   # 触发外部数据（MCP / web 搜索）时把当前 thread 标"polluted"，防记忆泄漏
                                     # （旧别名 no_memories_if_mcp_or_web_search 仍可用）
generate_memories = true             # 默认就是 true；置 false 则不再为新 thread 生成记忆
use_memories = true                  # 默认 true；置 false 跳过把记忆注入提示
```

如果某个 session 接触了不可信内容（解析了陌生 PDF、跑了未审计的 MCP），跑 `/memories → Reset` 立即清掉。

### 9. Plugins / Marketplace — 插件分发（v0.121.0+）

把 skills + apps + MCP servers 打包成可分发的 plugin（`.codex-plugin/plugin.json`）：

```bash
codex plugin marketplace add user/repo            # GitHub shorthand
codex plugin marketplace add ./local-marketplace  # 本地目录也行
codex plugin marketplace upgrade
codex plugin marketplace remove <name>

# 在 TUI 里
/plugins              # 浏览已装 / 可装的 plugin
```

社区 marketplace 索引：[hashgraph-online/awesome-codex-plugins](https://github.com/hashgraph-online/awesome-codex-plugins)。

### 10. Fast Mode — 1.5× 速度，2× 额度（gpt-5.4 限定）

```
/fast on            # 开启
/fast status        # 看当前
/fast off           # 关
```

适合"知道大致怎么改、就缺打字员"的场景。Pro 订阅还能用 `gpt-5.3-codex-spark` 做近实时的小改动迭代。

### 11. Web 搜索

默认开启，cached 模式（OpenAI 预索引）。需要实时结果加 `--search`：

```bash
codex --search "React 19 useActionState 的最新最佳实践"
```

### 12. 图片输入

```bash
codex -i screenshot.png "按这张设计稿改 src/components/Pricing.tsx"
```

PNG / JPEG，可在 TUI 里直接粘贴截图。配 Chrome DevTools / Playwright MCP，让 Codex 自己看浏览器控制台日志：

```bash
codex mcp add chrome-devtools --command "npx chrome-devtools-mcp"
codex mcp add playwright --command "npx @playwright/mcp"
```

### 13. 本地开源模型（`--oss`）

源码 `utils/oss/src/lib.rs` 确认 Codex 原生支持两个本地 provider：

```bash
# Ollama 路线
codex --oss --local-provider ollama -m qwen2.5-coder
codex --oss --local-provider ollama -m deepseek-coder-v2

# LM Studio 路线
codex --oss --local-provider lmstudio
```

完全离线、零 API 成本。代价是模型能力比 GPT-5.5 弱不少，适合：本地敏感数据 / 没网环境 / 跑批量低复杂度任务。

> 模型 ID 跟着 Ollama / LM Studio 自己的命名（`ollama list` 看本地有什么），Codex 不维护独立清单。

### 14. CI 集成（官方 GitHub Action）

[`openai/codex-action`](https://github.com/openai/codex-action) 是官方 Apache-2.0 Action，**自带受限沙箱代理**。最常用的 PR 自动 review 工作流：

```yaml
# .github/workflows/codex-review.yml
name: Codex PR review
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v5
        with:
          ref: refs/pull/${{ github.event.pull_request.number }}/merge
      - run: git fetch --no-tags origin "${{ github.event.pull_request.base.ref }}"
      - id: codex
        uses: openai/codex-action@v1
        with:
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          prompt: |
            Review only the changes in PR #${{ github.event.pull_request.number }}:
              git diff ${{ github.event.pull_request.base.sha }}...${{ github.event.pull_request.head.sha }}
            Be concise. Flag bugs, missing tests, and security risks.
      - if: steps.codex.outputs.final-message != ''
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `${{ steps.codex.outputs.final-message }}`
            })
```

⚠️ **沙箱默认禁网**——如果你的 review prompt 需要跑测试 / 装依赖，先在 Action 步骤里 `npm ci` 再调 `codex-action`。

### 15. Codex 作为 MCP server（反向接入）

```bash
codex mcp-server                    # 把 Codex 暴露成 MCP server
```

源码确认这会 expose `codex()` 和 `codex-reply()` 两个 MCP 工具。用法：让 Claude Code、Cursor 等其他 Agent 把 Codex 当成"我的同事"调用，做并行任务或交叉验证。

### 16. Rules / Execpolicy（高级安全）

Starlark DSL 定义命令白/灰/黑名单（`prefix_rule()` + `host_executable()`）。规则文件放 `.codex/rules/*.rules`，可用 `codex execpolicy check` 离线验证：

```starlark
prefix_rule(
    pattern = ["git", ["push", "force-with-lease"]],
    decision = "prompt",
    justification = "force pushes need a human eyeball",
)
prefix_rule(
    pattern = ["rm", "-rf", "/"],
    decision = "forbidden",
    justification = "absolutely not",
)
```

```bash
codex execpolicy check --rules .codex/rules/safety.rules git push --force
# {"matchedRules":[{...}],"decision":"prompt"}
```

适合企业 / 团队场景，比单纯 approval 更细粒度。详见 [`codex-rs/execpolicy/README.md`](https://github.com/openai/codex/blob/main/codex-rs/execpolicy/README.md)。

---

## 高质量提示词与工作模式

来自 GitHub 高 star 实战教程（[shanraisshan/codex-cli-best-practice](https://github.com/shanraisshan/codex-cli-best-practice) 等）的高信号技巧：

### 提示词层面

```
✅ "证明给我看这能用" — 让 Codex 自己跑测试 + git diff main..HEAD 验证
✅ "用你现在掌握的所有信息，重新审视这个方案，给出更优雅的实现"
   （在一次平庸修复后用，能逼出更好的设计）
✅ Codex 自己调试能力强 — 把报错日志贴进去说"修"，别微管理过程
```

### Plan 层面

```
✅ /plan 多文件任务先列计划 — Codex 也会自动 plan，但显式触发更可控
✅ 分阶段 + 每阶段 gated test —— 别让它一次改 30 个文件
✅ 让另一个 Codex（或 Claude Code）以 staff engineer 视角审查计划
✅ 写规格、降歧义 —— 越具体的输入越能给出可用的输出
```

### AGENTS.md 层面

```
✅ 经验法则：随便一个新人能跑 codex → "run the tests" → 一次过
   不行就说明 AGENTS.md 漏了 build/test/setup 命令
✅ 控制在 150 行附近（硬上限是 32 KiB）—— 长 ≠ 好
✅ 行为约束（approval / sandbox / model）写 config.toml，不要写 AGENTS.md
✅ AGENTS.override.md 放个人偏好，别污染团队共享的 AGENTS.md
```

### 多 Agent 与并行

```
✅ 用 multi-agent 给问题扔更多算力 —— 把杂活外包给 subagent，主 thread 保持干净
✅ Test-time compute：一个 agent 写代码，另一个 agent 找 bug —— 独立 context 效果更好
✅ 长开发用 git worktree 给每个 agent 一个隔离的 working tree，避免互相覆盖
```

### 调试

```
✅ 让 Codex 在后台跑你想看日志的服务（codex 的 PTY exec 会正确处理）
✅ 卡住就截图扔给它（图片输入是最被低估的能力）
✅ Agentic search（glob + grep）打 RAG —— 代码漂移得太快，索引永远不准
```

---

## 常见踩坑（社区高频）

| 症状 | 根因 | 出坑 |
|------|------|------|
| 启动直接弹浏览器要求登录 | token 过期 | 重跑 `codex` 走 OAuth；或 `codex login` |
| `429 Too Many Requests` | 触发速率限制 | 等额度恢复；脚本场景考虑切 API key + 限速 |
| CI 任务挂起超时 | 默认 approval 是交互式 | `codex exec --ask-for-approval never` |
| 改了 config.toml 不生效 | 文件路径错 / 配置层叠被覆盖 | TUI 里跑 `/debug-config` 看实际生效的配置层级和 requirements |
| `npm i -g` 报 `EACCES` | 全局目录归 root | 用 nvm/fnm 装 Node，不要 `sudo npm` |
| `which -a codex` 返回多行 | 装重了（npm + brew + binary） | 删多余的，shell rehash |
| 改完文件 Codex 不"看见" | 没在 git workspace 里 / 路径越界 | `codex --cd <project>` 指定根目录 |
| 长 thread 越来越慢 / 涨钱 | 上下文累积 | `/compact` 压缩；或 `/fork` 重开 |
| 多 agent 并行改同一文件冲突 | 主线 + subagent 同时改 | 给 subagent 用 git worktree |
| Linux 沙箱起不来 | 内核 < 5.13 或 Landlock 未启用 | 升级内核（`uname -r` 确认）；旧发行版临时用 `--sandbox read-only` 绕过 |

---

## Codex 与 Claude Code 怎么选

两者最像，但定位不同：

| 维度 | Codex CLI | Claude Code |
|------|-----------|-------------|
| 厂商 | OpenAI | Anthropic |
| 开源 | ✅ Apache-2.0（Rust） | ❌ 闭源 CLI |
| 沙箱 | OS 内核级（Seatbelt / Landlock） | 应用层 + 26 个 Hook |
| 默认账号 | ChatGPT 订阅 | Claude API / Pro |
| 配置文件 | `AGENTS.md` + `config.toml` | `CLAUDE.md` + `settings.json` |
| Plan 模式 | `/plan` 或 Shift+Tab | `/plan` |
| Subagent | TOML 文件 | Markdown 文件 |
| MCP | ✅ | ✅ |
| 国内访问 | 需要 ChatGPT Pro / API key | 需要 Claude API |
| 强项场景 | 终端任务、CI 集成、token 效率 | 大型重构、跨文件依赖、代码风格 |

**经验法则**（社区共识，参考 builder.io / datacamp 等多篇对比）：

> *Codex for keystrokes, Claude Code for commits.*
> Codex 适合"快速迭代 + 沙箱执行"，Claude Code 适合"一次改 12 个文件且依赖图复杂"的精修。

预算敏感且已订阅 ChatGPT → Codex 就是顺手白送的；做大重构、要最强代码质感 → Claude Code 仍是首选。两者并用也很常见。

---

## 模板与配置

`templates/` 目录提供：

- [`AGENTS.md`](./templates/AGENTS.md) — 通用项目指令模板
- [`config.toml`](./templates/config.toml) — 用户级配置模板（含 profiles）
- [`agent-explorer.toml`](./templates/agent-explorer.toml) — 只读探索 subagent 模板
- [`SKILL.md`](./templates/SKILL.md) — Skill 模板（含 Gotchas / 触发器写法范本）

---

## 参考资料

### 官方

- 仓库：[openai/codex](https://github.com/openai/codex)（Apache-2.0，Rust）
- 文档：[developers.openai.com/codex](https://developers.openai.com/codex)
- 安装详解：[docs/install.md](https://github.com/openai/codex/blob/main/docs/install.md)
- 最佳实践：[Best practices](https://developers.openai.com/codex/learn/best-practices)
- 沙箱原理：[Sandboxing](https://developers.openai.com/codex/concepts/sandboxing)
- Slash 命令：[Slash commands](https://developers.openai.com/codex/cli/slash-commands)
- 官方 GitHub Action（CI 集成）：[openai/codex-action](https://github.com/openai/codex-action)
- 官方 Skills 目录：[openai/skills](https://github.com/openai/skills)

### 社区高质量索引（高 star，每条都核实过）

- [**RoggeOhta/awesome-codex-cli**](https://github.com/RoggeOhta/awesome-codex-cli) — 280+ 资源大全（Subagent / Skill / Plugin / MCP / IDE 集成 / CI），按类别整理
- [**shanraisshan/codex-cli-best-practice**](https://github.com/shanraisshan/codex-cli-best-practice) — 50 条战场验证的提示词技巧 + 完整 .codex/ 实现样例（已对齐 v0.125.0）
- [**ComposioHQ/awesome-codex-skills**](https://github.com/ComposioHQ/awesome-codex-skills) — 38 个常用 Skill（开发工具 / 数据分析 / Composio 1000+ SaaS 集成）
- [**VoltAgent/awesome-codex-subagents**](https://github.com/VoltAgent/awesome-codex-subagents) — 136+ subagent 跨 10 个领域（开发 / 安全 / 基建 / 数据 / DX）
- [**hashgraph-online/awesome-codex-plugins**](https://github.com/hashgraph-online/awesome-codex-plugins) — 第一个 Plugin marketplace 索引
- [**agents.md**](https://agents.md) — 跨工具 AGENTS.md 标准（已被 60k+ 项目采用，Codex / Claude Code / Gemini CLI 通用）

### 主流 Workflow 框架

| 框架 | star | 流程 |
|------|------|------|
| [Superpowers](https://github.com/obra/superpowers) | 171k | 头脑风暴 → 写计划 → subagent 驱动 → TDD → review → 合分支 |
| [Spec Kit](https://github.com/github/spec-kit) | 92k | `/speckit.constitution → specify → plan → tasks → implement` |
| [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex) | 27k | `$deep-interview → $ralplan → $ralph` |
| [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) | 16k | `/ce-ideate → brainstorm → plan → work → review → compound` |

### 与 Claude Code 对比

本项目内：[workflows/tool-selection.md](../workflows/tool-selection.md)

> 信息核实截止：**2026-04-30**（codex CLI v0.125.0）。本教程的每条 CLI flag、子命令、slash 命令、config 字段都对照 `codex-rs` 源码核实过；模型能力和定价变化快，最终以 OpenAI 官方文档为准。
