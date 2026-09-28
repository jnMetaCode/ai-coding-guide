# 上下文管理

> AI 编程工具的"智商"直接取决于上下文质量。给太少它不理解你的项目，给太多它反而变笨。管理好上下文是用好 AI 编程工具的关键技能。

---

## 上下文是怎么工作的

所有 AI 编程工具都有一个**上下文窗口**（context window），可以理解为 AI 的"工作记忆"。

| 工具 | 上下文窗口 | 说明 |
|------|-----------|------|
| Claude Code | 1M tokens | Opus/Sonnet 5.5 均为 1M（Haiku 200K） |
| Cursor | 跟模型 | 取决于选择的模型 |
| Copilot | 跟模型 | 取决于选择的模型，包含打开的文件 |
| Gemini CLI | 1M tokens | 窗口大，但太大也有问题（个人用户已停服，仅企业版 / 付费 API Key） |

**关键认知**：上下文不是越大越好。塞太多无关信息，AI 会"注意力分散"，重要信息反而被淹没。

---

## 核心策略

### 1. 精确喂入，不要全塞

```
❌ 差："看看整个 src/ 目录帮我找 bug"
✅ 好："看 src/services/auth.ts 的 refreshToken 函数，
    用户反馈说刷新后还是提示过期。
    也看一下 src/middleware/auth.ts 里怎么验证 token 的。"
```

### 2. 项目配置文件是最高效的上下文

每个工具都有项目配置文件，启动时自动加载：

| 工具 | 配置文件 | 作用 |
|------|---------|------|
| Claude Code | `CLAUDE.md` | 项目背景、规范、常用命令 |
| Cursor | `.cursor/rules/*.mdc` | 项目规则（`.cursorrules` 为旧格式） |
| Copilot | `.github/copilot-instructions.md` | 项目指引 |
| Devin Desktop（原 Windsurf） | `.devin/rules/*.md` | 项目规则（`.windsurfrules` 仅向后兼容） |
| Gemini CLI | `GEMINI.md` | 项目配置 |

**写好配置文件 = 每次对话自动带上最关键的上下文。**

### 3. 长对话定期"刷新"

对话越长，早期的信息权重越低。当你感觉 AI 开始"忘事"或"变笨"：

```
# Claude Code
> /clear    # 清除当前对话，开新的

# 或者主动总结
> 我们刚才做了这些事：[总结]。
  现在继续做 [下一个任务]。
```

### 4. 用文件传递上下文，不用对话

```
❌ 差：在对话里贴了 500 行代码让 AI 分析
✅ 好：代码已经在文件里了，告诉 AI 读哪个文件
    "读 src/services/payment.ts 第 100-150 行的 processRefund 函数"
```

---

## 各工具的上下文管理

### Claude Code

```bash
# 用 CLAUDE.md 做持久上下文
# 用 Memory 做跨对话记忆
# 用 /clear 重置对话

# 大项目技巧：用 Subagent 隔离上下文
"用 subagent 分析 src/payment/ 的代码，
 主对话的上下文不要被污染。"
```

### Cursor

```
# 用 @ 引用精确控制上下文
@src/models/user.ts @src/schemas/user.ts
基于这两个文件写一个用户注册接口

# 用 Rules / Skills 保存常用上下文（Notepads 已在 2.0 移除）
# 用 Rules globs 按文件类型自动加载规则

# 打开相关文件作为隐式上下文
# Cursor 会读取当前打开的 tab
```

### Copilot

```
# 用 #file #selection #terminal 精确引用
#file:src/models/user.py 基于这个模型写测试

# 打开相关文件 — Copilot 读取打开的 tab
# 关闭无关文件 — 减少噪音

# Agent 模式自动搜索相关文件
# 但可以用 #file 缩小范围提高准确率
```

---

## 常见问题

| 问题 | 原因 | 解决 |
|------|------|------|
| AI 回答不准确 | 上下文不够或太杂 | 精确引用相关文件 |
| AI 越来越笨 | 对话太长，上下文溢出 | 开新对话，带上 CLAUDE.md |
| AI 忘了之前的约定 | 早期消息权重降低 | 重要约定放在配置文件里 |
| AI 编造不存在的 API | 没给足参考信息 | 让它先 grep/search 确认 |
| AI 重复做已经做过的事 | 不记得之前的进度 | 用 todo/plan 追踪进度 |
