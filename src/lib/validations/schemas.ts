/**
 * FitMeal Zod Validation Schemas
 *
 * Validation schemas for API requests
 */

import { z } from 'zod';

// ============================================
// Common Schemas
// ============================================

export const nutritionSchema = z.object({
  calories: z.number().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
  fiber: z.number().min(0).optional(),
});

// ============================================
// User Schemas
// ============================================

export const createUserSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(8, '密码至少需要8个字符'),
  name: z.string().min(1).max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码'),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  goal: z.enum(['muscle_gain', 'fat_loss', 'maintain', 'healthy']).optional(),
  busyLevel: z.enum(['relaxed', 'normal', 'very_busy']).optional(),
  cookingLevel: z.enum(['beginner', 'intermediate', 'expert']).optional(),
});

export const updateUserGoalsSchema = z.object({
  goal: z.enum(['muscle_gain', 'fat_loss', 'maintain', 'healthy']),
  busyLevel: z.enum(['relaxed', 'normal', 'very_busy']),
  cookingLevel: z.enum(['beginner', 'intermediate', 'expert']),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateUserGoalsInput = z.infer<typeof updateUserGoalsSchema>;

// ============================================
// Workout Schemas
// ============================================

export const createWorkoutSchema = z.object({
  type: z.enum(['strength', 'cardio', 'hiit', 'yoga', 'rest']),
  intensity: z.enum(['light', 'moderate', 'high']),
  bodyPart: z.enum(['upper', 'lower', 'core', 'full_body']).optional(),
  duration: z.number().min(1).max(300).optional(), // 1-300 minutes
  workoutDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式应为 YYYY-MM-DD'),
  notes: z.string().max(500).optional(),
});

export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;

// ============================================
// Recommendation Schemas
// ============================================

export const getRecommendationSchema = z.object({
  context: z.enum(['post_workout', 'busy', 'have_time', 'friends_over']),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).optional(),
});

export type GetRecommendationInput = z.infer<typeof getRecommendationSchema>;

// ============================================
// Recipe Schemas
// ============================================

export const recipeQuerySchema = z.object({
  difficulty: z.enum(['beginner', 'easy', 'advanced']).optional(),
  prepFriendly: z.boolean().optional(),
  maxCookTime: z.number().min(1).optional(),
  category: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20),
});

export type RecipeQueryInput = z.infer<typeof recipeQuerySchema>;

// ============================================
// Meal Schemas
// ============================================

export const createMealSchema = z.object({
  recipeId: z.string().uuid().optional(),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  source: z.enum(['homemade', 'prepped']).default('homemade'),
  mealDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式应为 YYYY-MM-DD'),
  notes: z.string().max(500).optional(),
  foods: z.array(z.object({
    foodId: z.string().uuid().optional(),
    name: z.string().min(1).max(200),
    amount: z.string().max(100).optional(),
  })).optional(),
});

export type CreateMealInput = z.infer<typeof createMealSchema>;

// ============================================
// Inventory Schemas
// ============================================

export const createInventorySchema = z.object({
  recipeId: z.string().uuid().optional(),
  name: z.string().min(1).max(200),
  portions: z.number().min(1).max(100).default(1),
  storageType: z.enum(['refrigerated', 'frozen']),
  preparedAt: z.string().datetime().optional(), // ISO datetime, defaults to now
  notes: z.string().max(500).optional(),
});

export const updateInventorySchema = z.object({
  portions: z.number().min(0).max(100).optional(),
  notes: z.string().max(500).optional(),
});

export const consumeInventorySchema = z.object({
  portions: z.number().min(1).default(1), // 消费份数，默认1份
});

export type CreateInventoryInput = z.infer<typeof createInventorySchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
export type ConsumeInventoryInput = z.infer<typeof consumeInventorySchema>;

// ============================================
// Shopping List Schema
// ============================================

export const shoppingListSchema = z.object({
  recipeIds: z.array(z.string().uuid()).min(1),
  excludeFoodIds: z.array(z.string().uuid()).optional(), // 已有的食材
});

export type ShoppingListInput = z.infer<typeof shoppingListSchema>;
