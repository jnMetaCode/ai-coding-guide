# Aider 最佳实践

> Aider 是一个开源的 CLI AI 编程工具，核心特色是 **Git 原生** — 每次修改自动提交，天然支持版本控制。支持几乎所有主流 LLM（Claude、GPT、DeepSeek、Qwen、本地模型），是最灵活的 AI 编程 CLI。
>
> ⚠️ **维护状态（2026-09 核实）**：PyPI 最新版仍是 0.86.2（2026-02-12 发布），GitHub 最后一次提交在 2026-05 左右，更新明显放缓；目前**没有原生 MCP 支持**。内置模型元数据跟不上新模型发布，用新模型时要自己补配置（见下文「新模型配置」）。

---

## 核心概念

| 概念 | 说明 | 用途 |
|------|------|------|
| **Chat 模式** | `code` / `ask` / `architect` | 不同任务用不同模式 |
| **自动 Git 提交** | 每次修改自动 commit | 随时可以回滚 |
| **Repo Map** | 提取关键符号和定义行（签名），按引用关系图排序 | 理解大代码库 |
| **多模型支持** | Claude/GPT/DeepSeek/Ollama 等 | 灵活选择，控制成本 |
| **Lint & Test** | 内置代码检查和测试 | 修改后自动验证 |

---

## 快速上手

### 安装

```bash
python -m pip install aider-install && aider-install
# 也可以：uv tool install --force --python python3.12 --with pip aider-chat@latest
# 或：pipx install aider-chat

# 设置 API Key（选一个）
export ANTHROPIC_API_KEY=sk-xxx    # Claude
export OPENAI_API_KEY=sk-xxx       # GPT
export DEEPSEEK_API_KEY=sk-xxx     # DeepSeek
```

### 基本使用

```bash
cd /your/project
aider

# 指定模型（用 --model 写明最新 Claude 模型 ID）
aider --model anthropic/claude-sonnet-5-5

# 用 DeepSeek（便宜）
aider --model deepseek/deepseek-v4-pro

# 用本地模型（免费）
aider --model ollama/qwen3-coder
```

> 注意内置别名已经过时：`--model sonnet` → `claude-sonnet-4-6`，`--model opus` → `claude-opus-4-7`，`--model deepseek` 仍指向已于 2026-07-24 下线的 `deepseek/deepseek-chat`。建议始终写完整模型 ID。

### 三种 Chat 模式

```bash
# code 模式（默认）— 直接修改代码
/code 给 utils.py 加一个 retry 装饰器

# ask 模式 — 只问不改
/ask 这个函数的时间复杂度是多少？

# architect 模式 — 先设计再实现
/architect 设计一个任务队列系统，先给方案不要写代码
```

---

## 提示词技巧

### 1. 添加文件到上下文

```bash
# 手动添加文件
/add src/models/user.py src/api/auth.py

# 添加整个目录
/add src/services/

# 移除不需要的文件
/drop src/legacy/old_auth.py
```

Aider 只会修改已添加的文件。这是精确控制范围的方式。

### 2. Architect 模式做大任务

```
/architect

我要给项目加一个 WebSocket 实时通知系统。
要求：
1. 用户上线/下线通知
2. 新消息实时推送
3. 支持频道订阅/退订
4. 需要考虑断线重连

先给出技术方案，包括：
- 用什么库
- 数据流设计
- 需要新建哪些文件
- 需要修改哪些现有文件

确认后切到 code 模式实现。
```

### 3. 利用自动 Git 提交

```bash
# 每次修改都有独立 commit，随时回滚
git log --oneline  # 看 Aider 的提交记录
git diff HEAD~1    # 看最后一次修改
git revert HEAD    # 不满意？一键回滚

# 区分 AI 提交：默认已加 Co-authored-by trailer，可用 --attribute-* 系列开关调整
aider --attribute-commit-message-author   # AI 改动的 commit message 加 "aider: " 前缀
# 自定义 commit message 风格
aider --commit-prompt "用中文写 Conventional Commits 格式的提交信息"
```

### 4. 多模型策略

