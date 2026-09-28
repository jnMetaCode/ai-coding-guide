[简体中文](./security.md) | **English**

# Security Considerations for AI-Generated Code

> AI-written code can contain security vulnerabilities. Not because AI intentionally writes insecure code, but because it tends to prioritize "make it work" — security is rarely its first concern.

---

## High-Frequency Risks

### 1. Hardcoded Secrets

AI often hardcodes keys for quick demos:

```
❌ AI might write:
const API_KEY = "sk-1234567890abcdef"
const DB_URL = "postgresql://admin:password@prod-db:5432/myapp"

✅ It should be:
const API_KEY = process.env.API_KEY
const DB_URL = process.env.DATABASE_URL
```

**Mitigation**: Explicitly prohibit this in your project rules:

```markdown
# CLAUDE.md / .cursor/rules/*.mdc
Never hardcode secrets, passwords, or tokens in source code.
All sensitive configuration must be read from environment variables.
```

### 2. SQL Injection

```
❌ AI might write (especially when prototyping fast):
const query = `SELECT * FROM users WHERE name = '${name}'`

✅ It should be:
const query = `SELECT * FROM users WHERE name = $1`
await db.query(query, [name])
```

### 3. Missing Authorization

AI frequently omits auth checks when writing CRUD endpoints:

```
❌ AI might write:
app.delete('/api/users/:id', async (req, res) => {
  await db.users.delete(req.params.id)  // Anyone can delete any user!
})

✅ It should be:
app.delete('/api/users/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ message: 'Forbidden' })
  }
  await db.users.delete(req.params.id)
})
```

### 4. Sensitive Data in Logs

```
❌ AI might add during debugging:
console.log('Login request:', { email, password })  // Password logged!
console.log('Payment response:', response)           // May contain card numbers

✅ It should be:
console.log('Login request:', { email, password: '***' })
console.log('Payment response:', { id: response.id, status: response.status })
```

---

## Security Checklist

Add these rules to your project config file:

```markdown
# Security Rules (for CLAUDE.md / .cursor/rules/*.mdc / .devin/rules/*.md)

## Never
- Hardcode secrets, passwords, or tokens
- Log sensitive data (passwords, tokens, card numbers, government IDs)
- Concatenate user input directly into SQL or shell commands
- Disable HTTPS certificate verification
- Store sensitive tokens in frontend storage (use httpOnly cookies)

## Always
- Enforce authorization on every endpoint
- Validate and sanitize all user input
- Validate file upload type and size
- Hash passwords with bcrypt or argon2
- Apply rate limiting to APIs
```

---

## AI Code Security Audits

Periodically have AI self-audit for security issues:

```
Scan the entire src/ directory against the OWASP Top 10:2025:
1. Broken Access Control (incl. SSRF)
2. Security Misconfiguration
3. Software Supply Chain Failures (vulnerable / unpinned dependencies)
4. Cryptographic Failures (plaintext secrets, weak algorithms)
5. Injection (SQL, NoSQL, command injection, XSS)
6. Insecure Design
7. Authentication Failures
8. Software or Data Integrity Failures (incl. insecure deserialization)
9. Security Logging and Alerting Failures
10. Mishandling of Exceptional Conditions (swallowed errors, fail-open)

For each finding, provide: file location, risk level, and remediation.
```
