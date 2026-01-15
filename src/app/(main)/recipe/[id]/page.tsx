"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Disclaimer } from "@/components/disclaimer"
import { mockRecipes } from "@/lib/mock/recipes"

interface RecipePageProps {
  params: Promise<{ id: string }>
}

export default function RecipePage({ params }: RecipePageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  const recipe = mockRecipes.find((r) => r.id === id)

  if (!recipe) {
    return (
      <div className="mx-auto max-w-lg px-4 py-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">食谱未找到</h1>
          <Button className="mt-4" onClick={() => router.back()}>
            返回
          </Button>
        </div>
      </div>
    )
  }

  const progress = ((currentStep + 1) / recipe.steps.length) * 100

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-4">
        <button
          onClick={() => router.back()}
          className="mb-2 flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>
        <h1 className="text-xl font-bold text-gray-900">{recipe.title}</h1>
        <p className="text-sm text-gray-500">{recipe.description}</p>
      </div>

      {/* Nutrition Info */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <h3 className="mb-2 font-medium text-gray-800">营养信息</h3>
          <div className="grid grid-cols-4 gap-2 text-center text-sm">
            <div>
              <div className="font-bold text-gray-900">{recipe.calories}</div>
              <div className="text-xs text-gray-500">千卡</div>
            </div>
            <div>
              <div className="font-bold text-emerald-600">{recipe.protein}g</div>
              <div className="text-xs text-gray-500">蛋白质</div>
            </div>
            <div>
              <div className="font-bold text-orange-600">{recipe.carbs}g</div>
              <div className="text-xs text-gray-500">碳水</div>
            </div>
            <div>
              <div className="font-bold text-blue-600">{recipe.fat}g</div>
              <div className="text-xs text-gray-500">脂肪</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ingredients */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <h3 className="mb-2 font-medium text-gray-800">食材清单</h3>
          <ul className="space-y-1">
            {recipe.ingredients.map((ing, index) => (
              <li key={index} className="flex justify-between text-sm">
                <span className="text-gray-700">{ing.name}</span>
                <span className="text-gray-500">{ing.amount}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Steps */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-medium text-gray-800">
              步骤 {currentStep + 1}/{recipe.steps.length}
            </h3>
            <span className="text-xs text-gray-500">预计 {recipe.cookTime} 分钟</span>
          </div>

          {/* Progress Bar */}
          <div className="mb-4 h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Current Step */}
          <div className="mb-4 min-h-[80px] rounded-lg bg-gray-50 p-4">
            <p className="text-gray-800">{recipe.steps[currentStep]}</p>
          </div>

          {/* Navigation */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              上一步
            </Button>
            {currentStep < recipe.steps.length - 1 ? (
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                下一步
              </Button>
            ) : (
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => router.push(`/recipe/${id}/complete`)}
              >
                完成制作
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Source Link */}
      <div className="mb-4 text-center">
        <a
          href={recipe.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-emerald-600 hover:underline"
        >
          查看原始食谱 ({recipe.source})
        </a>
      </div>

      {/* Disclaimer */}
      <Disclaimer />
    </div>
  )
}
