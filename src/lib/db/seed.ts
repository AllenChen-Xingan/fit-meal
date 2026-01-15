/**
 * Database Seed Script
 *
 * Imports initial recipe data from mock data
 * Run with: bun run db:seed
 */

import { db, recipes, recipeIngredients, recipeSteps } from "./index"

// Import mock recipes from existing data
const mockRecipes = [
  {
    id: "recipe-1",
    name: "香煎鸡胸肉",
    description: "简单快手的高蛋白餐，适合健身后食用",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400",
    source: "下厨房",
    sourceUrl: "https://www.xiachufang.com/recipe/104567890/",
    sourceId: "104567890",
    cookTime: 15,
    difficulty: "beginner",
    servings: 1,
    prepFriendly: true,
    shelfLife: 3,
    nutrition: { calories: 280, protein: 45, carbs: 2, fat: 10 },
    tags: ["高蛋白", "快手菜", "健身餐"],
    ingredients: [
      { name: "鸡胸肉", amount: "200g", optional: false },
      { name: "橄榄油", amount: "1勺", optional: false },
      { name: "黑胡椒", amount: "适量", optional: false },
      { name: "盐", amount: "少许", optional: false },
    ],
    steps: [
      { stepOrder: 1, description: "鸡胸肉用厨房纸吸干水分，用刀背拍松", duration: 2 },
      { stepOrder: 2, description: "撒上盐和黑胡椒，腌制5分钟", duration: 5 },
      { stepOrder: 3, description: "平底锅中火加热，加入橄榄油", duration: 1 },
      { stepOrder: 4, description: "放入鸡胸肉，每面煎3-4分钟至金黄", duration: 8 },
      { stepOrder: 5, description: "切片装盘即可", duration: 1 },
    ],
  },
  {
    id: "recipe-2",
    name: "牛油果鸡蛋沙拉",
    description: "营养均衡的快手早餐，富含健康脂肪",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    source: "美食杰",
    sourceUrl: "https://www.meishij.net/recipe/234567891/",
    sourceId: "234567891",
    cookTime: 10,
    difficulty: "beginner",
    servings: 1,
    prepFriendly: false,
    shelfLife: null,
    nutrition: { calories: 350, protein: 15, carbs: 12, fat: 28 },
    tags: ["早餐", "快手菜", "健康脂肪"],
    ingredients: [
      { name: "牛油果", amount: "1个", optional: false },
      { name: "鸡蛋", amount: "2个", optional: false },
      { name: "樱桃番茄", amount: "5个", optional: true },
      { name: "柠檬汁", amount: "少许", optional: false },
    ],
    steps: [
      { stepOrder: 1, description: "鸡蛋煮熟，切块备用", duration: 8 },
      { stepOrder: 2, description: "牛油果对半切开，去核切块", duration: 1 },
      { stepOrder: 3, description: "樱桃番茄对半切开", duration: 1 },
      { stepOrder: 4, description: "所有食材混合，淋上柠檬汁即可", duration: 1 },
    ],
  },
  {
    id: "recipe-3",
    name: "番茄牛肉意面",
    description: "经典意式风味，碳水蛋白质均衡",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
    source: "下厨房",
    sourceUrl: "https://www.xiachufang.com/recipe/104567892/",
    sourceId: "104567892",
    cookTime: 25,
    difficulty: "easy",
    servings: 2,
    prepFriendly: true,
    shelfLife: 2,
    nutrition: { calories: 520, protein: 35, carbs: 55, fat: 18 },
    tags: ["意面", "高蛋白", "正餐"],
    ingredients: [
      { name: "意大利面", amount: "160g", optional: false },
      { name: "牛肉末", amount: "150g", optional: false },
      { name: "番茄", amount: "2个", optional: false },
      { name: "洋葱", amount: "半个", optional: false },
      { name: "蒜末", amount: "2瓣", optional: false },
    ],
    steps: [
      { stepOrder: 1, description: "意面按包装说明煮熟，沥干备用", duration: 10 },
      { stepOrder: 2, description: "番茄切丁，洋葱切碎", duration: 3 },
      { stepOrder: 3, description: "锅中放油，炒香洋葱和蒜末", duration: 2 },
      { stepOrder: 4, description: "加入牛肉末炒散", duration: 3 },
      { stepOrder: 5, description: "加入番茄丁，小火炖煮5分钟", duration: 5 },
      { stepOrder: 6, description: "将酱汁淋在意面上即可", duration: 1 },
    ],
  },
  {
    id: "recipe-4",
    name: "蒜蓉西兰花",
    description: "清淡爽口的蔬菜小炒，维生素丰富",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400",
    source: "美食杰",
    sourceUrl: "https://www.meishij.net/recipe/234567893/",
    sourceId: "234567893",
    cookTime: 8,
    difficulty: "beginner",
    servings: 2,
    prepFriendly: true,
    shelfLife: 2,
    nutrition: { calories: 80, protein: 5, carbs: 8, fat: 4 },
    tags: ["蔬菜", "快手菜", "低卡"],
    ingredients: [
      { name: "西兰花", amount: "300g", optional: false },
      { name: "蒜", amount: "4瓣", optional: false },
      { name: "盐", amount: "适量", optional: false },
      { name: "蚝油", amount: "1勺", optional: true },
    ],
    steps: [
      { stepOrder: 1, description: "西兰花切小朵，洗净沥干", duration: 2 },
      { stepOrder: 2, description: "蒜切末备用", duration: 1 },
      { stepOrder: 3, description: "锅中烧水，焯烫西兰花1分钟", duration: 2 },
      { stepOrder: 4, description: "热锅冷油，爆香蒜末", duration: 1 },
      { stepOrder: 5, description: "加入西兰花翻炒，调味出锅", duration: 2 },
    ],
  },
  {
    id: "recipe-5",
    name: "希腊酸奶燕麦碗",
    description: "健康早餐首选，饱腹感强",
    image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400",
    source: "下厨房",
    sourceUrl: "https://www.xiachufang.com/recipe/104567894/",
    sourceId: "104567894",
    cookTime: 5,
    difficulty: "beginner",
    servings: 1,
    prepFriendly: false,
    shelfLife: null,
    nutrition: { calories: 320, protein: 20, carbs: 40, fat: 8 },
    tags: ["早餐", "高蛋白", "零烹饪"],
    ingredients: [
      { name: "希腊酸奶", amount: "200g", optional: false },
      { name: "燕麦片", amount: "40g", optional: false },
      { name: "蓝莓", amount: "50g", optional: true },
      { name: "蜂蜜", amount: "1勺", optional: true },
    ],
    steps: [
      { stepOrder: 1, description: "碗中放入燕麦片", duration: 1 },
      { stepOrder: 2, description: "倒入希腊酸奶", duration: 1 },
      { stepOrder: 3, description: "铺上蓝莓", duration: 1 },
      { stepOrder: 4, description: "淋上蜂蜜即可享用", duration: 1 },
    ],
  },
  {
    id: "recipe-6",
    name: "照烧三文鱼",
    description: "日式风味，富含Omega-3",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
    source: "美食杰",
    sourceUrl: "https://www.meishij.net/recipe/234567895/",
    sourceId: "234567895",
    cookTime: 20,
    difficulty: "easy",
    servings: 1,
    prepFriendly: true,
    shelfLife: 2,
    nutrition: { calories: 380, protein: 35, carbs: 12, fat: 22 },
    tags: ["日式", "高蛋白", "Omega-3"],
    ingredients: [
      { name: "三文鱼", amount: "150g", optional: false },
      { name: "酱油", amount: "2勺", optional: false },
      { name: "味醂", amount: "1勺", optional: false },
      { name: "蜂蜜", amount: "1勺", optional: false },
    ],
    steps: [
      { stepOrder: 1, description: "调制照烧酱：酱油、味醂、蜂蜜混合", duration: 2 },
      { stepOrder: 2, description: "三文鱼放入腌制10分钟", duration: 10 },
      { stepOrder: 3, description: "平底锅中火，煎三文鱼每面3分钟", duration: 6 },
      { stepOrder: 4, description: "倒入剩余酱汁，收汁即可", duration: 2 },
    ],
  },
  {
    id: "recipe-7",
    name: "香菇鸡肉粥",
    description: "温暖养胃，适合休息日食用",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400",
    source: "下厨房",
    sourceUrl: "https://www.xiachufang.com/recipe/104567896/",
    sourceId: "104567896",
    cookTime: 45,
    difficulty: "easy",
    servings: 2,
    prepFriendly: true,
    shelfLife: 2,
    nutrition: { calories: 280, protein: 20, carbs: 35, fat: 6 },
    tags: ["粥品", "养胃", "家常"],
    ingredients: [
      { name: "大米", amount: "100g", optional: false },
      { name: "鸡腿肉", amount: "150g", optional: false },
      { name: "香菇", amount: "5朵", optional: false },
      { name: "姜片", amount: "3片", optional: false },
      { name: "葱花", amount: "适量", optional: true },
    ],
    steps: [
      { stepOrder: 1, description: "大米洗净浸泡30分钟", duration: 30 },
      { stepOrder: 2, description: "鸡腿肉切小块，香菇切片", duration: 3 },
      { stepOrder: 3, description: "锅中加水煮沸，放入大米和姜片", duration: 5 },
      { stepOrder: 4, description: "加入鸡肉和香菇，小火慢煮", duration: 25 },
      { stepOrder: 5, description: "调味，撒上葱花即可", duration: 2 },
    ],
  },
  {
    id: "recipe-8",
    name: "牛肉炒芹菜",
    description: "高纤维高蛋白的经典搭配",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
    source: "美食杰",
    sourceUrl: "https://www.meishij.net/recipe/234567897/",
    sourceId: "234567897",
    cookTime: 15,
    difficulty: "easy",
    servings: 2,
    prepFriendly: true,
    shelfLife: 2,
    nutrition: { calories: 260, protein: 28, carbs: 8, fat: 14 },
    tags: ["家常菜", "高蛋白", "高纤维"],
    ingredients: [
      { name: "牛肉", amount: "200g", optional: false },
      { name: "芹菜", amount: "200g", optional: false },
      { name: "蒜", amount: "3瓣", optional: false },
      { name: "生抽", amount: "1勺", optional: false },
      { name: "料酒", amount: "1勺", optional: false },
    ],
    steps: [
      { stepOrder: 1, description: "牛肉切丝，用料酒腌制", duration: 5 },
      { stepOrder: 2, description: "芹菜斜切段，蒜切片", duration: 2 },
      { stepOrder: 3, description: "热锅爆炒牛肉丝至变色盛出", duration: 3 },
      { stepOrder: 4, description: "炒香蒜片，加入芹菜翻炒", duration: 3 },
      { stepOrder: 5, description: "倒回牛肉，调味出锅", duration: 2 },
    ],
  },
  {
    id: "recipe-9",
    name: "虾仁豆腐汤",
    description: "低脂高蛋白的清淡汤品",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400",
    source: "下厨房",
    sourceUrl: "https://www.xiachufang.com/recipe/104567898/",
    sourceId: "104567898",
    cookTime: 20,
    difficulty: "beginner",
    servings: 2,
    prepFriendly: false,
    shelfLife: null,
    nutrition: { calories: 180, protein: 22, carbs: 6, fat: 8 },
    tags: ["汤品", "低脂", "高蛋白"],
    ingredients: [
      { name: "虾仁", amount: "150g", optional: false },
      { name: "嫩豆腐", amount: "1盒", optional: false },
      { name: "鸡蛋", amount: "1个", optional: true },
      { name: "葱姜", amount: "适量", optional: false },
    ],
    steps: [
      { stepOrder: 1, description: "虾仁洗净，豆腐切小块", duration: 3 },
      { stepOrder: 2, description: "锅中加水烧开，放入姜片", duration: 3 },
      { stepOrder: 3, description: "加入豆腐煮3分钟", duration: 3 },
      { stepOrder: 4, description: "放入虾仁煮至变色", duration: 3 },
      { stepOrder: 5, description: "淋入蛋液，撒葱花调味", duration: 2 },
    ],
  },
  {
    id: "recipe-10",
    name: "黑椒牛排配蔬菜",
    description: "朋友聚餐首选，高档又营养",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
    source: "美食杰",
    sourceUrl: "https://www.meishij.net/recipe/234567899/",
    sourceId: "234567899",
    cookTime: 25,
    difficulty: "advanced",
    servings: 2,
    prepFriendly: false,
    shelfLife: null,
    nutrition: { calories: 450, protein: 42, carbs: 15, fat: 26 },
    tags: ["西餐", "聚餐", "高蛋白"],
    ingredients: [
      { name: "牛排", amount: "300g", optional: false },
      { name: "黑胡椒", amount: "适量", optional: false },
      { name: "黄油", amount: "20g", optional: false },
      { name: "芦笋", amount: "100g", optional: true },
      { name: "樱桃番茄", amount: "100g", optional: true },
    ],
    steps: [
      { stepOrder: 1, description: "牛排提前30分钟取出回温", duration: 30 },
      { stepOrder: 2, description: "撒上盐和黑胡椒，静置5分钟", duration: 5 },
      { stepOrder: 3, description: "高温煎锅，每面煎2-3分钟（五分熟）", duration: 6 },
      { stepOrder: 4, description: "加入黄油，用勺子淋在牛排上", duration: 2 },
      { stepOrder: 5, description: "静置5分钟后切片，配蔬菜上桌", duration: 5 },
    ],
  },
]

async function seed() {
  console.log("🌱 Starting database seed...")

  if (!db) {
    throw new Error("Database connection not available")
  }

  for (const recipeData of mockRecipes) {
    const { ingredients, steps, ...recipe } = recipeData

    // Insert recipe
    console.log(`  📝 Inserting recipe: ${recipe.name}`)
    await db.insert(recipes).values(recipe).onConflictDoNothing()

    // Insert ingredients
    for (let i = 0; i < ingredients.length; i++) {
      await db.insert(recipeIngredients).values({
        recipeId: recipe.id,
        name: ingredients[i].name,
        amount: ingredients[i].amount,
        optional: ingredients[i].optional,
        sortOrder: i,
      }).onConflictDoNothing()
    }

    // Insert steps
    for (const step of steps) {
      await db.insert(recipeSteps).values({
        recipeId: recipe.id,
        stepOrder: step.stepOrder,
        description: step.description,
        duration: step.duration,
      }).onConflictDoNothing()
    }
  }

  console.log("✅ Database seed completed!")
}

// Run seed if executed directly
seed().catch(console.error)
