import { describe, it, expect, beforeEach, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'

// Mock zustand persist middleware
vi.mock('zustand/middleware', () => ({
  persist: (fn: any) => fn,
}))

describe('Auth Store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('should have initial state', async () => {
    const { useAuthStore } = await import('@/lib/stores/auth-store')
    const { result } = renderHook(() => useAuthStore())

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should handle successful login', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: '2024-01-01',
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ user: mockUser }),
    })

    const { useAuthStore } = await import('@/lib/stores/auth-store')
    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      await result.current.login('test@example.com', 'password123')
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('should handle failed login', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Invalid credentials' }),
    })

    const { useAuthStore } = await import('@/lib/stores/auth-store')
    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      await result.current.login('test@example.com', 'wrongpassword')
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.error).toBe('Invalid credentials')
  })

  it('should handle logout', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true })

    const { useAuthStore } = await import('@/lib/stores/auth-store')
    const { result } = renderHook(() => useAuthStore())

    // First login
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ user: { id: '1', name: 'Test', email: 'test@test.com', createdAt: '2024-01-01' } }),
    })

    await act(async () => {
      await result.current.login('test@test.com', 'password')
    })

    expect(result.current.isAuthenticated).toBe(true)

    // Then logout
    global.fetch = vi.fn().mockResolvedValue({ ok: true })

    await act(async () => {
      await result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should update profile', async () => {
    const { useAuthStore } = await import('@/lib/stores/auth-store')
    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      result.current.updateProfile({
        goal: 'gain-muscle',
        busyLevel: 'busy',
        cookingLevel: 'beginner',
      })
    })

    expect(result.current.profile?.goal).toBe('gain-muscle')
    expect(result.current.profile?.busyLevel).toBe('busy')
    expect(result.current.profile?.cookingLevel).toBe('beginner')
  })

  it('should complete onboarding', async () => {
    const { useAuthStore } = await import('@/lib/stores/auth-store')
    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      result.current.completeOnboarding({
        goal: 'lose-weight',
        busyLevel: 'normal',
        cookingLevel: 'intermediate',
      })
    })

    expect(result.current.profile?.goal).toBe('lose-weight')
    expect(result.current.profile?.busyLevel).toBe('normal')
    expect(result.current.profile?.cookingLevel).toBe('intermediate')
    expect(result.current.profile?.onboardingCompleted).toBe(true)
  })

  it('should clear error', async () => {
    const { useAuthStore } = await import('@/lib/stores/auth-store')
    const { result } = renderHook(() => useAuthStore())

    // Set error first
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Test error' }),
    })

    await act(async () => {
      await result.current.login('test@test.com', 'wrong')
    })

    expect(result.current.error).toBe('Test error')

    // Clear error
    await act(async () => {
      result.current.clearError()
    })

    expect(result.current.error).toBeNull()
  })

  it('should return false for needsOnboarding when not authenticated', async () => {
    const { useAuthStore } = await import('@/lib/stores/auth-store')
    const { result } = renderHook(() => useAuthStore())

    expect(result.current.needsOnboarding()).toBe(false)
  })

  it('should return true for needsOnboarding when authenticated but not completed', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: '2024-01-01',
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ user: mockUser }),
    })

    const { useAuthStore } = await import('@/lib/stores/auth-store')
    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      await result.current.login('test@example.com', 'password')
    })

    expect(result.current.needsOnboarding()).toBe(true)
  })

  it('should return false for needsOnboarding after completing onboarding', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: '2024-01-01',
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ user: mockUser }),
    })

    const { useAuthStore } = await import('@/lib/stores/auth-store')
    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      await result.current.login('test@example.com', 'password')
    })

    await act(async () => {
      result.current.completeOnboarding({
        goal: 'gain-muscle',
        busyLevel: 'busy',
        cookingLevel: 'intermediate',
      })
    })

    expect(result.current.needsOnboarding()).toBe(false)
  })

  it('should handle network error during login', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const { useAuthStore } = await import('@/lib/stores/auth-store')
    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      const success = await result.current.login('test@example.com', 'password')
      expect(success).toBe(false)
    })

    expect(result.current.error).toBe('Network error. Please try again.')
  })

  it('should handle network error during registration', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const { useAuthStore } = await import('@/lib/stores/auth-store')
    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      const success = await result.current.register('Test', 'test@example.com', 'password')
      expect(success).toBe(false)
    })

    expect(result.current.error).toBe('Network error. Please try again.')
  })

  it('should set user directly using setUser', async () => {
    const { useAuthStore } = await import('@/lib/stores/auth-store')
    const { result } = renderHook(() => useAuthStore())

    const mockUser = {
      id: '2',
      name: 'Direct User',
      email: 'direct@example.com',
      createdAt: '2024-01-01',
    }

    await act(async () => {
      result.current.setUser(mockUser)
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)

    // Test clearing user
    await act(async () => {
      result.current.setUser(null)
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })
})
