/**
 * Single Workout API Route
 *
 * GET /api/workouts/[id] - Get workout details
 * PUT /api/workouts/[id] - Update workout
 * DELETE /api/workouts/[id] - Delete workout
 */

import { NextRequest, NextResponse } from "next/server"
import { db, workouts } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { eq, and } from "drizzle-orm"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { id } = await params

    if (!db) {
      return NextResponse.json(
        { error: "Database connection not available" },
        { status: 500 }
      )
    }

    const [workout] = await db
      .select()
      .from(workouts)
      .where(and(eq(workouts.id, id), eq(workouts.userId, user.userId)))
      .limit(1)

    if (!workout) {
      return NextResponse.json(
        { error: "Workout not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ workout })
  } catch (error) {
    console.error("Get workout error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    if (!db) {
      return NextResponse.json(
        { error: "Database connection not available" },
        { status: 500 }
      )
    }

    const [updatedWorkout] = await db
      .update(workouts)
      .set({
        type: body.type,
        intensity: body.intensity,
        bodyPart: body.bodyPart,
        duration: body.duration,
        workoutDate: body.workoutDate,
        notes: body.notes,
      })
      .where(and(eq(workouts.id, id), eq(workouts.userId, user.userId)))
      .returning()

    if (!updatedWorkout) {
      return NextResponse.json(
        { error: "Workout not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ workout: updatedWorkout })
  } catch (error) {
    console.error("Update workout error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { id } = await params

    if (!db) {
      return NextResponse.json(
        { error: "Database connection not available" },
        { status: 500 }
      )
    }

    const [deletedWorkout] = await db
      .delete(workouts)
      .where(and(eq(workouts.id, id), eq(workouts.userId, user.userId)))
      .returning()

    if (!deletedWorkout) {
      return NextResponse.json(
        { error: "Workout not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Workout deleted" })
  } catch (error) {
    console.error("Delete workout error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
