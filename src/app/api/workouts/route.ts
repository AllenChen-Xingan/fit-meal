/**
 * Workouts API Route
 *
 * GET /api/workouts - List user's workouts
 * POST /api/workouts - Create new workout record
 * Falls back to mock when database is not available
 */

import { NextRequest, NextResponse } from "next/server"
import { db, workouts, isDatabaseAvailable } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { eq, desc, and, gte, lte } from "drizzle-orm"
import { mockWorkouts } from "@/lib/mock/workouts"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Check if database is available
    if (!isDatabaseAvailable() || !db) {
      // Return mock data
      return NextResponse.json({ workouts: mockWorkouts })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const limit = parseInt(searchParams.get("limit") || "30")

    const conditions = [eq(workouts.userId, user.userId)]
    if (startDate) {
      conditions.push(gte(workouts.workoutDate, startDate))
    }
    if (endDate) {
      conditions.push(lte(workouts.workoutDate, endDate))
    }

    const userWorkouts = await db
      .select()
      .from(workouts)
      .where(and(...conditions))
      .orderBy(desc(workouts.workoutDate))
      .limit(limit)

    return NextResponse.json({ workouts: userWorkouts })
  } catch (error) {
    console.error("Get workouts error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

interface CreateWorkoutRequest {
  type: string
  intensity: string
  bodyPart?: string
  duration?: number
  workoutDate: string
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

    const body: CreateWorkoutRequest = await request.json()
    const { type, intensity, bodyPart, duration, workoutDate, notes } = body

    if (!type || !intensity || !workoutDate) {
      return NextResponse.json(
        { error: "Type, intensity, and workoutDate are required" },
        { status: 400 }
      )
    }

    // Check if database is available
    if (!isDatabaseAvailable() || !db) {
      // Return mock response
      const mockWorkout = {
        id: `mock-workout-${Date.now()}`,
        userId: user.userId,
        type,
        intensity,
        bodyPart,
        duration,
        workoutDate,
        notes,
        createdAt: new Date().toISOString(),
      }
      return NextResponse.json({ workout: mockWorkout })
    }

    const [newWorkout] = await db
      .insert(workouts)
      .values({
        userId: user.userId,
        type,
        intensity,
        bodyPart,
        duration,
        workoutDate,
        notes,
      })
      .returning()

    return NextResponse.json({ workout: newWorkout })
  } catch (error) {
    console.error("Create workout error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
