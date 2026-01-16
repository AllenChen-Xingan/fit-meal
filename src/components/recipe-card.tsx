"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRecipeStore } from "@/lib/stores/recipe-store"
import { Heart, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface RecipeCardProps {
  id: string
  title: string
  description: string
  imageUrl?: string
  cookTime: number // minutes
  calories: number
  protein: number
  source: string // 来源：下厨房/美食杰
  sourceUrl: string
  className?: string
  showFavorite?: boolean
}

export function RecipeCard({
  id,
  title,
  description,
  imageUrl,
  cookTime,
  calories,
  protein,
  source,
  sourceUrl,
  className,
  showFavorite = true,
}: RecipeCardProps) {
  const { toggleFavorite, isFavorite } = useRecipeStore()
  const favorite = isFavorite(id)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(id)
  }

  return (
    <Link href={`/recipe/${id}`}>
      <Card
        className={cn(
          "overflow-hidden transition-all duration-200 hover:shadow-lg",
          className
        )}
      >
        {imageUrl && (
          <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            {showFavorite && (
              <Button
                size="sm"
                variant="ghost"
                className={cn(
                  "absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 p-0 backdrop-blur-sm",
                  favorite && "text-red-500"
                )}
                onClick={handleFavoriteClick}
              >
                <Heart
                  className={cn("h-4 w-4", favorite && "fill-current")}
                />
              </Button>
            )}
          </div>
        )}
        <CardContent className="p-4">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 line-clamp-1">{title}</h3>
            {!imageUrl && showFavorite && (
              <Button
                size="sm"
                variant="ghost"
                className={cn(
                  "h-6 w-6 flex-shrink-0 p-0",
                  favorite && "text-red-500"
                )}
                onClick={handleFavoriteClick}
              >
                <Heart
                  className={cn("h-4 w-4", favorite && "fill-current")}
                />
              </Button>
            )}
          </div>
          <p className="mb-3 text-sm text-gray-500 line-clamp-2">{description}</p>

          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {cookTime}分钟
            </span>
            <span>{calories}千卡</span>
            <span>蛋白质{protein}g</span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              来源: {source}
            </a>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
