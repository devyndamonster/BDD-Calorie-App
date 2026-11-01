import { NavBar } from 'antd-mobile'
import { useState } from 'react'
import { budgetForDate, setBudget, type DailyBudget } from './domain/budget'
import { createFood, type Food } from './domain/food'
import { createLogEntry, dailyTotal, todayIso, type LogEntry } from './domain/log'
import { loadBudgets, saveBudgets } from './storage/budgetRepository'
import { loadFoods, saveFoods } from './storage/foodRepository'
import { loadEntries, saveEntries } from './storage/logRepository'
import BudgetSection from './ui/BudgetSection'
import DailyLogSection from './ui/DailyLogSection'
import FoodSection from './ui/FoodSection'

export default function App() {
  const [foods, setFoods] = useState<Food[]>(loadFoods)
  const [entries, setEntries] = useState<LogEntry[]>(loadEntries)
  const [budgets, setBudgets] = useState<DailyBudget[]>(loadBudgets)
  const [date, setDate] = useState(() => todayIso())
  const [selectedFoodId, setSelectedFoodId] = useState('')

  function updateBudget(calories: number) {
    const next = setBudget(budgets, date, calories)
    setBudgets(next)
    saveBudgets(next)
  }

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
      <BudgetSection
        consumed={dailyTotal(entries, foods, date)}
        budget={budgetForDate(budgets, date)}
        onSetBudget={updateBudget}
      />
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
