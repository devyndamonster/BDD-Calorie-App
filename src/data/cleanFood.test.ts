import { describe, expect, it } from 'vitest'
import { buildSuggestions, cleanName, kcalPer100g, pickServing, type RawFood } from './cleanFood'

const food = (overrides: Partial<RawFood> = {}): RawFood => ({
  fdcId: 1,
  description: 'Bananas, raw',
  foodCategory: { description: 'Fruits and Fruit Juices' },
  foodNutrients: [{ amount: 89.4, nutrient: { number: '208', name: 'Energy', unitName: 'kcal' } }],
  foodPortions: [],
  ...overrides,
})

describe('cleanName', () => {
  it('removes parenthetical notes and tidies whitespace', () => {
    expect(cleanName("Apples, raw, fuji, with skin (Includes foods for USDA's Food Distribution Program)")).toBe(
      'Apples, raw, fuji, with skin',
    )
  })
})

describe('kcalPer100g', () => {
  it('reads the kcal energy nutrient and rounds it', () => {
    expect(kcalPer100g(food())).toBe(89)
  })

  it('ignores kJ energy and returns null when kcal is missing', () => {
    const kj = [{ amount: 374, nutrient: { number: '268', name: 'Energy', unitName: 'kJ' } }]
    expect(kcalPer100g(food({ foodNutrients: kj }))).toBeNull()
  })
})

describe('pickServing', () => {
  const portions = [
    { amount: 1, modifier: 'cup, mashed', gramWeight: 225, sequenceNumber: 1 },
    { amount: 1, modifier: 'medium (7" to 7-7/8" long)', gramWeight: 118, sequenceNumber: 5 },
    { amount: 1, modifier: 'NLEA serving', gramWeight: 126, sequenceNumber: 8 },
  ]

  it('prefers the NLEA serving, then medium', () => {
    expect(pickServing(food({ foodPortions: portions }), 89)).toEqual({ label: '1 serving', grams: 126, calories: 112 })
    expect(pickServing(food({ foodPortions: portions.slice(0, 2) }), 89)).toEqual({
      label: '1 medium',
      grams: 118,
      calories: 105,
    })
  })

  it('returns undefined without usable portions', () => {
    expect(pickServing(food(), 89)).toBeUndefined()
  })
})

describe('buildSuggestions', () => {
  it('drops excluded categories and foods without kcal', () => {
    const result = buildSuggestions([
      food({ fdcId: 1 }),
      food({ fdcId: 2, foodCategory: { description: 'Baby Foods' } }),
      food({ fdcId: 3, description: 'No energy', foodNutrients: [] }),
    ])
    expect(result.map((r) => r.id)).toEqual([1])
  })

  it('dedupes by name and sorts alphabetically', () => {
    const result = buildSuggestions([
      food({ fdcId: 1, description: 'Zucchini' }),
      food({ fdcId: 2, description: 'Apples (a)' }),
      food({ fdcId: 3, description: 'Apples (b)' }),
    ])
    expect(result.map((r) => r.name)).toEqual(['Apples', 'Zucchini'])
  })
})
