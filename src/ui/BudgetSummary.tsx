import { budgetSummary } from '../domain/budget'

type Props = {
  consumed: number
  budget: number | null
}

export default function BudgetSummary({ consumed, budget }: Props) {
  return (
    <header className="app-header">
      <div className="budget-summary" data-testid="budget-summary">
        {budgetSummary(consumed, budget)}
      </div>
    </header>
  )
}
