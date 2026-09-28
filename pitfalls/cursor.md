# Cursor 陷阱合集

> Cursor 用过的都知道，它强但也有独特的坑。8 个真实踩坑场景，症状 / 根因 / 出坑 / 预防 四段式展开。
>
> 说明：旧版的 Composer 面板现在叫 **Agent 面板**（Agent / Ask / Plan 三种模式），"Composer" 现在是 Cursor 自研模型的名字。信息更新于 2026-09。
>
> 踩过新坑？提 Issue 或 PR。

---

## 陷阱 1：Agent 脱缰 — 动了你没让它动的文件

**症状**
- 用 Agent 改一个功能，结果 diff 涉及 6 个文件
- 有些文件你都没打开过，它跨目录找到然后顺手改了
- 最糟：它"重构"了 `src/utils/` 某个公共工具，破坏了别的功能

**根因**
Agent 模式默认有权限跨文件修改。它会自己搜索相关文件、自己决定"这个也得改"。没有显式边界时，"相关"的定义由它说了算。

**出坑**
```
停。把所有非 [我指定的文件] 的改动回滚。
只保留 @src/pages/order/list.tsx 这个文件的改动。
```

**预防**
大改动先切到 **Plan 模式**（`Shift+Tab`）让它列出要改的文件，确认后再执行。提示词里**显式圈定范围**：

```
只改这两个文件：
@src/pages/order/list.tsx @src/pages/order/detail.tsx

如果需要改其他文件才能完成，先告诉我，让我决定。
```

或者在 `.cursor/rules/boundaries.mdc` 里加（`alwaysApply: true`）：

```markdown
## Agent 边界
- 除非我 @ 引用了某文件，不要修改它
- src/utils/ src/types/ 目录属于公共代码，改动前必须告知
```

---

## 陷阱 2：Tab 补全一次吐一整页，Esc 来不及按

**症状**
- 你只想写一个变量名，Tab 一按补出来 30 行代码
- 补全的代码看起来 OK 但实际有隐蔽的 bug（比如硬编码数据、错误的类型假设）
- 养成"反手 Undo"习惯后，开发反而变慢

**根因**
Cursor 的 Tab 补全会预测"你接下来想写的一整段"，不是单行补全。遇到函数开头、文件开头这种"信息密集点"，它会直接补出完整函数体。

**出坑**
- 长补全按 `Esc` 直接拒绝
- 已经接受了不对：`Cmd+Z` 撤销，或用 `Cmd+K` 选中这段问"这段有什么问题"

**预防**
- 干扰太多时在 `Cursor Settings → Tab` 里暂时 snooze 或关闭 Tab 补全
- 写**函数签名和类型**再等补全——签名越完整，补全越准（反之越瞎猜）
- 重要逻辑块先写一行注释再等补全：

```typescript
// 计算两个日期之间的工作日，排除周末和中国法定节假日
function countBusinessDays(start: Date, end: Date): number {
  // Tab 补全会基于注释生成正确实现
}
```

---

## 陷阱 3：规则写了一大堆，却没生效

**症状**
- 花半天写了 300 行 `.cursorrules`，或者在 `.cursor/rules/` 下放了一堆 `.md` 文件
- 实际用起来：AI 该违反的还是违反，感觉根本没读
- 新加的规则像"扔进黑洞"

**根因**
常见两种：
1. **文件格式不对**：`.cursor/rules/` 下的规则必须是 `.mdc`，普通 `.md` 没有 frontmatter，会被规则系统直接忽略；根目录 `.cursorrules` 是旧格式，仅作兼容
2. **单条规则太长**：几百行混在一起，重点被淹没，官方建议每条规则控制在 500 行以内

**出坑**
拆到 `.cursor/rules/`（注意是目录，扩展名 `.mdc`）：

```
.cursor/rules/
├── global.mdc          # alwaysApply: true 的核心规则
├── react.mdc           # globs 匹配 .tsx 时加载
├── api.mdc             # globs 匹配 src/api/ 时加载
└── testing.mdc         # globs 匹配 *.test.ts 时加载
```

每个文件加 frontmatter 控制加载：

```markdown
---
description: React 组件规则
globs: src/components/**/*.tsx
alwaysApply: false
---

# React 组件规则
- Props 必须用 interface 定义
- 必须处理 loading 和 error 状态
```

**预防**
- 新项目**一开始就用 `.cursor/rules/*.mdc`**，别用单文件 `.cursorrules`；想跨工具共用，可以写 `AGENTS.md`
- 每条规则聚焦一个主题，写得短而具体
- 太具体、太场景化的规则设成手动触发（不写 `globs`、`alwaysApply: false`），用到再 @ 引用；成套的方法论做成 Skill（`.cursor/skills/`）

---

## 陷阱 4：@ 引用没真传进去

**症状**
- 你说 `@src/types/user.ts 按这个类型改接口`
- AI 生成的代码里的字段名、类型全是它猜的，不是你的真实类型
- 仔细看会发现：它根本没读那个文件

**根因**
常见原因：
1. 路径错了（大小写 / 选错同名文件）
2. 文件很大，Agent 只读了其中一部分
3. 你文件刚改过还没存盘

**出坑**
```
先确认：@src/types/user.ts 这个文件里 User 接口的字段名都是什么？
列出来我对一下，再开始改代码。
```

