---
trigger: always_on
---

<!-- 用法：复制到项目的 .devin/rules/project.md（Devin Desktop，原 Windsurf；旧项目也可放 .windsurf/rules/）。
     单文件上限 12,000 字符。.windsurfrules 根目录单文件仅作兼容保留，新项目不建议再用。 -->

# 项目规则

## 项目背景
<!-- 一句话说明项目做什么 -->
这是一个 Vue 3 + TypeScript 的后台管理系统。

## 技术栈
- Vue 3 + TypeScript + Vite
- UI 框架：Element Plus
- 状态管理：Pinia
- 路由：Vue Router 4
- HTTP 请求：Axios
- 样式：SCSS + CSS Modules

## 代码规范
- 使用 Composition API（`<script setup>` 语法糖）
- 组件命名 PascalCase，文件命名 kebab-case
- Props 用 `defineProps<T>()` 泛型写法
- Emits 用 `defineEmits<T>()` 泛型写法
- Store 按功能模块拆分（`stores/user.ts`、`stores/order.ts`）
- API 请求封装在 `src/api/` 下，按模块分文件

## 目录结构
- src/views/     — 页面组件
- src/components/ — 公共组件
- src/api/       — API 请求封装
- src/stores/    — Pinia stores
- src/utils/     — 工具函数
- src/types/     — TypeScript 类型定义

## Agent 行为
- 修改组件时自动检查 Props 类型是否完整
- 修改 API 接口时提醒更新对应的 TypeScript 类型
- 不要自动重构我没要求改的代码
- 修改 store 时检查是否有组件依赖了被删除的 state

## 禁止
- 不要用 Options API
- 不要用 any 类型
- 不要直接操作 DOM（用 ref）
- 不要在组件里直接调 axios，走 api 层封装
