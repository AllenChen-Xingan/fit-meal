/**
 * Single Inventory Item API Route
 *
 * GET /api/inventory/[id] - Get inventory item details
 * PUT /api/inventory/[id] - Update inventory item
 * DELETE /api/inventory/[id] - Delete inventory item
 */

import { NextRequest, NextResponse } from "next/server"
import { db, inventory } from "@/lib/db"
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

    // Add computed fields
    const now = new Date()
    const expiresAt = new Date(item.expiresAt)
    const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    return NextResponse.json({
      item: {
        ...item,
        daysLeft,
        isExpired: daysLeft < 0,
        isExpiringSoon: daysLeft >= 0 && daysLeft <= 3,
      },
    })
  } catch (error) {
    console.error("Get inventory item error:", error)
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

    const [updatedItem] = await db
      .update(inventory)
      .set({
        name: body.name,
        portions: body.portions,
        storageType: body.storageType,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
        notes: body.notes,
        updatedAt: new Date(),
      })
      .where(and(eq(inventory.id, id), eq(inventory.userId, user.userId)))
      .returning()

    if (!updatedItem) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ item: updatedItem })
  } catch (error) {
    console.error("Update inventory item error:", error)
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

    const [deletedItem] = await db
      .delete(inventory)
      .where(and(eq(inventory.id, id), eq(inventory.userId, user.userId)))
      .returning()

    if (!deletedItem) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Item deleted" })
  } catch (error) {
    console.error("Delete inventory item error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
