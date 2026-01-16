"use client"

import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  icon = "📭",
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 text-5xl">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-gray-600">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="flex flex-col gap-2 sm:flex-row">
          {action && (
            <Button
              onClick={action.onClick}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Preset empty states for common scenarios
export function NoRecommendationsEmpty({ onRefresh }: { onRefresh: () => void }) {
  return (
    <EmptyState
      icon="🍽️"
      title="暂无匹配的推荐"
      description="没有找到适合当前情境的食谱，试试换一个情境或刷新看看？"
      action={{
        label: "换一批推荐",
        onClick: onRefresh,
      }}
    />
  )
}

export function NoInventoryEmpty({ onAdd }: { onAdd: () => void }) {
  return (
    <EmptyState
      icon="❄️"
      title="冰箱空空如也"
      description="还没有添加任何预制菜，开始备餐吧！"
      action={{
        label: "添加预制菜",
        onClick: onAdd,
      }}
    />
  )
}

export function NoWorkoutsEmpty({ onAdd }: { onAdd: () => void }) {
  return (
    <EmptyState
      icon="💪"
      title="还没有运动记录"
      description="记录你的运动，获得更精准的饮食推荐"
      action={{
        label: "记录运动",
        onClick: onAdd,
      }}
    />
  )
}

export function NoShoppingItemsEmpty() {
  return (
    <EmptyState
      icon="🛒"
      title="购物清单为空"
      description="浏览食谱并添加食材到购物清单"
    />
  )
}

export function NetworkErrorEmpty({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      icon="🌐"
      title="网络连接失败"
      description="请检查你的网络连接后重试"
      action={{
        label: "重试",
        onClick: onRetry,
      }}
    />
  )
}

export function LoadingErrorEmpty({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      icon="⚠️"
      title="加载失败"
      description="出了点问题，请稍后重试"
      action={{
        label: "重试",
        onClick: onRetry,
      }}
    />
  )
}
