---
inclusion: always
---

# 项目规则

## 项目背景
<!-- 一句话说明项目做什么 -->
这是一个 Java 微服务项目，基于 Spring Boot 3。

## 技术栈
- Java 17 + Spring Boot 3.2
- ORM：MyBatis Plus
- 数据库：MySQL 8 + Redis
- 消息队列：RocketMQ
- 注册中心：Nacos
- 接口文档：Knife4j（Swagger）

## 代码规范
- 分层架构：Controller → Service → Mapper
- Controller 层只做参数校验和路由分发
- Service 层处理业务逻辑，必须有接口和实现类
- Mapper 层只做数据库操作
- 返回值统一用 `Result<T>` 包装
- 异常统一用 `BusinessException`，全局异常处理器捕获

## 命名规范
- 包名全小写（`com.example.order`）
- 类名 PascalCase（`OrderService`）
- 方法名 camelCase（`createOrder`）
- 常量 UPPER_SNAKE_CASE（`MAX_RETRY_COUNT`）
- 数据库字段 snake_case（`create_time`）

## 目录结构
- src/main/java/com/example/
  - controller/  — 接口层
  - service/     — 业务层（接口 + impl）
  - mapper/      — 数据层
  - entity/      — 数据库实体
  - dto/         — 数据传输对象
  - vo/          — 视图对象
  - config/      — 配置类
  - common/      — 公共工具

## 禁止
- 不要在 Controller 里写业务逻辑
- 不要直接用 `System.out.println`，用 Slf4j
- 不要硬编码配置值，走 `application.yml`
- 不要跳过参数校验（用 `@Valid` + `@NotNull` 等）
