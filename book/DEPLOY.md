# 部署到 GitHub Pages

## 一次性配置（5 分钟）

CI workflow 已经在 [`.github/workflows/book.yml`](../.github/workflows/book.yml)，每次 push 到 main 自动 build + deploy。但 GitHub Pages 必须**先在仓库设置里开一下**。

### 步骤

1. 打开仓库 Settings：[github.com/jnMetaCode/ai-coding-guide/settings/pages](https://github.com/jnMetaCode/ai-coding-guide/settings/pages)
2. **Source** 选 **GitHub Actions**（不要选 "Deploy from a branch"——我们用的是新的 Actions 直接发布模式）
3. 保存。下次 push 会自动跑 workflow，跑完几分钟内 Pages 上线
4. 默认 URL 是：**`https://jnmetacode.github.io/ai-coding-guide/`**

---

## 绑自定义域名（可选，推荐）

公开 URL 更专业，公众号文章能直接点进去。

### 步骤

1. **买域名**（推荐）
   - 国内：阿里云国际 / 腾讯云海外 / namesilo（境外，约 ¥50-80/年）
   - 推荐域名风格：`book.aibukezhi.com` / `aicodeguide.dev` / `huozaibian.ai`
   - 跟你公众号「AI不止语」呼应的话：`aibukezhi.com` / `aibuzhiyu.com`

2. **配置 DNS**（域名注册商管理面板里加）
   - 类型：`CNAME`
   - 主机记录（前缀）：`book`（或 `@` 表示根域名）
   - 记录值：`jnmetacode.github.io`
   - TTL：`600` 或默认

3. **告诉 mdbook 这个域名是你的**——在 `book/src/` 下建一个文件 `CNAME`（**注意大写、无后缀**）：
   ```
   book.aibukezhi.com
   ```
   只一行，写你的完整域名即可。mdbook 会把这文件原样复制到输出目录，GitHub Pages 看到就认。

4. **GitHub Pages 验证**
   - DNS 生效后（一般 5-30 分钟），回到 Settings → Pages
   - **Custom domain** 那里填你的域名，点 **Save**
   - 等 GitHub 自动签 HTTPS 证书（约几分钟到 1 小时）
   - 勾选 **Enforce HTTPS**

完成后访问 `https://book.aibukezhi.com` 就能看到书了。

---

## 后续维护

- 改任意 markdown → push → 几分钟内自动上线
- 想强制重 build：在 Actions 页面手动跑 `Build and deploy book` workflow
- Build 慢/失败：去 [Actions 页面](https://github.com/jnMetaCode/ai-coding-guide/actions/workflows/book.yml) 看日志

## 常见问题

**Q：能不能两个域名同时指向（比如裸根域 + book 子域）？**
A：能，但 GitHub Pages 只接受 `CNAME` 文件里写一个域名。其他域名要在 DNS 层做 301 重定向。

**Q：要不要开自定义 404 页？**
A：mdbook 已自动生成 `404.html`，GitHub Pages 自动 fallback 到它。不用额外配置。

**Q：内容更新后多久上线？**
A：push 后 → workflow 跑（~30 秒）→ Pages CDN 刷新（~1-2 分钟）= **2-3 分钟内可见**。

**Q：workflow 跑失败怎么办？**
A：最常见是 mdbook 二进制下载链接挂了。看 [book.yml](../.github/workflows/book.yml)，调一下 `MDBOOK_VERSION`（去 [mdBook releases](https://github.com/rust-lang/mdBook/releases) 查最新版）即可。
