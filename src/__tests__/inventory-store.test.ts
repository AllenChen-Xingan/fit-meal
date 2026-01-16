import { describe, it, expect, beforeEach, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'

// Mock zustand persist middleware
vi.mock('zustand/middleware', () => ({
  persist: (fn: any) => fn,
}))

describe('Inventory Store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('should have initial empty state', async () => {
    const { useInventoryStore } = await import('@/lib/stores/inventory-store')
    const { result } = renderHook(() => useInventoryStore())

    expect(result.current.items).toEqual([])
  })

  it('should add item to inventory', async () => {
    const { useInventoryStore } = await import('@/lib/stores/inventory-store')
    const { result } = renderHook(() => useInventoryStore())

    const newItem = {
      name: 'Grilled Chicken',
      description: 'Meal prep chicken',
      quantity: 4,
      unit: 'portions',
      category: 'protein' as const,
      calories: 200,
      protein: 35,
      carbs: 0,
      fat: 5,
      preparedAt: '2024-12-28',
      expiresAt: '2024-12-31',
    }

    await act(async () => {
      result.current.addItem(newItem)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].name).toBe('Grilled Chicken')
    expect(result.current.items[0].quantity).toBe(4)
  })

  it('should consume item and reduce quantity', async () => {
    const { useInventoryStore } = await import('@/lib/stores/inventory-store')
    const { result } = renderHook(() => useInventoryStore())

    // Add item first
    await act(async () => {
      result.current.addItem({
        name: 'Rice Bowl',
        description: 'Prepped rice bowl',
        quantity: 3,
        unit: 'portions',
        category: 'carbs' as const,
        calories: 300,
        protein: 8,
        carbs: 50,
        fat: 5,
        preparedAt: '2024-12-28',
        expiresAt: '2024-12-31',
      })
    })

    const itemId = result.current.items[0].id

    // Consume one portion
    await act(async () => {
      result.current.consumeItem(itemId)
    })

    expect(result.current.items[0].quantity).toBe(2)
  })

  it('should remove item from inventory', async () => {
    const { useInventoryStore } = await import('@/lib/stores/inventory-store')
    const { result } = renderHook(() => useInventoryStore())

    // Add item
    await act(async () => {
      result.current.addItem({
        name: 'Salad',
        description: 'Fresh salad',
        quantity: 2,
        unit: 'portions',
        category: 'vegetable' as const,
        calories: 100,
        protein: 5,
        carbs: 10,
        fat: 2,
        preparedAt: '2024-12-28',
        expiresAt: '2024-12-31',
      })
    })

    const itemId = result.current.items[0].id

    // Remove item
    await act(async () => {
      result.current.removeItem(itemId)
    })

    expect(result.current.items).toHaveLength(0)
  })

  it('should update item quantity', async () => {
    const { useInventoryStore } = await import('@/lib/stores/inventory-store')
    const { result } = renderHook(() => useInventoryStore())

    // Add item
    await act(async () => {
      result.current.addItem({
        name: 'Pasta',
        description: 'Cooked pasta',
        quantity: 2,
        unit: 'portions',
        category: 'carbs' as const,
        calories: 400,
        protein: 12,
        carbs: 60,
        fat: 8,
        preparedAt: '2024-12-28',
        expiresAt: '2024-12-31',
      })
    })

    const itemId = result.current.items[0].id

    // Update quantity
    await act(async () => {
      result.current.updateQuantity(itemId, 5)
    })

    expect(result.current.items[0].quantity).toBe(5)
  })

  it('should initialize with mock data', async () => {
    const { useInventoryStore } = await import('@/lib/stores/inventory-store')
    const { result } = renderHook(() => useInventoryStore())

    await act(async () => {
      result.current.initializeWithMockData()
    })

    expect(result.current.items.length).toBeGreaterThan(0)
  })

  it('should not reduce quantity below 0 when consuming', async () => {
    const { useInventoryStore } = await import('@/lib/stores/inventory-store')
    const { result } = renderHook(() => useInventoryStore())

    // Add item with quantity 1
    await act(async () => {
      result.current.addItem({
        name: 'Single Item',
        description: 'Only one portion',
        quantity: 1,
        unit: 'portion',
        category: 'protein' as const,
        calories: 100,
        protein: 20,
        carbs: 0,
        fat: 2,
        preparedAt: '2024-12-28',
        expiresAt: '2024-12-31',
      })
    })

    const itemId = result.current.items[0].id

    // Consume twice - should not go below 0
    await act(async () => {
      result.current.consumeItem(itemId)
      result.current.consumeItem(itemId)
    })

    expect(result.current.items[0].quantity).toBe(0)
  })

  it('should return items expiring soon', async () => {
    const { useInventoryStore } = await import('@/lib/stores/inventory-store')
    const { result } = renderHook(() => useInventoryStore())

    const now = new Date()
    const tomorrow = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000)
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    // Add item expiring tomorrow
    await act(async () => {
      result.current.addItem({
        name: 'Expiring Soon',
        description: 'Expires tomorrow',
        quantity: 2,
        unit: 'portions',
        category: 'protein' as const,
        calories: 150,
        protein: 25,
        carbs: 0,
        fat: 5,
        preparedAt: now.toISOString(),
        expiresAt: tomorrow.toISOString(),
      })
    })

    // Add item expiring next week
    await act(async () => {
      result.current.addItem({
        name: 'Not Expiring Soon',
        description: 'Expires next week',
        quantity: 3,
        unit: 'portions',
        category: 'carbs' as const,
        calories: 200,
        protein: 5,
        carbs: 40,
        fat: 2,
        preparedAt: now.toISOString(),
        expiresAt: nextWeek.toISOString(),
      })
    })

    const expiringSoon = result.current.getExpiringSoon(3)
    expect(expiringSoon.length).toBe(1)
    expect(expiringSoon[0].name).toBe('Expiring Soon')
  })

  it('should return expired items', async () => {
    const { useInventoryStore } = await import('@/lib/stores/inventory-store')
    const { result } = renderHook(() => useInventoryStore())

    const now = new Date()
    const yesterday = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
    const tomorrow = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000)

    // Add expired item
    await act(async () => {
      result.current.addItem({
        name: 'Expired Item',
        description: 'Already expired',
        quantity: 1,
        unit: 'portion',
        category: 'vegetable' as const,
        calories: 50,
        protein: 2,
        carbs: 10,
        fat: 0,
        preparedAt: yesterday.toISOString(),
        expiresAt: yesterday.toISOString(),
      })
    })

    // Add valid item
    await act(async () => {
      result.current.addItem({
        name: 'Valid Item',
        description: 'Still good',
        quantity: 2,
        unit: 'portions',
        category: 'protein' as const,
        calories: 200,
        protein: 30,
        carbs: 0,
        fat: 8,
        preparedAt: now.toISOString(),
        expiresAt: tomorrow.toISOString(),
      })
    })

    const expired = result.current.getExpired()
    expect(expired.length).toBe(1)
    expect(expired[0].name).toBe('Expired Item')
  })

  it('should not include items with 0 quantity in expiring soon', async () => {
    const { useInventoryStore } = await import('@/lib/stores/inventory-store')
    const { result } = renderHook(() => useInventoryStore())

    const now = new Date()
    const tomorrow = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000)

    // Add item expiring tomorrow
    await act(async () => {
      result.current.addItem({
        name: 'Empty Item',
        description: 'Expiring but empty',
        quantity: 1,
        unit: 'portion',
        category: 'snack' as const,
        calories: 100,
        protein: 5,
        carbs: 15,
        fat: 3,
        preparedAt: now.toISOString(),
        expiresAt: tomorrow.toISOString(),
      })
    })

    const itemId = result.current.items[0].id

    // Consume to make quantity 0
    await act(async () => {
      result.current.consumeItem(itemId)
    })

    const expiringSoon = result.current.getExpiringSoon(3)
    expect(expiringSoon.length).toBe(0)
  })

  it('should not allow negative quantity when updating', async () => {
    const { useInventoryStore } = await import('@/lib/stores/inventory-store')
    const { result } = renderHook(() => useInventoryStore())

    await act(async () => {
      result.current.addItem({
        name: 'Test Item',
        description: 'For negative test',
        quantity: 5,
        unit: 'portions',
        category: 'complete-meal' as const,
        calories: 500,
        protein: 30,
        carbs: 50,
        fat: 15,
        preparedAt: '2024-12-28',
        expiresAt: '2024-12-31',
      })
    })

    const itemId = result.current.items[0].id

    // Try to set negative quantity
    await act(async () => {
      result.current.updateQuantity(itemId, -5)
    })

    expect(result.current.items[0].quantity).toBe(0)
  })
})
