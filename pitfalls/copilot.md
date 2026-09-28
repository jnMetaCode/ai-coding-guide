# GitHub Copilot 陷阱合集

> Copilot 是最老牌的 AI 编程工具，也最容易被低估——以为就是补全，结果 Agent 模式和 MCP 支持都挺深。8 个常见坑。信息更新于 2026-09。
>
> 踩过新坑？提 Issue 或 PR。

---

## 陷阱 1：补全用了过期的 API

**症状**
- Copilot 生成的代码用了某个库的旧 API
- 你拷进来跑：`Deprecated: use xxx instead` 或直接 `is not a function`
- 升级到库的新版本后，Copilot 还在按旧 API 补全

**根因**
Copilot 的补全基于训练数据 + 当前打开文件的上下文。训练数据截止日期前的库版本可能已经迭代过，而 Copilot 不会读 `package.json` 里的实际版本。

**出坑**
- 把新版文档的关键一页**作为 tab 打开**（Copilot 会读打开的 tab）
- 或在文件顶部加注释：

```typescript
// 使用 TanStack Query v5 API（useQuery 签名：useQuery({ queryKey, queryFn })）
import { useQuery } from '@tanstack/react-query';
```

**预防**
- 在 `.github/copilot-instructions.md` 里声明关键库的版本和 API 风格：

```markdown
## 关键依赖版本
- React 19（使用 useTransition、useOptimistic）
- TanStack Query v5（useQuery 新签名）
- Zod v3（不用 v2 的 object() 链式风格）
```

---

## 陷阱 2：Agent 模式读了 `.env` 或敏感文件

**症状**
- 让 Copilot Agent 改个配置，它顺手扫了 `.env` 把 key 读进上下文
- 在 Chat 窗口里看到你的 API key 明文显示
- 最坏：补全建议里带出了真实的 secret

**根因**
`.gitignore` 里的文件 Copilot 依然可能读到。GitHub 提供的 **Content Exclusion（内容排除）** 只能在仓库 / 组织 / 企业级由管理员配置，而且官方文档明确写着：**IDE 里 Copilot Chat 的 Agent 模式不支持内容排除**。也就是说，即使配了排除规则，Agent 模式照样可能读到 `.env`、`.aws/credentials`、`id_rsa` 这类文件。

（早期流传的 `github.copilot.advanced.exclude` 设置并不是官方的排除机制，别指望它。）

**出坑**
如果敏感信息已经进了 Chat 历史：开一个新会话 / 清空当前会话，**并立即轮换相关密钥**。

**预防**
- **敏感信息别放在项目目录里**：用 `direnv` / `1Password CLI` 等从项目外注入，不落地
- 仓库 / 组织层面配好 Content Exclusion，至少能覆盖补全和普通 Chat（对 Agent 模式无效）
- Agent 执行读文件、跑命令前留意确认提示，别无脑全部批准
- 在 instructions 里写明"不要读取 `.env*`、`*.pem`、`*.key`"——这是软约束，只能降低概率

---

## 陷阱 3：`.github/copilot-instructions.md` 太长，重点被淹没

**症状**
- 你在 instructions 里写了 20 条规则
- Agent 只遵守前几条，后面的像没看过
- 尤其 Chat 窗口里提问时，细节规则几乎不生效

**根因**
instructions 会整体注入上下文，写得越长、越杂，每条规则的"分量"越低；和当前任务无关的规则还会挤占注意力。

**出坑**
拆文件：
- 核心不变规则 → `.github/copilot-instructions.md`（尽量短）
- 按路径生效的规则 → `.github/instructions/*.instructions.md`，用 `applyTo` 指定 glob
- 专项角色 → `.github/agents/` 下各自的 `.agent.md`
- 成套方法论 → Agent Skills（`.github/skills/`）

**预防**
Instructions 里**只放跨场景的全局规则**（技术栈、命名、禁止事项）。具体场景规则：

```
.github/
├── copilot-instructions.md          # 核心规则
├── instructions/
│   ├── python.instructions.md       # applyTo: "**/*.py"
│   └── tests.instructions.md        # applyTo: "tests/**"
└── agents/
    ├── security-reviewer.agent.md   # 安全审查专用
    └── migration-helper.agent.md    # 迁移项目专用
```

---

## 陷阱 4：`#file` 引用的 vs Agent 自己搜到的不一致

**症状**
- 你说 `#file:src/api/user.ts 按这个改`
- Copilot 改得基本对，但不完全
- 另一次你只说"改一下 user.ts"，Agent 自己搜索，找到了 2 个 user.ts（项目有两处重名）

**根因**
- `#file` 精确引用你给的路径
- Agent 模式会自动搜索整个代码库（`#codebase` 可以强制做一次语义搜索）
- 项目里有重名文件时，自动搜索可能选错那个

**出坑**
明确路径 > 模糊搜索：

```
❌ 改一下 user.ts 的 register 方法
✅ #file:src/api/v2/user.ts 改一下这里的 register 方法
```

**预防**
- 项目里避免重名文件（`user.ts` × 3 这种结构重构一下）
- 如果必须重名，引用时用完整路径而非文件名
- 自动搜索 / `#codebase` 只用于**探索**（"项目里有没有 XX"），不用于**指向**（"改 XX"）

---

## 陷阱 5：MCP Server 配置了但没生效

