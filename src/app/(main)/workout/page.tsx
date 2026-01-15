"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWorkoutStore } from "@/lib/stores/workout-store"
import { AddWorkoutForm } from "@/components/add-workout-form"
import { Plus, Flame, Calendar, Trash2, Trophy } from "lucide-react"

const workoutTypeIcons: Record<string, string> = {
  strength: "💪",
  cardio: "🏃",
  hiit: "🔥",
  yoga: "🧘",
  other: "🏋️",
}

export default function WorkoutPage() {
  const { records, removeRecord, getTotalCaloriesBurned, getWorkoutStreak } = useWorkoutStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  })

  // 本周统计
  const weeklyStats = useMemo(() => {
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay())
    weekStart.setHours(0, 0, 0, 0)

    const weekRecords = records.filter((r) => new Date(r.date) >= weekStart)
    const uniqueDays = new Set(weekRecords.map((r) => r.date.split("T")[0])).size

    return {
      days: uniqueDays,
      calories: weekRecords.reduce((sum, r) => sum + r.caloriesBurned, 0),
    }
  }, [records])

  // 月度日历数据
  const calendarData = useMemo(() => {
    const [year, month] = selectedMonth.split("-").map(Number)
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = firstDay.getDay()

    // 获取该月的运动记录
    const monthRecords = records.filter((r) => r.date.startsWith(selectedMonth))
    const recordsByDate = monthRecords.reduce((acc, r) => {
      const date = r.date.split("T")[0]
      if (!acc[date]) acc[date] = []
      acc[date].push(r)
      return acc
    }, {} as Record<string, typeof records>)

    return { daysInMonth, startDayOfWeek, recordsByDate, year, month }
  }, [selectedMonth, records])

  // 最近记录
  const recentRecords = useMemo(() => {
    return [...records]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
  }, [records])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays === 0) return "今天"
    if (diffDays === 1) return "昨天"
    if (diffDays < 7) return `${diffDays}天前`
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const changeMonth = (delta: number) => {
    const [year, month] = selectedMonth.split("-").map(Number)
    const newDate = new Date(year, month - 1 + delta, 1)
    setSelectedMonth(
      `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}`
    )
  }

  const streak = getWorkoutStreak()

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">运动记录</h1>
        <p className="text-sm text-gray-500">追踪你的运动，优化饮食推荐</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-emerald-600">{weeklyStats.days}</div>
            <div className="text-xs text-gray-500">本周运动天</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-orange-600">{weeklyStats.calories}</div>
            <div className="text-xs text-gray-500">本周消耗卡</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-2xl font-bold text-yellow-600">{streak}</span>
            </div>
            <div className="text-xs text-gray-500">连续天数</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Add */}
      <Button
        className="mb-6 w-full bg-emerald-600 hover:bg-emerald-700"
        onClick={() => setShowAddForm(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        记录运动
      </Button>

      {/* Calendar View */}
      <Card className="mb-6">
        <CardContent className="p-4">
          {/* Month Navigation */}
          <div className="mb-4 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => changeMonth(-1)}>
              ←
            </Button>
            <h3 className="font-medium text-gray-800">
              {calendarData.year}年{calendarData.month}月
            </h3>
            <Button variant="ghost" size="sm" onClick={() => changeMonth(1)}>
              →
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Week Headers */}
            {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
              <div key={day} className="py-1 text-xs text-gray-400">
                {day}
              </div>
            ))}

            {/* Empty cells before first day */}
            {Array.from({ length: calendarData.startDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Days */}
            {Array.from({ length: calendarData.daysInMonth }).map((_, i) => {
              const day = i + 1
              const dateStr = `${selectedMonth}-${String(day).padStart(2, "0")}`
              const dayRecords = calendarData.recordsByDate[dateStr] || []
              const hasWorkout = dayRecords.length > 0
              const totalCalories = dayRecords.reduce((sum, r) => sum + r.caloriesBurned, 0)
              const isToday = dateStr === new Date().toISOString().split("T")[0]

              return (
                <div
                  key={day}
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm ${
                    isToday ? "ring-2 ring-emerald-500" : ""
                  } ${hasWorkout ? "bg-emerald-100 text-emerald-800" : "text-gray-600"}`}
                  title={hasWorkout ? `${totalCalories}卡` : undefined}
                >
                  <span className={hasWorkout ? "font-medium" : ""}>{day}</span>
                  {hasWorkout && (
                    <Flame className="h-3 w-3 text-orange-500" />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Records */}
      <Card>
        <CardContent className="p-4">
          <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-800">
            <Calendar className="h-4 w-4" /> 最近记录
          </h3>

          {recentRecords.length > 0 ? (
            <div className="space-y-2">
              {recentRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{workoutTypeIcons[record.type] || "🏋️"}</span>
                    <div>
                      <p className="font-medium text-gray-800">{record.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(record.date)} · {record.duration}分钟
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-orange-600">
                      {record.caloriesBurned}卡
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                      onClick={() => removeRecord(record.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <div className="mb-2 text-4xl">🏃</div>
              <p className="text-sm">暂无运动记录</p>
              <p className="mt-1 text-xs text-gray-400">
                记录运动可以获得更精准的饮食推荐
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Workout Form Modal */}
      {showAddForm && <AddWorkoutForm onClose={() => setShowAddForm(false)} />}
    </div>
  )
}
