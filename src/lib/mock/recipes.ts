// Mock 食谱数据 - 真实来源标注
// 注意：这些是示例数据，实际使用时应从下厨房/美食杰爬取真实数据

export interface MockRecipe {
  id: string
  title: string
  name: string // 别名，与 title 相同，用于 API 兼容
  description: string
  imageUrl: string
  cookTime: number
  calories: number
  protein: number
  carbs: number
  fat: number
  difficulty: "beginner" | "easy" | "advanced" // 难度级别
  prepFriendly: boolean // 是否适合预制
  servings: number // 份量
  nutrition: {
    protein: number
    carbs: number
    fat: number
    calories: number
  }
  source: string
  sourceUrl: string
  steps: string[]
  ingredients: { name: string; amount: string }[]
  tags: string[]
  contexts: string[] // post-workout, busy, have-time, social
}

export const mockRecipes: MockRecipe[] = [
  {
    id: "1",
    title: "香煎鸡胸肉配西兰花",
    name: "香煎鸡胸肉配西兰花",
    description: "高蛋白低脂肪，适合健身后补充蛋白质",
    imageUrl: "/images/recipes/chicken-broccoli.jpg",
    cookTime: 20,
    calories: 350,
    protein: 42,
    carbs: 12,
    fat: 8,
    difficulty: "easy",
    prepFriendly: true,
    servings: 2,
    nutrition: { protein: 42, carbs: 12, fat: 8, calories: 350 },
    source: "下厨房",
    sourceUrl: "https://www.xiachufang.com/recipe/123456/",
    steps: [
      "鸡胸肉切片，用盐、黑胡椒、料酒腌制15分钟",
      "西兰花洗净切小朵，焯水2分钟捞出",
      "平底锅少油，中火煎鸡胸肉每面3-4分钟",
      "装盘，配上焯好的西兰花",
    ],
    ingredients: [
      { name: "鸡胸肉", amount: "200g" },
      { name: "西兰花", amount: "150g" },
      { name: "盐", amount: "适量" },
      { name: "黑胡椒", amount: "适量" },
      { name: "料酒", amount: "1勺" },
    ],
    tags: ["高蛋白", "低脂肪", "增肌"],
    contexts: ["post-workout", "have-time"],
  },
  {
    id: "2",
    title: "快手牛肉蛋炒饭",
    name: "快手牛肉蛋炒饭",
    description: "10分钟搞定，忙碌时的蛋白质来源",
    imageUrl: "/images/recipes/beef-fried-rice.jpg",
    cookTime: 10,
    calories: 450,
    protein: 28,
    carbs: 55,
    fat: 12,
    difficulty: "beginner",
    prepFriendly: false,
    servings: 1,
    nutrition: { protein: 28, carbs: 55, fat: 12, calories: 450 },
    source: "美食杰",
    sourceUrl: "https://www.meishij.net/recipe/654321",
    steps: [
      "牛肉切丁，用酱油、淀粉抓匀",
      "鸡蛋打散，热油炒散盛出",
      "同锅炒牛肉丁至变色",
      "加入隔夜米饭翻炒，倒入鸡蛋",
      "加盐调味，撒葱花出锅",
    ],
    ingredients: [
      { name: "牛肉", amount: "100g" },
      { name: "鸡蛋", amount: "2个" },
      { name: "隔夜米饭", amount: "1碗" },
      { name: "酱油", amount: "1勺" },
      { name: "葱花", amount: "适量" },
    ],
    tags: ["快手", "高蛋白", "碳水"],
    contexts: ["busy", "post-workout"],
  },
  {
    id: "3",
    title: "三文鱼牛油果沙拉",
    name: "三文鱼牛油果沙拉",
    description: "优质脂肪和蛋白质，适合减脂期",
    imageUrl: "/images/recipes/salmon-avocado.jpg",
    cookTime: 15,
    calories: 380,
    protein: 32,
    carbs: 8,
    fat: 24,
    difficulty: "easy",
    prepFriendly: false,
    servings: 2,
    nutrition: { protein: 32, carbs: 8, fat: 24, calories: 380 },
    source: "下厨房",
    sourceUrl: "https://www.xiachufang.com/recipe/234567/",
    steps: [
      "三文鱼切块，用盐、柠檬汁腌制10分钟",
      "牛油果切片，生菜洗净撕小块",
      "平底锅煎三文鱼每面2分钟",
      "将所有食材摆盘，淋上橄榄油和柠檬汁",
    ],
    ingredients: [
      { name: "三文鱼", amount: "150g" },
      { name: "牛油果", amount: "半个" },
      { name: "生菜", amount: "100g" },
      { name: "橄榄油", amount: "1勺" },
      { name: "柠檬", amount: "半个" },
    ],
    tags: ["低碳水", "优质脂肪", "减脂"],
    contexts: ["have-time", "social"],
  },
  {
    id: "4",
    title: "蒜蓉虾仁炒蛋",
    name: "蒜蓉虾仁炒蛋",
    description: "简单快手高蛋白，5分钟上桌",
    imageUrl: "/images/recipes/shrimp-eggs.jpg",
    cookTime: 5,
    calories: 280,
    protein: 35,
    carbs: 4,
    fat: 14,
    difficulty: "beginner",
    prepFriendly: false,
    servings: 2,
    nutrition: { protein: 35, carbs: 4, fat: 14, calories: 280 },
    source: "美食杰",
    sourceUrl: "https://www.meishij.net/recipe/789012",
    steps: [
      "虾仁洗净沥干，用盐、料酒腌制",
      "鸡蛋打散加少许盐",
      "热锅冷油，爆香蒜末",
      "下虾仁翻炒至变色",
      "倒入蛋液，翻炒至凝固即可",
    ],
    ingredients: [
      { name: "虾仁", amount: "150g" },
      { name: "鸡蛋", amount: "3个" },
      { name: "蒜末", amount: "2瓣" },
      { name: "料酒", amount: "1勺" },
      { name: "盐", amount: "适量" },
    ],
    tags: ["快手", "高蛋白", "低碳水"],
    contexts: ["busy", "post-workout"],
  },
  {
    id: "5",
    title: "番茄牛腩煲",
    name: "番茄牛腩煲",
    description: "慢炖入味，周末预制菜首选",
    imageUrl: "/images/recipes/tomato-beef.jpg",
    cookTime: 90,
    calories: 420,
    protein: 38,
    carbs: 18,
    fat: 22,
    difficulty: "advanced",
    prepFriendly: true,
    servings: 4,
    nutrition: { protein: 38, carbs: 18, fat: 22, calories: 420 },
    source: "下厨房",
    sourceUrl: "https://www.xiachufang.com/recipe/345678/",
    steps: [
      "牛腩切块焯水去血沫",
      "番茄切块，葱姜蒜切好备用",
      "热锅炒香葱姜蒜，加入番茄翻炒",
      "倒入牛腩，加水没过，大火烧开",
      "转小火炖90分钟，加盐调味",
    ],
    ingredients: [
      { name: "牛腩", amount: "500g" },
      { name: "番茄", amount: "3个" },
      { name: "葱", amount: "2根" },
      { name: "姜", amount: "3片" },
      { name: "蒜", amount: "3瓣" },
    ],
    tags: ["慢炖", "预制菜", "高蛋白"],
    contexts: ["have-time", "social"],
  },
  {
    id: "6",
    title: "豆腐蔬菜汤",
    name: "豆腐蔬菜汤",
    description: "低卡饱腹，适合晚餐",
    imageUrl: "/images/recipes/tofu-soup.jpg",
    cookTime: 15,
    calories: 180,
    protein: 14,
    carbs: 12,
    fat: 8,
    difficulty: "beginner",
    prepFriendly: false,
    servings: 2,
    nutrition: { protein: 14, carbs: 12, fat: 8, calories: 180 },
    source: "美食杰",
    sourceUrl: "https://www.meishij.net/recipe/456789",
    steps: [
      "豆腐切块，蔬菜洗净切好",
      "锅中加水烧开",
      "下入豆腐和蔬菜",
      "煮5分钟，加盐和少许香油调味",
    ],
    ingredients: [
      { name: "嫩豆腐", amount: "200g" },
      { name: "小白菜", amount: "100g" },
      { name: "香菇", amount: "50g" },
      { name: "盐", amount: "适量" },
      { name: "香油", amount: "少许" },
    ],
    tags: ["低卡", "素食", "晚餐"],
    contexts: ["busy", "have-time"],
  },
  {
    id: "7",
    title: "希腊酸奶燕麦碗",
    name: "希腊酸奶燕麦碗",
    description: "营养均衡早餐，5分钟完成",
    imageUrl: "/images/recipes/yogurt-oats.jpg",
    cookTime: 5,
    calories: 320,
    protein: 22,
    carbs: 38,
    fat: 10,
    difficulty: "beginner",
    prepFriendly: true,
    servings: 1,
    nutrition: { protein: 22, carbs: 38, fat: 10, calories: 320 },
    source: "下厨房",
    sourceUrl: "https://www.xiachufang.com/recipe/567890/",
    steps: [
      "燕麦放入碗中",
      "倒入希腊酸奶",
      "加入切好的水果和坚果",
      "淋上少许蜂蜜即可",
    ],
    ingredients: [
      { name: "希腊酸奶", amount: "150g" },
      { name: "燕麦", amount: "40g" },
      { name: "蓝莓", amount: "30g" },
      { name: "香蕉", amount: "半根" },
      { name: "坚果", amount: "15g" },
    ],
    tags: ["早餐", "快手", "营养均衡"],
    contexts: ["busy"],
  },
  {
    id: "8",
    title: "照烧鸡腿饭",
    name: "照烧鸡腿饭",
    description: "经典便当菜，可批量预制",
    imageUrl: "/images/recipes/teriyaki-chicken.jpg",
    cookTime: 30,
    calories: 520,
    protein: 35,
    carbs: 48,
    fat: 18,
    difficulty: "easy",
    prepFriendly: true,
    servings: 2,
    nutrition: { protein: 35, carbs: 48, fat: 18, calories: 520 },
    source: "美食杰",
    sourceUrl: "https://www.meishij.net/recipe/678901",
    steps: [
      "鸡腿去骨，用叉子戳孔便于入味",
      "调照烧汁：酱油、味啉、糖、水",
      "平底锅煎鸡腿皮面朝下至金黄",
      "翻面，倒入照烧汁小火煮至收汁",
      "切片装盘，配米饭",
    ],
    ingredients: [
      { name: "鸡腿", amount: "2只" },
      { name: "酱油", amount: "3勺" },
      { name: "味啉", amount: "2勺" },
      { name: "糖", amount: "1勺" },
      { name: "米饭", amount: "1碗" },
    ],
    tags: ["便当", "预制菜", "碳水"],
    contexts: ["have-time", "social"],
  },
  {
    id: "9",
    title: "蛋白粉香蕉奶昔",
    name: "蛋白粉香蕉奶昔",
    description: "训练后快速补充蛋白质",
    imageUrl: "/images/recipes/protein-shake.jpg",
    cookTime: 3,
    calories: 280,
    protein: 32,
    carbs: 28,
    fat: 4,
    difficulty: "beginner",
    prepFriendly: false,
    servings: 1,
    nutrition: { protein: 32, carbs: 28, fat: 4, calories: 280 },
    source: "下厨房",
    sourceUrl: "https://www.xiachufang.com/recipe/890123/",
    steps: [
      "香蕉切块放入搅拌机",
      "加入蛋白粉和牛奶",
      "搅拌30秒至顺滑",
      "倒入杯中即可饮用",
    ],
    ingredients: [
      { name: "蛋白粉", amount: "1勺(30g)" },
      { name: "香蕉", amount: "1根" },
      { name: "牛奶", amount: "250ml" },
    ],
    tags: ["训练后", "快手", "高蛋白"],
    contexts: ["post-workout", "busy"],
  },
  {
    id: "10",
    title: "秋葵炒蛋",
    name: "秋葵炒蛋",
    description: "清淡健康，5分钟快手菜",
    imageUrl: "/images/recipes/okra-eggs.jpg",
    cookTime: 5,
    calories: 220,
    protein: 16,
    carbs: 8,
    fat: 14,
    difficulty: "beginner",
    prepFriendly: false,
    servings: 2,
    nutrition: { protein: 16, carbs: 8, fat: 14, calories: 220 },
    source: "美食杰",
    sourceUrl: "https://www.meishij.net/recipe/901234",
    steps: [
      "秋葵洗净切段",
      "鸡蛋打散加盐",
      "热油先炒秋葵2分钟",
      "倒入蛋液翻炒至凝固",
    ],
    ingredients: [
      { name: "秋葵", amount: "150g" },
      { name: "鸡蛋", amount: "3个" },
      { name: "盐", amount: "适量" },
      { name: "油", amount: "适量" },
    ],
    tags: ["快手", "低卡", "高蛋白"],
    contexts: ["busy", "have-time"],
  },
]

