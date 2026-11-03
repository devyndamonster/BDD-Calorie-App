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

export const QUICK_SELECT_LIMIT = 3

// Entries are stored oldest first, so the most recently logged foods come from the end.
// Foods that were never logged fill any remaining slots, newest first.
export function quickSelectFoods(entries: LogEntry[], foods: Food[], limit = QUICK_SELECT_LIMIT): Food[] {
  const result: Food[] = []
  const add = (food: Food | undefined) => {
    if (food && result.length < limit && !result.includes(food)) result.push(food)
  }
  for (let i = entries.length - 1; i >= 0; i--) add(foods.find((f) => f.id === entries[i].foodId))
  for (let i = foods.length - 1; i >= 0; i--) add(foods[i])
  return result
}

export function findFoods(foods: Food[], query: string): Food[] {
  const text = query.trim().toLowerCase()
  if (!text) return []
  return foods.filter((food) => food.name.toLowerCase().includes(text))
}

export function entriesByMeal(entries: LogEntry[], date: string): { meal: Meal; entries: LogEntry[] }[] {
  const dayEntries = entriesForDate(entries, date)
  return MEALS.map((meal) => ({ meal, entries: dayEntries.filter((entry) => entry.meal === meal) })).filter(
    (group) => group.entries.length > 0,
  )
}

