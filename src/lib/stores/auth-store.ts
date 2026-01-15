"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  name: string | null
  email: string
  avatar?: string
  createdAt: string
}

interface UserProfile {
  height?: number // cm
  weight?: number // kg
  age?: number
  gender?: "male" | "female" | "other"
  activityLevel?: "sedentary" | "light" | "moderate" | "active" | "very-active"
  goal?: "lose-weight" | "maintain" | "gain-muscle"
  targetCalories?: number
  targetProtein?: number
}

interface AuthState {
  user: User | null
  profile: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  register: (name: string, email: string, password: string) => Promise<boolean>
  updateProfile: (profile: Partial<UserProfile>) => void
  setUser: (user: User | null) => void
  checkAuth: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })

        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json().catch(() => ({}))

          if (!response.ok) {
            set({ error: data.error || "Login failed", isLoading: false })
            return false
          }

          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          })
          return true
        } catch {
          set({ error: "Network error. Please try again.", isLoading: false })
          return false
        }
      },

      logout: async () => {
        set({ isLoading: true })

        try {
          await fetch("/api/auth/logout", { method: "POST" })
        } catch {
          console.warn("Logout API error, clearing local state")
        }

        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null })

        try {
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          })

          const data = await response.json().catch(() => ({}))

          if (!response.ok) {
            set({ error: data.error || "Registration failed", isLoading: false })
            return false
          }

          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          })
          return true
        } catch {
          set({ error: "Network error. Please try again.", isLoading: false })
          return false
        }
      },

      checkAuth: async () => {
        try {
          const response = await fetch("/api/auth/me")
          if (response.ok) {
            const data = await response.json()
            set({ user: data.user, isAuthenticated: true })
          }
        } catch {
          // Keep existing localStorage state if API unavailable
          console.warn("Auth check failed, using cached state")
        }
      },

      updateProfile: (profileUpdate: Partial<UserProfile>) => {
        const { profile } = get()
        set({
          profile: { ...profile, ...profileUpdate },
        })
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        })
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: "fitmeal-auth",
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
