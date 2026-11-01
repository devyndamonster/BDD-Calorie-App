export type DailyBudget = {
  date: string
  calories: number
}

export function validateBudget(calories: number): string | null {
  return Number.isFinite(calories) && calories > 0 ? null : 'Budget must be greater than zero'
}

export function budgetForDate(budgets: DailyBudget[], date: string): number | null {
  const applicable = budgets.filter((budget) => budget.date <= date)
  if (applicable.length === 0) return null
  return applicable.reduce((latest, budget) => (budget.date > latest.date ? budget : latest)).calories
}

export function setBudget(budgets: DailyBudget[], date: string, calories: number): DailyBudget[] {
  const error = validateBudget(calories)
  if (error) throw new Error(error)
  return [...budgets.filter((budget) => budget.date !== date), { date, calories }]
}

export function budgetSummary(consumed: number, budget: number | null): string {
  return budget === null ? `${consumed} Cal` : `${consumed}/${budget} Cal`
}
