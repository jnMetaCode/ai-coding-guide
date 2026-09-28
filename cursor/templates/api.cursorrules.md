---
description: API 开发规则（接口格式、安全、命名）
globs: src/app/api/**/*,src/api/**/*
alwaysApply: false
---

<!-- 用法：保存为 .cursor/rules/api.mdc（扩展名必须是 .mdc，普通 .md 会被忽略） -->

# API 开发规则

## 接口规范
- 所有接口返回统一格式：{ code: number, data: T, message: string }
- 错误码：400 参数错误 / 401 未认证 / 403 无权限 / 500 服务器错误
- 参数校验用 Zod，在 Controller 层完成

## 安全
- 敏感接口必须校验权限
- 用户输入必须做 sanitize
- 不要在响应里返回敏感字段（密码、token 等）

## 命名
- GET /api/资源名（复数）— 列表
- GET /api/资源名/:id — 详情
- POST /api/资源名 — 创建
- PATCH /api/资源名/:id — 更新
- DELETE /api/资源名/:id — 删除
