# FitMeal - 系统架构文档

<meta>
  <document-id>fitmeal-architecture</document-id>
  <version>1.0.0</version>
  <project>FitMeal 健身饮食助手</project>
  <type>System Architecture</type>
  <created>2026-01-14</created>
  <depends>real.md, cog.md, prd.md, userstory.md</depends>
</meta>

---

## 1. 架构概览

### 1.1 架构模式

**选择：分层架构 + 模块化设计**

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│              (React Components + Zustand Store)              │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                         │
│              (API Routes + Server Actions)                   │
├─────────────────────────────────────────────────────────────┤
│                      Domain Layer                            │
│                (Services + Business Logic)                   │
├─────────────────────────────────────────────────────────────┤
│                   Infrastructure Layer                       │
│          (Database + External APIs + Crawlers)               │
└─────────────────────────────────────────────────────────────┘
```

**选择理由：**
- Next.js App Router 天然支持分层架构
- 模块化设计便于后续功能扩展
- 清晰的职责分离，便于维护

### 1.2 技术栈 (from real.md)

| 层级 | 技术选型 |
|------|---------|
| 前端框架 | Next.js 15 + React 19 + TypeScript |
| 状态管理 | Zustand |
| 样式 | Tailwind CSS |
| 数据库 | Neon PostgreSQL (Serverless) |
| ORM | Drizzle ORM |
| 部署 | EdgeOne Pages |

### 1.3 部署架构

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   EdgeOne CDN   │────▶│  EdgeOne Pages  │────▶│ Neon PostgreSQL │
│   (Static)      │     │  (SSR/API)      │     │   (Database)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌─────────────────┐
                        │  Recipe Sources │
                        │ (下厨房/美食杰) │
                        └─────────────────┘
```

---

## 2. 系统架构图

```
┌─────────────────────────────────────────────────────────────────────┐
│                           FitMeal System                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                     Frontend (Next.js)                        │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │   │
│  │  │  Home   │  │ Recipe  │  │Inventory│  │ Workout │          │   │
│  │  │  Page   │  │  Page   │  │  Page   │  │  Page   │          │   │
│  │  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘          │   │
│  │       │            │            │            │                │   │
│  │       └────────────┴────────────┴────────────┘                │   │
│  │                          │                                     │   │
│  │                    ┌─────┴─────┐                               │   │
│  │                    │  Zustand  │                               │   │
│  │                    │   Store   │                               │   │
│  │                    └───────────┘                               │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                │                                     │
│                          API Routes                                  │
│                                │                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                        Backend                                │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │   │
│  │  │    Auth     │  │Recommendation│  │   Recipe    │           │   │
│  │  │   Service   │  │   Service   │  │   Service   │           │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │   │
│  │  │  Workout    │  │    Meal     │  │  Inventory  │           │   │
│  │  │   Service   │  │   Service   │  │   Service   │           │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘           │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                │                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                     Infrastructure                            │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │   │
│  │  │    Neon     │  │   Recipe    │  │   Food      │           │   │
│  │  │ PostgreSQL  │  │   Crawler   │  │  Database   │           │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘           │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. 子系统设计

### 3.1 Auth 子系统

**职责：** 用户认证、授权和会话管理

**组件：**
- `AuthService`: 处理注册、登录、登出
- `SessionManager`: 管理用户会话
- `PasswordHasher`: 密码加密（bcrypt）

**接口：**
- Input: 用户凭证（邮箱+密码）
- Output: 会话令牌、用户信息

**约束 (from real.md):**
- 密码必须使用 bcrypt 加密存储
- 健康数据仅用户本人可访问

---

### 3.2 Recommendation 子系统 (核心)

**职责：** 根据用户情境和历史，生成个性化饮食推荐

**组件：**
- `ContextAnalyzer`: 分析用户当前情境
- `RecommendationEngine`: 生成推荐列表
- `NutritionCalculator`: 计算营养需求

**接口：**
- Input: 用户ID、情境类型（刚练完/很忙/有时间/朋友来了）
- Output: 推荐菜品列表（含食谱ID、营养信息）

**依赖：**
- Depends on: Auth, Recipe, Workout, Meal
- Used by: Frontend (HomePage)

**算法逻辑：**
```
1. 获取用户目标（增肌/减脂/维持）
2. 获取最近运动记录（如有）
3. 计算当日营养缺口
4. 匹配适合的食谱
5. 按情境过滤（时间、难度）
6. 返回 Top 3 推荐
```

---

### 3.3 Recipe 子系统

**职责：** 食谱数据管理和展示

**组件：**
- `RecipeRepository`: 食谱数据存取
- `RecipeCrawler`: 从外部源抓取食谱
- `RecipeParser`: 解析食谱结构

**接口：**
- Input: 食谱ID / 筛选条件
- Output: 食谱详情（步骤、食材、营养）

**约束 (from real.md):**
- 食谱必须来自真实来源（下厨房/美食杰/API）
- 必须保留原始来源链接
- 禁止 AI 编造食谱步骤

**数据来源：**
| 来源 | 类型 | 优先级 |
|------|------|--------|
| 下厨房 (xiachufang.com) | 爬虫 | P0 |
| 美食杰 (meishij.net) | 爬虫 | P1 |
| Spoonacular API | API | P2 |

---

### 3.4 Workout 子系统

**职责：** 运动记录管理

**组件：**
- `WorkoutRepository`: 运动数据存取
- `WorkoutAnalyzer`: 分析运动模式

**接口：**
- Input: 用户ID、运动详情（类型、强度、部位、时长）
- Output: 运动记录、统计数据

**约束 (from real.md):**
- 运动数据加密存储
- 仅用户本人可访问

---

### 3.5 Meal 子系统

**职责：** 饮食记录管理

**组件：**
- `MealRepository`: 饮食数据存取
- `NutritionTracker`: 追踪营养摄入

**接口：**
- Input: 用户ID、餐食详情（食物、份量）
- Output: 饮食记录、营养统计

---

### 3.6 Inventory 子系统

**职责：** 预制菜库存管理

**组件：**
- `InventoryRepository`: 库存数据存取
- `ExpirationTracker`: 追踪保质期
- `AlertService`: 过期提醒

**接口：**
- Input: 用户ID、预制菜详情（菜品、份数、制作日期）
- Output: 库存列表、过期提醒

**业务逻辑：**
```
保质期计算规则：
- 冷藏菜品：默认 3 天
- 冷冻菜品：默认 7 天
- 可由食谱元数据覆盖

