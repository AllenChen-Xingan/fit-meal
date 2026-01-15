/**
 * Recipes API Route
 *
 * GET /api/recipes - List recipes with filtering
 * Falls back to mock data when database is not available
 */

import { NextRequest, NextResponse } from "next/server"
import { db, recipes, isDatabaseAvailable } from "@/lib/db"
import { eq, ilike, and, sql } from "drizzle-orm"
import { mockRecipes } from "@/lib/mock/recipes"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const difficulty = searchParams.get("difficulty")
    const prepFriendly = searchParams.get("prepFriendly")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    // Check if database is available
    if (!isDatabaseAvailable() || !db) {
      // Return mock data
      let filteredRecipes = [...mockRecipes]

      if (search) {
        filteredRecipes = filteredRecipes.filter((r) =>
          r.name.toLowerCase().includes(search.toLowerCase())
        )
      }
      if (difficulty) {
        filteredRecipes = filteredRecipes.filter((r) => r.difficulty === difficulty)
      }
      if (prepFriendly === "true") {
        filteredRecipes = filteredRecipes.filter((r) => r.prepFriendly)
      }

      const total = filteredRecipes.length
      const paginatedRecipes = filteredRecipes.slice(offset, offset + limit)

      return NextResponse.json({
        recipes: paginatedRecipes,
        total,
        limit,
        offset,
      })
    }

    // Build where conditions
    const conditions = []
    if (search) {
      conditions.push(ilike(recipes.name, `%${search}%`))
    }
    if (difficulty) {
      conditions.push(eq(recipes.difficulty, difficulty))
    }
    if (prepFriendly === "true") {
      conditions.push(eq(recipes.prepFriendly, true))
    }

    // Query recipes
    const recipeList = await db
      .select()
      .from(recipes)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(limit)
      .offset(offset)
      .orderBy(recipes.createdAt)

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(recipes)
      .where(conditions.length > 0 ? and(...conditions) : undefined)

    return NextResponse.json({
      recipes: recipeList,
      total: Number(count),
      limit,
      offset,
    })
  } catch (error) {
    console.error("Get recipes error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
