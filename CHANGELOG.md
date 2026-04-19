# 更新日志 · Changelog

> 完整提交历史见 `git log`。本文档记录面向用户的重要更新。

## 2026-04 · 重大更新：从"工具教程"到"完整落地手册"

### 🆕 新增模块

**📋 [速查表](cheatsheet.md) `cheatsheet.md`**
- 9 工具 × 13 维度横向能力矩阵
- 30 秒决策表（按需求选工具）
- 每个工具的配置文件位置 + 核心命令 + 快捷键速查
- 选型决策树 + 5 个推荐组合

**⚠️ [陷阱合集](pitfalls/) `pitfalls/`**
- 4 个工具共 **31 个深度陷阱**，按 "症状 / 根因 / 出坑 / 预防" 四段式展开
- Claude Code (8) / Cursor (8) / GitHub Copilot (8) / Aider (7)
- Windsurf / Gemini CLI / Kiro / Trae / OpenClaw 待社区贡献

**🎯 [实战场景脚本](workflows/scenarios.md) `workflows/scenarios.md`**
- 3 个端到端对话脚本：重构模块 / Cursor+Claude Code 协作 / 补老项目测试
- 通用"打断话术"集锦

**🧭 [画像推荐路径](README.md) 主 README 重构**
- 按 6 种用户画像推荐阅读路径（新手 / 前端 / 后端 / Copilot 迁移 / 控成本 / 团队协作）
- 顶部加入速查表入口

**📚 [延伸学习资源](resources.md) `resources.md`**
- 20+ 精选外部资源，分 7 类（Prompt 工程 / MCP / Agent / 中文资源 / 博客等）
- 每条三要素：链接 + 量级 + "什么场景值得看"

**🛡️ CI 自动守护 `.github/workflows/link-check.yml`**
- lychee 扫 Markdown 内外链接
- 双语对照一致性校验（每个 `xxx.md` 必须有 `xxx.en.md`）
- 每周一 cron 捕捉外链 rot

**📝 [贡献指南](CONTRIBUTING.md) 重写 + 英文版**
- 明确贡献类型按优先级排序（陷阱 > 技巧 > 场景 > 修正 > 翻译）
- 加 `CONTRIBUTING.en.md` 英文版

### 🔧 Fixes

- **agency-agents-zh 角色数 187 → 211**（12 处引用统一）
- **Aider 示例模型名 `claude-3-5-sonnet` → `claude-sonnet-4-5`**（13 处）
- **Copilot 陷阱 7 措辞修正**（"静默降级" → "排队或拒绝"）
- **英文 README 锚点修复**（`#-9-tool-guides` → `#9-tool-guides`）
- **英文 README 新手推荐工具**：Trae → Copilot/Cursor Free（国际用户适配）
- **cheatsheet 删除无法确定的 Esc Esc 描述**

### 📊 变化统计

| 项目 | 更新前 | 更新后 |
|------|-------|-------|
| Markdown 文件数 | ~42 | ~65 (+23) |
| 双语对照覆盖 | 部分 | **100%**（templates 除外） |
| CI workflow | 0 | 1（link + bilingual） |
| 陷阱合集 | 各 README 4-5 行速查 | 31 个深度展开 |
| 速查 / 决策页 | 无 | cheatsheet.md |
| 画像推荐 | 线性三步 | 6 种画像路径 |

---

## 2026-04 以前

参考 `git log` 查看历史。早期重点：

- 9 款工具独立 README
- 7 套通用方法论（prompting / debugging / testing / etc.）
- 3 个多工具协作工作流
- 中英双语初始化（大部分章节）
- 可复制的配置模板
