import type { DailyBudget } from '../domain/budget'

const KEY = 'budgets'

export function loadBudgets(): DailyBudget[] {
  const raw = localStorage.getItem(KEY)
  return raw ? (JSON.parse(raw) as DailyBudget[]) : []
}

export function saveBudgets(budgets: DailyBudget[]): void {
  localStorage.setItem(KEY, JSON.stringify(budgets))
}
