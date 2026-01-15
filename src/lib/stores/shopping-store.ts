"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface ShoppingItem {
  id: string
  name: string
  amount: string
  category: "protein" | "vegetable" | "staple" | "seasoning" | "other"
  checked: boolean
  fromRecipeId?: string
  fromRecipeName?: string
}

interface ShoppingState {
  items: ShoppingItem[]
  addItem: (item: Omit<ShoppingItem, "id" | "checked">) => void
  addItemsFromRecipe: (
    recipeId: string,
    recipeName: string,
    ingredients: { name: string; amount: string }[]
  ) => void
  removeItem: (id: string) => void
  toggleItem: (id: string) => void
  clearChecked: () => void
  clearAll: () => void
}

// 根据食材名称推断分类
function inferCategory(name: string): ShoppingItem["category"] {
  const proteinKeywords = ["肉", "鸡", "牛", "猪", "鱼", "虾", "蛋", "豆腐", "三文鱼"]
  const vegetableKeywords = ["菜", "葱", "姜", "蒜", "萝卜", "番茄", "西兰花", "秋葵", "香菇", "蓝莓", "香蕉", "牛油果"]
  const stapleKeywords = ["米", "饭", "面", "燕麦", "蛋白粉"]
  const seasoningKeywords = ["盐", "糖", "油", "酱", "醋", "料酒", "味啉", "胡椒", "蜂蜜"]

  if (proteinKeywords.some((k) => name.includes(k))) return "protein"
  if (vegetableKeywords.some((k) => name.includes(k))) return "vegetable"
  if (stapleKeywords.some((k) => name.includes(k))) return "staple"
  if (seasoningKeywords.some((k) => name.includes(k))) return "seasoning"
  return "other"
}

export const useShoppingStore = create<ShoppingState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const id = crypto.randomUUID()
        set((state) => ({
          items: [...state.items, { ...item, id, checked: false }],
        }))
      },

      addItemsFromRecipe: (recipeId, recipeName, ingredients) => {
        const { items } = get()
        const newItems: ShoppingItem[] = []

        for (const ing of ingredients) {
          // 检查是否已存在相同食材
          const existing = items.find(
            (item) => item.name === ing.name && !item.checked
          )
          if (!existing) {
            newItems.push({
              id: crypto.randomUUID(),
              name: ing.name,
              amount: ing.amount,
              category: inferCategory(ing.name),
              checked: false,
              fromRecipeId: recipeId,
              fromRecipeName: recipeName,
            })
          }
        }

        if (newItems.length > 0) {
          set((state) => ({
            items: [...state.items, ...newItems],
          }))
        }
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      toggleItem: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
        }))
      },

      clearChecked: () => {
        set((state) => ({
          items: state.items.filter((item) => !item.checked),
        }))
      },

      clearAll: () => {
        set({ items: [] })
      },
    }),
    {
      name: "fitmeal-shopping",
    }
  )
)
