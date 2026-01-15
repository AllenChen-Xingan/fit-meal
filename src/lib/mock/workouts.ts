// Mock 运动数据
// 用于记录运动并优化饮食推荐

export interface MockWorkout {
  id: string
  type: WorkoutType
  name: string
  duration: number // 分钟
  caloriesBurned: number
  intensity: "low" | "medium" | "high"
  date: string // ISO date string
  notes?: string
}

export type WorkoutType =
  | "strength"
  | "cardio"
  | "hiit"
  | "yoga"
  | "swimming"
  | "running"
  | "cycling"
  | "other"

export const workoutTypeLabels: Record<WorkoutType, string> = {
  strength: "力量训练",
  cardio: "有氧运动",
  hiit: "高强度间歇",
  yoga: "瑜伽",
  swimming: "游泳",
  running: "跑步",
  cycling: "骑行",
  other: "其他",
}

export const workoutTypeIcons: Record<WorkoutType, string> = {
  strength: "💪",
  cardio: "🏃",
  hiit: "🔥",
  yoga: "🧘",
  swimming: "🏊",
  running: "🏃‍♂️",
  cycling: "🚴",
  other: "🎯",
}

// 根据运动类型和时长估算消耗的卡路里
export function estimateCalories(
  type: WorkoutType,
  durationMinutes: number,
  intensity: "low" | "medium" | "high"
): number {
  // 基础卡路里消耗率 (每分钟)
  const baseRates: Record<WorkoutType, number> = {
    strength: 5,
    cardio: 8,
    hiit: 12,
    yoga: 3,
    swimming: 9,
    running: 10,
    cycling: 7,
    other: 5,
  }

  const intensityMultiplier = {
    low: 0.7,
    medium: 1.0,
    high: 1.3,
  }

  return Math.round(
    baseRates[type] * durationMinutes * intensityMultiplier[intensity]
  )
}

// 生成最近一周的模拟运动数据
export function generateMockWorkouts(): MockWorkout[] {
  const now = new Date()
  const workouts: MockWorkout[] = []

  // 3天前 - 力量训练
  workouts.push({
    id: "workout-1",
    type: "strength",
    name: "上肢力量",
    duration: 60,
    caloriesBurned: estimateCalories("strength", 60, "medium"),
    intensity: "medium",
    date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "胸肌、三头肌、肩部",
  })

  // 2天前 - 有氧
  workouts.push({
    id: "workout-2",
    type: "running",
    name: "晨跑",
    duration: 30,
    caloriesBurned: estimateCalories("running", 30, "medium"),
    intensity: "medium",
    date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "公园5公里",
  })

  // 1天前 - HIIT
  workouts.push({
    id: "workout-3",
    type: "hiit",
    name: "HIIT燃脂",
    duration: 25,
    caloriesBurned: estimateCalories("hiit", 25, "high"),
    intensity: "high",
    date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Tabata训练",
  })

  // 今天 - 瑜伽
  workouts.push({
    id: "workout-4",
    type: "yoga",
    name: "恢复瑜伽",
    duration: 45,
    caloriesBurned: estimateCalories("yoga", 45, "low"),
    intensity: "low",
    date: now.toISOString(),
    notes: "拉伸放松",
  })

  return workouts
}

// 获取某日期范围内的运动统计
export function getWorkoutStats(
  workouts: MockWorkout[],
  startDate: Date,
  endDate: Date
): {
  totalWorkouts: number
  totalDuration: number
  totalCalories: number
  byType: Record<WorkoutType, number>
} {
  const filtered = workouts.filter((w) => {
    const date = new Date(w.date)
    return date >= startDate && date <= endDate
  })

  const byType = {} as Record<WorkoutType, number>

  for (const workout of filtered) {
    byType[workout.type] = (byType[workout.type] || 0) + 1
  }

  return {
    totalWorkouts: filtered.length,
    totalDuration: filtered.reduce((sum, w) => sum + w.duration, 0),
    totalCalories: filtered.reduce((sum, w) => sum + w.caloriesBurned, 0),
    byType,
  }
}

export const mockWorkouts = generateMockWorkouts()
