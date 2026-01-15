"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DisclaimerProps {
  className?: string
}

export function Disclaimer({ className }: DisclaimerProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800",
        className
      )}
    >
      <p className="flex items-center gap-1.5">
        <span className="text-amber-500">⚠️</span>
        <span>
          <strong>免责声明：</strong>
          本应用提供的饮食建议仅供参考，不构成医疗或营养专业建议。
          如有特殊健康状况，请咨询专业医师或营养师。
        </span>
      </p>
    </div>
  )
}
