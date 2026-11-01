import type { Food } from './food'

export type LogEntry = {
  id: string
  foodId: string
  date: string
}

export function todayIso(now: Date = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function createLogEntry(foodId: string, date: string): LogEntry {
  return { id: crypto.randomUUID(), foodId, date }
}

export function entriesForDate(entries: LogEntry[], date: string): LogEntry[] {
  return entries.filter((entry) => entry.date === date)
}

export function dailyTotal(entries: LogEntry[], foods: Food[], date: string): number {
  return entriesForDate(entries, date).reduce((sum, entry) => {
    const food = foods.find((f) => f.id === entry.foodId)
    return sum + (food?.calories ?? 0)
  }, 0)
}
