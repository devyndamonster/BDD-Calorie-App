import { Button, Card, Form, Input, List, Selector } from 'antd-mobile'
import type { Food } from '../domain/food'
import { dailyTotal, entriesForDate, type LogEntry } from '../domain/log'

type Props = {
  foods: Food[]
  entries: LogEntry[]
  date: string
  selectedFoodId: string
  onDateChange: (date: string) => void
  onSelectFood: (foodId: string) => void
  onLog: (foodId: string) => void
  onRemove: (entryId: string) => void
}

export default function DailyLogSection({
  foods,
  entries,
  date,
  selectedFoodId,
  onDateChange,
  onSelectFood,
  onLog,
  onRemove,
}: Props) {
  const dayEntries = entriesForDate(entries, date)
  const foodId = foods.some((f) => f.id === selectedFoodId) ? selectedFoodId : (foods[0]?.id ?? '')

  return (
    <Card title="Daily log" className="section">
      <Form layout="vertical">
        <Form.Item label="Date">
          <Input aria-label="Date" type="date" value={date} onChange={(value) => value && onDateChange(value)} />
        </Form.Item>
        <Form.Item label="Food to log">
          <Selector
            aria-label="Food to log"
            options={foods.map((food) => ({ label: food.name, value: food.id }))}
            value={foodId ? [foodId] : []}
            onChange={(values) => values[0] && onSelectFood(values[0])}
          />
        </Form.Item>
      </Form>
      <Button block color="primary" size="large" disabled={foods.length === 0} onClick={() => onLog(foodId)}>
        Log food
      </Button>
      <List data-testid="log-list">
        {dayEntries.map((entry) => {
          const food = foods.find((f) => f.id === entry.foodId)
          return (
            <List.Item
              key={entry.id}
              data-testid="log-item"
              extra={
                <Button size="mini" color="danger" fill="outline" onClick={() => onRemove(entry.id)}>
                  Remove
                </Button>
              }
            >
              {food?.name ?? 'Unknown food'}
            </List.Item>
          )
        })}
      </List>
      <div className="total">Total: {dailyTotal(entries, foods, date)} kcal</div>
    </Card>
  )
}
