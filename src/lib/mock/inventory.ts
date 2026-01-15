// Mock 库存数据 - 预制菜库存
// 用于周末批量制作，工作日加热食用

export interface MockInventoryItem {
  id: string
  name: string
  description: string
  quantity: number
  unit: string
  preparedAt: string // ISO date string
  expiresAt: string // ISO date string
  calories: number
  protein: number
  carbs: number
  fat: number
  category: "protein" | "carbs" | "vegetable" | "complete-meal" | "snack"
  imageUrl?: string
  relatedRecipeId?: string
}

export const mockInventory: MockInventoryItem[] = [
  {
    id: "inv-1",
    name: "香煎鸡胸肉",
    description: "周末批量煎好的鸡胸肉，可配任意蔬菜",
    quantity: 4,
    unit: "份",
    preparedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2天前
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天后过期
    calories: 180,
    protein: 35,
    carbs: 0,
    fat: 4,
    category: "protein",
    relatedRecipeId: "1",
  },
  {
    id: "inv-2",
    name: "番茄牛腩",
    description: "慢炖番茄牛腩，加热即食",
    quantity: 3,
    unit: "份",
    preparedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1天前
    expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4天后过期
    calories: 350,
    protein: 32,
    carbs: 15,
    fat: 18,
    category: "complete-meal",
    relatedRecipeId: "5",
  },
  {
    id: "inv-3",
    name: "照烧鸡腿",
    description: "经典便当菜，配米饭完美",
    quantity: 2,
    unit: "份",
    preparedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天前
    expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1天后过期 (即将过期!)
    calories: 280,
    protein: 28,
    carbs: 12,
    fat: 14,
    category: "protein",
    relatedRecipeId: "8",
  },
  {
    id: "inv-4",
    name: "焯水西兰花",
    description: "清淡健康，可配任意蛋白质",
    quantity: 5,
    unit: "份",
    preparedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1天前
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2天后过期
    calories: 35,
    protein: 3,
    carbs: 7,
    fat: 0,
    category: "vegetable",
  },
  {
    id: "inv-5",
    name: "糙米饭",
    description: "提前蒸好的糙米饭，冷冻保存",
    quantity: 6,
    unit: "份",
    preparedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5天前
    expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25天后过期 (冷冻)
    calories: 180,
    protein: 4,
    carbs: 38,
    fat: 1,
    category: "carbs",
  },
]

// 获取即将过期的库存 (3天内)
export function getExpiringItems(): MockInventoryItem[] {
  const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  return mockInventory.filter(
    (item) => new Date(item.expiresAt) <= threeDaysFromNow && item.quantity > 0
  )
}

// 获取某分类的库存
export function getInventoryByCategory(
  category: MockInventoryItem["category"]
): MockInventoryItem[] {
  return mockInventory.filter((item) => item.category === category && item.quantity > 0)
}

// 计算总营养摄入
export function calculateTotalNutrition(items: MockInventoryItem[]): {
  calories: number
  protein: number
  carbs: number
  fat: number
} {
  return items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories * item.quantity,
      protein: acc.protein + item.protein * item.quantity,
      carbs: acc.carbs + item.carbs * item.quantity,
      fat: acc.fat + item.fat * item.quantity,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )
}
