"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useInventoryStore, type InventoryItem } from "@/lib/stores/inventory-store"
import { X } from "lucide-react"

interface AddInventoryFormProps {
  onClose: () => void
}

const categoryOptions = [
  { value: "protein", label: "🥩 蛋白质" },
  { value: "carbs", label: "🍚 碳水" },
  { value: "vegetable", label: "🥬 蔬菜" },
  { value: "complete-meal", label: "🍱 完整餐" },
  { value: "snack", label: "🍪 零食" },
] as const

export function AddInventoryForm({ onClose }: AddInventoryFormProps) {
  const { addItem } = useInventoryStore()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: 1,
    unit: "份",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    category: "complete-meal" as InventoryItem["category"],
    shelfDays: 5, // 默认保质期天数
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const now = new Date()
    const expiresAt = new Date(now.getTime() + formData.shelfDays * 24 * 60 * 60 * 1000)

    addItem({
      name: formData.name,
      description: formData.description,
      quantity: formData.quantity,
      unit: formData.unit,
      preparedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      calories: formData.calories,
      protein: formData.protein,
      carbs: formData.carbs,
      fat: formData.fat,
      category: formData.category,
    })

    onClose()
  }

  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
      <Card className="w-full max-w-lg animate-in slide-in-from-bottom-4 sm:rounded-lg">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">添加库存</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">名称 *</Label>
              <Input
                id="name"
                placeholder="例如：鸡胸肉饭"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <Input
                id="description"
                placeholder="简短描述"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">分类</Label>
              <Select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  updateField("category", e.target.value as InventoryItem["category"])
                }
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Quantity & Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">数量</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => updateField("quantity", parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">单位</Label>
                <Select
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => updateField("unit", e.target.value)}
                >
                  <option value="份">份</option>
                  <option value="盒">盒</option>
                  <option value="个">个</option>
                  <option value="碗">碗</option>
                </Select>
              </div>
            </div>

            {/* Shelf Life */}
            <div className="space-y-2">
              <Label htmlFor="shelfDays">保质期（天）</Label>
              <Input
                id="shelfDays"
                type="number"
                min="1"
                max="30"
                value={formData.shelfDays}
                onChange={(e) => updateField("shelfDays", parseInt(e.target.value) || 5)}
              />
              <p className="text-xs text-gray-500">
                到期日期：{new Date(Date.now() + formData.shelfDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>

            {/* Nutrition */}
            <div>
              <Label className="mb-2 block">营养信息（可选）</Label>
              <div className="grid grid-cols-4 gap-2">
                <div className="space-y-1">
                  <span className="text-xs text-gray-500">卡路里</span>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.calories || ""}
                    onChange={(e) => updateField("calories", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-500">蛋白(g)</span>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.protein || ""}
                    onChange={(e) => updateField("protein", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-500">碳水(g)</span>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.carbs || ""}
                    onChange={(e) => updateField("carbs", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-500">脂肪(g)</span>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.fat || ""}
                    onChange={(e) => updateField("fat", parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-gray-400">
              * 营养数据仅供参考，请以实际食品标签为准
            </p>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                取消
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                disabled={!formData.name.trim()}
              >
                添加
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
