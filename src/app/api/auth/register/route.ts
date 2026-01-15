/**
 * Register API Route
 *
 * POST /api/auth/register
 * Creates a new user account with encrypted password
 * Falls back to mock when database is not available
 */

import { NextRequest, NextResponse } from "next/server"
import { db, users, isDatabaseAvailable } from "@/lib/db"
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth"
import { eq } from "drizzle-orm"

interface RegisterRequest {
  name: string
  email: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json()
    const { name, email, password } = body

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Check if database is available
    if (!isDatabaseAvailable() || !db) {
      // Return mock response for development without database
      const mockUser = {
        id: `mock-user-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        createdAt: new Date().toISOString(),
      }
      const token = createToken({ userId: mockUser.id, email: mockUser.email })
      await setAuthCookie(token)
      return NextResponse.json({
        user: mockUser,
        message: "Registration successful (mock mode)",
      })
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      )
    }

    // Hash password (real.md constraint: bcrypt encryption)
    const hashedPassword = await hashPassword(password)

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      })

    // Create JWT token and set cookie
    const token = createToken({ userId: newUser.id, email: newUser.email })
    await setAuthCookie(token)

    return NextResponse.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
      message: "Registration successful",
    })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
