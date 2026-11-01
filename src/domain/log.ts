import type { Food } from './food'

export const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const

export type Meal = (typeof MEALS)[number]

export type LogEntry = {
  id: string
  foodId: string
  date: string
  meal: Meal
}

export function todayIso(now: Date = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function createLogEntry(foodId: string, date: string, meal: Meal): LogEntry {
  return { id: crypto.randomUUID(), foodId, date, meal }
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

export function entriesByMeal(entries: LogEntry[], date: string): { meal: Meal; entries: LogEntry[] }[] {
  const dayEntries = entriesForDate(entries, date)
  return MEALS.map((meal) => ({ meal, entries: dayEntries.filter((entry) => entry.meal === meal) })).filter(
    (group) => group.entries.length > 0,
  )
}

