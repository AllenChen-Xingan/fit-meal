/**
 * FitMeal Database Schema
 *
 * Entities from cog.md:
 * - users: 用户
 * - workouts: 运动记录
 * - recipes: 食谱（来自真实来源）
 * - foods: 食物/食材
 * - meals: 饮食记录
 * - inventory: 预制菜库存
 *
 * Constraints from real.md:
 * - 用户健康数据加密存储
 * - 食谱必须有来源链接
 * - 用户数据仅本人可访问
 */

import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  jsonb,
  integer,
  date,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

// ============================================
// Users - 用户表
// ============================================
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(), // bcrypt hashed (real.md)
  name: varchar('name', { length: 100 }),

  // 用户目标设置 (from cog.md user classification)
  goal: varchar('goal', { length: 50 }).default('healthy'), // 增肌/减脂/维持/健康饮食
  busyLevel: varchar('busy_level', { length: 50 }).default('normal'), // 时间充裕/普通/非常忙碌
  cookingLevel: varchar('cooking_level', { length: 50 }).default('beginner'), // 新手/熟练/大厨级

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  emailIdx: uniqueIndex('uniq_users_email').on(table.email),
}));

// ============================================
// Workouts - 运动记录表
// ============================================
export const workouts = pgTable('workouts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  // 运动分类 (from cog.md workout classification)
  type: varchar('type', { length: 50 }).notNull(), // 力量训练/有氧运动/HIIT/瑜伽/休息日
  intensity: varchar('intensity', { length: 50 }).notNull(), // 轻度/中度/高强度
  bodyPart: varchar('body_part', { length: 50 }), // 上肢/下肢/核心/全身
  duration: integer('duration'), // 时长（分钟）

  workoutDate: date('workout_date').notNull(),
  notes: text('notes'),

  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdx: index('idx_workouts_user').on(table.userId),
  dateIdx: index('idx_workouts_date').on(table.workoutDate),
  userDateIdx: index('idx_workouts_user_date').on(table.userId, table.workoutDate),
}));

// ============================================
// Foods - 食物/食材表
// ============================================
export const foods = pgTable('foods', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 200 }).notNull(),

  // 食物分类 (from cog.md food classification)
  category: varchar('category', { length: 50 }).notNull(), // 蛋白质类/碳水类/脂肪类/蔬菜类/水果类
  cookingDifficulty: varchar('cooking_difficulty', { length: 50 }), // 即食/简单/中等/复杂
  prepSuitability: varchar('prep_suitability', { length: 50 }), // 适合预制/当天食用/不适合预制

  // 营养成分 (JSONB for flexibility)
  nutrition: jsonb('nutrition').$type<{
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  }>(),

  unit: varchar('unit', { length: 50 }).default('g'), // 默认单位

  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  nameIdx: index('idx_foods_name').on(table.name),
  categoryIdx: index('idx_foods_category').on(table.category),
}));

// ============================================
// Recipes - 食谱表
// ============================================
export const recipes = pgTable('recipes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  image: varchar('image', { length: 500 }),

  // 食谱来源 (real.md constraint: must have verifiable source)
  source: varchar('source', { length: 100 }).notNull(), // 下厨房/美食杰/Spoonacular
  sourceUrl: varchar('source_url', { length: 500 }).notNull(), // 原始链接
  sourceId: varchar('source_id', { length: 100 }), // 来源平台的ID

  // 食谱属性 (from cog.md recipe classification)
  cookTime: integer('cook_time'), // 烹饪时间（分钟）
  difficulty: varchar('difficulty', { length: 50 }).notNull(), // 零基础/入门/进阶
  servings: integer('servings').default(1), // 份数

  // 预制菜相关
  prepFriendly: boolean('prep_friendly').default(false), // 是否适合批量预制
  shelfLife: integer('shelf_life'), // 预制后保质期（天）

  // 营养成分 (per serving)
  nutrition: jsonb('nutrition').$type<{
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  }>(),

  // 标签 (JSONB array)
  tags: jsonb('tags').$type<string[]>().default([]),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  sourceIdx: index('idx_recipes_source').on(table.source),
  difficultyIdx: index('idx_recipes_difficulty').on(table.difficulty),
  prepFriendlyIdx: index('idx_recipes_prep_friendly').on(table.prepFriendly),
}));

