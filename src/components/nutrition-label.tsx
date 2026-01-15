"use client"

import { cn } from "@/lib/utils"

interface NutritionLabelProps {
  calories: number
  protein: number
  carbs: number
  fat: number
  servings?: number
  className?: string
  compact?: boolean
}

export function NutritionLabel({
  calories,
  protein,
  carbs,
  fat,
  servings = 1,
  className,
  compact = false,
}: NutritionLabelProps) {
  const totalMacros = protein + carbs + fat
  const proteinPercent = totalMacros > 0 ? (protein / totalMacros) * 100 : 0
  const carbsPercent = totalMacros > 0 ? (carbs / totalMacros) * 100 : 0
  const fatPercent = totalMacros > 0 ? (fat / totalMacros) * 100 : 0

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3 text-xs", className)}>
        <span className="text-orange-600 font-medium">{calories} 卡</span>
        <span className="text-emerald-600">蛋白 {protein}g</span>
        <span className="text-blue-600">碳水 {carbs}g</span>
        <span className="text-amber-600">脂肪 {fat}g</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "rounded-lg bg-white p-4 shadow-sm border border-gray-100",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
        <h4 className="font-semibold text-gray-800">营养信息</h4>
        {servings > 1 && (
          <span className="text-xs text-gray-500">每份 / 共 {servings} 份</span>
        )}
      </div>

      {/* Calories */}
      <div className="flex items-baseline justify-between mb-4">
        <span className="text-gray-600">热量</span>
        <span className="text-2xl font-bold text-orange-600">{calories} 卡</span>
      </div>

      {/* Macro Distribution Bar */}
      <div className="h-3 w-full rounded-full overflow-hidden flex mb-4">
        <div
          className="bg-emerald-500 transition-all"
          style={{ width: `${proteinPercent}%` }}
          title={`蛋白质 ${protein}g`}
        />
        <div
          className="bg-blue-500 transition-all"
          style={{ width: `${carbsPercent}%` }}
          title={`碳水化合物 ${carbs}g`}
        />
        <div
          className="bg-amber-500 transition-all"
          style={{ width: `${fatPercent}%` }}
          title={`脂肪 ${fat}g`}
        />
      </div>

      {/* Macro Details */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-emerald-50 p-2">
          <div className="text-lg font-bold text-emerald-600">{protein}g</div>
          <div className="text-xs text-emerald-700">蛋白质</div>
          <div className="text-xs text-gray-400">
            {Math.round(proteinPercent)}%
          </div>
        </div>
        <div className="rounded-lg bg-blue-50 p-2">
          <div className="text-lg font-bold text-blue-600">{carbs}g</div>
          <div className="text-xs text-blue-700">碳水化合物</div>
          <div className="text-xs text-gray-400">{Math.round(carbsPercent)}%</div>
        </div>
        <div className="rounded-lg bg-amber-50 p-2">
          <div className="text-lg font-bold text-amber-600">{fat}g</div>
          <div className="text-xs text-amber-700">脂肪</div>
          <div className="text-xs text-gray-400">{Math.round(fatPercent)}%</div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mt-3 text-xs text-gray-400 text-center">
        * 营养数据仅供参考，实际值可能因食材和烹饪方式而异
      </p>
    </div>
  )
}
