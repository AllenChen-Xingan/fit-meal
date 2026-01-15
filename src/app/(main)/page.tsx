"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ContextCard, type ContextType } from "@/components/context-card"
import { Disclaimer } from "@/components/disclaimer"
import { useWorkoutStore } from "@/lib/stores/workout-store"
import { useInventoryStore } from "@/lib/stores/inventory-store"

const contexts: {
  type: ContextType
  title: string
  description: string
  icon: string
}[] = [
  {
    type: "post-workout",
    title: "刚练完",
    description: "需要快速补充蛋白质",
    icon: "💪",
  },
  {
    type: "busy",
    title: "很忙",
    description: "10分钟快手菜",
    icon: "⏰",
  },
  {
    type: "have-time",
    title: "有时间",
    description: "可以慢慢做一顿好的",
    icon: "👨‍🍳",
  },
  {
    type: "social",
    title: "朋友来了",
    description: "适合分享的美食",
    icon: "🎉",
  },
]

export default function HomePage() {
  const router = useRouter()
  const [selectedContext, setSelectedContext] = useState<ContextType | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // 获取 store 数据
  const workoutRecords = useWorkoutStore((state) => state.records)
  const inventoryItems = useInventoryStore((state) => state.items)

  // 处理客户端 hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // 计算今日运动分钟数
  const todayWorkoutMinutes = useMemo(() => {
    if (!isHydrated) return 0
    const today = new Date().toISOString().split("T")[0]
    return workoutRecords
      .filter((record) => record.date.startsWith(today))
      .reduce((total, record) => total + record.duration, 0)
  }, [workoutRecords, isHydrated])

  // 计算库存数量（只统计数量大于 0 的有效库存）
  const inventoryCount = useMemo(() => {
    if (!isHydrated) return 0
    return inventoryItems.filter((item) => item.quantity > 0).length
  }, [inventoryItems, isHydrated])

  // 今日餐食数量（暂时显示 0，因为没有 meal store）
  const todayMealsCount = 0

  const handleContextSelect = (type: ContextType) => {
    setSelectedContext(type)
    // 延迟跳转，让用户看到选中效果
    setTimeout(() => {
      router.push(`/recommend?context=${type}`)
    }, 200)
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-emerald-600">FitMeal</h1>
        <p className="mt-2 text-gray-600">今天想吃什么？</p>
      </div>

      {/* Context Selection */}
      <div className="mb-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          选择你的情境
        </h2>
        <div className="grid gap-3">
          {contexts.map((ctx) => (
            <ContextCard
              key={ctx.type}
              type={ctx.type}
              title={ctx.title}
              description={ctx.description}
              icon={<span>{ctx.icon}</span>}
              selected={selectedContext === ctx.type}
              onClick={() => handleContextSelect(ctx.type)}
            />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
        <h3 className="mb-3 font-medium text-gray-800">今日概览</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-emerald-600">{todayMealsCount}</div>
            <div className="text-xs text-gray-500">已记录餐食</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{todayWorkoutMinutes}</div>
            <div className="text-xs text-gray-500">运动分钟</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{inventoryCount}</div>
            <div className="text-xs text-gray-500">库存食材</div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <Disclaimer />
    </div>
  )
}
