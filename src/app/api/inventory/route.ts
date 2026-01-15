/**
 * Inventory API Route
 *
 * GET /api/inventory - List user's inventory
 * POST /api/inventory - Add new inventory item
 * Falls back to mock when database is not available
 */

import { NextRequest, NextResponse } from "next/server"
import { db, inventory, isDatabaseAvailable } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { eq, and, gte } from "drizzle-orm"
import { mockInventory } from "@/lib/mock/inventory"

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
      // Return mock data with computed fields
      const itemsWithStatus = mockInventory.map((item) => {
        const now = new Date()
        const expiresAt = new Date(item.expiresAt)
        const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return {
          ...item,
          daysLeft,
          isExpired: daysLeft < 0,
          isExpiringSoon: daysLeft >= 0 && daysLeft <= 3,
        }
      })
      return NextResponse.json({ inventory: itemsWithStatus })
    }

    const { searchParams } = new URL(request.url)
    const includeExpired = searchParams.get("includeExpired") === "true"

    const conditions = [eq(inventory.userId, user.userId)]
    if (!includeExpired) {
      conditions.push(gte(inventory.expiresAt, new Date()))
    }

    const items = await db
      .select()
      .from(inventory)
      .where(and(...conditions))
      .orderBy(inventory.expiresAt)

    const itemsWithStatus = items.map((item) => {
      const now = new Date()
      const expiresAt = new Date(item.expiresAt)
      const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return {
        ...item,
        daysLeft,
        isExpired: daysLeft < 0,
        isExpiringSoon: daysLeft >= 0 && daysLeft <= 3,
      }
    })

    return NextResponse.json({ inventory: itemsWithStatus })
  } catch (error) {
    console.error("Get inventory error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

interface CreateInventoryRequest {
  name: string
  portions: number
  storageType: "refrigerated" | "frozen"
  preparedAt: string
  expiresAt: string
  recipeId?: string
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

    const body: CreateInventoryRequest = await request.json()
    const { name, portions, storageType, preparedAt, expiresAt, recipeId, notes } = body

    if (!name || !portions || !storageType || !preparedAt || !expiresAt) {
      return NextResponse.json(
        { error: "Name, portions, storageType, preparedAt, and expiresAt are required" },
        { status: 400 }
      )
    }

    // Check if database is available
    if (!isDatabaseAvailable() || !db) {
      // Return mock response
      const mockItem = {
        id: `mock-inv-${Date.now()}`,
        userId: user.userId,
        name,
        portions,
        storageType,
        preparedAt: new Date(preparedAt),
        expiresAt: new Date(expiresAt),
        recipeId,
        notes,
        createdAt: new Date().toISOString(),
      }
      return NextResponse.json({ item: mockItem })
    }

    const [newItem] = await db
      .insert(inventory)
      .values({
        userId: user.userId,
        name,
        portions,
        storageType,
        preparedAt: new Date(preparedAt),
        expiresAt: new Date(expiresAt),
        recipeId,
        notes,
      })
      .returning()

    return NextResponse.json({ item: newItem })
  } catch (error) {
    console.error("Create inventory error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
