"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ContextType } from "@/components/context-card"

interface Recipe {
  id: string
  title: string
  description: string
  imageUrl?: string
  cookTime: number
  calories: number
  protein: number
  carbs: number
  fat: number
  source: string
  sourceUrl: string
  steps: string[]
  ingredients: { name: string; amount: string }[]
}

interface RecommendState {
  selectedContext: ContextType | null
  recommendations: Recipe[]
  isLoading: boolean
  setContext: (context: ContextType) => void
  clearContext: () => void
  setRecommendations: (recipes: Recipe[]) => void
  refreshRecommendations: () => void
}

export const useRecommendStore = create<RecommendState>()(
  persist(
    (set, get) => ({
      selectedContext: null,
      recommendations: [],
      isLoading: false,

      setContext: (context) => {
        set({ selectedContext: context, isLoading: true })
        // In real app, this would fetch from API
        // For now, we'll use mock data
        setTimeout(() => {
          set({ isLoading: false })
        }, 500)
      },

      clearContext: () => {
        set({ selectedContext: null, recommendations: [] })
      },

      setRecommendations: (recipes) => {
        set({ recommendations: recipes })
      },

      refreshRecommendations: () => {
        const { selectedContext } = get()
        if (selectedContext) {
          set({ isLoading: true })
          setTimeout(() => {
            set({ isLoading: false })
          }, 500)
        }
      },
    }),
    {
      name: "fitmeal-recommend",
      partialize: (state) => ({
        selectedContext: state.selectedContext,
      }),
    }
  )
)
