# FitMeal 项目规格文档

本目录包含 FitMeal 健身饮食助手的完整规格文档，供 Ralph 自动开发参考。

## 文档列表

| 文件 | 说明 | 技能来源 |
|------|------|----------|
| `01-real.md` | 现实约束 - 4 条必须遵守的规则 | meta-42cog |
| `02-cog.md` | 认知模型 - 代理人、实体、情境 | meta-42cog |
| `03-prd.md` | 产品需求 - Affordance 驱动的 PRD | pm-product-requirements |
| `04-userstory.md` | 用户故事 - 17 个最小故事，3 个迭代 | pm-user-story |
| `05-architecture.md` | 系统架构 - 6 个子系统，API 设计 | dev-system-architecture |
| `06-ui.md` | UI 设计 - 页面布局，组件规格 | design-ui-design |
| `07-schema.ts` | 数据库 Schema - 10 张表定义 | dev-database-design |

## 阅读顺序

```
01-real.md (约束) → 02-cog.md (模型) → 03-prd.md (需求)
                                           ↓
                                    04-userstory.md (故事)
                                           ↓
            05-architecture.md (架构) ← 06-ui.md (UI)
                     ↓
               07-schema.ts (数据库)
```

## 核心信息速查

### 技术栈
- Next.js 15 + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Zustand (状态管理)
- Neon PostgreSQL + Drizzle ORM
- EdgeOne Pages (部署)

### 关键约束 (real.md)
1. 用户健康数据必须加密存储，仅本人可访问
2. 饮食建议必须标注"仅供参考"免责声明
3. 食谱必须来自真实来源，禁止 AI 编造
4. 用户可随时导出和删除个人数据

### 核心实体 (cog.md)
- `user` - 用户
- `workout` - 运动记录
- `meal` - 饮食记录
- `recipe` - 食谱（来自真实来源）
- `inventory` - 预制菜库存
- `recommendation` - 推荐结果

### 迭代计划 (userstory.md)
- **迭代 1**: 核心价值 - 情境选择 → 推荐 → 食谱跟做
- **迭代 2**: 预制菜库存 + 运动记录
- **迭代 3**: 后端 API + 数据安全