让 AI 先复述文件内容，确认它**真的读到了**，再让它动手。

**预防**
- 从 @ 弹出的列表里选文件，别手敲路径
- 改完文件**先 Cmd+S 存盘**再 @ 引用
- 超大文件：在提示词里点名具体的函数 / 类名，让它定位到那一段再读

---

## 陷阱 5：Agent / Ask / 行内编辑混用，效率全失

**症状**
- 在 Ask 模式里说"帮我重构这个模块"——它给你一大堆建议文字，不改代码
- 在 Agent 模式里问"这段代码怎么理解"——它不只回答，还顺手开始改
- 你来回切换，每次都选错模式

**根因**
- **Agent 模式**：自主改代码、跑命令
- **Ask 模式**：只读问答，不改代码
- **Plan 模式**：先出方案，确认后再执行
- **行内编辑（`Cmd+K`）**：只改选中区域

Agent 面板（`Cmd+I` / `Cmd+L`）里用 `Shift+Tab` 切模式，新手容易忽略当前在哪个模式。

**出坑**
切错模式了：`Shift+Tab` 切到正确模式，重新发一次。

**预防**
记住**用途和入口的对应**：

| 你想做什么 | 用哪个 | 入口 |
|-----------|-------|-------|
| 问问题、理解代码 | Ask 模式 | Agent 面板 + `Shift+Tab` |
| 改选中的一段代码 | 行内编辑 | `Cmd+K` |
| 跨文件大改动 | Plan → Agent 模式 | Agent 面板 + `Shift+Tab` |

---

## 陷阱 6：模型切换导致风格不一致

**症状**
- 你在 Cursor 里一半时间用 Claude，一半用 Composer 或 GPT
- 同一个项目里代码风格分裂：有的地方严谨地写类型，有的地方随意 `any`
- 你自己都没意识到是模型切换导致的

**根因**
Cursor 支持多模型（Composer 2.5、Claude、GPT-5.x、Gemini、Grok 等），不同模型的"默认风格"不同：有的倾向严谨、主动加类型和错误处理，有的倾向简洁、少注释。

用 Auto（Cursor Router）时，系统按你选的 Cost / Balance / Intelligence 偏好自动路由，每次用的模型可能不同，这个问题会更隐蔽。

**出坑**
把风格规则写进 `.cursor/rules/global.mdc`（`alwaysApply: true`），不管用哪个模型都会遵守：

```markdown
# 代码风格（跨模型一致）
- 必须用 TypeScript，不用 any
- 函数必须有返回值类型标注
- 错误用 Result<T, Error> 包装，不抛异常
```

**预防**
- 风格靠 **rules + lint/格式化工具** 兜底，而不是靠固定某个模型
- 用 Auto 时按任务选偏好：日常小改用 Cost / Balance，复杂重构用 Intelligence 或手动指定最强模型
- 对风格一致性要求高的大任务，手动指定一个模型从头做到尾

---

## 陷阱 7：还在找 Notepads — 旧上下文没迁移

**症状**
- 升级后找不到 Notepads 面板，之前存的 API 规范、约定"没了"
- 或者还留着一些早就过时的上下文片段（旧 API 设计、废弃的代码风格），AI 照着给了过时方案

**根因**
Notepads 于 2025 年 10 月弃用、在 Cursor 2.0 移除。它本来就是**手动管理**的上下文，不会自动更新，项目演进几个月后就和真实代码脱节。

**出坑**
把还有用的内容迁到新机制：
- 稳定约定（API 返回格式、认证方式）→ `.cursor/rules/*.mdc`，设成手动触发，用 `@规则名` 引用
- 成套的方法论 / 流程 → Skill（`.cursor/skills/`）
- 易变内容（当前在做的功能）→ 不存，直接 `@Files` / `@Folders` 引用实时代码
- 迁移时顺手删掉过时内容

**预防**
- 规则文件进 Git，和代码一起评审、一起演进
- 规则里写明适用范围，定期复审："半年没动过的规则都看一遍"

---

## 陷阱 8：索引过期 — @ 引用到已删除的文件

**症状**
- 你重命名或删除了某个文件
- @ 还能引用到它（带着旧内容）
- AI 基于旧文件给建议，你按建议改，编译报错"文件不存在"

**根因**
Cursor 的代码库索引**不是实时更新**。删除/重命名后，索引可能还保留旧条目一段时间。

**出坑**
- 在 Cursor Settings 的索引设置里查看索引状态，必要时手动重新同步（具体入口以当前版本为准）
- 或者直接让 Agent 用搜索 / 终端确认文件是否存在，再继续

**预防**
- 大规模重命名/删除后，确认索引已更新再依赖 @ 引用
- 发现 @ 引用结果奇怪，第一反应先检查索引，不要怀疑 AI

---

## 贡献新陷阱

模板见 [claude-code.md 结尾](./claude-code.md#补充遇到新陷阱怎么办)。

---

## 相关方法论

- [Cursor 完整指南](../cursor/README.md)
- [common/context-management.md](../common/context-management.md) — 上下文管理通用策略
- [workflows/scenarios.md](../workflows/scenarios.md) — 含 Cursor + Claude Code 协作场景
