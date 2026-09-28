# Devin Desktop（原 Windsurf）最佳实践

> **Windsurf 已更名为 Devin Desktop。** Cognition 于 2025 年 7 月收购 Windsurf，2026-06-02 通过自动更新正式改名，官网从 windsurf.com 迁到 [devin.ai](https://devin.ai)。原有设置、快捷键、扩展会自动迁移，老用户无需重装。
>
> 它仍是基于 VS Code 的 AI IDE，但定位从"带 Agent 的编辑器"变成了**本地 + 云端 Agent 的指挥中心**：本地 Agent 从 Cascade 换成了用 Rust 重写的 **Devin Local**（支持子 Agent），首页是管理所有 Agent 的看板。它依然会感知你的编辑、终端输出等操作（官方现在叫 "real-time awareness"，不再用 "Flows" 这个词）。
>
> 信息更新于 2026-09。

---

## 核心概念

| 概念 | 说明 | 用途 |
|------|------|------|
| **Devin Local** | 本地 Agent（取代 Cascade），支持子 Agent | 在编辑器里完成多步骤任务 |
| **Code / Plan / Ask 模式** | Code（默认，直接改代码）/ Plan（先出方案）/ Ask（只读问答），`⌘.` 切换 | 按任务选模式 |
| **Agent Command Center** | 看板视图，统一管理本地和云端 Agent | 并行跑多个任务 |
| **Spaces** | 把会话、PR、文件、上下文归到一组，Agent 之间共享上下文 | 按项目/需求组织工作 |
| **Rules** | `.devin/rules/*.md`（推荐）或 `.windsurf/rules/*.md` | 项目级规则配置 |
| **AGENTS.md** | 任意目录都可放，根目录总是生效，子目录按目录范围生效 | 跨工具通用的规则 |
| **Workflows / Skills** | `.devin/workflows/` 里的 Markdown，用 `/名字` 调用；Devin Local 改用 Skills | 可复用的流程 |
| **Hooks** | `.devin/hooks.json`，12 种事件 | 在 Agent 动作前后跑脚本 |
| **@引用** | `@file` `@folder` `@web` 等 | 精确指定上下文 |

---

## 快速上手

### 安装

从 [devin.ai/download](https://devin.ai/download) 下载，支持 macOS / Windows / Linux。基于 VS Code，现有 VS Code 扩展大部分兼容。已经装了 Windsurf 的会自动更新成 Devin Desktop，首次启动可选择从 Windsurf 迁移设置。

命令行启动命令从 `surf` / `windsurf` 换成了 `devin-desktop`（旧命令暂时保留）。

### 项目规则 — `.devin/rules/`

在项目里创建 `.devin/rules/` 目录（老项目的 `.windsurf/rules/` 也还能读，两者都有时 `.devin/rules/` 优先），每个规则一个 `.md` 文件，单文件上限 **12,000 字符**：

```markdown
---
trigger: always_on
---

# 项目规则

## 技术栈
Vue 3 + TypeScript + Pinia + Element Plus

## 代码规范
- 使用 Composition API（setup 语法糖）
- 组件用 PascalCase，文件用 kebab-case
- Store 按功能模块拆分
- API 请求统一走 src/api/ 下的封装

## Agent 行为
- 修改组件时自动检查 Props 类型是否正确
- 修改 API 接口时提醒更新对应的 TypeScript 类型
- 不要自动重构我没要求改的代码
```

frontmatter 里的 `trigger` 决定规则什么时候加载：

| trigger | 行为 |
|---------|------|
| `always_on` | 每次对话都完整加载 |
| `model_decision` | 只给模型看 description，需要时再读全文 |
| `glob` | 操作的文件匹配 glob 时加载 |
| `manual` | 只在你 `@规则名` 时加载 |

其他规则来源：

- **全局规则**：`global_rules.md`（`~/.codeium/windsurf/memories/global_rules.md`，上限 6,000 字符），对所有项目生效
- **AGENTS.md**：放根目录相当于 `always_on`，放子目录只对该目录生效——和 Claude Code、Cursor 等工具共用一份规则很方便
- **`.windsurfrules`**：根目录单文件，**仅作兼容保留**，新项目别再用

> Cursor 用户可以把 `.cursor/rules` 导入到 `.devin/rules/`。

### 用好实时感知

Devin Local 会感知你的操作（打开的文件、编辑、终端输出）。利用这一点：

```
1. 先手动打开几个相关文件（让 Agent 知道你在关注什么）
2. 做一个小修改（让 Agent 理解你的意图）
3. 这时候再提问，比冷启动直接问更准确
```

---

## 提示词技巧

### 1. 大任务先 Plan 再 Code

按 `⌘.` 切到 Plan 模式，让它先出方案，确认后切回 Code 模式执行：

```
[Plan 模式]
把 src/views/user/ 下的用户管理页面从 Options API 迁移到 Composition API。
保持功能不变，只改写法。先列出要改的文件和每个文件的改动点。

[确认方案后切到 Code 模式]
按刚才的方案执行，一个文件一个文件来，每个文件改完让我确认。
```

只想问问题、不想让它动代码时用 **Ask 模式**（只读）。

### 2. 利用实时感知

```
# 你刚在终端跑了测试，看到了报错
# Agent 已经感知到了，直接说：
刚才测试报错了，帮我看看什么原因。
# 通常不需要贴报错信息
```

### 3. @ 引用

```
@src/api/user.ts @src/types/user.ts
这两个文件的类型定义不一致，帮我统一。
以 types/user.ts 为准。
```

---

## 进阶技巧

### Workflows 与 Skills

把重复流程写成 Markdown 放进 `.devin/workflows/`（单文件上限 12,000 字符），在对话里用 `/文件名` 调用，例如 `/release`。Workflow 只能手动触发。

注意：**Devin Local 不支持 Workflows**，官方建议迁移到 Skills（`.devin/skills/`）——Skills 可以由 Agent 按需自动调用。

### Hooks

在 `.devin/hooks.json` 里配置 Hooks，支持 12 种事件（比如 Agent 读文件、写文件、跑命令前后）。**pre-hook 脚本以 exit code 2 退出会阻止这次操作**，适合拦截改 `.env`、跑危险命令这类场景。

### 并行 Agent：Agent Command Center

Devin Desktop 的首页是 Agent Command Center——一个看板，本地 Agent 和云端 Devin 的会话都在上面。适合的用法：

- 本地 Agent 做需要你盯着的改动，云端 Devin 跑耗时的独立任务
- 用 **Spaces** 把同一个需求的会话、PR、文件归到一起，Agent 之间共享上下文
- 通过 ACP（Agent Client Protocol）接入第三方 Agent（Codex、Claude Agent、OpenCode 等），和原生会话一样在看板里管理

### 模型选择

模型选择器里有自研的 SWE 系列（SWE-1.6 / SWE-1.7 / SWE-2）、自动选模型的 **Adaptive**，以及 Claude、GPT、Gemini、Grok、Kimi、GLM 等第三方模型。日常任务用 SWE 系列或 Adaptive 更省额度，复杂重构再切到最强的第三方模型。

### 价格

| 方案 | 价格 |
|------|------|
| Free | $0 |
| Pro | $20/月 |
| Max | $200/月 |
| Teams | $80/月 + $40/席位 |

以 [devin.ai/pricing](https://devin.ai/pricing) 为准。

---

## 与 Cursor 的区别

| 维度 | Devin Desktop | Cursor |
|------|---------|--------|
| 核心理念 | **Agent 指挥中心**，本地 + 云端 Agent 统一看板 | **编辑器优先**，Agents Window 管理并行 Agent |
| 本地 Agent | Devin Local（Code / Plan / Ask） | Agent（Agent / Ask / Plan） |
| 上下文 | 实时感知你的操作 + @ 引用 | @ 引用 + 代码库索引 |
| Rules | `.devin/rules/*.md`，`trigger` 控制加载 | `.cursor/rules/*.mdc`，`globs`/`alwaysApply` 控制加载 |
| 模型 | SWE 系列自研 + Claude/GPT/Gemini 等 | Composer 自研 + Claude/GPT/Gemini 等 |
| 适合 | 想同时调度多个本地/云端 Agent 的人 | 喜欢在编辑器里精确控制的人 |

---

## 常见陷阱

| 陷阱 | 说明 | 解决 |
|------|------|------|
| 规则写在 `.windsurfrules` | 老单文件格式只是兼容保留 | 迁到 `.devin/rules/*.md`，用 `trigger` 按需加载 |
| 规则被截断 | 单文件超过 12,000 字符 | 按主题拆成多个规则文件 |
| 感知上下文错乱 | 切了太多文件，Agent 搞不清你在做什么 | 开新会话重新开始 |
| Code 模式范围失控 | 改了不该改的文件 | 先用 Plan 模式确认范围，或用 @ 引用限定 |
| Workflow 在 Devin Local 下不生效 | Devin Local 不支持 Workflows | 迁移成 Skills |

---

## 配置模板

| 模板 | 用途 |
|------|------|
| [windsurfrules.md](templates/windsurfrules.md) | 项目规则模板（Vue 3 + TypeScript），复制到 `.devin/rules/project.md`（旧项目也可放 `.windsurf/rules/`） |

---

## 延伸阅读

- [Devin Desktop 官方文档](https://docs.devin.ai/desktop)
- [Devin Desktop FAQ](https://docs.devin.ai/desktop/devin-desktop-faq) — 从 Windsurf 迁移的细节
- [Windsurf is now Devin Desktop](https://devin.ai/blog/windsurf-is-now-devin-desktop) — 官方更名公告
- [awesome-windsurf](https://github.com/detailobsessed/awesome-windsurf) — 社区资源集合
- [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) — Skills 方法论（也支持 Windsurf / Devin Desktop）
