# Aider 陷阱合集

> Aider 的坑和 IDE 类工具很不一样——Git 自动提交、`/add /drop` 手动管理、多模型切换，每一个机制都能咬你一口。7 个真实坑。
>
> 踩过新坑？提 Issue 或 PR。

---

## 陷阱 1：自动 commit 把你没写完的改动也提交了

**症状**
- 你在 `user.py` 里改了一半还没 commit
- 让 Aider 也改 `user.py`
- `git log` 一看多了**两个** commit：一个是你那半截改动（commit message 还是 AI 生成的），一个才是 Aider 的修改

**根因**
Aider 默认开启 `auto-commits: true`，只提交**它自己编辑过的文件**，不会碰其他文件。但 `--dirty-commits` 也默认开启：如果它要改的文件里已经有你未提交的改动，它会**先把这些改动单独 commit 一次**，再提交自己的修改——目的是把你的工作和 AI 的修改分开，方便回滚。代价是你没写完的半成品被当成一个正式 commit 进了历史。

**出坑**
```bash
git log --oneline -3    # 找到"你的改动"那个 commit 和 Aider 的 commit
git reset --soft HEAD~2 # 两个 commit 都撤回到暂存区，改动还在
git status              # 核对哪些是你的、哪些是 Aider 的，重新组织提交
```

**预防**
三选一：
1. **开会话前自己先 commit 或 `git stash`**：工作树干净，Aider 的 commit 才干净
2. **关掉这两个行为**：`aider --no-dirty-commits`（不再替你提交已有改动），或 `--no-auto-commits` / `.aider.conf.yml` 里 `auto-commits: false`
3. **开独立 feature 分支**：`git checkout -b feature/xxx` 再开 Aider，弄脏也只是脏分支

---

## 陷阱 2：`/add` 漏文件，AI 靠脑补填空

**症状**
- 让 Aider 改 `ServiceA`，它顺利改完
- 但 ServiceA 依赖的 `UtilB` 里的函数签名其实已经变了，Aider 不知道，生成的代码调用了根本不存在的签名
- 跑起来 `TypeError`

**根因**
Aider 只把 `/add` 过的文件**完整读进上下文**。Repo Map 会提取各文件的关键符号和定义行（函数/类签名），并按引用关系图排序，但受 `map-tokens` 预算限制，只放得下最相关的一部分，**不包含函数体实现**。依赖文件没 `/add`，又恰好没进 Map，AI 只能靠名字猜。

**出坑**
```
/add src/utils/UtilB.ts
# 把依赖也加进来，让它重新看一遍
重新看一下 ServiceA 依赖的 UtilB，确认你用的签名是对的
```

**预防**
改之前先让 Aider 自己列出依赖：

```
/ask
我要改 ServiceA。列出它直接依赖的所有文件，
以及它的公开接口被哪些文件调用。
给我 /add 的命令，我一次性加齐。
```

然后把它列的都 `/add` 进来再开始 `/code`。

---

## 陷阱 3：切了模型，行为突然变了

**症状**
- 原来用 Claude，习惯了它的严谨风格
- 为了省钱切到 DeepSeek，**同一个提示词产出质量断崖下跌**
- 复杂重构开始出奇怪的 bug，Architect 模式给的方案也变得粗糙

**根因**
不同 LLM 的"指令理解能力"差异很大。同样一句 `/architect 设计 WebSocket 通知系统`：
- Claude Sonnet：会追问需求、考虑异常路径
- DeepSeek：直接给一个方案，细节覆盖不全
- 本地 7B 模型：给一个结构对但细节漏洞很多的方案

**出坑**
- 复杂任务发现模型跟不上：切回 Claude 做这一步，做完再切回便宜模型
- 配 `--weak-model` 分工：主推理用强模型，commit message/简单任务用弱模型

**预防**
配置分层（`.aider.conf.yml`）：

```yaml
model: anthropic/claude-sonnet-5-5    # 主模型
weak-model: deepseek/deepseek-v4-pro  # 弱任务（commit message、聊天记录摘要）
editor-model: anthropic/claude-haiku-4-5  # architect 模式下负责把方案落成具体文件编辑
```

或**按任务类型**切：

| 任务 | 建议模型 |
|------|---------|
| `/architect` 方案设计 | Claude Sonnet/Opus |
| `/code` 实现已有方案 | DeepSeek 够用 |
| `/ask` 问答/解释 | 任意 |
| 大型重构 | Claude Opus |

---

## 陷阱 4：Lint/Test 自动循环，账单爆炸

