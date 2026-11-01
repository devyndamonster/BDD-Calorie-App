export type Food = {
  id: string
  name: string
  calories: number
}

export function validateName(name: string): string | null {
  return name.trim() === '' ? 'Name is required' : null
}

export function validateCalories(calories: number): string | null {
  return Number.isFinite(calories) && calories >= 0 ? null : 'Calories must be zero or more'
}

export function validateFood(name: string, calories: number): string | null {
  return validateName(name) ?? validateCalories(calories)
}

export function createFood(name: string, calories: number): Food {
  const error = validateFood(name, calories)
  if (error) throw new Error(error)
  return { id: crypto.randomUUID(), name: name.trim(), calories }
}
