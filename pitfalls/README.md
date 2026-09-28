# 陷阱合集

> 每个工具 README 里都有"常见陷阱"速查表，本目录把它们**深度展开**：每个陷阱按 **症状 → 根因 → 出坑 → 预防** 四段式写清楚。
>
> 目标：不是"列个清单凑数"，而是帮你**下次不踩同样的坑**。

---

## 按工具索引

| 工具 | 陷阱数 | 覆盖主题 |
|------|-------|---------|
| [Claude Code](./claude-code.md) | 8 | 上下文溢出 / 幻觉 API / 过度重构 / 测试谎报 / CLAUDE.md 被忽略 / git amend / Plan 漂移 / Subagent 传话 |
| [Cursor](./cursor.md) | 8 | Agent 脱缰 / Tab 暴吐 / 规则不生效 / @file 失效 / Agent·Ask 模式混用 / 模型切换 / Notepads 已移除 / 索引陈旧 |
| [GitHub Copilot](./copilot.md) | 8 | 过期 API / Agent 读 .env / instructions 太长 / #file vs Agent 搜索 / MCP 失效 / IDE 差异 / AI Credits 耗尽 / 自定义 Agent 不生效 |
| [Aider](./aider.md) | 7 | auto-commit 吃变更 / /add 漏依赖 / 模型切换质量塌 / lint 循环烧 token / Map 过期 / Architect→Code 漂移 / amend 失控 |

---

## 其他工具陷阱

Devin Desktop（原 Windsurf）/ Codex CLI / Gemini CLI / Kiro / Trae / OpenClaw 的陷阱页还没写。欢迎：

1. 看你用的工具有没有踩过坑
2. 按下面模板写一篇 PR 过来

---

## 写新陷阱页的模板

文件命名：`pitfalls/<tool-name>.md`（中文）+ `pitfalls/<tool-name>.en.md`（英文对照）

结构：

```markdown
# <Tool> 陷阱合集

> 一句话定位：这个工具独特的痛点在哪

## 陷阱 1：一句话标题

**症状**
你看到的异常现象（越具体越好）

**根因**
为什么会发生（用你的理解说清楚，别只是复制官方说法）

**出坑**
已经掉坑里了怎么爬出来（具体操作，能复制的代码 > 文字描述）

**预防**
下次怎么避免（提示词 / 配置 / Hook / Skill）

...（8 条左右，别凑数）

## 贡献新陷阱

模板见 [claude-code.md 结尾](./claude-code.md#补充遇到新陷阱怎么办)。

## 相关方法论

- 指向工具自己的 README
- 指向相关的 common/ 方法论
```

---

## 质量标准

写 pitfalls 最容易掉进的坑（pitfall 的 pitfall）：

- ❌ **教程化凑数**：把"怎么用"硬写成"陷阱"（例："忘记保存文件" 不是陷阱）
- ❌ **复制官方 FAQ**：价值在你真实遇到、真实修好的过程
- ❌ **症状和根因混在一起**：读者看不清"这是不是我遇到的"
- ✅ **可复现的症状**：读者能对号入座
- ✅ **出坑操作具体**：给命令或提示词，不是"注意一下"
- ✅ **预防措施落地**：能直接抄到 `CLAUDE.md` / `.cursor/rules/*.mdc` / settings.json

---

## 相关

- [common/debugging.md](../common/debugging.md) — 系统化调试方法论
- [workflows/scenarios.md](../workflows/scenarios.md) — 实战对话脚本，含大量"打断话术"
