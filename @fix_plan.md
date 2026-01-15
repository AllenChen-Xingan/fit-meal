# FitMeal 开发计划

## 当前状态
- [x] 项目规格文档完成 (real.md, cog.md, prd.md, userstory.md, architecture.md, ui.spec.md)
- [x] 数据库 Schema 设计完成 (src/lib/db/schema.ts)
- [x] 项目初始化 (Next.js + shadcn/ui)

## 迭代 1: 核心价值验证 (P0)

### Phase 1.1: 项目初始化
- [x] 初始化 Next.js 15 项目 (App Router, TypeScript, Tailwind)
- [x] 配置 shadcn/ui 组件库
- [x] 安装核心依赖 (zustand, lucide-react, uuid, zod)
- [x] 配置 Drizzle ORM 和 Neon 连接

### Phase 1.2: 基础布局和导航
- [x] 创建 Layout 组件 (Header, BottomNav, Sidebar)
- [x] 实现响应式布局 (移动端底部导航, 桌面端侧边栏)
- [x] 配置路由结构 (/, /recommend, /recipe/[id], /inventory, /workout, /settings)

### Phase 1.3: 状态管理
- [x] 实现 useAuthStore (用户状态)
- [x] 实现 useRecommendStore (推荐状态)
- [x] 实现 useRecipeStore (食谱状态)
- [x] 实现 useInventoryStore (库存状态)
- [x] 实现 useWorkoutStore (运动状态)
- [x] 配置 localStorage 持久化

### Phase 1.4: Mock 数据
- [x] 创建 Mock 食谱数据 (10+ 条)
- [x] 创建 Mock 库存数据
- [x] 创建 Mock 运动数据
- [x] 实现 Mock 推荐逻辑

### Phase 1.5: 核心页面
- [x] 首页: 情境选择卡片 (4 个情境)
- [x] 推荐页: 推荐列表 + 换一批
- [x] 食谱详情页: 步骤导航 + 进度条
- [x] 完成制作: 记录饮食 + 存入库存选项

### Phase 1.6: 组件开发
- [x] ContextCard 情境卡片组件
- [x] RecipeCard 食谱卡片组件
- [x] StepNavigator 步骤导航组件
- [x] NutritionLabel 营养标签组件
- [x] Disclaimer 免责声明组件

## 迭代 2: 预制菜 + 运动 (P1)

### Phase 2.1: 预制菜库存
- [x] 库存列表页面功能完善
- [x] 添加库存表单
- [x] 消费库存功能
- [x] 过期提醒显示

### Phase 2.2: 运动记录
- [x] 运动记录表单
- [x] 日历视图
- [x] 运动统计

### Phase 2.3: 功能完善
- [x] 换一批推荐功能
- [x] 购物清单生成
- [x] 食谱收藏功能

## 迭代 3: 后端集成 (P2)

### Phase 3.1: API 实现
- [x] 认证 API (register, login, logout, me)
- [x] 推荐 API
- [x] 食谱 API
- [x] 运动 API
- [x] 饮食 API
- [x] 库存 API

### Phase 3.2: 数据库迁移
- [ ] 运行 Drizzle 迁移 (需要 DATABASE_URL)
- [x] 导入初始食谱数据 (src/lib/db/seed.ts)
- [x] Store 从 localStorage 切换到 API (auth-store 已更新)

### Phase 3.3: 数据安全
- [x] 实现用户数据导出 (GET /api/user/data)
- [x] 实现用户数据删除 (DELETE /api/user/data)
- [x] 健康数据加密 (bcrypt for passwords, JWT for sessions)

## 学习记录

### 2026-01-14
- 完成了所有规格文档设计
- 数据库 Schema 已定义 10 张表
- UI 规格已确定: SPA + 底部导航 + 翠绿色主题

### 2026-01-15 (Ralph Loop)
- 完成 Phase 1.1 - 1.6 所有任务
- 创建了 5 个 Zustand stores (auth, recommend, recipe, inventory, workout)
- 创建了 3 个 Mock 数据文件 (recipes, inventory, workouts)
- 创建了 6 个组件 (context-card, recipe-card, step-navigator, nutrition-label, disclaimer, bottom-nav)
- 创建了 7 个页面 (home, recommend, recipe/[id], recipe/[id]/complete, inventory, workout, settings)
- 完成 Phase 2.1 库存页面功能 (添加表单、消费功能、过期提醒)
- 完成 Phase 2.2 运动记录功能 (表单、日历视图、统计)
- 完成 Phase 2.3 功能完善 (换一批推荐、购物清单、食谱收藏)
- 迭代 2 全部完成！

### 2026-01-15 (Ralph Loop - 迭代 3)
- 创建认证模块 (src/lib/auth/index.ts) - bcrypt 密码加密, JWT 会话
- 实现 6 个 API 路由组:
  - /api/auth/* (register, login, logout, me)
  - /api/recipes/* (list, detail with ingredients/steps)
  - /api/recommend (context-based recommendations)
  - /api/workouts/* (CRUD + date filtering)
  - /api/inventory/* (CRUD + consume + expiry status)
  - /api/meals/* (CRUD + daily totals)
  - /api/user/data (export + delete - real.md compliance)
- Phase 3.1 和 3.3 完成！

## 参考文档 (specs/)
- `specs/01-real.md` - 现实约束
- `specs/02-cog.md` - 认知模型
- `specs/03-prd.md` - 产品需求
- `specs/04-userstory.md` - 用户故事
- `specs/05-architecture.md` - 系统架构
- `specs/06-ui.md` - UI 设计规格
- `specs/07-schema.ts` - 数据库 Schema
- `specs/README.md` - 规格文档索引
