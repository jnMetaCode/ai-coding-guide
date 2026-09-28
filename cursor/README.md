# Cursor 最佳实践

> Cursor 是基于 VS Code 的 AI IDE，核心功能是 Tab 补全、Agent 面板（Agent / Ask / Plan 三种模式）和行内编辑。它的优势在于和编辑器的深度集成——选中代码直接对话、在编辑器内实时预览修改。
>
> 注意：旧版的 "Composer 面板" 已改名为 **Agent 面板**；现在 "Composer" 指的是 Cursor 自研的模型（如 Composer 2.5）。
>
> 2026-08-14 SpaceX 完成对 Cursor 的收购（[官方公告](https://cursor.com/blog/joining-spacex)）。信息更新于 2026-09。

---

## 核心概念

| 概念 | 说明 | 用途 |
|------|------|------|
| **Tab 补全** | 基于上下文的代码补全 | 日常编码提速 |
| **Agent 面板** | 侧边栏，`Shift+Tab` 在 Agent / Ask / Plan 模式间切换 | Agent 跨文件改代码；Ask 只读问答；Plan 先出方案 |
| **Agents Window** | Cursor 3 起的多 Agent 窗口，本地 / worktree / 云端 Agent 并行 | 同时跑多个任务 |
| **Rules** | `.cursor/rules/*.mdc` 规则文件（必须是 `.mdc`） | 控制 AI 行为 |
| **AGENTS.md** | 根目录或任意子目录的 Markdown 指令 | 跨工具通用的规则 |
| **Skills / Subagents / Hooks** | `.cursor/skills/`、`.cursor/agents/`、`.cursor/hooks.json` | 可复用方法论、专项子 Agent、动作前后跑脚本 |
| **@引用** | `@Files` `@Folders` `@Terminals` `@Chats` `@Commit` `@Branch` `@Browser` | 精确指定上下文 |

---

## 快速上手

### .cursor/rules/ — 项目规则

在 `.cursor/rules/` 下放规则文件，**扩展名必须是 `.mdc`**（普通 `.md` 没有 frontmatter，会被规则系统忽略）。根目录单文件 `.cursorrules` 是旧格式，仅作兼容；也可以用 `AGENTS.md`（支持放在子目录）。

`.cursor/rules/project.mdc`：

```markdown
---
description: 项目通用规则
alwaysApply: true
---

# 项目规则

## 技术栈
- React 18 + TypeScript + Tailwind CSS
- 状态管理：Zustand
- 路由：React Router v6
- 测试：Vitest + Testing Library

## 代码风格
- 函数组件 + Hooks，不用 Class 组件
- Props 用 interface 定义，不用 type
- 文件命名 kebab-case，组件命名 PascalCase
- 每个组件一个文件

## 禁止
- 不要用 any 类型
- 不要用 useEffect 做数据获取，用 TanStack Query
- 不要直接操作 DOM，用 React ref
```

### @ 引用技巧

```
# 引用文件
@src/components/Button.tsx 这个组件的 Props 类型不对，帮我修一下

# 引用文件夹
@src/api/ 这些接口的错误处理不统一，帮我统一改成...

# 引用终端
@Terminals 看看刚才的报错信息，帮我修

# 引用 Git 改动
@Branch 帮我 review 这个分支相对 main 的改动

# 参考文档：直接贴链接让 Agent 查阅
参考 https://tanstack.com/query/latest ，帮我把 useEffect 里的数据获取改成 useQuery
```

> 不确定哪些文件相关时可以不 @，Agent 会自己搜索代码库。

---

## 提示词技巧

### 1. Agent 大任务拆解

大任务可以先切到 **Plan 模式**（`Shift+Tab`）让它出方案，确认后再切回 Agent 模式执行：

```
按以下步骤执行：
1. 先读 src/pages/ 下所有页面组件，理解路由结构
2. 创建 src/layouts/DashboardLayout.tsx 统一布局
3. 把所有页面组件改成使用新布局
4. 确保路由配置正确
每步完成后暂停，等我确认再继续。
```

### 2. 选中代码直接对话

选中一段代码后按 `Cmd+L`（macOS）打开 Agent 面板（选中内容自动带入），纯问答可切到 Ask 模式：

```
# 选中一段复杂的正则表达式
解释这个正则在做什么，有没有边界情况没覆盖到？

# 选中一个函数
这个函数的时间复杂度是多少？有更优的写法吗？

# 选中一段样式代码
把这段 CSS 改成 Tailwind 的写法
```

### 3. 把常用上下文写成规则

Notepads 已于 2025 年 10 月弃用、在 2.0 版本移除。原来放 Notepad 的稳定约定，改写成一条**手动触发的规则**（或 Skill），用到时 @ 引用；易变的内容直接用 `@Files` 引用实时代码。

`.cursor/rules/api-spec.mdc`：

```markdown
---
description: API 返回格式与错误码规范
alwaysApply: false
---

所有 API 返回格式：
{ code: number, data: T, message: string }

错误码：
- 400: 参数错误
- 401: 未认证
- 403: 无权限
- 500: 服务器错误

认证方式：Bearer Token in Authorization header
```

对话时引用：`@api-spec 按这个格式实现用户列表接口`

---

## 进阶技巧

### Rules 分文件管理

```
.cursor/rules/
├── global.mdc         # 全局规则（代码风格、命名等）
├── react.mdc          # React 相关规则
├── api.mdc            # API 开发规则
├── testing.mdc        # 测试规则
└── security.mdc       # 安全规则
```

每个文件用 frontmatter 的 `description` / `globs` / `alwaysApply` 决定规则类型：

| 类型 | 写法 | 何时加载 |
|------|------|---------|
| Always Apply | `alwaysApply: true` | 每次对话 |
| Apply Intelligently | 只写 `description` | Agent 根据描述判断是否需要 |
| Apply to Specific Files | 写 `globs` | 涉及匹配文件时 |
| Apply Manually | 都不写 | 你 @ 引用时 |

```markdown
---
description: React 组件规则
globs: src/components/**/*.tsx
alwaysApply: false
---

# React 组件规则
- 所有组件必须有 displayName
- Props 超过 3 个必须用 interface 拆分
- 必须处理 loading 和 error 状态
```

### Skills、Subagents、Hooks

| 能力 | 位置 | 说明 |
|------|------|------|
| Skills | `.cursor/skills/`、`.agents/skills/`、`.claude/skills/` | 可复用的方法论，Agent 按需加载 |
| Subagents | `.cursor/agents/`（也会读 `.claude/agents/`） | 专项子 Agent，如代码审查、写测试 |
| Hooks | `.cursor/hooks.json` | 在 Agent 动作前后跑脚本（如拦截危险命令） |

### 用 superpowers-zh 增强 Skills

手动写方法论太慢？用 superpowers-zh 一键安装：

```bash
cd /your/project
npx superpowers-zh
# 包含 brainstorming、debugging、verification 等 skill
```

这些是 **Skill**，应放在 Cursor 的 Skills 目录（`.cursor/skills/`、`.agents/skills/` 或 `.claude/skills/`），而不是 `.cursor/rules/`。安装后 Agent 会在相关任务中按需加载。

### 模型选择策略

| 场景 | 推荐模型 | 原因 |
|------|---------|------|
| 日常 Agent 任务 | Composer 2.5 | Cursor 自研，速度快、成本低 |
| 简单问答 | Claude Sonnet / GPT-5.x | 性价比高 |
| 复杂重构 / 大任务 | Claude Opus / GPT-5.x | 理解力强，多文件协调好 |
| 不想手动挑 | Auto（Cursor Router） | 按 Cost / Balance / Intelligence 偏好自动路由 |

列表里还有 Grok 4.x、Gemini、Kimi、GLM 等，以 `Cursor Settings > Models` 实际显示为准。

### 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Tab` | 接受补全 |
| `Cmd+I` / `Cmd+L` | 打开/关闭 Agent 侧边栏（选中代码自动带入） |
| `Shift+Tab` | 在 Agent / Ask / Plan 模式间切换 |
| `Cmd+E` | 切换 Agent 布局 |
| `Cmd+K` | 行内编辑（选中代码后） |
| `Cmd+Shift+L` | 把选中代码加入 Agent 上下文 |

### 2026 新增

- **Agents Window**（Cursor 3，2026-04-02）：并行运行本地 / worktree / 云端 Agent
- **Plan 模式**：先出方案再动手
- **`/loop`**：让 Agent 循环执行任务
- **云端子 Agent**、**Automations**（自动触发 Agent）
- **Cursor Router**：Auto 模型路由，可选 Cost / Balance / Intelligence
- **Bugbot + `/review`**：PR 与本地代码审查
- **Projects 协调 Agent**：由一个 Agent 统筹多个 Agent 推进项目
- **iOS App**：在手机上查看和指挥 Agent

---

## 常见陷阱

| 陷阱 | 说明 | 解决 |
|------|------|------|
| 规则不生效 | 在 `.cursor/rules/` 里放了 `.md` 文件 | 改成 `.mdc` 并写 frontmatter |
| 规则太长 | 单个规则几千行，AI 记不住 | 官方建议单条规则 < 500 行，拆成多个 `.mdc` 用 globs 按需加载 |
| Agent 失控 | Agent 模式改了不该改的文件 | 先用 Plan 模式确认范围，用 `@Files` 限定，或在 rules 里标明禁区 |
| 补全太激进 | Tab 补全一次生成太多代码 | 按 `Esc` 拒绝；`Cursor Settings → Tab` 里可暂停（snooze）或关闭 |
| 上下文不够 | AI 不理解项目结构 | 用 `@Folders` 引用关键目录，写好 rules / `AGENTS.md` |

👉 **深度展开版**：[Cursor 陷阱合集](../pitfalls/cursor.md) — 8 个真实踩坑场景（Agent 脱缰 / @ 引用失效 / Notepads 迁移 等），每个带症状 / 根因 / 出坑 / 预防

---

## 配置模板

复制到你的项目 `.cursor/rules/` 目录下，**并把扩展名改成 `.mdc`**（如 `global.mdc`、`api.mdc`）：

| 模板 | 用途 |
|------|------|
| [global.cursorrules.md](templates/global.cursorrules.md) | 全局规则（代码风格、命名、禁止事项），保存为 `.cursor/rules/global.mdc` |
| [api.cursorrules.md](templates/api.cursorrules.md) | API 开发规则（仅在 API 目录下生效），保存为 `.cursor/rules/api.mdc` |

### 模型配置

Cursor 的模型选择在设置界面（`Cursor Settings > Models`）中配置，不需要手动编辑 JSON。

---

## 延伸阅读

- [Cursor 官方文档](https://cursor.com/docs)
- [Cursor Rules 文档](https://cursor.com/docs/context/rules)
- [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) — 社区 Rules 集合（38k+ star）
- [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) — Skills 方法论（也支持 Cursor）
