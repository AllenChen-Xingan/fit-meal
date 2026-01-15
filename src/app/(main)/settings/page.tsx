"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Disclaimer } from "@/components/disclaimer"
import { RecipeCard } from "@/components/recipe-card"
import { useRecipeStore } from "@/lib/stores/recipe-store"
import { mockRecipes } from "@/lib/mock/recipes"
import { Heart, ChevronRight, X } from "lucide-react"

export default function SettingsPage() {
  const { favorites, recentlyViewed } = useRecipeStore()
  const [showFavorites, setShowFavorites] = useState(false)

  // 获取收藏的食谱
  const favoriteRecipes = mockRecipes.filter((r) => favorites.includes(r.id))
  // 获取最近浏览的食谱
  const recentRecipes = recentlyViewed
    .map((id) => mockRecipes.find((r) => r.id === id))
    .filter(Boolean)
    .slice(0, 5)

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">设置</h1>
        <p className="text-sm text-gray-500">管理你的账户和偏好</p>
      </div>

      {/* Profile Section */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <h3 className="mb-3 font-medium text-gray-800">个人信息</h3>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl">
              👤
            </div>
            <div>
              <div className="font-medium text-gray-900">游客用户</div>
              <div className="text-sm text-gray-500">未登录</div>
            </div>
          </div>
          <Button variant="outline" className="mt-4 w-full">
            登录 / 注册
          </Button>
        </CardContent>
      </Card>

      {/* Favorites Section */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <button
            className="flex w-full items-center justify-between"
            onClick={() => setShowFavorites(true)}
          >
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-red-500" />
              <div className="text-left">
                <h3 className="font-medium text-gray-800">我的收藏</h3>
                <p className="text-sm text-gray-500">{favorites.length} 个食谱</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        </CardContent>
      </Card>

      {/* Recent Viewed */}
      {recentRecipes.length > 0 && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="mb-3 font-medium text-gray-800">最近浏览</h3>
            <div className="space-y-2">
              {recentRecipes.map((recipe) => (
                <a
                  key={recipe!.id}
                  href={`/recipe/${recipe!.id}`}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-2 hover:bg-gray-100"
                >
                  <span className="text-sm text-gray-700">{recipe!.title}</span>
                  <span className="text-xs text-gray-500">{recipe!.cookTime}分钟</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preferences */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <h3 className="mb-3 font-medium text-gray-800">饮食偏好</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">饮食目标</span>
              <span className="text-sm text-gray-900">增肌</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">每日蛋白质目标</span>
              <span className="text-sm text-gray-900">120g</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">过敏食材</span>
              <span className="text-sm text-gray-900">无</span>
            </div>
          </div>
          <Button variant="outline" className="mt-4 w-full">
            编辑偏好
          </Button>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <h3 className="mb-3 font-medium text-gray-800">数据管理</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-2">📤</span>
              导出我的数据
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700"
            >
              <span className="mr-2">🗑️</span>
              删除所有数据
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="mb-3 font-medium text-gray-800">关于</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>版本</span>
              <span>0.1.0</span>
            </div>
            <div className="flex justify-between">
              <span>食谱来源</span>
              <span>下厨房 / 美食杰</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Disclaimer />

      {/* Favorites Modal */}
      {showFavorites && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="mx-auto max-w-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-semibold">我的收藏</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFavorites(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="h-[calc(100vh-60px)] overflow-y-auto p-4">
              {favoriteRecipes.length > 0 ? (
                <div className="grid gap-4">
                  {favoriteRecipes.map((recipe) => (
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
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center text-gray-500">
                  <Heart className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                  <p className="text-sm">还没有收藏的食谱</p>
                  <p className="mt-1 text-xs text-gray-400">
                    点击食谱卡片上的 ❤️ 来收藏
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
