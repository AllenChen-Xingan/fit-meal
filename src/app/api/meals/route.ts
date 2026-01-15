/**
 * Meals API Route
 *
 * GET /api/meals - List user's meal records
 * POST /api/meals - Record a new meal
 */

import { NextRequest, NextResponse } from "next/server"
import { db, meals } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { eq, desc, and, gte, lte, sql } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const limit = parseInt(searchParams.get("limit") || "30")

    // Build conditions
    const conditions = [eq(meals.userId, user.userId)]
    if (date) {
      conditions.push(eq(meals.mealDate, date))
    }
    if (startDate) {
      conditions.push(gte(meals.mealDate, startDate))
    }
    if (endDate) {
      conditions.push(lte(meals.mealDate, endDate))
    }

    if (!db) {
      return NextResponse.json(
        { error: "Database connection not available" },
        { status: 500 }
      )
    }

    const userMeals = await db
      .select()
      .from(meals)
      .where(and(...conditions))
      .orderBy(desc(meals.mealDate), desc(meals.createdAt))
      .limit(limit)

    // Calculate daily totals if querying by date
    let dailyTotals = null
    if (date) {
      const totals = await db
        .select({
          totalCalories: sql<number>`SUM((${meals.nutrition}->>'calories')::int)`,
          totalProtein: sql<number>`SUM((${meals.nutrition}->>'protein')::int)`,
          totalCarbs: sql<number>`SUM((${meals.nutrition}->>'carbs')::int)`,
          totalFat: sql<number>`SUM((${meals.nutrition}->>'fat')::int)`,
        })
        .from(meals)
        .where(and(eq(meals.userId, user.userId), eq(meals.mealDate, date)))

      dailyTotals = totals[0]
    }

    return NextResponse.json({
      meals: userMeals,
      dailyTotals,
    })
  } catch (error) {
    console.error("Get meals error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

interface CreateMealRequest {
  mealType: "breakfast" | "lunch" | "dinner" | "snack"
  mealDate: string
  source?: "homemade" | "prepped"
  recipeId?: string
  nutrition?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  notes?: string
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const body: CreateMealRequest = await request.json()
    const { mealType, mealDate, source = "homemade", recipeId, nutrition, notes } = body

    // Validate required fields
    if (!mealType || !mealDate) {
      return NextResponse.json(
        { error: "MealType and mealDate are required" },
        { status: 400 }
      )
    }

    if (!db) {
      return NextResponse.json(
        { error: "Database connection not available" },
        { status: 500 }
      )
    }

    const [newMeal] = await db
      .insert(meals)
      .values({
        userId: user.userId,
        mealType,
        mealDate,
        source,
        recipeId,
        nutrition,
        notes,
      })
      .returning()

    return NextResponse.json({ meal: newMeal })
  } catch (error) {
    console.error("Create meal error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
