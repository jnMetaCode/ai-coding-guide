# 关于本书

## 为什么有这本书

[ai-coding-guide](https://github.com/jnMetaCode/ai-coding-guide) 仓库到 2026-04 已经积累了：

- 10 款主流 AI 编程工具的中文教程
- 7 套通用方法论（提示词、需求拆解、调试、测试、代码审查、上下文管理、安全）
- 多个端到端实战脚本 + 31 个深度踩坑合集
- 9 工具横向对比速查表

但仓库形态有个问题：**新读者打开 README 看到 50 个链接，不知道从哪读起**。

这本书就是把这堆"各自精彩但散乱"的内容，按读者画像重新编排，给一个**有顺序、有节奏、有起承转合**的阅读路径。

## 内容来源

每一章本质上都是仓库里某个文件的"重新装订"——内容 0 修改，只在卷首加导读、卷末加串联。

| 章节 | 上游文件 |
|------|---------|
| 卷一 各工具速通 | `<tool>/README.md`（如 `claude-code/README.md`） |
| 卷二 方法论 | `common/<topic>.md`（如 `common/debugging.md`） |
| 卷二 踩坑合集 | `pitfalls/<tool>.md` |
| 卷二 协作章节 | `workflows/<combo>.md` |
| 别册速查表 | `cheatsheet.md` |

**好处**：仓库更新 → 书自动更新（用 mdbook 重新 build 即可）。这本书永远跟仓库同步，不会出现"书是 2026 年印的，工具早换代了"的尴尬。

## 怎么本地构建

```bash
# 装 mdbook（一次性）
brew install mdbook        # macOS
# 或 cargo install mdbook   # 其他平台

# 在仓库根目录
cd book
mdbook serve --open        # 实时预览（改 markdown 自动热更新）
mdbook build               # 生成静态 HTML 到 book/book/
```

## 反馈渠道

- GitHub Issues：[jnMetaCode/ai-coding-guide/issues](https://github.com/jnMetaCode/ai-coding-guide/issues)
- 微信公众号：**AI不止语**（搜索 `AI_BuZhiYu`）
- QQ 群 / 微信群：见仓库 README

## License

本书使用 **CC BY-NC-SA 4.0**（署名-非商业-相同方式共享）。

- ✅ **个人免费**：阅读 / 学习 / 转载 / 节选 / 二次创作（注明来源即可）
- ❌ **商业使用需授权**：付费课程、企业内训（>10 人）、纸书出版、付费墙转售等
- 🔗 详见：[`LICENSE`](https://github.com/jnMetaCode/ai-coding-guide/blob/main/book/LICENSE)（英文全文） · [`LICENSE.zh-CN.md`](https://github.com/jnMetaCode/ai-coding-guide/blob/main/book/LICENSE.zh-CN.md)（中文友好版）

> ⚠️ 仓库**双 license**：`book/` 目录下的书用 CC BY-NC-SA 4.0，仓库其他部分（教程文 / 模板 / 脚本）用 Apache-2.0。

商业授权咨询：见仓库主 README 「**商业合作 · 内训咨询**」段落。
