"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type WorkoutType = "strength" | "cardio" | "hiit" | "yoga" | "other"
type Intensity = "low" | "medium" | "high"

interface WorkoutRecord {
  id: string
  type: WorkoutType
  name: string
  duration: number // minutes
  intensity: Intensity
  caloriesBurned: number
  date: string // ISO date
  notes?: string
}

interface WorkoutState {
  records: WorkoutRecord[]
  addRecord: (record: Omit<WorkoutRecord, "id">) => void
  removeRecord: (id: string) => void
  getRecordsByDate: (date: string) => WorkoutRecord[]
  getRecentRecords: (days?: number) => WorkoutRecord[]
  getTotalCaloriesBurned: (days?: number) => number
  getWorkoutStreak: () => number
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      records: [],

      addRecord: (record) => {
        const id = crypto.randomUUID()
        set((state) => ({
          records: [...state.records, { ...record, id }],
        }))
      },

      removeRecord: (id) => {
        set((state) => ({
          records: state.records.filter((record) => record.id !== id),
        }))
      },

      getRecordsByDate: (date) => {
        const { records } = get()
        return records.filter((record) => record.date.startsWith(date))
      },

      getRecentRecords: (days = 7) => {
        const { records } = get()
        const now = new Date()
        const threshold = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

        return records.filter((record) => new Date(record.date) >= threshold)
      },

      getTotalCaloriesBurned: (days = 7) => {
        const recentRecords = get().getRecentRecords(days)
        return recentRecords.reduce(
          (total, record) => total + record.caloriesBurned,
          0
        )
      },

      getWorkoutStreak: () => {
        const { records } = get()
        if (records.length === 0) return 0

        const sortedDates = [
          ...new Set(
            records.map((r) => r.date.split("T")[0])
          ),
        ].sort((a, b) => b.localeCompare(a))

        let streak = 0
        const today = new Date().toISOString().split("T")[0]

        for (let i = 0; i < sortedDates.length; i++) {
          const expectedDate = new Date(today)
          expectedDate.setDate(expectedDate.getDate() - i)
          const expected = expectedDate.toISOString().split("T")[0]

          if (sortedDates[i] === expected) {
            streak++
          } else {
            break
          }
        }

        return streak
      },
    }),
    {
      name: "fitmeal-workout",
    }
  )
)
