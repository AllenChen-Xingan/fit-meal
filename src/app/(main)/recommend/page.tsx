"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useState, useCallback } from "react"
import { RecipeCard } from "@/components/recipe-card"
import { Button } from "@/components/ui/button"
import { Disclaimer } from "@/components/disclaimer"
import { NoRecommendationsEmpty } from "@/components/empty-state"
import {
  getRecipesByContext,
  getRandomRecipes,
  getRandomRecipesByContext,
  mockRecipes,
  type MockRecipe,
} from "@/lib/mock/recipes"
import type { ContextType } from "@/components/context-card"
import { RefreshCw } from "lucide-react"

const contextLabels: Record<ContextType, string> = {
  "post-workout": "刚练完",
  busy: "很忙",
  "have-time": "有时间",
  social: "朋友来了",
}

function RecommendContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const context = searchParams.get("context") as ContextType | null

  // 初始化推荐列表
  const [recipes, setRecipes] = useState<MockRecipe[]>(() => {
    if (context) {
      return getRecipesByContext(context).slice(0, 4)
    }
    return mockRecipes.slice(0, 4)
  })

  const [isRefreshing, setIsRefreshing] = useState(false)

  // 换一批功能
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)
    const currentIds = recipes.map((r) => r.id)

    // 模拟加载延迟
    setTimeout(() => {
      let newRecipes: MockRecipe[]
      if (context) {
        newRecipes = getRandomRecipesByContext(context, 4, currentIds)
        // 如果新的不够，补充一些当前的
        if (newRecipes.length < 2) {
          newRecipes = getRandomRecipesByContext(context, 4)
        }
      } else {
        newRecipes = getRandomRecipes(4, currentIds)
        if (newRecipes.length < 2) {
          newRecipes = getRandomRecipes(4)
        }
      }
      setRecipes(newRecipes)
      setIsRefreshing(false)
    }, 300)
  }, [context, recipes])

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="mb-2 flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <svg
              className="mr-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            返回
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            {context ? `${contextLabels[context]}推荐` : "今日推荐"}
          </h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          换一批
        </Button>
      </div>

      {/* Recipe List */}
      <div className="mb-6 grid gap-4">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              description={recipe.description}
              imageUrl={recipe.imageUrl}
              cookTime={recipe.cookTime}
              calories={recipe.calories}
              protein={recipe.protein}
              source={recipe.source}
              sourceUrl={recipe.sourceUrl}
            />
          ))
        ) : (
          <NoRecommendationsEmpty onRefresh={handleRefresh} />
        )}
      </div>

      {/* Disclaimer */}
      <Disclaimer />
    </div>
  )
}

export default function RecommendPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">加载中...</div>}>
      <RecommendContent />
    </Suspense>
  )
}
