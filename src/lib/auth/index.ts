/**
 * FitMeal Authentication Utilities
 *
 * Implements secure authentication with:
 * - bcrypt password hashing (from real.md constraint)
 * - JWT session tokens
 */

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET
const SALT_ROUNDS = 12

export interface JWTPayload {
  userId: string
  email: string
}

/**
 * Hash password with bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Verify password against hash
 * @param password - Plain text password
 * @param hash - Stored password hash
 * @returns True if password matches
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Create JWT token
 * @param payload - Token payload
 * @returns Signed JWT token
 * @throws Error if JWT_SECRET is not configured
 */
export function createToken(payload: JWTPayload): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required")
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

/**
 * Verify and decode JWT token
 * @param token - JWT token
 * @returns Decoded payload or null
 */
export function verifyToken(token: string): JWTPayload | null {
  if (!JWT_SECRET) {
    return null
  }
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

/**
 * Set auth cookie
 * @param token - JWT token
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

/**
 * Get auth cookie
 * @returns Token or null
 */
export async function getAuthCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get("auth_token")?.value ?? null
}

/**
 * Clear auth cookie
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("auth_token")
}

/**
 * Get current user from cookie
 * @returns User payload or null
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = await getAuthCookie()
  if (!token) return null
  return verifyToken(token)
}
