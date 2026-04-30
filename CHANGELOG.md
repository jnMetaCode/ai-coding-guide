# 更新日志 · Changelog

> 完整提交历史见 `git log`。本文档记录面向用户的重要更新。

## 2026-04（下半月） · 新增 OpenAI Codex CLI 教程

### 🆕 新增工具：Codex CLI（10 款工具齐了）

**📂 [`codex/`](codex/) — OpenAI 官方开源终端 Agent（Rust，Apache-2.0）**
- 基于 v0.125.0（2026-04-24）+ developers.openai.com/codex 官方文档核实
- 完整覆盖：核心概念 / 安装认证 / AGENTS.md 加载链 / Approval & Sandbox 双旋钮 / TOML Subagent / MCP / Skill / Plan Mode
- 与 Claude Code 横向对比（沙箱实现、定价模式、强项场景）
- 10 个高频踩坑（CI 卡 approval、配置不生效、多版本冲突等）
- 模板：`AGENTS.md` + `config.toml`（含 4 个 profile）+ `agent-explorer.toml`

### 🔄 同步更新

- **README.md / README.en.md**：「9 款工具」→「10 款」，工具表新增 Codex CLI 行，画像推荐路径加入"已订阅 ChatGPT Plus/Pro"
- **cheatsheet.md / cheatsheet.en.md**：能力矩阵新增 Codex 列与「沙箱机制」维度，配置文件表加入 AGENTS.md，命令速查新增 Codex 段，决策流与组合推荐双向更新

### 🔬 二次源码核实修正

教程发布前直接读 `codex-rs` 源码（`utils/cli/src/shared_options.rs`、`tui/src/cli.rs`、`exec/src/cli.rs`、`cli/src/main.rs`、`models-manager/models.json`）核对，修正 6 处不准确：

1. **Linux 沙箱**：`bubblewrap` → `Landlock` 内核 LSM（`debug_sandbox.rs` 直接 import `codex_sandboxing::landlock`）
2. **`--full-auto` 已废弃移除**：源码警告 *"`--full-auto` is deprecated; use `--sandbox workspace-write` instead."*，所有示例统一替换
3. **`--output-format json` 不存在**：实际 flag 是 `--json`（输出 JSONL，不是单 JSON）
4. **`/side` 不存在**：从未在 `slash_commands` 文档里出现，删除；改成真实存在的 `/diff` `/mention` `/debug-config` `/new` `/clear`
5. **`codex config path` / `codex config validate` 不存在**：CLI 没有 `config` 子命令，应该用 TUI 内的 `/debug-config`
6. **新增 `--yolo` / `--add-dir`**：源码确认这两个 flag 是当前推荐的危险/扩展用法

模型名校验：`gpt-5.5` / `gpt-5.4` / `gpt-5.3-codex` 全部命中 `models-manager/models.json` 官方列表。

### 🔬 第四轮 schema 级核实（config / subagent TOML 结构）

直接对照 Rust struct 定义（`config_toml.rs::ConfigToml`、`profile_toml.rs::ConfigProfile`、`config_toml.rs::AgentsToml/AgentRoleToml`、`core/src/config/agent_roles.rs::RawAgentRoleFileToml`）：

- **`web_search` 是顶层 key**（合法值 `disabled`/`cached`/`live`），不在 `[features]` 下；template 已修
- **`multi_agent` 不是 features 简单 bool**（多 agent 走 `[multi_agent_v2]` 自有结构）；template 已删
- **subagent TOML 字段** = `RawAgentRoleFileToml` flatten 了整个 `ConfigToml`，所以 `name` / `description` / `developer_instructions` / `model` / `model_reasoning_effort` / `sandbox_mode` / `approval_policy` 都合法；`#[serde(deny_unknown_fields)]` 兜底拼错会报错
- **`model_reasoning_effort` 合法值**：`none` / `minimal` / `low` / `medium`(默认) / `high` / `xhigh`（来源 `protocol/src/openai_models.rs::ReasoningEffort`）
- **`[agents]` 段并发参数**：`max_threads` / `max_depth` / `job_max_runtime_seconds` / `interrupt_message` 与源码 `AgentsToml` 结构一致
- **`AGENTS_MD_MAX_BYTES = 32 * 1024`**（即 32 KiB）—— 默认值已直接在源码确认

### 📚 v2 内容补完（基于 GitHub 高 star 实战教程）

