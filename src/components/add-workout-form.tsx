"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useWorkoutStore } from "@/lib/stores/workout-store"
import { X } from "lucide-react"

interface AddWorkoutFormProps {
  onClose: () => void
}

const workoutTypes = [
  { value: "strength", label: "💪 力量训练", caloriesPerMin: 6 },
  { value: "cardio", label: "🏃 有氧运动", caloriesPerMin: 8 },
  { value: "hiit", label: "🔥 HIIT", caloriesPerMin: 12 },
  { value: "yoga", label: "🧘 瑜伽/拉伸", caloriesPerMin: 3 },
  { value: "other", label: "🏋️ 其他", caloriesPerMin: 5 },
] as const

const intensityOptions = [
  { value: "low", label: "低强度", multiplier: 0.8 },
  { value: "medium", label: "中等强度", multiplier: 1 },
  { value: "high", label: "高强度", multiplier: 1.3 },
] as const

type WorkoutType = (typeof workoutTypes)[number]["value"]
type Intensity = (typeof intensityOptions)[number]["value"]

export function AddWorkoutForm({ onClose }: AddWorkoutFormProps) {
  const { addRecord } = useWorkoutStore()
  const [formData, setFormData] = useState({
    type: "strength" as WorkoutType,
    name: "",
    duration: 30,
    intensity: "medium" as Intensity,
    notes: "",
  })

  // 计算预估消耗卡路里
  const estimatedCalories = () => {
    const workout = workoutTypes.find((w) => w.value === formData.type)
    const intensity = intensityOptions.find((i) => i.value === formData.intensity)
    if (!workout || !intensity) return 0
    return Math.round(workout.caloriesPerMin * formData.duration * intensity.multiplier)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const workout = workoutTypes.find((w) => w.value === formData.type)
    const workoutName = formData.name || workout?.label.slice(2) || "运动"

    addRecord({
      type: formData.type,
      name: workoutName,
      duration: formData.duration,
      intensity: formData.intensity,
      caloriesBurned: estimatedCalories(),
      date: new Date().toISOString(),
      notes: formData.notes || undefined,
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
            <h2 className="text-lg font-semibold">记录运动</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            {/* Workout Type */}
            <div className="space-y-2">
              <Label htmlFor="type">运动类型</Label>
              <Select
                id="type"
                value={formData.type}
                onChange={(e) => updateField("type", e.target.value as WorkoutType)}
              >
                {workoutTypes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Custom Name */}
            <div className="space-y-2">
              <Label htmlFor="name">运动名称（可选）</Label>
              <Input
                id="name"
                placeholder="例如：卧推、跑步机"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">时长（分钟）</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="300"
                value={formData.duration}
                onChange={(e) => updateField("duration", parseInt(e.target.value) || 30)}
              />
            </div>

            {/* Intensity */}
            <div className="space-y-2">
              <Label htmlFor="intensity">运动强度</Label>
              <Select
                id="intensity"
                value={formData.intensity}
                onChange={(e) => updateField("intensity", e.target.value as Intensity)}
              >
                {intensityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Estimated Calories */}
            <div className="rounded-lg bg-orange-50 p-3 text-center">
              <p className="text-sm text-orange-700">预估消耗</p>
              <p className="text-2xl font-bold text-orange-600">{estimatedCalories()} 千卡</p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">备注（可选）</Label>
              <Input
                id="notes"
                placeholder="例如：感觉很好，加了重量"
                value={formData.notes}
                onChange={(e) => updateField("notes", e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                取消
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                保存
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
