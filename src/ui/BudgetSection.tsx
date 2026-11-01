import { Button, Card, Form, Input } from 'antd-mobile'
import { validateBudget } from '../domain/budget'

type Props = {
  date: string
  onSetBudget: (calories: number) => void
}

type FormValues = { budget?: string }

const toCalories = (value?: string) => (value === undefined || value.trim() === '' ? NaN : Number(value))

export default function BudgetSection({ date, onSetBudget }: Props) {
  const [form] = Form.useForm<FormValues>()

  return (
    <Card title="Daily budget" className="section" data-testid="budget-form">
      <div className="budget-date">Budget for {date}</div>
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