参考 [RoggeOhta/awesome-codex-cli](https://github.com/RoggeOhta/awesome-codex-cli)（280+ 资源）和 [shanraisshan/codex-cli-best-practice](https://github.com/shanraisshan/codex-cli-best-practice)（50 条战场技巧）后，补完 4 个原本没覆盖的真实功能：

- **Skills 真实文件夹结构**：原 v1 写成单文件 `SKILL.md`，源码 `core-skills/loader.rs` 确认是 **目录** 含 `references/` `scripts/` `examples/` `agents/openai.yaml`；canonical 路径 `~/.agents/skills/`（`~/.codex/skills/` 已废弃）；新增 `$skill-name` 显式调用语法
- **Hooks**（beta）：6 个事件 `PreToolUse` / `PermissionRequest` / `PostToolUse` / `SessionStart` / `UserPromptSubmit` / `Stop`，源码引擎名 `ClaudeHooksEngine`——schema 直接复用 Claude Code 的 `hooks.json`，迁移零改动
- **Memories**（beta）：`/memories` slash 命令 + `[memories] no_memories_if_mcp_or_web_search` 安全开关
- **Plugins / Marketplace**（v0.121.0+）：`codex plugin marketplace add/upgrade/remove`，TUI `/plugins`
- **Fast Mode**：`/fast on|off|status`，gpt-5.4 1.5× 速度 / 2× 额度

新增「高质量提示词与工作模式」整段，集合社区 5 类高信号技巧（提示词 / Plan / AGENTS.md / 多 Agent / 调试），并在 References 段补 6 个高 star 索引和 4 个主流 workflow 框架（Superpowers / Spec Kit / oh-my-codex / Compound Engineering）。

新增 [`templates/SKILL.md`](codex/templates/SKILL.md) 模板（带触发器写法 + Gotchas 范本）。

### 🔬 第六轮源码核实 + v3 内容补完

直接读 `codex-rs/tui/src/slash_command.rs::SlashCommand` 枚举（46 个真实 slash 命令），抓出第三轮的过修正：

- **`/side` 是真实存在的命令**（"start a side conversation in an ephemeral fork"）—— 第三轮凭 WebFetch 摘要错删，现已恢复
- **`/fast` 也确实在 enum 里**（"toggle Fast mode to enable fastest inference with increased plan usage"）—— v2 加上是对的
- **slash 命令表扩到 18 条**：补 `/skills` `/memories` `/plugins` `/apps` `/goal` `/rename` `/feedback` `/approvals` 等

`MemoriesToml` 源码确认 canonical 字段是 **`disable_on_external_context`**，`no_memories_if_mcp_or_web_search` 是它的 serde alias（向后兼容），文档全部改用 canonical 名。

新增 4 节真功能（每节都对照源码核实）：

- **§13 OSS 本地模型** — `--oss --local-provider lmstudio|ollama` （来源 `utils/oss/src/lib.rs`），完全离线 + 零 API 成本
- **§14 官方 GitHub Action 实战** — `openai/codex-action@v1`（Apache-2.0，953 stars）的 PR 自动 review 完整 workflow YAML
- **§15 Codex 作为 MCP server** — `codex mcp-server` 暴露 `codex()` + `codex-reply()` 工具，让其他 Agent 反向调用
- **§16 Rules / Execpolicy** — Starlark DSL（`prefix_rule()` + `host_executable()`），`codex execpolicy check` 离线验证

---

## 2026-04 · 重大更新：从"工具教程"到"完整落地手册"

### 🆕 新增模块

**📋 [速查表](cheatsheet.md) `cheatsheet.md`**
- 9 工具 × 13 维度横向能力矩阵
- 30 秒决策表（按需求选工具）
- 每个工具的配置文件位置 + 核心命令 + 快捷键速查
- 选型决策树 + 5 个推荐组合

**⚠️ [陷阱合集](pitfalls/) `pitfalls/`**
- 4 个工具共 **31 个深度陷阱**，按 "症状 / 根因 / 出坑 / 预防" 四段式展开
- Claude Code (8) / Cursor (8) / GitHub Copilot (8) / Aider (7)
- Windsurf / Gemini CLI / Kiro / Trae / OpenClaw 待社区贡献

**🎯 [实战场景脚本](workflows/scenarios.md) `workflows/scenarios.md`**
- 3 个端到端对话脚本：重构模块 / Cursor+Claude Code 协作 / 补老项目测试
- 通用"打断话术"集锦

**🧭 [画像推荐路径](README.md) 主 README 重构**
- 按 6 种用户画像推荐阅读路径（新手 / 前端 / 后端 / Copilot 迁移 / 控成本 / 团队协作）
- 顶部加入速查表入口

**📚 [延伸学习资源](resources.md) `resources.md`**
- 20+ 精选外部资源，分 7 类（Prompt 工程 / MCP / Agent / 中文资源 / 博客等）
- 每条三要素：链接 + 量级 + "什么场景值得看"

**🛡️ CI 自动守护 `.github/workflows/link-check.yml`**
- lychee 扫 Markdown 内外链接
- 双语对照一致性校验（每个 `xxx.md` 必须有 `xxx.en.md`）
- 每周一 cron 捕捉外链 rot

**📝 [贡献指南](CONTRIBUTING.md) 重写 + 英文版**
- 明确贡献类型按优先级排序（陷阱 > 技巧 > 场景 > 修正 > 翻译）
- 加 `CONTRIBUTING.en.md` 英文版

### 🔧 Fixes

- **agency-agents-zh 角色数 187 → 211**（12 处引用统一）
- **Aider 示例模型名 `claude-3-5-sonnet` → `claude-sonnet-4-5`**（13 处）
- **Copilot 陷阱 7 措辞修正**（"静默降级" → "排队或拒绝"）
- **英文 README 锚点修复**（`#-9-tool-guides` → `#9-tool-guides`）
- **英文 README 新手推荐工具**：Trae → Copilot/Cursor Free（国际用户适配）
- **cheatsheet 删除无法确定的 Esc Esc 描述**

### 📊 变化统计

| 项目 | 更新前 | 更新后 |
|------|-------|-------|
| Markdown 文件数 | ~42 | ~65 (+23) |
| 双语对照覆盖 | 部分 | **100%**（templates 除外） |
| CI workflow | 0 | 1（link + bilingual） |
| 陷阱合集 | 各 README 4-5 行速查 | 31 个深度展开 |
| 速查 / 决策页 | 无 | cheatsheet.md |
| 画像推荐 | 线性三步 | 6 种画像路径 |

---

## 2026-04 以前

参考 `git log` 查看历史。早期重点：

- 9 款工具独立 README
- 7 套通用方法论（prompting / debugging / testing / etc.）
- 3 个多工具协作工作流
- 中英双语初始化（大部分章节）
- 可复制的配置模板