提醒规则：
- 剩余 3 天：黄色警示
- 已过期：红色警示
```

---

## 4. API 设计

### 4.1 API 总览

```
/api
├── /auth
│   ├── POST /register        # 用户注册
│   ├── POST /login           # 用户登录
│   ├── POST /logout          # 用户登出
│   └── GET  /session         # 获取当前会话
│
├── /users
│   ├── GET  /me              # 获取当前用户信息
│   ├── PUT  /me              # 更新用户信息
│   ├── PUT  /me/goals        # 更新用户目标
│   ├── GET  /me/export       # 导出用户数据
│   └── DELETE /me            # 删除用户账号
│
├── /recommendations
│   ├── POST /                # 获取推荐（传入情境）
│   └── POST /refresh         # 换一批推荐
│
├── /recipes
│   ├── GET  /                # 食谱列表
│   ├── GET  /:id             # 食谱详情
│   ├── GET  /:id/steps       # 食谱步骤
│   └── GET  /:id/shopping    # 生成购物清单
│
├── /workouts
│   ├── GET  /                # 运动记录列表
│   ├── POST /                # 添加运动记录
│   ├── GET  /:id             # 运动记录详情
│   └── GET  /stats           # 运动统计
│
├── /meals
│   ├── GET  /                # 饮食记录列表
│   ├── POST /                # 添加饮食记录
│   └── GET  /stats           # 营养统计
│
└── /inventory
    ├── GET  /                # 库存列表
    ├── POST /                # 添加库存
    ├── PUT  /:id             # 更新库存
    ├── DELETE /:id           # 删除库存
    ├── POST /:id/consume     # 消费一份
    └── GET  /expiring        # 即将过期列表
