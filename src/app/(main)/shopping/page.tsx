"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useShoppingStore, type ShoppingItem } from "@/lib/stores/shopping-store"
import { Plus, Trash2, Check, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

const categoryLabels: Record<ShoppingItem["category"], string> = {
  protein: "🥩 蛋白质",
  vegetable: "🥬 蔬菜水果",
  staple: "🍚 主食",
  seasoning: "🧂 调味料",
  other: "📦 其他",
}

const categoryOrder: ShoppingItem["category"][] = [
  "protein",
  "vegetable",
  "staple",
  "seasoning",
  "other",
]

export default function ShoppingPage() {
  const { items, addItem, removeItem, toggleItem, clearChecked, clearAll } =
    useShoppingStore()
  const [newItemName, setNewItemName] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  // 按分类分组
  const groupedItems = categoryOrder.reduce((acc, category) => {
    const categoryItems = items.filter((item) => item.category === category)
    if (categoryItems.length > 0) {
      acc[category] = categoryItems
    }
    return acc
  }, {} as Record<string, ShoppingItem[]>)

  // 统计
  const totalItems = items.length
  const checkedItems = items.filter((item) => item.checked).length

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (newItemName.trim()) {
      addItem({
        name: newItemName.trim(),
        amount: "",
        category: "other",
      })
      setNewItemName("")
      setShowAddForm(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">购物清单</h1>
        <p className="text-sm text-gray-500">
          {totalItems > 0
            ? `${checkedItems}/${totalItems} 已完成`
            : "添加食材到购物清单"}
        </p>
      </div>

      {/* Quick Add */}
      {showAddForm ? (
        <form onSubmit={handleAddItem} className="mb-6 flex gap-2">
          <Input
            placeholder="添加食材..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            autoFocus
          />
          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
            添加
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowAddForm(false)}
          >
            取消
          </Button>
        </form>
      ) : (
        <Button
          className="mb-6 w-full bg-emerald-600 hover:bg-emerald-700"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          添加食材
        </Button>
      )}

      {/* Shopping List */}
      {Object.keys(groupedItems).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <Card key={category}>
              <CardContent className="p-4">
                <h3 className="mb-3 font-medium text-gray-800">
                  {categoryLabels[category as ShoppingItem["category"]]}
                </h3>
                <div className="space-y-2">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center justify-between rounded-lg p-3 transition-colors",
                        item.checked ? "bg-gray-100" : "bg-gray-50"
                      )}
                    >
                      <button
                        className="flex flex-1 items-center gap-3"
                        onClick={() => toggleItem(item.id)}
                      >
                        <div
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded border",
                            item.checked
                              ? "border-emerald-500 bg-emerald-500"
                              : "border-gray-300"
                          )}
                        >
                          {item.checked && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <div className="text-left">
                          <p
                            className={cn(
                              "font-medium",
                              item.checked
                                ? "text-gray-400 line-through"
                                : "text-gray-800"
                            )}
                          >
                            {item.name}
                          </p>
                          {item.amount && (
                            <p className="text-xs text-gray-500">{item.amount}</p>
                          )}
                          {item.fromRecipeName && (
                            <p className="text-xs text-emerald-600">
                              来自: {item.fromRecipeName}
                            </p>
                          )}
                        </div>
                      </button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Actions */}
          <div className="flex gap-3">
            {checkedItems > 0 && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={clearChecked}
              >
                清除已完成 ({checkedItems})
              </Button>
            )}
            <Button
              variant="outline"
              className="flex-1 text-red-600 hover:text-red-700"
              onClick={clearAll}
            >
              清空列表
            </Button>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="py-8 text-center text-gray-500">
              <ShoppingCart className="mx-auto mb-2 h-12 w-12 text-gray-300" />
              <p className="text-sm">购物清单为空</p>
              <p className="mt-1 text-xs text-gray-400">
                在食谱详情页可以一键添加食材到购物清单
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
