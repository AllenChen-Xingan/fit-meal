/**
 * Login API Route
 *
 * POST /api/auth/login
 * Authenticates user and returns session token
 * Falls back to mock when database is not available
 */

import { NextRequest, NextResponse } from "next/server"
import { db, users, isDatabaseAvailable } from "@/lib/db"
import { verifyPassword, createToken, setAuthCookie } from "@/lib/auth"
import { eq } from "drizzle-orm"

interface LoginRequest {
  email: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Check if database is available
    if (!isDatabaseAvailable() || !db) {
      // Return mock response for development without database
      const mockUser = {
        id: "mock-user-1",
        name: email.split("@")[0],
        email: email.toLowerCase(),
        createdAt: new Date().toISOString(),
      }
      const token = createToken({ userId: mockUser.id, email: mockUser.email })
      await setAuthCookie(token)
      return NextResponse.json({
        user: mockUser,
        message: "Login successful (mock mode)",
      })
    }

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Create JWT token and set cookie
    const token = createToken({ userId: user.id, email: user.email })
    await setAuthCookie(token)

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
