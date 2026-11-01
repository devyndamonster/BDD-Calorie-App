import { Button, Card, Form, Input, List } from 'antd-mobile'
import { useMemo, useState } from 'react'
import type { FoodSuggestion } from '../data/cleanFood'
import { portionFor, searchFoods } from '../data/searchFoods'
import { useFoodIndex } from '../data/useFoodIndex'
import { validateCalories, validateName, type Food } from '../domain/food'

type Props = {
  foods: Food[]
  onAdd: (name: string, calories: number) => void
}

type FormValues = { name?: string; calories?: string }

const toCalories = (value?: string) => (value === undefined || value.trim() === '' ? NaN : Number(value))

const rule = (error: string | null) => (error ? Promise.reject(new Error(error)) : Promise.resolve())

export default function FoodSection({ foods, onAdd }: Props) {
  const [form] = Form.useForm<FormValues>()
  const index = useFoodIndex()
  const [nameValue, setNameValue] = useState('')
  const [dismissed, setDismissed] = useState(false)
  const suggestions = useMemo(
    () => (dismissed ? [] : searchFoods(index, nameValue)),
    [index, nameValue, dismissed],
  )

  function pickSuggestion(suggestion: FoodSuggestion) {
    form.setFieldsValue({ name: suggestion.name, calories: String(portionFor(suggestion).calories) })
    setNameValue(suggestion.name)
    setDismissed(true)
  }

  function handleFinish(values: FormValues) {
    onAdd(values.name ?? '', toCalories(values.calories))
    form.resetFields()
  }

  return (
    <Card title="Foods" className="section">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        footer={
          <Button block type="submit" color="primary" size="large">
            Add food
          </Button>
        }
      >
        <Form.Item
          name="name"
          label="Food name"
          rules={[{ validator: (_, value?: string) => rule(validateName(value ?? '')) }]}
        >
          <Input placeholder="e.g. Apple" clearable onChange={(value) => { setNameValue(value); setDismissed(false) }} />
        </Form.Item>
        {suggestions.length > 0 && (
          <List data-testid="suggestions">
            {suggestions.map((suggestion) => {
              const portion = portionFor(suggestion)
              return (
                <List.Item
                  key={suggestion.id}
                  data-testid="suggestion"
                  description={`${portion.label} · ${portion.calories} kcal`}
                  onClick={() => pickSuggestion(suggestion)}
                >
                  {suggestion.name}
                </List.Item>
              )
            })}
          </List>
        )}
        <Form.Item
          name="calories"
          label="Calories"
          rules={[{ validator: (_, value?: string) => rule(validateCalories(toCalories(value))) }]}
        >
          <Input type="number" inputMode="numeric" placeholder="kcal" />
        </Form.Item>
      </Form>
      <List data-testid="food-list">
        {foods.map((food) => (
          <List.Item key={food.id} data-testid="food-item" extra={`${food.calories} kcal`}>
            {food.name}
          </List.Item>
        ))}
      </List>
    </Card>
  )
}

