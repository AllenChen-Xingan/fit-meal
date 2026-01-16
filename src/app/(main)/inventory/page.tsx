"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useInventoryStore } from "@/lib/stores/inventory-store"
import { AddInventoryForm } from "@/components/add-inventory-form"
import { NoInventoryEmpty } from "@/components/empty-state"
import { Plus, ShoppingCart, AlertTriangle, Minus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function InventoryPage() {
  const { items, consumeItem, removeItem, initializeWithMockData } = useInventoryStore()
  const [showAddForm, setShowAddForm] = useState(false)

  // 初始化 Mock 数据
  useEffect(() => {
    initializeWithMockData()
  }, [initializeWithMockData])

  // 计算即将过期的项目 (3天内)
  const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  const expiringItems = items.filter(
    (item) => new Date(item.expiresAt) <= threeDaysFromNow && item.quantity > 0
  )

  // 按分类分组
  const categorizedItems = items.reduce((acc, item) => {
    if (item.quantity > 0) {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
    }
    return acc
  }, {} as Record<string, typeof items>)

  const categoryLabels: Record<string, string> = {
    protein: "🥩 蛋白质",
    carbs: "🍚 碳水",
    vegetable: "🥬 蔬菜",
    "complete-meal": "🍱 完整餐",
    snack: "🍪 零食",
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "已过期"
    if (diffDays === 0) return "今天过期"
    if (diffDays === 1) return "明天过期"
    if (diffDays <= 3) return `${diffDays}天后过期`
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const isExpiringSoon = (dateString: string) => {
    const date = new Date(dateString)
    return date <= threeDaysFromNow
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">预制菜库存</h1>
        <p className="text-sm text-gray-500">管理你的预制菜和食材</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="h-auto flex-col py-4"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="mb-1 h-6 w-6" />
          <span className="text-sm">添加库存</span>
        </Button>
        <Button variant="outline" className="h-auto flex-col py-4">
          <ShoppingCart className="mb-1 h-6 w-6" />
          <span className="text-sm">购物清单</span>
        </Button>
      </div>

      {/* Expiring Soon */}
      {expiringItems.length > 0 && (
        <Card className="mb-4 border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <h3 className="mb-3 flex items-center gap-2 font-medium text-amber-700">
              <AlertTriangle className="h-4 w-4" /> 即将过期 ({expiringItems.length})
            </h3>
            <div className="space-y-2">
              {expiringItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-white p-3"
                >
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-amber-600">{formatDate(item.expiresAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {item.quantity} {item.unit}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-emerald-600"
                      onClick={() => consumeItem(item.id)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory List by Category */}
      {Object.keys(categorizedItems).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(categorizedItems).map(([category, categoryItems]) => (
            <Card key={category}>
              <CardContent className="p-4">
                <h3 className="mb-3 font-medium text-gray-800">
                  {categoryLabels[category] || category}
                </h3>
                <div className="space-y-2">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center justify-between rounded-lg bg-gray-50 p-3",
                        isExpiringSoon(item.expiresAt) && "bg-amber-50"
                      )}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                        <div className="mt-1 flex items-center gap-2 text-xs">
                          <span className="text-orange-600">{item.calories}卡</span>
                          <span className="text-emerald-600">蛋白{item.protein}g</span>
                          <span
                            className={cn(
                              "ml-auto",
                              isExpiringSoon(item.expiresAt) ? "text-amber-600" : "text-gray-400"
                            )}
                          >
                            {formatDate(item.expiresAt)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3 flex items-center gap-1">
                        <span className="mr-2 text-sm font-medium">
                          {item.quantity} {item.unit}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-50"
                          onClick={() => consumeItem(item.id)}
                          title="消费一份"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                          title="删除"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-4">
            <NoInventoryEmpty onAdd={() => setShowAddForm(true)} />
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {items.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg bg-emerald-50 p-3">
            <p className="text-lg font-bold text-emerald-600">
              {items.reduce((sum, i) => sum + i.quantity, 0)}
            </p>
            <p className="text-xs text-emerald-700">总份数</p>
          </div>
          <div className="rounded-lg bg-orange-50 p-3">
            <p className="text-lg font-bold text-orange-600">
              {items.reduce((sum, i) => sum + i.calories * i.quantity, 0)}
            </p>
            <p className="text-xs text-orange-700">总卡路里</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-3">
            <p className="text-lg font-bold text-blue-600">
              {items.reduce((sum, i) => sum + i.protein * i.quantity, 0)}g
            </p>
            <p className="text-xs text-blue-700">总蛋白质</p>
          </div>
        </div>
      )}

      {/* Add Inventory Form Modal */}
      {showAddForm && <AddInventoryForm onClose={() => setShowAddForm(false)} />}
    </div>
  )
}
