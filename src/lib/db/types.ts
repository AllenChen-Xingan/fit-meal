/**
 * FitMeal Database Types
 *
 * Auto-generated types from Drizzle schema
 */

import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import {
  users,
  workouts,
  foods,
  recipes,
  recipeIngredients,
  recipeSteps,
  meals,
  mealFoods,
  inventory,
  recommendationLogs,
} from './schema';

// ============================================
// User Types
// ============================================
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// ============================================
// Workout Types
// ============================================
export type Workout = InferSelectModel<typeof workouts>;
export type NewWorkout = InferInsertModel<typeof workouts>;

// ============================================
// Food Types
// ============================================
export type Food = InferSelectModel<typeof foods>;
export type NewFood = InferInsertModel<typeof foods>;

// ============================================
// Recipe Types
// ============================================
export type Recipe = InferSelectModel<typeof recipes>;
export type NewRecipe = InferInsertModel<typeof recipes>;

export type RecipeIngredient = InferSelectModel<typeof recipeIngredients>;
export type NewRecipeIngredient = InferInsertModel<typeof recipeIngredients>;

export type RecipeStep = InferSelectModel<typeof recipeSteps>;
export type NewRecipeStep = InferInsertModel<typeof recipeSteps>;

// Recipe with relations
export type RecipeWithDetails = Recipe & {
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
};

// ============================================
// Meal Types
// ============================================
export type Meal = InferSelectModel<typeof meals>;
export type NewMeal = InferInsertModel<typeof meals>;

export type MealFood = InferSelectModel<typeof mealFoods>;
export type NewMealFood = InferInsertModel<typeof mealFoods>;

// Meal with relations
export type MealWithFoods = Meal & {
  foods: MealFood[];
  recipe?: Recipe | null;
};

// ============================================
// Inventory Types
// ============================================
export type Inventory = InferSelectModel<typeof inventory>;
export type NewInventory = InferInsertModel<typeof inventory>;

// Inventory with computed fields
export type InventoryWithStatus = Inventory & {
  daysLeft: number;
  isExpired: boolean;
  isExpiringSoon: boolean; // < 3 days
};

// ============================================
// Recommendation Types
// ============================================
export type RecommendationLog = InferSelectModel<typeof recommendationLogs>;
export type NewRecommendationLog = InferInsertModel<typeof recommendationLogs>;

// ============================================
// Nutrition Type (shared)
// ============================================
export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

// ============================================
// Enum Types (from cog.md classifications)
// ============================================

// User goal types
export type UserGoal = 'muscle_gain' | 'fat_loss' | 'maintain' | 'healthy';

// User busy level types
export type BusyLevel = 'relaxed' | 'normal' | 'very_busy';

// User cooking level types
export type CookingLevel = 'beginner' | 'intermediate' | 'expert';

// Workout types
export type WorkoutType = 'strength' | 'cardio' | 'hiit' | 'yoga' | 'rest';

// Workout intensity types
export type WorkoutIntensity = 'light' | 'moderate' | 'high';

// Body part types
export type BodyPart = 'upper' | 'lower' | 'core' | 'full_body';

// Food category types
export type FoodCategory = 'protein' | 'carbs' | 'fat' | 'vegetable' | 'fruit';

// Recipe difficulty types
export type RecipeDifficulty = 'beginner' | 'easy' | 'advanced';

// Meal type types
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

// Meal source types
export type MealSource = 'homemade' | 'prepped';

// Storage type types
export type StorageType = 'refrigerated' | 'frozen';

// Recommendation context types
export type RecommendationContext = 'post_workout' | 'busy' | 'have_time' | 'friends_over';
