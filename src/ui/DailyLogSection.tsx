import { useState } from 'react'
import type { Food } from '../domain/food'
import { dailyTotal, entriesForDate, type LogEntry } from '../domain/log'

type Props = {
  foods: Food[]
  entries: LogEntry[]
  date: string
  onDateChange: (date: string) => void
  onLog: (foodId: string) => void
  onRemove: (entryId: string) => void
}

export default function DailyLogSection({ foods, entries, date, onDateChange, onLog, onRemove }: Props) {
  const [selectedId, setSelectedId] = useState('')
  const dayEntries = entriesForDate(entries, date)
  const foodId = foods.some((f) => f.id === selectedId) ? selectedId : (foods[0]?.id ?? '')

  return (
    <section>
      <h2>Daily log</h2>
      <label>
        Date
        <input type="date" value={date} onChange={(e) => e.target.value && onDateChange(e.target.value)} />
      </label>
      <label>
        Food to log
        <select value={foodId} onChange={(e) => setSelectedId(e.target.value)}>
          {foods.map((food) => (
            <option key={food.id} value={food.id}>
              {food.name}
            </option>
          ))}
        </select>
      </label>
      <button type="button" disabled={foods.length === 0} onClick={() => onLog(foodId)}>
        Log food
      </button>
      <ul aria-label="Daily log">
        {dayEntries.map((entry) => {
          const food = foods.find((f) => f.id === entry.foodId)
          return (
            <li key={entry.id}>
              {food?.name ?? 'Unknown food'}
              <button type="button" onClick={() => onRemove(entry.id)}>
                Remove
              </button>
            </li>
          )
        })}
      </ul>
      <p>Total: {dailyTotal(entries, foods, date)} kcal</p>
    </section>
  )
}
