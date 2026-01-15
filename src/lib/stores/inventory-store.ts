"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { mockInventory } from "@/lib/mock/inventory"

export interface InventoryItem {
  id: string
  name: string
  description: string
  quantity: number
  unit: string
  preparedAt: string // ISO date
  expiresAt: string // ISO date
  calories: number
  protein: number
  carbs: number
  fat: number
  category: "protein" | "carbs" | "vegetable" | "complete-meal" | "snack"
  recipeId?: string
  imageUrl?: string
}

interface InventoryState {
  items: InventoryItem[]
  initialized: boolean
  addItem: (item: Omit<InventoryItem, "id">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  consumeItem: (id: string, amount?: number) => void
  getExpiringSoon: (days?: number) => InventoryItem[]
  getExpired: () => InventoryItem[]
  initializeWithMockData: () => void
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      items: [],
      initialized: false,

      addItem: (item) => {
        const id = crypto.randomUUID()
        set((state) => ({
          items: [...state.items, { ...item, id }],
        }))
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
          ),
        }))
      },

      consumeItem: (id, amount = 1) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id) {
              const newQuantity = item.quantity - amount
              return { ...item, quantity: Math.max(0, newQuantity) }
            }
            return item
          }),
        }))
      },

      getExpiringSoon: (days = 3) => {
        const { items } = get()
        const now = new Date()
        const threshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

        return items.filter((item) => {
          const expiresAt = new Date(item.expiresAt)
          return expiresAt > now && expiresAt <= threshold && item.quantity > 0
        })
      },

      getExpired: () => {
        const { items } = get()
        const now = new Date()

        return items.filter((item) => {
          const expiresAt = new Date(item.expiresAt)
          return expiresAt <= now && item.quantity > 0
        })
      },

      initializeWithMockData: () => {
        const { initialized } = get()
        if (!initialized) {
          set({
            items: mockInventory.map((item) => ({ ...item })),
            initialized: true,
          })
        }
      },
    }),
    {
      name: "fitmeal-inventory",
    }
  )
)
