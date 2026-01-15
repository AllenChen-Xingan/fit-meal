/**
 * Single Recipe API Route
 *
 * GET /api/recipes/[id] - Get recipe with ingredients and steps
 * Falls back to mock data when database is not available
 */

import { NextRequest, NextResponse } from "next/server"
import { db, recipes, recipeIngredients, recipeSteps, isDatabaseAvailable } from "@/lib/db"
import { eq, asc } from "drizzle-orm"
import { mockRecipes } from "@/lib/mock/recipes"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if database is available
    if (!isDatabaseAvailable() || !db) {
      // Return mock data
      const recipe = mockRecipes.find((r) => r.id === id)
      if (!recipe) {
        return NextResponse.json(
          { error: "Recipe not found" },
          { status: 404 }
        )
      }
      return NextResponse.json({ recipe })
    }

    // Get recipe
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, id))
      .limit(1)

    if (!recipe) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      )
    }

    // Get ingredients
    const ingredients = await db
      .select()
      .from(recipeIngredients)
      .where(eq(recipeIngredients.recipeId, id))
      .orderBy(asc(recipeIngredients.sortOrder))

    // Get steps
    const steps = await db
      .select()
      .from(recipeSteps)
      .where(eq(recipeSteps.recipeId, id))
      .orderBy(asc(recipeSteps.stepOrder))

    return NextResponse.json({
      recipe: {
        ...recipe,
        ingredients,
        steps,
      },
    })
  } catch (error) {
    console.error("Get recipe error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
