"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type ContextType = "post-workout" | "busy" | "have-time" | "social"

interface ContextCardProps {
  type: ContextType
  title: string
  description: string
  icon: React.ReactNode
  selected?: boolean
  onClick?: () => void
}

const contextColors: Record<ContextType, string> = {
  "post-workout": "border-orange-500/50 bg-orange-50 hover:bg-orange-100",
  "busy": "border-blue-500/50 bg-blue-50 hover:bg-blue-100",
  "have-time": "border-emerald-500/50 bg-emerald-50 hover:bg-emerald-100",
  "social": "border-purple-500/50 bg-purple-50 hover:bg-purple-100",
}

const selectedColors: Record<ContextType, string> = {
  "post-workout": "ring-2 ring-orange-500 border-orange-500",
  "busy": "ring-2 ring-blue-500 border-blue-500",
  "have-time": "ring-2 ring-emerald-500 border-emerald-500",
  "social": "ring-2 ring-purple-500 border-purple-500",
}

export function ContextCard({
  type,
  title,
  description,
  icon,
  selected = false,
  onClick,
}: ContextCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200",
        contextColors[type],
        selected && selectedColors[type]
      )}
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-2xl">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
