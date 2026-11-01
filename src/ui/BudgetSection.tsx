import { Button, Card, Form, Input } from 'antd-mobile'
import { budgetSummary, validateBudget } from '../domain/budget'

type Props = {
  consumed: number
  budget: number | null
  onSetBudget: (calories: number) => void
}

type FormValues = { budget?: string }

const toCalories = (value?: string) => (value === undefined || value.trim() === '' ? NaN : Number(value))

export default function BudgetSection({ consumed, budget, onSetBudget }: Props) {
  const [form] = Form.useForm<FormValues>()

  return (
    <Card className="section">
      <div className="budget-summary" data-testid="budget-summary">
        {budgetSummary(consumed, budget)}
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onSetBudget(toCalories(values.budget))
          form.resetFields()
        }}
        footer={
          <Button block type="submit" color="primary" fill="outline">
            Set budget
          </Button>
        }
      >
        <Form.Item
          name="budget"
          label="Daily budget"
          rules={[
            {
              validator: (_, value?: string) => {
                const error = validateBudget(toCalories(value))
                return error ? Promise.reject(new Error(error)) : Promise.resolve()
              },
            },
          ]}
        >
          <Input type="number" inputMode="numeric" placeholder="kcal" />
        </Form.Item>
      </Form>
    </Card>
  )
}
