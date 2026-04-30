# <项目名>

> AGENTS.md — Codex CLI 项目指令文件
> 放在 git 仓库根目录，Codex 启动时自动加载（叠加 `~/.codex/AGENTS.md`）。
> 默认大小限制 32 KiB，建议精简、把详尽内容拆到子目录的 AGENTS.md。

## 项目概览

一句话介绍：<这是什么项目、解决什么问题>

技术栈：
- 语言 / 运行时：<例如 TypeScript + Node 20 / Go 1.22 / Python 3.12>
- 主要框架：<例如 Next.js 14 / FastAPI / Spring Boot>
- 关键依赖：<DB / 缓存 / 消息队列 / 鉴权方案>

## 目录约定

```
src/
  api/         接口层（路由、controller）
  services/    业务逻辑
  lib/db/      数据访问（仅此目录可发 SQL / ORM 调用）
  components/  UI 组件（PascalCase）
  utils/       纯函数工具（无副作用）
tests/         测试
docs/          文档
```

## 构建 / 测试 / Lint

Codex 改完代码后，请按顺序跑：

| 命令 | 用途 | 必须通过 |
|------|------|---------|
| `<pnpm typecheck>` | 类型检查 | ✅ |
| `<pnpm lint>` | 静态检查 | ✅ |
| `<pnpm test>` | 单元测试 | ✅ |
| `<pnpm build>` | 构建检查 | 涉及构建配置时跑 |

## 工程约束

- <例：所有 API 接口必须返回统一的 `{ code, message, data }` 结构>
- <例：DB 查询必须走 `src/lib/db/` 下封装，不允许在业务层写裸 SQL>
- <例：禁止 `any`、`@ts-ignore`，必要时用 `// TODO(types):` 标注>
- <例：组件 props 必须显式声明类型，不要 `React.FC<>`>

## 不要做的事

- 不要修改 `src/legacy/`，那是兼容层
- 不要新增运行时依赖（dependencies），需要时先问
- 不要在测试外的代码里 `console.log`，统一用 `logger`
- 不要绕过 husky / pre-commit hook

## 完成判定（Done when）

- 单测覆盖到改动路径
- `pnpm typecheck && pnpm lint && pnpm test` 全绿
- 涉及 API 时，`docs/api.md` 同步更新
- 不引入新的 lint warning

## 常见任务的"标准流程"

### 加新接口

1. 在 `src/api/<resource>/route.ts` 写路由 + zod schema
2. 在 `src/services/<resource>.ts` 写业务逻辑
3. 在 `src/lib/db/<resource>.ts` 写数据访问（如需）
4. 在 `tests/api/<resource>.test.ts` 补单测
5. 更新 `docs/api.md`

### 重构

- 多文件重构强制走 `/plan`，先列计划再改
- 单次 PR 控制在 ≤ 15 个文件，超过就拆

## 参考文件

- 路由风格参考：`src/api/users/route.ts`
- service 风格参考：`src/services/users.ts`
- 测试风格参考：`tests/api/users.test.ts`
