export type RawPortion = {
  amount?: number
  modifier?: string
  gramWeight?: number
  sequenceNumber?: number
  measureUnit?: { name?: string }
}

export type RawFood = {
  fdcId: number
  description: string
  foodCategory?: { description?: string }
  foodNutrients?: { amount?: number; nutrient?: { number?: string; name?: string; unitName?: string } }[]
  foodPortions?: RawPortion[]
}

export type FoodSuggestion = {
  id: number
  name: string
  caloriesPer100g: number
  serving?: { label: string; grams: number; calories: number }
}

const EXCLUDED_CATEGORIES = new Set(['Baby Foods', 'American Indian/Alaska Native Foods'])

const stripParentheticals = (text: string) =>
  text
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[\s,]+$/, '')
    .trim()

export function cleanName(description: string): string {
  return stripParentheticals(description)
}

export function kcalPer100g(food: RawFood): number | null {
  const energy = food.foodNutrients?.find(
    (n) => n.nutrient?.number === '208' || (n.nutrient?.name === 'Energy' && n.nutrient?.unitName === 'kcal'),
  )
  return typeof energy?.amount === 'number' ? Math.round(energy.amount) : null
}

function portionRank(portion: RawPortion): number {
  const modifier = portion.modifier?.toLowerCase() ?? ''
  if (modifier.includes('nlea serving')) return 0
  if (modifier.startsWith('medium')) return 1
  return 2
}

export function pickServing(food: RawFood, caloriesPer100g: number): FoodSuggestion['serving'] {
  const portion = (food.foodPortions ?? [])
    .filter((p) => (p.gramWeight ?? 0) > 0)
    .sort((a, b) => portionRank(a) - portionRank(b) || (a.sequenceNumber ?? 0) - (b.sequenceNumber ?? 0))[0]
  if (!portion) return undefined

  const unit = portion.measureUnit?.name
  const modifier = stripParentheticals(portion.modifier ?? '').replace(/^nlea serving$/i, 'serving')
  const label = [portion.amount ?? 1, unit && unit !== 'undetermined' ? unit : '', modifier]
    .filter((part) => part !== '')
    .join(' ')
  const grams = portion.gramWeight as number
  return { label, grams, calories: Math.round((caloriesPer100g * grams) / 100) }
}

export function toSuggestion(food: RawFood): FoodSuggestion | null {
  if (EXCLUDED_CATEGORIES.has(food.foodCategory?.description ?? '')) return null
  const caloriesPer100g = kcalPer100g(food)
  if (caloriesPer100g === null) return null
  const name = cleanName(food.description)
  if (name === '') return null
  const serving = pickServing(food, caloriesPer100g)
  return { id: food.fdcId, name, caloriesPer100g, ...(serving && { serving }) }
}

export function buildSuggestions(foods: RawFood[]): FoodSuggestion[] {
  const byName = new Map<string, FoodSuggestion>()
  for (const food of foods) {
    const suggestion = toSuggestion(food)
    if (!suggestion) continue
    const key = suggestion.name.toLowerCase()
    const existing = byName.get(key)
    if (!existing || (!existing.serving && suggestion.serving)) byName.set(key, suggestion)
  }
  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name))
}
