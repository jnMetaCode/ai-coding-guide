# Claude Code + Copilot 协作工作流

> Claude Code 做 Agent 级任务，Copilot 做行内补全。两个工具分工清晰，不冲突——一个在终端里，一个在编辑器里。

---

## 分工原则

| 任务 | 用 Claude Code | 用 Copilot |
|------|:---:|:---:|
| 跨文件重构 | ✅ | |
| 写测试套件 | ✅ | |
| 调试（看日志、跑命令） | ✅ | |
| 架构设计 | ✅ | |
| 行内代码补全 | | ✅ |
| 写注释 / 文档 | | ✅ |
| 小函数实现 | | ✅ |
| 代码理解（选中问问题） | | ✅ |

---

## 典型流程

```
1. Claude Code 创建文件骨架
   > 按设计方案创建 src/services/notification/ 下的所有文件

2. VS Code + Copilot 填充实现
   打开 Claude Code 创建的文件，写代码时 Copilot 自动补全

3. Claude Code 跑测试和审查
   > 跑测试看有没有问题，然后做一次代码审查

4. VS Code + Copilot 做小修补
   根据审查意见在编辑器里快速修改
```

---

## 优势

- **无需切换** — Claude Code 在终端，Copilot 在 VS Code，各干各的
- **成本控制** — Copilot 付费套餐代码补全不限量，大量补全不额外花钱（Chat / Agent 按 AI Credits 计费）
- **互补性强** — Claude Code 不擅长行内补全，Copilot 不擅长 Agent 任务
