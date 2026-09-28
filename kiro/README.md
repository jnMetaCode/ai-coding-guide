# Kiro 最佳实践

> Kiro 是 AWS 推出的 AI IDE，核心特色是 **Spec-driven Development**（规格驱动开发）。不是让 AI 直接写代码，而是先生成需求规格、设计文档，确认后再按规格实现。适合团队协作和需要高质量交付的场景。2025-11-17 起正式 GA，现已覆盖 IDE、CLI、Web、Mobile 和 Crew 多个入口。

---

## 核心概念

| 概念 | 说明 | 用途 |
|------|------|------|
| **Spec** | 需求规格文档 | AI 先写规格，确认后再写代码 |
| **Steering** | `.kiro/steering/*.md` | 项目级规则和指引 |
| **Hooks** | `.kiro/hooks/*.json` 事件触发器 | Agent 改完文件后自动验证/测试 |
| **Agent** | 后台自主执行 | 复杂任务自动完成 |
| **MCP** | IDE / CLI / Web 均支持 | 接入外部工具和数据源 |

### 2026 新增

- **Kiro CLI / Web / Mobile**：同一套 agent 能力覆盖终端、浏览器和手机
- **Kiro Crew**（2026-08-04）：开源（Apache 2.0）的后台 agent 工作空间，基于 Kiro CLI 运行，可复用现有 `.kiro` 配置，适合异步跑迁移、工单分诊、PR 跟进等任务
- **Powers**：自带领域知识、按需激活的能力包，扩展 agent
- **AGENTS.md**：支持该标准，放在工作区根目录或 `~/.kiro/steering/`，始终加载

### 价格

| 套餐 | 价格 | 每月 credits |
|------|------|-------------|
| Free | $0 | 50 |
| Pro | $20/月 | 1,000 |
| Pro+ | $40/月 | 2,000 |
| Pro Max | $100/月 | 5,000 |
| Power | $200/月 | 10,000 |

付费套餐超额按 $0.04/credit 计费，未用完的 credits 不结转。以 [kiro.dev/pricing](https://kiro.dev/pricing/) 为准。

---

## 快速上手

### 安装

从 [kiro.dev](https://kiro.dev) 下载安装。可用 GitHub、Google、AWS Builder ID 或组织身份（IAM Identity Center / 外部 IdP）登录。

### Steering 文件 — 项目配置

在 `.kiro/steering/` 下创建规则文件：

```markdown
---
inclusion: always
---

# 项目规则

## 技术栈
Java 17 + Spring Boot 3 + MyBatis Plus + MySQL 8

## 代码规范
- Controller 层只做参数校验和路由
- Service 层处理业务逻辑
- DAO 层只做数据库操作
- 统一用 Result<T> 包装返回值
- 异常用自定义 BusinessException

## 命名规范
- 包名全小写
- 类名 PascalCase
- 方法名 camelCase
- 常量 UPPER_SNAKE_CASE
```

Steering 用 frontmatter 的 `inclusion` 字段控制加载方式，共四种模式：
- `inclusion: always` — 每次对话都加载（默认）
- `inclusion: fileMatch` + `fileMatchPattern: "**/*.java"` — 只在操作匹配文件时加载（也可写成数组）
- `inclusion: manual` — 在对话里用 `#文件名`（或输入 `/` 选择）手动引用
- `inclusion: auto` + `name` / `description` — 由 agent 根据描述判断是否需要加载

全局 steering 放在 `~/.kiro/steering/`，对所有工作区生效。

### Spec 驱动开发

Kiro 的工作流和其他工具不同：

```
1. 你描述需求
2. Kiro 生成 Spec：requirements.md（Bugfix Spec 则是 bugfix.md）+ design.md + tasks.md
3. 你审查和修改 Spec
4. 确认后 Kiro 按 tasks.md 逐个任务实现，实时显示进度
```

Spec 有几种工作流：**Requirements-First**（先需求后设计）、**Design-First**（先定技术方案）、**Quick Spec**（一次生成需求/设计/任务，不设审批关卡），以及专门排查修复 bug 的 **Bugfix Spec**。

这比"直接写代码"慢，但产出质量更高，特别适合：
- 团队协作（Spec 可以 review）
- 复杂功能（先想清楚再动手）
- 需要文档的项目

---

## 提示词技巧

### 1. 让 Spec 更精确

```
给订单模块加一个退款功能。

业务规则：
- 订单支付后 7 天内可退款
- 部分退款和全额退款都支持
- 退款需要审批（金额 > 500 元）
- 退款到原支付渠道

请先生成 Spec，我确认后再实现。
```

### 2. 利用 Hooks 自动验证

Hook 是 `.kiro/hooks/` 下的独立 JSON 文件（文件名 kebab-case，如 `java-verify.json`）：

```json
{
  "version": "v1",
  "hooks": [
    {
      "name": "Compile on save",
      "trigger": "PostFileSave",
      "matcher": "\\.java$",
      "action": { "type": "command", "command": "mvn compile -q" }
    },
    {
      "name": "Test on test save",
      "trigger": "PostFileSave",
      "matcher": "Test\\.java$",
      "action": { "type": "command", "command": "mvn test -q" }
    }
  ]
}
```

Agent 每次保存 Java 文件自动编译，保存测试文件自动跑测试。注意：文件类触发器只响应 **agent 做的修改**，你在编辑器里手动保存不会触发。`action.type` 除了 `command` 还可以是 `agent`（给 agent 注入一段提示词）。

可用触发器：Prompt Submit、Agent Stop、Session Start（IDE）、Agent Spawn（CLI）、Pre/Post Tool Use、File Create / Save / Delete、Pre/Post Task Execution（Spec 任务前后）。JSON 里写 PascalCase，文件类的带 `Post` 前缀（如 `PostFileSave`），完整写法见 [Hooks 文档](https://kiro.dev/docs/hooks/)。

### 3. Steering 按模块配置

```
.kiro/steering/
├── always.md              # 全局规则（inclusion: always）
├── api.md                 # API 规则（fileMatch: src/controller/**）
├── database.md            # 数据库规则（fileMatch: src/mapper/**）
└── testing.md             # 测试规则（fileMatch: src/test/**）
```

---

## 与其他工具的区别

| 维度 | Kiro | Claude Code | Cursor |
|------|------|-------------|--------|
| 核心理念 | Spec 先行 | Agent 执行 | IDE 补全 |
| 适合 | 团队协作、高质量交付 | 个人高效开发 | 日常编码 |
| 规则系统 | Steering（四种模式）+ AGENTS.md | CLAUDE.md + Skills | Rules（globs） |
| 开发流程 | 需求→规格→实现→验证 | 需求→实现→验证 | 需求→实现 |
| AWS 集成 | ★★★ | ★☆☆ | ★☆☆ |

---

## 配置模板

| 模板 | 用途 |
|------|------|
| [steering-always.md](templates/steering-always.md) | Steering 全局规则模板（Java + Spring Boot），复制到 `.kiro/steering/` |

---

## 延伸阅读

- [Kiro 官方文档](https://kiro.dev/docs)
- [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) — Skills 方法论（也支持 Kiro）