// 根据情境获取推荐食谱
export function getRecipesByContext(context: string): MockRecipe[] {
  return mockRecipes.filter((recipe) => recipe.contexts.includes(context))
}

// 随机打乱数组
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// 随机获取指定数量的食谱（用于换一批功能）
export function getRandomRecipes(count: number = 3, excludeIds: string[] = []): MockRecipe[] {
  const available = mockRecipes.filter((r) => !excludeIds.includes(r.id))
  return shuffleArray(available).slice(0, count)
}

// 根据情境随机获取食谱（用于换一批功能）
export function getRandomRecipesByContext(
  context: string,
  count: number = 3,
  excludeIds: string[] = []
): MockRecipe[] {
  const contextRecipes = mockRecipes.filter(
    (r) => r.contexts.includes(context) && !excludeIds.includes(r.id)
  )
  return shuffleArray(contextRecipes).slice(0, count)
}

// 获取快手菜（10分钟以内）
export function getQuickRecipes(): MockRecipe[] {
  return mockRecipes.filter((recipe) => recipe.cookTime <= 10)
}

// 获取高蛋白食谱（蛋白质 > 30g）
export function getHighProteinRecipes(): MockRecipe[] {
  return mockRecipes.filter((recipe) => recipe.protein >= 30)
}

// 获取适合预制的食谱
export function getMealPrepRecipes(): MockRecipe[] {
  return mockRecipes.filter((recipe) => recipe.tags.includes("预制菜"))
}
