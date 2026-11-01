import { Card } from 'antd-mobile'
import { budgetSummary } from '../domain/budget'

type Props = {
  consumed: number
  budget: number | null
}

export default function BudgetSummary({ consumed, budget }: Props) {
  return (
    <Card className="section">
      <div className="budget-summary" data-testid="budget-summary">
        {budgetSummary(consumed, budget)}
      </div>
    </Card>
  )
}
