# AI 编程安全注意事项

> AI 写的代码可能包含安全漏洞。不是因为 AI 故意写不安全的代码，而是它倾向于"先让功能跑起来"，安全性往往不是它的第一优先级。

---

## 高频风险

### 1. 敏感信息硬编码

AI 经常为了快速演示把密钥写死在代码里：

```
❌ AI 可能这样写：
const API_KEY = "sk-1234567890abcdef"
const DB_URL = "postgresql://admin:password@prod-db:5432/myapp"

✅ 应该这样：
const API_KEY = process.env.API_KEY
const DB_URL = process.env.DATABASE_URL
```

**防护**：在项目规则里明确禁止：

```markdown
# CLAUDE.md / .cursor/rules/*.mdc
禁止在代码中硬编码任何密钥、密码、token。
所有敏感配置必须通过环境变量读取。
```

### 2. SQL 注入

```
❌ AI 可能这样写（特别是快速实现时）：
const query = `SELECT * FROM users WHERE name = '${name}'`

✅ 应该这样：
const query = `SELECT * FROM users WHERE name = $1`
await db.query(query, [name])
```

### 3. 缺少权限校验

AI 写 CRUD 接口时经常忘记权限：

```
❌ AI 可能这样写：
app.delete('/api/users/:id', async (req, res) => {
  await db.users.delete(req.params.id)  // 任何人都能删任何用户！
})

✅ 应该这样：
app.delete('/api/users/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ message: '无权限' })
  }
  await db.users.delete(req.params.id)
})
```

### 4. 敏感数据日志泄露

```
❌ AI 调试时可能加的日志：
console.log('Login request:', { email, password })  // 密码被打印了！
console.log('Payment response:', response)           // 可能包含卡号

✅ 应该这样：
console.log('Login request:', { email, password: '***' })
console.log('Payment response:', { id: response.id, status: response.status })
```

---

## 防护清单

在项目配置文件中加入这些规则：

```markdown
# 安全规则（加到 CLAUDE.md / .cursor/rules/*.mdc / .devin/rules/*.md）

## 禁止
- 不要硬编码密钥、密码、token
- 不要在日志中打印敏感数据（密码、token、卡号、身份证号）
- 不要把用户输入直接拼接到 SQL/Shell 命令中
- 不要禁用 HTTPS 验证
- 不要在前端存储敏感 token（用 httpOnly cookie）

## 必须
- 所有接口必须有权限校验
- 用户输入必须做参数校验和转义
- 文件上传必须校验类型和大小
- 密码必须 hash 存储（bcrypt/argon2）
- API 必须有速率限制
```

---

## AI 代码安全审查

定期让 AI 自查安全问题：

```
扫描整个 src/ 目录，按 OWASP Top 10:2025 检查：
1. 失效的访问控制（含 SSRF）
2. 安全配置错误
3. 软件供应链失效（含已知漏洞依赖、未锁版本）
4. 加密失效（明文敏感数据、弱算法）
5. 注入（SQL、NoSQL、命令注入、XSS）
6. 不安全的设计
7. 身份认证失效
8. 软件或数据完整性失效（含不安全的反序列化）
9. 安全日志与告警失效
10. 异常情况处理不当（吞异常、失败时放行）

每个问题给出：文件位置、风险等级、修复建议。
```
