"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { mockRecipes, type MockRecipe } from "@/lib/mock/recipes"
import { useInventoryStore, type InventoryItem } from "@/lib/stores/inventory-store"
import { useRecipeStore } from "@/lib/stores/recipe-store"

interface CompletePageProps {
  params: Promise<{ id: string }>
}

// 根据食谱的 tags 推断库存分类
function inferCategory(recipe: MockRecipe): InventoryItem["category"] {
  const tags = recipe.tags.map((t) => t.toLowerCase())

  // 检查是否是完整餐食（包含碳水和蛋白质的组合）
  if (tags.includes("便当") || tags.includes("预制菜") || recipe.title.includes("饭")) {
    return "complete-meal"
  }

  // 高蛋白类
  if (tags.includes("高蛋白") || tags.includes("增肌")) {
    return "protein"
  }

  // 碳水类
  if (tags.includes("碳水")) {
    return "carbs"
  }

  // 蔬菜类
  if (tags.includes("素食") || tags.includes("蔬菜")) {
    return "vegetable"
  }

  // 小食/零食类
  if (tags.includes("零食") || tags.includes("小食") || recipe.cookTime <= 5) {
    return "snack"
  }

  // 默认为完整餐食
  return "complete-meal"
}

// 根据分类推断保质期天数
function inferShelfLifeDays(category: InventoryItem["category"]): number {
  switch (category) {
    case "protein":
      return 3 // 蛋白质类保质期较短
    case "vegetable":
      return 2 // 蔬菜类保质期最短
    case "carbs":
      return 7 // 碳水类（如米饭冷冻）保质期较长
    case "complete-meal":
      return 4 // 完整餐食中等保质期
    case "snack":
      return 5 // 小食类
    default:
      return 3
  }
}

export default function CompletePage({ params }: CompletePageProps) {
  const { id } = use(params)
  const router = useRouter()

  // 使用 stores
  const addItem = useInventoryStore((state) => state.addItem)
  const finishCooking = useRecipeStore((state) => state.finishCooking)

  const recipe = mockRecipes.find((r) => r.id === id)

  if (!recipe) {
    return (
      <div className="mx-auto max-w-lg px-4 py-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">食谱未找到</h1>
          <Button className="mt-4" onClick={() => router.push("/")}>
            返回首页
          </Button>
        </div>
      </div>
    )
  }

  const handleSaveToInventory = () => {
    // 推断分类和保质期
    const category = inferCategory(recipe)
    const shelfLifeDays = inferShelfLifeDays(category)

    // 计算准备时间和过期时间
    const now = new Date()
    const expiresAt = new Date(now.getTime() + shelfLifeDays * 24 * 60 * 60 * 1000)

    // 创建库存项
    const inventoryItem: Omit<InventoryItem, "id"> = {
      name: recipe.title,
      description: recipe.description,
      quantity: 1,
      unit: "份",
      preparedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
      category: category,
      recipeId: recipe.id,
      imageUrl: recipe.imageUrl,
    }

    // 添加到库存
    addItem(inventoryItem)

    // 完成烹饪状态
    finishCooking()

    // 显示成功提示
    alert(`已存入库存！\n${recipe.title} 已添加到预制菜库存，保质期 ${shelfLifeDays} 天`)

    // 跳转到库存页面
    router.push("/inventory")
  }

  const handleRecordMeal = () => {
    // 完成烹饪状态
    finishCooking()

    // TODO: 未来可以添加饮食记录功能
    alert(`已记录饮食！\n${recipe.title} 的营养信息已记录`)

    router.push("/")
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Success Message */}
      <div className="mb-8 text-center">
        <div className="mb-4 text-6xl">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900">制作完成！</h1>
        <p className="mt-2 text-gray-600">{recipe.title}</p>
      </div>

      {/* Nutrition Summary */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="mb-3 font-medium text-gray-800">本餐营养摄入</h3>
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

      {/* Actions */}
      <div className="space-y-3">
        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          onClick={handleRecordMeal}
        >
          记录饮食
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleSaveToInventory}
        >
          存入预制菜库存
        </Button>

        <Button
          variant="ghost"
          className="w-full"
          onClick={() => router.push("/")}
        >
          返回首页
        </Button>
      </div>
    </div>
  )
}
