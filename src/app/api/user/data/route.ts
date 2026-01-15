/**
 * User Data Export/Delete API Route
 *
 * GET /api/user/data - Export all user data (real.md constraint)
 * DELETE /api/user/data - Delete all user data (real.md constraint)
 */

import { NextResponse } from "next/server"
import { db, users, workouts, meals, inventory, recommendationLogs } from "@/lib/db"
import { getCurrentUser, clearAuthCookie } from "@/lib/auth"
import { eq } from "drizzle-orm"

/**
 * Export all user data
 * Implements real.md constraint: "用户可随时导出个人数据"
 */
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    if (!db) {
      return NextResponse.json(
        { error: "Database connection not available" },
        { status: 500 }
      )
    }

    // Fetch all user data
    const [userData] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        goal: users.goal,
        busyLevel: users.busyLevel,
        cookingLevel: users.cookingLevel,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, user.userId))

    const userWorkouts = await db
      .select()
      .from(workouts)
      .where(eq(workouts.userId, user.userId))

    const userMeals = await db
      .select()
      .from(meals)
      .where(eq(meals.userId, user.userId))

    const userInventory = await db
      .select()
      .from(inventory)
      .where(eq(inventory.userId, user.userId))

    const userRecommendations = await db
      .select()
      .from(recommendationLogs)
      .where(eq(recommendationLogs.userId, user.userId))

    const exportData = {
      exportedAt: new Date().toISOString(),
      user: userData,
      workouts: userWorkouts,
      meals: userMeals,
      inventory: userInventory,
      recommendations: userRecommendations,
    }

    return NextResponse.json(exportData, {
      headers: {
        "Content-Disposition": `attachment; filename="fitmeal-data-${user.userId}.json"`,
      },
    })
  } catch (error) {
    console.error("Export user data error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * Delete all user data
 * Implements real.md constraint: "用户可随时删除个人数据"
 */
export async function DELETE() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    if (!db) {
      return NextResponse.json(
        { error: "Database connection not available" },
        { status: 500 }
      )
    }

    // Delete all user data (cascade will handle related records)
    await db.delete(users).where(eq(users.id, user.userId))

    // Clear auth cookie
    await clearAuthCookie()

    return NextResponse.json({
      message: "All user data has been deleted",
      deletedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Delete user data error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
