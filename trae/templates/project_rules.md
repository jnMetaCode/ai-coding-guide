---
alwaysApply: true
---

# 项目规则

## 项目背景
<!-- 一句话说明项目做什么 -->
这是一个 React + TypeScript 的中后台管理系统。

## 技术栈
- React 18 + TypeScript + UmiJS 4
- UI 框架：Ant Design 5 + Ant Design Pro
- 状态管理：@umijs/max 内置 Model
- 请求：umi-request
- 图表：@ant-design/charts

## 代码规范
- 使用函数组件 + Hooks，不用 Class 组件
- 页面组件放 `src/pages/`，公共组件放 `src/components/`
- 请求用 umi-request 封装，不要直接用 fetch/axios
- 样式用 CSS Modules（`xxx.module.less`）
- ProTable/ProForm 配置优先，减少自定义代码

## 目录结构
- src/pages/      — 页面（按路由自动注册）
- src/components/ — 公共组件
- src/services/   — API 请求封装
- src/models/     — 全局状态
- src/utils/      — 工具函数
- src/types/      — TypeScript 类型

## 中文规范
- 代码注释用中文
- commit message 用中文
- 用户可见的文案写在配置文件里，方便后续国际化
- 变量名和函数名用英文

## 禁止
- 不要用 any 类型
- 不要在组件里直接发请求，走 services 层
- 不要手写表格/表单，优先用 ProTable/ProForm
- 不要用 class 组件