**症状**
- 配了 `auto-lint: true` 和 `auto-test: true`
- Aider 改完跑 lint 失败，它自己修，又失败，又修……循环几轮
- 一次对话下来 token 消耗是预期的 5 倍

**根因**
Aider 的 auto-lint/test 是 "失败就让 LLM 再改一次"。如果问题根本不是代码能修好的（比如环境配置、依赖版本），它会永远修不好，一直重试直到达到内置的反思上限（源码写死 `max_reflections = 3`，没有命令行参数可调）。每次重试都烧 token。

**出坑**
```
/undo                     # 回滚本轮修改
# 退出后用 aider --no-auto-lint 重开（或 .aider.conf.yml 里 auto-lint: false）
# 手动修根本问题（环境、配置），再打开 auto-lint
```

**预防**
- 重试次数没法调，所以要让失败尽量少进 LLM
- lint 命令用 `--fix` 模式让 linter 先尝试自动修复，而不是报错扔给 AI：

```yaml
lint-cmd: "eslint --fix"   # 不是 "eslint"
```

- 测试命令跑 fail-fast：

```yaml
test-cmd: "pytest -x --maxfail=1"
```

---

## 陷阱 5：Map 模式过期，引用了已删除的文件

**症状**
- 项目结构变了（删了目录、重命名了模块）
- Aider 还"记得"旧结构，生成 import 路径引用不存在的模块
- 或者 `/ls` 列出的文件和磁盘对不上

**根因**
Map 模式的索引在**会话开始时生成**，会话中如果 git 层面大变（切分支、rebase、大规模删除），Map 不自动刷新。

**出坑**
退出 Aider 重进，Map 会重建。
或者在会话里：
```
/reset             # 清空会话上下文
/map-refresh       # 强制刷新 repo map
```

**预防**
- 切分支后重启 Aider（别在同一会话里跨分支操作）
- 大规模文件变更后也重启
- 长会话定期 `/reset` 刷新状态

---

## 陷阱 6：Architect 方案漂亮，Code 执行跑偏

**症状**
- `/architect` 给出一个清晰的方案，你很满意
- 切回 `/code` 让它实现，头一两个文件还对，越往后越偏
- 最后成品和 Architect 方案几乎不一样

**根因**
Aider 的 Architect 和 Code 模式**共享会话上下文**，但 Architect 阶段的设计很长，随着 Code 阶段不断改代码，早期的 Architect 方案被上下文压缩逐步丢失。

**出坑**
```
# 每实现一步后，复核一次方案
/ask 对照 Architect 阶段的方案，当前实现偏离了哪些点？
```

**预防**
- Architect 方案生成后**立刻写进文件**：`把这个方案写到 docs/arch.md，我们照这个文件实现`
- 实现阶段明确引用文件：`/add docs/arch.md 按这里的方案实现下一步`
- 复杂任务**每个模块开独立会话**：一个会话做一个子模块，避免长会话漂移

---

## 陷阱 7：`/commit` 后 `--amend` 失控

**症状**
- 你让 Aider 改一下刚才的某个文件（已经自动 commit 了）
- 它做完又 commit 了一次
- 你想"合并到刚才的 commit"，让它 `--amend`
- 结果 amend 把你**之前 stash 的内容**吃进来了，或者把 Aider 的两次改动合进去，历史反而更乱

**根因**
Aider 的 commit 时机是"改完就提交"，不是"原子化每个逻辑改动"。你手动 amend 会混入所有当前 staged 内容。同时 Aider 本身不支持精细的 commit 粒度控制。

**出坑**
```bash
git reflog                    # 找回 amend 前的状态
git reset --hard HEAD@{N}     # 回滚
# 用 interactive rebase 重新整理
git rebase -i HEAD~5
```

**预防**
- Aider 会话结束后**统一 squash**：
  ```bash
  git reset --soft HEAD~N   # N = Aider 的 commit 数
  git commit -m "feat: add notifications"
  ```
- 别在 Aider 会话进行中用 `--amend`
- 关键 checkpoint 自己打 tag：`git tag wip-before-aider`，出事能回

---

## 贡献新陷阱

模板见 [claude-code.md 结尾](./claude-code.md#补充遇到新陷阱怎么办)。

---

## 相关方法论

- [Aider 完整指南](../aider/README.md)
- [common/task-decomposition.md](../common/task-decomposition.md) — 任务拆解（Aider 尤其依赖）
- [common/debugging.md](../common/debugging.md) — 系统化调试
