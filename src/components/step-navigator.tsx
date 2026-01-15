"use client"

import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StepNavigatorProps {
  steps: string[]
  currentStep: number
  completedSteps?: number[]
  onStepChange: (step: number) => void
  onComplete?: () => void
  className?: string
}

export function StepNavigator({
  steps,
  currentStep,
  completedSteps = [],
  onStepChange,
  onComplete,
  className,
}: StepNavigatorProps) {
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  const isCurrentStepCompleted = completedSteps.includes(currentStep)

  const handlePrev = () => {
    if (!isFirstStep) {
      onStepChange(currentStep - 1)
    }
  }

  const handleNext = () => {
    if (isLastStep) {
      onComplete?.()
    } else {
      onStepChange(currentStep + 1)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Progress Bar */}
      <div className="flex items-center gap-1">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => onStepChange(index)}
            className={cn(
              "h-2 flex-1 rounded-full transition-colors",
              index < currentStep
                ? "bg-emerald-500"
                : index === currentStep
                ? "bg-emerald-400"
                : "bg-gray-200",
              completedSteps.includes(index) && "bg-emerald-500"
            )}
            aria-label={`步骤 ${index + 1}`}
          />
        ))}
      </div>

      {/* Step Counter */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          步骤 {currentStep + 1} / {steps.length}
        </span>
        {isCurrentStepCompleted && (
          <span className="flex items-center gap-1 text-emerald-600">
            <Check className="h-4 w-4" />
            已完成
          </span>
        )}
      </div>

      {/* Current Step Content */}
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <p className="text-gray-800 leading-relaxed">{steps[currentStep]}</p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={isFirstStep}
          className="flex-1"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          上一步
        </Button>

        <Button
          onClick={handleNext}
          className={cn(
            "flex-1",
            isLastStep && "bg-emerald-600 hover:bg-emerald-700"
          )}
        >
          {isLastStep ? (
            <>
              完成制作
              <Check className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              下一步
              <ChevronRight className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Step List (Collapsible) */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
          查看所有步骤
        </summary>
        <ol className="mt-2 space-y-2 pl-4">
          {steps.map((step, index) => (
            <li
              key={index}
              className={cn(
                "text-sm cursor-pointer rounded p-2 transition-colors",
                index === currentStep
                  ? "bg-emerald-50 text-emerald-800 font-medium"
                  : completedSteps.includes(index)
                  ? "text-gray-500 line-through"
                  : "text-gray-600 hover:bg-gray-50"
              )}
              onClick={() => onStepChange(index)}
            >
              <span className="mr-2">{index + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </details>
    </div>
  )
}
