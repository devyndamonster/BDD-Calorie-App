export type Food = {
  id: string
  name: string
  calories: number
}

export function validateFood(name: string, calories: number): string | null {
  if (name.trim() === '') return 'Name is required'
  if (!Number.isFinite(calories) || calories < 0) return 'Calories must be zero or more'
  return null
}

export function createFood(name: string, calories: number): Food {
  const error = validateFood(name, calories)
  if (error) throw new Error(error)
  return { id: crypto.randomUUID(), name: name.trim(), calories }
}