```bash
# 复杂架构设计 — 用最强模型
aider --model anthropic/claude-opus-5-5
/architect 设计微服务拆分方案

# 日常编码 — 用性价比模型
aider --model deepseek/deepseek-v4-pro
/code 按方案实现 user-service

# 代码审查 — 用免费本地模型
aider --model ollama/qwen3-coder
/ask 看看这段代码有没有问题
```

---

## 进阶技巧

### .aider.conf.yml — 项目配置

```yaml
# .aider.conf.yml
model: anthropic/claude-sonnet-5-5
auto-commits: true
auto-lint: true
auto-test: true
test-cmd: pytest
lint-cmd: ruff check
```

### 新模型配置 — `.aider.model.settings.yml`

Aider 默认会发 `temperature` 参数，而新一代 Claude（Sonnet 5.5、Opus 5.5 等）会拒绝非默认的 temperature，直接 400 报错。在项目根目录或 home 目录加：

```yaml
# .aider.model.settings.yml
- name: anthropic/claude-sonnet-5-5
  edit_format: diff
  use_repo_map: true
  use_temperature: false
```

Aider 内置元数据里没有的模型，启动时会提示未知上下文窗口，一般可以忽略，也可以在 `.aider.model.metadata.json` 里补上。

### Lint + Test 自动化

```yaml
# 每次修改后自动：
# 1. 跑 linter 检查
# 2. 跑相关测试
# 3. 如果失败，自动修复再重试
auto-lint: true
auto-test: true
lint-cmd: "ruff check --fix"
test-cmd: "pytest -x"
```

### 与 Git 工作流集成

```bash
# 在 feature 分支上工作
git checkout -b feature/add-notifications
aider

# Aider 的每次修改都在这个分支上
# 完成后正常走 PR 流程
git push -u origin feature/add-notifications
```

---

## 与其他 CLI 工具的区别

| 维度 | Aider | Claude Code | Gemini CLI |
|------|-------|-------------|------------|
| Git 集成 | ★★★（自动提交） | ★★☆（手动） | ★☆☆ |
| 模型灵活性 | ★★★（几乎所有 LLM） | ★☆☆（仅 Claude） | ★☆☆（仅 Gemini） |
| Agent 能力 | ★★☆ | ★★★ | ★★☆ |
| 上下文管理 | 手动 /add /drop | 自动 | 自动 |
| 开源 | ✅ 完全开源 | ❌ | ✅ 开源 |
| 成本控制 | ★★★（可用免费模型） | ★☆☆ | ★★★ |
| 适合 | 灵活、省钱、Git 重度用户 | 复杂 Agent 任务 | 大代码库分析 |

> Gemini CLI 已于 2026-06-18 停止为个人/免费用户（含 Google AI Pro/Ultra 订阅）提供服务，企业授权和付费 API Key 仍可用；个人用户官方迁移路径是 Antigravity CLI。表中「成本控制」一栏对个人用户已不适用。

---

## 常见陷阱

| 陷阱 | 说明 | 解决 |
|------|------|------|
| auto-commit 顺手提交你的改动 | Aider 要改的文件里如果有你没提交的改动，它会先把这些改动单独 commit 一次（`--dirty-commits` 默认开） | 会话前自己先 commit/`git stash`，或 `--no-dirty-commits`，或开独立分支 |
| /add 漏依赖 | 上下文不全，AI 靠文件名脑补 | 让它先 /ask 列出所有依赖再 /add |
| 模型切换质量塌 | 切到便宜模型后产出质量断崖下跌 | 分任务类型切，复杂任务回 Claude |
| lint 循环烧 token | auto-lint 失败反复让 LLM 修 | lint 用 `--fix` 模式；修不好就 `--no-auto-lint` 先关掉 |

👉 **深度展开版**：[Aider 陷阱合集](../pitfalls/aider.md) — 7 个真实踩坑场景，每个带症状 / 根因 / 出坑 / 预防

---

## 配置模板

| 模板 | 用途 |
|------|------|
| [.aider.conf.yml](templates/aider.conf.yml) | 项目配置模板（含多模型、lint、test 配置），复制到项目根目录 |

---

## 延伸阅读

- [Aider 官方文档](https://aider.chat/docs/)
- [Aider GitHub](https://github.com/Aider-AI/aider)（49k+ star）
- [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) — Skills 方法论（也支持 Aider）