```

### 4.2 核心 API 详细设计

#### POST /api/recommendations

**描述：** 根据用户情境获取饮食推荐（核心 API）

**认证：** Required

**请求体：**
```typescript
{
  context: "post_workout" | "busy" | "have_time" | "friends_over",
  mealType?: "breakfast" | "lunch" | "dinner" | "snack"
}
```

**响应：**
```typescript
// 200 OK
{
  recommendations: [
    {
      id: string,
      recipeId: string,
      name: string,
      image: string,
      cookTime: number,        // 分钟
      difficulty: "easy" | "medium" | "hard",
      nutrition: {
        calories: number,
        protein: number,
        carbs: number,
        fat: number
      },
      reason: string,          // 推荐理由
      source: string,          // 来源（下厨房/美食杰）
      sourceUrl: string        // 原始链接
    }
  ],
  disclaimer: "以上建议仅供参考，不能替代专业营养师建议"  // real.md 约束
}
```

---

#### GET /api/recipes/:id

**描述：** 获取食谱详情

**认证：** Required

**响应：**
```typescript
// 200 OK
{
  id: string,
  name: string,
  description: string,
  image: string,
  source: string,             // 来源平台
  sourceUrl: string,          // 原始链接（real.md 约束）
  cookTime: number,
  difficulty: "easy" | "medium" | "hard",
  servings: number,

  ingredients: [
    {
      foodId: string,
      name: string,
      amount: string,         // "200g", "2个"
      optional: boolean
    }
  ],

  steps: [
    {
      order: number,
      description: string,
      image?: string,
      duration?: number       // 预计时间（分钟）
    }
  ],

  nutrition: {
    calories: number,
    protein: number,
    carbs: number,
    fat: number,
    fiber: number
  },

  tags: string[],             // ["高蛋白", "低脂", "预制友好"]
  prepFriendly: boolean,      // 是否适合预制
  shelfLife: number           // 预制后保质期（天）
}
```

---

#### POST /api/inventory

**描述：** 添加预制菜到库存

**认证：** Required

**请求体：**
```typescript
{
  recipeId: string,
  name: string,
  portions: number,           // 份数
  storageType: "refrigerated" | "frozen",
  preparedAt: string          // ISO date
}
```

**响应：**
```typescript
// 201 Created
{
  id: string,
  name: string,
  portions: number,
  storageType: string,
  preparedAt: string,
  expiresAt: string,          // 自动计算
  daysLeft: number
}
```

---

## 5. 目录结构

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 认证路由组
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (main)/                   # 主应用路由组
│   │   ├── page.tsx              # 首页（情境选择）
│   │   ├── recommend/
│   │   │   └── page.tsx          # 推荐结果页
│   │   ├── recipe/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # 食谱详情页
│   │   ├── inventory/
│   │   │   └── page.tsx          # 预制菜库存页
│   │   ├── workout/
│   │   │   └── page.tsx          # 运动记录页
│   │   ├── settings/
│   │   │   └── page.tsx          # 设置页
│   │   └── layout.tsx
│   │
│   ├── api/                      # API 路由
│   │   ├── auth/
│   │   │   ├── register/route.ts
│   │   │   ├── login/route.ts
│   │   │   └── logout/route.ts
│   │   ├── users/
│   │   │   └── me/route.ts
│   │   ├── recommendations/
│   │   │   └── route.ts
│   │   ├── recipes/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── workouts/
│   │   │   └── route.ts
│   │   ├── meals/
│   │   │   └── route.ts
│   │   └── inventory/
│   │       ├── route.ts
│   │       └── [id]/
│   │           ├── route.ts
│   │           └── consume/route.ts
│   │
│   ├── layout.tsx                # 根布局
│   └── globals.css
│
├── components/                   # React 组件
│   ├── ui/                       # 基础 UI 组件
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── context/                  # 情境选择组件
│   │   └── ContextCard.tsx
│   ├── recipe/                   # 食谱相关组件
│   │   ├── RecipeCard.tsx
│   │   ├── RecipeSteps.tsx
│   │   ├── IngredientList.tsx
│   │   └── NutritionLabel.tsx
│   ├── inventory/                # 库存相关组件
│   │   ├── InventoryList.tsx
│   │   └── InventoryItem.tsx
│   ├── workout/                  # 运动相关组件
│   │   └── WorkoutForm.tsx
│   └── layout/                   # 布局组件
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Disclaimer.tsx        # 免责声明组件
│
├── lib/                          # 工具库
│   ├── db/                       # 数据库
│   │   ├── index.ts              # Drizzle 客户端
│   │   ├── schema.ts             # 数据库 Schema
│   │   └── migrations/           # 迁移文件
│   ├── auth/                     # 认证工具
│   │   ├── session.ts
│   │   └── password.ts
│   ├── utils/                    # 通用工具
│   │   ├── date.ts
│   │   └── nutrition.ts
│   └── validators/               # 数据验证
│       └── schemas.ts            # Zod schemas
│
├── services/                     # 业务逻辑层
│   ├── auth.service.ts
│   ├── recommendation.service.ts
│   ├── recipe.service.ts
│   ├── workout.service.ts
│   ├── meal.service.ts
│   └── inventory.service.ts
│
├── stores/                       # Zustand 状态管理
│   ├── useAuthStore.ts
│   ├── useRecommendStore.ts
│   └── useInventoryStore.ts
│
├── hooks/                        # React Hooks
│   ├── useAuth.ts
│   └── useRecipe.ts
│
├── types/                        # TypeScript 类型
│   ├── user.ts
│   ├── recipe.ts
│   ├── workout.ts
│   ├── meal.ts
│   └── inventory.ts
│
├── constants/                    # 常量
│   ├── contexts.ts               # 情境类型
│   ├── nutrition.ts              # 营养参考值
│   └── storage.ts                # 存储类型
│
└── crawlers/                     # 食谱爬虫（可选独立部署）
    ├── xiachufang/
    │   └── crawler.ts
    └── meishij/
        └── crawler.ts
```

