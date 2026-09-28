# 贡献指南

感谢你对 AI 编程工具实战指南的关注！

## 可以贡献什么

欢迎的贡献类型（按"最受欢迎"排序）：

### 🔥 优先级高：真实踩坑的陷阱

写 [`pitfalls/<tool>.md`](./pitfalls/)：你用某个工具时踩过的坑。**要求真实遇到过**，不是推测。

格式：症状 / 根因 / 出坑 / 预防 四段式。详细模板见 [pitfalls/README.md](./pitfalls/README.md)。

尚未覆盖的工具：Codex CLI / Windsurf / Gemini CLI / Kiro / Trae / OpenClaw。

### 🔥 实用工具技巧

补充 `工具名/README.md` 的"提示词技巧"或"进阶技巧"章节。每个技巧必须：
- 有具体场景（不是"这样更好"而是"在 X 场景下 Y 更好"）
- 附 ❌/✅ 对比或可复制的提示词
- 附可验证结果（跑了什么、看到什么）

### ⚡ 实战对话脚本

补充 [`workflows/scenarios.md`](./workflows/scenarios.md) 的端到端场景。一个完整可跑的提示词序列，覆盖从需求到验收的全流程。

### ⚡ 修正过时信息

AI 工具更新很快。发现过时内容（版本号、定价、命令、功能差异）请修正：
- [`cheatsheet.md`](./cheatsheet.md) — 速查表的参数
- 各 `工具名/README.md` — 具体命令和快捷键
- [`ecosystem.md`](./ecosystem.md) — 生态项目的角色数、功能

### ⚡ 翻译与双语维护

所有内容都有 `.md`（中文）和 `.en.md`（英文）双语。贡献时：
- 更新中文 → 同步更新英文版（可以先放一个 draft，有人会帮忙 polish）
- 只翻译已有中文但缺英文的文件也是有效贡献
- `templates/` 目录下的配置模板**不需要**翻译（是项目专属）

CI 会自动校验每个 `.md` 都有配套 `.en.md`。

## 贡献流程

1. Fork 本项目
2. 创建 feature 分支：`git checkout -b add-xxx-tip`
3. 提交修改（commit message 用中文或英文均可）
4. 推送到你的 fork：`git push origin add-xxx-tip`
5. 提交 Pull Request

PR 提交后会触发 CI：
- **Link Check** — 检查 Markdown 内外链接是否有效
- **Bilingual Parity** — 检查双语对照完整性

CI 红的话，看 Actions 输出修复即可。

## 内容规范

- **实用优先** — 每个技巧都应该有具体的使用场景，不要空谈概念
- **代码示例** — 用 ❌/✅ 对比展示好坏做法
- **保持简洁** — 一段话能说清楚的不要写三段
- **事实准确** — 命令、配置、API 必须经过验证，不要编造
- **避免"pitfall 的 pitfall"** — 写陷阱时，不要把"忘记保存文件"这种操作失误当成陷阱（详见 [pitfalls/README.md](./pitfalls/README.md) 的质量标准）

## 文件结构

```
cheatsheet.md             — 10 工具速查表（横向对比 + 命令速查）
ecosystem.md              — 相关项目生态（superpowers / agents 等）

工具名/README.md          — 某个工具的完整指南（10 个工具）
工具名/templates/         — 可复制的配置模板

common/xxx.md             — 跨工具的通用方法论（prompting / debugging 等）
workflows/xxx.md          — 多工具协作工作流 + 实战对话脚本
pitfalls/<tool>.md        — 每个工具的深度陷阱合集
```

## 许可

提交的内容将采用 [Apache 2.0](./LICENSE) 许可。
