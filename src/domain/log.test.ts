import { describe, expect, it } from 'vitest'
import type { Food } from './food'
import { createLogEntry, dailyTotal, entriesForDate, todayIso } from './log'

const apple: Food = { id: 'a', name: 'Apple', calories: 95 }
const banana: Food = { id: 'b', name: 'Banana', calories: 105 }

describe('daily log', () => {
  const entries = [
    createLogEntry('a', '2026-11-01'),
    createLogEntry('b', '2026-11-01'),
    createLogEntry('a', '2026-11-01'),
    createLogEntry('b', '2026-11-02'),
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

describe('todayIso', () => {
  it('formats the local date as YYYY-MM-DD', () => {
    expect(todayIso(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})
