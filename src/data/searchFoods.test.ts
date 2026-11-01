import { describe, expect, it } from 'vitest'
import type { FoodSuggestion } from './cleanFood'
import { portionFor, searchFoods } from './searchFoods'

const food = (id: number, name: string, serving?: FoodSuggestion['serving']): FoodSuggestion => ({
  id,
  name,
  caloriesPer100g: 100,
  serving,
})

const foods = [
  food(1, 'Bananas, dehydrated, or banana powder'),
  food(2, 'Bananas, raw'),
  food(3, 'Plantains, raw'),
  food(4, 'Apple pie with banana'),
  food(5, 'Apples, raw, fuji, with skin'),
]

describe('searchFoods', () => {
  it('returns nothing for queries shorter than two characters', () => {
    expect(searchFoods(foods, 'b')).toEqual([])
    expect(searchFoods(foods, '  ')).toEqual([])
  })

  it('ranks names starting with the query first, then shorter names', () => {
    expect(searchFoods(foods, 'banana').map((f) => f.id)).toEqual([2, 1, 4])
  })

  it('matches every word of the query in any order, ignoring case', () => {
    expect(searchFoods(foods, 'RAW apples').map((f) => f.id)).toEqual([5])
  })

  it('limits the number of results', () => {
    expect(searchFoods(foods, 'raw', 1)).toHaveLength(1)
  })
})

describe('portionFor', () => {
  it('uses the serving when available, otherwise 100 g', () => {
    expect(portionFor(food(1, 'A', { label: '1 medium', grams: 118, calories: 105 }))).toEqual({
      label: '1 medium',
      calories: 105,
    })
    expect(portionFor(food(2, 'B'))).toEqual({ label: '100 g', calories: 100 })
  })
})