---

## 6. 安全架构

### 6.1 安全层级

```
┌─────────────────────────────────────────┐
│           Transport Layer               │
│         HTTPS (EdgeOne SSL)             │
├─────────────────────────────────────────┤
│           Authentication                │
│      JWT + bcrypt Password Hash         │
├─────────────────────────────────────────┤
│           Authorization                 │
│     Resource Ownership Validation       │
├─────────────────────────────────────────┤
│           Data Protection               │
│   Encryption + Input Validation (Zod)   │
└─────────────────────────────────────────┘
```

### 6.2 安全需求矩阵 (from real.md)

| 约束 | 实现方式 |
|------|---------|
| 用户健康数据加密存储 | 敏感字段使用 AES-256 加密 |
| 仅用户本人可访问 | API 层验证 userId 所有权 |
| 密码加密存储 | bcrypt (salt rounds: 12) |
| 用户可导出数据 | `/api/users/me/export` |
| 用户可删除数据 | `/api/users/me` DELETE |

### 6.3 数据访问控制

```typescript
// 所有涉及用户数据的 API 都需要验证所有权
async function validateOwnership(userId: string, resourceUserId: string) {
  if (userId !== resourceUserId) {
    throw new ForbiddenError("无权访问此资源");
  }
}
```

---

## 7. 技术决策记录 (ADR)

### ADR-001: 框架选择

**状态：** Accepted

**背景：** 需要选择适合健身饮食应用的全栈框架

**决策：** 选择 Next.js 15 + App Router

**理由：**
- 支持 SSR/SSG，首屏加载快
- App Router 支持 Server Components，减少客户端 JS
- API Routes 简化后端开发
- EdgeOne Pages 原生支持

---

### ADR-002: 数据库选择

**状态：** Accepted

**背景：** 需要选择适合 Serverless 部署的数据库

**决策：** 选择 Neon PostgreSQL

**理由：**
- Serverless 架构，按需付费
- PostgreSQL 功能完整，支持 JSON
- 冷启动快，适合边缘部署
- Drizzle ORM 支持完善

---

### ADR-003: 食谱数据来源

**状态：** Accepted

**背景：** real.md 约束禁止 AI 编造食谱，必须使用真实来源

**决策：** 优先使用下厨房爬虫，备选美食杰和 Spoonacular API

**理由：**
- 下厨房食谱质量高，中文用户友好
- 美食杰作为备选，扩充食谱库
- Spoonacular API 提供结构化营养数据

**后果：**
- 需要实现爬虫模块
- 需要处理食谱数据标准化
- 需要定期更新食谱库

---

### ADR-004: 状态管理

**状态：** Accepted

**背景：** 需要选择前端状态管理方案

**决策：** 选择 Zustand

**理由：**
- 轻量级，学习成本低
- 支持 TypeScript
- 不需要 Provider 包裹
- 适合中小型应用

---

### ADR-005: 预制菜保质期计算

**状态：** Accepted

**背景：** 需要确定预制菜保质期的计算规则

**决策：**
- 默认规则：冷藏 3 天，冷冻 7 天
- 可由食谱元数据覆盖
- 提前 3 天开始提醒

**理由：**
- 简单规则易于理解
- 允许食谱特定覆盖，支持灵活性
- 3 天提醒窗口给用户足够反应时间

---

## 8. 质量检查清单

- [x] 架构模式适合需求（分层 + 模块化）
- [x] 所有子系统职责清晰
- [x] API 遵循 RESTful 约定
- [x] 目录结构支持模块化开发
- [x] 安全需求已处理（来自 real.md）
- [x] 技术决策已文档化
- [x] 食谱来源约束已满足

---

## 附录

### A. 与 cog.md 实体映射

| cog.md 实体 | 子系统 | 数据库表 |
|-------------|--------|---------|
| user | Auth | users |
| workout | Workout | workouts |
| meal | Meal | meals |
| food | Recipe | foods |
| recipe | Recipe | recipes |
| recommendation | Recommendation | (运行时生成) |
| inventory | Inventory | inventory |

### B. 外部依赖

| 依赖 | 用途 | 必需性 |
|------|------|--------|
| Neon PostgreSQL | 数据库 | 必需 |
| EdgeOne Pages | 部署 | 必需 |
| 下厨房 | 食谱数据源 | 必需 |
| 美食杰 | 食谱数据源 | 可选 |
| Spoonacular | 营养数据 | 可选 |
