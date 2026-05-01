# book/ — AI 编程实战三卷书脚手架

> 把 ai-coding-guide 仓库的现成内容重组成 **3 卷 + 1 别册** 的渐进式读本。
> 用 [mdBook](https://rust-lang.github.io/mdBook/) 编译成静态 HTML 网站 + PDF。

## 结构

```
book/
├── README.md          ← 你正在看
├── book.toml          ← mdbook 配置
├── .gitignore         ← 忽略 book/book/ 输出目录
└── src/
    ├── SUMMARY.md     ← 主目录（决定章节顺序）
    ├── intro.md       ← 总序
    ├── v1-intro.md    ← 卷一·入门 序
    ├── v2-intro.md    ← 卷二·工作流 序
    ├── v3-intro.md    ← 卷三·架构 序
    ├── about.md       ← 关于本书
    │
    ├── cheatsheet.md  ← 软链 → ../../cheatsheet.md
    ├── changelog.md   ← 软链 → ../../CHANGELOG.md
    ├── resources.md   ← 软链 → ../../resources.md
    ├── methods/       ← 软链 → ../../common/   (7 套方法论)
    ├── workflows-src/ ← 软链 → ../../workflows/ (协作 + 场景)
    ├── pitfalls-src/  ← 软链 → ../../pitfalls/  (踩坑合集)
    └── tools/
        ├── claude-code/ ← 软链 → ../../../claude-code/
        ├── codex/       ← 软链 → ../../../codex/
        ├── cursor/      ← 软链 → ../../../cursor/
        └── ...（10 工具全部）
```

**关键设计**：所有内容都是 symlink 而不是复制。仓库主目录改了，重新 `mdbook build` 立刻同步。零内容重复维护。

## 怎么本地预览

```bash
# 一次性装 mdbook
brew install mdbook
# 或 cargo install mdbook

# 预览（实时热更新，浏览器自动打开）
cd book
mdbook serve --open

# 编译成静态 HTML（输出在 book/book/）
mdbook build
```

## 怎么发布

### 选项 1：GitHub Pages ⭐ 已配置

CI 已经接好——`.github/workflows/book.yml` 在每次 push 到 main 时自动 build 并 deploy。

**只需在仓库 Settings 里开 Pages 一次**。完整步骤 + 自定义域名教程见 [`DEPLOY.md`](./DEPLOY.md)。

默认 URL：**`https://aibuzhiyu.com/`**

### 选项 2：Netlify / Vercel（PR preview 友好）

仓库根目录加 `netlify.toml`：

```toml
[build]
  command = "cd book && mdbook build"
  publish = "book/book"
[build.environment]
  RUST_VERSION = "1.78"
```

netlify 会自动装 mdbook（用 `cargo install mdbook` build 命令前面手动加一下）。

### 选项 3：Leanpub / GitBook 商业版

如果想出电子书赚钱：mdbook build 出 HTML 之后，用 [pandoc](https://pandoc.org/) 转成 epub / mobi / PDF：

```bash
mdbook build
cd book/book
# 把所有 HTML 串起来转 PDF
pandoc -o ../../ai-coding-guide.pdf $(find . -name "*.html" | sort) \
  --pdf-engine=xelatex \
  -V mainfont="PingFang SC" -V CJKmainfont="PingFang SC"
```

## 节奏

这是 **v0.1 脚手架**——目录结构、3 卷序、symlink 就位，可以 build 出能看的版本了，但内容主要靠的是仓库里既有的章节。后续要加的：

- [ ] 各卷之间的"过渡章"（卷一末→卷二首的承上启下）
- [ ] 卷三的「CI 集成 / 团队治理」实战章节（仓库里还没有，需要新写）
- [ ] 端到端项目案例（"用 Claude Code + Codex CLI 做完一个真实小项目"）
- [ ] 出版用的封面 / ISBN / 版式（如果要走出版社）
- [ ] PDF 导出脚本调优（中文字体 / 代码块换行）

每一项都可以独立 PR 进来。

## License

**CC BY-NC-SA 4.0** — 个人免费 / 禁商业 / 派生开源。详见 [`LICENSE`](./LICENSE) 或 [中文友好版](./LICENSE.zh-CN.md)。

> 与主仓库 Apache-2.0 是双 license 关系：`book/` 目录下用 CC，其他都是 Apache。

## 上游

GitHub: [jnMetaCode/ai-coding-guide](https://github.com/jnMetaCode/ai-coding-guide)
