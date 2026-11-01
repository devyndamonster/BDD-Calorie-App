import type { FoodSuggestion } from './cleanFood'

export const MIN_QUERY_LENGTH = 2

export function portionFor(suggestion: FoodSuggestion): { label: string; calories: number } {
  return suggestion.serving
    ? { label: suggestion.serving.label, calories: suggestion.serving.calories }
    : { label: '100 g', calories: suggestion.caloriesPer100g }
}

export function searchFoods(foods: FoodSuggestion[], query: string, limit = 8): FoodSuggestion[] {
  const normalized = query.trim().toLowerCase()
  if (normalized.length < MIN_QUERY_LENGTH) return []
  const tokens = normalized.split(/[^a-z0-9]+/).filter(Boolean)
  if (tokens.length === 0) return []

  const ranked: { food: FoodSuggestion; rank: number }[] = []
  for (const food of foods) {
    const name = food.name.toLowerCase()
    if (!tokens.every((token) => name.includes(token))) continue
    const words = name.split(/[^a-z0-9]+/)
    const rank = name.startsWith(normalized) ? 0 : words.some((w) => w.startsWith(tokens[0])) ? 1 : 2
    ranked.push({ food, rank })
  }

  return ranked
    .sort((a, b) => a.rank - b.rank || a.food.name.length - b.food.name.length || a.food.name.localeCompare(b.food.name))
    .slice(0, limit)
    .map((entry) => entry.food)
}
