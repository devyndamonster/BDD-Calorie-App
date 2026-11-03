import { Button, Card, Form, Input, List, Selector, SwipeAction } from 'antd-mobile'
import { useCallback, useState } from 'react'
import LogToast from './LogToast'
import type { Food } from '../domain/food'
import { MEALS, dailyTotal, entriesByMeal, findFoods, quickSelectFoods, type LogEntry, type Meal } from '../domain/log'

type Props = {
  foods: Food[]
  entries: LogEntry[]
  date: string
  selectedFoodId: string
  onDateChange: (date: string) => void
  onSelectFood: (foodId: string) => void
  onLog: (foodId: string, meal: Meal) => void
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
  const groups = entriesByMeal(entries, date)
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null)
  const dismissToast = useCallback(() => setToast(null), [])
  const quick = quickSelectFoods(entries, foods)
  const [search, setSearch] = useState('')
  const matches = findFoods(foods, search)
  const foodId = foods.some((f) => f.id === selectedFoodId) ? selectedFoodId : (quick[0]?.id ?? '')
  const selected = foods.find((f) => f.id === foodId)
  const options = selected && !quick.includes(selected) ? [...quick, selected] : quick

  return (
    <Card title="Daily log" className="section">
      {toast && <LogToast id={toast.id} message={toast.message} onDone={dismissToast} />}
      <Form layout="vertical">
        <Form.Item label="Date">
          <Input aria-label="Date" type="date" value={date} onChange={(value) => value && onDateChange(value)} />
        </Form.Item>
        <Form.Item label="Food to log">
          <Selector
            aria-label="Food to log"
            options={options.map((food) => ({ label: food.name, value: food.id }))}
            value={foodId ? [foodId] : []}
            onChange={(values) => values[0] && onSelectFood(values[0])}
          />
        </Form.Item>
        <Form.Item label="Find a food">
          <Input aria-label="Find a food" placeholder="Search your foods" value={search} onChange={setSearch} clearable />
          {matches.length > 0 && (
            <List data-testid="food-matches">
              {matches.map((food) => (
                <List.Item
                  key={food.id}
                  data-testid="food-match"
                  onClick={() => {
                    onSelectFood(food.id)
                    setSearch('')
                  }}
                >
                  {food.name}
                </List.Item>
              ))}
            </List>
          )}
        </Form.Item>
      </Form>
      <div className="meal-buttons">
        {MEALS.map((meal) => (
          <Button
            key={meal}
            color="primary"
            size="small"
            disabled={foods.length === 0}
            onClick={() => {
              onLog(foodId, meal)
              const name = foods.find((f) => f.id === foodId)?.name
              setToast({ id: Date.now(), message: `Logged ${name} to ${meal}` })
            }}
          >
            {meal}
          </Button>
        ))}
      </div>
      <div data-testid="log-summary">
        {groups.map((group) => (
          <div key={group.meal} data-testid={`meal-${group.meal}`}>
            <div className="meal-title">{group.meal}</div>
            <List data-testid="log-list">
              {group.entries.map((entry) => {
                const food = foods.find((f) => f.id === entry.foodId)
                return (
                  <SwipeAction
                    key={entry.id}
                    rightActions={[
                      { key: 'remove', text: 'Remove', color: 'danger', onClick: () => onRemove(entry.id) },
                    ]}
                  >
                    <List.Item data-testid="log-item">{food?.name ?? 'Unknown food'}</List.Item>
                  </SwipeAction>
                )
              })}
            </List>
          </div>
        ))}
        <div className="total">Total: {dailyTotal(entries, foods, date)} kcal</div>
      </div>
    </Card>
  )
}

