// Mock 数据统一导出
export {
  mockRecipes,
  getRecipesByContext,
  getQuickRecipes,
  getHighProteinRecipes,
  getMealPrepRecipes,
  type MockRecipe,
} from "./recipes"

export {
  mockInventory,
  getExpiringItems,
  getInventoryByCategory,
  calculateTotalNutrition,
  type MockInventoryItem,
} from "./inventory"

export {
  mockWorkouts,
  generateMockWorkouts,
  getWorkoutStats,
  estimateCalories,
  workoutTypeLabels,
  workoutTypeIcons,
  type MockWorkout,
  type WorkoutType,
} from "./workouts"
