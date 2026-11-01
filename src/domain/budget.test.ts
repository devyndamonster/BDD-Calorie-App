import { describe, expect, it } from 'vitest'
import { budgetForDate, budgetSummary, setBudget, validateBudget } from './budget'

describe('validateBudget', () => {
  it('accepts positive numbers', () => {
    expect(validateBudget(2050)).toBeNull()
  })

  it('rejects zero, negative and non-numeric budgets', () => {
    expect(validateBudget(0)).toBe('Budget must be greater than zero')
    expect(validateBudget(-1)).toBe('Budget must be greater than zero')
    expect(validateBudget(NaN)).toBe('Budget must be greater than zero')
  })
})

describe('setBudget', () => {
  it('replaces the budget for the same date only', () => {
    const budgets = setBudget(setBudget([], '2026-11-01', 2000), '2026-11-02', 1800)
    const updated = setBudget(budgets, '2026-11-01', 2050)
    expect(budgetForDate(updated, '2026-11-01')).toBe(2050)
    expect(budgetForDate(updated, '2026-11-02')).toBe(1800)
  })

  it('throws for an invalid budget', () => {
    expect(() => setBudget([], '2026-11-01', 0)).toThrow('Budget must be greater than zero')
  })
})

describe('budgetForDate', () => {
  it('is null when no budget is set', () => {
    expect(budgetForDate([], '2026-11-01')).toBeNull()
  })

  it('carries the latest earlier budget forward to later days', () => {
    const budgets = [
      { date: '2026-11-03', calories: 1800 },
      { date: '2026-11-01', calories: 2050 },
    ]
    expect(budgetForDate(budgets, '2026-11-01')).toBe(2050)
    expect(budgetForDate(budgets, '2026-11-02')).toBe(2050)
    expect(budgetForDate(budgets, '2026-12-01')).toBe(1800)
  })

  it('is null for days before the first budget', () => {
    expect(budgetForDate([{ date: '2026-11-02', calories: 2050 }], '2026-11-01')).toBeNull()
  })
})

describe('budgetSummary', () => {
  it('shows consumed over budget, or just consumed without a budget', () => {
    expect(budgetSummary(800, 2050)).toBe('800/2050 Cal')
    expect(budgetSummary(800, null)).toBe('800 Cal')
  })
})
