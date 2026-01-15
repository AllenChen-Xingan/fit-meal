/**
 * Consume Inventory API Route
 *
 * POST /api/inventory/[id]/consume - Consume portions from inventory
 */

import { NextRequest, NextResponse } from "next/server"
import { db, inventory } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { eq, and } from "drizzle-orm"

interface ConsumeRequest {
  portions: number
}

export async function POST(
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
    const body: ConsumeRequest = await request.json()
    const { portions = 1 } = body

    if (portions < 1) {
      return NextResponse.json(
        { error: "Portions must be at least 1" },
        { status: 400 }
      )
    }

    if (!db) {
      return NextResponse.json(
        { error: "Database connection not available" },
        { status: 500 }
      )
    }

    // Get current item
    const [item] = await db
      .select()
      .from(inventory)
      .where(and(eq(inventory.id, id), eq(inventory.userId, user.userId)))
      .limit(1)

    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      )
    }

    if (item.portions < portions) {
      return NextResponse.json(
        { error: `Only ${item.portions} portions available` },
        { status: 400 }
      )
    }

    const newPortions = item.portions - portions

    if (newPortions === 0) {
      // Delete the item if no portions left
      await db
        .delete(inventory)
        .where(eq(inventory.id, id))

      return NextResponse.json({
        message: "All portions consumed, item removed from inventory",
        consumed: portions,
        remaining: 0,
      })
    } else {
      // Update portions
      const [updatedItem] = await db
        .update(inventory)
        .set({
          portions: newPortions,
          updatedAt: new Date(),
        })
        .where(eq(inventory.id, id))
        .returning()

      return NextResponse.json({
        message: `Consumed ${portions} portion(s)`,
        consumed: portions,
        remaining: updatedItem.portions,
        item: updatedItem,
      })
    }
  } catch (error) {
    console.error("Consume inventory error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
