"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { mockRecipes, type MockRecipe } from "@/lib/mock/recipes"

interface RecipeState {
  // 当前查看的食谱
  currentRecipe: MockRecipe | null
  // 当前步骤索引
  currentStep: number
  // 收藏的食谱ID列表
  favorites: string[]
  // 最近查看的食谱ID列表
  recentlyViewed: string[]
  // 正在制作中的食谱
  cookingRecipe: {
    recipeId: string
    startedAt: string
    completedSteps: number[]
  } | null

  // Actions
  setCurrentRecipe: (recipe: MockRecipe | null) => void
  getRecipeById: (id: string) => MockRecipe | undefined
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  resetSteps: () => void
  toggleFavorite: (recipeId: string) => void
  isFavorite: (recipeId: string) => boolean
  addToRecentlyViewed: (recipeId: string) => void
  startCooking: (recipeId: string) => void
  completeStep: (stepIndex: number) => void
  finishCooking: () => void
}

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set, get) => ({
      currentRecipe: null,
      currentStep: 0,
      favorites: [],
      recentlyViewed: [],
      cookingRecipe: null,

      setCurrentRecipe: (recipe) => {
        set({ currentRecipe: recipe, currentStep: 0 })
        if (recipe) {
          get().addToRecentlyViewed(recipe.id)
        }
      },

      getRecipeById: (id) => {
        return mockRecipes.find((r) => r.id === id)
      },

      nextStep: () => {
        const { currentRecipe, currentStep } = get()
        if (currentRecipe && currentStep < currentRecipe.steps.length - 1) {
          set({ currentStep: currentStep + 1 })
        }
      },

      prevStep: () => {
        const { currentStep } = get()
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 })
        }
      },

      goToStep: (step) => {
        const { currentRecipe } = get()
        if (currentRecipe && step >= 0 && step < currentRecipe.steps.length) {
          set({ currentStep: step })
        }
      },

      resetSteps: () => {
        set({ currentStep: 0 })
      },

      toggleFavorite: (recipeId) => {
        const { favorites } = get()
        if (favorites.includes(recipeId)) {
          set({ favorites: favorites.filter((id) => id !== recipeId) })
        } else {
          set({ favorites: [...favorites, recipeId] })
        }
      },

      isFavorite: (recipeId) => {
        return get().favorites.includes(recipeId)
      },

      addToRecentlyViewed: (recipeId) => {
        const { recentlyViewed } = get()
        // Remove if already exists, then add to front
        const filtered = recentlyViewed.filter((id) => id !== recipeId)
        // Keep only last 10
        set({ recentlyViewed: [recipeId, ...filtered].slice(0, 10) })
      },

      startCooking: (recipeId) => {
        set({
          cookingRecipe: {
            recipeId,
            startedAt: new Date().toISOString(),
            completedSteps: [],
          },
          currentStep: 0,
        })
      },

      completeStep: (stepIndex) => {
        const { cookingRecipe } = get()
        if (cookingRecipe && !cookingRecipe.completedSteps.includes(stepIndex)) {
          set({
            cookingRecipe: {
              ...cookingRecipe,
              completedSteps: [...cookingRecipe.completedSteps, stepIndex],
            },
          })
        }
      },

      finishCooking: () => {
        set({ cookingRecipe: null, currentStep: 0 })
      },
    }),
    {
      name: "fitmeal-recipe",
      partialize: (state) => ({
        favorites: state.favorites,
        recentlyViewed: state.recentlyViewed,
      }),
    }
  )
)
