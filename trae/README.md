# Trae 最佳实践

> Trae 是字节跳动推出的 AI IDE（基于 VS Code），有免费档可用。对中国开发者友好——界面支持中文，另有面向国内的独立版本。适合入门 AI 编程和预算敏感的团队。
>
> ⚠️ **2025-2026 重要变化**：
> - **不再提供 Claude**：2025-09 Anthropic 限制中国控股企业使用 Claude 后，Trae 已下架全部 Claude 模型。
> - **改名**：IDE 于 2026-08 更名为 **TraeCode**；原 SOLO 于 2026-06-09 更名为 **TRAE Work**。trae.ai 现在提供 TraeCode 和 TraeWork 两个下载。
> - **两个版本**：国际版 [trae.ai](https://trae.ai) 与国内版 [trae.cn](https://www.trae.cn) 是独立产品，国内版接入国内模型、国内网络直连（可用模型以国内版官网为准）。

---

## 核心概念

| 概念 | 说明 | 用途 |
|------|------|------|
| **Agent** | 内置 Agent（旧版中叫 Builder）+ 自定义 Agent（提示词 + 工具 + MCP），另有 SOLO Coder | 复杂任务、跨文件修改 |
| **Chat** | 侧边栏对话 | 问答、理解代码 |
| **补全** | 行内代码补全 | 日常编码 |
| **Rules** | `.trae/rules/` 下任意 `.md` | 项目级规则 |
| **MCP** | MCP 市场一键添加，或项目级 `.trae/mcp.json` | 接入外部工具 |
| **@引用** | `@file` `@folder` `@web` | 精确指定上下文 |

---

## 快速上手

### 安装

从 [trae.ai](https://trae.ai) 下载 TraeCode（国内用户可用 [trae.cn](https://www.trae.cn)），支持 macOS / Windows / Linux。

注册后直接可用，**不需要自己的 API Key**。国际版价格（以 [trae.ai/pricing](https://www.trae.ai/pricing) 为准）：

| 套餐 | 价格 | 说明 |
|------|------|------|
| Free | $0 | 仅 Auto 模式（自动选模型），用量有限，补全 5,000 次/月 |
| Pro | $20/月 | Auto + 全部模型，补全不限 |
| Pro+ | $60/月 | 更高用量 |
| Ultra | $200/月 | 最高用量 |

### Rules — 项目规则

创建 `.trae/rules/project_rules.md`（`.trae/rules/` 下任意 `.md` 都会被读取，支持子目录递归，最多三层）：

```markdown
---
alwaysApply: true
---

# 项目规则

## 技术栈
React + TypeScript + Ant Design + UmiJS

## 代码规范
- 使用函数组件 + Hooks
- 状态管理用 @umijs/max 内置的 Model
- 请求用 umi-request，不要直接用 fetch/axios
- 样式用 CSS Modules

## 中文规范
- 注释用中文
- commit message 用中文
- 变量名用英文
```

frontmatter 里 `alwaysApply: true` 表示始终生效；也可以改用 `globs`（匹配文件时生效）或 `description`（由 AI 判断何时生效）。已有 `AGENTS.md` / `CLAUDE.md` 的项目，可以在设置 > Rules 里打开「将 AGENTS.md / CLAUDE.md 包含在上下文中」直接复用。

### Agent 模式

Agent 是 Trae 的自主执行模式（旧版中叫 Builder），类似 Cursor 的 Agent。除了内置 Agent，还可以自定义 Agent（配置提示词、工具集和 MCP Server）：

```
用 Agent 模式。
参考 src/pages/user/list.tsx 的写法，
新建一个 src/pages/order/list.tsx 订单列表页。
要求：
1. 表格用 Ant Design ProTable
2. 支持按日期、状态、金额筛选
3. 支持导出 Excel
4. 操作列：查看详情、取消订单、退款
```

---

## 提示词技巧

### 1. 按任务分配模式和模型

Free 档只有 Auto 模式（由 Trae 自动选模型）；Pro 及以上可手动选模型。合理分配：

```
# 复杂任务 — Agent 模式 + 最强的可选模型
Agent 模式：重构整个认证模块

# 简单任务 — Chat 模式，Auto 即可
Chat 模式：解释这段代码 / 写个注释
```

### 2. 中文友好

Trae 对中文支持最好，可以完全用中文交互：

```
帮我把 src/utils/request.ts 的请求封装改一下：
1. 加上统一的 loading 状态管理
2. 错误提示用 Ant Design 的 message 组件
3. 401 错误自动跳转登录页
4. 网络超时设为 10 秒
```

### 3. Ant Design 生态

Trae 对国内常用组件库支持好：

```
@https://ant-design.antgroup.com/components/table-cn
参考 Ant Design 官方文档，
给 ProTable 加一个自定义的行展开功能，
展开后显示订单的商品明细。
```

---

## 与 Cursor 的区别

| 维度 | Trae | Cursor |
|------|------|--------|
| 价格 | 有免费档（仅 Auto 模式）；Pro $20/月 | $20/月 |
| 中文支持 | ★★★（界面中文） | ★☆☆（纯英文） |
| 国内网络 | ★★★（国内版 trae.cn 直连） | ★☆☆（需要代理） |
| Agent 能力 | ★★☆ | ★★★ |
| Rules 系统 | ★★☆ | ★★★（globs 按需加载） |
| 插件生态 | ★★☆（VS Code 兼容） | ★★★（VS Code 兼容） |
| 适合 | 入门、预算敏感、国内团队 | 进阶、愿意付费、追求最强 |

---

## 常见陷阱

| 陷阱 | 说明 | 解决 |
|------|------|------|
| Agent 执行慢 | Free 档走标准队列，可能排队 | 非紧急任务用 Agent，急的用 Chat；或升级付费档（快速队列） |
| 找不到 Claude | 2025-09 起已下架 Claude | 用其他可选模型；非用 Claude 不可就换工具 |
| Rules 不生效 | 文件路径、嵌套层级或 frontmatter 不对 | 确保在 `.trae/rules/` 下（子目录最多三层），`.md` 格式，检查 `alwaysApply` / `globs` |

---

## 配置模板

| 模板 | 用途 |
|------|------|
| [project_rules.md](templates/project_rules.md) | 项目规则模板（React + UmiJS + Ant Design），复制到 `.trae/rules/` |

---

## 延伸阅读

- [Trae 官方网站](https://trae.ai)（国内版：[trae.cn](https://www.trae.cn)）
- [Trae 官方文档](https://docs.trae.ai)
- [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) — Skills 方法论（也支持 Trae）
