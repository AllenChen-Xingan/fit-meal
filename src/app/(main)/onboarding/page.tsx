"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/stores/auth-store"

type Step = "goal" | "busy" | "cooking"

interface Option {
  value: string
  label: string
  description: string
  icon: string
}

const goalOptions: Option[] = [
  {
    value: "gain-muscle",
    label: "增肌",
    description: "增加肌肉量，提升力量",
    icon: "💪",
  },
  {
    value: "lose-weight",
    label: "减脂",
    description: "减少体脂，塑造身材",
    icon: "🔥",
  },
  {
    value: "maintain",
    label: "维持",
    description: "保持当前体重和状态",
    icon: "⚖️",
  },
  {
    value: "healthy",
    label: "健康饮食",
    description: "均衡营养，健康生活",
    icon: "🥗",
  },
]

const busyOptions: Option[] = [
  {
    value: "relaxed",
    label: "时间充裕",
    description: "有足够时间准备和烹饪",
    icon: "🧘",
  },
  {
    value: "normal",
    label: "普通",
    description: "有一定时间，但不太多",
    icon: "⏰",
  },
  {
    value: "busy",
    label: "非常忙碌",
    description: "时间紧张，需要快手菜",
    icon: "🏃",
  },
]

const cookingOptions: Option[] = [
  {
    value: "beginner",
    label: "新手",
    description: "刚开始学做饭",
    icon: "🌱",
  },
  {
    value: "intermediate",
    label: "熟练",
    description: "能做常见家常菜",
    icon: "👨‍🍳",
  },
  {
    value: "advanced",
    label: "大厨级",
    description: "精通各种烹饪技巧",
    icon: "⭐",
  },
]

const stepConfig: Record<Step, { title: string; subtitle: string; options: Option[] }> = {
  goal: {
    title: "你的健身目标是什么？",
    subtitle: "我们会根据你的目标推荐合适的饮食方案",
    options: goalOptions,
  },
  busy: {
    title: "你平时有多少时间做饭？",
    subtitle: "我们会推荐适合你时间的食谱",
    options: busyOptions,
  },
  cooking: {
    title: "你的烹饪水平如何？",
    subtitle: "我们会推荐适合你水平的食谱",
    options: cookingOptions,
  },
}

const steps: Step[] = ["goal", "busy", "cooking"]

export default function OnboardingPage() {
  const router = useRouter()
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding)

  const [currentStep, setCurrentStep] = useState<Step>("goal")
  const [selections, setSelections] = useState<Record<Step, string>>({
    goal: "",
    busy: "",
    cooking: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentStepIndex = steps.indexOf(currentStep)
  const config = stepConfig[currentStep]
  const isLastStep = currentStepIndex === steps.length - 1
  const canProceed = selections[currentStep] !== ""

  const handleSelect = (value: string) => {
    setSelections((prev) => ({ ...prev, [currentStep]: value }))
  }

  const handleNext = async () => {
    if (!canProceed) return

    if (isLastStep) {
      setIsSubmitting(true)

      // 保存到 store
      completeOnboarding({
        goal: selections.goal,
        busyLevel: selections.busy,
        cookingLevel: selections.cooking,
      })

      // 跳转到首页
      setTimeout(() => {
        router.push("/")
      }, 500)
    } else {
      setCurrentStep(steps[currentStepIndex + 1])
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1])
    }
  }

  const handleSkip = () => {
    // Mark onboarding as completed (skipped) in store to prevent showing again
    completeOnboarding({
      goal: "healthy", // Default values for skipped users
      busyLevel: "normal",
      cookingLevel: "beginner",
    })

    // Also track skip event for analytics
    localStorage.setItem("fitmeal-onboarding-skipped", JSON.stringify({
      skipped: true,
      skippedAt: new Date().toISOString(),
    }))
    router.push("/")
  }

  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 py-8">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>步骤 {currentStepIndex + 1} / {steps.length}</span>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600"
          >
            跳过设置
          </button>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
        <p className="mt-2 text-gray-600">{config.subtitle}</p>
      </div>

      {/* Options */}
      <div className="mb-8 space-y-3">
        {config.options.map((option) => (
          <Card
            key={option.value}
            className={cn(
              "cursor-pointer transition-all duration-200",
              "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50",
              selections[currentStep] === option.value &&
                "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500"
            )}
            onClick={() => handleSelect(option.value)}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                {option.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{option.label}</h3>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
              {selections[currentStep] === option.value && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                  ✓
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {currentStepIndex > 0 && (
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex-1"
          >
            上一步
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!canProceed || isSubmitting}
          className={cn(
            "flex-1 bg-emerald-600 hover:bg-emerald-700",
            currentStepIndex === 0 && "w-full"
          )}
        >
          {isSubmitting ? "保存中..." : isLastStep ? "完成设置" : "下一步"}
        </Button>
      </div>

      {/* Hint */}
      <p className="mt-6 text-center text-xs text-gray-400">
        你可以随时在设置中修改这些选项
      </p>
    </div>
  )
}
