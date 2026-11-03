import { describe, expect, it } from 'vitest'
import type { Food } from './food'
import { createLogEntry, dailyTotal, entriesByMeal, entriesForDate, findFoods, quickSelectFoods, todayIso } from './log'

describe('quick select', () => {
  const foods: Food[] = ['A', 'B', 'C', 'D', 'E'].map((n) => ({ id: n, name: n, calories: 1 }))
  const log = (...ids: string[]) => ids.map((id) => createLogEntry(id, '2026-11-01', 'Snack'))

  it('shows the three most recently logged distinct foods', () => {
    expect(quickSelectFoods(log('A', 'B', 'C', 'D', 'A'), foods).map((f) => f.id)).toEqual(['A', 'D', 'C'])
  })

  it('fills remaining slots with the newest unlogged foods', () => {
    expect(quickSelectFoods(log('B'), foods).map((f) => f.id)).toEqual(['B', 'E', 'D'])
  })

  it('ignores entries for deleted foods', () => {
    expect(quickSelectFoods(log('Z'), foods).map((f) => f.id)).toEqual(['E', 'D', 'C'])
  })

  it('finds foods by case-insensitive partial name', () => {
    const named = [{ id: '1', name: 'Green Apple', calories: 1 }, { id: '2', name: 'Banana', calories: 1 }]
    expect(findFoods(named, ' apple ').map((f) => f.id)).toEqual(['1'])
    expect(findFoods(named, '')).toEqual([])
  })
})

const apple: Food = { id: 'a', name: 'Apple', calories: 95 }
const banana: Food = { id: 'b', name: 'Banana', calories: 105 }

describe('daily log', () => {
  const entries = [
    createLogEntry('a', '2026-11-01', 'Breakfast'),
    createLogEntry('b', '2026-11-01', 'Snack'),
    createLogEntry('a', '2026-11-01', 'Breakfast'),
    createLogEntry('b', '2026-11-02', 'Dinner'),
  ]

  it('returns only the entries for a date', () => {
    expect(entriesForDate(entries, '2026-11-02')).toHaveLength(1)
    expect(entriesForDate(entries, '2026-12-25')).toHaveLength(0)
  })

  it('sums calories, counting repeated foods each time', () => {
    expect(dailyTotal(entries, [apple, banana], '2026-11-01')).toBe(295)
  })

  it('ignores entries whose food no longer exists', () => {
    expect(dailyTotal(entries, [apple], '2026-11-02')).toBe(0)
  })
})

describe('entriesByMeal', () => {
  it('groups a day entries by meal in meal order, skipping empty meals', () => {
    const entries = [
      createLogEntry('b', '2026-11-01', 'Snack'),
      createLogEntry('a', '2026-11-01', 'Breakfast'),
      createLogEntry('a', '2026-11-01', 'Snack'),
      createLogEntry('a', '2026-11-02', 'Lunch'),
    ]
    const groups = entriesByMeal(entries, '2026-11-01')
    expect(groups.map((g) => g.meal)).toEqual(['Breakfast', 'Snack'])
    expect(groups[1].entries).toHaveLength(2)
  })
})

describe('todayIso', () => {
  it('formats the local date as YYYY-MM-DD', () => {
    expect(todayIso(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})


