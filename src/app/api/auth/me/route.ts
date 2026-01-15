/**
 * Get Current User API Route
 *
 * GET /api/auth/me
 * Returns currently authenticated user
 * Falls back to mock when database is not available
 */

import { NextResponse } from "next/server"
import { db, users, isDatabaseAvailable } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const payload = await getCurrentUser()

    if (!payload) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    // Check if database is available
    if (!isDatabaseAvailable() || !db) {
      // Return mock user for development without database
      return NextResponse.json({
        user: {
          id: payload.userId,
          name: payload.email.split("@")[0],
          email: payload.email,
          goal: null,
          busyLevel: null,
          cookingLevel: null,
          createdAt: new Date().toISOString(),
        },
      })
    }

    // Fetch user from database
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        goal: users.goal,
        busyLevel: users.busyLevel,
        cookingLevel: users.cookingLevel,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1)

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Get current user error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
