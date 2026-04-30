# 卷三 · 架构：把 AI 编程接进团队

## 这一卷是给谁看的

- 团队 lead / staff engineer：要为整个团队选型 AI 工具栈
- 平台工程师：要把 AI Agent 接进 CI / 代码评审 / 安全扫描流水线
- CTO / 安全工程师：担心数据泄漏、prompt injection、商业机密外流
- 独立开发者要做付费产品：想做 MCP server / Skill 出售或开源

**为什么单独成卷**：卷一卷二解决"我个人用得好"。但你真要把 AI 编程接进 5 人以上团队、放进 CI、给企业用——会撞上一堆 individual contributor 视角根本看不见的问题：

- 怎么保证 AI 不会把生产配置写错？（Sandbox + Execpolicy）
- 怎么防止某个开发者的 prompt 把客户邮件泄漏到 OpenAI？（DLP + 审计）
- 怎么让 AI 接团队 Linear / Slack / 数据库而不需要每人配 API key？（MCP 治理）
- 怎么衡量 AI 工具的真实 ROI 而不是"感觉变快了"？（监控 + 用量分析）

这一卷就是这些问题的实战手册。

## 这一卷的逻辑顺序

```
安全注意事项（先把红线讲清楚）
   ↓
CI 集成（codex-action / claude-code 自动 review / 自定义 Action）
   ↓
Sandbox 与 Execpolicy（OS 内核级 vs 应用层 hook 的取舍）
   ↓
MCP 生态（哪些值得装、哪些是噪音）
   ↓
团队治理（AGENTS.md.override / 配置层叠 / 审计日志）
   ↓
成本控制（FinOps 视角看 AI 编程支出）
```

学完这一卷你应该能：

- 给团队制定一份"AI 编程使用规范"——明确什么任务能给 AI、什么必须人审
- 设计一套 CI 流水线：PR 触发 AI review，发现风险用 Sandbox 跑试探，自动评论
- 选型 MCP server：知道哪几个能消除手工动作，哪几个是博眼球的玩具
- 给老板讲清楚：花在 AI 工具上的钱，每月省了多少工程师小时

## 关于 OpenClaw

卷三末尾会讲 OpenClaw——它不是编程工具，是 Agent 框架，但跟编程团队的"非编程自动化"高度相关：定时任务、跨平台消息（Telegram / Slack）、Cron + Skill。如果你的团队需要"AI 帮忙做编程之外的事"（如每周扫一遍线上 bug、自动整理 PR 报告），OpenClaw 是开源选择。

## 节奏建议

这一卷比前两卷更"工程"——建议至少有过一次"我把 AI 工具引进团队但搞砸了"的经验之后再读，否则容易觉得"我现在用得好好的，要这么复杂吗"。

如果是新建团队 / 刚招到第一个 AI tooling 工程师——直接顺读。这一卷里的每一章都对应一个"半年内一定会撞上"的真实问题。
