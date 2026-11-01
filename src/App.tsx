import { NavBar } from 'antd-mobile'
import { useState } from 'react'
import { createFood, type Food } from './domain/food'
import { createLogEntry, todayIso, type LogEntry } from './domain/log'
import { loadFoods, saveFoods } from './storage/foodRepository'
import { loadEntries, saveEntries } from './storage/logRepository'
import DailyLogSection from './ui/DailyLogSection'
import FoodSection from './ui/FoodSection'

export default function App() {
  const [foods, setFoods] = useState<Food[]>(loadFoods)
  const [entries, setEntries] = useState<LogEntry[]>(loadEntries)
  const [date, setDate] = useState(() => todayIso())
  const [selectedFoodId, setSelectedFoodId] = useState('')

  function addFood(name: string, calories: number) {
    const next = [...foods, createFood(name, calories)]
    setFoods(next)
    saveFoods(next)
  }

  function updateEntries(next: LogEntry[]) {
    setEntries(next)
    saveEntries(next)
  }

  return (
    <main>
      <NavBar back={null}>
        <h1 className="page-title">Calorie Tracker</h1>
      </NavBar>
      <DailyLogSection
        foods={foods}
        entries={entries}
        date={date}
        selectedFoodId={selectedFoodId}
        onDateChange={setDate}
        onSelectFood={setSelectedFoodId}
        onLog={(foodId) => updateEntries([...entries, createLogEntry(foodId, date)])}
        onRemove={(entryId) => updateEntries(entries.filter((e) => e.id !== entryId))}
      />
      <FoodSection foods={foods} onAdd={addFood} />
    </main>
  )
}
