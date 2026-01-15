/**
 * Recommendation API Route
 *
 * POST /api/recommend - Get recipe recommendations based on context
 * Falls back to mock data when database is not available
 *
 * Context types (from cog.md):
 * - post_workout: 刚练完，需要高蛋白
 * - busy: 很忙，需要快速简单的餐食
 * - have_time: 有时间，可以尝试复杂食谱
 * - friends_over: 朋友来了，需要多人份量
 */

import { NextRequest, NextResponse } from "next/server"
import { db, recipes, recommendationLogs, isDatabaseAvailable } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { eq, desc, and, gte, lte, sql } from "drizzle-orm"
import { mockRecipes } from "@/lib/mock/recipes"

interface RecommendRequest {
  context: "post_workout" | "busy" | "have_time" | "friends_over"
  limit?: number
}

// Mock recommendation logic
function getMockRecommendations(context: string, limit: number) {
  let filtered = [...mockRecipes]

  switch (context) {
    case "post_workout":
      // High protein, quick meals
      filtered = filtered
        .filter((r) => r.cookTime <= 30 && r.nutrition.protein >= 25)
        .sort((a, b) => b.nutrition.protein - a.nutrition.protein)
      break
    case "busy":
      // Very quick, simple meals
      filtered = filtered
        .filter((r) => r.cookTime <= 15 && r.difficulty === "beginner")
        .sort((a, b) => a.cookTime - b.cookTime)
      break
    case "have_time":
      // More complex recipes
      filtered = filtered.filter((r) => r.difficulty === "advanced" || r.difficulty === "easy")
      break
    case "friends_over":
      // Multiple servings
      filtered = filtered
        .filter((r) => r.servings >= 2)
        .sort((a, b) => b.servings - a.servings)
      break
  }

  // Shuffle and limit
  if (filtered.length === 0) {
    filtered = [...mockRecipes]
  }
  return filtered.sort(() => Math.random() - 0.5).slice(0, limit)
}

export async function POST(request: NextRequest) {
  try {
    const body: RecommendRequest = await request.json()
    const { context, limit = 5 } = body

    if (!context) {
      return NextResponse.json(
        { error: "Context is required" },
        { status: 400 }
      )
    }

    // Check if database is available
    if (!isDatabaseAvailable() || !db) {
      // Return mock recommendations
      const recommendedRecipes = getMockRecommendations(context, limit)
      return NextResponse.json({
        context,
        recipes: recommendedRecipes,
        disclaimer: "饮食建议仅供参考，请根据个人情况调整",
      })
    }

    // Get current user (optional - for personalization)
    const user = await getCurrentUser()

    // Build recommendation query based on context
    let recommendedRecipes
    switch (context) {
      case "post_workout":
        recommendedRecipes = await db
          .select()
          .from(recipes)
          .where(
            and(
              lte(recipes.cookTime, 30),
              sql`(${recipes.nutrition}->>'protein')::int >= 25`
            )
          )
          .orderBy(sql`(${recipes.nutrition}->>'protein')::int DESC`)
          .limit(limit)
        break

      case "busy":
        recommendedRecipes = await db
          .select()
          .from(recipes)
          .where(
            and(
              lte(recipes.cookTime, 15),
              eq(recipes.difficulty, "beginner")
            )
          )
          .orderBy(recipes.cookTime)
          .limit(limit)
        break

      case "have_time":
        recommendedRecipes = await db
          .select()
          .from(recipes)
          .where(eq(recipes.difficulty, "advanced"))
          .orderBy(sql`RANDOM()`)
          .limit(limit)
        break

      case "friends_over":
        recommendedRecipes = await db
          .select()
          .from(recipes)
          .where(gte(recipes.servings, 2))
          .orderBy(desc(recipes.servings))
          .limit(limit)
        break

      default:
        recommendedRecipes = await db
          .select()
          .from(recipes)
          .orderBy(sql`RANDOM()`)
          .limit(limit)
    }

    if (recommendedRecipes.length === 0) {
      recommendedRecipes = await db
        .select()
        .from(recipes)
        .orderBy(sql`RANDOM()`)
        .limit(limit)
    }

    if (user) {
      await db.insert(recommendationLogs).values({
        userId: user.userId,
        context,
        recommendedRecipes: recommendedRecipes.map((r) => r.id),
      })
    }

    return NextResponse.json({
      context,
      recipes: recommendedRecipes,
      disclaimer: "饮食建议仅供参考，请根据个人情况调整",
    })
  } catch (error) {
    console.error("Recommend error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