// ============================================
// Recipe Ingredients - 食谱食材关联表 (多对多)
// ============================================
export const recipeIngredients = pgTable('recipe_ingredients', {
  id: uuid('id').primaryKey().defaultRandom(),
  recipeId: uuid('recipe_id').notNull().references(() => recipes.id, { onDelete: 'cascade' }),
  foodId: uuid('food_id').references(() => foods.id, { onDelete: 'set null' }),

  // 食材信息（允许非标准化食材）
  name: varchar('name', { length: 200 }).notNull(), // 食材名称
  amount: varchar('amount', { length: 100 }).notNull(), // 用量（如 "200g", "2个"）
  optional: boolean('optional').default(false), // 是否可选

  sortOrder: integer('sort_order').default(0),
}, (table) => ({
  recipeIdx: index('idx_recipe_ingredients_recipe').on(table.recipeId),
}));

// ============================================
// Recipe Steps - 食谱步骤表
// ============================================
export const recipeSteps = pgTable('recipe_steps', {
  id: uuid('id').primaryKey().defaultRandom(),
  recipeId: uuid('recipe_id').notNull().references(() => recipes.id, { onDelete: 'cascade' }),

  stepOrder: integer('step_order').notNull(), // 步骤序号
  description: text('description').notNull(), // 步骤说明
  image: varchar('image', { length: 500 }), // 步骤图片
  duration: integer('duration'), // 预计时间（分钟）

}, (table) => ({
  recipeOrderIdx: index('idx_recipe_steps_recipe_order').on(table.recipeId, table.stepOrder),
}));

// ============================================
// Meals - 饮食记录表
// ============================================
export const meals = pgTable('meals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  recipeId: uuid('recipe_id').references(() => recipes.id, { onDelete: 'set null' }),

  // 餐食分类 (from cog.md meal classification)
  mealType: varchar('meal_type', { length: 50 }).notNull(), // 早餐/午餐/晚餐/加餐
  source: varchar('source', { length: 50 }).default('homemade'), // 现做/预制菜

  mealDate: date('meal_date').notNull(),
  notes: text('notes'),

  // 营养统计（冗余存储，方便查询）
  nutrition: jsonb('nutrition').$type<{
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>(),

  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdx: index('idx_meals_user').on(table.userId),
  dateIdx: index('idx_meals_date').on(table.mealDate),
  userDateIdx: index('idx_meals_user_date').on(table.userId, table.mealDate),
}));

// ============================================
// Meal Foods - 饮食食物关联表 (多对多)
// ============================================
export const mealFoods = pgTable('meal_foods', {
  id: uuid('id').primaryKey().defaultRandom(),
  mealId: uuid('meal_id').notNull().references(() => meals.id, { onDelete: 'cascade' }),
  foodId: uuid('food_id').references(() => foods.id, { onDelete: 'set null' }),

  name: varchar('name', { length: 200 }).notNull(), // 食物名称
  amount: varchar('amount', { length: 100 }), // 用量

}, (table) => ({
  mealIdx: index('idx_meal_foods_meal').on(table.mealId),
}));

// ============================================
// Inventory - 预制菜库存表
// ============================================
export const inventory = pgTable('inventory', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  recipeId: uuid('recipe_id').references(() => recipes.id, { onDelete: 'set null' }),

  name: varchar('name', { length: 200 }).notNull(), // 菜品名称
  portions: integer('portions').notNull().default(1), // 剩余份数

  // 存储方式 (from cog.md meal classification)
  storageType: varchar('storage_type', { length: 50 }).notNull(), // refrigerated/frozen

  preparedAt: timestamp('prepared_at').notNull(), // 制作时间
  expiresAt: timestamp('expires_at').notNull(), // 过期时间

  notes: text('notes'),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdx: index('idx_inventory_user').on(table.userId),
  expiresIdx: index('idx_inventory_expires').on(table.expiresAt),
  userExpiresIdx: index('idx_inventory_user_expires').on(table.userId, table.expiresAt),
}));

// ============================================
// Recommendations Log - 推荐日志表 (可选，用于分析)
// ============================================
export const recommendationLogs = pgTable('recommendation_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  context: varchar('context', { length: 50 }).notNull(), // post_workout/busy/have_time/friends_over
  recommendedRecipes: jsonb('recommended_recipes').$type<string[]>(), // 推荐的食谱ID列表
  selectedRecipeId: uuid('selected_recipe_id'), // 用户选择的食谱ID

  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdx: index('idx_recommendation_logs_user').on(table.userId),
  createdAtIdx: index('idx_recommendation_logs_created').on(table.createdAt),
}));