**症状**
- 配了 MCP server，Chat 里该用 MCP 工具时它没用，走了别的路径
- 不报错，就是悄悄没用

**根因**
常见四种：
1. **配置位置或格式不对**：VS Code 的 MCP 配置在 `.vscode/mcp.json`，顶层键是 `servers`；写在 `settings.json` 里的旧 `github.copilot.chat.mcpServers` 不是当前的配置方式
2. MCP server 启动命令写错（`npx` 路径、参数顺序）
3. 当前不在 Agent 模式，或工具没在工具列表里勾选
4. server 启动成功但工具 schema 定义有问题，Copilot 认不出

**出坑**
```jsonc
// .vscode/mcp.json
{
  "servers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    }
  }
}
```

然后命令面板运行 **MCP: List Servers**，选中你的 server → **Show Output** 看日志。Chat 视图里 MCP 出错时也会显示错误标记，点开可以直接看输出。

**预防**
- 先用官方示例 server（比如 `@modelcontextprotocol/server-filesystem`）验证 MCP 能接通
- 再换自己的 server
- VS Code 和 GitHub Copilot 插件都保持最新版

---

## 陷阱 6：JetBrains 和 VS Code 功能不同步

**症状**
- 团队里 VS Code 用户用上了某个新功能，JetBrains 用户那边还没有
- 同一份配置在两边表现有差异

**根因**
- VS Code 通常是 Copilot 新功能最先上线的地方
- 不过差距已经明显缩小：JetBrains 的自定义 Agent、子 Agent、Plan Agent 已于 2026 年 3 月 GA，也支持 AGENTS.md / CLAUDE.md
- 个别最新功能在 JetBrains 上仍可能晚一步，插件版本旧时差异更明显

**出坑**
先把 JetBrains 的 Copilot 插件升到最新；遇到某个功能缺失，查一下官方文档里该功能的 IDE 支持情况。

**预防**
- 团队共享的规则优先用两边都支持的格式（`.github/copilot-instructions.md`、`AGENTS.md`、`.agent.md`）
- 依赖某个新功能前，先确认团队用的所有 IDE 都支持
- 插件保持最新版

---

## 陷阱 7：AI Credits 用完 / 免费额度耗尽

**症状**
- Copilot Free 用得好好的，某天补全或 Chat 突然不能用了（"已达使用上限"之类的提示）
- 付费用户月中发现 Agent 模式、代码审查开始提示额度不足
- VS Code 里提示不一定醒目，容易忽略

**根因**
2026-06-01 起 Copilot 按 **GitHub AI Credits** 计费：
- Chat、Agent 模式、代码审查、云端 Agent、Copilot CLI 等都消耗 Credits（代码审查还会消耗 GitHub Actions 分钟数）
- 代码补全在付费套餐中不限量；Free 每月 2,000 次补全 + 少量 Credits
- 每个套餐每月有包含额度（Pro 1,500 / Pro+ 7,000 / Max 20,000 Credits；Business 每人 1,900、Enterprise 每人 3,900），用完需要额外购买或等下个月
- 高推理、大模型的请求消耗更快

**出坑**
- 在 GitHub 账户 → Copilot 设置页查看用量
- 用量接近上限：升级 Pro / Pro+ / Max，设置额外支出上限，或当月剩余时间依赖其他工具

**预防**
- 高频使用者直接上 Pro（$10/月）或更高档，别在 Free 上省
- 日常小任务用消耗低的模型，复杂任务再切大模型
- 团队用户和管理员对齐额度和支出上限
- 建立"Copilot 额度用完用谁"的 fallback（比如切 Claude Code 或 Cursor）

---

## 陷阱 8：自定义 Agent 不被发现

**症状**
- 你写了个专家角色文件，在 Chat 里输入 `@security-review`，Copilot 不识别
- 或者 Agent 下拉框里根本找不到它
- 或者选中了但行为和普通 Chat 没区别

**根因**
- **调用方式不对**：自定义 Agent 不是用 `@名字` 调用的，要在 Chat 视图的 **Agent 下拉框**里选，或在输入框输入 `/agents` 打开列表
- **还在用旧格式**：Chat Modes（`.github/chatModes/*.chatmode.md`）已弃用，现在叫自定义 Agent
- **位置或扩展名不对**：必须是 `.github/agents/` 下的 `*.agent.md`（也支持 `.claude/agents/`）
- frontmatter 缺失，或设置了 `user-invocable: false`（不在下拉框中显示）

**出坑**
把文件改名/移动到 `.github/agents/security-review.agent.md`，检查 frontmatter：

```markdown
---
name: security-review
description: Security review using OWASP Top 10
---

# 后面是角色内容
```

然后在 Agent 下拉框里选中它。

**预防**
- 用命令面板的 **Chat: New Custom Agent** 生成文件，基于它改，别从零写
- 老项目的 `.chatmode.md` 统一改名为 `.agent.md` 并挪到 `.github/agents/`
- 需要工具限制时在 frontmatter 里写 `tools`，需要固定模型时写 `model`

---

## 贡献新陷阱

模板见 [claude-code.md 结尾](./claude-code.md#补充遇到新陷阱怎么办)。

---

## 相关方法论

- [Copilot 完整指南](../copilot/README.md)
- [common/security.md](../common/security.md) — AI 编程的安全风险和防护
- [common/context-management.md](../common/context-management.md) — 上下文管理
